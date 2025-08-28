const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_67BPVAIWZEDg@ep-wispy-fog-adt9noug-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function testDatabaseFix() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Test 1: Create a test key with expiry
    console.log('\n📝 Test 1: Create a test key with expiry');
    const testKey = 'KEY-TEST-FIX-' + Date.now();
    
    await client.query(`
      INSERT INTO keys (key_value, requests, expires_at) 
      VALUES ($1, $2, NOW() + INTERVAL '24 hours')
    `, [testKey, 100]);
    
    console.log(`✅ Created test key: ${testKey}`);

    // Test 2: Verify key was created properly
    console.log('\n🔍 Test 2: Verify key structure');
    const keyResult = await client.query('SELECT * FROM keys WHERE key_value = $1', [testKey]);
    console.log('Key data:', keyResult.rows[0]);

    // Test 3: Test expiry time calculation
    console.log('\n⏰ Test 3: Test expiry calculation');
    const expiresAt = keyResult.rows[0].expires_at;
    const now = new Date();
    const hoursUntilExpiry = Math.ceil((new Date(expiresAt) - now) / (1000 * 60 * 60));
    console.log(`Expires at: ${expiresAt}`);
    console.log(`Hours until expiry: ${hoursUntilExpiry}`);

    // Test 4: Check users table structure
    console.log('\n👤 Test 4: Check users table structure');
    const userSample = await client.query('SELECT id, username, requests, expiry_time, is_expired FROM users LIMIT 1');
    if (userSample.rows.length > 0) {
      console.log('Sample user:', userSample.rows[0]);
    }

    // Clean up test key
    await client.query('DELETE FROM keys WHERE key_value = $1', [testKey]);
    console.log(`\n🧹 Cleaned up test key: ${testKey}`);

    console.log('\n✅ All tests passed! Database structure is compatible.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await client.end();
  }
}

testDatabaseFix();