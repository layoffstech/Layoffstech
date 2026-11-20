const $ = (s, r = document) => r.querySelector(s);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const catOf = (slug) => CATEGORIES.find((c) => c.slug === slug) || { slug, name: slug, desc: "" };
// Newest first (by date). If two posts share a date, the one higher in posts.js wins.
const sorted = POSTS.map((p, i) => ({ p, i }))
  .sort((a, b) => new Date(b.p.date) - new Date(a.p.date) || a.i - b.i).map((x) => x.p);
const readTime = (p) => Math.max(1, Math.round(p.body.join(" ").split(/\s+/).length / 200));
const page = document.body.dataset.page;
const postUrl = (p) => `/posts/${p.slug}`;
const catUrl = (c) => `/category/${c.slug}`;
const img = (p) => p.image || `/images/cat-${p.cat}.svg`;
const repeatTo = (arr, min) => { if (!arr.length) return []; let out = []; do { out = out.concat(arr); } while (out.length < min); return out; };

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

// ---------- Header ----------
// Floating glass header: shrinks on scroll, hides when you scroll down, comes back when you scroll up.
const NAV = [["Latest", "/#latest", "latest"], ["Trending", "/#trending", "trending"], ["All Stories", "/#stories", "stories"], ["About", "/about", "about"], ["Contact", "/contact", "contact"]];
const navLink = ([t, h, s]) => `<a href="${h}" data-s="${s}"${page === s ? ' class="act" aria-current="page"' : ""}>${t}</a>`;
const megaItem = (c) => `<a class="mh-cat" href="${catUrl(c)}"><img src="/images/cat-${c.slug}.svg" alt="" width="64" height="40" loading="lazy"><span><b>${esc(c.name)}</b><small>${esc(c.desc)}</small></span></a>`;
$("#hdr").innerHTML = `
<header class="mh" id="mh">
  <i class="mh-pg" id="mhPg"></i>
  <div class="mh-in">
    <a class="logo" href="/" aria-label="Mamta Media home"><img src="/images/logo-icon.svg" width="38" height="38" alt=""><span>Mamta <b>Media</b></span></a>
    <nav class="mh-nav" id="mhNav" aria-label="Main">
      <i class="mh-ind" id="mhInd"></i>
      ${navLink(NAV[0])}${navLink(NAV[1])}
      <div class="mh-dd" id="mhDd">
        <button class="mh-topics" id="mhTopics" type="button" aria-expanded="false" aria-controls="mhMega">Topics <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
        <div class="mh-mega" id="mhMega">
          <div class="mh-grid">${CATEGORIES.map(megaItem).join("")}</div>
          <a class="mh-all" href="/#categories">Browse all topics <span>&rarr;</span></a>
        </div>
      </div>
      ${NAV.slice(2).map(navLink).join("")}
    </nav>
    <div class="mh-rt">
      <button id="themeBtn" class="mh-ic" type="button" aria-label="Toggle dark mode"><svg class="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg class="moon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
      <a class="mh-cta" href="/#subscribe">Subscribe <span class="ar">&rarr;</span></a>
      <button class="mh-bg" id="mhBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mhMenu"><span></span></button>
    </div>
  </div>
  <div class="mh-mn" id="mhMenu">
    ${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join("")}
    <p class="mh-mlabel">Topics</p>
    <div class="mh-chips">${CATEGORIES.map((c) => `<a href="${catUrl(c)}">${esc(c.name)}</a>`).join("")}</div>
    <a class="mh-cta" href="/#subscribe">Subscribe free <span class="ar">&rarr;</span></a>
  </div>
</header>`;

(() => {
  const h = $("#mh"), btn = $("#mhBtn"), nav = $("#mhNav"), ind = $("#mhInd"), pg = $("#mhPg"), dd = $("#mhDd"), tp = $("#mhTopics");
  // Links to homepage sections scroll smoothly when you are already on the homepage
  if (page === "home") h.querySelectorAll('a[href^="/#"]').forEach((a) => a.setAttribute("href", a.getAttribute("href").slice(1)));
  // Shrink on scroll, hide on scroll down, show on scroll up, and fill the progress line
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    h.classList.toggle("solid", y > 20 || h.classList.contains("open"));
    if (!h.classList.contains("open") && !dd.classList.contains("open")) {
      if (y > lastY + 6 && y > 320) h.classList.add("hide");
      else if (y < lastY - 6 || y < 320) h.classList.remove("hide");
    }
    if (Math.abs(y - lastY) > 6) lastY = y;
    pg.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  // Mobile menu
  const setOpen = (o) => { h.classList.toggle("open", o); btn.setAttribute("aria-expanded", o); btn.setAttribute("aria-label", o ? "Close menu" : "Open menu"); onScroll(); };
  btn.addEventListener("click", () => setOpen(!h.classList.contains("open")));
  h.querySelectorAll(".mh-mn a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  // Topics dropdown: opens on hover (desktop) or click/tap
  const setDd = (o) => { dd.classList.toggle("open", o); tp.setAttribute("aria-expanded", o); };
  tp.addEventListener("click", () => setDd(!dd.classList.contains("open")));
  dd.addEventListener("mouseenter", () => setDd(true));
  dd.addEventListener("mouseleave", () => setDd(false));
  document.addEventListener("click", (e) => { if (!dd.contains(e.target)) setDd(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { setDd(false); setOpen(false); } });
  // Sliding pill behind the menu links
  const moveTo = (a) => { if (!a) { ind.style.opacity = 0; return; } ind.style.left = a.offsetLeft + "px"; ind.style.width = a.offsetWidth + "px"; ind.style.opacity = 1; };
  const toActive = () => moveTo(nav.querySelector("a.act"));
  [...nav.querySelectorAll(":scope > a"), tp].forEach((a) => { a.addEventListener("mouseenter", () => moveTo(a)); a.addEventListener("focus", () => moveTo(a)); });
  nav.addEventListener("mouseleave", toActive);
  addEventListener("resize", toActive);
  addEventListener("load", toActive); toActive();
  // On the homepage, highlight the menu link of the section you are reading
  if (page === "home") {
    const ids = ["latest", "trending", "stories"];
    const spy = () => {
      const mid = innerHeight * 0.45; let cur = null;
      ids.forEach((id) => { const el = document.getElementById(id); if (!el || !el.offsetHeight) return;
        const r = el.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) cur = id; });
      nav.querySelectorAll("a[data-s]").forEach((a) => a.classList.toggle("act", a.dataset.s === cur));
      if (!nav.matches(":hover")) toActive();
    };
    addEventListener("scroll", spy, { passive: true }); addEventListener("load", spy); setTimeout(spy, 300);
  }
})();

// ---------- Footer ----------
// SOCIAL LINKS: paste your profile links here. Empty ones stay hidden.
const SOCIAL = {
  instagram: "",   // e.g. "https://instagram.com/mamtamedia"
  facebook: "",    // e.g. "https://facebook.com/mamtamedia"
  youtube: "",     // e.g. "https://youtube.com/@mamtamedia"
  x: ""            // e.g. "https://x.com/mamtamedia"
};
const CONTACT_EMAIL = "mamtamedia@gmail.com";

const ICONS = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8.5V6.8c0-.8.5-1 .9-1H17V2.1L14.1 2C10.9 2 10.2 4.4 10.2 6v2.5H8V12h2.2v10H14V12h2.8l.4-3.5H14z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.75 15.02V8.98L15.5 12z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.9 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z"/></svg>'
};
const socialHTML = Object.keys(SOCIAL).filter((k) => SOCIAL[k]).map((k) =>
  `<a href="${esc(SOCIAL[k])}" target="_blank" rel="noopener" aria-label="${k}">${ICONS[k]}</a>`).join("");

const wordHTML = (word, offset) => `<span class="w">${[...word].map((ch, i) => `<span class="l" style="--i:${offset + i}">${ch}</span>`).join("")}</span>`;
const mq = CATEGORIES.map((c) => `<a href="${catUrl(c)}">${esc(c.name)}</a>`).join("");
const PILL_STYLES = [["y", "4%", "6%", "-6deg"], ["wh", "50%", "0", "5deg"], ["k", "22%", "38%", "4deg"], ["gr", "60%", "46%", "-5deg"], ["wh", "2%", "74%", "3deg"], ["y", "46%", "80%", "-4deg"]];
const pills = CATEGORIES.slice(0, 6).map((c, i) => { const [cl, l, t, r] = PILL_STYLES[i];
  return `<a class="${cl}" href="${catUrl(c)}" style="left:${l};top:${t};--r:${r};animation-delay:${-i * 0.9}s">${esc(c.name)}</a>`; }).join("");

$("#ftr").innerHTML = `
<footer class="site mf" id="mf">
  <div class="mf-dots" aria-hidden="true"></div><div class="mf-spot" aria-hidden="true"></div>
  <div class="f-marquee" aria-label="Categories"><div class="track">${mq}${mq}${mq}${mq}</div></div>
  <div class="wrap mf-in">
    <div class="mf-cta">
      <div>
        <span class="mf-ey">Free newsletter</span>
        <h2>Stories worth your time, <em>straight to your inbox.</em></h2>
        <p>Get our best articles on technology, money, health, travel and more. One friendly email, no spam, ever.</p>
        <div class="mf-bt"><a class="mf-b1" href="/#subscribe">Subscribe free &rarr;</a><a class="mf-b2" href="/contact">Write for us</a></div>
      </div>
      <div class="mf-orb" aria-hidden="true">${pills}</div>
    </div>

    <div class="mf-cols">
      <div>
        <a class="logo" href="/"><img src="/images/logo-icon.svg" width="40" height="40" alt=""><span>Mamta <b>Media</b></span></a>
        <p class="mf-tag">Genuine, easy-to-read stories on technology, business, entertainment, lifestyle, health, sports, education and travel.</p>
        ${socialHTML ? `<div class="mf-soc">${socialHTML}</div>` : ""}
      </div>
      <div><h4>Categories</h4><ul>${CATEGORIES.map((c) => `<li><a href="${catUrl(c)}">${esc(c.name)}</a></li>`).join("")}</ul></div>
      <div><h4>Explore</h4><ul>
        <li><a href="/#latest">Latest posts</a></li><li><a href="/#trending">Trending</a></li><li><a href="/#stories">All stories</a></li>
        <li><a href="/about">About us</a></li><li><a href="/privacy">Privacy Policy</a></li><li><a href="/disclaimer">Disclaimer</a></li></ul></div>
      <div class="mf-ct">
        <h4>Get in touch</h4>
        <a href="mailto:${CONTACT_EMAIL}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>${CONTACT_EMAIL}</a>
        <a href="/contact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Send us a message</a>
        <a href="/contact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>Suggest a story idea</a>
        <span class="mf-open"><i></i>Publishing across 8 topics</span>
      </div>
    </div>
  </div>
  <div class="wrap f-word" id="fWord" aria-hidden="true">${wordHTML("Mamta", 0)}${wordHTML("Media", 7)}</div>
  <div class="mf-bar"><div class="wrap"><span>&copy; ${new Date().getFullYear()} Mamta Media. All rights reserved.</span><span>Made with <span class="mf-hrt">&hearts;</span> in India</span></div></div>
</footer>
<button class="mf-top" id="mfTop" type="button" aria-label="Back to top"><svg class="r" viewBox="0 0 50 50"><circle class="t" cx="25" cy="25" r="22"/><circle class="p" id="mfProg" cx="25" cy="25" r="22"/></svg><svg class="ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>`;

// Footer wordmark: letters rise from below, one after another, every time it scrolls into view
const fWord = $("#fWord");
if (fWord) {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) fWord.classList.add("in");
  else new IntersectionObserver((entries) => entries.forEach((en) => fWord.classList.toggle("in", en.isIntersecting)), { threshold: 0.45 }).observe(fWord);
}
// Footer spotlight follows the mouse
const mf = $("#mf");
if (mf) mf.addEventListener("mousemove", (e) => { const r = mf.getBoundingClientRect(); mf.style.setProperty("--mx", e.clientX - r.left + "px"); mf.style.setProperty("--my", e.clientY - r.top + "px"); });
// Back-to-top button with a ring that fills as you scroll
const mfTop = $("#mfTop"), mfProg = $("#mfProg");
if (mfTop) {
  const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? scrollY / h : 0;
    mfProg.style.strokeDashoffset = 138 - 138 * p; mfTop.classList.toggle("on", scrollY > innerHeight * 0.6); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  mfTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
}

document.addEventListener("click", (e) => {
  if (e.target.closest("#themeBtn")) {
    const dark = root.dataset.theme === "dark" || (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  }
  if (e.target.closest("#copyBtn")) {
    const b = $("#copyBtn");
    try { navigator.clipboard.writeText(location.href); b.textContent = "Copied!"; } catch (err) { b.textContent = "Copy failed"; }
  }
});
document.querySelectorAll(".mh-cat, .mh-chips a").forEach((a) => { if (a.pathname === location.pathname || a.pathname + ".html" === location.pathname) a.setAttribute("aria-current", "page"); });

// ---------- Forms (Web3Forms): fill in the key and the thank-you page automatically ----------
document.querySelectorAll('input[name="access_key"]').forEach((i) => (i.value = WEB3FORMS_KEY));
document.querySelectorAll('input[name="redirect"]').forEach((i) => (i.value = location.origin + "/thanks"));
document.addEventListener("submit", (e) => {
  if (e.target.matches('form[action*="web3forms"]') && WEB3FORMS_KEY.startsWith("PASTE_")) {
    e.preventDefault();
    alert("Form is not connected yet. Add your Web3Forms access key in js/posts.js (WEB3FORMS_KEY).");
  }
});

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
  if (!sorted.length) { $("#ticker").style.display = "none"; const rs = $("#rail").closest("section"); if (rs) rs.style.display = "none"; }

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
        <p class="crumb"><a href="/">Home</a> / ${esc(c.name)}</p>
        <h1>${esc(c.name)}</h1><p class="lead">${esc(c.desc)}</p>
        <p class="count">${rows.length} ${rows.length === 1 ? "story" : "stories"}</p></div></div>
      <div class="wrap inner"><div class="grid3">${rows.length ? rows.map((p) => card(p)).join("") : `<p class="empty">No stories in this category yet. <a href="/#latest">See the latest posts</a>.</p>`}</div></div>`;
  }
}

// ---------- Post ----------
if (page === "post") {
  const p = POSTS.find((x) => x.slug === document.body.dataset.slug);
  if (p) {
    const c = catOf(p.cat);
    const rel = sorted.filter((x) => x.cat === p.cat && x.slug !== p.slug).slice(0, 3);
    const more = rel.length ? rel : sorted.filter((x) => x.slug !== p.slug).slice(0, 3);
    const body = typeof renderBody === "function" ? renderBody(p.body)
      : p.body.map((t) => t.startsWith("## ") ? `<h2>${esc(t.slice(3))}</h2>` : `<p>${esc(t)}</p>`).join("");
    const share = encodeURIComponent(p.title + " " + location.href);
    $("#article").innerHTML = `
      ${cover(p, p.image ? "hero own" : "hero")}
      <div class="wrap inner post">
        <p class="crumb"><a href="/">Home</a> / <a href="${catUrl(c)}">${esc(c.name)}</a></p>
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
