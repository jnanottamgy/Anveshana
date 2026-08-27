/* Runs axe-core against every route, at desktop and mobile. */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const axeSource = readFileSync(axePath, 'utf8');

const BASE = 'http://localhost:4321';
const routes = (process.env.ROUTES || '/').split(',');

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
let totalViolations = 0;

for (const vp of [{ n: 'desktop', w: 1440, h: 900 }, { n: 'mobile', w: 390, h: 844 }]) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h } });
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const acc = page.locator('[data-gate-accept]');
    if (await acc.count() && await acc.isVisible()) await acc.click();
    await page.waitForTimeout(2600);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    await page.addScriptTag({ content: axeSource });
    const res = await page.evaluate(async () =>
      await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'] } })
    );
    if (res.violations.length) {
      totalViolations += res.violations.length;
      console.log(`\n### ${route} [${vp.n}] — ${res.violations.length} violation type(s)`);
      for (const v of res.violations) {
        console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
        v.nodes.slice(0, 3).forEach(n => {
          console.log(`      ${n.target.join(' ')}`);
          if (n.any?.[0]?.message) console.log(`        → ${n.any[0].message}`);
        });
        if (v.nodes.length > 3) console.log(`      … +${v.nodes.length - 3} more`);
      }
    }
  }
  await ctx.close();
}
console.log(`\n=== TOTAL VIOLATION TYPES: ${totalViolations} ===`);
await b.close();
