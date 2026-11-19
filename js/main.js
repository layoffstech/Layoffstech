const $ = (s, r = document) => r.querySelector(s);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const catOf = (slug) => CATEGORIES.find((c) => c.slug === slug) || { slug, name: slug, icon: "📰", c1: "#2a4bff", c2: "#12206b", desc: "" };
// Newest first (by date). If two posts share a date, the one higher in posts.js wins.
const sorted = POSTS.map((p, i) => ({ p, i }))
  .sort((a, b) => new Date(b.p.date) - new Date(a.p.date) || a.i - b.i).map((x) => x.p);
const readTime = (p) => Math.max(1, Math.round(p.body.join(" ").split(/\s+/).length / 200));
const page = document.body.dataset.page;
const qs = new URLSearchParams(location.search);
const url = (p) => `post.html?slug=${encodeURIComponent(p.slug)}`;
const repeatTo = (arr, min) => { let out = []; do { out = out.concat(arr); } while (out.length < min); return out; };

// ---------- Theme ----------
const root = document.documentElement;
try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}

// ---------- Building blocks ----------
const cover = (p, cls = "") => {
  const c = catOf(p.cat);
  return `<span class="cover ${cls}" style="--c1:${c.c1};--c2:${c.c2}">` +
    (p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy">` : `<b class="glyph" aria-hidden="true">${c.icon}</b>`) + `</span>`;
};
const tag = (p) => { const c = catOf(p.cat); return `<span class="tag" style="--c1:${c.c1}">${esc(c.name)}</span>`; };
const meta = (p) => `<span class="meta">${fmtDate(p.date)} · ${readTime(p)} min read</span>`;
const card = (p, cls = "") => `
<a class="card ${cls}" href="${url(p)}">${cover(p)}
  <span class="cbody">${tag(p)}<h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p>${meta(p)}</span>
</a>`;
const mini = (p) => `
<a class="mini" href="${url(p)}">${cover(p)}
  <span>${tag(p)}<h4>${esc(p.title)}</h4>${meta(p)}</span>
</a>`;

// ---------- Header + Footer ----------
$("#hdr").innerHTML = `
<header class="site">
  <div class="wrap bar">
    <a class="logo" href="index.html" aria-label="Mamta Media home"><i class="mark">M</i><span>Mamta <b>Media</b></span></a>
    <nav id="nav" aria-label="Main">
      <a href="index.html#latest">Latest</a>
      <a href="index.html#trending">Trending</a>
      <a href="index.html#categories">Categories</a>
      <a href="index.html#stories">All Stories</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
    </nav>
    <div class="actions">
      <button id="themeBtn" class="icon" type="button" aria-label="Toggle dark mode">◐</button>
      <a class="btn small" href="index.html#subscribe">Subscribe →</a>
      <button id="menuBtn" class="icon menu" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
    </div>
  </div>
  <div class="catbar"><div class="wrap">
    ${CATEGORIES.map((c) => `<a href="category.html?cat=${c.slug}" style="--c1:${c.c1}">${c.icon} ${esc(c.name)}</a>`).join("")}
  </div></div>
</header>`;

$("#ftr").innerHTML = `
<section class="cta-band"><div class="wrap">
  <h2>Never miss a <em>story.</em></h2>
  <p>Get the best of Mamta Media in your inbox. No spam, ever.</p>
  <a class="btn" href="index.html#subscribe">Subscribe now →</a>
</div></section>
<footer class="site"><div class="wrap grid">
  <div><a class="logo" href="index.html"><i class="mark">M</i><span>Mamta <b>Media</b></span></a>
    <p>Stories on technology, business, entertainment, lifestyle, health, sports, education and travel.</p></div>
  <div><h4>Categories</h4><ul>${CATEGORIES.map((c) => `<li><a href="category.html?cat=${c.slug}">${esc(c.name)}</a></li>`).join("")}</ul></div>
  <div><h4>Explore</h4><ul>
    <li><a href="index.html#latest">Latest posts</a></li><li><a href="index.html#trending">Trending</a></li>
    <li><a href="index.html#stories">All stories</a></li><li><a href="about.html">About us</a></li><li><a href="contact.html">Contact</a></li></ul></div>
  <div><h4>Legal</h4><ul><li><a href="privacy.html">Privacy Policy</a></li><li><a href="disclaimer.html">Disclaimer</a></li></ul></div>
</div>
<div class="wrap bigword" aria-hidden="true">Mamta Media</div>
<div class="wrap legal">© 2026 Mamta Media. All rights reserved. Made with ♥ in India</div></footer>`;

document.addEventListener("click", (e) => {
  if (e.target.closest("#themeBtn")) {
    const dark = root.dataset.theme === "dark" || (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  }
  const m = e.target.closest("#menuBtn");
  if (m) { const open = $("#nav").classList.toggle("open"); m.setAttribute("aria-expanded", open); }
  if (e.target.closest("#copyBtn")) {
    const b = $("#copyBtn");
    try { navigator.clipboard.writeText(location.href); b.textContent = "Copied!"; } catch (err) { b.textContent = "Copy failed"; }
  }
});
if (page === "category") document.querySelectorAll(".catbar a").forEach((a) => {
  if (a.href.endsWith("cat=" + qs.get("cat"))) a.setAttribute("aria-current", "page");
});

// ---------- Home ----------
if (page === "home") {
  // 1. Latest posts: newest post is the big feature, next four on the right
  const [first, ...rest] = sorted;
  $("#latest-feature").innerHTML = first ? `
    <a class="card feature" href="${url(first)}"><span class="sticker">Latest</span>${cover(first, "tall")}
      <span class="cbody">${tag(first)}<h3>${esc(first.title)}</h3><p>${esc(first.summary)}</p>${meta(first)}
      <span class="btn small">Read story →</span></span></a>` : `<p class="empty">No posts yet.</p>`;
  $("#latest-side").innerHTML = rest.slice(0, 4).map(mini).join("");

  // 2. Top ticker (auto-scrolling headlines)
  const tk = repeatTo(sorted.map((p) => `<a href="${url(p)}"><span>${catOf(p.cat).icon}</span> ${esc(p.title)}</a>`), 8).join("");
  $("#ticker").innerHTML = `<div class="track" style="animation-duration:${Math.max(30, sorted.length * 6)}s">${tk}${tk}</div>`;

  // 3. Trending rail (auto-scrolling cards, pauses on hover)
  const rail = repeatTo(sorted.map((p) => card(p, "sm")), 6).join("");
  $("#rail").innerHTML = `<div class="track" style="animation-duration:${Math.max(40, sorted.length * 9)}s">${rail}${rail}</div>`;

  // 4. Categories
  $("#cat-grid").innerHTML = CATEGORIES.map((c) => {
    const n = POSTS.filter((p) => p.cat === c.slug).length;
    const dark = c.slug === "sports";
    return `<a class="tile" href="category.html?cat=${c.slug}" style="--c1:${c.c1};--c2:${c.c2};color:${dark ? "#17120e" : "#fff"}">
      <b>${c.icon}</b><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p><span>${n} ${n === 1 ? "story" : "stories"} →</span></a>`;
  }).join("");

  // 5. All stories with search + filter + load more
  let cat = "all", q = "", shown = 9;
  $("#chips").innerHTML = `<button class="chip" data-c="all" aria-pressed="true">All</button>` +
    CATEGORIES.map((c) => `<button class="chip" data-c="${c.slug}" aria-pressed="false">${c.icon} ${esc(c.name)}</button>`).join("");
  const draw = () => {
    const rows = sorted.filter((p) => (cat === "all" || p.cat === cat) && (p.title + p.summary).toLowerCase().includes(q));
    $("#stories-grid").innerHTML = rows.length ? rows.slice(0, shown).map((p) => card(p)).join("") : `<p class="empty">No stories found. Try another search or category.</p>`;
    $("#more").hidden = rows.length <= shown;
  };
  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    cat = b.dataset.c; shown = 9;
    document.querySelectorAll("#chips .chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
    draw();
  });
  $("#q").addEventListener("input", (e) => { q = e.target.value.toLowerCase().trim(); shown = 9; draw(); });
  $("#more").addEventListener("click", () => { shown += 9; draw(); });
  draw();
}

// ---------- Category ----------
if (page === "category") {
  const c = CATEGORIES.find((x) => x.slug === qs.get("cat"));
  const box = $("#catContent");
  if (!c) {
    box.innerHTML = `<div class="wrap inner"><h1>Category not found</h1><p><a href="index.html#categories">Browse all categories</a></p></div>`;
  } else {
    document.title = c.name + " | Mamta Media";
    const rows = sorted.filter((p) => p.cat === c.slug);
    box.innerHTML = `
      <div class="catband" style="--c1:${c.c1};--c2:${c.c2};color:${c.slug === "sports" ? "#17120e" : "#fff"}"><div class="wrap">
        <p class="crumb"><a href="index.html">Home</a> / Categories / ${esc(c.name)}</p>
        <h1><span aria-hidden="true">${c.icon}</span> ${esc(c.name)}</h1><p class="lead">${esc(c.desc)}</p>
        <p class="count">${rows.length} ${rows.length === 1 ? "story" : "stories"}</p></div></div>
      <div class="wrap inner"><div class="grid3">${rows.length ? rows.map((p) => card(p)).join("") : `<p class="empty">No stories in this category yet. <a href="index.html#latest">See the latest posts</a>.</p>`}</div></div>`;
  }
}

// ---------- Post ----------
if (page === "post") {
  const p = POSTS.find((x) => x.slug === qs.get("slug"));
  const art = $("#article");
  if (!p) {
    art.innerHTML = `<div class="wrap inner"><h1>Post not found</h1><p><a href="index.html">Back to home</a></p></div>`;
  } else {
    const c = catOf(p.cat);
    document.title = p.title + " | Mamta Media";
    const rel = sorted.filter((x) => x.cat === p.cat && x.slug !== p.slug).slice(0, 3);
    const more = rel.length ? rel : sorted.filter((x) => x.slug !== p.slug).slice(0, 3);
    const body = p.body.map((t) => t.startsWith("## ") ? `<h2>${esc(t.slice(3))}</h2>` : `<p>${esc(t)}</p>`).join("");
    const share = encodeURIComponent(p.title + " " + location.href);
    art.innerHTML = `
      ${cover(p, "hero")}
      <div class="wrap inner post">
        <p class="crumb"><a href="index.html">Home</a> / <a href="category.html?cat=${c.slug}">${esc(c.name)}</a></p>
        <h1>${esc(p.title)}</h1>
        <p class="byline">By <b>${esc(p.author || "Mamta Media Team")}</b> · ${fmtDate(p.date)} · ${readTime(p)} min read</p>
        <p class="lead">${esc(p.summary)}</p>
        <div class="body">${body}</div>
        <p class="share">Share:
          <a class="btn small" href="https://wa.me/?text=${share}" target="_blank" rel="noopener">WhatsApp</a>
          <a class="btn small" href="https://twitter.com/intent/tweet?text=${share}" target="_blank" rel="noopener">X</a>
          <button class="btn small" id="copyBtn" type="button">Copy link</button></p>
      </div>
      <div class="wrap inner"><h2 class="relh">${rel.length ? "More in " + esc(c.name) : "Keep reading"}</h2><div class="grid3">${more.map((x) => card(x)).join("")}</div></div>`;
  }
}
