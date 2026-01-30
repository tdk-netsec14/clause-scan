// API service — Axios instance with auth interceptors, timeouts, retries, and error handling
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s default timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor — attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Longer timeout for analysis and report endpoints
    if (config.url && (config.url.includes('/analysis/') || config.url.includes('/report'))) {
      config.timeout = 120000; // 2 minutes for AI operations
    }

    // Longer timeout for file uploads
    if (config.url && config.url.includes('/upload')) {
      config.timeout = 60000; // 1 minute for uploads
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401, 503, and network errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Retry once on 503 (database not ready)
    if (error.response && error.response.status === 503 && !config._retried) {
      config._retried = true;
      await new Promise(resolve => setTimeout(resolve, 2000));
      return api(config);
    }

    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('lc_token');
        localStorage.removeItem('lc_user');
        window.location.href = '/login';
      }

      // Extract error message from response data
      const data = error.response.data;
      const message = typeof data === 'object' && data !== null
        ? (data.error || data.message || 'Something went wrong')
        : 'Something went wrong';

      return Promise.reject({ error: message, status: error.response.status });
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ error: 'Request timed out. Please try again.' });
    }

    if (error.request) {
      return Promise.reject({ error: 'Network error. Check your connection.' });
    }

    return Promise.reject({ error: 'Something went wrong. Please try again.' });
  }
);

export default api;
