import { useEffect } from 'react';

export const SEOHead = ({
  title,
  description = 'Jayrup (JR) - Royal Luxury Fragrance & Skincare House. पिंपल्स भागे, आत्मविश्वास जागे.',
  keywords = 'luxury perfume, extrait de parfum, oud, kannauj rose, skincare, pimples soap, cosmetics, jayrup',
  canonicalUrl,
  ogImage = '/src/assets/jayroop-logo.webp',
  ogType = 'website',
  searchIndexing = 'INDEX_FOLLOW',
  structuredData,
}) => {
  useEffect(() => {
    // 1. Page Title
    const formattedTitle = title
      ? `${title} | JAYRUP (JR) Royal Luxury`
      : 'JAYRUP (JR) | Royal Luxury Fragrance & Skincare House';
    document.title = formattedTitle;

    // Helper to update or create meta tags
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

    // Robots Directive
    const robotsContent =
      searchIndexing === 'NOINDEX_NOFOLLOW' ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
    setMetaTag('name', 'robots', robotsContent);

    // 3. Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    const href = canonicalUrl || window.location.href;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', href);

    // 4. OpenGraph Social Meta Tags
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', href);
    setMetaTag('property', 'og:site_name', 'Jayrup (JR) Royal Luxury House');
    if (ogImage) {
      const fullImageUrl = ogImage.startsWith('http')
        ? ogImage
        : `${window.location.origin}${ogImage}`;
      setMetaTag('property', 'og:image', fullImageUrl);
      setMetaTag('name', 'twitter:image', fullImageUrl);
    }

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);

    // 6. JSON-LD Structured Data (Rich Snippets)
    let jsonLdScript = document.getElementById('seo-json-ld');
    if (structuredData) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.id = 'seo-json-ld';
        jsonLdScript.type = 'application/ld+json';
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.text = JSON.stringify(structuredData);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, searchIndexing, structuredData]);

  return null;
};
