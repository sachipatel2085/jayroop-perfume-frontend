import { useEffect } from 'react';

export const SEOHead = ({
  title,
  description = 'Jayroop (JR) - Royal Luxury Fragrance & Skincare House. पिंपल्स भागे, आत्मविश्वास जागे.',
  keywords = 'luxury perfume, oud, jayroop special, skincare, pimples cream, attar, cosmetics',
  canonicalUrl,
}) => {
  useEffect(() => {
    document.title = title
      ? `${title} | JAYROOP (JR) Royal Luxury`
      : 'JAYROOP (JR) | Royal Luxury Fragrance & Skincare House';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description, keywords, canonicalUrl]);

  return null;
};
