import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject JWT token if present
api.interceptors.request.use(
  (config) => {
    let token = null;
    try {
      token = localStorage.getItem('jayrup_token') || localStorage.getItem('jayroop_token');
    } catch {
      token = null;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const readBlobError = async (data) => {
  try {
    const text = await data.text();
    return JSON.parse(text)?.message;
  } catch {
    return null;
  }
};

// Unwrap JSON payloads; keep full response for binary downloads (rawResponse: true)
api.interceptors.response.use(
  (response) => (response.config?.rawResponse ? response : response.data),
  async (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Only clear the session for authenticated calls (not for guest order-tracking verification)
      if (!url.startsWith('/orders/JR-') && !url.includes('/auth/login')) {
        try {
          localStorage.removeItem('jayrup_token');
          localStorage.removeItem('jayrup_user');
          localStorage.removeItem('jayroop_token');
          localStorage.removeItem('jayroop_user');
        } catch {
          /* storage unavailable */
        }
      }
    }
    let message = error.response?.data?.message;
    if (!message && error.response?.data instanceof Blob) message = await readBlobError(error.response.data);
    if (!message) {
      message =
        error.code === 'ECONNABORTED'
          ? 'The server took too long to respond. Please try again.'
          : !error.response
            ? 'Cannot reach the server. Please check your internet connection.'
            : error.message || 'An unexpected error occurred';
    }
    const e = new Error(message);
    e.status = error.response?.status;
    e.data = error.response?.data;
    return Promise.reject(e);
  }
);

export default api;
