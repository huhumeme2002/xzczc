// Test script cho admin unblock functionality

async function testAdminUnblock() {
  console.log('🧪 Testing Admin Unblock Functionality');

  // Cần JWT token của admin để test
  const adminToken = 'YOUR_ADMIN_JWT_TOKEN_HERE'; // Thay bằng token thực của admin
  
  if (adminToken === 'YOUR_ADMIN_JWT_TOKEN_HERE') {
    console.log('❌ Vui lòng cập nhật adminToken trong script với JWT token thực của admin');
    console.log('💡 Bạn có thể lấy token từ:');
    console.log('   1. Login vào tài khoản admin trên frontend');
    console.log('   2. Mở Developer Tools > Application > Local Storage');
    console.log('   3. Copy giá trị của key "token"');
    return;
  }

  try {
    console.log('\n1️⃣ Testing GET blocked users...');
    
    // Test GET blocked users
    const getResponse = await fetch('https://api-functions-blue.vercel.app/api/admin-blocked-users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (getResponse.ok) {
      const blockedData = await getResponse.json();
      console.log('✅ GET blocked users successful');
      console.log(`   Found ${blockedData.blockedUsers.length} blocked users`);
      
      if (blockedData.blockedUsers.length > 0) {
        const testUser = blockedData.blockedUsers[0];
        console.log(`   Test user: ${testUser.username} (ID: ${testUser.user_id})`);
        
        console.log('\n2️⃣ Testing RESET action...');
        
        // Test reset action
        const resetResponse = await fetch('https://api-functions-blue.vercel.app/api/admin-blocked-users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            targetUserId: testUser.user_id,
            action: 'reset'
          })
        });

        if (resetResponse.ok) {
          const resetData = await resetResponse.json();
          console.log('✅ RESET action successful');
          console.log(`   Message: ${resetData.message}`);
        } else {
          const resetError = await resetResponse.json();
          console.log('❌ RESET action failed');
          console.log(`   Error: ${resetError.error}`);
        }

        console.log('\n3️⃣ Testing UNBLOCK action...');
        
        // Test unblock action  
        const unblockResponse = await fetch('https://api-functions-blue.vercel.app/api/admin-blocked-users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            targetUserId: testUser.user_id,
            action: 'unblock'
          })
        });

        if (unblockResponse.ok) {
          const unblockData = await unblockResponse.json();
          console.log('✅ UNBLOCK action successful');
          console.log(`   Message: ${unblockData.message}`);
        } else {
          const unblockError = await unblockResponse.json();
          console.log('❌ UNBLOCK action failed');
          console.log(`   Error: ${unblockError.error}`);
        }

      } else {
        console.log('ℹ️ No blocked users found to test with');
      }
    } else {
      const getError = await getResponse.json();
      console.log('❌ GET blocked users failed');
      console.log(`   Error: ${getError.error}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test
testAdminUnblock();