const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_67BPVAIWZEDg@ep-wispy-fog-adt9noug-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

async function debugDatabase() {
  let client;
  
  try {
    console.log('🔌 Đang kết nối database...');
    client = await pool.connect();
    console.log('✅ Kết nối thành công!');

    // 1. Check tables exist
    console.log('\n📋 Checking tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('users', 'keys', 'request_transactions')
      ORDER BY table_name
    `);
    
    console.log('Tables found:', tablesResult.rows.map(r => r.table_name));

    // 2. Check users table structure
    console.log('\n👤 Users table structure:');
    const usersStructure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    console.table(usersStructure.rows);

    // 3. Check keys table structure  
    console.log('\n🔑 Keys table structure:');
    const keysStructure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'keys' 
      ORDER BY ordinal_position
    `);
    console.table(keysStructure.rows);

    // 4. Check request_transactions table
    console.log('\n💰 Request_transactions table structure:');
    const transStructure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'request_transactions' 
      ORDER BY ordinal_position
    `);
    console.table(transStructure.rows);

    // 5. Sample data from users
    console.log('\n👥 Sample users:');
    const usersData = await client.query('SELECT id, username, requests, role FROM users LIMIT 5');
    console.table(usersData.rows);

    // 6. Sample available keys
    console.log('\n🔓 Available keys:');
    const keysData = await client.query(`
      SELECT id, key_value, requests, is_used, expires_at 
      FROM keys 
      WHERE is_used = false 
      LIMIT 5
    `);
    console.table(keysData.rows);

    // 7. Recent transactions
    console.log('\n📊 Recent transactions:');
    const transData = await client.query(`
      SELECT rt.id, u.username, rt.requests_amount, rt.description, rt.created_at 
      FROM request_transactions rt
      JOIN users u ON rt.user_id = u.id 
      ORDER BY rt.created_at DESC 
      LIMIT 5
    `);
    console.table(transData.rows);

    // 8. Insert a test key if no keys available
    if (keysData.rows.length === 0) {
      console.log('\n🆕 No available keys found. Creating test key...');
      const testKeyValue = 'TEST-KEY-' + Date.now();
      await client.query(`
        INSERT INTO keys (key_value, requests, expires_at) 
        VALUES ($1, 100, NOW() + INTERVAL '30 days')
      `, [testKeyValue]);
      console.log(`✅ Test key created: ${testKeyValue}`);
    }

    console.log('\n✅ Database debug completed!');

  } catch (error) {
    console.error('❌ Database error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

debugDatabase();
