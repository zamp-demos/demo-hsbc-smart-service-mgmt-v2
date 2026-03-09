const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    recordVideo: {
      dir: '/tmp/agent_output/',
      size: { width: 1280, height: 800 }
    },
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  
  // Open the HTML file
  await page.goto('file:///tmp/hsbc-demo/mock_mivision_case2.html');
  await page.waitForTimeout(1500);
  
  // Scroll to show the alert banner
  await page.evaluate(() => window.scrollTo(0, 100));
  await page.waitForTimeout(2000);
  
  // Scroll to show the cardholder profile
  await page.evaluate(() => window.scrollTo(0, 250));
  await page.waitForTimeout(2500);
  
  // Scroll to show the transactions table
  await page.evaluate(() => window.scrollTo(0, 450));
  await page.waitForTimeout(2500);
  
  // Scroll back to top to show full context
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2000);
  
  // CRITICAL: Close context BEFORE browser to flush video
  await context.close();
  await browser.close();
  
  console.log('Recording completed, waiting for video file...');
  
  // Wait and find the video file
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const videoDir = '/tmp/agent_output/';
  const files = fs.readdirSync(videoDir);
  const videoFile = files.find(f => f.endsWith('.webm'));
  
  if (videoFile) {
    const sourcePath = path.join(videoDir, videoFile);
    const destPath = '/tmp/hsbc-demo/public/data/Case2_MiVision_Browser_Recording.webm';
    
    // Ensure destination directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ Video saved to: ${destPath}`);
    
    const stats = fs.statSync(destPath);
    console.log(`✓ File size: ${(stats.size / 1024).toFixed(2)} KB`);
  } else {
    console.error('✗ Video file not found in /tmp/agent_output/');
  }
})();
