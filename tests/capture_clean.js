const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  const browser = await chromium.launch({
    headless: true,
    channel: 'msedge',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. PodcastGPT page
  await page.goto('http://localhost:3000/rajgpt', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const outDir = path.resolve(__dirname, '../screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  await page.screenshot({ path: path.join(outDir, 'podcastgpt_clean.png') });
  console.log("Captured podcastgpt_clean.png");

  // 2. Shorts page
  await page.goto('http://localhost:3000/shorts', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'shorts_clean.png') });
  console.log("Captured shorts_clean.png");

  // 3. Research page
  await page.goto('http://localhost:3000/research', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'research_clean.png') });
  console.log("Captured research_clean.png");

  await browser.close();
}

capture().catch(console.error);
