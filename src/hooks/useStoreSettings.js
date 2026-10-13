import { useEffect, useState } from 'react';
import { paymentService } from '../services/paymentService.js';

// Public store settings (GST display, shipping, COD, business details) – fetched once per page load
// and shared by every component that needs them.
let cache = null;
let pending = null;

export const loadStoreSettings = () => {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = paymentService
      .getPublicSettings()
      .then((s) => {
        cache = s || {};
        return cache;
      })
      .catch(() => {
        pending = null;
        return {};
      });
  }
  return pending;
};

export const useStoreSettings = () => {
  const [settings, setSettings] = useState(cache);
  useEffect(() => {
    if (cache) return undefined;
    let alive = true;
    loadStoreSettings().then((s) => alive && setSettings(s));
    return () => {
      alive = false;
    };
  }, []);
  return settings;
};

/** Short price note shown next to prices: "incl. of all taxes" or "+ GST" */
export const taxNote = (settings, { long = false } = {}) => {
  const gst = settings?.gst;
  if (gst && gst.pricesIncludeTax === false && gst.applicable) return long ? 'GST added at checkout' : '+ GST';
  return long ? 'Inclusive of all taxes' : 'incl. of all taxes';
};
