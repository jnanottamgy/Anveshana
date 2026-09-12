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
   composition is a decision instead of an accident.

   FRAMING THE SET
   The advocates must look photographed for the same page, and
   the eye judges that on how large a head sits IN THE CROP —
   not on how it was shot. Anish and Nirankush were framed almost
   identically at the camera (heads 309px and 312px), but Anish's
   file is taller, so an identical full-width 4:5 crop left him
   22.7% of frame against Nirankush's 26.0%: visibly smaller and
   lower, for no reason a viewer could name.

   So FRAME below carries, per person:
     scale — fraction of the source WIDTH to keep. 1 is the whole
             frame; less zooms in.
     x, y  — where the kept rectangle sits in what is left over,
             0 to 1. y defaults to 0 (keep the top), because a
             portrait wants headroom and the bottom of a standing
             shot is jacket.

   To match a new portrait to the set: measure the head height as
   a fraction of the crop and aim for ~26%.
   ============================================================ */
import sharp from 'sharp';
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

const SRC_DIR = 'src/portraits';
const OUT_DIR = 'public/portraits';

/* Written for Portrait.astro to read, so the widths are declared
   in exactly one place. They cannot be a constant shared by both:
   a crop is only as wide as its source allows, so the set differs
   per portrait (Anish's tops out at 949, Nirankush's at 960). */
const MANIFEST = 'src/data/portraits.json';

/* The plate is 4:5 everywhere it appears. */
const ASPECT = 4 / 5;

/* Rendered plate is ~340–480px wide; 960 covers that at 2x DPR.
   Nothing is ever upscaled past the source. */
const WIDTHS = [360, 480, 640, 960];

const FRAME = {
  /* Full width, top-anchored: keeps the shelving and the lamp
     that give the frame its depth, and the dark pillar that
     separates his head from the glass. Only lower jacket is
     lost. This is the portrait the others are matched to. */
  'nirankush-kenjige': { scale: 1, y: 0 },

  /* Zoomed to 0.874 so his head reads at the same 26% of frame,
     and dropped to 0.69 so it sits at the same height. Cropping
     in also loses most of the bright window on the left, which
     was the one blown-out area in either photograph and glared
     inside the dark plate. */
  'anish-acharya': { scale: 0.874, x: 0.5, y: 0.69 },
};

const SOURCES = /\.(jpe?g|png|webp|tiff?)$/i;

mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(SRC_DIR).filter((f) => SOURCES.test(f));

if (!files.length) {
  console.log(`No portraits in ${SRC_DIR}/ — nothing to do.`);
  process.exit(0);
}

let totalBytes = 0;
const manifest = {};

for (const file of files) {
  const slug = basename(file, extname(file));
  const src = join(SRC_DIR, file);
  const meta = await sharp(src).metadata();

  const { scale = 1, x = 0.5, y = 0 } = FRAME[slug] ?? {};

  /* Crop to 4:5 by trimming the longer axis, then zoom by scale. */
  let width = Math.round(meta.width * scale);
  let height = Math.round(width / ASPECT);

  if (height > meta.height) {
    height = meta.height;
    width = Math.round(height * ASPECT);
  }

  const left = Math.round((meta.width - width) * x);
  const top = Math.round((meta.height - height) * y);

  const cropped = await sharp(src)
    .extract({ left, top, width, height })
    .toBuffer();

  const widths = WIDTHS.filter((w) => w <= width);
  if (!widths.includes(width) && widths.length < WIDTHS.length) widths.push(width);

  /* Clear this portrait's previous output first. Re-framing changes
     the largest width (Anish went from 960 to 949 when he was
     zoomed to match the set), and without this the old renditions
     linger: dead weight in the repo, and a trap for anything that
     assumes a fixed width — the Person schema did exactly that and
     kept resolving to a stale file. */
  const stale = new RegExp(`^${slug}-\\d+\\.(avif|webp)$`);
  for (const f of readdirSync(OUT_DIR)) {
    if (stale.test(f)) rmSync(join(OUT_DIR, f));
  }

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

  manifest[slug] = { widths, width, height };

  const bytes = written
    .flat()
    .reduce((sum, f) => sum + statSync(f).size, 0);
  totalBytes += bytes;

  console.log(
    `${slug}\n` +
      `    source  ${meta.width}x${meta.height} ${meta.format}\n` +
      `    crop    ${width}x${height} at ${left},${top} ` +
      `(scale ${scale}, x ${x}, y ${y})\n` +
      `    output  ${widths.join(', ')}px in avif + webp — ` +
      `${(bytes / 1024).toFixed(0)} KB total`
  );
}

writeFileSync(
  MANIFEST,
  JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2) + '\n'
);

console.log(
  `\n${files.length} portrait(s), ${(totalBytes / 1024).toFixed(0)} KB on disk. ` +
    `A browser downloads one format at one size.\n` +
    `Wrote ${MANIFEST}.`
);
