const $ = (s, r = document) => r.querySelector(s);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const catOf = (slug) => CATEGORIES.find((c) => c.slug === slug) || { slug, name: slug, desc: "" };
// Newest first (by date). If two posts share a date, the one higher in posts.js wins.
const sorted = POSTS.map((p, i) => ({ p, i }))
  .sort((a, b) => new Date(b.p.date) - new Date(a.p.date) || a.i - b.i).map((x) => x.p);
const readTime = (p) => Math.max(1, Math.round(p.body.join(" ").split(/\s+/).length / 200));
const page = document.body.dataset.page;
const postUrl = (p) => `/posts/${p.slug}.html`;
const catUrl = (c) => `/category/${c.slug}.html`;
const img = (p) => p.image || `/images/cat-${p.cat}.svg`;
const repeatTo = (arr, min) => { let out = []; do { out = out.concat(arr); } while (out.length < min); return out; };

// ---------- Theme ----------
const root = document.documentElement;
try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}

// ---------- Building blocks ----------
const cover = (p, cls = "") => `<span class="cover ${cls}"><img src="${esc(img(p))}" alt="${esc(p.title)}" width="800" height="500" loading="lazy"></span>`;
const tag = (p) => `<span class="tag">${esc(catOf(p.cat).name)}</span>`;
const meta = (p) => `<span class="meta">${fmtDate(p.date)} · ${readTime(p)} min read</span>`;
const card = (p, cls = "") => `
<a class="card ${cls}" href="${postUrl(p)}">${cover(p)}
  <span class="cbody">${tag(p)}<h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p>${meta(p)}</span>
</a>`;
const mini = (p) => `
<a class="mini" href="${postUrl(p)}">${cover(p)}
  <span>${tag(p)}<h4>${esc(p.title)}</h4>${meta(p)}</span>
</a>`;

// ---------- Header + Footer ----------
$("#hdr").innerHTML = `
<header class="site">
  <div class="wrap bar">
    <a class="logo" href="/index.html" aria-label="Mamta Media home"><img src="/images/logo-icon.svg" width="40" height="40" alt=""><span>Mamta <b>Media</b></span></a>
    <nav id="nav" aria-label="Main">
      <a href="/index.html#latest">Latest</a>
      <a href="/index.html#trending">Trending</a>
      <a href="/index.html#categories">Categories</a>
      <a href="/index.html#stories">All Stories</a>
      <a href="/about.html">About</a>
      <a href="/contact.html">Contact</a>
    </nav>
    <div class="actions">
      <button id="themeBtn" class="icon" type="button" aria-label="Toggle dark mode"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg></button>
      <a class="btn small" href="/index.html#subscribe">Subscribe</a>
      <button id="menuBtn" class="icon menu" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
    </div>
  </div>
  <div class="catbar"><div class="wrap">
    ${CATEGORIES.map((c) => `<a href="${catUrl(c)}">${esc(c.name)}</a>`).join("")}
  </div></div>
</header>`;

$("#ftr").innerHTML = `
<section class="cta-band"><div class="wrap">
  <h2>Never miss a story.</h2>
  <p>Get the best of Mamta Media in your inbox. No spam, ever.</p>
  <a class="btn light" href="/index.html#subscribe">Subscribe now</a>
</div></section>
<footer class="site"><div class="wrap grid">
  <div><a class="logo" href="/index.html"><img src="/images/logo-icon.svg" width="40" height="40" alt=""><span>Mamta <b>Media</b></span></a>
    <p>Fresh stories on technology, business, entertainment, lifestyle, health, sports, education and travel.</p></div>
  <div><h4>Categories</h4><ul>${CATEGORIES.map((c) => `<li><a href="${catUrl(c)}">${esc(c.name)}</a></li>`).join("")}</ul></div>
  <div><h4>Explore</h4><ul>
    <li><a href="/index.html#latest">Latest posts</a></li><li><a href="/index.html#trending">Trending</a></li>
    <li><a href="/index.html#stories">All stories</a></li><li><a href="/about.html">About us</a></li><li><a href="/contact.html">Contact</a></li></ul></div>
  <div><h4>Legal</h4><ul><li><a href="/privacy.html">Privacy Policy</a></li><li><a href="/disclaimer.html">Disclaimer</a></li></ul></div>
</div>
<div class="wrap legal">© 2026 Mamta Media. All rights reserved.</div></footer>`;

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
document.querySelectorAll(".catbar a").forEach((a) => { if (a.pathname === location.pathname) a.setAttribute("aria-current", "page"); });

// ---------- Structured data (helps search engines) ----------
const addLD = (obj) => { const s = document.createElement("script"); s.type = "application/ld+json"; s.text = JSON.stringify(obj); document.head.appendChild(s); };
if (page === "home") {
  addLD({ "@context": "https://schema.org", "@type": "WebSite", name: "Mamta Media", url: location.origin + "/" });
  addLD({ "@context": "https://schema.org", "@type": "Organization", name: "Mamta Media", url: location.origin + "/", logo: location.origin + "/images/logo.png" });
  const qa = [...document.querySelectorAll("#faq details")].map((d) => ({ "@type": "Question", name: d.querySelector("summary").textContent,
    acceptedAnswer: { "@type": "Answer", text: d.querySelector("p").textContent } }));
  if (qa.length) addLD({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qa });
}

// ---------- Home ----------
if (page === "home") {
  const [first, ...rest] = sorted;
  $("#latest-feature").innerHTML = first ? `
    <a class="card feature" href="${postUrl(first)}"><span class="badge">Latest</span>${cover(first, "tall")}
      <span class="cbody">${tag(first)}<h3>${esc(first.title)}</h3><p>${esc(first.summary)}</p>${meta(first)}
      <span class="btn small">Read story</span></span></a>` : `<p class="empty">No posts yet.</p>`;
  $("#latest-side").innerHTML = rest.slice(0, 4).map(mini).join("");

  const tk = repeatTo(sorted.map((p) => `<a href="${postUrl(p)}">${esc(p.title)}</a>`), 8).join("");
  $("#ticker").innerHTML = `<div class="track" style="animation-duration:${Math.max(40, sorted.length * 8)}s">${tk}${tk}</div>`;

  const rail = repeatTo(sorted.map((p) => card(p, "sm")), 6).join("");
  $("#rail").innerHTML = `<div class="track" style="animation-duration:${Math.max(50, sorted.length * 10)}s">${rail}${rail}</div>`;

  $("#cat-grid").innerHTML = CATEGORIES.map((c) => {
    const n = POSTS.filter((p) => p.cat === c.slug).length;
    return `<a class="tile" href="${catUrl(c)}"><img src="/images/cat-${c.slug}.svg" alt="${esc(c.name)} stories" width="800" height="500" loading="lazy">
      <span><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p><span class="more">${n} ${n === 1 ? "story" : "stories"} →</span></span></a>`;
  }).join("");

  let cat = "all", q = "", shown = 9;
  $("#chips").innerHTML = `<button class="chip" data-c="all" aria-pressed="true">All</button>` +
    CATEGORIES.map((c) => `<button class="chip" data-c="${c.slug}" aria-pressed="false">${esc(c.name)}</button>`).join("");
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
  const c = CATEGORIES.find((x) => x.slug === document.body.dataset.cat);
  const box = $("#catContent");
  if (c) {
    const rows = sorted.filter((p) => p.cat === c.slug);
    box.innerHTML = `
      <div class="catband"><div class="wrap">
        <p class="crumb"><a href="/index.html">Home</a> / ${esc(c.name)}</p>
        <h1>${esc(c.name)}</h1><p class="lead">${esc(c.desc)}</p>
        <p class="count">${rows.length} ${rows.length === 1 ? "story" : "stories"}</p></div></div>
      <div class="wrap inner"><div class="grid3">${rows.length ? rows.map((p) => card(p)).join("") : `<p class="empty">No stories in this category yet. <a href="/index.html#latest">See the latest posts</a>.</p>`}</div></div>`;
  }
}

// ---------- Post ----------
if (page === "post") {
  const p = POSTS.find((x) => x.slug === document.body.dataset.slug);
  if (p) {
    const c = catOf(p.cat);
    const rel = sorted.filter((x) => x.cat === p.cat && x.slug !== p.slug).slice(0, 3);
    const more = rel.length ? rel : sorted.filter((x) => x.slug !== p.slug).slice(0, 3);
    const body = p.body.map((t) => t.startsWith("## ") ? `<h2>${esc(t.slice(3))}</h2>` : `<p>${esc(t)}</p>`).join("");
    const share = encodeURIComponent(p.title + " " + location.href);
    $("#article").innerHTML = `
      ${cover(p, "hero")}
      <div class="wrap inner post">
        <p class="crumb"><a href="/index.html">Home</a> / <a href="${catUrl(c)}">${esc(c.name)}</a></p>
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
