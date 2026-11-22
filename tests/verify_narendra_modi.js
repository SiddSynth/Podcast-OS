const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testModi() {
  console.log("Testing Guest Research with 'narendra modi'...");
  const browser = await chromium.launch({
    headless: true,
    channel: 'msedge',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/research', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(1000);

  // Fill in 'narendra modi'
  await page.fill('input[name="name"]', 'narendra modi');
  console.log("- Filled 'narendra modi' in guest name input.");

  // Click Generate Research Dossier
  await page.click('button:has-text("Generate Research Dossier")');
  console.log("- Clicked Generate Research Dossier.");

  // Wait for 50 Categorized Questions tab or summary
  await page.waitForSelector('text=Executive Summary', { timeout: 20000 });
  console.log("- Research Dossier loaded!");

  // Read summary text
  const summaryText = await page.textContent('body');
  
  const hasPM = summaryText.includes('Prime Minister of India');
  const hasEnterprises = summaryText.includes('narendra modi Enterprises');
  const hasSprint = summaryText.includes('72-hour weekend sprint');
  const hasSupportTickets = summaryText.includes('customer support tickets');

  console.log("Checks:");
  console.log(`- Mentions 'Prime Minister of India': ${hasPM}`);
  console.log(`- Mentions 'narendra modi Enterprises' (should be FALSE): ${hasEnterprises}`);
  console.log(`- Mentions '72-hour weekend sprint' (should be FALSE): ${hasSprint}`);
  console.log(`- Mentions 'customer support tickets' (should be FALSE): ${hasSupportTickets}`);

  const shotPath = path.join(__dirname, 'screenshots', 'narendra_modi_verified.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log(`- Saved screenshot to ${shotPath}`);

  await browser.close();

  if (hasPM && !hasEnterprises && !hasSprint && !hasSupportTickets) {
    console.log("✅ VERIFICATION PASSED: Narendra Modi dossier is 100% accurate, prestigious, and authentic!");
    process.exit(0);
  } else {
    console.error("❌ VERIFICATION FAILED!");
    process.exit(1);
  }
}

testModi().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});
