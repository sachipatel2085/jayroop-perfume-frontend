import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Phone, MapPin, FileText, Printer } from 'lucide-react';
import { SEO } from '../seo/SEO.jsx';
import { BreadcrumbSchema } from '../seo/BreadcrumbSchema.jsx';
import { BRAND, fullAddress } from '../../config/site.js';

const RELATED = [
  ['/terms-and-conditions', 'Terms and Conditions'],
  ['/privacy-policy', 'Privacy Policy'],
  ['/shipping-policy', 'Shipping Policy'],
  ['/refund-return-policy', 'Refund & Return Policy'],
];

/**
 * Shared layout for legal / policy pages: sticky table of contents, readable typography,
 * print button, breadcrumb schema and a contact card (required by payment gateways).
 */
export const PolicyLayout = ({ title, eyebrow = 'Policies', intro, updated, path, seoTitle, seoDescription, sections = [], children }) => {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    if (!sections.length) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <div className="bg-noir min-h-screen text-zinc-100">
      <SEO title={seoTitle || title} description={seoDescription} canonicalUrl={path}>
        <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: title, url: path }]} />
      </SEO>

      <header className="border-b border-gold/15 bg-gradient-to-b from-gold/[0.06] to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-gold">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gold">{title}</span>
          </nav>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold font-semibold">{eyebrow}</p>
          <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider font-bold mt-2">{title}</h1>
          {intro && <p className="text-sm sm:text-base text-zinc-400 mt-4 max-w-3xl leading-relaxed">{intro}</p>}
          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-zinc-500">
            {updated && (
              <span className="inline-flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-gold" /> Last updated: {updated}
              </span>
            )}
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 hover:text-gold print:hidden">
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
        {sections.length > 0 && (
          <aside className="hidden lg:block print:hidden">
            <nav className="sticky top-28 space-y-1" aria-label="On this page">
              <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-3">On this page</p>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`block text-xs py-1.5 pl-3 border-l-2 transition-colors ${active === s.id ? 'border-gold text-gold' : 'border-zinc-800 text-zinc-500 hover:text-zinc-200'}`}
                >
                  {s.heading}
                </a>
              ))}
            </nav>
          </aside>
        )}

        <article className={`min-w-0 ${sections.length ? '' : 'lg:col-span-2 max-w-3xl'}`}>
          <div className="rich-content">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2>{s.heading}</h2>
                {s.content}
              </section>
            ))}
            {children}
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
            <div className="bg-noir-card border border-gold/20 rounded-xl p-5 text-sm">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold mb-3">Contact us</p>
              <p className="font-semibold text-zinc-100">{BRAND.tradeName}</p>
              <p className="text-xs text-zinc-500 mb-3">(Under {BRAND.legalName} – {BRAND.registration})</p>
              <p className="flex gap-2 text-xs text-zinc-400 mb-2"><MapPin className="w-4 h-4 text-gold flex-shrink-0" />{fullAddress()}</p>
              <p className="flex gap-2 text-xs text-zinc-400 mb-1"><Mail className="w-4 h-4 text-gold" /><a href={`mailto:${BRAND.email}`} className="hover:text-gold">{BRAND.email}</a></p>
              <p className="flex gap-2 text-xs text-zinc-400"><Phone className="w-4 h-4 text-gold" /><a href={BRAND.phoneHref} className="hover:text-gold">{BRAND.phone}</a></p>
            </div>
            <div className="bg-noir-card border border-zinc-800 rounded-xl p-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold mb-3">Related policies</p>
              <ul className="space-y-2">
                {RELATED.filter(([p]) => p !== path).map(([p, l]) => (
                  <li key={p}>
                    <Link to={p} className="text-sm text-zinc-300 hover:text-gold inline-flex items-center gap-1">
                      {l} <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
