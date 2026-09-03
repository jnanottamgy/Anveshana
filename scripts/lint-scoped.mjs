/* ============================================================
   SCOPED-STYLE LINT
   ------------------------------------------------------------
   Astro scopes a component's <style> to elements written in
   THAT component's template. A class passed as a prop into a
   child component lands on an element carrying the CHILD's
   scope id, so the parent's rule compiles to a selector that
   can never match — and fails silently, with no build error
   and no console warning.

   This bug shipped four separate times on this project (every
   monogram watermark squashed to 17px, the theme-toggle knob
   frozen, and every display headline rendering at the wrong
   size). It is invisible in review and obvious in a browser,
   which is the worst combination, so it gets a linter.

   Run:  node scripts/lint-scoped.mjs
   ============================================================ */
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const files = globSync('src/**/*.astro');
const problems = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');

  const styleStart = src.indexOf('<style');
  /* Comments are stripped: a rule name mentioned in a comment is
     not a rule. */
  const style = (styleStart === -1 ? '' : src.slice(styleStart))
    .replace(/\/\*[\s\S]*?\*\//g, '');
  const template = styleStart === -1 ? src : src.slice(0, styleStart);

  /* Only imported .astro components carry their own scope id.
     A capitalised local holding a tag name (const Wrapper = 'a')
     renders a plain element and IS scoped by this component, so
     it must not be flagged. */
  const imported = new Set(
    [...src.matchAll(/^import\s+([A-Z][A-Za-z0-9_]*)\s+from\s+['"][^'"]+\.astro['"]/gm)]
      .map((m) => m[1])
  );

  /* Classes handed to a child component: <Capitalised … class="x y" />
     including multi-line usages. */
  const passed = new Set();
  const tagRe = /<([A-Z][A-Za-z0-9_]*)\b([^>]*?)\/?>/gs;
  for (const m of template.matchAll(tagRe)) {
    if (!imported.has(m[1])) continue;
    const attrs = m[2];
    const cls = attrs.match(/\bclass=["']([^"']+)["']/);
    if (cls) cls[1].split(/\s+/).filter(Boolean).forEach((c) => passed.add(c));
  }

  for (const cls of passed) {
    /* Ignore classes defined globally elsewhere (base.css etc.) —
       we only care about rules in THIS file's scoped block. */
    const scoped = new RegExp(
      `(^|[^(])\\.${cls.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`,
      'm'
    );
    const globalised = new RegExp(
      `:global\\([^)]*\\.${cls.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`
    );
    if (scoped.test(style) && !globalised.test(style)) {
      problems.push(
        `${file}\n    .${cls} is styled here but passed into a child component —\n    the rule will never match. Wrap it as :global(.${cls}).`
      );
    }
  }
}

if (problems.length) {
  console.log('Scoped-style problems:\n');
  problems.forEach((p) => console.log('  • ' + p + '\n'));
  console.log(`=== ${problems.length} problem(s) ===`);
  process.exit(1);
}
console.log('scoped styles: clean');
