import React from 'react';
import { BrandLogo } from '../../components/common/BrandLogo.jsx';
import { SEO } from '../../components/seo/SEO.jsx';

export const AuthShell = ({ title, subtitle, seoTitle, children, footer }) => (
  <div className="bg-noir min-h-[85vh] text-zinc-100 flex items-center justify-center py-14 px-4">
    <SEO title={seoTitle || title} searchIndexing="NOINDEX_NOFOLLOW" />
    <div className="w-full max-w-md bg-noir-card border border-gold/25 rounded-2xl p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-3">
        <BrandLogo size="large" showTagline={false} />
        <h1 className="font-serif text-xl sm:text-2xl uppercase tracking-wider font-bold text-zinc-100">{title}</h1>
        {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
      </div>
      {children}
      {footer && <div className="text-center text-xs text-zinc-400 border-t border-zinc-800 pt-4">{footer}</div>}
    </div>
  </div>
);

export const safeRedirect = (value, fallback = '/') => {
  if (!value || typeof value !== 'string') return fallback;
  // only allow same-site relative paths (prevents open-redirects)
  return value.startsWith('/') && !value.startsWith('//') ? value : fallback;
};
