const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function fullTest() {
  console.log('🧪 Full System Test...\n');

  try {
    // Register new user with unique username
    const uniqueId = Date.now();
    const testUser = {
      username: `user${uniqueId}`,
      email: `user${uniqueId}@example.com`,
      password: 'password123'
    };

    console.log('1. Registering new user...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
    console.log('✅ Registration successful!');
    
    const token = registerResponse.data.token;

    // Test key redemption
    console.log('\n2. Redeeming key...');
    const keyResponse = await axios.post(
      `${API_BASE}/keys/redeem`,
      { key: `KEY-TEST${uniqueId}` },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`✅ Key redeemed! Awarded ${keyResponse.data.creditsAwarded} credits`);

    // Test token generation  
    console.log('\n3. Generating token...');
    const tokenGenResponse = await axios.post(
      `${API_BASE}/tokens/generate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`✅ Token generated: ${tokenGenResponse.data.token}`);

    // Test balance
    console.log('\n4. Checking final balance...');
    const balanceResponse = await axios.get(
      `${API_BASE}/keys/balance`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`✅ Final balance: ${balanceResponse.data.credits} credits`);

    // Test transaction history
    console.log('\n5. Getting transaction history...');
    const transactionResponse = await axios.get(
      `${API_BASE}/keys/transactions`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`✅ Found ${transactionResponse.data.transactions.length} transactions`);

    // Test token history
    console.log('\n6. Getting token history...');
    const tokenHistoryResponse = await axios.get(
      `${API_BASE}/tokens/history`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`✅ Found ${tokenHistoryResponse.data.tokens.length} tokens`);

    console.log('\n🎉 Full system test completed successfully!');
    console.log('✅ All features are working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

fullTest();
