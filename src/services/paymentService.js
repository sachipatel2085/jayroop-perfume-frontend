import api from './api.js';

export const paymentService = {
  /** Unified checkout. paymentMethod: 'ONLINE' (PhonePe) | 'COD' */
  checkout: async (payload) => {
    const res = await api.post('/payments/checkout', payload);
    return res.data;
  },

  /** Verify payment with PhonePe (server-to-server) after the customer returns */
  getStatus: async (orderNumber, params = {}) => {
    const res = await api.get(`/payments/status/${encodeURIComponent(orderNumber)}`, { params });
    return res.data;
  },

  retry: async (orderNumber) => {
    const res = await api.post(`/payments/${encodeURIComponent(orderNumber)}/retry`);
    return res.data;
  },

  getPublicSettings: async () => {
    const res = await api.get('/settings/public');
    return res.data || res;
  },
};
