// Auto-create admin user for AiVanNang
require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    console.log('🔄 Creating admin user...');
    
    const adminData = {
      username: 'admin',
      email: 'admin@aivannang.vn',
      password: 'admin123456' // Change this in production!
    };
    
    // Check if admin already exists
    const existingAdmin = await db.findUserByUsername(adminData.username);
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', {
        id: existingAdmin.id,
        username: existingAdmin.username,
        email: existingAdmin.email,
        role: existingAdmin.role
      });
      return;
    }
    
    // Hash password and create user
    const passwordHash = await bcrypt.hash(adminData.password, 10);
    const user = await db.createUser(adminData.username, adminData.email, passwordHash);
    
    // Update user role to admin
    await db.updateUserRole(user.id, 'admin');
    
    console.log('✅ Admin user created successfully:');
    console.log(`   Username: ${adminData.username}`);
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Password: ${adminData.password}`);
    console.log(`   ID: ${user.id}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the admin password after first login!');
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    process.exit(1);
  } finally {
    await db.close();
    process.exit(0);
  }
}

createAdmin();