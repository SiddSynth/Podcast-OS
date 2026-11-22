const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function verifyShortsUpgraded() {
  console.log("Testing Upgraded Viral Shorts Director UI with Men of Culture GTA 6 link...");
  const browser = await chromium.launch({
    headless: true,
    channel: 'msedge',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000/shorts', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(1000);

  // Click on "Extract Viral Shorts"
  const extractBtn = page.locator('button[type="submit"]');
  await extractBtn.click();
  console.log("- Clicked Extract Viral Shorts");
  await page.waitForTimeout(2500);

  const outDir = path.resolve(__dirname, '../screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const shotPath = path.join(outDir, 'shorts_upgraded_verified.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log("- Captured full page screenshot at:", shotPath);

  // Check titles on page
  const pageText = await page.textContent('body');
  console.log("- Page contains 'GTA 6 Leaked on Twitter':", pageText.includes("GTA 6 Leaked on Twitter"));
  console.log("- Page contains 'Editor Directives':", pageText.includes("Editor Directives"));
  console.log("- Page contains '9:16 VERTICAL':", pageText.includes("9:16 VERTICAL"));
  console.log("- Page contains 'EN Translation':", pageText.includes("EN Translation"));

  await browser.close();
}

verifyShortsUpgraded().catch(console.error);
