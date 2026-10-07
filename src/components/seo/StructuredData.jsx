import { useEffect } from 'react';

/**
 * Injects or updates a Schema.org JSON-LD structured data script in <head>.
 * Automatically cleans up or updates on prop change.
 */
export const StructuredData = ({ id = 'schema-json-ld', data }) => {
  useEffect(() => {
    if (!data) return;

    let scriptTag = document.getElementById(id);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = id;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    try {
      scriptTag.text = JSON.stringify(data);
    } catch (err) {
      console.error('Failed to stringify structured data', err);
    }

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [id, data]);

  return null;
};
