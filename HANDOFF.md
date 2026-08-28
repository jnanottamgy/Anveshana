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
| 1 | **Biographies** for Anish Acharya and Akash Shetty | `people` in `site.ts` | The bios are professionally written drafts. Names and the criminal-law designation come from the existing website and its testimonials; **nothing else is confirmed**. Replace with real text. |
| 2 | **Akash Shetty's role and practice areas** | `people` | He is named as a partner on the strength of a client testimonial on the old site. Confirm his actual title and areas — or remove the entry. |
| 3 | **Consultation hours** | `firm.hours` | Currently a sensible assumption, not a fact. These also feed the Google structured data, so a wrong value misleads searchers. |
| 4 | **Courts and forums list** | `forums` | Standard for a Bengaluru litigation practice, but it is a claim about where the firm appears. Confirm or trim it. |
| 5 | **The WhatsApp number** | `whatsapp.number` | Every consultation button on the site opens a chat with this number. Confirm it is the one the firm actually monitors — see §4. |
| 6 | **A professional photoshoot** | see §6 | The only remaining design gap. |
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
The six practice areas. Each one automatically becomes:
- a row on the homepage index,
- a row on `/practice-areas/`,
- **its own page** at `/practice-areas/<slug>/`,
- an entry in the footer,
- a WhatsApp enquiry that opens already naming that area,
- and its own Google structured data, including the FAQ.

To add a seventh area, copy an existing block and change the fields. To remove
one, delete its block. Nothing else needs touching.

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
Reproduced verbatim from the existing site. See §7 before adding more.

### `commitments`, `process`, `forums`
The three promises, the four-stage method, and the courts list.

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
| `--bronze` | `#7e6230` | The same metal, for text on light surfaces |
| `--azure` | `#2a9fd6` | The logo blue, used live and sparingly |

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

## 6. Photography brief

**This is the one outstanding gap in the site.** The design works without
photographs — it leans on typography, the monogram and generated texture — but
real photography would lift it further, and every slot is already built.

The existing images could not be reused: they are generic stock, and the desk
photograph contains a framed certificate made out to *"Adam G. Zuwerink"* — a
stranger's name, on a law firm's website. The old team photograph is
133 × 130 pixels.

Worth commissioning, roughly half a day:

1. **Portraits of each advocate** — 4:5 portrait, plain or softly defocused
   background, natural light, unsmiling-but-warm rather than corporate-grin.
   These drop straight into `people[].photo`.
2. **The chambers** — the entrance, the consultation room, a shelf of
   reports. Details rather than wide shots.
3. **Two or three texture shots** — a file, a pen on paper, light through a
   window. Used as section backgrounds.

Shoot in landscape and portrait for each. Deliver as high-quality JPEG at
2400px on the long edge; Astro compresses them at build time.

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

Measured on the built site, not estimated:

- **Accessibility.** axe-core, across 9 routes at desktop and mobile widths,
  against WCAG 2.0 A/AA, 2.1 A/AA, 2.2 AA and best-practice rules:
  **0 violations.** Re-run any time with `node scripts/a11y.mjs` while
  `npm run preview` is running.
- **JavaScript weight.** 2.5 KB gzipped for the entire site, including all
  animation. (A typical animation library alone is 50–150 KB.)
- **CSS weight.** ~10 KB gzipped.
- **Fonts.** 172 KB total, self-hosted, latin subsets only.
- **Whole site.** 1.1 MB for all fourteen pages including fonts and icons —
  against roughly 5 MB of unoptimised photographs on the previous single-page
  site.
- **Structured data.** `LegalService`, `WebSite`, `Service` (×6), `FAQPage`,
  `Person`, `BreadcrumbList`. Worth re-checking after launch with Google's
  [Rich Results Test](https://search.google.com/test/rich-results).

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
- **The custom cursor** appears only on desktop with a mouse. It is off on
  touch devices and for anyone using reduced motion.
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
