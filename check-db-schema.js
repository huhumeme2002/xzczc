const { Pool } = require('pg');

async function checkSchema() {
  const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_67BPVAIWZEDg@ep-wispy-fog-adt9noug-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
  });

  let client;
  try {
    client = await pool.connect();
    console.log('✅ Connected to database');

    // List all tables
    console.log('\n📋 TABLES:');
    const tablesRes = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    for (const row of tablesRes.rows) {
      console.log(`- ${row.table_name}`);
    }

    // Check each table structure
    for (const row of tablesRes.rows) {
      const tableName = row.table_name;
      console.log(`\n🔍 TABLE: ${tableName.toUpperCase()}`);
      
      const colsRes = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);
      
      for (const col of colsRes.rows) {
        console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default || 'NULL'})`);
      }

      // Sample data
      console.log(`\n📊 SAMPLE DATA (first 3 rows):`);
      try {
        const sampleRes = await client.query(`SELECT * FROM ${tableName} LIMIT 3`);
        if (sampleRes.rows.length > 0) {
          console.log(JSON.stringify(sampleRes.rows, null, 2));
        } else {
          console.log('  (no data)');
        }
      } catch (err) {
        console.log(`  Error: ${err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

checkSchema();