import React from 'react';
import { SEO } from '../seo/SEO.jsx';
import { StructuredData } from '../seo/StructuredData.jsx';

/**
 * SEOHead wrapper component for backward compatibility.
 * Proxies to modular SEO and StructuredData components.
 */
export const SEOHead = ({
  title,
  description,
  keywords,
  canonical,
  canonicalUrl,
  image,
  ogImage,
  ogType,
  searchIndexing,
  jsonLd,
  structuredData,
  children,
}) => {
  const activeCanonical = canonicalUrl || canonical;
  const activeImage = ogImage || image;
  const activeJsonLd = structuredData || jsonLd;

  return (
    <SEO
      title={title}
      description={description}
      keywords={keywords}
      canonicalUrl={activeCanonical}
      ogImage={activeImage}
      ogType={ogType}
      searchIndexing={searchIndexing}
    >
      {activeJsonLd && <StructuredData id="seohead-jsonld" data={activeJsonLd} />}
      {children}
    </SEO>
  );
};

export default SEOHead;
