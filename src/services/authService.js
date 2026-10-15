import api from './api.js';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('jayrup_token', res.data.token);
      localStorage.setItem('jayrup_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data?.token) {
      localStorage.setItem('jayrup_token', res.data.token);
      localStorage.setItem('jayrup_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  googleLogin: async (idToken, extra = {}) => {
    const res = await api.post('/auth/google', { idToken, ...extra });
    if (res.data?.token) {
      localStorage.setItem('jayrup_token', res.data.token);
      localStorage.setItem('jayrup_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('jayrup_token');
    localStorage.removeItem('jayrup_user');
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

  updateAddress: async (addressId, address) => {
    const res = await api.put(`/auth/addresses/${addressId}`, address);
    return res.data;
  },

  setDefaultAddress: async (addressId) => {
    const res = await api.put(`/auth/addresses/${addressId}/default`);
    return res.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await api.put('/auth/password', { currentPassword, newPassword });
    if (res.data?.token) localStorage.setItem('jayrup_token', res.data.token);
    return res.data;
  },

  forgotPassword: async (email) => api.post('/auth/forgot-password', { email }),

  resetPassword: async (token, password) => {
    const res = await api.post(`/auth/reset-password/${token}`, { password });
    if (res.data?.token) {
      localStorage.setItem('jayrup_token', res.data.token);
      localStorage.setItem('jayrup_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  deleteAddress: async (addressId) => {
    const res = await api.delete(`/auth/addresses/${addressId}`);
    return res.data;
  },

  toggleWishlist: async (productId) => {
    const res = await api.post('/auth/wishlist/toggle', { productId });
    return res?.data || res;
  },
};
