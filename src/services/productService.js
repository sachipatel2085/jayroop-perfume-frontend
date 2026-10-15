import api from './api.js';

export const productService = {
  getProducts: async (params = {}) => {
    const res = await api.get('/products', { params });
    return res;
  },

  getProductBySlug: async (slug) => {
    const res = await api.get(`/products/${slug}`);
    return res.data;
  },

  getCategories: async (params = {}) => {
    const res = await api.get('/categories', { params });
    return res.data;
  },

  getCategoryBySlug: async (slug) => {
    const res = await api.get(`/categories/${slug}`);
    return res.data;
  },

  getActiveAds: async (location = 'HOMEPAGE_HERO') => {
    const res = await api.get('/advertisements/active', { params: { location } });
    return res.data;
  },

  getBlogs: async (params = {}) => {
    const res = await api.get('/blogs', { params });
    return res;
  },

  getBlogBySlug: async (slug) => {
    const res = await api.get(`/blogs/${slug}`);
    return res.data;
  },

  getProductReviews: async (productId) => {
    const res = await api.get(`/reviews/product/${productId}`);
    return res.data;
  },

  submitReview: async (reviewData) => api.post('/reviews', reviewData), // { success, message, data }
  // Full response: { data: reviews[], summary: { average, count, verified, distribution }, pagination }
  getReviewsPage: async (productId, params = {}) => api.get(`/reviews/product/${productId}`, { params }),
  getMyReview: async (productId) => (await api.get(`/reviews/product/${productId}/mine`)).data,
  toggleReviewHelpful: async (id) => (await api.post(`/reviews/${id}/helpful`)).data,
  deleteMyReview: async (id) => api.delete(`/reviews/mine/${id}`),

  getInfluencerVideos: async (params = {}) => {
    const res = await api.get('/influencers', { params });
    return res;
  },
};
