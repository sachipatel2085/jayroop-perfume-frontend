import React from 'react';
import { StructuredData } from './StructuredData.jsx';
import { SITE_URL, BRAND } from '../../config/site.js';

const abs = (u) => (!u ? `${SITE_URL}/og-image.jpg` : /^https?:\/\//.test(u) ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`);

export const ArticleSchema = ({ blog }) => {
  if (!blog) return null;
  const url = `${SITE_URL}/blog/${blog.slug}`;
  return (
    <StructuredData
      id="article-schema-jsonld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: String(blog.title || '').slice(0, 110),
        description: blog.seo?.metaDescription || blog.excerpt,
        image: [abs(blog.coverImage?.url)],
        datePublished: new Date(blog.publishedAt || blog.createdAt || Date.now()).toISOString(),
        dateModified: new Date(blog.updatedAt || blog.publishedAt || Date.now()).toISOString(),
        author: { '@type': 'Organization', name: blog.author || BRAND.name, url: SITE_URL },
        publisher: { '@id': `${SITE_URL}/#organization`, '@type': 'Organization', name: BRAND.name, logo: { '@type': 'ImageObject', url: BRAND.logo } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        articleSection: blog.category,
        keywords: (blog.tags || []).join(', '),
        inLanguage: 'en-IN',
      }}
    />
  );
};
