const https = require('https');

const API_BASE = 'https://api-functions-7qsou67t1-khanhs-projects-3f746af3.vercel.app/api';

async function makeRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE}${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'BurstAttackTest/1.0'
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

async function testBurstAttack() {
  console.log('💥 Testing BURST ATTACK Pattern (rapid fire)...\n');
  
  // Send 60 requests very quickly to trigger 10-minute limit (50 per 10min)
  const promises = [];
  
  for (let i = 1; i <= 60; i++) {
    promises.push(
      makeRequest('/test-security').then(result => ({ 
        request: i, 
        status: result.status, 
        body: result.body 
      }))
    );
  }
  
  console.log('🚀 Launching 60 concurrent requests...');
  
  try {
    const results = await Promise.all(promises);
    
    let blockedCount = 0;
    let allowedCount = 0;
    
    results.forEach(result => {
      if (result.status === 429) {
        blockedCount++;
        if (blockedCount <= 3) { // Show first few blocked responses
          console.log(`🚨 Request ${result.request}: BLOCKED - ${result.body.message}`);
          console.log(`   Reason: ${result.body.reason}`);
          console.log(`   Remaining: ${result.body.remaining_minutes} minutes`);
        }
      } else if (result.status === 200) {
        allowedCount++;
      } else {
        console.log(`❌ Request ${result.request}: Error ${result.status}`);
      }
    });
    
    console.log('\n📊 BURST ATTACK RESULTS:');
    console.log(`✅ Allowed: ${allowedCount} requests`);
    console.log(`🚫 Blocked: ${blockedCount} requests`);
    console.log(`🎯 Security Effectiveness: ${((blockedCount / 60) * 100).toFixed(1)}% blocked`);
    
    if (blockedCount > 0) {
      console.log('\n🛡️ SUCCESS! IP-based rate limiting is working correctly.');
      console.log('   API attacks are being detected and blocked automatically.');
    } else {
      console.log('\n⚠️  No blocking detected - may need to adjust rate limits.');
    }
    
  } catch (error) {
    console.error('Burst attack test failed:', error);
  }
}

testBurstAttack().catch(console.error);