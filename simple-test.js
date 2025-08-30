console.log('Testing API...');

const https = require('https');

function testAPICall(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });
    
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runTests() {
  const baseURL = 'https://api-functions-q81r2sspq-khanhs-projects-3f746af3.vercel.app';
  
  console.log('1. Testing health endpoint...');
  try {
    const result = await testAPICall(`${baseURL}/api/health`);
    console.log('Health check result:', result);
  } catch (error) {
    console.log('Health check error:', error.message);
  }
  
  console.log('\n2. Testing redeem key endpoint...');
  try {
    const result = await testAPICall(`${baseURL}/api/keys/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key: 'TEST-KEY' })
    });
    console.log('Redeem key result:', result);
  } catch (error) {
    console.log('Redeem key error:', error.message);
  }
}

runTests();
