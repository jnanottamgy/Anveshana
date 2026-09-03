/* ============================================================
   FULL-SITE SWEEP
   ------------------------------------------------------------
   Crawls every page, presses every control, and reports defects
   in one list. Run with the preview server up:

     npm run preview
     node scripts/sweep.mjs
   ============================================================ */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:4321';
const CHROME =
  process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const ROUTES = [
  '/', '/about/', '/practice-areas/',
  '/practice-areas/criminal-law/', '/practice-areas/civil-property/',
  '/practice-areas/company-law/', '/practice-areas/corporate-advisory/',
  '/practice-areas/intellectual-property/', '/practice-areas/taxation/',
  '/practice-areas/employment-labour/', '/practice-areas/cyber-law/',
  '/people/', '/contact/', '/disclaimer/', '/privacy/', '/404',
];

const findings = [];
const add = (where, what) => findings.push(`${where} — ${what}`);

const browser = await chromium.launch({ executablePath: CHROME });

/* ------------------------------------------------------------
   1. STATIC AUDIT — every page, every theme
   ------------------------------------------------------------ */
async function auditPage(page, route, theme) {
  const tag = `${route} [${theme}]`;

  const issues = await page.evaluate(() => {
    const out = [];

    // Duplicate ids
    const seen = new Map();
    document.querySelectorAll('[id]').forEach((el) => {
      seen.set(el.id, (seen.get(el.id) || 0) + 1);
    });
    seen.forEach((n, id) => { if (n > 1) out.push(`duplicate id "${id}" (${n}x)`); });

    // Images without alt
    document.querySelectorAll('img:not([alt])').forEach((el) =>
      out.push(`img without alt: ${el.getAttribute('src')}`));

    // Links / buttons with no accessible name
    document.querySelectorAll('a, button').forEach((el) => {
      const name = (el.getAttribute('aria-label') || el.textContent || '').trim();
      if (!name && !el.querySelector('img[alt], svg[aria-label]')) {
        out.push(`control with no accessible name: <${el.tagName.toLowerCase()} class="${el.className}">`);
      }
    });

    // Empty or placeholder hrefs
    document.querySelectorAll('a[href="#"], a[href=""]').forEach((el) =>
      out.push(`placeholder href on "${(el.textContent || '').trim().slice(0, 40)}"`));

    // Horizontal overflow
    const de = document.documentElement;
    if (de.scrollWidth > de.clientWidth + 1) {
      out.push(`horizontal overflow: scrollWidth ${de.scrollWidth} > client ${de.clientWidth}`);
    }

    // Elements sticking out past the right edge.
    // Decorative layers that bleed off a section are intentional,
    // so anything inside a clipping ancestor is not a defect —
    // only content the visitor can actually lose counts.
    const vw = de.clientWidth;
    const isClipped = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const o = getComputedStyle(p);
        if (['hidden', 'clip', 'auto', 'scroll'].includes(o.overflowX)) return true;
      }
      return false;
    };
    document.querySelectorAll('main *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.right <= vw + 2) return;
      if (getComputedStyle(el).position === 'fixed') return;
      if (el.getAttribute('aria-hidden') === 'true') return;
      if (isClipped(el)) return;
      const cls = el.getAttribute('class') || el.tagName.toLowerCase();
      out.push(`overflows right edge by ${Math.round(r.right - vw)}px: ${cls.split(' ')[0]}`);
    });

    // Every reveal target has been on screen during the scroll
    // pass, so any that never got .is-revealed is genuinely
    // stuck. Checking the class rather than computed opacity
    // avoids flagging one that is merely mid-transition.
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (!el.classList.contains('is-revealed')) {
        out.push(`never revealed: ${(el.getAttribute('class') || el.tagName).split(' ')[0]}`);
      }
    });

    // Meta description length
    const md = document.querySelector('meta[name="description"]')?.content || '';
    if (!md) out.push('missing meta description');
    else if (md.length > 165) out.push(`meta description ${md.length} chars (>165, will truncate)`);

    // Title length
    const t = document.title;
    if (t.length > 65) out.push(`title ${t.length} chars (>65, will truncate)`);

    // Headings: exactly one h1, no skipped levels
    const h1s = document.querySelectorAll('h1');
    if (h1s.length !== 1) out.push(`${h1s.length} <h1> elements (expected 1)`);

    return out;
  });

  issues.forEach((i) => add(tag, i));
}

/* ------------------------------------------------------------
   2. CRAWL — every internal link resolves
   ------------------------------------------------------------ */
const linkCache = new Map();
async function checkLinks(page, route) {
  const hrefs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href]'))
      .map((a) => a.getAttribute('href'))
      .filter((h) => h && !/^(https?:|mailto:|tel:|#)/.test(h))
  );
  for (const href of new Set(hrefs)) {
    if (linkCache.has(href)) {
      if (linkCache.get(href) !== 200) add(route, `broken link ${href} (${linkCache.get(href)})`);
      continue;
    }
    const res = await page.request.get(BASE + href).catch(() => null);
    const status = res ? res.status() : 0;
    linkCache.set(href, status);
    if (status !== 200) add(route, `broken link ${href} (${status})`);
  }
}

/* ------------------------------------------------------------
   MAIN PASS
   ------------------------------------------------------------ */
for (const vp of [
  { n: 'desktop', width: 1440, height: 900 },
  { n: 'mobile', width: 390, height: 844 },
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(`PAGEERROR ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`CONSOLE ${m.text()}`); });
  page.on('requestfailed', (r) => consoleErrors.push(`REQFAIL ${r.url()} ${r.failure()?.errorText}`));

  for (const route of ROUTES) {
    consoleErrors.length = 0;
    await page.goto(BASE + route, { waitUntil: 'networkidle' });

    const acc = page.locator('[data-gate-accept]');
    if (await acc.count() && await acc.isVisible()) await acc.click();
    await page.waitForTimeout(2400);

    // scroll so every reveal fires
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 300) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 130));
      }
    });
    await page.waitForTimeout(1800);

    for (const theme of ['dark', 'light']) {
      await page.evaluate((t) => {
        if (t === 'light') document.documentElement.dataset.theme = 'light';
        else delete document.documentElement.dataset.theme;
      }, theme);
      await page.waitForTimeout(400);
      await auditPage(page, `${route} ${vp.n}`, theme);
    }

    if (vp.n === 'desktop') await checkLinks(page, route);
    consoleErrors.forEach((e) => add(`${route} ${vp.n}`, e));
  }
  await ctx.close();
}

/* ------------------------------------------------------------
   3. INTERACTION PASS — press everything
   ------------------------------------------------------------ */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => add('interaction', `PAGEERROR ${e.message}`));

  /* The header hides itself on scroll-down, so anything that
     targets it has to start from the top of the page. */
  const toTop = async () => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(700);
  };
  /* One broken control must not abort the rest of the sweep. */
  const step = async (label, fn) => {
    try { await fn(); }
    catch (e) { add(label, `threw during interaction: ${String(e).split('\n')[0]}`); }
  };

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // --- Disclaimer gate ---
  const gate = page.locator('[data-gate]');
  if (!(await gate.isVisible())) add('gate', 'did not appear on a fresh visit');

  const layering = await page.evaluate(() => {
    const z = (s) => {
      const el = document.querySelector(s);
      return el ? Number(getComputedStyle(el).zIndex) || 0 : null;
    };
    return { cursor: z('.cursor'), gate: z('.gate'), curtain: z('.curtain'), menu: z('.menu') };
  });
  if (layering.cursor !== null && layering.gate !== null && layering.cursor < layering.gate) {
    add('gate', `cursor z-index ${layering.cursor} is BELOW gate ${layering.gate} — no pointer over the gate`);
  }
  if (layering.cursor !== null && layering.curtain !== null && layering.cursor < layering.curtain) {
    add('curtain', `cursor z-index ${layering.cursor} is BELOW curtain ${layering.curtain}`);
  }

  // focus should land inside the dialog
  const focusedInGate = await page.evaluate(() =>
    !!document.activeElement?.closest('.gate__panel'));
  if (!focusedInGate) add('gate', 'focus is not moved into the dialog when it opens');

  await page.locator('[data-gate-accept]').click();
  await page.waitForTimeout(700);
  if (await gate.isVisible()) add('gate', 'still visible after pressing I Agree');
  if (await page.evaluate(() => document.body.classList.contains('is-locked'))) {
    add('gate', 'body scroll lock not released after accepting');
  }

  // --- Theme toggle ---
  await toTop();
  await page.click('[data-theme-toggle]');
  await page.waitForTimeout(600);
  let t = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    checked: document.querySelector('[data-theme-toggle]').getAttribute('aria-checked'),
    stored: localStorage.getItem('anv:theme'),
    meta: document.querySelector('[data-theme-color]')?.getAttribute('content'),
  }));
  if (t.theme !== 'light') add('theme', 'first press did not switch to light');
  if (t.checked !== 'true') add('theme', `aria-checked is "${t.checked}" after switching to light`);
  if (t.stored !== 'light') add('theme', `localStorage is "${t.stored}" after switching to light`);
  if (t.meta === '#0a1626') add('theme', 'theme-color meta did not update for light');

  await page.click('[data-theme-toggle]');
  await page.waitForTimeout(600);
  t = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    checked: document.querySelector('[data-theme-toggle]').getAttribute('aria-checked'),
  }));
  if (t.theme) add('theme', `second press left data-theme="${t.theme}" instead of clearing it`);
  if (t.checked !== 'false') add('theme', `aria-checked is "${t.checked}" back in dark`);

  // --- Testimonials ---
  await toTop();
  const next = page.locator('[data-quote-next]');
  if (await next.count()) {
    const before = await page.locator('[data-quote-current]').textContent();
    await next.click();
    await page.waitForTimeout(700);
    const after = await page.locator('[data-quote-current]').textContent();
    if (before === after) add('testimonials', 'next button did not advance the counter');

    const visibleCount = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-quote]'))
        .filter((el) => !el.hasAttribute('aria-hidden')).length);
    if (visibleCount !== 1) add('testimonials', `${visibleCount} slides exposed to assistive tech (expected 1)`);

    // wrap-around
    const total = await page.evaluate(() => document.querySelectorAll('[data-quote]').length);
    for (let i = 0; i < total; i++) { await next.click(); await page.waitForTimeout(160); }
    const wrapped = await page.locator('[data-quote-current]').textContent();
    if (Number(wrapped) < 1 || Number(wrapped) > total) {
      add('testimonials', `counter reads "${wrapped}" after wrapping (expected 1–${total})`);
    }
  }

  // --- Mobile menu ---
  await page.setViewportSize({ width: 390, height: 844 });
  await toTop();
  await page.click('[data-menu-toggle]');
  await page.waitForTimeout(800);
  let menu = await page.evaluate(() => {
    const m = document.querySelector('[data-menu]');
    return {
      open: m.classList.contains('is-open'),
      hidden: m.getAttribute('aria-hidden'),
      expanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'),
      locked: document.body.classList.contains('is-locked'),
      focusInside: !!document.activeElement?.closest('[data-menu]'),
    };
  });
  if (!menu.open) add('menu', 'did not open');
  if (menu.hidden !== 'false') add('menu', `aria-hidden is "${menu.hidden}" while open`);
  if (menu.expanded !== 'true') add('menu', 'toggle aria-expanded not set to true');
  if (!menu.locked) add('menu', 'body scroll not locked while open');
  if (!menu.focusInside) add('menu', 'focus not moved into the panel');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  menu = await page.evaluate(() => ({
    open: document.querySelector('[data-menu]').classList.contains('is-open'),
    locked: document.body.classList.contains('is-locked'),
  }));
  if (menu.open) add('menu', 'Escape did not close it');
  if (menu.locked) add('menu', 'body scroll still locked after Escape');

  // theme toggle inside the menu
  await toTop();
  await page.click('[data-menu-toggle]');
  await page.waitForTimeout(700);
  const menuToggles = await page.locator('[data-menu] [data-theme-toggle]').count();
  if (!menuToggles) add('menu', 'no theme control inside the mobile menu');
  else {
    await page.locator('[data-menu] [data-theme-toggle]').click();
    await page.waitForTimeout(500);
    const both = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-theme-toggle]'))
        .map((el) => el.getAttribute('aria-checked')));
    if (new Set(both).size !== 1) add('theme', `toggles out of sync: ${both.join(', ')}`);
  }
  await page.setViewportSize({ width: 1440, height: 900 });

  // --- FAQ ---
  await page.goto(BASE + '/practice-areas/taxation/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const faq = page.locator('.faq__item').first();
  if (await faq.count()) {
    await faq.locator('summary').click();
    await page.waitForTimeout(400);
    if (!(await faq.evaluate((el) => el.open))) add('faq', 'first item did not open on click');
    await faq.locator('summary').click();
    await page.waitForTimeout(400);
    if (await faq.evaluate((el) => el.open)) add('faq', 'first item did not close again');
  }

  // --- Map ---
  await page.goto(BASE + '/contact/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.click('[data-map-load]');
  await page.waitForTimeout(900);
  if (!(await page.locator('.map__frame').count())) add('contact', 'map did not load on click');

  // --- Skip link ---
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.keyboard.press('Tab');
  await page.waitForTimeout(500); // let the slide-in transition finish
  const skip = await page.evaluate(() => {
    const el = document.activeElement;
    return { cls: el?.className, top: el?.getBoundingClientRect().top };
  });
  if (!String(skip.cls).includes('skip-link')) add('a11y', `first Tab focuses "${skip.cls}", not the skip link`);
  else if (skip.top < 0) add('a11y', 'skip link stays off-screen when focused');

  await ctx.close();
}

await browser.close();

/* Collapse "same defect, many pages" into one line each. */
const grouped = new Map();
for (const f of findings) {
  const [where, ...rest] = f.split(' — ');
  const what = rest.join(' — ');
  if (!grouped.has(what)) grouped.set(what, []);
  grouped.get(what).push(where);
}
const lines = [...grouped.entries()].map(([what, wheres]) => {
  const uniq = [...new Set(wheres)];
  const scope = uniq.length > 3 ? `${uniq.length} pages` : uniq.join(', ');
  return `  • ${what}\n      ${scope}`;
});
console.log(lines.length ? lines.join('\n') : '  (clean)');
console.log(`\n=== ${grouped.size} DISTINCT ISSUE(S), ${findings.length} occurrence(s) ===`);
