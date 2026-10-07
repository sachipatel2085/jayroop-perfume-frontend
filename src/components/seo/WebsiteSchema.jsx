import React from 'react';
import { StructuredData } from './StructuredData.jsx';

export const WebsiteSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jayrup (JR) Royal Luxury',
    alternateName: 'Jayrup Perfumes',
    url: 'https://jayrup.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://jayrup.com/shop?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <StructuredData id="website-schema-jsonld" data={schema} />;
};
