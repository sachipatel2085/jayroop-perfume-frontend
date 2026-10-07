import React from 'react';
import { StructuredData } from './StructuredData.jsx';

/**
 * Generates Schema.org FAQPage structured data for genuine visible FAQs.
 * @param {Array<{ question: string, answer: string }>} faqs
 */
export const FAQSchema = ({ faqs = [] }) => {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <StructuredData id="faq-schema-jsonld" data={schema} />;
};
