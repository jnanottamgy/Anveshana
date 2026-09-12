import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/* Build date, used as <lastmod>. The site is static and every
   page ships from the same build, so the build is honestly when
   each page last changed. Per-page git dates were considered and
   rejected: they would claim a page is stale when only its
   wording moved a line, and lastmod is a weak signal not worth
   that complexity. */
const lastmod = new Date();

/* Relative importance, not absolute. Practice areas and contact
   are where enquiries begin; the legal pages must be indexed but
   should never outrank them. */
const PRIORITY = [
  [/^\/$/, 1.0],
  [/^\/practice-areas\/[^/]+\/$/, 0.9],
  [/^\/practice-areas\/$/, 0.9],
  [/^\/contact\/$/, 0.8],
  [/^\/people\/$/, 0.8],
  [/^\/about\/$/, 0.7],
];

export default defineConfig({
  site: 'https://www.anveshanaconsultants.in',
  integrations: [
    sitemap({
      lastmod,
      /* The 404 is generated as a page but must never be
         advertised for crawling. */
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const hit = PRIORITY.find(([re]) => re.test(path));
        item.priority = hit ? hit[1] : 0.3;
        /* Legal text and the firm's details change rarely;
           saying otherwise wastes crawl budget. */
        item.changefreq = item.priority >= 0.8 ? 'monthly' : 'yearly';
        return item;
      },
    }),
  ],
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
