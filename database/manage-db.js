#!/usr/bin/env node

// Database management script for AiVanNang
require('dotenv').config();
const db = require('./db');

const commands = {
  // Initialize database tables
  init: async () => {
    console.log('🔄 Initializing database tables...');
    const success = await db.initializeTables();
    if (success) {
      console.log('✅ Database tables initialized successfully');
    } else {
      console.log('❌ Failed to initialize database tables');
      process.exit(1);
    }
  },

  // Test database connection
  test: async () => {
    console.log('🔄 Testing database connection...');
    const success = await db.testConnection();
    if (success) {
      console.log('✅ Database connection successful');
    } else {
      console.log('❌ Database connection failed');
      process.exit(1);
    }
  },

  // Get database statistics
  stats: async () => {
    console.log('🔄 Fetching database statistics...');
    try {
      const stats = await db.getStats();
      console.log('📊 Database Statistics:');
      console.log(`  Total Users: ${stats.totalUsers}`);
      console.log(`  Active Users: ${stats.activeUsers}`);
      console.log(`  Total Keys: ${stats.totalKeys}`);
      console.log(`  Used Keys: ${stats.usedKeys}`);
      console.log(`  Total Tokens: ${stats.totalTokens}`);
      console.log(`  Total Credits: ${stats.totalCredits}`);
    } catch (error) {
      console.error('❌ Failed to get statistics:', error.message);
      process.exit(1);
    }
  },

  // Create a new admin user
  'create-admin': async () => {
    const bcrypt = require('bcryptjs');
    const readline = require('readline');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const question = (prompt) => {
      return new Promise((resolve) => {
        rl.question(prompt, resolve);
      });
    };
    
    try {
      console.log('🔄 Creating admin user...');
      
      const username = await question('Admin username: ');
      const email = await question('Admin email: ');
      const password = await question('Admin password: ');
      
      if (!username || !email || !password) {
        console.log('❌ All fields are required');
        rl.close();
        return;
      }
      
      // Check if user already exists
      const existingUser = await db.findUserByUsername(username);
      if (existingUser) {
        console.log('❌ User already exists');
        rl.close();
        return;
      }
      
      // Hash password and create user
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await db.createUser(username, email, passwordHash);
      
      // Update user role to admin
      await db.updateUserRole(user.id, 'admin');
      
      console.log('✅ Admin user created successfully:', {
        id: user.id,
        username: user.username,
        email: user.email
      });
      
      rl.close();
    } catch (error) {
      console.error('❌ Failed to create admin user:', error.message);
      rl.close();
      process.exit(1);
    }
  },

  // Add new keys
  'add-keys': async () => {
    const readline = require('readline');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const question = (prompt) => {
      return new Promise((resolve) => {
        rl.question(prompt, resolve);
      });
    };
    
    try {
      console.log('🔄 Adding new keys...');
      
      const keyCode = await question('Key code: ');
      const creditsValue = await question('Credits value: ');
      const expiresAt = await question('Expires at (YYYY-MM-DD HH:MM:SS, optional): ');
      
      if (!keyCode || !creditsValue) {
        console.log('❌ Key code and credits value are required');
        rl.close();
        return;
      }
      
      const credits = parseInt(creditsValue);
      if (isNaN(credits) || credits <= 0) {
        console.log('❌ Credits value must be a positive number');
        rl.close();
        return;
      }
      
      // Insert key
      const query = `
        INSERT INTO keys (key_code, credits_value, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id, key_code, credits_value
      `;
      
      const params = [keyCode, credits, expiresAt || null];
      const result = await db.query(query, params);
      
      console.log('✅ Key added successfully:', result.rows[0]);
      
      rl.close();
    } catch (error) {
      console.error('❌ Failed to add key:', error.message);
      rl.close();
      process.exit(1);
    }
  },

  // List users
  'list-users': async () => {
    try {
      console.log('🔄 Fetching users...');
      const users = await db.getAllUsers(1, 20);
      
      console.log(`📋 Users (showing ${users.length}):`);
      console.table(users.map(user => ({
        ID: user.id,
        Username: user.username,
        Email: user.email,
        Credits: user.credits,
        Role: user.role,
        Active: user.is_active ? 'Yes' : 'No',
        'Last Login': user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never',
        'Created': new Date(user.created_at).toLocaleDateString()
      })));
    } catch (error) {
      console.error('❌ Failed to list users:', error.message);
      process.exit(1);
    }
  },

  // Show unused keys
  'list-keys': async () => {
    try {
      console.log('🔄 Fetching keys...');
      const result = await db.query(`
        SELECT key_code, credits_value, is_used, expires_at, created_at
        FROM keys 
        ORDER BY created_at DESC 
        LIMIT 50
      `);
      
      const keys = result.rows;
      console.log(`🗝️ Keys (showing ${keys.length}):`);
      console.table(keys.map(key => ({
        'Key Code': key.key_code,
        Credits: key.credits_value,
        Status: key.is_used ? 'Used' : 'Available',
        'Expires': key.expires_at ? new Date(key.expires_at).toLocaleDateString() : 'Never',
        'Created': new Date(key.created_at).toLocaleDateString()
      })));
    } catch (error) {
      console.error('❌ Failed to list keys:', error.message);
      process.exit(1);
    }
  },

  // Show help
  help: () => {
    console.log(`
🗄️ Database Management Commands:

  init              Initialize database tables
  test              Test database connection
  stats             Show database statistics
  create-admin      Create a new admin user
  add-keys          Add new redemption keys
  list-users        List all users
  list-keys         List all keys
  help              Show this help message

Usage: node manage-db.js <command>

Environment Variables Required:
  DATABASE_URL or NEON_DATABASE_URL - Your PostgreSQL connection string

Examples:
  node manage-db.js init
  node manage-db.js test
  node manage-db.js stats
  node manage-db.js create-admin
    `);
  }
};

// Main execution
async function main() {
  const command = process.argv[2];
  
  if (!command || !commands[command]) {
    console.log('❌ Invalid or missing command');
    commands.help();
    process.exit(1);
  }
  
  if (command !== 'help' && !process.env.DATABASE_URL && !process.env.NEON_DATABASE_URL) {
    console.log('❌ DATABASE_URL or NEON_DATABASE_URL environment variable is required');
    process.exit(1);
  }
  
  try {
    await commands[command]();
  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  } finally {
    if (command !== 'help') {
      await db.close();
    }
    process.exit(0);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { commands, db };