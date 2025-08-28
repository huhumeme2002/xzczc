const https = require('https');

const API_BASE = 'https://api-functions-jlxsb8myy-khanhs-projects-3f746af3.vercel.app/api';

async function makeRequest(endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE}${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: data ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'KeyChecker/1.0 (Automated Tool)', // Suspicious user agent
        'Authorization': 'Bearer fake-token'
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
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function simulateKeyCheckerTool() {
  console.log('🔧 Simulating Key Checker Tool Attack Pattern...\n');
  console.log('📊 Attempting rapid-fire requests like the tool in the image:\n');
  
  // Simulate the rapid key checking pattern shown in the image (254 keys/second)
  const rapidRequests = [];
  
  console.log('🚀 Launching rapid requests (simulating 250+ keys/second)...');
  
  // Send 20 requests very quickly to simulate the tool
  for (let i = 1; i <= 20; i++) {
    rapidRequests.push(
      makeRequest('/redeem-key-protected', { key: `fake-key-${i}` })
        .then(result => {
          const timestamp = new Date().toISOString().substr(11, 12);
          
          if (result.status === 429 && result.body.reason === 'AUTOMATED_TOOL_BLOCKED') {
            console.log(`[${timestamp}] 🚨 REQUEST ${i}: TOOL DETECTED!`);
            console.log(`   Message: ${result.body.message}`);
            console.log(`   Detection: ${result.body.detection.requests_10s} req/10s, ${result.body.detection.requests_60s} req/60s`);
            console.log(`   User-Agent: ${result.body.detection.user_agent}`);
            return { request: i, blocked: true, reason: 'TOOL_DETECTED' };
          } else if (result.status === 429) {
            console.log(`[${timestamp}] ⏸️  REQUEST ${i}: Rate limited (${result.body.reason || 'Rate limit'})`);
            return { request: i, blocked: true, reason: 'RATE_LIMITED' };
          } else {
            console.log(`[${timestamp}] ➡️  REQUEST ${i}: Status ${result.status} - ${JSON.stringify(result.body).substring(0, 50)}...`);
            return { request: i, blocked: false, status: result.status };
          }
        })
        .catch(error => {
          console.log(`❌ REQUEST ${i}: Error - ${error.message}`);
          return { request: i, error: true };
        })
    );
    
    // Very small delay to simulate rapid tool behavior
    if (i % 5 === 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  
  console.log('\n⏳ Processing all requests...\n');
  
  const results = await Promise.all(rapidRequests);
  
  // Analyze results
  const toolDetections = results.filter(r => r.reason === 'TOOL_DETECTED').length;
  const rateLimited = results.filter(r => r.reason === 'RATE_LIMITED').length;
  const allowed = results.filter(r => !r.blocked && !r.error).length;
  const errors = results.filter(r => r.error).length;
  
  console.log('\n📈 ANTI-TOOL SECURITY RESULTS:');
  console.log('='.repeat(50));
  console.log(`🛡️  Tool Detections: ${toolDetections} (${((toolDetections / 20) * 100).toFixed(1)}%)`);
  console.log(`⏸️  Rate Limited: ${rateLimited} (${((rateLimited / 20) * 100).toFixed(1)}%)`);
  console.log(`✅ Allowed: ${allowed} (${((allowed / 20) * 100).toFixed(1)}%)`);
  console.log(`❌ Errors: ${errors} (${((errors / 20) * 100).toFixed(1)}%)`);
  
  const totalBlocked = toolDetections + rateLimited;
  console.log(`\n🎯 TOTAL BLOCKED: ${totalBlocked}/20 (${((totalBlocked / 20) * 100).toFixed(1)}%)`);
  
  if (toolDetections > 0) {
    console.log('\n✅ SUCCESS: Anti-tool detection is working!');
    console.log('   🔍 System detected automated tool behavior');
    console.log('   🚫 Rapid requests were blocked effectively');
    console.log('   🛡️ Key Checker tools will be stopped');
  } else if (totalBlocked > 15) {
    console.log('\n✅ SUCCESS: Rate limiting effectively blocked rapid requests');
    console.log('   ⏸️  Even without tool detection, rapid requests are blocked');
  } else {
    console.log('\n⚠️  WARNING: Some requests may have bypassed security');
    console.log('   🔧 Consider increasing security strictness');
  }
  
  console.log('\n🔒 Security Status: ENHANCED ANTI-TOOL PROTECTION ACTIVE');
}

// Run the anti-tool test
simulateKeyCheckerTool().catch(console.error);