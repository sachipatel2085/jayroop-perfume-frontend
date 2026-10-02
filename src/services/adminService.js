import api from './api.js';

export const adminService = {
  // Analytics & Inventory
  getAnalytics: async () => (await api.get('/admin/analytics')).data,
  getInventory: async () => (await api.get('/admin/inventory')).data,
  updateInventoryStock: async (id, data) => (await api.put(`/admin/inventory/${id}`, data)).data,
  getAuditLogs: async (params) => (await api.get('/admin/audit-logs', { params })).data,

  // Orders & Manual Tracking ID
  getOrders: async (params) => (await api.get('/orders', { params })),
  updateOrderStatus: async (id, statusData) => (await api.put(`/orders/${id}/status`, statusData)).data,
  updateOrderTracking: async (id, trackingData) => (await api.put(`/orders/${id}/tracking`, trackingData)).data,

  // Products
  getProducts: async (params) => (await api.get('/products', { params })),
  createProduct: async (productData) => (await api.post('/products', productData)).data,
  updateProduct: async (id, productData) => (await api.put(`/products/${id}`, productData)).data,
  deleteProduct: async (id) => (await api.delete(`/products/${id}`)).data,

  // Categories
  getCategories: async (params = { all: 'true' }) => (await api.get('/categories', { params })).data,
  createCategory: async (categoryData) => (await api.post('/categories', categoryData)).data,
  updateCategory: async (id, categoryData) => (await api.put(`/categories/${id}`, categoryData)).data,
  deleteCategory: async (id) => (await api.delete(`/categories/${id}`)).data,

  // Coupons
  getCoupons: async () => (await api.get('/coupons')).data,
  createCoupon: async (couponData) => (await api.post('/coupons', couponData)).data,
  updateCoupon: async (id, couponData) => (await api.put(`/coupons/${id}`, couponData)).data,
  deleteCoupon: async (id) => (await api.delete(`/coupons/${id}`)).data,

  // Advertisements & Campaign Video
  getAds: async () => (await api.get('/advertisements')).data,
  createAd: async (adData) => (await api.post('/advertisements', adData)).data,
  updateAd: async (id, adData) => (await api.put(`/advertisements/${id}`, adData)).data,
  deleteAd: async (id) => (await api.delete(`/advertisements/${id}`)).data,

  // Blogs
  getBlogs: async (params) => (await api.get('/blogs', { params })),
  createBlog: async (blogData) => (await api.post('/blogs', blogData)).data,
  updateBlog: async (id, blogData) => (await api.put(`/blogs/${id}`, blogData)).data,
  deleteBlog: async (id) => (await api.delete(`/blogs/${id}`)).data,

  // Reviews Moderation
  getReviews: async () => (await api.get('/reviews/admin')).data,
  toggleReviewApproval: async (id) => (await api.put(`/reviews/admin/${id}/status`)).data,
  deleteReview: async (id) => (await api.delete(`/reviews/admin/${id}`)).data,
};
