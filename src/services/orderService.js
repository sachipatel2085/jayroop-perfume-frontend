import api from './api.js';

export const orderService = {
  calculateCart: async (items, couponCode = '') => {
    const res = await api.post('/cart/calculate', { items, couponCode });
    return res.data;
  },

  getMyOrders: async () => {
    const res = await api.get('/orders/my-orders');
    return res.data;
  },

  getOrderByIdentifier: async (identifier) => {
    const res = await api.get(`/orders/${identifier}`);
    return res.data;
  },
};
