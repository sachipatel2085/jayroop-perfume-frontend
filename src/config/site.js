// Central brand / business constants – single source of truth for SEO, footer, policies & schema.
// Values can be overridden at runtime by Admin › Settings (via /settings/public) where noted.

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://jayrup.in').replace(/\/+$/, '');

export const BRAND = {
  name: 'Jayrup',
  tradeName: 'Jayrup',
  legalName: 'FITJAYESH',
  registration: 'MSME Registered',
  tagline: 'Skincare · Fragrances · Personal Care',
  description:
    'Jayrup creates safe, effective and affordable skincare and long-lasting fragrances, made in India – combining traditional wisdom with modern cosmetic science.',
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

// Legal identity line used in policies & footer, e.g. "Jayrup (under FITJAYESH – MSME Registered)"
export const legalIdentity = () =>
  `${BRAND.tradeName}${BRAND.legalName ? ` (under ${BRAND.legalName}${BRAND.registration ? ` – ${BRAND.registration}` : ''})` : ''}`;

export const fullAddress = (a = BRAND.address) =>
  [a.line1, a.line2, a.city, a.district, `${a.state} – ${a.postalCode}`, a.country].filter(Boolean).join(', ');

export const DEFAULT_SEO = {
  title: 'Jayrup | Luxury Perfume for Men & Ayurvedic Pimple Cream India',
  description:
    'Shop Jayrup – Royal Flora long-lasting Eau de Parfum for men & Ayurvedic Pimples Cream with Neem & Karanj. Made in India. PhonePe & COD, delivery across India.',
  keywords:
    'jayrup, jayrup perfume, royal flora perfume, luxury perfume for men, long lasting perfume for men, eau de parfum india, ayurvedic pimple cream, jayrup pimples cream, herbal pimple cream',
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
