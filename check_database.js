const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_67BPVAIWZEDg@ep-wispy-fog-adt9noug-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function checkDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to Neon database');

    // 1. Liệt kê tất cả bảng
    console.log('\n📋 DANH SÁCH BẢNG:');
    const tablesResult = await client.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name} (${row.column_count} columns)`);
    });

    // 2. Kiểm tra bảng users
    console.log('\n👤 BẢNG USERS:');
    const usersColumns = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    
    if (usersColumns.rows.length > 0) {
      console.log('  Columns:');
      usersColumns.rows.forEach(col => {
        console.log(`    - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
      });

      // Kiểm tra có expiry_time không
      const hasExpiry = usersColumns.rows.find(col => col.column_name === 'expiry_time');
      if (hasExpiry) {
        console.log('  ✅ expiry_time column EXISTS');
      } else {
        console.log('  ❌ expiry_time column MISSING');
      }

      // Sample user data
      const sampleUsers = await client.query('SELECT id, username, requests, expiry_time, is_expired FROM users LIMIT 3');
      console.log('  Sample data:');
      sampleUsers.rows.forEach(user => {
        console.log(`    - ID: ${user.id}, User: ${user.username}, Requests: ${user.requests}, Expiry: ${user.expiry_time}, Expired: ${user.is_expired}`);
      });
    } else {
      console.log('  ❌ users table NOT FOUND');
    }

    // 3. Kiểm tra bảng predefined_keys
    console.log('\n🔑 BẢNG PREDEFINED_KEYS:');
    const keysCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('predefined_keys', 'keys', 'user_keys');
    `);
    
    if (keysCheck.rows.length > 0) {
      const keyTableName = keysCheck.rows[0].table_name;
      console.log(`  Found table: ${keyTableName}`);
      
      const keysColumns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position;
      `, [keyTableName]);
      
      console.log('  Columns:');
      keysColumns.rows.forEach(col => {
        console.log(`    - ${col.column_name}: ${col.data_type}`);
      });

      // Kiểm tra có expiry_hours không
      const hasExpiryHours = keysColumns.rows.find(col => col.column_name === 'expiry_hours');
      if (hasExpiryHours) {
        console.log('  ✅ expiry_hours column EXISTS');
      } else {
        console.log('  ❌ expiry_hours column MISSING');
      }

      // Sample keys
      const sampleKeys = await client.query(`SELECT * FROM ${keyTableName} LIMIT 3`);
      console.log('  Sample keys:');
      sampleKeys.rows.forEach(key => {
        console.log(`    - ${JSON.stringify(key)}`);
      });
    } else {
      console.log('  ❌ No key table found (predefined_keys, keys, user_keys)');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 Disconnected from database');
  }
}

checkDatabase();