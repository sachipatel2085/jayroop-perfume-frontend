import api from './api.js';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('jayroop_token', res.data.token);
      localStorage.setItem('jayroop_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data?.token) {
      localStorage.setItem('jayroop_token', res.data.token);
      localStorage.setItem('jayroop_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('jayroop_token');
    localStorage.removeItem('jayroop_user');
  },

  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    return res.data;
  },

  addAddress: async (address) => {
    const res = await api.post('/auth/addresses', address);
    return res.data;
  },

  deleteAddress: async (addressId) => {
    const res = await api.delete(`/auth/addresses/${addressId}`);
    return res.data;
  },

  toggleWishlist: async (productId) => {
    const res = await api.post('/auth/wishlist/toggle', { productId });
    return res.data;
  },
};
