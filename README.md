# Anveshana Advocates & Consultants

The website for Anveshana Advocates & Consultants, a litigation-led law firm
in Seshadripuram, Bengaluru.

Built with [Astro](https://astro.build) as a fully static site: no database, no
server, no CMS subscription. It can be hosted anywhere that serves files.

---

## Running it locally

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install     # once
npm run dev     # start the dev server at http://localhost:4321
npm run build   # write the production site into dist/
npm run preview # serve the built site locally, exactly as it will deploy
```

`dist/` is the finished website. Nothing else is needed to host it.

---

## Where things live

```
src/
  data/site.ts          ← ALL editable content. Start here.
  pages/                ← one file per page (routes come from filenames)
    index.astro                     /
    about.astro                     /about/
    people.astro                    /people/
    contact.astro                   /contact/
    disclaimer.astro                /disclaimer/
    privacy.astro                   /privacy/
    404.astro                       (shown for unknown addresses)
    practice-areas/
      index.astro                   /practice-areas/
      [slug].astro                  one page per practice area, generated
  layouts/
    Base.astro          ← <head>, SEO, structured data, page shell
    Legal.astro         ← shared shell for disclaimer + privacy
  components/           ← reusable pieces (header, footer, cards, hero…)
  styles/
    tokens.css          ← the design system: colours, type, spacing, motion
    base.css            ← reset, typography, buttons, shared primitives
    motion.css          ← every animation, in one place
    fonts.css           ← @font-face declarations
  scripts/motion.js     ← the animation engine (~2.5 KB gzipped)
public/                 ← files served as-is: fonts, icons, robots.txt
scripts/                ← development tooling (screenshots, accessibility audit)
```

---

## Editing content

**Almost everything you will want to change is in `src/data/site.ts`.**
Open it, change the words, save, and the site updates everywhere that text
appears. See [HANDOFF.md](./HANDOFF.md) for a walkthrough of each section,
plus the list of items that must be verified before launch.

---

## Development tooling

```bash
node scripts/make-icons.mjs   # regenerate favicons + the social share card
node scripts/a11y.mjs         # accessibility audit (needs the preview running)
node scripts/scan.mjs         # screenshot a page down its full length
```

The audit and screenshot scripts need a preview server running
(`npm run preview`) and Chromium available via Playwright.

---

## What this site does not do

No analytics, no tracking pixels, no advertising cookies, no third-party
fonts, and no external requests on page load. There is no contact form —
every "request a consultation" button opens WhatsApp directly, so there is no
form service to maintain and no enquiry inbox to forget to check. The map on
the contact page is the only third-party embed, and it does not load until a
visitor clicks it.

This is deliberate — it keeps the site fast, keeps visitor data out of other
companies' hands, and keeps the privacy notice short and true.
