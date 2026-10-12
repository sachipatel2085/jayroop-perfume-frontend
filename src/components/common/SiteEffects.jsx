import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { paymentService } from '../../services/paymentService.js';
import { initAnalytics, trackPageView } from '../../utils/analytics.js';

/** Loads analytics (IDs from Admin › Settings) and reports SPA page views. */
export const SiteEffects = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    paymentService
      .getPublicSettings()
      .then((s) => initAnalytics(s || {}))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return undefined;
    const t = setTimeout(() => trackPageView(location.pathname + location.search), 300);
    return () => clearTimeout(t);
  }, [location.pathname, location.search]);

  return null;
};
