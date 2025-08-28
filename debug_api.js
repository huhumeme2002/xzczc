// Test script để kiểm tra API
const testAPI = async () => {
  const token = 'YOUR_JWT_TOKEN_HERE'; // Lấy từ localStorage
  
  try {
    const response = await fetch('https://your-backend-url/keys/balance', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    console.log('API Response:', data);
    console.log('Expiry Time:', data.user?.expiry_time);
    
  } catch (error) {
    console.error('Error:', error);
  }
};

// Chạy test
testAPI();