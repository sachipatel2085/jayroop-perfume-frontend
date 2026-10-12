import React from 'react';
import { StructuredData } from './StructuredData.jsx';

const strip = (s = '') => String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export const FAQSchema = ({ faqs = [], id = 'faq-schema-jsonld' }) => {
  const items = faqs.filter((f) => (f.question || f.q) && (f.answer || f.a));
  if (!items.length) return null;
  return (
    <StructuredData
      id={id}
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((f) => ({
          '@type': 'Question',
          name: strip(f.question || f.q),
          acceptedAnswer: { '@type': 'Answer', text: strip(f.answer || f.a) },
        })),
      }}
    />
  );
};
