/* ============================================================
   PORTRAIT PIPELINE
   ------------------------------------------------------------
   Turns a photographer's delivery into the exact set of files
   the site serves.

   To add a portrait:
     1. Drop the file in  src/portraits/<slug>.{jpg,png,webp}
        where <slug> matches the person's `slug` in data/site.ts
        (e.g. src/portraits/deepika-mahesh.jpg).
     2. Run  npm run portraits
     3. Add  photo: '/portraits/<slug>'  to that person's record.

   No other change is needed — the crop, the formats, the sizes
   and the markup are all handled.

   Every portrait is cropped to 4:5 to match the plate. Photo-
   graphers deliver 2:3 or 3:4, so something always has to go;
   cropping here (deliberately, once, at build time) rather than
   leaving it to `object-fit: cover` in the browser means the
   composition is a decision instead of an accident. The default
   anchor is the TOP of the frame, because a portrait wants
   headroom and the bottom of a standing shot is jacket.

   Override the anchor per person in ANCHOR below: 0 keeps the
   top, 1 keeps the bottom, 0.5 centres.
   ============================================================ */
import sharp from 'sharp';
import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

const SRC_DIR = 'src/portraits';
const OUT_DIR = 'public/portraits';

/* The plate is 4:5 everywhere it appears. */
const ASPECT = 4 / 5;

/* Rendered plate is ~340–480px wide; 960 covers that at 2x DPR.
   Nothing is ever upscaled past the source. */
const WIDTHS = [360, 480, 640, 960];

/* Vertical crop anchor, 0 (keep top) to 1 (keep bottom). */
const ANCHOR = {
  /* Full width, top-anchored: keeps the shelving and the lamp
     that give the frame its depth, and the dark pillar that
     separates his head from the glass. Only lower jacket is
     lost. */
  'nirankush-kenjige': 0,
};

const SOURCES = /\.(jpe?g|png|webp|tiff?)$/i;

mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(SRC_DIR).filter((f) => SOURCES.test(f));

if (!files.length) {
  console.log(`No portraits in ${SRC_DIR}/ — nothing to do.`);
  process.exit(0);
}

let totalBytes = 0;

for (const file of files) {
  const slug = basename(file, extname(file));
  const src = join(SRC_DIR, file);
  const meta = await sharp(src).metadata();

  /* Crop to 4:5 by trimming the longer axis. */
  let width = meta.width;
  let height = Math.round(width / ASPECT);

  if (height > meta.height) {
    height = meta.height;
    width = Math.round(height * ASPECT);
  }

  const anchor = ANCHOR[slug] ?? 0;
  const left = Math.round((meta.width - width) / 2);
  const top = Math.round((meta.height - height) * anchor);

  const cropped = await sharp(src)
    .extract({ left, top, width, height })
    .toBuffer();

  const widths = WIDTHS.filter((w) => w <= width);
  if (!widths.includes(width) && widths.length < WIDTHS.length) widths.push(width);

  const written = [];

  for (const w of widths) {
    const base = sharp(cropped).resize(w, null, { fit: 'inside' });

    /* AVIF first: roughly 30% smaller than WebP on a photograph
       this dark, because most of the frame is low-detail
       shadow. */
    const avif = `${OUT_DIR}/${slug}-${w}.avif`;
    await base.clone().avif({ quality: 54, effort: 6 }).toFile(avif);

    /* WebP is the fallback rather than JPEG: it is supported by
       every browser that supports the `aspect-ratio` this
       layout already requires, so a JPEG would be dead weight
       nobody downloads. */
    const webp = `${OUT_DIR}/${slug}-${w}.webp`;
    await base.clone().webp({ quality: 80, effort: 5 }).toFile(webp);

    written.push([avif, webp]);
  }

  const bytes = written
    .flat()
    .reduce((sum, f) => sum + statSync(f).size, 0);
  totalBytes += bytes;

  console.log(
    `${slug}\n` +
      `    source  ${meta.width}x${meta.height} ${meta.format}\n` +
      `    crop    ${width}x${height} at ${left},${top} (anchor ${anchor})\n` +
      `    output  ${widths.join(', ')}px in avif + webp — ` +
      `${(bytes / 1024).toFixed(0)} KB total`
  );
}

console.log(
  `\n${files.length} portrait(s), ${(totalBytes / 1024).toFixed(0)} KB on disk. ` +
    `A browser downloads one format at one size.`
);
