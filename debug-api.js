const axios = require('axios');

const API_BASE = 'https://api-functions-4ks6qhlis-khanhs-projects-3f746af3.vercel.app';

async function debugRegistration() {
  console.log('🔍 Debugging Registration API\n');
  
  try {
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,  
      password: 'testpass123'
    };
    
    console.log('📝 Test user data:', testUser);
    console.log('🔗 API endpoint:', `${API_BASE}/api/auth/register`);
    
    const response = await axios.post(`${API_BASE}/api/auth/register`, testUser, {
      validateStatus: () => true // Accept all status codes
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📋 Response data:', response.data);
    console.log('📄 Response headers:', response.headers);
    
  } catch (error) {
    console.error('❌ Full error details:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
      console.error('   Headers:', error.response.headers);
    }
  }
}

debugRegistration();