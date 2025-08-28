const https = require('https');

// Test API security with rapid requests
const API_BASE = 'https://api-functions-fmzmw3p37-khanhs-projects-3f746af3.vercel.app/api';

async function makeRequest(endpoint, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE}${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: data ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SecurityTest/1.0',
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: json
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAPIRateLimiting() {
  console.log('🔥 Testing API Rate Limiting Security...\n');
  
  // Test redeem-key-protected endpoint (stricter limits: 15 per 10min)
  console.log('📍 Testing /redeem-key-protected endpoint:');
  
  for (let i = 1; i <= 20; i++) {
    try {
      const result = await makeRequest('/redeem-key-protected', 
        { key: `fake-key-${i}` },
        { 'Authorization': 'Bearer fake-token' }
      );
      
      console.log(`Request ${i}: ${result.status} - ${JSON.stringify(result.body).substring(0, 100)}...`);
      
      if (result.status === 429) {
        console.log(`🚨 IP BLOCKED after ${i} requests! Security working correctly.`);
        console.log(`Block message: ${result.body.message || result.body.error}`);
        break;
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.log(`Request ${i} failed:`, error.message);
    }
  }
  
  console.log('\n📍 Testing /get-token endpoint (higher limits):');
  
  // Test get-token endpoint
  for (let i = 1; i <= 25; i++) {
    try {
      const result = await makeRequest('/get-token', 
        {},
        { 'Authorization': 'Bearer fake-token' }
      );
      
      console.log(`Request ${i}: ${result.status} - ${JSON.stringify(result.body).substring(0, 80)}...`);
      
      if (result.status === 429) {
        console.log(`🚨 IP BLOCKED after ${i} requests on get-token!`);
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error) {
      console.log(`Request ${i} failed:`, error.message);
    }
  }
}

// Run the test
testAPIRateLimiting().catch(console.error);