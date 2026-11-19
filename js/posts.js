// ===== CATEGORIES =====
// Naya category chahiye? Yahan ek line add karo, aur post mein wahi "cat" slug likho.
const CATEGORIES = [
  { slug: "big-tech",  name: "Big Tech",     desc: "Google, Microsoft, Amazon jaisi badi companies ki layoffs aur restructuring." },
  { slug: "startups",  name: "Startups",     desc: "Funding slow hone, shutdown aur cost-cutting se jude startup layoffs." },
  { slug: "india",     name: "India",        desc: "Bengaluru, Gurugram, Hyderabad, Pune aur baaki India ke tech hubs ki news." },
  { slug: "ai-automation", name: "AI & Automation", desc: "AI ki wajah se badalte roles, teams aur hiring ke faisle." },
  { slug: "hiring-freeze", name: "Hiring Freeze", desc: "Hiring rokne, offers waapas lene aur budget cuts ki khabrein." },
  { slug: "global",    name: "Global",       desc: "US, Europe aur baaki duniya mein tech layoffs ke updates." }
];

// ===== POSTS =====
// Naya post: list ke SABSE UPAR ek naya block paste karo.
// DHYAN: Neeche ke posts SAMPLE hain (company naam aur numbers kalpanik). Inhe apni real news se badal do.
const POSTS = [
  {
    slug: "sample-cloudnova-layoffs",
    title: "CloudNova cuts 1,200 jobs in cloud and sales teams",
    company: "CloudNova (sample)", count: 1200, date: "2026-11-17", cat: "big-tech",
    summary: "Company ne restructuring ka hawala diya. Sabse zyada asar sales aur support teams par.",
    body: [
      "Yeh ek sample post hai. Apni real news yahan likho.",
      "Pehle paragraph mein seedha batao: kaun si company, kitne log, kaun si teams, aur kab.",
      "Phir source link do (company announcement, regulatory filing ya reliable news report).",
      "Aakhir mein batao ki affected logon ke liye kya options hain: severance, notice period, rehiring."
    ],
    source: "https://example.com"
  },
  {
    slug: "sample-appforge-restructuring",
    title: "AppForge trims 400 roles in India engineering hub",
    company: "AppForge (sample)", count: 400, date: "2026-11-14", cat: "india",
    summary: "Bengaluru aur Gurugram ke engineering teams affected. Company ab AI products par focus karegi.",
    body: ["Yeh bhi ek sample post hai.", "Har post mein company, count, date aur category daalo, baaki page apne aap ban jayega."],
    source: "https://example.com"
  },
  {
    slug: "sample-datawave-hiring-freeze",
    title: "DataWave announces hiring freeze, 150 layoffs",
    company: "DataWave (sample)", count: 150, date: "2026-11-10", cat: "startups",
    summary: "Funding slow hone ke baad startup ne costs kam karne ka faisla liya.",
    body: ["Sample post. Isse delete karke apni news likho."],
    source: "https://example.com"
  },
  {
    slug: "sample-botworks-ai-shift",
    title: "BotWorks replaces 300 support roles with AI assistants",
    company: "BotWorks (sample)", count: 300, date: "2026-11-08", cat: "ai-automation",
    summary: "Customer support team chhoti hogi, AI tools ab pehli line sambhalenge.",
    body: ["Sample post. Yahan real news likho."],
    source: "https://example.com"
  },
  {
    slug: "sample-pixelhub-europe",
    title: "PixelHub closes two European offices, 500 jobs affected",
    company: "PixelHub (sample)", count: 500, date: "2026-11-05", cat: "global",
    summary: "Gaming company ne Europe mein operations samet liye.",
    body: ["Sample post. Yahan real news likho."],
    source: "https://example.com"
  },
  {
    slug: "sample-finstack-offers",
    title: "FinStack pauses hiring, rescinds 80 campus offers",
    company: "FinStack (sample)", count: 80, date: "2026-11-02", cat: "hiring-freeze",
    summary: "Fintech company ne budget review ke baad onboarding rok di.",
    body: ["Sample post. Yahan real news likho."],
    source: "https://example.com"
  }
];
