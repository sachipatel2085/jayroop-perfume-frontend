import React from 'react';
import { StructuredData } from './StructuredData.jsx';
import { SITE_URL } from '../../config/site.js';

export const CollectionPageSchema = ({ name, description, url, products = [] }) => {
  const pageUrl = url ? (url.startsWith('http') ? url : `${SITE_URL}${url}`) : `${SITE_URL}/shop`;
  return (
    <StructuredData
      id="collection-schema-jsonld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name,
        description,
        url: pageUrl,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: products.length,
          itemListElement: products.slice(0, 30).map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/products/${p.slug}`,
            name: p.name,
          })),
        },
      }}
    />
  );
};
