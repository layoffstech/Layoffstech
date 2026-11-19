// build.js: creates one real HTML page for every post and category (good for Google),
// plus sitemap.xml and robots.txt. Netlify runs this automatically on every deploy.
// To run it yourself:  node build.js
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "js", "posts.js"), "utf8");
const { CATEGORIES, POSTS, SITE_URL } = new Function(src + "; return { CATEGORIES, POSTS, SITE_URL };")();

const SITE = (SITE_URL || process.env.SITE_URL || "https://YOUR-DOMAIN.com").replace(/\/$/, "");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const sorted = POSTS.map((p, i) => ({ p, i }))
  .sort((a, b) => new Date(b.p.date) - new Date(a.p.date) || a.i - b.i).map((x) => x.p);
const catOf = (slug) => CATEGORIES.find((c) => c.slug === slug) || { slug, name: slug, desc: "" };
const abs = (u) => (u.startsWith("http") ? u : SITE + u);
const ogImage = (p) => abs(p.image || `/images/cat-${p.cat}.png`);

const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@500;700;800&display=swap" rel="stylesheet">';
const ICONS = '<link rel="icon" href="/images/logo-icon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/images/logo-icon.png"><meta name="theme-color" content="#1456e8">';

const shell = ({ title, desc, canonical, attrs, head = "", body }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:site_name" content="Mamta Media"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">
${head}
${ICONS}
${FONTS}
<link rel="stylesheet" href="/css/style.css">
</head>
<body ${attrs}>
<div id="hdr"></div>
<main>
${body}
</main>
<div id="ftr"></div>
<script src="/js/posts.js"></script>
<script src="/js/main.js"></script>
</body>
</html>
`;

for (const d of ["posts", "category"]) {
  fs.rmSync(path.join(__dirname, d), { recursive: true, force: true });
  fs.mkdirSync(path.join(__dirname, d), { recursive: true });
}

// ---- Post pages ----
for (const p of POSTS) {
  const c = catOf(p.cat);
  const url = `${SITE}/posts/${p.slug}`;
  const ld = {
    "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.summary,
    image: [ogImage(p)], datePublished: p.date, dateModified: p.date, mainEntityOfPage: url,
    author: { "@type": "Organization", name: p.author || "Mamta Media Team" },
    publisher: { "@type": "Organization", name: "Mamta Media", logo: { "@type": "ImageObject", url: SITE + "/images/logo.png" } }
  };
  const head = `<meta property="og:type" content="article"><meta property="og:image" content="${ogImage(p)}"><meta name="twitter:card" content="summary_large_image">` +
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;
  const text = p.body.map((t) => (t.startsWith("## ") ? `<h2>${esc(t.slice(3))}</h2>` : `<p>${esc(t)}</p>`)).join("\n");
  const body = `<div id="article"><div class="wrap inner post"><h1>${esc(p.title)}</h1><p class="lead">${esc(p.summary)}</p><div class="body">${text}</div></div></div>`;
  fs.writeFileSync(path.join(__dirname, "posts", p.slug + ".html"),
    shell({ title: `${p.title} | Mamta Media`, desc: p.summary, canonical: url, attrs: `data-page="post" data-slug="${esc(p.slug)}"`, head, body }));
}

// ---- Category pages ----
for (const c of CATEGORIES) {
  const url = `${SITE}/category/${c.slug}`;
  const list = sorted.filter((p) => p.cat === c.slug).map((p) => `<li><a href="/posts/${p.slug}">${esc(p.title)}</a></li>`).join("");
  const body = `<div id="catContent"><div class="wrap inner"><h1>${esc(c.name)}</h1><p class="lead">${esc(c.desc)}</p><ul>${list}</ul></div></div>`;
  fs.writeFileSync(path.join(__dirname, "category", c.slug + ".html"),
    shell({ title: `${c.name} News and Stories | Mamta Media`, desc: `${c.desc} Read the latest ${c.name.toLowerCase()} stories on Mamta Media.`, canonical: url, attrs: `data-page="category" data-cat="${c.slug}"`, body }));
}

// ---- sitemap.xml + robots.txt ----
const urls = [
  ["/", new Date().toISOString().slice(0, 10)],
  ...["about", "contact", "privacy", "disclaimer"].map((n) => [`/${n}`, null]),
  ...CATEGORIES.map((c) => [`/category/${c.slug}`, null]),
  ...POSTS.map((p) => [`/posts/${p.slug}`, p.date.slice(0, 10)])
];
fs.writeFileSync(path.join(__dirname, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(([u, d]) => `  <url><loc>${SITE}${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ""}</url>`).join("\n") + `\n</urlset>\n`);
fs.writeFileSync(path.join(__dirname, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /thanks\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Built ${POSTS.length} posts, ${CATEGORIES.length} categories. Site URL: ${SITE}`);
