// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://api-functions-q81r2sspq-khanhs-projects-3f746af3.vercel.app',
  ENDPOINTS: {
    // Authentication (using database endpoints)
    LOGIN: '/api/login-db',
    REGISTER: '/api/register-db',
    
    // Keys & Credits
    REDEEM_KEY: '/api/keys/redeem', // Using routing from vercel.json
    
    // Token Generation  
    GENERATE_TOKEN: '/api/generate-token',
    GET_TOKEN: '/api/get-token',
    GET_NEXT_TOKEN: '/api/get-next-token',
    
    // Login Codes
    GENERATE_LOGIN_CODE: '/api/generate-login-code',
    GET_DAILY_LOGIN: '/api/get-daily-login',
    
    // Admin
    ADMIN_KEYS: '/api/admin-keys',
    ADMIN_USERS: '/api/admin-users',
    ADMIN_ANALYTICS: '/api/admin-analytics',
    ADMIN_UPLOAD_TOKENS: '/api/admin-upload-tokens',
    ADMIN_MANAGE_USERS: '/api/admin-manage-users',
    ADMIN_CREATE_KEY: '/api/admin-create-key',
    ADMIN_GENERATE_KEYS: '/api/admin-generate-keys',
    
    // User Data (using credit-based endpoints)
    USER_CREDITS: '/api/user-credits',
    USER_TRANSACTIONS: '/api/user-transactions',
    USER_BALANCE: '/api/user-balance',
    
    // Utility
    HEALTH: '/api/health',
    TEST_CONNECT: '/api/test-connect',
    CHECK_SCHEMA: '/api/check-schema'
  }
};

export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
