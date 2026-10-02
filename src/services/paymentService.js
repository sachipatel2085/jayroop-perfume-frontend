import api from './api.js';

export const paymentService = {
  createPaymentOrder: async (checkoutPayload) => {
    const res = await api.post('/payments/create-order', checkoutPayload);
    return res.data;
  },

  verifyPayment: async (verificationPayload) => {
    const res = await api.post('/payments/verify', verificationPayload);
    return res.data;
  },
};
