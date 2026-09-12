/* ============================================================
   SOCIAL SHARE CARDS
   ------------------------------------------------------------
   One 1200x630 card per page, written to public/og/.

   Why this matters more here than on most sites: every enquiry
   this firm receives arrives through a WhatsApp link, so the
   link preview is the single most-viewed piece of design on the
   site. One generic card for sixteen pages wasted that.

   Why Chromium rather than sharp's SVG renderer: librsvg
   resolves `font-family` against system fonts, and the site's
   faces are self-hosted woff2. The previous card asked for Jost
   and Cormorant and silently rendered in DejaVu — the one place
   the brand's typography was not the brand's typography. A real
   browser loads the same @font-face the site does.

   Run after a build, then build again so the pages pick the
   cards up:

     npm run build && npm run og && npm run build

   Paths are by convention, not by manifest: Base.astro derives
   /og<pathname>.png, and `npm run seo` fails if a page points at
   a card that is not on disk.
   ============================================================ */
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { globSync } from 'node:fs';
import { dirname } from 'node:path';

const DIST = 'dist';
const OUT = 'public/og';
const CHROME =
  process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const MARK =
  'M 598.3 0 L 615.4 6.4 L 629.3 21.4 L 790.6 307.2 L 727.6 308.2 L 460.5 800.2 ' +
  'L 456.7 821.6 L 468.5 840.8 L 492.5 851.5 L 539.5 856.3 L 540.6 864.3 L 0 864.9 ' +
  'L 0 856.3 L 27.8 855.2 L 64.1 840.3 L 106.3 798.1 L 564.1 15 L 594 0 Z';

const b64 = (p) => readFileSync(p).toString('base64');
const CORMORANT = b64('public/fonts/cormorant-garamond-latin-300-normal.woff2');
const CORMORANT_I = b64('public/fonts/cormorant-garamond-latin-300-italic.woff2');
const JOST = b64('public/fonts/jost-latin-500-normal.woff2');

/* Read the real page titles out of the build, so a card can
   never disagree with the page it represents. */
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

const routes = [];
for (const file of globSync(`${DIST}/**/*.html`).sort()) {
  const route = '/' + file.replace(`${DIST}/`, '').replace(/index\.html$/, '');
  /* The error page is noindex and nobody shares it. */
  if (route.startsWith('/404')) continue;

  const html = readFileSync(file, 'utf8');
  const raw = decode((html.match(/<title>([^<]*)<\/title>/) ?? [, ''])[1]);

  /* Strip the firm suffix: the lockup is already on the card, so
     repeating it would spend the headline on the brand name
     rather than on what the page is. */
  let name = raw.split(' — ')[0].trim();
  if (/^Anveshana/i.test(name)) name = 'Advocates & Consultants';

  routes.push({ route, name });
}

if (!routes.length) {
  console.log('No built pages found. Run `npm run build` first.');
  process.exit(1);
}

const card = (name) => `<!doctype html>
<style>
  @font-face {
    font-family: 'Cormorant Garamond';
    font-weight: 300;
    src: url(data:font/woff2;base64,${CORMORANT}) format('woff2');
  }
  @font-face {
    font-family: 'Cormorant Garamond';
    font-weight: 300;
    font-style: italic;
    src: url(data:font/woff2;base64,${CORMORANT_I}) format('woff2');
  }
  @font-face {
    font-family: 'Jost';
    font-weight: 500;
    src: url(data:font/woff2;base64,${JOST}) format('woff2');
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    background:
      radial-gradient(ellipse 70% 90% at 78% 18%, rgba(42,159,214,0.16), transparent 62%),
      radial-gradient(ellipse 90% 70% at 10% 96%, rgba(198,166,100,0.10), transparent 60%),
      linear-gradient(155deg, #0e1d31 0%, #0a1626 46%, #060e19 100%);
    color: #f1ede4;
  }
  /* The mark as a watermark bled off the corner, the same device
     the site uses. Behind the type and well clear of it — the
     old card let the mark cut straight through the wordmark. */
  .mark {
    position: absolute; right: -104px; bottom: -190px;
    width: 620px; opacity: 0.07; color: #f1ede4;
  }
  .mark svg { width: 100%; height: auto; display: block; }
  .grid {
    position: absolute; inset: 0;
    background-image: repeating-linear-gradient(
      90deg, rgba(241,237,228,0.045) 0 1px, transparent 1px 100px);
    mask-image: linear-gradient(180deg, transparent, #000 26%, #000 70%, transparent);
  }
  .inner {
    position: relative; height: 100%;
    padding: 78px 96px; display: flex; flex-direction: column;
  }
  .lockup { display: flex; align-items: center; gap: 20px; }
  .lockup__mark { width: 44px; color: #3aa7dd; }
  .lockup__mark svg { width: 100%; height: auto; display: block; }
  .lockup__name {
    font-family: 'Jost', sans-serif; font-weight: 500;
    font-size: 27px; letter-spacing: 0.3em; color: #fffdf9;
  }
  h1 {
    font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 300;
    font-size: 96px; line-height: 1.02; letter-spacing: -0.022em;
    color: #fffdf9; margin-top: auto; max-width: 15ch;
  }
  h1 em { font-style: italic; color: #c6a664; }
  .foot {
    margin-top: 40px; padding-top: 26px;
    border-top: 1px solid rgba(241,237,228,0.14);
    display: flex; align-items: baseline; justify-content: space-between;
    font-family: 'Jost', sans-serif; font-weight: 500;
    font-size: 19px; letter-spacing: 0.22em; text-transform: uppercase;
  }
  .foot__left { color: #c6a664; }
  .foot__right { color: #a9b4c2; letter-spacing: 0.14em; }
</style>
<body>
  <span class="grid"></span>
  <span class="mark">
    <svg viewBox="0 0 1000 866" fill="none">
      <path d="${MARK}" fill="currentColor"/>
      <circle cx="846.7" cy="711.3" r="153.3" fill="currentColor"/>
    </svg>
  </span>
  <div class="inner">
    <div class="lockup">
      <span class="lockup__mark">
        <svg viewBox="0 0 1000 866" fill="none">
          <path d="${MARK}" fill="#3aa7dd"/>
          <circle cx="846.7" cy="711.3" r="153.3" fill="#438dcb"/>
        </svg>
      </span>
      <span class="lockup__name">ANVESHANA</span>
    </div>
    <h1>${name}</h1>
    <div class="foot">
      <span class="foot__left">Advocates &amp; Consultants</span>
      <span class="foot__right">Bengaluru &nbsp;·&nbsp; +91 99641 40121</span>
    </div>
  </div>
</body>`;

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

for (const { route, name } of routes) {
  const file =
    route === '/'
      ? `${OUT}/home.png`
      : `${OUT}${route.replace(/\/$/, '')}.png`;
  mkdirSync(dirname(file), { recursive: true });

  await page.setContent(card(name), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file });
  console.log(`  ${route.padEnd(40)} -> ${file.replace('public/', '')}`);
}

/* The home card doubles as public/og-image.png: that path is the
   organisation entity's `image` in the structured data and the
   last-resort fallback, and it still held the old card rendered
   in fallback fonts. */
await page.setContent(card('Advocates & Consultants'), { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og-image.png' });
console.log(`  ${'(generic fallback)'.padEnd(40)} -> og-image.png`);

await browser.close();
console.log(`\n${routes.length + 1} card(s) written.`);
