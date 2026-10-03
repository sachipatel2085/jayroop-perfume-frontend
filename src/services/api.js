import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jayrup_token') || localStorage.getItem('jayroop_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration gracefully
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // If token expired, clear invalid session
      localStorage.removeItem('jayrup_token');
      localStorage.removeItem('jayrup_user');
      localStorage.removeItem('jayroop_token');
      localStorage.removeItem('jayroop_user');
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
