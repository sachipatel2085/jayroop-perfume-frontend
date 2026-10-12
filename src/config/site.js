// Central brand / business constants – single source of truth for SEO, footer, policies & schema.
// Values can be overridden at runtime by Admin › Settings (via /settings/public) where noted.

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://jayrup.in').replace(/\/+$/, '');

export const BRAND = {
  name: 'Jayrup',
  tradeName: 'Jayrup Pimples Cream',
  legalName: 'FITJAYESH',
  registration: 'MSME Registered',
  tagline: 'पिंपल्स भागे, आत्मविश्वास जागे',
  description:
    'Jayrup creates safe, effective and affordable Ayurvedic-inspired cosmetic skincare and long-lasting perfumes, made in India for Indian skin.',
  email: 'care@jayrup.in',
  phone: '+91 94081 33100',
  phoneHref: 'tel:+919408133100',
  whatsappHref: 'https://wa.me/919408133100',
  address: {
    line1: 'G-28, Metropolis Complex',
    line2: 'Gambhoi–Bhiloda Road, Gambhoi',
    city: 'Himatnagar',
    district: 'Sabarkantha',
    state: 'Gujarat',
    postalCode: '383030',
    country: 'India',
  },
  logo: `${SITE_URL}/logo-512.png`,
  ogImage: `${SITE_URL}/og-image.jpg`,
  social: {
    instagram: '',
    facebook: '',
    youtube: '',
  },
};

export const fullAddress = (a = BRAND.address) =>
  [a.line1, a.line2, a.city, a.district, `${a.state} – ${a.postalCode}`, a.country].filter(Boolean).join(', ');

export const DEFAULT_SEO = {
  title: 'Jayrup | Pimples Cream, Ayurvedic Skincare & Luxury Perfumes Online India',
  description:
    'Shop Jayrup online – Ayurvedic-inspired Pimples Cream for acne & marks, skincare and long-lasting luxury perfumes. Made in India. Secure PhonePe & COD checkout, delivery across India.',
  keywords:
    'jayrup, jayrup pimples cream, pimple cream, anti acne cream, acne marks cream, ayurvedic skincare, luxury perfume india, eau de parfum',
};

export const INDIA_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export const ORDER_STATUS_META = {
  PENDING_PAYMENT: { label: 'Awaiting Payment', tone: 'amber' },
  PAID: { label: 'Confirmed', tone: 'gold' },
  PROCESSING: { label: 'Processing', tone: 'gold' },
  SHIPPED: { label: 'Shipped', tone: 'blue' },
  DELIVERED: { label: 'Delivered', tone: 'emerald' },
  CANCELLED: { label: 'Cancelled', tone: 'red' },
  REFUND_REQUESTED: { label: 'Refund in Progress', tone: 'amber' },
  REFUNDED: { label: 'Refunded', tone: 'noir' },
};

export const formatINR = (n, decimals = 0) =>
  `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals === 0 ? 2 : decimals })}`;

export const formatDate = (d, withTime = false) =>
  d
    ? new Date(d).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
      })
    : '—';
