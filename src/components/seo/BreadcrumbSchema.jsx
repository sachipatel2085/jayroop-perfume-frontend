import React from 'react';
import { StructuredData } from './StructuredData.jsx';
import { SITE_URL } from '../../config/site.js';

/** @param {Array<{ name: string, url: string }>} items */
export const BreadcrumbSchema = ({ items = [] }) => {
  if (!items.length) return null;
  return (
    <StructuredData
      id="breadcrumb-schema-jsonld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
        })),
      }}
    />
  );
};
