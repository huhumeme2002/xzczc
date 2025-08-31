// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://api-functions-q81r2sspq-khanhs-projects-3f746af3.vercel.app',
  ENDPOINTS: {
    // Authentication (using database endpoints)
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',

    // Keys & Credits
    REDEEM_KEY: '/api/redeem-key-new',

    // Token Generation
    GENERATE_TOKEN: '/api/generate-token',
    GET_TOKEN: '/api/get-token-new',
    GET_NEXT_TOKEN: '/api/get-next-token',

    // Login Codes
    GENERATE_LOGIN_CODE: '/api/generate-login-code',
    GET_DAILY_LOGIN: '/api/get-daily-login',
    GLOBAL_LOGIN_CODE: '/api/global-login-code-new',

    // Admin
    ADMIN_KEYS: '/api/admin/keys',
    ADMIN_USERS: '/api/admin/users',
    ADMIN_ANALYTICS: '/api/admin/analytics',
    ADMIN_UPLOAD_TOKENS: '/api/admin/upload-tokens',
    ADMIN_MANAGE_USERS: '/api/admin/manage-users',
    ADMIN_MANAGE_USER_EXPIRY: '/api/admin/manage-user-expiry',
    ADMIN_NOTIFICATIONS: '/api/admin/notifications',
    ADMIN_CREATE_KEY: '/api/admin/create-admin',
    ADMIN_GENERATE_KEYS: '/api/admin/keys',
    ADMIN_BLOCKED_USERS: '/api/admin/blocked-users',

    // User Data (using requests-based endpoints)  
    USER_PROFILE: '/api/profile',
    USER_REQUESTS: '/api/user-requests',
    USER_TRANSACTIONS: '/api/user-transactions',
    USER_BALANCE: '/api/user-balance',

    // Utility
    HEALTH: '/health',
    TEST_CONNECT: '/api/test-connect',
    CHECK_SCHEMA: '/api/check-schema'
  }
};

export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
