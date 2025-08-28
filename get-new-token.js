const jwt = require('jsonwebtoken');

// Tạo token mới với secret key thống nhất
const JWT_SECRET = 'unified-aivannang-secret-2024';

// Thông tin user mẫu (bạn có thể thay đổi theo user thực tế)
const userData = {
  userId: 1,  // Thay đổi theo ID user thực tế
  username: 'admin',  // Thay đổi theo username thực tế
  role: 'admin'  // Thay đổi theo role thực tế
};

// Tạo token mới
const token = jwt.sign(
  userData,
  JWT_SECRET,
  { expiresIn: '24h' }
);

console.log('====================================');
console.log('NEW JWT TOKEN GENERATED');
console.log('====================================');
console.log('\nToken (copy this):');
console.log(token);
console.log('\n------------------------------------');
console.log('Token details:');
console.log('- User ID:', userData.userId);
console.log('- Username:', userData.username);
console.log('- Role:', userData.role);
console.log('- Secret:', JWT_SECRET);
console.log('- Expires in: 24 hours');
console.log('\n====================================');
console.log('HOW TO USE:');
console.log('1. Copy the token above');
console.log('2. Use it in Authorization header: Bearer <token>');
console.log('3. Or save it in localStorage: localStorage.setItem("token", token)');
console.log('====================================');

// Verify token works
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('\n✅ Token verification successful!');
  console.log('Decoded data:', decoded);
} catch (error) {
  console.error('\n❌ Token verification failed:', error.message);
}