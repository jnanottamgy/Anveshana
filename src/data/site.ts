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

  /* Sampled from the firm's Google Business listing URL. */
  geo: { lat: 12.9876464, lng: 77.5784796 },

  phone: '+91 99641 40121',
  phoneHref: '+919964140121',
  email: 'adv.anishacharya@gmail.com',

  /* VERIFY — confirm actual consultation hours with the firm. */
  hours: [
    { days: 'Monday — Friday', time: '9:30 am — 7:00 pm' },
    { days: 'Saturday', time: '10:00 am — 4:00 pm' },
    { days: 'Sunday', time: 'By prior appointment' },
  ],

  mapsPlace:
    'https://www.google.com/maps/place/Anveshana+Advocates+%26+Consultants/@12.9876464,77.5784796,17z',
  mapsDirections:
    'https://www.google.com/maps/dir//Anveshana+Advocates+%26+Consultants',

  url: 'https://www.anveshanaconsultants.in',
} as const;

/* ------------------------------------------------------------
   CONTACT FORM ENDPOINT
   ------------------------------------------------------------
   The site is fully static, so the enquiry form needs somewhere
   to POST. Paste a form-handler URL here (Formspree, Web3Forms,
   Basin — any of them take a JSON POST) and the form starts
   delivering to the firm's inbox. See HANDOFF.md for the
   two-minute setup.

   Left empty, the form still works: it validates, then hands the
   enquiry to the visitor's mail client pre-addressed and
   pre-filled, so no enquiry is ever silently lost.
   ------------------------------------------------------------ */
export const formEndpoint = '';

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
   The six areas below are taken from the firm's existing site.
   Each one becomes its own page at /practice-areas/<slug>/ —
   these pages are what rank for searches like "criminal lawyer
   in Bengaluru" or "cheque bounce advocate Bangalore".
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
    slug: 'family-law',
    index: '03',
    title: 'Family Law',
    shortTitle: 'Family',
    summary:
      'Matters where the law is only half the problem — handled with discretion and steadiness.',
    body: [
      'Family matters demand a different temperament from commercial ones. The other side is someone you once trusted, the facts are painful to recount, and the outcome shapes the lives of children who had no part in the dispute. Aggression is often the least effective strategy available.',
      'We advise and represent in divorce and judicial separation, restitution of conjugal rights, child custody and guardianship, adoption, maintenance, and proceedings under the Protection of Women from Domestic Violence Act and the dowry provisions. We act for wives and husbands alike, and we say so plainly.',
      'Confidentiality here is not a policy line — it is the whole basis of the relationship. Nothing you tell us leaves the room.',
    ],
    scope: [
      { name: 'Divorce & Separation', note: 'Contested and mutual consent, across personal laws.' },
      { name: 'Child Custody', note: 'Custody, guardianship and visitation arrangements.' },
      { name: 'Maintenance', note: 'Interim and permanent maintenance, and enforcement.' },
      { name: 'Domestic Violence', note: 'Protection, residence and compensation orders.' },
      { name: 'Dowry Harassment', note: 'Complaints and defence under Section 498A.' },
      { name: 'Adoption & Guardianship', note: 'Petitions and compliance under the relevant statutes.' },
    ],
    metaDescription:
      'Family law advocates in Bengaluru. Divorce, child custody, maintenance, domestic violence, dowry harassment and adoption matters, handled with discretion.',
    faqs: [
      {
        q: 'Is a mutual consent divorce faster?',
        a: 'Substantially. A mutual consent petition is ordinarily concluded in a fraction of the time a contested matter takes, and it spares both parties years of hearings. Where any prospect of agreement exists, we will explore it first — including on custody and maintenance, which are usually the real obstacles.',
      },
      {
        q: 'How is child custody decided?',
        a: 'The court’s governing consideration is the welfare of the child, not the preference or the fault of either parent. Age, schooling, stability, the child’s own wishes where old enough, and each parent’s circumstances all weigh. We prepare custody matters with that single test in mind.',
      },
      {
        q: 'Do you act for men in domestic violence and 498A matters?',
        a: 'Yes. We appear both for complainants seeking protection and for those defending allegations, and we approach each with the same rigour. We will tell you at the outset what the evidence realistically supports.',
      },
    ],
  },

  {
    slug: 'employment-labour',
    index: '04',
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
    slug: 'business-mercantile',
    index: '05',
    title: 'Business & Mercantile',
    shortTitle: 'Business',
    summary:
      'Commercial agreements drafted to hold, and commercial disputes resolved without theatre.',
    body: [
      'Commercial clients want two things from a law firm: agreements that survive contact with a dispute, and a dispute strategy that accounts for cost and time as seriously as it accounts for the merits. Both are matters of judgement rather than volume.',
      'We draft and negotiate commercial contracts, licensing and distribution arrangements, shareholder and founder documentation, and advise on mergers and acquisitions. On the contentious side, we act in arbitration and mediation, and in commercial litigation where a negotiated resolution is not available.',
      'We are candid about proportion. Where the cost of pursuing a claim will exceed what it recovers, we will say so at the first meeting rather than the fifth.',
    ],
    scope: [
      { name: 'Commercial Contracts', note: 'Drafting, review and negotiation across sectors.' },
      { name: 'Arbitration', note: 'Domestic arbitration, from notice through to enforcement.' },
      { name: 'Mediation & Settlement', note: 'Structured negotiation and settlement documentation.' },
      { name: 'Licensing', note: 'Technology, brand and distribution arrangements.' },
      { name: 'Mergers & Acquisitions', note: 'Due diligence, transaction documents and closing.' },
      { name: 'Shareholder Matters', note: 'Founder agreements, disputes and exit arrangements.' },
    ],
    metaDescription:
      'Business and commercial law advocates in Bengaluru. Commercial contracts, arbitration and mediation, licensing, mergers and acquisitions, shareholder disputes.',
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
        q: 'Do you advise startups and founders?',
        a: 'We do — on founder and shareholder agreements, employment and contractor documentation, commercial contracts, and the disputes that arise when an early arrangement was never properly recorded.',
      },
    ],
  },

  {
    slug: 'cyber-law',
    index: '06',
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
   corrected by the firm before launch. Add a `photo` path once
   portraits are shot; the layout renders a typographic monogram
   plate until then.
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
    focus: ['Criminal Law', 'Civil & Property', 'Family Law'],
    bio: [
      'Anish Acharya founded Anveshana to practise law the way he believed it ought to be practised: with prompt communication, candid advice, and complete discretion about a client’s affairs.',
      'His practice is litigation-led, with a particular concentration in criminal defence — bail and anticipatory bail, quashing, cheque dishonour and trial work — alongside civil and family matters. Clients describe his central strength as the ability to reduce a complicated set of facts to the two or three questions a court will actually decide.',
      'He appears regularly before the courts and tribunals of Bengaluru.',
    ],
    email: 'adv.anishacharya@gmail.com',
    verify: true,
  },
  {
    slug: 'akash-shetty',
    name: 'Akash Shetty',
    honorific: 'Advocate',
    role: 'Partner',
    focus: ['Business & Mercantile', 'Employment & Labour', 'Cyber Law'],
    bio: [
      'Akash Shetty advises the firm’s commercial clients on contracts, arbitration and employment matters, and acts in cyber and technology disputes.',
      'His approach is preventive where it can be: a substantial part of his work involves reviewing agreements and internal processes before they are tested, on the view that the cheapest dispute is the one that never arises. Where matters do become contentious, he acts in arbitration, mediation and commercial litigation.',
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
  {
    quote:
      'Mr. Akash Shetty and his partner were very efficient, knowledgeable, experienced, quick and highly dedicated professionals. I highly recommend them for anyone looking for legal representations.',
    name: 'Pratheeka S L',
    location: 'Bengaluru',
  },
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
  'Family Court, Bengaluru',
  'Labour & Industrial Tribunals',
  'Consumer Disputes Redressal Commissions',
  'Motor Accident Claims Tribunal',
  'Arbitral Tribunals',
] as const;
