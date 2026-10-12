import React from 'react';
import { StructuredData } from './StructuredData.jsx';
import { SITE_URL, BRAND } from '../../config/site.js';

export const returnPolicySchema = () => ({
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'IN',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 3,
  returnMethod: 'https://schema.org/ReturnByMail',
  itemCondition: 'https://schema.org/DamagedCondition',
  url: `${SITE_URL}/refund-return-policy`,
});

export const organizationData = () => ({
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  '@id': `${SITE_URL}/#organization`,
  name: BRAND.name,
  alternateName: [BRAND.tradeName, 'जयरूप'],
  legalName: BRAND.legalName,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: BRAND.logo, width: 512, height: 512 },
  image: BRAND.ogImage,
  email: BRAND.email,
  telephone: BRAND.phone,
  slogan: BRAND.tagline,
  description: BRAND.description,
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
  ...(Object.values(BRAND.social).some(Boolean) ? { sameAs: Object.values(BRAND.social).filter(Boolean) } : {}),
});

export const OrganizationSchema = () => <StructuredData id="organization-schema-jsonld" data={organizationData()} />;
