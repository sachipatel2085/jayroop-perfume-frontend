import { useEffect } from 'react';

/**
 * Injects / replaces a JSON-LD <script> in <head>. Uses the same ids as the server-rendered tags,
 * so hydration replaces them instead of duplicating.
 */
export const StructuredData = ({ id = 'schema-json-ld', data }) => {
  const json = data ? JSON.stringify(data).replace(/</g, '\\u003c') : null;
  useEffect(() => {
    if (!json) return undefined;
    let tag = document.getElementById(id);
    if (!tag) {
      tag = document.createElement('script');
      tag.id = id;
      tag.type = 'application/ld+json';
      document.head.appendChild(tag);
    }
    tag.textContent = json;
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [id, json]);
  return null;
};
