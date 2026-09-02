/* Captures a page in both themes, plus the gavel cursor states. */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = process.env.SHOT_DIR || '/tmp/shots';
const BASE = 'http://localhost:4321';
const route = process.env.ROUTE || '/';
const tag = process.env.TAG || 'page';
const W = Number(process.env.W || 1440), H = Number(process.env.H || 900);

mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await b.newContext({ viewport: { width: W, height: H } });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });

await page.goto(BASE + route, { waitUntil: 'networkidle' });
const acc = page.locator('[data-gate-accept]');
if (await acc.count() && await acc.isVisible()) await acc.click();
await page.waitForTimeout(2800);

const scan = async (theme) => {
  const total = await page.evaluate(() => document.body.scrollHeight);
  const frames = Math.min(Math.ceil(total / H), Number(process.env.MAXF || 99));
  for (let i = 0; i < frames; i++) {
    await page.evaluate(y => window.scrollTo(0, y), i * H);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${OUT}/${tag}-${theme}-${String(i).padStart(2,'0')}.png` });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
};

await scan('dark');

// Cursor states: idle, then hovering a link.
await page.mouse.move(700, 500);
await page.waitForTimeout(2600);
await page.screenshot({ path: `${OUT}/${tag}-cursor-idle.png`, clip: { x: 580, y: 400, width: 300, height: 220 } });
const link = page.locator('a.btn, .btn').first();
if (await link.count()) {
  const box = await link.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(2600);
    await page.screenshot({ path: `${OUT}/${tag}-cursor-hover.png`,
      clip: { x: Math.max(0, box.x - 70), y: Math.max(0, box.y - 90), width: 420, height: 240 } });
    await page.mouse.down();
    await page.waitForTimeout(160);
    await page.screenshot({ path: `${OUT}/${tag}-cursor-strike.png`,
      clip: { x: Math.max(0, box.x - 70), y: Math.max(0, box.y - 90), width: 420, height: 240 } });
    await page.mouse.up();
  }
}

// Flip to light and rescan.
await page.click('[data-theme-toggle]');
await page.waitForTimeout(2600);
await scan('light');

const theme = await page.evaluate(() => document.documentElement.dataset.theme);
console.log(`${tag}: captured. theme after toggle = ${theme}`);
if (errs.length) console.log('errors:\n' + errs.join('\n'));
await b.close();
