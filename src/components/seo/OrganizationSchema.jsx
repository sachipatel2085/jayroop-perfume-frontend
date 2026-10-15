import React from 'react';
import { StructuredData } from './StructuredData.jsx';
import { SITE_URL, BRAND } from '../../config/site.js';
import { useStoreSettings, legalFrom } from '../../hooks/useStoreSettings.js';

export const returnPolicySchema = () => ({
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'IN',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 3,
  returnMethod: 'https://schema.org/ReturnByMail',
  itemCondition: 'https://schema.org/DamagedCondition',
  url: `${SITE_URL}/refund-return-policy`,
});

// Same shape as the server-rendered schema (backend src/seo/headBuilder.js) so Google sees one consistent entity.
export const organizationData = (settings = null) => {
  const legal = legalFrom(settings, BRAND);
  const sameAs = legal.social.map((l) => l.url);
  return {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  '@id': `${SITE_URL}/#organization`,
  name: BRAND.name,
  alternateName: [...new Set([BRAND.tradeName, 'जयरूप'].filter((n) => n && n !== BRAND.name))],
  legalName: legal.legalName,
  ...(legal.gstin ? { vatID: legal.gstin, taxID: legal.gstin } : {}),
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: BRAND.logo, width: 512, height: 512 },
  image: BRAND.ogImage,
  email: BRAND.email,
  telephone: BRAND.phone,
  slogan: BRAND.tagline,
  description: `${legal.brand} is a brand of ${legal.legalName} – luxury perfumes, deodorant body sprays and Ayurvedic skin care, made in India.`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${BRAND.address.line1}, ${BRAND.address.line2}`,
    addressLocality: BRAND.address.city,
    addressRegion: BRAND.address.state,
    postalCode: BRAND.address.postalCode,
    addressCountry: 'IN',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: BRAND.phone,
      email: BRAND.email,
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Gujarati'],
    },
  ],
  areaServed: { '@type': 'Country', name: 'India' },
  hasMerchantReturnPolicy: returnPolicySchema(),
  ...(sameAs.length ? { sameAs } : {}),
  };
};

export const OrganizationSchema = () => {
  const settings = useStoreSettings();
  return <StructuredData id="organization-schema-jsonld" data={organizationData(settings)} />;
};
