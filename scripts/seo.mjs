/* ============================================================
   SEO AUDIT
   ------------------------------------------------------------
   Reads the BUILT site in dist/ — not the source — because what
   matters is what a crawler receives. No browser and no network,
   so it runs in about a second:

     npm run build && npm run seo

   Lengths are measured on DECODED text. "Anveshana Advocates &
   Consultants" is 33 characters to Google and 37 in the HTML
   source, and measuring the source made three titles look over
   budget when they were not.
   ============================================================ */
import { readFileSync, existsSync } from 'node:fs';
import { globSync } from 'node:fs';

const DIST = 'dist';
const SITE = 'https://www.anveshanaconsultants.in';

/* Google truncates around these. They are guidelines, not
   rules — a description at 165 is not broken, it is trimmed —
   so over-length is reported as a warning, not a failure. */
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;

const problems = [];
const warnings = [];
const fail = (where, what) => problems.push(`${where} — ${what}`);
const warn = (where, what) => warnings.push(`${where} — ${what}`);

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, '’')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&rarr;/g, '→');

const attr = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1]) : null;
};

const pages = globSync(`${DIST}/**/*.html`).sort();
if (!pages.length) {
  console.log('No built pages found. Run `npm run build` first.');
  process.exit(1);
}

/* Collected across pages so the link graph can be checked once
   every page has been read. */
const routeOf = (file) =>
  '/' +
  file
    .replace(`${DIST}/`, '')
    .replace(/index\.html$/, '')
    .replace(/\.html$/, '');

const inbound = new Map(); // route -> count of other pages linking to it
const seenRoutes = new Set();
const titles = new Map();
const descriptions = new Map();

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const route = routeOf(file);
  const tag = route;
  seenRoutes.add(route);

  /* ---- Title ------------------------------------------- */
  const title = attr(html, /<title>([^<]*)<\/title>/);
  if (!title) fail(tag, 'no <title>');
  else {
    if (title.length > TITLE_MAX) {
      warn(tag, `title is ${title.length} chars, over ${TITLE_MAX}: "${title}"`);
    }
    if (titles.has(title)) fail(tag, `duplicate title, also on ${titles.get(title)}`);
    else titles.set(title, route);
  }

  /* ---- Description ------------------------------------- */
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  if (!desc) fail(tag, 'no meta description');
  else {
    if (desc.length > DESC_MAX) {
      warn(tag, `description is ${desc.length} chars, over ${DESC_MAX}`);
    }
    if (desc.length < DESC_MIN) {
      warn(tag, `description is only ${desc.length} chars — thin`);
    }
    if (descriptions.has(desc)) {
      fail(tag, `duplicate description, also on ${descriptions.get(desc)}`);
    } else descriptions.set(desc, route);
  }

  /* ---- Canonical --------------------------------------- */
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  if (!canonical) fail(tag, 'no canonical');
  else {
    /* Compared with a tolerant trailing slash: the error page is
       emitted as 404.html but reports its path with one, and on a
       noindex page the canonical is ignored anyway. */
    const norm = (u) => u.replace(/\/$/, '');
    if (norm(canonical) !== norm(`${SITE}${route}`)) {
      fail(tag, `canonical is ${canonical}, expected ${SITE}${route}`);
    }
  }

  /* ---- Robots ------------------------------------------ */
  const robots = attr(html, /<meta name="robots" content="([^"]*)"/);
  if (!robots) warn(tag, 'no robots meta');
  /* An error page must never be indexable: it competes with the
     real pages and pollutes the index with a dead end. */
  if (route === '/404' && robots && !/noindex/.test(robots)) {
    fail(tag, `error page is indexable (robots: "${robots}")`);
  }

  /* ---- Open Graph / Twitter ---------------------------- */
  for (const p of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) {
    if (!html.includes(`property="${p}"`)) fail(tag, `missing ${p}`);
  }
  if (!html.includes('name="twitter:card"')) warn(tag, 'missing twitter:card');
  if (!html.includes('property="og:image:alt"') && !html.includes('name="og:image:alt"')) {
    warn(tag, 'og:image has no alt');
  }

  const ogImage = attr(html, /<meta property="og:image" content="([^"]*)"/);
  if (ogImage) {
    const local = ogImage.replace(SITE, '');
    if (!existsSync(`${DIST}${local}`)) fail(tag, `og:image missing on disk: ${local}`);
  }

  /* ---- Headings ---------------------------------------- */
  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length === 0) fail(tag, 'no <h1>');
  if (h1s.length > 1) fail(tag, `${h1s.length} <h1> elements`);

  /* ---- Language ---------------------------------------- */
  if (!/<html[^>]+lang="/.test(html)) fail(tag, 'no lang on <html>');

  /* ---- Structured data --------------------------------- */
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) fail(tag, 'no JSON-LD');
  for (const [, raw] of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      fail(tag, `JSON-LD does not parse: ${e.message}`);
      continue;
    }
    const nodes = parsed['@graph'] ?? [parsed];
    if (!parsed['@context']) fail(tag, 'JSON-LD has no @context');

    for (const node of nodes) {
      if (!node['@type']) fail(tag, 'JSON-LD node with no @type');
    }

    const types = nodes.map((n) => n['@type']).flat();
    if (!types.includes('LegalService')) {
      fail(tag, 'no LegalService node — the firm entity should be on every page');
    }

    /* Every @id that is referenced must be defined somewhere in
       the graph, or the reference dangles and the nodes do not
       connect into one entity. */
    const defined = new Set(nodes.map((n) => n['@id']).filter(Boolean));
    const refs = new Set();
    const walk = (o) => {
      if (Array.isArray(o)) return o.forEach(walk);
      if (o && typeof o === 'object') {
        const keys = Object.keys(o);
        if (keys.length === 1 && keys[0] === '@id') refs.add(o['@id']);
        else Object.values(o).forEach(walk);
      }
    };
    nodes.forEach(walk);
    for (const r of refs) {
      if (!defined.has(r)) fail(tag, `JSON-LD reference to undefined @id ${r}`);
    }

    /* A FAQPage with an empty answer is a rich-result rejection. */
    for (const node of nodes) {
      if (node['@type'] !== 'FAQPage') continue;
      for (const q of node.mainEntity ?? []) {
        if (!q.name) fail(tag, 'FAQ question with no name');
        if (!q.acceptedAnswer?.text) fail(tag, `FAQ "${q.name}" has no answer text`);
      }
    }
  }

  /* ---- Images ------------------------------------------ */
  for (const [, imgTag] of html.matchAll(/<img\b([^>]*)>/g)) {
    if (!/\balt=/.test(imgTag)) fail(tag, 'an <img> has no alt attribute');
    if (!/\bwidth=/.test(imgTag) || !/\bheight=/.test(imgTag)) {
      warn(tag, 'an <img> has no intrinsic width/height (causes layout shift)');
    }
  }

  /* ---- Link graph -------------------------------------- */
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    if (href === route) continue; // self-links don't count as inbound
    inbound.set(href, (inbound.get(href) ?? 0) + 1);
  }
}

/* ---- Sitemap ------------------------------------------- */
const sitemapFiles = globSync(`${DIST}/sitemap-*.xml`);
if (!sitemapFiles.length) fail('sitemap', 'no sitemap generated');

const sitemapXml = sitemapFiles.map((f) => readFileSync(f, 'utf8')).join('');
const listed = new Set(
  [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(SITE, ''))
    .filter((u) => !u.includes('sitemap'))
);

for (const route of seenRoutes) {
  if (route === '/404') {
    if (listed.has(route)) fail('sitemap', 'the 404 page is listed in the sitemap');
    continue;
  }
  if (!listed.has(route)) fail('sitemap', `${route} is built but not in the sitemap`);
}
for (const url of listed) {
  if (!seenRoutes.has(url)) fail('sitemap', `${url} is listed but was not built`);
}
if (!/<lastmod>/.test(sitemapXml)) warn('sitemap', 'no <lastmod> on any entry');
if (!/<priority>/.test(sitemapXml)) warn('sitemap', 'no <priority> on any entry');

/* ---- robots.txt ---------------------------------------- */
if (!existsSync(`${DIST}/robots.txt`)) {
  fail('robots.txt', 'missing');
} else {
  const robotsTxt = readFileSync(`${DIST}/robots.txt`, 'utf8');
  if (!/^\s*Sitemap:/im.test(robotsTxt)) fail('robots.txt', 'does not declare a Sitemap');
  if (/^\s*Disallow:\s*\/\s*$/im.test(robotsTxt)) fail('robots.txt', 'disallows the whole site');
}

/* ---- Orphans ------------------------------------------- */
/* A page nothing links to is reachable only from the sitemap,
   which is the weakest possible signal. 404 is expected to be
   an orphan. */
for (const route of seenRoutes) {
  if (route === '/404') continue;
  if (!inbound.has(route)) warn('links', `${route} has no inbound internal links (orphan)`);
}

/* ---- Report -------------------------------------------- */
const group = (list, label) => {
  if (!list.length) return;
  console.log(`\n${label}:\n`);
  list.forEach((p) => console.log('  • ' + p));
};

group(problems, `${problems.length} PROBLEM(S)`);
group(warnings, `${warnings.length} WARNING(S)`);

console.log(
  `\n=== ${pages.length} pages · ${problems.length} problem(s) · ${warnings.length} warning(s) ===`
);
if (problems.length) process.exit(1);
