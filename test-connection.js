const axios = require('axios');

// Test both frontend and backend connectivity
async function testConnections() {
  console.log('🔍 Testing Frontend and Backend Connectivity\n');
  
  // Frontend URLs to test
  const frontendURLs = [
    'https://aivannang-hpnrzwi8q-khanhs-projects-3f746af3.vercel.app',
    'https://aivannang.vercel.app'
  ];
  
  // Backend URLs to test
  const backendURLs = [
    'https://backend-iyt313fpe-khanhs-projects-3f746af3.vercel.app',
    'https://backend.vercel.app'
  ];
  
  // Test frontend
  console.log('📱 Testing Frontend URLs:');
  for (const url of frontendURLs) {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      console.log(`✅ ${url} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${url} - Error: ${error.message}`);
    }
  }
  
  console.log('\n🔧 Testing Backend URLs:');
  
  // Test backend health endpoints
  for (const baseUrl of backendURLs) {
    console.log(`\nTesting: ${baseUrl}`);
    
    // Test health endpoint
    try {
      const healthResponse = await axios.get(`${baseUrl}/health`, { timeout: 5000 });
      console.log(`✅ ${baseUrl}/health - Status: ${healthResponse.status}`);
      console.log(`   Response:`, JSON.stringify(healthResponse.data, null, 2));
    } catch (error) {
      console.log(`❌ ${baseUrl}/health - Error: ${error.message}`);
      
      // If protected, try with bypass token
      if (error.response?.status === 401 || error.message.includes('Authentication Required')) {
        console.log(`🔓 Trying with bypass token...`);
        try {
          const bypassUrl = `${baseUrl}/health?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=e3e6959adf9e58ccc4e896d6d0a37656`;
          const bypassResponse = await axios.get(bypassUrl, { timeout: 5000 });
          console.log(`✅ ${baseUrl}/health (with bypass) - Status: ${bypassResponse.status}`);
        } catch (bypassError) {
          console.log(`❌ ${baseUrl}/health (with bypass) - Error: ${bypassError.message}`);
        }
      }
    }
    
    // Test API auth endpoint
    try {
      const testData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123'
      };
      
      const authResponse = await axios.post(`${baseUrl}/api/auth/register`, testData, { 
        timeout: 5000,
        validateStatus: () => true // Accept all status codes
      });
      console.log(`📝 ${baseUrl}/api/auth/register - Status: ${authResponse.status}`);
      
      if (authResponse.status < 400) {
        console.log(`   Success: Registration endpoint accessible`);
      } else if (authResponse.status === 404) {
        console.log(`   Error: Endpoint not found - API routes may not be properly configured`);
      } else {
        console.log(`   Response:`, authResponse.data);
      }
    } catch (error) {
      console.log(`❌ ${baseUrl}/api/auth/register - Error: ${error.message}`);
    }
  }
}

// Run the test
testConnections()
  .then(() => console.log('\n🏁 Connection test completed'))
  .catch(error => console.error('❌ Test failed:', error));