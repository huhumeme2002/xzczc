const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testBackend() {
  console.log('🧪 Testing Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // Test 2: Register a test user
    console.log('2. Testing user registration...');
    const registerData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword123'
    };
    
    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
      console.log('✅ Registration successful:', registerResponse.data);
      
      const token = registerResponse.data.token;
      console.log('');

      // Test 3: Redeem a key
      console.log('3. Testing key redemption...');
      const keyData = { key: 'KEY-TESTKEY123' };
      const redeemResponse = await axios.post(
        `${API_BASE}/keys/redeem`, 
        keyData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Key redeemed:', redeemResponse.data);
      console.log('');

      // Test 4: Check balance
      console.log('4. Testing balance check...');
      const balanceResponse = await axios.get(
        `${API_BASE}/keys/balance`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Balance:', balanceResponse.data);
      console.log('');

      // Test 5: Generate token
      console.log('5. Testing token generation...');
      const tokenResponse = await axios.post(
        `${API_BASE}/tokens/generate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Token generated:', tokenResponse.data);
      console.log('');

      // Test 6: Get token history
      console.log('6. Testing token history...');
      const historyResponse = await axios.get(
        `${API_BASE}/tokens/history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Token history:', historyResponse.data);
      console.log('');

      console.log('🎉 All tests passed successfully!');
      
    } catch (error) {
      if (error.response?.data?.error === 'Username already exists') {
        console.log('ℹ️ Test user already exists, testing with existing user...');
        
        // Try to login instead
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          username: registerData.username,
          password: registerData.password
        });
        console.log('✅ Login successful:', loginResponse.data);
        console.log('');
        
        const token = loginResponse.data.token;
        
        // Test balance with existing user
        const balanceResponse = await axios.get(
          `${API_BASE}/keys/balance`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('✅ Current balance:', balanceResponse.data);
        console.log('');
        
        console.log('✅ Backend is working correctly!');
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testBackend();
}

module.exports = testBackend;
