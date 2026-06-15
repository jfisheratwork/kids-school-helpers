const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
let APP_URL = 'http://localhost:3000/test/integration.html';
if (process.argv[2]) {
  APP_URL = process.argv[2];
}
const RESULTS_FILE = path.join(__dirname, '..', 'test-results.json');
const TIMEOUT_MS = 25000; // 25 seconds timeout

// 1. Verify that Google Chrome exists
if (!fs.existsSync(CHROME_PATH)) {
  console.error(`Error: Google Chrome not found at standard macOS location: "${CHROME_PATH}"`);
  console.error("Please ensure Google Chrome is installed on your Mac.");
  process.exit(1);
}

// Clean up old results if present
if (fs.existsSync(RESULTS_FILE)) {
  fs.unlinkSync(RESULTS_FILE);
}

// 2. Verify that the local Node server is running
console.log("Checking if local development server is running...");
const req = http.get('http://localhost:3000/', (res) => {
  // Server is active, proceed to run tests
  console.log("Server found. Starting headless Chrome browser session...");
  launchChrome();
});

req.on('error', (err) => {
  console.error("Error: Local Node server is not active at http://localhost:3000/");
  console.error("Please run the server using 'node server.js' or start it first before running tests.");
  process.exit(1);
});

req.end();

function launchChrome() {
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    APP_URL
  ]);
  
  chromeProcess.stdout.on('data', data => console.log('CHROME STDOUT:', data.toString()));
  chromeProcess.stderr.on('data', data => console.log('CHROME STDERR:', data.toString()));

  chromeProcess.on('error', (err) => {
    console.error("Failed to start Google Chrome process:", err.message);
    process.exit(1);
  });

  let elapsed = 0;
  const pollInterval = setInterval(() => {
    elapsed += 500;
    
    if (fs.existsSync(RESULTS_FILE)) {
      clearInterval(pollInterval);
      
      let results;
      try {
        results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
      } catch (err) {
        console.error("Failed to parse test results file:", err.message);
        chromeProcess.kill();
        process.exit(1);
      }

      // Output test report to console
      console.log('\n==================================================');
      console.log('         INTEGRATION TEST REPORT                  ');
      console.log('==================================================');
      results.results.forEach((r, idx) => {
        const status = r.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`${idx + 1}. [${status}] ${r.name}`);
        if (!r.passed) {
          console.log(`    Error Details: ${r.error}`);
        }
      });
      console.log('==================================================');

      // Clean up results file
      try {
        fs.unlinkSync(RESULTS_FILE);
      } catch (e) {}

      // Kill Chrome and exit
      chromeProcess.kill();

      if (results.allPassed) {
        console.log("🎉 SUCCESS: All integration tests passed successfully!\n");
        process.exit(0);
      } else {
        console.error("💥 FAILURE: Some integration tests failed!\n");
        process.exit(1);
      }
    }

    if (elapsed >= TIMEOUT_MS) {
      clearInterval(pollInterval);
      console.error(`\n⌛ TIMEOUT: Integration tests timed out after ${TIMEOUT_MS / 1000} seconds!`);
      chromeProcess.kill();
      process.exit(1);
    }
  }, 500);
}
