/* Captures sequential real viewports down a page — accurate for
   review, unlike fullPage which resizes the viewport and breaks
   svh-based layout. */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = process.env.SHOT_DIR || '/tmp/shots';
const BASE = process.env.BASE_URL || 'http://localhost:4321';
const route = process.env.ROUTE || '/';
const W = Number(process.env.W || 1440);
const H = Number(process.env.H || 900);
const tag = process.env.TAG || 'scan';

mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await b.newContext({ viewport: { width: W, height: H } });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });

await page.goto(BASE + route, { waitUntil: 'networkidle' });
const acc = page.locator('[data-gate-accept]');
if (await acc.count() && await acc.isVisible()) await acc.click();
await page.waitForTimeout(2800);

const total = await page.evaluate(() => document.body.scrollHeight);
const frames = Math.ceil(total / H);
for (let i = 0; i < frames; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * H);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${tag}-${String(i).padStart(2, '0')}.png` });
}
console.log(`${tag}: ${frames} frames, page height ${total}`);
if (errs.length) console.log('errors:\n' + errs.join('\n'));
await b.close();
