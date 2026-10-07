import React from 'react';
import { StructuredData } from './StructuredData.jsx';

export const OrganizationSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Jayrup (JR) Royal Luxury House',
    alternateName: 'Jayrup',
    legalName: 'Jayrup Luxury Fragrances & Cosmetics Pvt Ltd',
    url: 'https://jayrup.com',
    logo: 'https://jayrup.com/src/assets/jayroop-logo.webp',
    slogan: 'पिंपल्स भागे, आत्मविश्वास जागे',
    description:
      'Premier Indian royal fragrance and skincare house creating high-concentration extraits de parfum, artisanal soaps, and Ayurvedic skincare.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: 'Rajasthan',
      addressLocality: 'Jodhpur',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-9988776655',
        contactType: 'Customer Care',
        email: 'care@jayrup.com',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
    ],
    sameAs: [
      'https://www.instagram.com/jayrup_luxury',
      'https://www.facebook.com/jayrupluxury',
      'https://www.youtube.com/@jayrupluxury',
    ],
  };

  return <StructuredData id="organization-schema-jsonld" data={schema} />;
};
