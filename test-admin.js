const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAdmin() {
  console.log('🧪 Testing Admin Panel Features...\n');

  try {
    // 1. Create some test data first
    console.log('1. Setting up test data...');
    
    // Create a regular user
    const testUser = {
      username: `user${Date.now()}`,
      email: `user${Date.now()}@test.com`,
      password: 'password123'
    };
    
    const userResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
    const userToken = userResponse.data.token;
    const userId = userResponse.data.user.id;
    
    // Redeem some keys for test data
    await axios.post(
      `${API_BASE}/keys/redeem`,
      { key: `KEY-TEST${Date.now()}` },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    
    await axios.post(
      `${API_BASE}/tokens/generate`,
      {},
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    
    console.log('✅ Test data created');

    // 2. Admin login
    console.log('\n2. Testing admin login...');
    const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: 'admin123456'
    });
    
    const adminToken = adminLogin.data.token;
    console.log('✅ Admin login successful');

    // 3. Test system stats
    console.log('\n3. Testing system statistics...');
    const statsResponse = await axios.get(
      `${API_BASE}/analytics/stats`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log('✅ System stats:', statsResponse.data);

    // 4. Test user management
    console.log('\n4. Testing user management...');
    const usersResponse = await axios.get(
      `${API_BASE}/admin/users?limit=5`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log(`✅ Found ${usersResponse.data.users.length} users`);

    // 5. Test credit adjustment
    console.log('\n5. Testing credit adjustment...');
    const creditResponse = await axios.post(
      `${API_BASE}/admin/users/${userId}/credits`,
      { amount: 50, description: 'Test bonus credits' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log('✅ Credits adjusted:', creditResponse.data);

    // 6. Test analytics
    console.log('\n6. Testing analytics...');
    const [popularKeys, topUsers, recentActivity] = await Promise.all([
      axios.get(`${API_BASE}/analytics/popular-keys?limit=3`, { headers: { Authorization: `Bearer ${adminToken}` } }),
      axios.get(`${API_BASE}/analytics/top-users?limit=3`, { headers: { Authorization: `Bearer ${adminToken}` } }),
      axios.get(`${API_BASE}/analytics/recent-activity?limit=5`, { headers: { Authorization: `Bearer ${adminToken}` } })
    ]);

    console.log('✅ Popular keys:', popularKeys.data.keys.length);
    console.log('✅ Top users:', topUsers.data.users.length);
    console.log('✅ Recent activities:', recentActivity.data.activities.length);

    // 7. Test analytics report
    console.log('\n7. Testing comprehensive report...');
    const reportResponse = await axios.get(
      `${API_BASE}/analytics/report`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log('✅ Analytics report generated successfully');

    console.log('\n🎉 All admin tests passed successfully!');
    console.log('\n📊 Admin Panel Features Working:');
    console.log('  ✅ Admin authentication');
    console.log('  ✅ User management');
    console.log('  ✅ Credit adjustment');
    console.log('  ✅ System analytics');
    console.log('  ✅ Popular keys tracking');
    console.log('  ✅ User activity monitoring');

  } catch (error) {
    console.error('❌ Admin test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  setTimeout(() => {
    testAdmin();
  }, 2000); // Wait for server to start
}

module.exports = testAdmin;
