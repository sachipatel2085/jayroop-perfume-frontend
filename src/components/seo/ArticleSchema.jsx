import React from 'react';
import { StructuredData } from './StructuredData.jsx';

/**
 * Generates Schema.org Article / BlogPosting structured data.
 */
export const ArticleSchema = ({ blog }) => {
  if (!blog) return null;

  const baseUrl = 'https://jayrup.com';
  const articleUrl = `${baseUrl}/blog/${blog.slug}`;
  const imageUrl = blog.coverImage?.url
    ? blog.coverImage.url.startsWith('http')
      ? blog.coverImage.url
      : `${baseUrl}${blog.coverImage.url}`
    : `${baseUrl}/src/assets/jayroop-logo.webp`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.seo?.metaDescription || blog.excerpt,
    image: [imageUrl],
    datePublished: blog.publishedAt || blog.createdAt || new Date().toISOString(),
    dateModified: blog.updatedAt || blog.publishedAt || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: blog.author || 'Jayrup Editorial House',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Jayrup (JR) Royal Luxury House',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/src/assets/jayroop-logo.webp`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  return <StructuredData id="article-schema-jsonld" data={schema} />;
};
