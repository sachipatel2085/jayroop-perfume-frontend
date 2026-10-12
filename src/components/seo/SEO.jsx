import React, { useEffect } from 'react';
import { SITE_URL, DEFAULT_SEO, BRAND } from '../../config/site.js';

const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!content) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setLink = (rel, href, extra = {}) => {
  const selector = `link[rel="${rel}"]${extra.hreflang ? `[hreflang="${extra.hreflang}"]` : ''}`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const clean = (s = '', max = 300) =>
  String(s)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

/**
 * Client-side SEO manager – keeps <title>, description, robots, canonical, hreflang,
 * Open Graph, Twitter and product/article meta in sync on every route change.
 * The server (or build-time prerender) emits the same tags for crawlers that do not run JS.
 */
export const SEO = ({
  title,
  description = DEFAULT_SEO.description,
  keywords = DEFAULT_SEO.keywords,
  canonicalUrl,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  searchIndexing = 'INDEX_FOLLOW',
  product,
  article,
  children,
}) => {
  useEffect(() => {
    const fullTitle = title ? (/jayrup/i.test(title) ? title : `${title} | ${BRAND.name}`) : DEFAULT_SEO.title;
    document.title = fullTitle;
    const desc = clean(description, 300);

    setMeta('name', 'description', desc);
    setMeta('name', 'keywords', keywords);
    setMeta(
      'name',
      'robots',
      searchIndexing === 'NOINDEX_NOFOLLOW' ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    let canonical = canonicalUrl;
    if (!canonical) canonical = `${SITE_URL}${window.location.pathname.replace(/\/+$/, '') || '/'}`;
    else if (!/^https?:\/\//.test(canonical)) canonical = `${SITE_URL}${canonical.startsWith('/') ? '' : '/'}${canonical}`;
    setLink('canonical', canonical);
    setLink('alternate', canonical, { hreflang: 'en-IN' });
    setLink('alternate', canonical, { hreflang: 'x-default' });

    const image = ogImage ? (/^https?:\/\//.test(ogImage) ? ogImage : `${SITE_URL}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`) : DEFAULT_IMAGE;
    setMeta('property', 'og:site_name', BRAND.name);
    setMeta('property', 'og:locale', 'en_IN');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:image:alt', fullTitle);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', image);

    setMeta('property', 'product:price:amount', product?.price ? String(product.price) : '');
    setMeta('property', 'product:price:currency', product?.price ? 'INR' : '');
    setMeta('property', 'product:availability', product ? (product.inStock ? 'in stock' : 'out of stock') : '');
    setMeta('property', 'product:brand', product?.brand || '');
    setMeta('property', 'product:condition', product ? 'new' : '');
    setMeta('property', 'article:published_time', article?.published ? new Date(article.published).toISOString() : '');
    setMeta('property', 'article:modified_time', article?.modified ? new Date(article.modified).toISOString() : '');
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, searchIndexing, product, article]);

  return <>{children}</>;
};

export default SEO;
