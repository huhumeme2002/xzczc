// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://api-functions-q81r2sspq-khanhs-projects-3f746af3.vercel.app',
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/auth/login',
    LOGIN_DB: '/api/login-db',
    REGISTER: '/api/auth/register',
    REGISTER_DB: '/api/register-db',
    
    // Keys & Credits
    REDEEM_KEY: '/api/keys/redeem',
    
    // Admin
    ADMIN_KEYS: '/api/admin/keys',
    ADMIN_USERS: '/api/admin/users',
    ADMIN_ANALYTICS: '/api/admin/analytics',
    ADMIN_UPLOAD_TOKENS: '/api/admin/upload-tokens',
    ADMIN_MANAGE_USERS: '/api/admin/manage-users',
    
    // Tokens
    GENERATE_TOKEN: '/api/generate-token',
    CREATE_TEST_TOKEN: '/api/create-test-token',
    REDEEM_TOKEN: '/api/redeem-token',
    
    // Utility
    HEALTH: '/api/health',
    TEST_CONNECT: '/api/test-connect',
    CHECK_SCHEMA: '/api/check-schema'
  }
};

export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
