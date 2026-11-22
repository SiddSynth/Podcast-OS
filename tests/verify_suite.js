const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runVerification() {
  console.log("🚀 Starting PodcastOS Classy Studio Playwright Verification Suite...");
  
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    channel: 'msedge',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const results = [];

  try {
    // 1. Dashboard
    console.log("Testing 1/10: Dashboard (http://localhost:3000/)...");
    await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 20000 });
    const title = await page.title();
    console.log(`- Page title: "${title}"`);
    
    // Screenshot 1A: Top Hero Command Center & KPI cards
    await page.waitForTimeout(1000);
    const heroShot = path.join(screenshotsDir, '1_dashboard_hero.png');
    await page.screenshot({ path: heroShot });
    console.log("- Dashboard hero screenshot captured.");

    // Toggle audio player
    const playBtn = page.locator('button:has-text("Preview Master Track Audio")');
    if (await playBtn.isVisible()) {
      await playBtn.click();
      console.log("- Audio Master Track play button toggled.");
    }
    await page.waitForTimeout(1000);
    const dashShot = path.join(screenshotsDir, '1_dashboard_studio.png');
    await page.screenshot({ path: dashShot });
    results.push({ page: "Dashboard", status: "PASS", screenshot: dashShot });

    // 2. Guest Research
    console.log("Testing 2/10: Guest Research (/research)...");
    await page.goto('http://localhost:3000/research', { waitUntil: 'load', timeout: 20000 });
    await page.click('button:has-text("Nikhil Kamath")');
    await page.click('button:has-text("Generate Research Dossier")');
    await page.waitForSelector('text=50 Categorized Questions', { timeout: 15000 });
    console.log("- 50 Questions Dossier generated.");
    
    await page.click('button:has-text("50 Categorized Questions")');
    await page.waitForTimeout(1000);
    const researchShot = path.join(screenshotsDir, '2_research_studio.png');
    await page.screenshot({ path: researchShot, fullPage: true });
    results.push({ page: "Guest Research", status: "PASS", screenshot: researchShot });

    // 3. PodcastGPT Chat
    console.log("Testing 3/10: PodcastGPT Intelligence (/rajgpt)...");
    await page.goto('http://localhost:3000/rajgpt', { waitUntil: 'load', timeout: 20000 });
    await page.click('button:has-text("Why does Nikhil Kamath rent instead of buying a house?")');
    await page.waitForSelector('text=Confidence Score:', { timeout: 15000 });
    console.log("- Vector citation and answer received.");
    await page.waitForTimeout(1000);
    const gptShot = path.join(screenshotsDir, '3_podcastgpt_studio.png');
    await page.screenshot({ path: gptShot, fullPage: true });
    results.push({ page: "PodcastGPT", status: "PASS", screenshot: gptShot });

    // 4. Viral Shorts Finder
    console.log("Testing 4/10: Viral Shorts Finder (/shorts)...");
    await page.goto('http://localhost:3000/shorts', { waitUntil: 'load', timeout: 20000 });
    await page.click('button:has-text("Extract Viral Shorts")');
    await page.waitForSelector('text=9:16 VERTICAL', { timeout: 15000 });
    console.log("- 9:16 phone mockup and viral clips rendered.");
    await page.waitForTimeout(1000);
    const shortsShot = path.join(screenshotsDir, '4_shorts_studio.png');
    await page.screenshot({ path: shortsShot, fullPage: true });
    results.push({ page: "Viral Shorts", status: "PASS", screenshot: shortsShot });

    // 5. Content Repurposer
    console.log("Testing 5/10: Content Repurposer (/content)...");
    await page.goto('http://localhost:3000/content', { waitUntil: 'load', timeout: 20000 });
    await page.click('button:has-text("Generate 6 Content Formats")');
    await page.waitForSelector('text=LinkedIn 5-Slide Carousel', { timeout: 15000 });
    await page.click('button:has-text("LinkedIn 5-Slide Carousel")');
    await page.waitForTimeout(1000);
    const contentShot = path.join(screenshotsDir, '5_content_studio.png');
    await page.screenshot({ path: contentShot, fullPage: true });
    results.push({ page: "Content Repurposer", status: "PASS", screenshot: contentShot });

    // 6. Sponsor Outreach
    console.log("Testing 6/10: Sponsor Outreach (/sponsors)...");
    await page.goto('http://localhost:3000/sponsors', { waitUntil: 'load', timeout: 20000 });
    await page.click('button:has-text("Generate Sponsorship Package")');
    await page.waitForSelector('text=Tiered Rate Card', { timeout: 15000 });
    await page.click('button:has-text("Tiered Rate Card ($)")');
    await page.waitForTimeout(1000);
    const sponsorsShot = path.join(screenshotsDir, '6_sponsors_studio.png');
    await page.screenshot({ path: sponsorsShot, fullPage: true });
    results.push({ page: "Sponsor Outreach", status: "PASS", screenshot: sponsorsShot });

    // 7. Knowledge Base
    console.log("Testing 7/10: Knowledge Base (/kb)...");
    await page.goto('http://localhost:3000/kb', { waitUntil: 'load', timeout: 20000 });
    await page.waitForSelector('text=Read Transcript →', { timeout: 15000 });
    await page.click('text=Read Transcript →');
    await page.waitForTimeout(1000);
    const kbShot = path.join(screenshotsDir, '7_kb_studio.png');
    await page.screenshot({ path: kbShot, fullPage: true });
    results.push({ page: "Knowledge Base", status: "PASS", screenshot: kbShot });

    // 8. Prompt Library
    console.log("Testing 8/10: AI Prompt Library (/prompts)...");
    await page.goto('http://localhost:3000/prompts', { waitUntil: 'load', timeout: 20000 });
    await page.click('button:has-text("Podcast")');
    await page.waitForTimeout(1000);
    const promptsShot = path.join(screenshotsDir, '8_prompts_studio.png');
    await page.screenshot({ path: promptsShot, fullPage: true });
    results.push({ page: "Prompt Library", status: "PASS", screenshot: promptsShot });

    // 9. Analytics
    console.log("Testing 9/10: Studio Analytics (/analytics)...");
    await page.goto('http://localhost:3000/analytics', { waitUntil: 'load', timeout: 20000 });
    await page.waitForSelector('text=Token Consumption', { timeout: 15000 });
    await page.waitForTimeout(1000);
    const analyticsShot = path.join(screenshotsDir, '9_analytics_studio.png');
    await page.screenshot({ path: analyticsShot, fullPage: true });
    results.push({ page: "Analytics", status: "PASS", screenshot: analyticsShot });

    // 10. Settings & Health
    console.log("Testing 10/10: Settings & Service Health (/settings)...");
    await page.goto('http://localhost:3000/settings', { waitUntil: 'load', timeout: 20000 });
    await page.waitForSelector('text=FastAPI Core Server', { timeout: 15000 });
    await page.waitForTimeout(1000);
    const settingsShot = path.join(screenshotsDir, '10_settings_studio.png');
    await page.screenshot({ path: settingsShot, fullPage: true });
    results.push({ page: "Settings", status: "PASS", screenshot: settingsShot });

    console.log("\n=======================================================");
    console.log("🎉 ALL 10 PLAYWRIGHT TEST SUITES VERIFIED AND PASSED!");
    console.log("=======================================================");
    console.log(JSON.stringify(results, null, 2));

  } catch (err) {
    console.error("Test failure:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runVerification();
