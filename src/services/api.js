import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log('🔗 API Request interceptor:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'NO TOKEN'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request headers');
    } else {
      console.log('❌ No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  async login(credentials) {
    const response = await api.post('/api/login-db', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/api/register-db', userData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('authToken');
  }
};

// Key Services
export const keyService = {
  async redeemKey(keyData) {
    const response = await api.post('/api/keys/redeem', keyData);
    return response.data;
  }
};

// Admin Services
export const adminService = {
  async getKeys() {
    const response = await api.get(API_CONFIG.ENDPOINTS.ADMIN_KEYS);
    return response.data;
  },

  async createKeys(keyData) {
    const response = await api.post(API_CONFIG.ENDPOINTS.ADMIN_KEYS, keyData);
    return response.data;
  },

  async getUsers() {
    const response = await api.get(API_CONFIG.ENDPOINTS.ADMIN_USERS);
    return response.data;
  },

  async manageUsers(userData) {
    const response = await api.post(API_CONFIG.ENDPOINTS.ADMIN_MANAGE_USERS, userData);
    return response.data;
  },

  async getAnalytics() {
    const response = await api.get(API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS);
    return response.data;
  },

  async uploadTokens(formData) {
    const response = await api.post(API_CONFIG.ENDPOINTS.ADMIN_UPLOAD_TOKENS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// Token Services
export const tokenService = {
  async generateToken() {
    const response = await api.post(API_CONFIG.ENDPOINTS.GENERATE_TOKEN);
    return response.data;
  },

  async getToken() {
    const response = await api.get(API_CONFIG.ENDPOINTS.GET_TOKEN);
    return response.data;
  },

  async getNextToken() {
    const response = await api.post(API_CONFIG.ENDPOINTS.GET_NEXT_TOKEN);
    return response.data;
  }
};

// Login Code Services
export const loginCodeService = {
  async generateLoginCode() {
    const response = await api.post(API_CONFIG.ENDPOINTS.GENERATE_LOGIN_CODE);
    return response.data;
  },

  async getDailyLogin() {
    const response = await api.get(API_CONFIG.ENDPOINTS.GET_DAILY_LOGIN);
    return response.data;
  }
};

// User Services
export const userService = {
  async getRequests() {
    const response = await api.get(API_CONFIG.ENDPOINTS.USER_REQUESTS);
    return response.data;
  },

  async getTransactions() {
    const response = await api.get(API_CONFIG.ENDPOINTS.USER_TRANSACTIONS);
    return response.data;
  },

  async getBalance() {
    const response = await api.get(API_CONFIG.ENDPOINTS.USER_BALANCE);
    return response.data;
  }
};

// Utility Services
export const utilityService = {
  async healthCheck() {
    const response = await api.get(API_CONFIG.ENDPOINTS.HEALTH);
    return response.data;
  },

  async testConnection() {
    const response = await api.get(API_CONFIG.ENDPOINTS.TEST_CONNECT);
    return response.data;
  },

  async checkSchema() {
    const response = await api.get(API_CONFIG.ENDPOINTS.CHECK_SCHEMA);
    return response.data;
  }
};

export default api;
