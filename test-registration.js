const axios = require('axios');

const BACKEND_URL = 'https://backend-iyt313fpe-khanhs-projects-3f746af3.vercel.app';
const BYPASS_TOKEN = 'e3e6959adf9e58ccc4e896d6d0a37656';

// Test user data
const testUser = {
  username: 'testuser123',
  email: 'test@example.com',
  password: 'password123'
};

async function testRegistration() {
  console.log('🧪 Testing Backend Registration Process\n');
  
  try {
    // Test 1: Check if backend is accessible
    console.log('1. Testing backend health...');
    try {
      const healthUrl = `${BACKEND_URL}/health?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${BYPASS_TOKEN}`;
      const healthResponse = await axios.get(healthUrl, { 
        timeout: 10000,
        validateStatus: () => true 
      });
      
      if (healthResponse.status === 200) {
        console.log('✅ Backend health check passed');
        console.log('   Environment variables:', JSON.stringify(healthResponse.data.env_vars, null, 2));
      } else {
        console.log(`❌ Backend health check failed - Status: ${healthResponse.status}`);
        console.log('   Response:', healthResponse.data?.slice?.(0, 200) + '...');
      }
    } catch (error) {
      console.log(`❌ Backend health check error: ${error.message}`);
    }

    // Test 2: Test database connection
    console.log('\n2. Testing database connection...');
    try {
      const dbUrl = `${BACKEND_URL}/api/test-db?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${BYPASS_TOKEN}`;
      const dbResponse = await axios.get(dbUrl, { 
        timeout: 10000,
        validateStatus: () => true 
      });
      
      if (dbResponse.status === 200) {
        console.log('✅ Database connection successful');
        console.log('   Response:', dbResponse.data);
      } else {
        console.log(`❌ Database connection failed - Status: ${dbResponse.status}`);
        console.log('   Error:', dbResponse.data);
      }
    } catch (error) {
      console.log(`❌ Database test error: ${error.message}`);
    }

    // Test 3: Test registration endpoint
    console.log('\n3. Testing registration endpoint...');
    try {
      const registerUrl = `${BACKEND_URL}/api/auth/register?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${BYPASS_TOKEN}`;
      const registerResponse = await axios.post(registerUrl, testUser, { 
        timeout: 10000,
        validateStatus: () => true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`📝 Registration attempt - Status: ${registerResponse.status}`);
      
      if (registerResponse.status === 201) {
        console.log('✅ Registration successful!');
        console.log('   User created:', registerResponse.data.user);
        console.log('   Token received:', registerResponse.data.token ? 'Yes' : 'No');
      } else if (registerResponse.status === 400) {
        console.log('❌ Registration failed - Bad request');
        console.log('   Error details:', JSON.stringify(registerResponse.data, null, 2));
      } else if (registerResponse.status === 500) {
        console.log('❌ Registration failed - Server error');
        console.log('   Error details:', JSON.stringify(registerResponse.data, null, 2));
      } else {
        console.log('❌ Registration failed - Unexpected status');
        console.log('   Response:', registerResponse.data);
      }
    } catch (error) {
      console.log(`❌ Registration request error: ${error.message}`);
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Data:', error.response.data);
      }
    }

    // Test 4: Test login endpoint
    console.log('\n4. Testing login endpoint...');
    try {
      const loginUrl = `${BACKEND_URL}/api/auth/login?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${BYPASS_TOKEN}`;
      const loginResponse = await axios.post(loginUrl, {
        username: testUser.username,
        password: testUser.password
      }, { 
        timeout: 10000,
        validateStatus: () => true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`🔐 Login attempt - Status: ${loginResponse.status}`);
      
      if (loginResponse.status === 200) {
        console.log('✅ Login successful!');
      } else {
        console.log('❌ Login failed');
        console.log('   Error details:', JSON.stringify(loginResponse.data, null, 2));
      }
    } catch (error) {
      console.log(`❌ Login request error: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Test suite error:', error.message);
  }
}

// Run the test
testRegistration()
  .then(() => console.log('\n🏁 Registration test completed'))
  .catch(error => console.error('❌ Test failed:', error));