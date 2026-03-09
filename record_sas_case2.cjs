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
  await page.goto('file:///tmp/hsbc-demo/mock_sas_case2.html');
  await page.waitForTimeout(1500);

  // Scroll through alert summary
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(1500);

  // Scroll to risk gauge
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(1500);

  // Scroll to trigger analysis
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(1500);

  // Scroll to flagged transactions
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(2000);

  // Scroll to audit trail
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(2000);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);

  // CRITICAL: Close context BEFORE browser to flush video
  await context.close();
  await browser.close();

  // Find the generated video file
  const files = fs.readdirSync('/tmp/agent_output/');
  const videoFile = files.find(f => f.endsWith('.webm'));

  if (videoFile) {
    const sourcePath = path.join('/tmp/agent_output/', videoFile);
    const destPath = '/tmp/hsbc-demo/public/data/Case2_SAS_Browser_Recording.webm';
    
    // Ensure destination directory exists
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    
    // Copy the file
    fs.copyFileSync(sourcePath, destPath);
    
    const stats = fs.statSync(destPath);
    console.log(`✓ Video saved to: ${destPath}`);
    console.log(`✓ File size: ${(stats.size / 1024).toFixed(2)} KB`);
  } else {
    console.error('✗ No video file found in /tmp/agent_output/');
    process.exit(1);
  }
})();
