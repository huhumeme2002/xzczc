const axios = require('axios');

const LOCAL_BACKEND = 'http://localhost:5000';

async function testLocalBackend() {
  console.log('🧪 Testing Local Backend\n');
  
  try {
    // Test health
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${LOCAL_BACKEND}/health`);
    console.log('✅ Health check passed');
    console.log('   Response:', healthResponse.data);

    // Test registration
    console.log('\n2. Testing registration...');
    const testUser = {
      username: 'testuser123',
      email: 'test@example.com',
      password: 'password123'
    };

    const registerResponse = await axios.post(`${LOCAL_BACKEND}/api/auth/register`, testUser);
    console.log('✅ Registration successful!');
    console.log('   User:', registerResponse.data.user);
    console.log('   Token received:', registerResponse.data.token ? 'Yes' : 'No');

    // Test login
    console.log('\n3. Testing login...');
    const loginResponse = await axios.post(`${LOCAL_BACKEND}/api/auth/login`, {
      username: testUser.username,
      password: testUser.password
    });
    console.log('✅ Login successful!');
    console.log('   User:', loginResponse.data.user);

    // Test key redemption
    console.log('\n4. Testing key redemption...');
    const keyResponse = await axios.post(`${LOCAL_BACKEND}/api/keys/redeem`, {
      key: 'KEY-DEMO2024'
    });
    console.log('✅ Key redemption successful!');
    console.log('   Credits awarded:', keyResponse.data.creditsAwarded);

    console.log('\n🎉 All tests passed! Backend is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testLocalBackend();