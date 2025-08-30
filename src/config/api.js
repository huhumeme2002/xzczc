// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://backend-2f3n9w5nq-khanhs-projects-3f746af3.vercel.app',
  ENDPOINTS: {
    // Authentication (using database endpoints)
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',

    // Keys & Credits
    REDEEM_KEY: '/api/keys/redeem',

    // Token Generation
    GENERATE_TOKEN: '/api/tokens/generate',
    GET_TOKEN: '/api/tokens/get',
    GET_NEXT_TOKEN: '/api/tokens/next',

    // Login Codes
    GENERATE_LOGIN_CODE: '/api/tokens/generate-login-code',
    GET_DAILY_LOGIN: '/api/tokens/daily-login',

    // Admin
    ADMIN_KEYS: '/api/admin/keys',
    ADMIN_USERS: '/api/admin/users',
    ADMIN_ANALYTICS: '/api/admin/analytics',
    ADMIN_UPLOAD_TOKENS: '/api/admin/upload-tokens',
    ADMIN_MANAGE_USERS: '/api/admin/manage-users',
    ADMIN_CREATE_KEY: '/api/admin/create-key',
    ADMIN_GENERATE_KEYS: '/api/admin/generate-keys',
    ADMIN_BLOCKED_USERS: '/api/admin/blocked-users',

    // User Data (using requests-based endpoints)
    USER_REQUESTS: '/api/keys/balance',
    USER_TRANSACTIONS: '/api/keys/transactions',
    USER_BALANCE: '/api/keys/balance',

    // Utility
    HEALTH: '/health',
    TEST_CONNECT: '/api/test',
    CHECK_SCHEMA: '/api/admin/schema'
  }
};

export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
