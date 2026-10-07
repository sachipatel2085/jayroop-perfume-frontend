import React, { useEffect } from 'react';

const BASE_URL = 'https://jayrup.com';
const DEFAULT_TITLE = 'JAYRUP (JR) | Royal Luxury Fragrance & Skincare House';
const DEFAULT_DESC =
  'Jayrup (जयरूप) - Royal Indian Luxury House of High-Potency Extraits de Parfum and Ayurvedic Skincare. पिंपल्स भागे, आत्मविश्वास जागे.';
const DEFAULT_KEYWORDS =
  'luxury perfume, extrait de parfum, oud, kannauj rose, ayurvedic skincare, pimples soap, cosmetics, jayrup';
const DEFAULT_IMAGE = `${BASE_URL}/src/assets/jayroop-logo.webp`;

/**
 * Unified Central SEO Engine
 * Manages document.title, standard meta tags, robots directives, canonical tags,
 * OpenGraph, Twitter Cards, and renders any nested Schema.org child components.
 */
export const SEO = ({
  title,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  searchIndexing = 'INDEX_FOLLOW',
  children,
}) => {
  useEffect(() => {
    // 1. Formatted Title
    const formattedTitle = title
      ? title.includes('JAYRUP') || title.includes('Jayrup')
        ? title
        : `${title} | JAYRUP Royal Luxury`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);

    // 3. Robots Directive
    const robotsDirective =
      searchIndexing === 'NOINDEX_NOFOLLOW'
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    setMetaTag('name', 'robots', robotsDirective);

    // 4. Canonical URL Normalization
    // If not provided, normalize current pathname (strip tracking/filter query strings)
    let cleanCanonical = canonicalUrl;
    if (!cleanCanonical) {
      cleanCanonical = `${BASE_URL}${window.location.pathname.replace(/\/+$/, '') || '/'}`;
    } else if (!cleanCanonical.startsWith('http')) {
      cleanCanonical = `${BASE_URL}${cleanCanonical}`;
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', cleanCanonical);

    // 5. OpenGraph Tags
    const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', cleanCanonical);
    setMetaTag('property', 'og:site_name', 'Jayrup (JR) Royal Luxury House');
    setMetaTag('property', 'og:image', fullImageUrl);
    setMetaTag('property', 'og:image:alt', formattedTitle);
    setMetaTag('property', 'og:locale', 'en_IN');

    // 6. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', fullImageUrl);
    setMetaTag('name', 'twitter:site', '@jayrup_luxury');
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, searchIndexing]);

  return <>{children}</>;
};

// Re-export for backward compatibility
export default SEO;
