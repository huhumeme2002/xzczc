// Test API endpoints trực tiếp để debug database
const API_BASE = 'https://api-functions-q81r2sspq-khanhs-projects-3f746af3.vercel.app';

async function testAPI() {
  console.log('🔌 Testing API endpoints...\n');

  // 1. Test health check
  try {
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${API_BASE}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // 2. Test database connection
  try {
    console.log('\n2. Testing database connection...');
    const testResponse = await fetch(`${API_BASE}/api/test-connect`);
    const testData = await testResponse.json();
    console.log('✅ Database connection:', testData);
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
  }

  // 3. Test schema check
  try {
    console.log('\n3. Testing schema check...');
    const schemaResponse = await fetch(`${API_BASE}/api/check-schema`);
    const schemaData = await schemaResponse.json();
    console.log('✅ Schema check:', schemaData);
  } catch (error) {
    console.log('❌ Schema check failed:', error.message);
  }

  // 4. Test login endpoint (với dummy data để xem response)
  try {
    console.log('\n4. Testing login endpoint...');
    const loginResponse = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test',
        password: 'test'
      })
    });
    const loginData = await loginResponse.json();
    console.log(`📊 Login response (${loginResponse.status}):`, loginData);
  } catch (error) {
    console.log('❌ Login test failed:', error.message);
  }

  // 5. Test key redeem endpoint (without auth để xem response format)
  try {
    console.log('\n5. Testing redeem key endpoint...');
    const redeemResponse = await fetch(`${API_BASE}/api/keys/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: 'TEST-KEY'
      })
    });
    const redeemData = await redeemResponse.json();
    console.log(`📊 Redeem response (${redeemResponse.status}):`, redeemData);
  } catch (error) {
    console.log('❌ Redeem test failed:', error.message);
  }

  // 6. Test với auth header (dummy token)
  try {
    console.log('\n6. Testing with auth header...');
    const authResponse = await fetch(`${API_BASE}/api/keys/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dummy-token'
      },
      body: JSON.stringify({
        key: 'TEST-KEY'
      })
    });
    const authData = await authResponse.json();
    console.log(`📊 Auth response (${authResponse.status}):`, authData);
  } catch (error) {
    console.log('❌ Auth test failed:', error.message);
  }

  console.log('\n✅ API testing completed!');
}

// Sử dụng Node.js built-in fetch (Node 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ for built-in fetch');
  process.exit(1);
}

testAPI().catch(console.error);
