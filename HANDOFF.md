# Handoff — Anveshana Advocates & Consultants

Everything the firm (or a future developer) needs in order to run, edit,
launch and maintain this website.

---

## 1. Before launch — the must-do list

These are the items only the firm can settle. **The site should not go live
until each is confirmed.** Every one of them is marked `VERIFY` in
`src/data/site.ts`, so you can find them by searching that file for the word.

| # | Item | Where | Why it matters |
|---|------|-------|----------------|
| 1 | **Biographies** for all three advocates | `people` in `site.ts` | Every bio is a professionally written draft built from the practice areas the firm supplied. **None of it is confirmed.** Replace with real text. |
| 2 | **Spelling of Deepika Mahesh's name** | `people` | Supplied as "deepike mahesh"; rendered as **Deepika Mahesh**. Confirm the correct spelling — a misspelt partner name on a launch site is the worst kind of small error. |
| 3 | **Consultation hours** | `firm.hours` | Currently a sensible assumption, not a fact. These also feed the Google structured data, so a wrong value misleads searchers. |
| 4 | **Courts and forums list** | `forums` | Standard for a Bengaluru litigation practice, but it is a claim about where the firm appears. Confirm or trim it. |
| 5 | **The WhatsApp number** | `whatsapp.number` | Every consultation button on the site opens a chat with this number. Confirm it is the one the firm actually monitors — see §4. |
| 6 | **Portraits of Anish Acharya and Deepika Mahesh** | see §6 | Nirankush Kenjige is photographed. The other two render as typographic plates, which is deliberate and does not look broken — but two real portraits would finish the page. Match the brief in §6 so the three read as one set. |
| 7 | **Bar Council review of the copy** | whole site | See §7. Have an advocate at the firm read the site once with Rule 36 in mind. |

---

## 2. Editing content

Open `src/data/site.ts`. It is one plain file, heavily commented, and it holds
every word of editable copy on the website.

### `firm`
Name, address, phone, email, hours, map links. Changing the phone number here
changes it in the header, the hero, the contact page, the footer, the calls to
action and the Google structured data — all at once.

### `nav`
The main menu. Add or remove an entry and both the desktop menu and the
mobile menu update.

### `practiceAreas`
The eight practice areas. Each one automatically becomes:
- a row on the homepage index,
- a row on `/practice-areas/`,
- **its own page** at `/practice-areas/<slug>/`,
- an entry in the footer,
- a WhatsApp enquiry that opens already naming that area,
- and its own Google structured data, including the FAQ.

To add a ninth area, copy an existing block and change the fields. To remove
one, delete its block. The order of the array is the order they appear in
everywhere, and `index` is only the numeral shown beside each — renumber them
if you reorder. Nothing else needs touching.

Each area has:
- `summary` — one line, shown on index rows
- `body` — the paragraphs on its page
- `scope` — the concrete matters handled, shown as a list
- `faqs` — questions and answers; these are what can appear as expandable
  results in Google, so they are worth keeping accurate
- `metaDescription` — the grey text under the page's Google result

### `people`
The advocates. Each becomes a card on the homepage and a full profile on
`/people/`.

**To add a photograph:** put the image in `public/people/`, then add
`photo: '/people/anish-acharya.jpg'` to that person's entry. The typographic
initials plate is replaced by the portrait automatically — no other change is
needed. Portraits look best at 4:5 (e.g. 1200 × 1500).

### `testimonials`
Reproduced verbatim from the existing site — **less one**. The previous
website carried a testimonial praising an advocate who has since left the
firm. It has been removed rather than reworded: a testimonial crediting
someone a client can no longer instruct misleads them about who they would
actually be working with. See §7 before adding more.

### `commitments`, `process`, `forums`
The three promises, the four-stage method, and the courts list.

### The two newest areas
**Intellectual Property** and **Taxation** were added so that the practice
list matches what the People page claims — Deepika Mahesh leads both, and
without pages for them the site could not rank for searches like "trade mark
attorney Bengaluru". Nirankush Kenjige's TMT work is covered inside Corporate
Advisory rather than given a page of its own.

Both are drafts written from the areas the firm supplied, and both carry the
same caveat as the biographies: **read the scope lists and FAQs and correct
anything the firm does not actually do.** The tax FAQ in particular draws a
line between what a chartered accountant handles and what a lawyer handles —
confirm the firm is happy with where that line sits.

---

## 3. Deploying

The site builds to plain files, so any host works. Two good options:

### Vercel (recommended — free for this)
1. Push this repository to GitHub.
2. At [vercel.com](https://vercel.com), *Add New → Project*, pick the repo.
3. Vercel detects Astro and fills in the settings. Press Deploy.
4. Under *Settings → Domains*, add `anveshanaconsultants.in` and
   `www.anveshanaconsultants.in`, then point the domain's DNS at Vercel as
   instructed on that screen.

Every push to the main branch then redeploys automatically.

### Any ordinary web host
Run `npm run build` and upload the **contents of `dist/`** to the web root.
That is the entire website.

**One setting to check on a traditional host:** the site uses directory-style
addresses (`/about/`, not `/about.html`). Most hosts handle this. Also point
the server's 404 handler at `/404.html`.

---

## 4. Enquiries — how they reach the firm

**There is no contact form and no consultation page.** Every
"request a consultation" button on the site opens a WhatsApp conversation
with the chambers directly. On a phone that opens the WhatsApp app; on a
desktop it opens WhatsApp Web, or the desktop app if one is installed.

This is deliberate. For a Bengaluru practice, WhatsApp is where clients
already are: nothing to type into a form, nothing to check an inbox for, no
form-handling subscription to maintain, and no spam. It also removes the
single most common failure mode of a law firm website — enquiries landing in
a form service nobody remembers to check.

### Changing the number

In `src/data/site.ts`:

```ts
export const whatsapp = {
  number: '919964140121',   // digits only, country code, no + and no spaces
  defaultMessage: 'Hello, I would like to request a consultation…',
};
```

The format matters: `wa.me` requires the country code with no plus sign and
no spaces. `+91 99641 40121` becomes `919964140121`.

### The pre-filled message

Each chat opens with an opening line already typed. The visitor can edit or
delete it before sending — it exists to save them writing the first sentence.

**Practice-area pages go further:** the chat opens already naming the area,
so someone arriving from the criminal law page starts with *"…regarding a
criminal law matter."* The firm therefore knows what the enquiry concerns
before reading a word. That is handled automatically in
`src/pages/practice-areas/[slug].astro` — nothing to configure.

### Where the buttons are

Header · mobile menu · homepage hero · the closing band on every page ·
the contact page · the footer · the 404 page. All of them are the one
component, `src/components/WhatsAppAction.astro`, so changing it once changes
every button on the site.

The contact page remains — it carries the address, hours, map and directions,
which is what earns the firm local search visibility — but its enquiry
mechanism is WhatsApp, with phone and email offered for anyone who would
rather not use it.

### Worth doing

Set up a **WhatsApp Business** account on that number (free). It gives the
firm a business profile, saved quick replies, labels for organising enquiries,
and automated away-messages outside consultation hours. The link on the site
works identically either way.

---

## 5. The design system

If you change nothing else, keep this in mind: **colours, type sizes, spacing
and animation timings all live in `src/styles/tokens.css`.** Change a value
there and it propagates across all fourteen pages consistently.

### Colours
Sampled from the firm's own logo artwork, then anchored in ink and metal so
the brand reads as senior counsel rather than software startup.

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0a1626` | The dominant dark surface |
| `--obsidian` | `#060e19` | Deepest layer, footer |
| `--bone` | `#f4f1ea` | Warm paper — deliberately not pure white |
| `--champagne` | `#c6a664` | Metal accent, on dark surfaces |
| `--bronze` | `#7c602f` | The same metal, for text on light surfaces |
| `--azure` | `#2a9fd6` | The logo blue, used live and sparingly |

### Light and dark
The site ships **two themes**, switched by the control in the header (and in
the mobile menu). Dark is the brand default; the choice is remembered in the
visitor's browser.

Both themes live in `tokens.css`. Dark is defined on `:root`; light is a
single `[data-theme='light']` block that overrides only what must invert —
surfaces, text, hairlines and the atmospheric layers (glows, grain, vignette).
Everything structural is shared, so the two themes cannot drift apart in
layout, only in colour.

Two things are deliberately **not** themed:
- **The portrait plates** on the People page stay dark in both themes. A
  photograph does not turn beige when the page does, and keeping them dark
  makes that page read as intentional in light mode rather than washed out.
- **Buttons** keep the champagne fill with dark text in both themes.

**A theme's colours are never hard-coded in a component.** If you add a new
colour, add a token — otherwise it will look correct in one theme and wrong
in the other. The accessibility script audits both themes, so a mistake here
shows up immediately.

To make the site follow the visitor's system setting instead of defaulting to
dark, add a `prefers-color-scheme` check to the inline script at the top of
`src/layouts/Base.astro`. It is deliberately absent: the dark theme is the
firm's identity, and a client opening the link on a light-mode laptop should
see the design as designed.

**Why two metals:** champagne on bone measures 2.06:1, far below the legal
minimum for readable text. Sections tagged `.on-bone` automatically swap
`--accent` to bronze. If you add a new light section, give it the `on-bone`
class and accents correct themselves.

### Type
- **Cormorant Garamond** — display headings
- **Jost** — labels, navigation, buttons (chosen to echo the logo's own wordmark)
- **Inter** — body text

Self-hosted from `public/fonts` — no Google Fonts request, so no third party
sees your visitors. To regenerate the files:
`npm i @fontsource/cormorant-garamond @fontsource/jost @fontsource-variable/inter`
then copy the `latin-*.woff2` files out of `node_modules/@fontsource*/…/files/`.

### Motion
Everything animated is in `src/styles/motion.css` and
`src/scripts/motion.js` — about 2.5 KB gzipped in total, with no animation
library. The whole system switches off automatically for anyone whose device
requests reduced motion.

To dial the animation down globally, raise `--dur` in `tokens.css`, or delete
the `<div class="curtain">` block in `Base.astro` to remove the opening
sequence.

---

## 6. Portraits

### What is in place

**Nirankush Kenjige is photographed.** The frame is a good one and the site
is built around its qualities: a dark suit against dark shelving, warm
practical lights, glass to one side. It sits inside the existing palette
without being corrected toward it.

Anish Acharya and Deepika Mahesh are **not yet photographed**, and the page
is built so that this does not read as an omission. The photograph and the
typographic plate share a silhouette — the same 4:5 proportion, the same
hairline, the same dark ink field, the same mount, the same veil, the same
hover — so a row of one portrait and two plates reads as a set rather than
as two missing images. Each new portrait replaces a plate without disturbing
the composition.

### Adding the other two

1. Put the file in `src/portraits/<slug>.jpg`, where `<slug>` matches the
   person's `slug` in `src/data/site.ts` — so `anish-acharya.jpg` and
   `deepika-mahesh.jpg`.
2. Run `npm run portraits`.
3. Add `photo: '/portraits/<slug>'` to that person's record in `site.ts`.
   Note the path carries **no width and no file extension** — the component
   appends those.

That is the whole job. The crop, the formats, the sizes and the markup are
all handled. `npm run sweep` then asserts that every file the page asks for
actually exists, so a mistake fails the sweep instead of shipping an
invisible broken image.

### Brief for the remaining two

Match the delivered frame, because the treatment is shared and a mismatch
will show:

- **4:5 portrait**, at least 960px on the short edge. 2400px is ideal —
  the pipeline downsamples, it never upscales.
- **Dark, uncluttered environment.** Office interior rather than a plain
  studio backdrop; the depth in the background is what makes the delivered
  frame look expensive.
- **Warm practical lights in shot** if possible — a lamp, a downlight. The
  site's accent is a warm metal and the photography treatment leans warm to
  meet it.
- **Standing, mid-body crop, generous headroom.** The pipeline crops from
  the top of the frame by default, so leave room above the head and expect
  the bottom of the frame to be trimmed.
- **Composed, not grinning.** The delivered frame gets this right.

Deliver as high-quality JPEG. If a frame needs a different crop anchor,
set it in `ANCHOR` in `scripts/make-portraits.mjs` — `0` keeps the top of
the frame, `1` the bottom, `0.5` centres.

### The treatment, and how to change it

Portraits render in a warm near-monochrome that returns to full colour on
hover. This is one line in `src/components/Portrait.astro`:

```css
filter: grayscale(0.62) sepia(0.09) contrast(1.06) brightness(1.02);
```

It was chosen by rendering five candidates side by side against this
photograph. Flat `grayscale(1)` — what the site used before a portrait
existed — kills the warm lights and the green of the plant, which is most of
what the frame has going for it. Full colour lets the blue-green glass fight
the champagne accent. The value above sits between them, and it does real
work beyond taste: the three advocates will be photographed on three
different days under three different lights, and a shared treatment is what
will make them look like one set rather than three snapshots. Raise the
`grayscale` figure for a more austere page, lower it for a warmer one.

### Still worth commissioning

The old imagery could not be reused: it is generic stock, and the desk
photograph contains a framed certificate made out to *"Adam G. Zuwerink"* —
a stranger's name, on a law firm's website. The old team photograph is
133 × 130 pixels. All of it is gone from the site.

Beyond the two outstanding portraits, roughly half a day would cover:

1. **The chambers** — the entrance, the consultation room, a shelf of
   reports. Details rather than wide shots.
2. **Two or three texture shots** — a file, a pen on paper, light through a
   window. Used as section backgrounds.

---

## 7. Bar Council of India considerations

Rule 36 of the Bar Council of India Rules prohibits advocates from advertising
or soliciting work. The site is built with that in mind:

- A **disclaimer gate** appears on first visit and records the visitor's
  acknowledgement that they sought the information of their own accord. This
  is the standard practice among Indian law firms.
- A **full disclaimer page** at `/disclaimer/`, linked from the footer of
  every page.
- The **footer carries the Rule 36 notice** on every page.
- The copy avoids superlatives, success rates, and comparative claims. There
  are no invented statistics anywhere on the site — no "500+ cases won", no
  "98% success rate". This is deliberate: such claims are both unverifiable
  and precisely what Rule 36 is aimed at.

**Two points for the firm's own judgement:**

1. **Testimonials.** The five on the site are carried over verbatim from the
   existing website, so they are not new exposure. Client testimonials
   nonetheless sit in a grey area under Rule 36. Have an advocate at the firm
   decide whether to keep them. They are in `testimonials` in `site.ts` and
   deleting the array removes the section cleanly.
2. **Any future additions** — case results, awards, rankings, client
   names — should be reviewed before publishing.

This is a design and engineering handoff, not legal advice. The firm is far
better placed than its web developer to judge where the line sits.

---

## 8. What was verified, and how

Measured on the built site, not estimated.

### The checks

Run all four with `npm run preview` serving on port 4321:

| Command | What it catches |
| --- | --- |
| `npm run build` | Type errors, broken imports, bad data references. |
| `npm run portraits` | Rebuilds the portrait derivatives from `src/portraits/`. |
| `node scripts/lint-scoped.mjs` | The Astro scoped-style trap (below). Fast, no browser. |
| `node scripts/sweep.mjs` | Everything else — 16 routes × 2 viewports × 2 themes. |
| `node scripts/a11y.mjs` | axe-core, every route, both themes. |

`scripts/lint-scoped.mjs` exists because of a failure mode specific to
Astro that is **invisible in code review and silent at build time**. A
component's `<style>` block is scoped to elements written in *that*
component's template. Pass a class as a prop into a child component and the
element carrying it gets the *child's* scope id — so the parent's rule
compiles to a selector that can never match. No error, no warning, no
console message; the style simply does not apply. It shipped four separate
times on this project: every monogram watermark squashed to 17px, the theme
toggle knob frozen in place, and seven display headlines rendering at the
wrong size (which pushed the home page's main button below the fold on four
common laptop screens). The linter now fails the moment it recurs. **If you
add a component that takes a `class` prop, run it.**

`scripts/sweep.mjs` drives a real browser through the whole site and reports
duplicate `id`s, headings out of order, unlabelled controls, dead links,
horizontal overflow, over-length page titles and meta descriptions, content
whose reveal animation never fired, hard-coded colours that would break in
one theme, any element sitting under another where it should be clickable,
and any image the page asks for that is not actually on disk — a `<picture>`
whose sources 404 shows nothing at all, silently, without reaching the
console or failing the build.
It then presses things: the mobile menu, the theme toggle, the disclaimer
gate, and every button on every page in both themes.

### Current results

- **Scoped styles.** `scoped styles: clean`.
- **Full sweep.** 16 routes × 2 viewports × 2 themes: **0 issues.**
- **Accessibility.** axe-core against WCAG 2.0 A/AA, 2.1 A/AA, 2.2 AA and
  best-practice rules, every route in **both** themes: **0 violations.**
- **Contrast.** Every text-on-background pair computed from its relative
  luminance rather than eyeballed, in both themes. Lowest passing value
  4.61:1 against the 4.5:1 requirement. This is why the accent colour
  changes with the surface — champagne on ink, bronze on paper: champagne on
  the light background measured 2.06:1, a clear failure.
- **Above the fold.** The home page's primary button measured at 1440×900,
  1440×800, 1366×768, 1280×720 and 390×844 — visible without scrolling on
  every one, with no overlap against the fact band.
- **JavaScript weight.** 2.5 KB gzipped for the entire site, including all
  animation. (A typical animation library alone is 50–150 KB.)
- **CSS weight.** ~10 KB gzipped.
- **Fonts.** 172 KB total, self-hosted, latin subsets only.
- **Whole site.** 1.1 MB for all sixteen pages including fonts and icons —
  against roughly 5 MB of unoptimised photographs on the previous
  single-page site.
- **The portrait.** 130 KB on disk across eight files; a browser downloads
  one of them. 10.5 KB for the AVIF a 1x laptop takes, 23.8 KB for the 2x.
  Checked at full size that the compression holds up on the face, which is
  the only part of a portrait where it shows.
- **Structured data.** `LegalService`, `WebSite`, `Service` (×8), `FAQPage`,
  `Person` (×3, now carrying `image` where a portrait exists),
  `BreadcrumbList`. Worth re-checking after launch with
  Google's [Rich Results Test](https://search.google.com/test/rich-results).

---

## 9. After launch

1. **Google Search Console** — add the property, submit
   `https://www.anveshanaconsultants.in/sitemap-index.xml`.
2. **Google Business Profile** — make sure the name, address, phone and hours
   match `site.ts` exactly. For a local firm this matters more for search
   visibility than anything on the website itself.
3. **Test the WhatsApp buttons** from a real phone on mobile data, and once
   from a desktop browser, to confirm both the app and WhatsApp Web open with
   the message pre-filled.
4. **Re-check the domain** — both `anveshanaconsultants.in` and the `www.`
   version should resolve, one redirecting to the other.

---

## 10. Known trade-offs

Recorded honestly, so the next person is not surprised:

- **The opening curtain animation** shows once per browsing session and adds
  about 1.8 seconds on a first visit. It is an aesthetic choice; delete the
  `curtain` block in `Base.astro` if the firm would rather not have it.
- **The gavel cursor** replaces the system pointer on desktop, and hides the
  native cursor while it is running. It is off on touch, off on coarse
  pointers, and off for anyone who has asked for reduced motion — in all
  three cases the ordinary pointer is left alone. Some visitors rely on their
  operating system's cursor settings, so if the firm would rather not replace
  it at all, delete the `.cursor` block from `Base.astro` and everything else
  keeps working.
- **Enquiries arrive in WhatsApp, not an inbox.** That is the point, but it
  does mean there is no written record on the firm's own systems until
  somebody moves one there. WhatsApp Business labels are the cheapest way to
  keep that organised.
- **No CMS.** Content is edited by changing one text file and redeploying.
  This keeps hosting free and the site fast, but it does mean a non-technical
  edit needs either a developer or a few minutes learning GitHub's web editor.
  If the firm later wants to write regular articles, the right time to add a
  CMS is then.
- **No blog or insights section.** Deliberately left out rather than shipped
  empty — an abandoned blog dated two years ago is worse than none. The
  structure supports adding one when there is an appetite to write.
