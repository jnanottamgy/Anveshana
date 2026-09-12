/* ============================================================
   ANVESHANA — SITE CONTENT
   ------------------------------------------------------------
   Every word of editable copy on the website lives in this one
   file. Change it here and it updates everywhere it appears.
   You never need to touch a layout or a stylesheet to change
   content.

   ⚠ FIELDS MARKED "VERIFY" ARE DRAFT COPY.
   They are written to be structurally correct and professional,
   but they contain claims (years in practice, courts appeared
   before, biographies) that only the firm can confirm. Read
   HANDOFF.md and replace every VERIFY item before going live.
   ============================================================ */

export const firm = {
  name: 'Anveshana',
  legalName: 'Anveshana Advocates & Consultants',
  shortName: 'Anveshana',
  descriptor: 'Advocates & Consultants',
  tagline: 'Counsel of consequence.',

  /* Used for <title> suffix and structured data. */
  city: 'Bengaluru',
  state: 'Karnataka',
  country: 'India',

  address: {
    line1: '6/7/12, Kumarapark East, Crescent Road',
    line2: 'Behind Sindhi School, High Grounds, Seshadripuram',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'IN',
  },

  /* The PIN on the firm's Google Business listing.

     NB for whoever updates this: in a Google Maps URL these are
     the `!3d<lat>!4d<lng>` pair, NOT the `@<lat>,<lng>,17z` pair
     near the front. The `@` pair is only where Google happened
     to centre the map viewport, which it routinely offsets to
     leave room for the side panel. An earlier version of this
     file took the `@` pair, and it sat 279 m due east of the
     chambers — carrying the embedded map, the directions link
     and the Google structured data with it. */
  geo: { lat: 12.9876412, lng: 77.5810545 },

  phone: '+91 99641 40121',
  phoneHref: '+919964140121',
  email: 'contact@anveshanaconsultants.in',

  /* VERIFY — confirm actual consultation hours with the firm. */
  hours: [
    { days: 'Monday — Friday', time: '9:30 am — 7:00 pm' },
    { days: 'Saturday', time: '10:00 am — 4:00 pm' },
    { days: 'Sunday', time: 'By prior appointment' },
  ],

  /* The canonical listing. The `data=` payload is what identifies
     the business — the previous value stopped at the zoom level,
     which left Google a plain name search to resolve however it
     liked. Session parameters (`entry`, `g_ep`) are stripped:
     they are tracking, and they go stale. */
  mapsPlace:
    'https://www.google.com/maps/place/Anveshana+Advocates+%26+Consultants/' +
    '@12.9876464,77.5784796,17z/data=!3m1!4b1!4m6!3m5' +
    '!1s0x3bae171a077652e9:0x90b6425a31def462' +
    '!8m2!3d12.9876412!4d77.5810545!16s%2Fg%2F11g0sy73cl',

  /* Google's documented directions format, aimed at the exact
     coordinates rather than at the firm's name. A name can
     resolve to the wrong business; a coordinate cannot. */
  mapsDirections:
    'https://www.google.com/maps/dir/?api=1&destination=12.9876412,77.5810545',

  url: 'https://www.anveshanaconsultants.in',
} as const;

/* ------------------------------------------------------------
   WHATSAPP — the firm's enquiry channel
   ------------------------------------------------------------
   Every "request a consultation" action on the site opens a
   WhatsApp conversation with the chambers rather than a contact
   form. On a phone that opens the WhatsApp app; on a desktop it
   opens WhatsApp Web (or the desktop app, if installed).

   `number` must be digits only, with the country code and no
   plus sign or spaces — that is the format wa.me requires.
   ------------------------------------------------------------ */
export const whatsapp = {
  number: '919964140121',

  /* The message the visitor sees already typed into the chat.
     They can edit or delete it before sending — it exists to
     save them writing the opening line, not to speak for them. */
  defaultMessage:
    'Hello, I would like to request a consultation with Anveshana Advocates & Consultants.',
} as const;

/**
 * Builds a wa.me link, optionally with the message pre-filled.
 * Pass a practice area (or any context) to open the chat with a
 * more specific opening line.
 */
export function whatsappUrl(message: string = whatsapp.defaultMessage): string {
  return `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(message)}`;
}

/** Opening line for an enquiry about a named practice area. */
export function whatsappForArea(area: string): string {
  return whatsappUrl(
    `Hello, I would like to request a consultation with Anveshana Advocates & Consultants regarding a ${area} matter.`
  );
}

/* ------------------------------------------------------------
   NAVIGATION
   ------------------------------------------------------------ */
export const nav = [
  { label: 'The Firm', href: '/about/' },
  { label: 'Practice', href: '/practice-areas/' },
  { label: 'People', href: '/people/' },
  { label: 'Contact', href: '/contact/' },
] as const;

/* ------------------------------------------------------------
   PRACTICE AREAS
   ------------------------------------------------------------
   Each of the eight areas below becomes its own page at
   /practice-areas/<slug>/ — these pages are what rank for
   searches like "criminal lawyer in Bengaluru", "trade mark
   attorney Bangalore" or "cheque bounce advocate".
   ------------------------------------------------------------ */

export type PracticeArea = {
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  /* One line. Appears in the homepage index and page hero. */
  summary: string;
  /* 2–3 paragraphs of positioning copy for the detail page. */
  body: string[];
  /* The concrete matters handled — drawn from the firm's own list. */
  scope: { name: string; note: string }[];
  /* Search-intent phrases, used for meta description and FAQ. */
  metaDescription: string;
  faqs: { q: string; a: string }[];
};

export const practiceAreas: PracticeArea[] = [
  {
    slug: 'criminal-law',
    index: '01',
    title: 'Criminal Law',
    shortTitle: 'Criminal',
    summary:
      'Representation at every stage — from the first knock on the door to the final appeal.',
    body: [
      'A criminal case is rarely only a legal problem. It arrives with a summons at an inconvenient hour, and it puts a reputation, a livelihood and a family under strain long before a court hears a word of it. Our first job is to take the panic out of the room.',
      'We act at every stage of the criminal process: pre-arrest advice and anticipatory bail, representation during investigation and interrogation, quashing of proceedings, trial before the Sessions and Magistrate courts, and appeals. We are equally at home defending an individual and advising a company whose officers have been named in a complaint.',
      'What does not change is the standard: prompt communication, candid advice about what the law can and cannot do, and absolute confidentiality about everything you tell us.',
    ],
    scope: [
      { name: 'Bail & Anticipatory Bail', note: 'Applications, opposition and appeals at every court tier.' },
      { name: 'FIR & Police Matters', note: 'Registration, quashing, and representation during investigation.' },
      { name: 'Corporate Criminal Defence', note: 'For companies and their directors, officers and employees.' },
      { name: 'Cheque Dishonour', note: 'Prosecution and defence under Section 138, Negotiable Instruments Act.' },
      { name: 'Motor Accident Claims', note: 'Compensation claims and defence before the Claims Tribunal.' },
      { name: 'Trial & Appeals', note: 'Sessions, Magistrate and appellate representation.' },
    ],
    metaDescription:
      'Criminal defence advocates in Bengaluru. Bail and anticipatory bail, FIR quashing, cheque bounce cases, corporate criminal defence, trial and appeals.',
    faqs: [
      {
        q: 'What should I do if I expect to be arrested?',
        a: 'Speak to a lawyer before anything else, and do so quickly — an application for anticipatory bail is far stronger when it is filed before a complaint hardens. Do not give a statement, sign anything, or contact the complainant without advice. Call us and we will tell you candidly whether an application is warranted.',
      },
      {
        q: 'How quickly can a bail application be moved?',
        a: 'Where the circumstances demand it, an application can be drafted and moved within a day. The realistic timeline depends on the offence alleged, the court before which the application lies, and its listing. We will give you an honest assessment at the first consultation rather than an optimistic one.',
      },
      {
        q: 'Do you defend companies as well as individuals?',
        a: 'Yes. We regularly advise companies whose directors, officers or employees have been named in a criminal complaint, including matters arising out of commercial disputes, regulatory action and workplace incidents.',
      },
    ],
  },
  {
    slug: 'civil-property',
    index: '02',
    title: 'Civil & Property',
    shortTitle: 'Civil & Property',
    summary:
      'Title, possession and contract — the disputes that decide what you own and what you are owed.',
    body: [
      'Property in Bengaluru carries a particular kind of complexity. Titles pass through generations, records disagree with each other, joint families divide unevenly, and developers and owners read the same agreement in two different ways. A civil dispute is won long before trial, in the quality of the documents and the discipline of the pleadings.',
      'We handle the full range of civil litigation: suits for partition and declaration, recovery of money, specific performance and breach of contract, and landlord–tenant disputes. We also advise before a dispute exists — on title, on the drafting of an agreement, and on whether a claim is worth bringing at all.',
      'We will tell you when litigation is the wrong instrument. A negotiated settlement that closes in three months is frequently worth more than a decree five years away.',
    ],
    scope: [
      { name: 'Partition Suits', note: 'Division of joint family and co-owned property.' },
      { name: 'Declaration & Title', note: 'Suits establishing ownership and clearing defective title.' },
      { name: 'Breach of Contract', note: 'Claims for damages and specific performance.' },
      { name: 'Money Recovery', note: 'Recovery suits, summary suits and execution proceedings.' },
      { name: 'Landlord & Tenant', note: 'Eviction, rent control, lease disputes and possession.' },
      { name: 'Title Due Diligence', note: 'Pre-purchase verification and opinion on marketability.' },
    ],
    metaDescription:
      'Civil and property litigation advocates in Bengaluru. Partition suits, declaration of title, money recovery, breach of contract, landlord and tenant disputes.',
    faqs: [
      {
        q: 'How long does a partition suit take in Bengaluru?',
        a: 'Contested partition suits are measured in years rather than months, which is precisely why we examine settlement seriously at the outset. Where the parties are willing, a mediated division of property can be concluded far faster and at a fraction of the cost. We will set out both paths honestly before you commit to either.',
      },
      {
        q: 'Should I have a property title checked before I buy?',
        a: 'Always. A title due-diligence exercise before purchase costs a small fraction of what it costs to litigate a defective title afterwards. We examine the chain of title, encumbrances, approvals and the seller’s capacity to convey, and give you a written opinion you can act on.',
      },
      {
        q: 'My tenant has stopped paying rent. What are my options?',
        a: 'Your remedy depends on the terms of the lease, the length of occupation and whether rent control legislation applies. In many cases a properly drafted notice resolves the matter without litigation. Where it does not, we move for eviction and arrears together.',
      },
    ],
  },
  {
    slug: 'company-law',
    index: '03',
    title: 'Company Law',
    shortTitle: 'Company',
    summary:
      'Incorporation, compliance, and the disputes that arise inside a company rather than outside it.',
    body: [
      'Most company law problems are not dramatic. They are a register that was never updated, a board resolution passed without the notice the articles required, a shareholder who has been quietly excluded from decisions for two years, or a filing that lapsed and has since attracted a penalty larger than the fee that would have prevented it.',
      'We advise on incorporation and structuring, ongoing compliance under the Companies Act, board and shareholder governance, and the drafting of articles and shareholder arrangements that hold when relationships fail. On the contentious side we appear in proceedings before the National Company Law Tribunal, including oppression and mismanagement petitions and disputes between shareholders and directors.',
      'We also advise directors personally. Directors carry duties and exposure that are frequently discovered only when something has already gone wrong, and an hour spent on that question early is worth a great deal later.',
    ],
    scope: [
      { name: 'Incorporation & Structuring', note: 'Company formation, LLPs, and choosing the right vehicle.' },
      { name: 'Corporate Compliance', note: 'Companies Act filings, registers, resolutions and annual obligations.' },
      { name: 'Shareholder Arrangements', note: 'Articles, shareholder agreements, transfers and exits.' },
      { name: 'NCLT Proceedings', note: 'Representation before the National Company Law Tribunal.' },
      { name: 'Oppression & Mismanagement', note: 'Petitions for minority shareholders and defence of them.' },
      { name: "Directors' Duties", note: 'Advice on duties, disqualification and personal exposure.' },
    ],
    metaDescription:
      'Company law advocates in Bengaluru. Incorporation and structuring, Companies Act compliance, shareholder agreements, NCLT proceedings, oppression and mismanagement.',
    faqs: [
      {
        q: 'We are two founders starting out. What should we put in place first?',
        a: 'A shareholders’ agreement, before there is anything to argue about. It should deal with what happens if one of you leaves, how shares vest, who decides what, and how a deadlock is broken. Founders who record this in month one almost never litigate; founders who postpone it frequently do.',
      },
      {
        q: 'A shareholder is being excluded from the running of the company. Is there a remedy?',
        a: 'Yes. Conduct that is oppressive to a shareholder, or prejudicial to the company’s interests, can be challenged before the National Company Law Tribunal, and the Tribunal has wide powers to set matters right. The strength of such a petition depends heavily on the contemporaneous record, so preserve the notices, minutes and correspondence.',
      },
      {
        q: 'We have missed statutory filings. How serious is that?',
        a: 'Serious but usually retrievable. Late filings attract additional fees and, if left long enough, can expose directors to disqualification. The position is almost always better if you regularise it voluntarily than if the Registrar raises it first — so bring it to us rather than waiting.',
      },
    ],
  },
  {
    slug: 'corporate-advisory',
    index: '04',
    title: 'Corporate Advisory',
    shortTitle: 'Corporate',
    summary:
      'Commercial agreements drafted to hold, and transactions closed without late surprises.',
    body: [
      'Commercial clients want two things from a law firm: agreements that survive contact with a dispute, and a transaction strategy that accounts for cost and time as seriously as it accounts for the merits. Both are matters of judgement rather than volume.',
      'We draft and negotiate commercial contracts, licensing and distribution arrangements, and technology, media and telecommunications agreements; we advise on mergers, acquisitions and joint ventures, and run the due diligence behind them. Where a matter turns contentious we act in arbitration and mediation, and in commercial litigation when a negotiated resolution is not available.',
      'We are candid about proportion. Where the cost of pursuing a claim will exceed what it recovers, we will say so at the first meeting rather than the fifth.',
    ],
    scope: [
      { name: 'Commercial Contracts', note: 'Drafting, review and negotiation across sectors.' },
      { name: 'Mergers & Acquisitions', note: 'Due diligence, transaction documents and closing.' },
      { name: 'Technology, Media & Telecom', note: 'SaaS, platform, content and telecom arrangements.' },
      { name: 'Licensing & Distribution', note: 'Technology, brand and channel arrangements.' },
      { name: 'Arbitration', note: 'Domestic arbitration, from notice through to enforcement.' },
      { name: 'Joint Ventures', note: 'Structuring, documentation and exit mechanics.' },
    ],
    metaDescription:
      'Corporate advisory lawyers in Bengaluru. Commercial contracts, mergers and acquisitions, technology and media agreements, licensing and arbitration.',
    faqs: [
      {
        q: 'Is arbitration actually faster than going to court?',
        a: 'It can be, and it is usually more private and more predictable in its scheduling. But it is not automatically cheaper — arbitrator fees and venue costs are real. Whether it suits you depends on the clause you already signed and on the sum in dispute. We will assess both before recommending a route.',
      },
      {
        q: 'Can you review a contract before we sign it?',
        a: 'Yes, and it is by a wide margin the most cost-effective legal work you will ever commission. A morning spent on a draft agreement routinely prevents a dispute that would take two years to resolve.',
      },
      {
        q: 'Do you advise technology and media businesses?',
        a: 'We do. Platform and SaaS terms, content and licensing arrangements, data and privacy obligations, and telecom-sector agreements are a regular part of the practice — as are the commercial disputes that arise out of them.',
      },
    ],
  },
  {
    slug: 'intellectual-property',
    index: '05',
    title: 'Intellectual Property',
    shortTitle: 'IP',
    summary:
      'Trade marks, copyright, and the brand a business is usually protecting a year too late.',
    body: [
      'Most businesses arrive at intellectual property at the wrong moment — after someone else has registered the name they have been trading under for three years, or after a former contractor has walked off with artwork they thought they had bought. Protection is inexpensive in advance and expensive in arrears.',
      'We advise on trade mark clearance, filing and prosecution before the Trade Marks Registry, on copyright protection and assignment, and on the licensing of brand and creative assets. We also act in opposition, rectification and infringement proceedings, and in passing-off actions.',
      'A large part of this work is unglamorous and decisive: establishing that the business actually owns what it believes it owns. Contractor agreements that never assigned copyright, and marks registered in a founder’s personal name, are the two gaps we find most often.',
    ],
    scope: [
      { name: 'Trade Mark Registration', note: 'Clearance searches, filing and prosecution before the Registry.' },
      { name: 'Opposition & Rectification', note: 'Contesting and defending marks already on the register.' },
      { name: 'Copyright', note: 'Protection, assignment and enforcement of creative works.' },
      { name: 'Infringement & Passing Off', note: 'Civil action, injunctions and damages.' },
      { name: 'Licensing & Assignment', note: 'Brand, content and technology licensing.' },
      { name: 'IP Due Diligence', note: 'Confirming ownership ahead of a transaction or a raise.' },
    ],
    metaDescription:
      'Intellectual property lawyers in Bengaluru. Trade mark registration and opposition, copyright, infringement and passing off, licensing and IP due diligence.',
    faqs: [
      {
        q: 'We have traded under our brand name for years. Do we still need to register it?',
        a: 'Yes. Unregistered use gives you rights in passing off, but they are slower and costlier to enforce than a registration, and they will not stop someone else registering the same mark and putting you on the back foot. Registration is the cheapest insurance available in this area of law.',
      },
      {
        q: 'A contractor designed our logo. Who owns it?',
        a: 'Very often the contractor, not you. Copyright in a commissioned work does not pass simply because you paid for it — it needs a written assignment. This is the most common ownership gap we see, and it usually surfaces during due diligence, at the worst possible moment.',
      },
      {
        q: 'Someone is using a name close to ours. What can we do?',
        a: 'Depending on whether either mark is registered, the options run from a cease-and-desist notice, through opposition or rectification before the Registry, to an infringement or passing-off suit with an application for injunction. Act promptly: delay weakens both the claim and any interim relief.',
      },
    ],
  },
  {
    slug: 'taxation',
    index: '06',
    title: 'Taxation',
    shortTitle: 'Tax',
    summary:
      'Direct and indirect tax, advised while it is still a choice rather than a demand.',
    body: [
      'Tax problems are rarely created in an assessment. They are created in a transaction structured without anyone asking the question, an invoice raised under the wrong head, or a classification adopted years ago and never revisited. By the time a notice arrives, most of the useful choices have already been made.',
      'We advise on the direct and indirect tax consequences of transactions and business structures, on GST classification, registration and input credit questions, and on the tax terms buried in commercial agreements. On the contentious side we respond to notices and act in assessment and appellate proceedings before the appropriate authorities and tribunals.',
      'We are candid about proportion here as elsewhere: where a disputed amount will cost more to contest than to pay, we will tell you so.',
    ],
    scope: [
      { name: 'Transaction Structuring', note: 'Tax consequences considered before the documents are signed.' },
      { name: 'GST Advisory', note: 'Classification, registration, input credit and compliance.' },
      { name: 'Notices & Assessments', note: 'Replies, representation and assessment proceedings.' },
      { name: 'Appeals', note: 'Appellate proceedings before the appropriate tribunals.' },
      { name: 'Contract Tax Terms', note: 'Withholding, indirect tax and indemnity clauses.' },
      { name: 'Tax Due Diligence', note: 'Exposure review ahead of a transaction.' },
    ],
    metaDescription:
      'Taxation lawyers in Bengaluru. GST advisory and classification, transaction structuring, replies to tax notices, assessments and appeals before the tribunals.',
    faqs: [
      {
        q: 'We have received a notice. How urgently should we respond?',
        a: 'Immediately, and never by ignoring it. Most notices carry a limited window, and a reply filed late — or filed badly — narrows what can be argued afterwards. Bring us the notice and the underlying papers together: the answer usually turns on the second more than the first.',
      },
      {
        q: 'Is this a question for our chartered accountant or for a lawyer?',
        a: 'Frequently both, and they are not substitutes for one another. Returns, accounts and routine compliance sit with your accountant. Structuring a transaction, reading the tax clauses of a contract, and contesting a demand are legal questions. We work alongside a client’s accountant rather than around them.',
      },
      {
        q: 'Can tax be dealt with after the deal is signed?',
        a: 'It can be dealt with; it usually cannot be fixed. The structure of a transaction largely determines its tax treatment, and once the documents are executed the options narrow sharply. An hour before signing is worth considerably more than a month afterwards.',
      },
    ],
  },
  {
    slug: 'employment-labour',
    index: '07',
    title: 'Employment & Labour',
    shortTitle: 'Employment',
    summary:
      'For employees who have been wronged, and employers who would rather not be.',
    body: [
      'Bengaluru’s employment disputes have their own character: senior professionals exited without process, salaries and equity withheld at termination, maternity benefits quietly denied, and workplace harassment complaints handled badly enough to create a second dispute on top of the first.',
      'We act on both sides. For individuals, we pursue illegal termination, unpaid salary and dues, denial of statutory benefits, and harassment complaints. For employers, we advise on lawful exit process, employment documentation, internal committee procedure under the POSH Act, and defence of claims.',
      'Most employment disputes are decided by paperwork that already exists. The appointment letter, the exit correspondence and the internal record usually determine the outcome — which is why we ask for them first.',
    ],
    scope: [
      { name: 'Illegal Termination', note: 'Challenge to wrongful dismissal and forced resignation.' },
      { name: 'Salary & Dues', note: 'Recovery of unpaid wages, severance and withheld benefits.' },
      { name: 'Maternity Benefits', note: 'Enforcement of entitlements under the Maternity Benefit Act.' },
      { name: 'Workplace Harassment', note: 'POSH complaints, committee procedure and appeals.' },
      { name: 'Employment Documentation', note: 'Contracts, policies, non-competes and exit papers.' },
      { name: 'Employer Advisory', note: 'Lawful process design and defence of employee claims.' },
    ],
    metaDescription:
      'Employment and labour law advocates in Bengaluru. Illegal termination, unpaid salary and dues, maternity benefits, POSH and workplace harassment matters.',
    faqs: [
      {
        q: 'I was asked to resign. Is that a termination?',
        a: 'Very often, yes. A resignation obtained under pressure can be challenged as a termination in substance, but the strength of that challenge depends heavily on the contemporaneous record — what was said, in writing, and when. Preserve every message and email and speak to us before you sign anything.',
      },
      {
        q: 'My employer is withholding my final settlement. What can I do?',
        a: 'Withholding earned salary and dues is generally not lawful, whatever the reason offered. A properly framed legal notice resolves a significant proportion of these matters without proceedings. Where it does not, recovery can be pursued before the appropriate authority.',
      },
      {
        q: 'We are an employer facing a POSH complaint. What should we do first?',
        a: 'Follow the statutory process precisely and document it. The most common and most expensive employer error is procedural — a defective committee, a missed timeline, or an inquiry that does not meet the requirements of natural justice. We advise on the process while the inquiry is live, not after it has gone wrong.',
      },
    ],
  },
  {
    slug: 'cyber-law',
    index: '08',
    title: 'Cyber Law',
    shortTitle: 'Cyber',
    summary:
      'Fraud, impersonation and harassment online — where speed of response decides the outcome.',
    body: [
      'Cyber matters are unlike other disputes in one decisive respect: evidence disappears. Accounts are deleted, transactions clear, and platforms overwrite logs. What is recoverable in the first forty-eight hours is frequently unrecoverable in the second week.',
      'We act in online financial fraud and unauthorised bank transactions, identity theft and impersonation, phishing and mail fraud, online harassment, defamation and threats, and the takedown of unlawful content. We also draft and advise on information technology agreements and data handling arrangements.',
      'If something has just happened, do not wait to be sure of the details. Preserve the screenshots, do not delete the correspondence, and call us.',
    ],
    scope: [
      { name: 'Online Financial Fraud', note: 'Unauthorised transactions, bank and mail fraud.' },
      { name: 'Identity Theft', note: 'Impersonation, account takeover and misuse of identity.' },
      { name: 'Phishing & Scams', note: 'Complaints, recovery action and reporting.' },
      { name: 'Online Harassment', note: 'Threats, stalking, defamation and content takedown.' },
      { name: 'IT Agreements', note: 'Technology contracts, SaaS terms and data arrangements.' },
      { name: 'Data & Privacy Advisory', note: 'Compliance advice on data handling obligations.' },
    ],
    metaDescription:
      'Cyber law advocates in Bengaluru. Online financial fraud, identity theft, phishing, online harassment and defamation, content takedown and IT agreements.',
    faqs: [
      {
        q: 'Money has just left my account. What do I do first?',
        a: 'Report it to your bank immediately and in writing, and report it on the national cybercrime portal the same day. Timely reporting materially affects both the prospect of recovery and your position with the bank. Then call us — preserve every message, screenshot and transaction reference in the meantime, and delete nothing.',
      },
      {
        q: 'Can content about me be taken down?',
        a: 'In many cases yes, through a combination of platform process and legal notice, and where necessary through a court order. The realistic answer depends on what the content is, where it is hosted, and how it is being distributed. We will tell you which levers actually apply to your situation.',
      },
      {
        q: 'Someone is impersonating me online. Is that a criminal offence?',
        a: 'Impersonation and identity misuse are addressed under the Information Technology Act and the criminal law, and a complaint can be pursued alongside civil action and takedown requests. Acting quickly matters, because platform records are not retained indefinitely.',
      },
    ],
  },
];

/* ------------------------------------------------------------
   PEOPLE
   ------------------------------------------------------------
   ⚠ VERIFY — the biographies below are professionally written
   drafts. Names and the criminal-law designation come from the
   firm's existing website and testimonials. Everything else
   (education, enrolment, years, focus) MUST be confirmed and
   corrected by the firm before launch.

   PORTRAITS — to add one: put the file in src/portraits/<slug>.jpg,
   run `npm run portraits`, then set photo: '/portraits/<slug>'
   below. Note the path carries NO width and NO file extension;
   the component appends those. Until a portrait exists the
   layout renders a typographic plate of the same proportion, so
   a part-photographed team still reads as a set.
   ------------------------------------------------------------ */

export type Person = {
  slug: string;
  name: string;
  honorific: string;
  role: string;
  focus: string[];
  bio: string[];
  email?: string;
  photo?: string;
  verify: true;
};

export const people: Person[] = [
  {
    slug: 'anish-acharya',
    name: 'Anish Acharya',
    honorific: 'Advocate',
    role: 'Founder & Principal Advocate',
    focus: ['Criminal Law', 'Civil & Property'],
    photo: '/portraits/anish-acharya',
    bio: [
      'Anish Acharya founded Anveshana to practise law the way he believed it ought to be practised: with prompt communication, candid advice, and complete discretion about a client’s affairs.',
      'His practice is litigation-led, with a particular concentration in criminal defence — bail and anticipatory bail, quashing, cheque dishonour and trial work — alongside civil and property disputes. Clients describe his central strength as the ability to reduce a complicated set of facts to the two or three questions a court will actually decide.',
      'He appears regularly before the courts and tribunals of Bengaluru.',
    ],
    verify: true,
  },
  {
    slug: 'nirankush-kenjige',
    name: 'Nirankush Kenjige',
    honorific: 'Advocate',
    role: 'Partner',
    focus: ['Business Law', 'TMT Law', 'Corporate Agreements'],
    /* Base path only — the component appends the width and the
       format. See scripts/make-portraits.mjs to add the other
       two portraits. */
    photo: '/portraits/nirankush-kenjige',
    bio: [
      'Nirankush Kenjige leads the firm’s business and technology practice, advising companies on the agreements that govern how they trade, license and grow.',
      'His work spans commercial and corporate agreements, joint ventures and transactions, and technology, media and telecommunications arrangements — platform and SaaS terms, content and licensing, and the data obligations that now sit underneath most of them. He is regularly asked to review documentation a business has been operating on for years without examining.',
      'His approach is preventive where it can be, on the view that the cheapest dispute is the one that never arises. Where a matter does turn contentious, he acts in arbitration and commercial proceedings.',
    ],
    verify: true,
  },
  {
    slug: 'deepika-mahesh',
    name: 'Deepika Mahesh',
    honorific: 'Advocate',
    role: 'Partner',
    focus: ['Intellectual Property', 'Company Law', 'Taxation'],
    bio: [
      'Deepika Mahesh advises on intellectual property, company law and taxation — the three areas where a business is most often let down by paperwork it did not know it needed.',
      'Her intellectual property practice covers trade mark and copyright protection, registration and enforcement, and the licensing of brand and creative assets. On the corporate side she advises on incorporation and structuring, Companies Act compliance, shareholder arrangements and proceedings before the National Company Law Tribunal.',
      'She also advises on direct and indirect tax questions as they arise out of transactions and disputes, which in practice is where most tax problems are made or avoided.',
    ],
    verify: true,
  },
];

/* ------------------------------------------------------------
   TESTIMONIALS
   Reproduced verbatim from the firm's existing website.
   ------------------------------------------------------------ */

export const testimonials = [
  {
    quote:
      'I have had the opportunity to be served by Advocate Shri Anish Acharya. With his sheer ability to comprehend complex cases and situations, he could help resolve the issue in my favour. Good service all around!',
    name: 'Gautham Rao',
    location: 'Sydney',
  },
  /* NOTE: a fifth testimonial from the previous website named an
     advocate who has since left the firm. It has been removed
     rather than reworded — a testimonial that credits someone no
     longer at the firm misleads the reader about who they would
     actually be instructing. */
  {
    quote:
      'I have been seeking legal advice from Advocate Anish Acharya for a few years now. His recommendations on the best course of action for any situation has been impeccable.',
    name: 'Shrikara Kaudambady',
    location: 'Mysuru',
  },
  {
    quote:
      'I feel they have a solution-oriented approach rather than complicating the issues. The grasp of the problem and the solutions arrived at in a very short span of time really inspired me.',
    name: 'Dyuthi Divakar',
    location: 'Bengaluru',
  },
  {
    quote:
      'One of the best legal services companies in the city — a customer-centric approach throughout.',
    name: 'Reghunath SRK',
    location: 'Bengaluru',
  },
] as const;

/* ------------------------------------------------------------
   THE FIRM'S COMMITMENTS
   Taken from the three promises on the existing website.
   ------------------------------------------------------------ */

export const commitments = [
  {
    index: '01',
    title: 'Prompt communication',
    body:
      'You will know where your matter stands. Calls are returned, filings are explained in language you can act on, and you never learn about a development in your own case from someone else.',
  },
  {
    index: '02',
    title: 'We commit, then we stick to it',
    body:
      'We give an honest assessment at the outset — including when the answer is that you should not litigate — and we do not revise the plan or the fee once the work is under way.',
  },
  {
    index: '03',
    title: 'Absolute confidentiality',
    body:
      'What you tell us stays with us. Discretion is not a courtesy extended to sensitive matters; it is the standing condition of every engagement we accept.',
  },
] as const;

/* ------------------------------------------------------------
   HOW WE WORK — the scroll-pinned process section
   ------------------------------------------------------------ */

export const process = [
  {
    index: '01',
    title: 'The first conversation',
    body:
      'You tell us what has happened. We listen without a meter running, and we tell you plainly whether you have a matter worth pursuing, what it will realistically take, and what it will cost.',
  },
  {
    index: '02',
    title: 'Strategy before paperwork',
    body:
      'Before a single document is drafted we agree the objective — a decree, a settlement, a quashed proceeding, a clean exit — and we work backwards from it. The route is chosen for the outcome, not out of habit.',
  },
  {
    index: '03',
    title: 'Preparation that decides matters',
    body:
      'Most cases are won in the file rather than the courtroom. Documents are assembled, evidence is secured early, and pleadings are drafted to be read by the judge who will decide the matter.',
  },
  {
    index: '04',
    title: 'Representation and resolution',
    body:
      'We appear, we negotiate, and we keep you informed at every stage. Where a settlement serves you better than a judgment, we will say so — and we will not pretend otherwise to extend a brief.',
  },
] as const;

/* ------------------------------------------------------------
   COURTS & FORUMS
   ⚠ VERIFY — standard for a Bengaluru litigation practice, but
   confirm the list with the firm before launch.
   ------------------------------------------------------------ */

export const forums = [
  'High Court of Karnataka',
  'City Civil & Sessions Court, Bengaluru',
  'Courts of the Magistrates, Bengaluru',
  'National Company Law Tribunal, Bengaluru',
  'Labour & Industrial Tribunals',
  'Consumer Disputes Redressal Commissions',
  'Motor Accident Claims Tribunal',
  'Arbitral Tribunals',
] as const;
