import React from 'react';
import { StructuredData } from './StructuredData.jsx';
import { SITE_URL, BRAND } from '../../config/site.js';

export const WebsiteSchema = () => (
  <StructuredData
    id="website-schema-jsonld"
    data={{
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: BRAND.name,
      alternateName: [SITE_URL.replace(/^https?:\/\//, '')],
      url: SITE_URL,
      inLanguage: 'en-IN',
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/shop?search={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    }}
  />
);
