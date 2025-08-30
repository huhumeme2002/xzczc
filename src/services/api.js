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
    console.log('🔗 API Request:', {
      fullUrl: config.baseURL + config.url,
      method: config.method.toUpperCase(),
      hasToken: !!token,
      headers: config.headers
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request headers');
    } else {
      console.log('⚠️ No auth token found - this might cause 401 errors');
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
  async getKeys(params = {}) {
    const response = await api.get(API_CONFIG.ENDPOINTS.ADMIN_KEYS, { params });
    return response.data;
  },

  async createKeys(keyData) {
    const response = await api.post(API_CONFIG.ENDPOINTS.ADMIN_GENERATE_KEYS, keyData);
    return response.data;
  },

  async getUsers(params = {}) {
    const response = await api.get(API_CONFIG.ENDPOINTS.ADMIN_USERS, { params });
    return response.data;
  },

  async updateUser(userId, updates) {
    const response = await api.put(API_CONFIG.ENDPOINTS.ADMIN_USERS, { userId, updates });
    return response.data;
  },

  async adjustUserRequests(userId, amount, description) {
    const response = await api.post(API_CONFIG.ENDPOINTS.ADMIN_USERS, {
      action: 'adjust_requests',
      userId,
      amount,
      description: description || `Admin adjusted requests by ${amount}`
    });
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

  async getDashboard() {
    const response = await api.get(API_CONFIG.ENDPOINTS.ADMIN_MANAGE_USERS);
    return response.data;
  },

  async uploadTokens(formData) {
    const response = await api.post(API_CONFIG.ENDPOINTS.ADMIN_UPLOAD_TOKENS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getUploadedTokens(params = {}) {
    const response = await api.get(API_CONFIG.ENDPOINTS.ADMIN_UPLOAD_TOKENS, { params });
    return response.data;
  },

  async getBlockedUsers() {
    const response = await api.get(API_CONFIG.ENDPOINTS.ADMIN_BLOCKED_USERS);
    return response.data;
  },

  async unblockUser(targetUserId) {
    const response = await api.post(`${API_CONFIG.ENDPOINTS.ADMIN_BLOCKED_USERS}/unblock`, { targetUserId });
    return response.data;
  },

  async resetUserAttempts(targetUserId) {
    const response = await api.post(`${API_CONFIG.ENDPOINTS.ADMIN_BLOCKED_USERS}/reset`, { targetUserId });
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

// Notification Services
export const notificationService = {
  async sendNotification(notificationData) {
    const response = await api.post(API_CONFIG.ENDPOINTS.ADMIN_NOTIFICATIONS, notificationData);
    return response.data;
  },

  async getNotifications() {
    const response = await api.get(API_CONFIG.ENDPOINTS.ADMIN_NOTIFICATIONS);
    return response.data;
  }
};

// User Services
export const userService = {
  async getProfile() {
    const response = await api.get(API_CONFIG.ENDPOINTS.USER_PROFILE);
    return response.data;
  },

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
