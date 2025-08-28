// Local database test script
// This tests database operations without requiring a real database connection

const mockDb = {
  users: [
    { id: 1, username: 'testuser', email: 'test@example.com', credits: 0, created_at: new Date() }
  ],
  keys: [
    { id: 1, key_code: 'KEY-TEST123', credits_value: 100, is_used: false, created_at: new Date() }
  ],
  redemptions: [],
  transactions: []
};

class MockDatabase {
  async testConnection() {
    console.log('🔄 Testing mock database connection...');
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    console.log('✅ Mock database connection successful');
    return true;
  }

  async createUser(username, email, passwordHash) {
    console.log('🔄 Creating user:', { username, email });
    const user = {
      id: mockDb.users.length + 1,
      username,
      email,
      password_hash: passwordHash,
      credits: 0,
      role: 'user',
      is_active: true,
      created_at: new Date()
    };
    mockDb.users.push(user);
    console.log('✅ User created:', { id: user.id, username: user.username });
    return user;
  }

  async findUserByUsername(username) {
    const user = mockDb.users.find(u => u.username === username && u.is_active);
    console.log(`🔍 Finding user by username "${username}":`, user ? '✅ Found' : '❌ Not found');
    return user;
  }

  async findKeyByCode(keyCode) {
    const key = mockDb.keys.find(k => k.key_code === keyCode && !k.is_used);
    console.log(`🔍 Finding key "${keyCode}":`, key ? '✅ Found' : '❌ Not found');
    return key;
  }

  async markKeyAsUsed(keyId, userId) {
    const key = mockDb.keys.find(k => k.id === keyId);
    if (key) {
      key.is_used = true;
      key.used_by_user_id = userId;
      key.used_at = new Date();
      console.log('✅ Key marked as used:', keyId);
    }
  }

  async updateUserCredits(userId, newCredits) {
    const user = mockDb.users.find(u => u.id === userId);
    if (user) {
      const oldCredits = user.credits;
      user.credits = newCredits;
      console.log(`💰 User credits updated: ${oldCredits} → ${newCredits}`);
    }
  }

  async recordCreditTransaction(userId, type, amount, description) {
    const transaction = {
      id: mockDb.transactions.length + 1,
      user_id: userId,
      transaction_type: type,
      amount,
      description,
      created_at: new Date()
    };
    mockDb.transactions.push(transaction);
    console.log('📝 Credit transaction recorded:', { type, amount, description });
    return transaction;
  }

  async getStats() {
    const stats = {
      totalUsers: mockDb.users.length,
      activeUsers: mockDb.users.filter(u => u.is_active).length,
      totalKeys: mockDb.keys.length,
      usedKeys: mockDb.keys.filter(k => k.is_used).length,
      totalCredits: mockDb.users.reduce((sum, u) => sum + u.credits, 0)
    };
    console.log('📊 Database stats:', stats);
    return stats;
  }
}

// Test scenarios
async function runTests() {
  const db = new MockDatabase();
  
  console.log('🧪 Starting Database Tests\n');
  
  try {
    // Test 1: Connection
    console.log('1️⃣ Testing Connection');
    await db.testConnection();
    
    // Test 2: User Registration
    console.log('\n2️⃣ Testing User Registration');
    const newUser = await db.createUser('newuser', 'newuser@example.com', 'hashedpassword123');
    
    // Test 3: User Lookup
    console.log('\n3️⃣ Testing User Lookup');
    const foundUser = await db.findUserByUsername('newuser');
    const notFoundUser = await db.findUserByUsername('nonexistent');
    
    // Test 4: Key Redemption
    console.log('\n4️⃣ Testing Key Redemption');
    const key = await db.findKeyByCode('KEY-TEST123');
    if (key) {
      await db.markKeyAsUsed(key.id, newUser.id);
      const currentCredits = newUser.credits;
      const newCredits = currentCredits + key.credits_value;
      await db.updateUserCredits(newUser.id, newCredits);
      await db.recordCreditTransaction(newUser.id, 'earned', key.credits_value, 'Key redemption: KEY-TEST123');
    }
    
    // Test 5: Statistics
    console.log('\n5️⃣ Testing Statistics');
    await db.getStats();
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Final Mock Database State:');
    console.log('Users:', mockDb.users.length);
    console.log('Keys:', mockDb.keys.length);
    console.log('Transactions:', mockDb.transactions.length);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { MockDatabase, runTests };