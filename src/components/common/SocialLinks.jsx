import React from 'react';

// Simple line icons (brand icons are not shipped with lucide-react).
const ICONS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: <path d="M14 8.5V6.8c0-.8.5-1.3 1.3-1.3H17V2.5h-2.6C11.9 2.5 10.6 4 10.6 6.4v2.1H8v3.1h2.6v9.9H14v-9.9h2.7l.4-3.1H14z" fill="currentColor" stroke="none" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none" />
    </>
  ),
  x: <path d="M4 4l16 16M20 4L4 20" />,
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5v6M7.5 7.6v.1M11 16.5v-6M11 13c0-1.6 1-2.6 2.4-2.6s2.1.9 2.1 2.6v3.5" />
    </>
  ),
  pinterest: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.5 20l1.6-7.2M11 15c3.8 1 6-1.6 6-4.4A5 5 0 0 0 12 6c-3 0-5 2.2-5 4.6 0 1 .4 2 1.1 2.4" />
    </>
  ),
  threads: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M15.2 12v1.3c0 1.4 1 2.2 2.1 2.2 1.6 0 2.7-1.5 2.7-3.5A8 8 0 1 0 15.8 19" />
    </>
  ),
};

export const SocialIcon = ({ name, className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name] || <circle cx="12" cy="12" r="9" />}
  </svg>
);

/** Row of social profile buttons – links come from Admin › Settings › Storefront › Social media. */
export const SocialLinks = ({ links = [], size = 'md', className = '' }) => {
  if (!links.length) return null;
  const box = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Jayrup on social media">
      {links.map((l) => (
        <li key={l.key}>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer me"
            title={`Jayrup on ${l.label}`}
            aria-label={`Jayrup on ${l.label}`}
            className={`${box} inline-flex items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-black transition-colors`}
          >
            <SocialIcon name={l.key} />
          </a>
        </li>
      ))}
    </ul>
  );
};
