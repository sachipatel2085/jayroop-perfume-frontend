import React from 'react';
import { StructuredData } from './StructuredData.jsx';

/**
 * Generates Schema.org CollectionPage and ItemList structured data for category and catalog pages.
 */
export const CollectionPageSchema = ({
  name,
  description,
  url,
  products = [],
}) => {
  const baseUrl = 'https://jayrup.com';
  const fullUrl = url ? (url.startsWith('http') ? url : `${baseUrl}${url}`) : baseUrl;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: name,
    description: description,
    url: fullUrl,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((prod, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${baseUrl}/products/${prod.slug}`,
        name: prod.name,
      })),
    },
  };

  return <StructuredData id="collection-schema-jsonld" data={schema} />;
};
