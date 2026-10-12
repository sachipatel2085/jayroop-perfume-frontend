import api from './api.js';
import { downloadFile } from '../utils/download.js';

export const orderService = {
  calculateCart: async (items, couponCode = '', paymentMethod = 'ONLINE') => {
    const res = await api.post('/cart/calculate', { items, couponCode, paymentMethod });
    return res.data;
  },

  getMyOrders: async (params = {}) => {
    const res = await api.get('/orders/my-orders', { params });
    return res; // { data, total, totalPages }
  },

  getMyOrder: async (orderNumber) => {
    const res = await api.get(`/orders/my-orders/${encodeURIComponent(orderNumber)}`);
    return res.data;
  },

  cancelMyOrder: async (orderNumber, reason = '') => {
    const res = await api.post(`/orders/my-orders/${encodeURIComponent(orderNumber)}/cancel`, { reason });
    return res.data;
  },

  // Report a problem / request return or replacement (within the policy window after delivery)
  requestReturn: async (orderNumber, payload) => {
    const res = await api.post(`/orders/my-orders/${encodeURIComponent(orderNumber)}/return-request`, payload);
    return res;
  },

  /** Public / owner order lookup. Guests must pass the phone number used on the order. */
  getOrderByIdentifier: async (identifier, phone) => {
    const res = await api.get(`/orders/${encodeURIComponent(identifier)}`, { params: phone ? { phone } : {} });
    return res.data;
  },

  downloadInvoice: (orderIdOrNumber, { inline = false } = {}) =>
    downloadFile(`/orders/${encodeURIComponent(orderIdOrNumber)}/invoice${inline ? '?inline=1' : ''}`, {
      filename: `Jayrup-Invoice-${orderIdOrNumber}.pdf`,
      open: inline,
    }),
};
