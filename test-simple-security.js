const https = require('https');

const API_BASE = 'https://api-functions-lqqjxyu3j-khanhs-projects-3f746af3.vercel.app/api';

async function makeRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE}${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'SecurityTest/1.0'
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
            body: json
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function testSecuritySystem() {
  console.log('🔒 Testing Advanced Security System...\n');
  
  for (let i = 1; i <= 25; i++) {
    try {
      const result = await makeRequest('/test-security');
      
      if (result.status === 429) {
        console.log(`🚨 SECURITY TRIGGERED! IP blocked after ${i} requests`);
        console.log(`Response:`, JSON.stringify(result.body, null, 2));
        break;
      } else if (result.status === 200) {
        console.log(`✅ Request ${i}: Allowed - ${result.body.requests_this_hour || 'N/A'} requests this hour`);
      } else {
        console.log(`❌ Request ${i}: Status ${result.status} - ${JSON.stringify(result.body).substring(0, 100)}...`);
      }
      
      // Small delay to simulate realistic attack pattern
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error) {
      console.log(`💥 Request ${i} failed:`, error.message);
    }
  }
}

testSecuritySystem().catch(console.error);