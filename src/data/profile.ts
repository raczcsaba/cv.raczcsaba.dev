// Single source of truth for the site, the PDF CV, llms.txt and the AI bot's knowledge.
// Facts come from the private `career` repo (REFERENCES.md). Client names are only shown
// where they are already public (store listings, procats.hu client strip) or cleared.

export const SITE = 'https://cv.raczcsaba.dev';

export const person = {
  name: 'Csaba Rácz',
  nativeName: 'Rácz Csaba',
  title: 'Full-stack & AI Engineer',
  headline: 'I build products that talk, ship and scale.',
  short:
    'Full-stack and AI engineer from Budapest. I design and ship web, mobile and voice-AI products end to end: from the database and the edge to the pixels and the App Store release.',
  location: 'Budapest, Hungary',
  email: 'me@raczcsaba.dev',
  github: 'https://github.com/raczcsaba',
  pdf: '/csaba-racz-cv.pdf',
  since: 2022,
  employer: 'ProCat Solutions Kft.',
  available: 'Open to new roles & interesting projects',
  languages: [
    { name: 'Hungarian', level: 'Native' },
    { name: 'English', level: 'C1 · professional' },
  ],
};

export type DomainKey = 'ai' | 'web' | 'mobile' | 'backend' | 'cloud' | 'iot';

export const domains: Record<DomainKey, { label: string; color: string }> = {
  ai: { label: 'AI · Voice · Agents', color: '#c3ff4a' },
  backend: { label: 'Backend & Data', color: '#52e3ff' },
  web: { label: 'Web & SSR', color: '#9b8cff' },
  mobile: { label: 'Mobile', color: '#ff6fae' },
  cloud: { label: 'Cloud & DevOps', color: '#ffbe55' },
  iot: { label: 'Hardware & Home', color: '#7dffcf' },
};

// level: 1..5, used for node size in the 3D graph
export const skills: { name: string; d: DomainKey; level: number }[] = [
  // AI
  { name: 'LLM apps', d: 'ai', level: 5 },
  { name: 'Voice AI', d: 'ai', level: 5 },
  { name: 'Agent systems', d: 'ai', level: 5 },
  { name: 'RAG', d: 'ai', level: 5 },
  { name: 'MCP', d: 'ai', level: 4 },
  { name: 'Claude API', d: 'ai', level: 5 },
  { name: 'OpenAI', d: 'ai', level: 4 },
  { name: 'Gemini', d: 'ai', level: 4 },
  { name: 'LangChain', d: 'ai', level: 3 },
  { name: 'Vector search', d: 'ai', level: 4 },
  { name: 'Speech-to-Text', d: 'ai', level: 4 },
  { name: 'Text-to-Speech', d: 'ai', level: 4 },
  { name: 'Telnyx', d: 'ai', level: 4 },
  { name: 'Local LLMs (MLX)', d: 'ai', level: 3 },
  { name: 'Computer vision', d: 'ai', level: 3 },
  // backend
  { name: 'TypeScript', d: 'backend', level: 5 },
  { name: 'Node.js', d: 'backend', level: 5 },
  { name: 'NestJS', d: 'backend', level: 5 },
  { name: 'PostgreSQL', d: 'backend', level: 5 },
  { name: 'Redis', d: 'backend', level: 4 },
  { name: 'BullMQ', d: 'backend', level: 4 },
  { name: 'WebSockets', d: 'backend', level: 4 },
  { name: 'GraphQL', d: 'backend', level: 3 },
  { name: 'Express', d: 'backend', level: 4 },
  { name: 'Drizzle / TypeORM', d: 'backend', level: 4 },
  { name: 'Dart', d: 'backend', level: 4 },
  { name: 'Python', d: 'backend', level: 3 },
  { name: 'C#', d: 'backend', level: 3 },
  { name: 'Stripe', d: 'backend', level: 4 },
  { name: 'SSO / OAuth / OIDC', d: 'backend', level: 4 },
  { name: 'Web3 (ethers, wagmi)', d: 'backend', level: 3 },
  // web
  { name: 'Angular', d: 'web', level: 5 },
  { name: 'React', d: 'web', level: 4 },
  { name: 'SvelteKit', d: 'web', level: 4 },
  { name: 'Next.js', d: 'web', level: 4 },
  { name: 'Astro', d: 'web', level: 4 },
  { name: 'Nuxt', d: 'web', level: 3 },
  { name: 'Three.js', d: 'web', level: 3 },
  { name: 'Core Web Vitals', d: 'web', level: 5 },
  { name: 'SEO & AI search', d: 'web', level: 4 },
  { name: 'Headless CMS', d: 'web', level: 4 },
  // mobile
  { name: 'Flutter', d: 'mobile', level: 5 },
  { name: 'React Native', d: 'mobile', level: 5 },
  { name: 'Ionic / Capacitor', d: 'mobile', level: 4 },
  { name: 'Kotlin / Compose', d: 'mobile', level: 3 },
  { name: 'Offline-first', d: 'mobile', level: 4 },
  { name: 'Store releases', d: 'mobile', level: 5 },
  { name: 'Push / Firebase', d: 'mobile', level: 4 },
  // cloud
  { name: 'Cloudflare', d: 'cloud', level: 5 },
  { name: 'Workers / Pages / R2 / D1', d: 'cloud', level: 5 },
  { name: 'AWS (S3, EC2, Lambda)', d: 'cloud', level: 4 },
  { name: 'Object storage', d: 'cloud', level: 4 },
  { name: 'Docker', d: 'cloud', level: 5 },
  { name: 'CI/CD', d: 'cloud', level: 4 },
  { name: 'Linux & nginx', d: 'cloud', level: 4 },
  { name: 'Sentry', d: 'cloud', level: 4 },
  { name: 'Observability', d: 'cloud', level: 4 },
  { name: 'Proxmox', d: 'cloud', level: 4 },
  { name: 'Hetzner', d: 'cloud', level: 3 },
  { name: 'Performance tuning', d: 'cloud', level: 5 },
  // iot
  { name: 'ESP32 / ESPHome', d: 'iot', level: 4 },
  { name: 'Home Assistant', d: 'iot', level: 4 },
  { name: 'Music Assistant', d: 'iot', level: 3 },
  { name: 'Automations', d: 'iot', level: 4 },
  { name: 'Bluetooth / BLE', d: 'iot', level: 3 },
  { name: '3D printing', d: 'iot', level: 3 },
];

export type Project = {
  id: string;
  name: string;
  client: string;
  period: string;
  role: string;
  domain: DomainKey;
  tags: DomainKey[];
  featured?: boolean;
  summary: string;
  highlights: string[];
  stack: string[]; // names here should match `skills` where possible (graph edges)
  links?: { label: string; url: string }[];
};

export const projects: Project[] = [
  {
    id: 'vybex',
    name: 'VYBEX',
    client: 'ProCats · own product',
    period: '2026',
    role: 'Sole developer, end to end',
    domain: 'ai',
    tags: ['ai', 'mobile', 'backend', 'cloud'],
    featured: true,
    summary:
      'AI personal stylist: upload a photo, pick a vibe, get a rendered head-to-toe outfit built from real, in-stock items in three price tiers, then buy it in one tap.',
    highlights: [
      'Built the whole product alone: Flutter client for Android, iOS and web, a Dart API server and PostgreSQL.',
      'Wired AI image generation (Gemini / OpenAI), a dropshipping catalogue, Stripe checkout and automated invoicing into one purchase flow.',
      '9-language localisation, Google / Apple sign-in, push notifications and Sentry monitoring; self-hosted with Docker behind Cloudflare Tunnel.',
      'Shipped to Google Play in about two weeks of focused work.',
    ],
    stack: ['Flutter', 'Dart', 'PostgreSQL', 'Gemini', 'OpenAI', 'Stripe', 'Docker', 'Cloudflare', 'Sentry', 'SSO / OAuth / OIDC', 'Hetzner', 'Store releases'],
    links: [
      { label: 'vybex.vip', url: 'https://vybex.vip' },
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=hu.procats.vybex' },
    ],
  },
  {
    id: 'voice-ordering',
    name: 'Onira · AI phone ordering',
    client: 'Onira (restaurant ordering) · via ProCats',
    period: '2025',
    role: 'Core backend & AI developer',
    domain: 'ai',
    tags: ['ai', 'backend'],
    featured: true,
    summary:
      'A voice agent that answers the restaurant phone, takes the order in natural Hungarian, matches dishes to the menu, checks the address and texts a confirmation.',
    highlights: [
      'Real-time speech pipeline over Telnyx with streaming speech-to-text, LLM-driven dialogue and text-to-speech.',
      'Menu matching with vector search (RAG over the menu) plus fuzzy fallbacks, so "a large one of the spicy thing" still lands on the right item.',
      'Voice activity detection, barge-in, concurrent calls, delivery-price calculation and SMS confirmations on a BullMQ / Redis job backbone.',
    ],
    stack: ['Voice AI', 'Telnyx', 'Speech-to-Text', 'Text-to-Speech', 'Gemini', 'LangChain', 'RAG', 'Vector search', 'NestJS', 'Redis', 'BullMQ', 'WebSockets', 'Docker'],
  },
  {
    id: 'abigel',
    name: 'Abigel.ai',
    client: 'ProCats · AI voice platform',
    period: '2025 – 2026',
    role: 'Full-stack developer (team)',
    domain: 'ai',
    tags: ['ai', 'backend', 'web'],
    summary:
      'Multi-tenant SaaS for building and running AI voice agents, with a visual flow editor and usage-based billing.',
    highlights: [
      'Built the visual agent builder UI: React Flow editor, template gallery, tenant and agent admin.',
      'Implemented Stripe subscriptions, usage metering and the admin modules on a NestJS / PostgreSQL backend.',
      'Worked across OpenAI and Gemini realtime integrations over WebSockets.',
    ],
    stack: ['Agent systems', 'Voice AI', 'OpenAI', 'Gemini', 'React', 'NestJS', 'PostgreSQL', 'Stripe', 'WebSockets'],
  },
  {
    id: 'eventus',
    name: 'Eventus® field-service apps',
    client: 'MXC Software · for MVM, H1 Systems, Opus',
    period: 'Current',
    role: 'Lead mobile developer',
    domain: 'mobile',
    tags: ['mobile', 'backend'],
    summary:
      'Workflow and workforce-management mobile apps for field crews of large Hungarian energy utilities, built to keep working with no signal.',
    highlights: [
      'Solo / lead developer of the mobile clients of Eventus®, the workflow and workforce-management platform of Fornax (via MXC Software).',
      'Offline-first data model and sync, so crews can finish jobs underground or out in the fields.',
    ],
    stack: ['Offline-first', 'Store releases', 'TypeScript'],
  },
  {
    id: 'tgs',
    name: 'TGS Hungary',
    client: 'TGS Hungary',
    period: '2024',
    role: 'Main developer of the app',
    domain: 'mobile',
    tags: ['mobile', 'backend'],
    summary:
      'Gamified mobile app with Hungarian meme mini-games where players earn crypto tokens and move them to their own wallet.',
    highlights: [
      'Took the React Native app from first commit to App Store release in about two months.',
      'Apple and Google sign-in, token balance, an encrypted self-custody wallet (ethers.js) and embedded HTML5 games.',
    ],
    stack: ['React Native', 'Push / Firebase', 'SSO / OAuth / OIDC', 'Web3 (ethers, wagmi)', 'Headless CMS', 'Store releases'],
    links: [{ label: 'App Store', url: 'https://apps.apple.com/hu/app/tgs-hungary/id6502987057' }],
  },
  {
    id: 'yoloai',
    name: 'YoloAI',
    client: 'YoloAI Technologies',
    period: '2024',
    role: 'Build team member',
    domain: 'ai',
    tags: ['ai', 'mobile', 'web'],
    summary:
      'AI tutor app built in 30 days on a 3 million HUF budget for the Hungarian startup series "Ötlettől a Milliárdokig". 10K+ Android installs.',
    highlights: [
      'Part of the small team that went from zero to iOS and Android release in a month.',
      'Angular + Ionic client around an LLM tutoring backend.',
    ],
    stack: ['LLM apps', 'Angular', 'Ionic / Capacitor', 'Store releases'],
    links: [
      { label: 'App Store', url: 'https://apps.apple.com/hu/app/yoloai-ai-education-learning/id6667094097' },
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.yoloai.edu' },
    ],
  },
  {
    id: 'presale',
    name: 'Proton · KYC-gated token presale',
    client: 'ProCats',
    period: '2025',
    role: 'Main developer',
    domain: 'backend',
    tags: ['backend', 'web', 'ai'],
    summary:
      'A crypto presale dApp where buyers pass an in-browser KYC selfie check before the backend approves them on-chain.',
    highlights: [
      'In-browser face detection for KYC selfies with TensorFlow.js — no images leave the device until needed.',
      'Wallet connection, stablecoin approval and purchase flow with wagmi / viem / RainbowKit; NestJS backend writes approvals on-chain.',
    ],
    stack: ['React', 'Web3 (ethers, wagmi)', 'Computer vision', 'NestJS', 'PostgreSQL', 'Docker', 'CI/CD'],
  },
  {
    id: 'roksh',
    name: 'Roksh Delivery Manager & ALDI shop',
    client: 'Roksh (WeShop) · via ProCats',
    period: '2024',
    role: 'Developer',
    domain: 'mobile',
    tags: ['mobile', 'web'],
    summary:
      'Courier app for Hungary’s grocery-delivery marketplace, plus the ALDI-branded online shop running on the same platform.',
    highlights: [
      'In-app courier chat on iOS and Android with the Sendbird UIKit, barcode scanning, live location and push.',
      'Worked on shop.aldi.hu, an Angular / Ionic variant of the Roksh shop.',
    ],
    stack: ['React Native', 'Push / Firebase', 'Angular', 'Ionic / Capacitor'],
    links: [{ label: 'shop.aldi.hu', url: 'https://shop.aldi.hu' }],
  },
  {
    id: 'booking',
    name: 'Catch · service booking marketplace',
    client: 'Catch · via ProCats',
    period: '2023 – 2024',
    role: 'Main backend developer',
    domain: 'backend',
    tags: ['backend', 'web', 'mobile'],
    summary:
      'Multi-tenant marketplace with separate customer, provider and admin apps for booking services by category.',
    highlights: [
      'NestJS API with per-tenant PostgreSQL data sources and migrations.',
      'Job queues on BullMQ / Redis and real-time updates over WebSockets; S3 media storage.',
      'Parts of the Angular / Ionic customer, provider and admin apps, plus a GraphQL layer.',
    ],
    stack: ['NestJS', 'PostgreSQL', 'Drizzle / TypeORM', 'Redis', 'BullMQ', 'WebSockets', 'GraphQL', 'Angular', 'Ionic / Capacitor', 'Object storage', 'Docker'],
  },
  {
    id: 'fleet',
    name: 'Custode · fleet & transport management',
    client: 'Custode Trans Kft. · via ProCats',
    period: '2023',
    role: 'Main developer',
    domain: 'web',
    tags: ['web', 'backend', 'mobile'],
    summary:
      'Internal system that runs a cold-chain haulage fleet: vehicles, services, holidays, fuel-card data and Excel round-trips.',
    highlights: [
      'Angular admin frontend and Node.js / Express / PostgreSQL backend, built nearly single-handedly.',
      'Excel import / export for operational data, charts, S3 file storage and a React Native wrapper for drivers.',
    ],
    stack: ['Angular', 'Node.js', 'Express', 'PostgreSQL', 'Object storage', 'React Native'],
  },
  {
    id: 'whistlecat',
    name: 'Whistlecat',
    client: 'ProCats product',
    period: '2023 – 2024',
    role: 'Lead developer',
    domain: 'web',
    tags: ['web', 'backend'],
    summary: 'Multi-tenant whistleblowing (internal reporting) SaaS for companies and schools, reached by company code or QR code.',
    highlights: [
      'Built mostly single-handedly: Angular admin and reporting frontend plus the Express / PostgreSQL backend.',
      'Case handling with statuses, handlers, private notes and attachments, customisable report forms, subscriptions and a 24-language interface.',
    ],
    stack: ['Angular', 'Express', 'PostgreSQL', 'Object storage', 'Headless CMS'],
  },
  {
    id: 'erp-apps',
    name: 'Vector delivery-note & inventory apps',
    client: 'Vector Kft. (VECTORY ERP) · via ProCats',
    period: '2023',
    role: 'Sole developer',
    domain: 'mobile',
    tags: ['mobile'],
    summary: 'React Native delivery-note and inventory apps for the customers of an ERP vendor.',
    highlights: [
      'Offline mode, signature capture, camera attachments and in-app PDF viewing.',
      'Also worked on VAPP, the App Store mobile app of the VECTORY ERP.',
    ],
    stack: ['React Native', 'Offline-first'],
    links: [{ label: 'VAPP · App Store', url: 'https://apps.apple.com/hu/app/vector-vapp/id1446400743' }],
  },
  {
    id: 'printer-wrapper',
    name: 'Bluetooth receipt-printer wrapper',
    client: 'ProCats',
    period: '2023',
    role: 'Developer',
    domain: 'mobile',
    tags: ['mobile', 'iot'],
    summary:
      'React Native wrapper that runs a web app in a WebView and gives it native powers: Bluetooth receipt printing, camera / barcode and PDF.',
    highlights: [
      'Built the web-to-native postMessage bridge SDK and its documentation site.',
      'Receipt printing on Polpos MP80 and Datecs 350 Bluetooth printers through an ESC/POS SDK.',
    ],
    stack: ['React Native', 'Bluetooth / BLE', 'TypeScript'],
  },
  {
    id: 'urbanhome',
    name: 'UrbanHome product importer',
    client: 'URBAN HOME Kft. · via MXC Software',
    period: '2025 – 2026',
    role: 'Developer',
    domain: 'backend',
    tags: ['backend'],
    summary: 'C# product importer that feeds a furniture and home-decor retailer’s Shopify webshop.',
    highlights: ['Built the importer as part of the MXC Software engagement.'],
    stack: ['C#'],
  },
  {
    id: 'hovirag',
    name: 'hovirag.hu',
    client: 'Hóvirág (building services) · freelance',
    period: '2022 – 2023',
    role: 'Sole developer',
    domain: 'web',
    tags: ['web', 'backend'],
    summary: 'New website for a family business in refrigeration, air conditioning and heat pumps, replacing an old Joomla site.',
    highlights: ['Angular frontend with a Strapi headless CMS (i18n), including a database migration from SQLite to MySQL; deployed with GitHub Actions.'],
    stack: ['Angular', 'Headless CMS', 'CI/CD'],
    links: [{ label: 'hovirag.hu', url: 'https://hovirag.hu' }],
  },
  {
    id: 'erp-grain',
    name: 'Grain-trading ERP',
    client: 'Magyar Gabona',
    period: '2025',
    role: 'Full-stack developer (team)',
    domain: 'web',
    tags: ['web', 'backend'],
    summary: 'ERP for a grain-trading group: partners, contracts, vehicles, transport, delivery notes, multi-company.',
    highlights: ['Angular 20 + NestJS + PostgreSQL, covered by Cypress end-to-end tests.'],
    stack: ['Angular', 'NestJS', 'PostgreSQL', 'CI/CD'],
  },
  {
    id: 'autopiac',
    name: 'Edge-native marketplace engine',
    client: 'Side project · in progress',
    period: '2026',
    role: 'Architect & sole developer',
    domain: 'cloud',
    tags: ['cloud', 'web', 'backend', 'ai'],
    summary:
      'A classifieds search engine that runs entirely on Cloudflare’s edge: SvelteKit SSR, custom search index, background workers and AI-assisted listing.',
    highlights: [
      'SvelteKit SSR on Workers with D1 / Drizzle, R2 image buckets, queue-driven indexer and job workers.',
      'Hand-built binary search index for sub-50 ms faceted search at the edge.',
      'Sentry, OAuth sign-in, WebP pipeline and service worker; tuned for Core Web Vitals.',
    ],
    stack: ['SvelteKit', 'Workers / Pages / R2 / D1', 'Cloudflare', 'Drizzle / TypeORM', 'Sentry', 'SSO / OAuth / OIDC', 'Claude API', 'Performance tuning', 'Core Web Vitals'],
  },
  {
    id: 'voice-home',
    name: 'Local voice assistant',
    client: 'Open source · homelab',
    period: '2026',
    role: 'Creator',
    domain: 'iot',
    tags: ['iot', 'ai'],
    summary:
      'Private, Hungarian-speaking voice control for the house: speech recognition plus a fine-tuned local LLM on Apple silicon, driving Home Assistant, the TV and the music.',
    highlights: [
      'Fine-tuned a small LLM with MLX for intent parsing; runs fully offline.',
      'Honest control loop: confirms what actually happened instead of guessing.',
      'Wall-tablet kiosk panel and Android TV control.',
    ],
    stack: ['Voice AI', 'Local LLMs (MLX)', 'Speech-to-Text', 'Home Assistant', 'Automations', 'Python', 'Agent systems'],
    links: [{ label: 'GitHub', url: 'https://github.com/raczcsaba/voiceassistant' }],
  },
  {
    id: 'speaker',
    name: 'DIY Music Assistant speaker',
    client: 'Open source · hardware',
    period: '2026',
    role: 'Creator',
    domain: 'iot',
    tags: ['iot'],
    summary: 'A hi-fi network speaker built around an ESP32-S3, ESPHome and Music Assistant, with a 3D-printed enclosure designed in OpenSCAD.',
    highlights: ['Custom ESPHome firmware, I²S DAC, multi-room sync via Music Assistant.'],
    stack: ['ESP32 / ESPHome', 'Music Assistant', 'Home Assistant', '3D printing'],
    links: [{ label: 'GitHub', url: 'https://github.com/raczcsaba/diy-music-assistant-speaker' }],
  },
  {
    id: 'mentesfalat',
    name: 'Mentes Falat',
    client: 'Side product',
    period: '2026',
    role: 'Sole developer',
    domain: 'mobile',
    tags: ['mobile', 'web', 'backend'],
    summary: 'Hungary-first gluten-free places app with crowdsourced, trust-weighted verification. On the App Store.',
    highlights: ['Flutter app, TypeScript API, Astro website, PostgreSQL; self-hosted with Docker, plus an automated integration-test harness.'],
    stack: ['Flutter', 'TypeScript', 'Astro', 'PostgreSQL', 'Docker', 'SEO & AI search'],
  },
];

export const experience = [
  {
    when: '2023 — now',
    title: 'Full-stack Developer',
    org: 'ProCat Solutions Kft. · Budapest',
    text:
      'Software studio building web, mobile, SaaS and voice-AI products for Hungarian and international clients. 15+ shipped projects; often the sole or lead developer from architecture to store release.',
    points: [
      'Sole or lead developer on most engagements: architecture, database, API, web / mobile client and the App Store / Google Play release.',
      'Voice AI and LLM products since 2025: a real-time phone-ordering agent for restaurants and a multi-tenant voice-agent platform.',
      'Lead mobile developer of the Eventus® field-service apps used by crews of MVM and other Hungarian utilities (via MXC Software).',
      'Clients and products include Roksh / ALDI, YoloAI, TGS Hungary, Catch, Custode, Vector, URBAN HOME and Magyar Gabona.',
    ],
  },
  {
    when: '2022 — 2023',
    title: 'Freelance Web Developer',
    org: 'Independent',
    text: 'Websites and web apps for small businesses; Angular + Strapi headless CMS rebuild for a building-services company.',
  },
  {
    when: '2022',
    title: 'Junior Frontend Developer (state-recognised qualification)',
    org: 'Soter-Line Education Centre · Budapest',
    text: 'Six-month intensive programme (EQF level 4): HTML, CSS/SCSS, JavaScript, Angular, Firebase.',
  },
  {
    when: 'Before',
    title: 'Bilingual secondary school (HU–EN)',
    org: 'Szent Benedek PG · Kiskunfélegyháza',
    text: 'Hungarian–English bilingual programme, érettségi.',
  },
];

export const capabilities = [
  {
    key: 'ai',
    title: 'Voice AI & agents',
    text: 'Phone agents, realtime speech pipelines, tool-using LLM agents, MCP servers and RAG that actually retrieves the right thing.',
    chips: ['Claude / OpenAI / Gemini', 'Telnyx · SIP', 'STT / TTS / VAD', 'RAG · Qdrant · pgvector', 'MCP', 'Agent SDKs'],
    size: 'xl',
  },
  {
    key: 'cloud',
    title: 'Edge & DevOps',
    text: 'Cloudflare-native apps, Docker everywhere, CI/CD, Sentry and dashboards, so things stay fast and fixable.',
    chips: ['Workers · Pages · R2 · D1', 'AWS · S3', 'Docker', 'GitHub Actions', 'Sentry', 'Proxmox'],
    size: '',
  },
  {
    key: 'web',
    title: 'Web & SSR',
    text: 'Server-rendered, SEO- and AI-search-ready sites and apps that score green on Core Web Vitals.',
    chips: ['Angular', 'React · Next.js', 'SvelteKit', 'Astro', 'Nuxt', 'Three.js'],
    size: 'wide',
  },
  {
    key: 'mobile',
    title: 'Mobile',
    text: 'Flutter and React Native apps taken all the way through App Store and Google Play review.',
    chips: ['Flutter', 'React Native', 'Ionic', 'Offline-first', 'Push'],
    size: 'wide',
  },
  {
    key: 'backend',
    title: 'Backend & data',
    text: 'Multi-tenant APIs, queues, payments, SSO and Postgres that doesn’t fall over.',
    chips: ['NestJS', 'PostgreSQL', 'Redis · BullMQ', 'Stripe', 'OAuth · OIDC · SSO', 'WebSockets'],
    size: '',
  },
  {
    key: 'perf',
    title: 'Hyper-optimisation',
    text: 'Bundle diets, edge caching, query plans, image pipelines. I like making things measurably faster.',
    chips: ['Core Web Vitals', 'Edge caching', 'Query tuning', 'Lighthouse 100'],
    size: '',
  },
  {
    key: 'iot',
    title: 'Hardware & automation',
    text: 'ESP32 firmware, Home Assistant, n8n-style automations and a homelab that runs my house.',
    chips: ['ESPHome', 'Home Assistant', 'Automations', 'BLE'],
    size: '',
  },
] as const;

export const funFacts = [
  'Listens in lossless only. His Home Assistant and Music Assistant projects exist because Spotify’s bitrate offended him.',
  'Cooks like he codes: mise en place first, then ship. Signature move: a slow Sunday pörkölt that takes longer than most deploys.',
  'Owns more ESP32 boards than coffee mugs, and most of them are doing something useful right now.',
  'His house speaks Hungarian. He built the voice assistant that makes that true, and it runs fully offline.',
  'Once 3D-printed a replacement part for his 3D printer. Using the same printer. It held.',
  'Wrote a flat-hunting engine that ranks apartments by train commute time instead of square metres.',
  'Runs a Proxmox homelab with better uptime than some production systems he has met.',
  'Built a full Google Play app in two weeks, then spent a weekend tuning its splash-screen animation.',
  'Debugs in English, celebrates in Hungarian.',
  'Grew up in the Hungarian Great Plain, where the Wi-Fi was slow, so he learned to love caching.',
];

export const stats = [
  { n: 4, suffix: '+', label: 'years shipping production code' },
  { n: 25, suffix: '+', label: 'projects delivered' },
  { n: 6, suffix: '', label: 'apps live in the stores' },
  { n: 3, suffix: '', label: 'voice-AI systems built' },
];

export const marquee = [
  'TypeScript', 'NestJS', 'Flutter', 'React Native', 'Angular', 'SvelteKit', 'Next.js', 'Astro', 'PostgreSQL', 'Redis',
  'Cloudflare Workers', 'R2', 'D1', 'AWS', 'Docker', 'Sentry', 'Claude', 'OpenAI', 'Gemini', 'RAG', 'MCP', 'Telnyx',
  'Stripe', 'OAuth / SSO', 'Three.js', 'ESPHome', 'Home Assistant', 'Proxmox',
];

/** Plain-text knowledge for llms.txt and the AI bot. */
export function knowledgeText(): string {
  const lines: string[] = [];
  lines.push(`# ${person.name} (${person.nativeName}) — ${person.title}`);
  lines.push('');
  lines.push(`> ${person.short}`);
  lines.push('');
  lines.push(`- Location: ${person.location} (open to remote and hybrid)`);
  lines.push(`- Email: ${person.email}`);
  lines.push(`- Website: ${SITE}`);
  lines.push(`- GitHub: ${person.github}`);
  lines.push(`- PDF CV: ${SITE}${person.pdf}`);
  lines.push(`- Languages: ${person.languages.map((l) => `${l.name} (${l.level})`).join(', ')}`);
  lines.push(`- Status: ${person.available}`);
  lines.push('');
  lines.push('## Experience');
  for (const e of experience) lines.push(`- ${e.when}: ${e.title}, ${e.org}. ${e.text}`);
  lines.push('');
  lines.push('## Capabilities');
  for (const c of capabilities) lines.push(`- ${c.title}: ${c.text} (${c.chips.join(', ')})`);
  lines.push('');
  lines.push('## Selected projects');
  for (const p of projects) {
    lines.push(`### ${p.name} — ${p.client} (${p.period})`);
    lines.push(`Role: ${p.role}. ${p.summary}`);
    for (const h of p.highlights) lines.push(`- ${h}`);
    lines.push(`Stack: ${p.stack.join(', ')}`);
    if (p.links?.length) lines.push(`Links: ${p.links.map((l) => `${l.label} <${l.url}>`).join(', ')}`);
    lines.push('');
  }
  lines.push('## Skills');
  for (const [k, d] of Object.entries(domains)) {
    lines.push(`- ${d.label}: ${skills.filter((s) => s.d === k).map((s) => s.name).join(', ')}`);
  }
  lines.push('');
  lines.push('## Off the clock');
  for (const f of funFacts) lines.push(`- ${f}`);
  return lines.join('\n');
}
