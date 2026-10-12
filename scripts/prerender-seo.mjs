#!/usr/bin/env node
/**
 * Build-time SEO prerender for static hosting (Hostinger / Apache).
 *
 * Run automatically by `npm run build` after `vite build`.
 *  1. Asks the live API for every indexable route (/api/v1/seo/routes)
 *  2. For each route fetches the server-built <head> (title, meta, canonical, OG, JSON-LD)
 *     and a crawler-readable <noscript> body (/api/v1/seo/render?path=…)
 *  3. Writes dist/<route>.html  (e.g. dist/products/<slug>.html)
 *     – .htaccess serves these files first, so Google gets full HTML without running JS.
 *  4. Downloads sitemap.xml, robots.txt and google-merchant-feed.xml into dist/
 *  5. Appends admin-managed 301 redirects (Admin › SEO › Redirects) to dist/.htaccess
 *
 * If the API is unreachable the build still succeeds (the SPA works, client-side SEO still applies);
 * a warning is printed. Set PRERENDER_STRICT=1 to make it fail the build instead.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const STRICT = process.env.PRERENDER_STRICT === '1';
const CONCURRENCY = 6;

// ── env (.env.production > .env.local > .env, process.env wins) ────────────────
const readEnvFile = async (file) => {
  try {
    const txt = await fs.readFile(path.join(ROOT, file), 'utf8');
    return Object.fromEntries(
      txt
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('#') && l.includes('='))
        .map((l) => {
          const i = l.indexOf('=');
          return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')];
        })
    );
  } catch {
    return {};
  }
};
const env = {
  ...(await readEnvFile('.env')),
  ...(await readEnvFile('.env.local')),
  ...(await readEnvFile('.env.production')),
  ...process.env,
};
const API = (env.VITE_API_URL || '').replace(/\/+$/, '');

const log = (...a) => console.log('[prerender]', ...a);
const warn = (...a) => console.warn('[prerender] ⚠', ...a);

const getJson = async (url) => {
  const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
};
const getText = async (url) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
};

const noscriptBlock = (bodyHtml) =>
  bodyHtml
    ? `<noscript><div style="max-width:960px;margin:0 auto;padding:24px;font-family:sans-serif;color:#ddd">${bodyHtml}</div></noscript>`
    : '';

const fileForRoute = (route) => {
  const clean = route.split('?')[0].replace(/\/+$/, '');
  if (!clean || clean === '/') return path.join(DIST, 'index.html');
  const safe = clean
    .split('/')
    .filter(Boolean)
    .map((seg) => decodeURIComponent(seg).replace(/[^a-zA-Z0-9._-]/g, '-'))
    .join(path.sep);
  return path.join(DIST, `${safe}.html`);
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const main = async () => {
  const indexPath = path.join(DIST, 'index.html');
  let template;
  try {
    template = await fs.readFile(indexPath, 'utf8');
  } catch {
    throw new Error('dist/index.html not found – run `vite build` first.');
  }
  if (!template.includes('<!--seo:start-->')) throw new Error('dist/index.html is missing the <!--seo:start--> marker.');

  // Untouched SPA shell: used by .htaccess as fallback and by the Node SEO server as template.
  await fs.writeFile(path.join(DIST, 'app.html'), template);

  if (!API) {
    warn('VITE_API_URL is not set – skipping prerender (client-side SEO only).');
    return;
  }

  log(`API: ${API}`);
  const { data } = await getJson(`${API}/seo/routes`);
  const routes = [...new Set(data?.routes || [])];
  log(`${routes.length} routes`);

  let ok = 0;
  let failed = 0;
  const queue = [...routes];
  const worker = async () => {
    while (queue.length) {
      const route = queue.shift();
      try {
        const { data: r } = await getJson(`${API}/seo/render?path=${encodeURIComponent(route)}`);
        if (r.redirect || r.status === 404 || !r.head) continue;
        const html = template
          .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, `<!--seo:start-->\n    ${r.head}\n    <!--seo:end-->`)
          .replace('<!--seo:body-->', noscriptBlock(r.bodyHtml));
        const out = fileForRoute(route);
        await fs.mkdir(path.dirname(out), { recursive: true });
        await fs.writeFile(out, html);
        ok += 1;
      } catch (err) {
        failed += 1;
        warn(`${route}: ${err.message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  log(`wrote ${ok} pages${failed ? `, ${failed} failed` : ''}`);

  // Sitemap / robots / Merchant Center feed straight from the API (always up to date with products)
  for (const file of ['sitemap.xml', 'robots.txt', 'google-merchant-feed.xml']) {
    try {
      const body = await getText(`${API}/seo/${file}`);
      await fs.writeFile(path.join(DIST, file), body);
      log(`${file} ✓`);
    } catch (err) {
      warn(`${file}: ${err.message} (keeping fallback)`);
    }
  }

  // Admin-managed redirects → Apache 301 rules (inserted before the prerender/SPA rules)
  const redirects = Object.entries(data?.redirects || {}).filter(
    ([from, to]) => from && to && from.startsWith('/') && from !== to && !/\s/.test(from + to)
  );
  if (redirects.length) {
    const htPath = path.join(DIST, '.htaccess');
    try {
      let ht = await fs.readFile(htPath, 'utf8');
      const rules = redirects
        .map(([from, to]) => `  RewriteRule ^${escapeRegex(from.replace(/^\/+|\/+$/g, ''))}$ ${to} [L,R=301,NC]`)
        .join('\n');
      const marker = '  # 4) Serve pre-rendered SEO pages';
      ht = ht.includes(marker)
        ? ht.replace(marker, `  # 3b) Redirects managed in Admin › SEO (generated at build time)\n${rules}\n\n${marker}`)
        : ht;
      await fs.writeFile(htPath, ht);
      log(`${redirects.length} redirects added to .htaccess`);
    } catch (err) {
      warn(`.htaccess: ${err.message}`);
    }
  }
};

main().catch((err) => {
  if (STRICT) {
    console.error('[prerender] ✖', err.message);
    process.exit(1);
  }
  warn(`${err.message} – build kept without prerendered pages.`);
});
