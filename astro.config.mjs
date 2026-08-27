import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.anveshanaconsultants.in',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
