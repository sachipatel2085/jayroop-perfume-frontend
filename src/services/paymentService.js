import api from './api.js';

export const paymentService = {
  createPaymentOrder: async (checkoutPayload) => {
    const res = await api.post('/payments/create-order', checkoutPayload);
    return res.data || res;
  },

  createCodOrder: async (checkoutPayload) => {
    const res = await api.post('/payments/create-cod-order', checkoutPayload);
    return res.data || res;
  },

  verifyPayment: async (verificationPayload) => {
    const res = await api.post('/payments/verify', verificationPayload);
    return res.data || res;
  },

  getPublicSettings: async () => {
    const res = await api.get('/settings/public');
    return res.data || res;
  },
};
