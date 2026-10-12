import React from 'react';
import { StructuredData } from './StructuredData.jsx';
import { returnPolicySchema } from './OrganizationSchema.jsx';
import { SITE_URL } from '../../config/site.js';

const strip = (s = '') => String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const abs = (u) => (!u ? '' : /^https?:\/\//.test(u) ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`);

const shipping = (price, threshold = 999, fee = 100) => ({
  '@type': 'OfferShippingDetails',
  shippingRate: { '@type': 'MonetaryAmount', value: price >= threshold ? 0 : fee, currency: 'INR' },
  shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 2, unitCode: 'DAY' },
    transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 8, unitCode: 'DAY' },
  },
});

/**
 * Google-compliant Product rich result: offers (incl. variants), shipping, return policy,
 * GTIN, aggregate rating & reviews ONLY when real reviews exist.
 */
export const ProductSchema = ({ product, reviews = [], shippingRules = {} }) => {
  if (!product) return null;
  const url = `${SITE_URL}/products/${product.slug}`;
  const images = (product.images || []).map((i) => abs(i.url)).filter(Boolean);
  const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`;
  const threshold = shippingRules.freeShippingThreshold ?? 999;
  const fee = shippingRules.flatShippingFee ?? 100;

  const offer = (name, sku, price, stock, barcode) => ({
    '@type': 'Offer',
    url,
    ...(name ? { name } : {}),
    sku,
    ...(/^\d{8,14}$/.test(barcode || '') ? { gtin: barcode } : {}),
    price: Number(price).toFixed(2),
    priceCurrency: 'INR',
    priceValidUntil,
    availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@id': `${SITE_URL}/#organization` },
    shippingDetails: shipping(price, threshold, fee),
    hasMerchantReturnPolicy: returnPolicySchema(),
  });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    url,
    image: images.length ? images : [`${SITE_URL}/logo-512.png`],
    description: strip(product.seo?.metaDescription || product.shortDescription || product.description).slice(0, 500),
    sku: product.sku,
    mpn: product.sku,
    ...(/^\d{8,14}$/.test(product.barcode || '') ? { gtin: product.barcode } : {}),
    brand: { '@type': 'Brand', name: product.brand || 'Jayrup' },
    ...(product.category?.name ? { category: product.category.name } : {}),
    countryOfOrigin: product.countryOfOrigin || 'India',
    ...(product.netQuantity ? { size: product.netQuantity } : {}),
  };

  if (product.variants?.length) {
    const offers = product.variants.map((v) =>
      offer(`${product.name} – ${v.title}`, v.sku, v.salePrice && v.salePrice < v.price ? v.salePrice : v.price, v.stock, v.barcode)
    );
    const prices = offers.map((o) => Number(o.price));
    schema.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: Math.min(...prices).toFixed(2),
      highPrice: Math.max(...prices).toFixed(2),
      offerCount: offers.length,
      offers,
    };
  } else {
    const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
    schema.offers = offer(null, product.sku, price, product.stock, product.barcode);
  }

  if (product.numReviews > 0 && product.averageRating > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(product.averageRating).toFixed(1),
      reviewCount: product.numReviews,
      bestRating: 5,
      worstRating: 1,
    };
    if (reviews.length) {
      schema.review = reviews.slice(0, 5).map((r) => ({
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
        author: { '@type': 'Person', name: (r.user?.name || 'Verified Buyer').split(' ')[0] },
        datePublished: new Date(r.createdAt).toISOString().slice(0, 10),
        reviewBody: strip(r.comment).slice(0, 500),
      }));
    }
  }

  return <StructuredData id="product-schema-jsonld" data={schema} />;
};
