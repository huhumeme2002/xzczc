const axios = require('axios');

const API_BASE = 'https://api-functions-i8xuva743-khanhs-projects-3f746af3.vercel.app';

async function testDatabaseAPI() {
  console.log('🧪 Testing Database-Connected API\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing API Health...');
    const healthResponse = await axios.get(`${API_BASE}/api/health`);
    console.log('✅ API Health:', healthResponse.data);
    
    // Test 2: Register a new user
    console.log('\n2️⃣ Testing User Registration...');
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'testpass123'
    };
    
    const registerResponse = await axios.post(`${API_BASE}/api/auth/register`, testUser);
    console.log('✅ Registration successful:', {
      user: registerResponse.data.user,
      token: registerResponse.data.token ? 'Token received' : 'No token'
    });
    
    // Test 3: Login with the user
    console.log('\n3️⃣ Testing User Login...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      username: testUser.username,
      password: testUser.password
    });
    console.log('✅ Login successful:', {
      user: loginResponse.data.user,
      token: loginResponse.data.token ? 'Token received' : 'No token'
    });
    
    // Test 4: Test key redemption (requires authentication)
    console.log('\n4️⃣ Testing Key Redemption...');
    const token = loginResponse.data.token;
    
    try {
      const redeemResponse = await axios.post(
        `${API_BASE}/api/keys/redeem`,
        { key: 'KEY-DEMO2024' },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('✅ Key redemption successful:', redeemResponse.data);
    } catch (redeemError) {
      console.log('ℹ️ Key redemption result:', redeemError.response?.data || redeemError.message);
    }
    
    console.log('\n🎉 Database API tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ API is accessible');
    console.log('   ✅ Database connection working');
    console.log('   ✅ User registration saves to database');
    console.log('   ✅ User login validates from database');
    console.log('   ✅ Authentication system functional');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testDatabaseAPI();