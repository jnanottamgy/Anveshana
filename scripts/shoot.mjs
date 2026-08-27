/* Screenshots every route at desktop + mobile for visual review. */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = process.env.SHOT_DIR || '/tmp/shots';
const BASE = process.env.BASE_URL || 'http://localhost:4321';
const routes = (process.env.ROUTES || '/').split(',');
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    // Accept the disclaimer gate so we can see the page itself.
    const accept = page.locator('[data-gate-accept]');
    if (await accept.count() && await accept.isVisible()) await accept.click();
    // Let the entry curtain lift.
    await page.waitForTimeout(2600);

    // Scroll the whole page so every IntersectionObserver reveal
    // fires, then return to the top. Without this a full-page
    // capture records everything below the fold at opacity 0.
    // Paced like a human: IntersectionObserver delivers async, so
    // a fast programmatic scroll outruns it and records reveals
    // mid-transition.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 300) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 200));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(2500);
    const slug = route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/\//g, '-');
    await page.screenshot({ path: `${OUT}/${slug}-${vp.name}.png`, fullPage: process.env.FULL === '1' });
    console.log(`shot ${slug}-${vp.name}`);
  }
  if (errors.length) console.log(`\n[${vp.name}] console errors:\n` + errors.join('\n'));
  await ctx.close();
}
await browser.close();
