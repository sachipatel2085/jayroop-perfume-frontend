/**
 * Resolve a stored media URL for <img>/<video>.
 *  - absolute URLs (Cloudinary, CDN)          → unchanged
 *  - /uploads/…  (files stored on the API)     → prefixed with the API origin from VITE_API_URL
 *  - /images/…   (artwork shipped with the site) → unchanged (served by the storefront)
 */
const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/api\/v1\/?$/, '');

export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/uploads')) return API_ORIGIN ? `${API_ORIGIN}${url}` : url;
  return url;
};

export default resolveMediaUrl;
