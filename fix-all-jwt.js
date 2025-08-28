const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, 'api-functions', 'api');
const UNIFIED_SECRET = 'unified-aivannang-secret-2024';

// List of all files that need JWT secret update
const filesToFix = [
  'login.js',
  'login-db.js', 
  'login-database.js',
  'login-simple.js',
  'register.js',
  'register-db.js',
  'register-database.js',
  'register-simple.js',
  'admin-middleware.js',
  'redeem-key.js',
  'get-next-token.js',
  'get-available-token.js',
  'test-auth.js',
  'generate-token.js',
  'redeem-token.js',
  'create-admin.js'
];

console.log('Fixing JWT secrets in all files...\n');

filesToFix.forEach(file => {
  const filePath = path.join(API_DIR, file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Replace all JWT secret patterns
    content = content.replace(
      /process\.env\.JWT_SECRET\s*\|\|\s*['"][^'"]+['"]/g,
      `process.env.JWT_SECRET || '${UNIFIED_SECRET}'`
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${file}`);
    } else {
      console.log(`⏭️  Skipped: ${file} (no changes needed)`);
    }
  } catch (error) {
    console.log(`❌ Error fixing ${file}: ${error.message}`);
  }
});

console.log('\n✅ All JWT secrets unified to:', UNIFIED_SECRET);
console.log('\nNow run: cd api-functions && vercel --prod');