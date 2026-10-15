import api from './api.js';
import { downloadFile } from '../utils/download.js';

export const adminService = {
  // Analytics & Inventory
  getAnalytics: async () => (await api.get('/admin/analytics')).data,
  getInventory: async () => (await api.get('/admin/inventory')).data,
  updateInventoryStock: async (id, data) => (await api.put(`/admin/inventory/${id}`, data)).data,
  getAuditLogs: async (params) => (await api.get('/admin/audit-logs', { params })).data,

  getCustomers: async (params) => api.get('/admin/customers', { params }),
  setCustomerStatus: async (id, isActive) => (await api.put(`/admin/customers/${id}/status`, { isActive })).data,

  // Orders, invoices, labels & PhonePe
  getOrders: async (params) => (await api.get('/orders', { params })),
  getOrder: async (id) => (await api.get(`/orders/admin/${id}`)).data,
  updateOrderStatus: async (id, statusData) => (await api.put(`/orders/${id}/status`, statusData)).data,
  updateOrderTracking: async (id, trackingData) => (await api.put(`/orders/${id}/tracking`, trackingData)).data,
  updateOrderNote: async (id, adminNote) => (await api.put(`/orders/${id}/note`, { adminNote })).data,
  generateInvoice: async (id) => (await api.post(`/orders/${id}/invoice`)).data,
  openInvoice: (id, copy) => downloadFile(`/orders/${id}/invoice?inline=1${copy ? `&copy=${copy}` : ''}`, { open: true }),
  downloadInvoice: (id, number) => downloadFile(`/orders/${id}/invoice`, { filename: `Invoice-${number || id}.pdf` }),
  openLabel: (id) => downloadFile(`/orders/${id}/label`, { open: true }),
  getPrintOptions: async () => (await api.get('/orders/print/options')).data,
  // Many invoices / labels in one PDF → { blob, summary }
  bulkPrint: async (options) => {
    const res = await api.post('/orders/print', options, { responseType: 'blob', rawResponse: true, timeout: 180000 });
    let summary = null;
    try {
      summary = JSON.parse(decodeURIComponent(res.headers?.['x-print-summary'] || ''));
    } catch {
      summary = null;
    }
    return { blob: res.data instanceof Blob ? res.data : new Blob([res.data], { type: 'application/pdf' }), summary };
  },
  syncPayment: async (id) => (await api.post(`/payments/admin/${id}/sync`)).data,
  refundOrder: async (id, payload) => (await api.post(`/payments/admin/${id}/refund`, payload)).data,
  syncRefund: async (id, refundId) => (await api.post(`/payments/admin/${id}/refunds/${refundId}/sync`)).data,
  getGatewayInfo: async () => (await api.get('/payments/admin/gateway')).data,

  // Reports
  getReportOverview: async (params) => (await api.get('/admin/reports/overview', { params })).data,
  previewReport: async (type, params) => (await api.get(`/admin/reports/${type}`, { params })).data,
  exportReport: (type, format, params) =>
    downloadFile(`/admin/reports/${type}/export`, { params: { ...params, format }, filename: `Jayrup-${type}-report.${format}` }),

  // Contact inquiries
  getInquiries: async (params) => api.get('/contact', { params }),
  updateInquiry: async (id, data) => (await api.patch(`/contact/${id}`, data)).data,

  // Products
  getProducts: async (params) => (await api.get('/products/admin/list', { params })),
  getProduct: async (id) => (await api.get(`/products/admin/${id}`)).data,
  // Product-type catalogue (tax defaults, sections, return/shipping rules) – single source on the server
  getProductTypes: async () => (await api.get('/products/meta/types')).data,
  createProduct: async (productData) => (await api.post('/products', productData)).data,
  updateProduct: async (id, productData) => (await api.put(`/products/${id}`, productData)).data,
  deleteProduct: async (id) => (await api.delete(`/products/${id}`)).data, // archive (hide from store)
  deleteProductPermanently: async (id) => (await api.delete(`/products/${id}/permanent`)).data,

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
  getReviews: async (params) => api.get('/reviews/admin', { params }), // { data, statusCounts, pagination }
  setReviewStatus: async (id, status, reason = '') => (await api.put(`/reviews/admin/${id}/status`, { status, reason })).data,
  toggleReviewApproval: async (id) => (await api.put(`/reviews/admin/${id}/status`)).data,
  replyToReview: async (id, text) => (await api.put(`/reviews/admin/${id}/reply`, { text })).data,
  toggleReviewFeatured: async (id) => (await api.put(`/reviews/admin/${id}/feature`)).data,
  bulkReviews: async (ids, action, reason = '') => api.post('/reviews/admin/bulk', { ids, action, reason }),
  deleteReview: async (id) => (await api.delete(`/reviews/admin/${id}`)).data,

  // Direct Media Upload (Cloudinary)
  uploadMedia: async (file, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res?.data || res;
  },

  // Influencer Videos (Inspirations & Scent-Fluencers)
  getAdminInfluencers: async (params) => (await api.get('/influencers/admin', { params })),
  createInfluencerVideo: async (data) => (await api.post('/influencers', data)).data,
  updateInfluencerVideo: async (id, data) => (await api.put(`/influencers/${id}`, data)).data,
  deleteInfluencerVideo: async (id) => (await api.delete(`/influencers/${id}`)).data,

  // Store Configuration & Cash on Delivery (COD) Controls
  getSettings: async () => (await api.get('/settings')).data,
  updateReturnRequest: async (orderId, payload) => api.put(`/orders/${orderId}/return-request`, payload),
  updateSettings: async (settingsData) => (await api.put('/settings', settingsData)).data,
};
