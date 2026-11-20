// js/topics-marquee.js: the moving "topics" section on the homepage.
// Rows speed up and tilt when you scroll, slow down when you hover,
// can be dragged with the mouse or a finger, and every topic opens its category page.
(function () {
  const box = document.getElementById("topic-marquee");
  if (!box || typeof CATEGORIES === "undefined") return;

  // ---------- EDIT: topics shown on the chips (name, category slug, icon) ----------
  const ROW1 = [
    ["AI Tools", "technology", "spark"], ["Smartphones", "technology", "phone"], ["Startups", "business", "rocket"],
    ["Personal Finance", "business", "coin"], ["Movies", "entertainment", "film"], ["Web Series", "entertainment", "play"],
    ["Home & Style", "lifestyle", "home"]
  ];
  const ROW2 = [
    ["Fitness", "health", "heart"], ["Mental Health", "health", "leaf"], ["Cricket", "sports", "ball"],
    ["Exams & Study", "education", "book"], ["Careers", "education", "brief"], ["Budget Travel", "travel", "plane"],
    ["Food & Recipes", "lifestyle", "cup"]
  ];
  // Big words in the middle row: [word, style]  ("" = solid, "o" = outline, "i" = blue)
  const BIG = [["Technology", ""], ["Business", "i"], ["Entertainment", "o"], ["Lifestyle", "i"], ["Health", ""], ["Sports", "o"], ["Education", "i"], ["Travel", ""]];

  const I = {
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 15l-3-3 3.5-5.5C12 3 17 2.5 21 3c.5 4-0 9-3.5 11.5L12 18z"/><circle cx="15" cy="9" r="1.5"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.6 0-2.7.8-2.7 2s1.1 1.7 2.7 2 2.7.8 2.7 2-1.1 2-2.7 2c-1.1 0-2-.4-2.5-1.2M12 6.5v11"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
    play: '<rect x="2.5" y="5" width="19" height="13" rx="2.5"/><path d="M10 9l5 2.5-5 2.5z"/><path d="M8 21h8"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    heart: '<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1z"/>',
    leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19l8-8"/>',
    ball: '<circle cx="12" cy="12" r="8.5"/><path d="M6 6.5c2 2.5 2 8.5 0 11M18 6.5c-2 2.5-2 8.5 0 11"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
    brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
    plane: '<path d="M21 15l-8-4V5a1.5 1.5 0 0 0-3 0v6l-8 4v2l8-2v4l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-4l8 2z"/>',
    cup: '<path d="M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3v3M12 3v3"/>'
  };

  // ---------- Styles (site colours, so dark mode works) ----------
  const css = `
  #topic-marquee{position:relative;padding:76px 0 60px;overflow:hidden;background:var(--bg)}
  #topic-marquee .tm-hd{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:30px}
  #topic-marquee .tm-ey{display:inline-block;font:700 12px/1 var(--body);letter-spacing:.16em;text-transform:uppercase;color:var(--blue);margin-bottom:12px}
  #topic-marquee h2{font:800 clamp(28px,3.4vw,44px)/1.08 var(--head);letter-spacing:-.02em;color:var(--ink);margin:0;max-width:640px}
  #topic-marquee h2 em{font-style:normal;color:var(--blue)}
  #topic-marquee .tm-side{color:var(--muted);font-size:15px;line-height:1.6;max-width:340px;margin:0}
  #topic-marquee .tm-side b{color:var(--ink)}
  #topic-marquee .tm-hint{display:inline-flex;align-items:center;gap:8px;margin-top:10px;font:600 13px var(--body);color:var(--blue)}
  #topic-marquee .tm-hint i{width:28px;height:16px;border:2px solid currentColor;border-radius:999px;position:relative}
  #topic-marquee .tm-hint i::after{content:"";position:absolute;top:3px;left:3px;width:6px;height:6px;border-radius:50%;background:currentColor;animation:tmHint 1.6s ease-in-out infinite}
  @keyframes tmHint{50%{transform:translateX(10px)}}
  #topic-marquee .tm-rows{cursor:grab;touch-action:pan-y;user-select:none;-webkit-user-select:none;
    -webkit-mask:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
  #topic-marquee .tm-rows.drag{cursor:grabbing}
  #topic-marquee .tm-row{display:flex;width:max-content;gap:14px;padding:6px 0;margin-bottom:10px;will-change:transform}
  #topic-marquee .tm-chip{flex:0 0 auto;display:inline-flex;align-items:center;gap:12px;padding:14px 26px 14px 16px;border-radius:999px;font:600 clamp(15px,1.5vw,18px) var(--head);letter-spacing:-.01em;
    background:var(--surface);color:var(--ink);border:1px solid var(--line);box-shadow:0 6px 18px rgba(10,42,122,.07);text-decoration:none;white-space:nowrap;
    transition:transform .3s cubic-bezier(.2,.8,.2,1),background .3s,color .3s,box-shadow .3s,border-color .3s}
  #topic-marquee .tm-chip .ic{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--tint);color:var(--blue);flex:0 0 auto;transition:background .3s,color .3s,transform .4s}
  #topic-marquee .tm-chip .ic svg{width:16px;height:16px}
  #topic-marquee .tm-chip small{font:600 11px var(--body);letter-spacing:.08em;text-transform:uppercase;color:var(--muted);transition:color .3s}
  #topic-marquee .tm-chip.b{background:linear-gradient(180deg,#2a66f0,#1046c9);color:#fff;border-color:transparent;box-shadow:0 10px 24px rgba(20,86,232,.28)}
  #topic-marquee .tm-chip.b .ic{background:rgba(255,255,255,.18);color:#fff} #topic-marquee .tm-chip.b small{color:#cfe0ff}
  #topic-marquee .tm-chip.k{background:#0a1733;color:#fff;border-color:rgba(127,176,255,.25)}
  #topic-marquee .tm-chip.k .ic{background:rgba(255,255,255,.12);color:#7fe0ff} #topic-marquee .tm-chip.k small{color:#9fb2dc}
  #topic-marquee .tm-chip:hover{transform:translateY(-4px) scale(1.04);background:var(--blue);color:#fff;border-color:var(--blue);box-shadow:0 14px 30px rgba(20,86,232,.32)}
  #topic-marquee .tm-chip:hover .ic{background:rgba(255,255,255,.2);color:#fff;transform:rotate(-12deg) scale(1.1)}
  #topic-marquee .tm-chip:hover small{color:#dbe7ff}
  #topic-marquee .tm-big{overflow:visible;padding:8px 0 20px;margin:6px 0 12px}
  #topic-marquee .tm-bt{display:flex;width:max-content;align-items:center;gap:34px;white-space:nowrap;will-change:transform}
  #topic-marquee .tm-bt a{font:800 clamp(52px,8.4vw,120px)/1 var(--head);letter-spacing:-.04em;color:var(--ink);text-decoration:none;transition:color .25s,-webkit-text-stroke-color .25s}
  #topic-marquee .tm-bt a.o{color:transparent;-webkit-text-stroke:2px var(--ink)}
  #topic-marquee .tm-bt a.i{color:var(--blue)}
  #topic-marquee .tm-bt a:hover{color:var(--blue);-webkit-text-stroke-color:var(--blue)}
  #topic-marquee .tm-bt a.o:hover{color:transparent}
  #topic-marquee .tm-dot{width:22px;height:22px;flex:0 0 auto;border-radius:50%;background:var(--blue);box-shadow:0 0 0 7px var(--tint)}
  #topic-marquee .tm-dot.k{background:#7fe0ff}
  #topic-marquee .tm-cur{position:absolute;left:0;top:0;width:76px;height:76px;margin:-38px 0 0 -38px;border-radius:50%;background:var(--ink);color:var(--bg);font:700 13px var(--head);
    display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:5;transform:scale(0);transition:transform .25s cubic-bezier(.2,.8,.2,1);box-shadow:0 12px 30px rgba(10,23,51,.35)}
  #topic-marquee .tm-cur.on{transform:scale(1)}
  @media (hover:none){#topic-marquee .tm-cur{display:none}}
  @media (max-width:760px){#topic-marquee .tm-hd{flex-direction:column;align-items:flex-start}#topic-marquee .tm-dot{width:14px;height:14px;box-shadow:0 0 0 5px var(--tint)}#topic-marquee .tm-bt{gap:22px}#topic-marquee .tm-bt a.o{-webkit-text-stroke-width:1.5px}}
  @media (max-width:560px){#topic-marquee{padding:56px 0 40px}#topic-marquee .tm-chip{padding:11px 18px 11px 11px;font-size:15px}#topic-marquee .tm-chip .ic{width:28px;height:28px}#topic-marquee .tm-chip small{display:none}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---------- Markup ----------
  const nameOf = (slug) => (CATEGORIES.find((c) => c.slug === slug) || { name: slug }).name;
  const STY = ["", "b", "", "k", "", "b", ""];
  const chips = (arr, off) => { const h = arr.map(([t, cat, ic], i) =>
    `<a class="tm-chip ${STY[(i + off) % STY.length]}" href="/category/${cat}" draggable="false"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[ic]}</svg></span>${t}<small>${nameOf(cat)}</small></a>`).join("");
    return h + h + h + h; };
  const slugOf = (name) => (CATEGORIES.find((c) => c.name === name) || { slug: name.toLowerCase() }).slug;
  const bigOnce = BIG.map(([t, c], i) => `<a class="${c}" href="/category/${slugOf(t)}" draggable="false">${t}</a><i class="tm-dot ${i % 2 ? "k" : ""}"></i>`).join("");

  box.innerHTML = `
  <div class="wrap tm-hd">
    <div><span class="tm-ey">Topics we cover</span><h2>Everything worth reading, <em>under one roof.</em></h2></div>
    <div><p class="tm-side"><b>${CATEGORIES.length} sections</b>, dozens of topics and one team of writers. Scroll, drag or tap a topic to start reading.</p>
    <span class="tm-hint"><i></i>Drag to explore</span></div>
  </div>
  <div class="tm-rows" id="tmRows">
    <div class="tm-row" id="tm1">${chips(ROW1, 0)}</div>
    <div class="tm-big"><div class="tm-bt" id="tmBig">${bigOnce + bigOnce + bigOnce}</div></div>
    <div class="tm-row" id="tm2">${chips(ROW2, 3)}</div>
  </div>
  <div class="tm-cur" id="tmCur" aria-hidden="true">Read &rarr;</div>`;

  // ---------- Motion: auto-scroll + scroll speed + drag ----------
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rows = document.getElementById("tmRows");
  const tracks = [
    { el: document.getElementById("tm1"), dir: -1, sp: 0.45, copies: 4 },
    { el: document.getElementById("tmBig"), dir: 1, sp: 0.6, copies: 3 },
    { el: document.getElementById("tm2"), dir: -1, sp: 0.38, copies: 4 }
  ];
  tracks.forEach((t) => { t.x = 0; t.half = 0; });
  const measure = () => tracks.forEach((t) => (t.half = t.el.scrollWidth / t.copies));
  measure(); addEventListener("resize", measure); addEventListener("load", measure);
  if (document.fonts) document.fonts.ready.then(measure);

  let vel = 0, lastY = scrollY, sign = 1, hover = false, visible = true;
  const wrapX = (t) => { if (!t.half) return; t.x %= t.half; if (t.x > 0) t.x -= t.half; };
  rows.addEventListener("mouseenter", () => (hover = true));
  rows.addEventListener("mouseleave", () => (hover = false));
  if ("IntersectionObserver" in window) new IntersectionObserver((es) => (visible = es[0].isIntersecting)).observe(box);
  addEventListener("scroll", () => { const d = scrollY - lastY; lastY = scrollY; vel += d * 0.06; if (Math.abs(d) > 1) sign = d > 0 ? 1 : -1; }, { passive: true });

  // Drag with mouse or finger (a tiny move still counts as a click)
  let drag = null, moved = 0;
  rows.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, id: e.pointerId }; moved = 0; });
  addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x; drag.x = e.clientX; moved += Math.abs(dx);
    if (moved > 6) rows.classList.add("drag");
    tracks.forEach((t) => { t.x += dx * (t.dir === 1 ? -1 : 1); wrapX(t); });
    vel = Math.max(-25, Math.min(25, dx * 0.5));
  });
  const endDrag = () => { drag = null; setTimeout(() => rows.classList.remove("drag"), 0); };
  addEventListener("pointerup", endDrag); addEventListener("pointercancel", endDrag);
  rows.addEventListener("click", (e) => { if (moved > 6) { e.preventDefault(); moved = 0; } }, true);

  // "Read →" bubble that follows the mouse over a topic
  const cur = document.getElementById("tmCur");
  box.addEventListener("mousemove", (e) => {
    const r = box.getBoundingClientRect();
    cur.style.left = e.clientX - r.left + "px"; cur.style.top = e.clientY - r.top + "px";
    cur.classList.toggle("on", !!e.target.closest(".tm-chip, .tm-bt a") && !drag);
  });
  box.addEventListener("mouseleave", () => cur.classList.remove("on"));

  let last = performance.now();
  (function loop(now) {
    const dt = Math.min(48, now - last); last = now;
    vel *= 0.92;
    if (visible) {
      const base = reduce ? 0 : drag ? 0 : hover ? 0.15 : 1;
      tracks.forEach((t) => {
        if (!drag) { t.x -= (t.sp * base + (reduce ? 0 : Math.abs(vel) * 0.9)) * dt * 0.12 * sign * t.dir * -1; wrapX(t); }
        const skew = reduce ? 0 : Math.max(-8, Math.min(8, vel * 0.6));
        t.el.style.transform = `translate3d(${t.x}px,0,0) skewX(${skew.toFixed(2)}deg)`;
      });
    }
    requestAnimationFrame(loop);
  })(last);
})();
