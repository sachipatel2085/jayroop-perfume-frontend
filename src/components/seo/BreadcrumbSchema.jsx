import React from 'react';
import { StructuredData } from './StructuredData.jsx';

/**
 * Generates Schema.org BreadcrumbList structured data.
 * @param {Array<{ name: string, url: string }>} items - Breadcrumb hierarchy
 */
export const BreadcrumbSchema = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  const baseUrl = 'https://jayrup.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const fullUrl = item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: fullUrl,
      };
    }),
  };

  return <StructuredData id="breadcrumb-schema-jsonld" data={schema} />;
};
