/* Generates raster icons + the Open Graph card from the SVG mark.
   Run with: node scripts/make-icons.mjs */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const favicon = readFileSync('public/favicon.svg');

await sharp(favicon, { density: 384 }).resize(180, 180).png()
  .toFile('public/apple-touch-icon.png');
await sharp(favicon, { density: 384 }).resize(512, 512).png()
  .toFile('public/icon-512.png');
await sharp(favicon, { density: 384 }).resize(192, 192).png()
  .toFile('public/icon-192.png');
await sharp(favicon, { density: 384 }).resize(32, 32).png()
  .toFile('public/favicon-32.png');

/* ---- Open Graph card (1200x630) ------------------------- */
const MARK = 'M 598.3 0 L 615.4 6.4 L 629.3 21.4 L 790.6 307.2 L 727.6 308.2 L 460.5 800.2 L 456.7 821.6 L 468.5 840.8 L 492.5 851.5 L 539.5 856.3 L 540.6 864.3 L 0 864.9 L 0 856.3 L 27.8 855.2 L 64.1 840.3 L 106.3 798.1 L 564.1 15 L 594 0 Z';

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="a" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="#1092ca"/><stop offset="1" stop-color="#3aa7dd"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.35" r="0.75">
      <stop offset="0" stop-color="#14273f"/><stop offset="1" stop-color="#060e19"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(96 168) scale(0.34)" opacity="0.95">
    <path fill="url(#a)" d="${MARK}"/>
    <circle fill="#438dcb" cx="846.7" cy="711.3" r="153.3"/>
  </g>
  <g transform="translate(96 470)">
    <rect x="0" y="-46" width="86" height="1" fill="#c6a664"/>
    <text x="0" y="0" font-family="Jost, Futura, sans-serif" font-size="46" letter-spacing="13"
          fill="#f1ede4">ANVESHANA</text>
    <text x="4" y="42" font-family="Jost, Futura, sans-serif" font-size="18" letter-spacing="7.5"
          fill="#c6a664">ADVOCATES &amp; CONSULTANTS</text>
    <text x="4" y="96" font-family="Georgia, serif" font-size="30" font-style="italic"
          fill="#a9b4c2">Counsel of consequence. Bengaluru.</text>
  </g>
</svg>`;

writeFileSync('public/og-source.svg', og);
await sharp(Buffer.from(og), { density: 144 }).png().toFile('public/og-image.png');

console.log('icons + og card written');
