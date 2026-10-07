import React from 'react';
import { StructuredData } from './StructuredData.jsx';

/**
 * Generates Schema.org Product structured data compliant with Google Search Rich Results guidelines.
 * Strictly avoids fake ratings or fabricated attributes.
 */
export const ProductSchema = ({ product }) => {
  if (!product) return null;

  const baseUrl = 'https://jayrup.com';
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const images = (product.images || [])
    .map((img) => img.url)
    .filter(Boolean)
    .map((url) => (url.startsWith('http') ? url : `${baseUrl}${url}`));

  // Fallback brand logo image if product has no images
  if (images.length === 0) {
    images.push(`${baseUrl}/src/assets/jayroop-logo.webp`);
  }

  const description =
    product.seo?.metaDescription ||
    product.shortDescription ||
    product.description ||
    `${product.name} handcrafted by Jayrup Royal Luxury House.`;

  // Base Schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images,
    description: description.replace(/\s+/g, ' ').trim(),
    sku: product.sku,
    mpn: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Jayrup',
    },
    category: product.category?.name || 'Luxury Perfumes',
  };

  // Determine Offers (Single Offer vs AggregateOffer for Variants)
  if (product.variants && product.variants.length > 0) {
    const validVariants = product.variants.filter((v) => typeof v.price === 'number');
    const prices = validVariants.map((v) =>
      typeof v.salePrice === 'number' && v.salePrice < v.price ? v.salePrice : v.price
    );
    const lowPrice = Math.min(...prices);
    const highPrice = Math.max(...prices);

    schema.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: lowPrice,
      highPrice: highPrice,
      offerCount: validVariants.length,
      offers: validVariants.map((v) => {
        const vPrice =
          typeof v.salePrice === 'number' && v.salePrice < v.price ? v.salePrice : v.price;
        const vInStock = typeof v.stock === 'number' ? v.stock > 0 : product.stock > 0;

        return {
          '@type': 'Offer',
          name: `${product.name} - ${v.title}`,
          sku: v.sku || `${product.sku}-${v.title}`,
          price: vPrice,
          priceCurrency: 'INR',
          availability: vInStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: productUrl,
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'Jayrup Royal Luxury',
          },
        };
      }),
    };
  } else {
    const activePrice =
      product.salePrice && product.salePrice < product.price
        ? product.salePrice
        : product.price;

    schema.offers = {
      '@type': 'Offer',
      price: activePrice,
      priceCurrency: 'INR',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: productUrl,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Jayrup Royal Luxury',
      },
    };
  }

  // AggregateRating ONLY if genuine reviews exist
  if (product.numReviews > 0 && product.averageRating > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(product.averageRating.toFixed(1)),
      reviewCount: product.numReviews,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return <StructuredData id="product-schema-jsonld" data={schema} />;
};
