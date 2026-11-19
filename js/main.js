const $ = (s, r = document) => r.querySelector(s);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtNum = (n) => n.toLocaleString("en-IN");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const catOf = (slug) => CATEGORIES.find((c) => c.slug === slug) || { slug, name: slug, desc: "" };
const sorted = [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
const page = document.body.dataset.page;
const qs = new URLSearchParams(location.search);

// ---------- Theme ----------
const root = document.documentElement;
try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}

// ---------- Header + Footer ----------
const catLinks = CATEGORIES.map((c) => `<a href="category.html?cat=${c.slug}">${esc(c.name)}</a>`).join("");
$("#hdr").innerHTML = `
<header class="site">
  <div class="wrap bar">
    <a class="logo" href="index.html">Mamta<span>Media</span></a>
    <nav id="nav" aria-label="Main">
      <a href="index.html#latest">Latest</a>
      <a href="index.html#categories">Categories</a>
      <a href="index.html#tracker">Tracker</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
    </nav>
    <div class="actions">
      <button id="themeBtn" class="icon" type="button" aria-label="Dark ya light mode badlo">◐</button>
      <a class="btn small" href="index.html#alerts">Get alerts →</a>
      <button id="menuBtn" class="icon menu" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
    </div>
  </div>
  <div class="catbar"><div class="wrap">${catLinks}</div></div>
</header>`;

$("#ftr").innerHTML = `
<section class="cta-band"><div class="wrap">
  <h2>Layoffs ki khabar, <em>sabse pehle</em> aapke paas.</h2>
  <p>Naye layoffs ki update inbox mein. Koi spam nahi.</p>
  <a class="btn light" href="index.html#alerts">Get alerts →</a>
</div></section>
<footer class="site"><div class="wrap grid">
  <div><a class="logo" href="index.html">Mamta<span>Media</span></a>
    <p>Tech layoffs ki news, numbers aur updates. Har post mein source ka link.</p></div>
  <div><h4>Categories</h4><ul>${CATEGORIES.map((c) => `<li><a href="category.html?cat=${c.slug}">${esc(c.name)}</a></li>`).join("")}</ul></div>
  <div><h4>Explore</h4><ul>
    <li><a href="index.html#latest">Latest news</a></li><li><a href="index.html#tracker">Layoff tracker</a></li>
    <li><a href="index.html#faqs">FAQs</a></li><li><a href="about.html">About us</a></li><li><a href="contact.html">Contact</a></li></ul></div>
  <div><h4>Legal</h4><ul>
    <li><a href="privacy.html">Privacy Policy</a></li><li><a href="disclaimer.html">Disclaimer</a></li></ul></div>
</div>
<div class="wrap legal">© 2026 Mamta Media. All rights reserved. Made with ♥ in India</div></footer>`;

document.addEventListener("click", (e) => {
  if (e.target.closest("#themeBtn")) {
    const dark = root.dataset.theme === "dark" || (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  }
  const m = e.target.closest("#menuBtn");
  if (m) { const open = $("#nav").classList.toggle("open"); m.setAttribute("aria-expanded", open); }
});
// highlight current category in bar
if (page === "category") document.querySelectorAll(".catbar a").forEach((a) => {
  if (a.href.endsWith("cat=" + qs.get("cat"))) a.setAttribute("aria-current", "page");
});

// ---------- Card ----------
const card = (p, big) => `
<a class="card${big ? " big" : ""}" href="post.html?slug=${encodeURIComponent(p.slug)}">
  <span class="tag">${esc(catOf(p.cat).name)}</span>
  <span class="num"><small>jobs cut</small>−${fmtNum(p.count)}</span>
  <h3>${esc(p.title)}</h3>
  <p>${esc(p.summary)}</p>
  <span class="meta">${esc(p.company)}, ${fmtDate(p.date)}</span>
</a>`;

// ---------- Home ----------
if (page === "home") {
  const total = POSTS.reduce((s, p) => s + p.count, 0);
  $("#statJobs").textContent = fmtNum(total);
  $("#statStories").textContent = POSTS.length;
  $("#statCompanies").textContent = new Set(POSTS.map((p) => p.company)).size;

  const t = sorted.map((p) => `<a href="post.html?slug=${encodeURIComponent(p.slug)}"><b>${esc(p.company)}</b> −${fmtNum(p.count)}</a>`).join("");
  $("#ticker").innerHTML = `<div class="track">${t}${t}</div>`;

  $("#latest-grid").innerHTML = sorted.slice(0, 7).map((p, i) => card(p, i === 0)).join("");

  $("#cat-grid").innerHTML = CATEGORIES.map((c) => {
    const n = POSTS.filter((p) => p.cat === c.slug).length;
    return `<a class="catcard" href="category.html?cat=${c.slug}"><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p><span>${n} ${n === 1 ? "story" : "stories"} →</span></a>`;
  }).join("");

  const by = {};
  POSTS.forEach((p) => (by[p.company] = (by[p.company] || 0) + p.count));
  const top = Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = top[0] ? top[0][1] : 1;
  $("#bars").innerHTML = top.map(([c, n]) =>
    `<li><span class="bn">${esc(c)}</span><span class="meter"><i style="width:${Math.max(4, (n / max) * 100)}%"></i></span><b>−${fmtNum(n)}</b></li>`).join("");
}

// ---------- Category ----------
if (page === "category") {
  const slug = qs.get("cat");
  const c = CATEGORIES.find((x) => x.slug === slug);
  const box = $("#catContent");
  if (!c) {
    box.innerHTML = `<h1>Category nahi mili</h1><p><a href="index.html#categories">Saari categories dekho</a></p>`;
  } else {
    document.title = c.name + " layoffs | Mamta Media";
    const rows = sorted.filter((p) => p.cat === slug);
    const total = rows.reduce((s, p) => s + p.count, 0);
    box.innerHTML = `
      <p class="crumb"><a href="index.html">Home</a> / Categories / ${esc(c.name)}</p>
      <h1>${esc(c.name)}</h1><p class="lead">${esc(c.desc)}</p>
      <p class="mini"><b>${rows.length}</b> stories, <b>−${fmtNum(total)}</b> jobs cut</p>
      <div class="grid3">${rows.length ? rows.map((p) => card(p)).join("") : `<p class="empty">Is category mein abhi koi post nahi hai. <a href="index.html#latest">Latest news dekho</a>.</p>`}</div>`;
  }
}

// ---------- Post ----------
if (page === "post") {
  const p = POSTS.find((x) => x.slug === qs.get("slug"));
  const art = $("#article");
  if (!p) {
    art.innerHTML = `<h1>Post nahi mili</h1><p><a href="index.html">Homepage pe wapas jao</a></p>`;
  } else {
    const c = catOf(p.cat);
    document.title = p.title + " | Mamta Media";
    const rel = sorted.filter((x) => x.cat === p.cat && x.slug !== p.slug).slice(0, 3);
    const share = encodeURIComponent(p.title + " " + location.href);
    art.innerHTML = `
      <p class="crumb"><a href="index.html">Home</a> / <a href="category.html?cat=${c.slug}">${esc(c.name)}</a></p>
      <h1>${esc(p.title)}</h1>
      <p class="meta">${esc(p.company)}, ${fmtDate(p.date)}</p>
      <p class="big"><small>jobs cut</small>−${fmtNum(p.count)}</p>
      ${p.body.map((t) => `<p>${esc(t)}</p>`).join("")}
      ${p.source ? `<p class="src">Source: <a href="${esc(p.source)}" rel="noopener nofollow" target="_blank">${esc(p.source)}</a></p>` : ""}
      <p class="share"><a class="btn small" href="https://wa.me/?text=${share}" target="_blank" rel="noopener">WhatsApp pe share karo</a></p>
      ${rel.length ? `<h2 class="relh">Isi category ki aur news</h2><div class="grid3">${rel.map((x) => card(x)).join("")}</div>` : ""}`;
  }
}
