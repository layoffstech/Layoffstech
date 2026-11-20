// js/orbit.js: the "Explore topics" orbit section on the homepage.
// The 8 categories from posts.js circle around the Mamta Media logo.
// Hover or tap a topic to preview it; click it to open that category page.
(function () {
  const box = document.getElementById("orbit-section");
  if (!box || typeof CATEGORIES === "undefined") return;

  // ---------- Styles (uses the site's own colours, so dark mode works too) ----------
  const css = `
  #orbit-section{padding:80px 0 90px;overflow:hidden;background:var(--bg)}
  #orbit-section .os-grid{display:grid;grid-template-columns:.95fr 1.05fr;gap:48px;align-items:center}
  #orbit-section .os-eyebrow{display:inline-block;font:700 12px/1 var(--body);letter-spacing:.16em;text-transform:uppercase;color:var(--blue);margin-bottom:14px}
  #orbit-section h2{font-family:var(--head);font-weight:800;font-size:clamp(34px,4.4vw,56px);line-height:1.06;letter-spacing:-.02em;color:var(--ink);margin:0}
  #orbit-section h2 em{font-style:normal;color:var(--blue)}
  #orbit-section .os-lead{color:var(--muted);font-size:17px;line-height:1.6;margin:18px 0 26px;max-width:460px}
  #orbit-section .os-now{position:relative;display:block;background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:20px 22px;max-width:460px;box-shadow:var(--shadow);margin-bottom:26px;overflow:hidden;color:inherit;text-decoration:none;transition:transform .2s,border-color .2s}
  #orbit-section .os-now:hover{transform:translateY(-2px);border-color:var(--blue)}
  #orbit-section .os-row{display:flex;justify-content:space-between;align-items:center;font:700 11px/1 var(--body);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
  #orbit-section .os-count{color:var(--blue);background:var(--tint);padding:5px 10px;border-radius:999px;letter-spacing:.06em}
  #orbit-section .os-now h3{font-family:var(--head);font-weight:800;font-size:28px;line-height:1.1;margin:12px 0 0;color:var(--ink)}
  #orbit-section .os-now p{font-size:15px;color:var(--muted);margin:6px 0 0;min-height:46px;line-height:1.5}
  #orbit-section .os-go{display:inline-block;margin-top:10px;font-weight:600;font-size:14px;color:var(--blue)}
  #orbit-section .os-sw{transition:opacity .3s,transform .3s}
  #orbit-section .os-now.out .os-sw{opacity:0;transform:translateY(8px)}
  #orbit-section .os-pb{position:absolute;left:0;bottom:0;height:3px;width:0;background:var(--blue)}
  #orbit-section .os-btns{display:flex;flex-wrap:wrap;gap:12px}
  #orbit-section .os-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 24px;border-radius:999px;font-weight:600;font-size:15px;text-decoration:none;transition:transform .2s,box-shadow .2s,background .2s,color .2s}
  #orbit-section .os-btn:hover{transform:translateY(-2px)}
  #orbit-section .os-btn.pri{background:var(--blue);color:#fff;box-shadow:0 10px 26px rgba(20,86,232,.28)}
  #orbit-section .os-btn.out{background:var(--surface);color:var(--blue);border:1.5px solid var(--blue)}
  #orbit-section .os-btn.out:hover{background:var(--blue);color:#fff}
  #orbit-section .os-orbit{position:relative;aspect-ratio:1;width:100%;max-width:540px;margin-left:auto}
  #orbit-section .os-ring{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%}
  #orbit-section .os-ring.r0{width:76%;height:76%;background:radial-gradient(closest-side,rgba(20,86,232,.10),transparent)}
  #orbit-section .os-ring.r1{width:52%;height:52%;border:1px dashed var(--line)}
  #orbit-section .os-ring.r2{width:94%;height:94%;border:1px solid var(--line)}
  #orbit-section svg.os-lnk{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:1}
  #orbit-section svg.os-lnk line{stroke:var(--blue);stroke-width:1.5;stroke-dasharray:4 5;animation:osDash 1s linear infinite}
  #orbit-section svg.os-lnk circle{fill:var(--blue)}
  @keyframes osDash{to{stroke-dashoffset:-18}}
  #orbit-section .os-core{position:absolute;left:50%;top:50%;width:28%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:var(--surface);border:1px solid var(--line);box-shadow:0 20px 50px rgba(10,42,122,.16);display:flex;align-items:center;justify-content:center;z-index:2}
  #orbit-section .os-core::before,#orbit-section .os-core::after{content:"";position:absolute;inset:-1px;border-radius:50%;border:2px solid rgba(20,86,232,.35);animation:osPulse 3s ease-out infinite}
  #orbit-section .os-core::after{animation-delay:1.5s}
  @keyframes osPulse{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.9);opacity:0}}
  #orbit-section .os-core img{width:56%;height:auto}
  #orbit-section .os-pill{position:absolute;left:0;top:0;z-index:3;display:inline-flex;align-items:center;gap:8px;padding:9px 16px 9px 11px;border-radius:999px;font:600 14px/1 var(--body);white-space:nowrap;will-change:transform;background:var(--surface);color:var(--ink);border:1px solid var(--line);box-shadow:0 8px 20px rgba(10,42,122,.10);text-decoration:none;transition:background .3s,color .3s,box-shadow .3s,border-color .3s}
  #orbit-section .os-pill i{width:8px;height:8px;border-radius:50%;flex:0 0 auto}
  #orbit-section .os-pill.on{background:var(--blue);color:#fff;border-color:transparent;box-shadow:0 12px 28px rgba(20,86,232,.4);z-index:4}
  #orbit-section .os-pill.on i{background:#fff!important}
  @media (max-width:980px){#orbit-section .os-grid{grid-template-columns:1fr}#orbit-section .os-orbit{margin:10px auto 0}}
  @media (max-width:560px){#orbit-section{padding:56px 0 64px}#orbit-section .os-pill{font-size:11.5px;padding:6px 10px 6px 8px;gap:6px}#orbit-section .os-pill i{width:6px;height:6px}#orbit-section .os-now h3{font-size:24px}}
  @media (prefers-reduced-motion:reduce){#orbit-section *{animation:none!important}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---------- Content ----------
  const count = (slug) => (typeof POSTS !== "undefined" ? POSTS.filter((p) => p.cat === slug).length : 0);
  const DOTS = ["#1456e8", "#14b8a6", "#3b82f6", "#0ea5e9", "#6366f1", "#16a34a", "#f59e0b", "#ec4899"];
  box.innerHTML = `
  <div class="wrap os-grid">
    <div>
      <span class="os-eyebrow">Explore Mamta Media</span>
      <h2>Genuine stories on <em>every topic</em> you care about.</h2>
      <p class="os-lead">Eight sections, one trusted magazine. Our team of writers brings you clear, well-researched articles, from the latest tech to your next trip.</p>
      <a class="os-now" id="osNow" href="#"><div class="os-sw">
        <div class="os-row"><span>Now exploring</span><span class="os-count" id="osCount"></span></div>
        <h3 id="osName"></h3><p id="osTxt"></p><span class="os-go">Open section &rarr;</span>
      </div><i class="os-pb" id="osPb"></i></a>
      <div class="os-btns"><a class="os-btn pri" href="#categories">Explore all topics &rarr;</a><a class="os-btn out" href="/about">About us</a></div>
    </div>
    <div class="os-orbit" id="osOrbit" aria-label="Topics">
      <i class="os-ring r0"></i><i class="os-ring r1"></i><i class="os-ring r2"></i>
      <svg class="os-lnk" aria-hidden="true"><line id="osLnk"/><circle id="osDot" r="4"/></svg>
      <div class="os-core"><img src="/images/logo-icon.svg" alt="Mamta Media"></div>
    </div>
  </div>`;

  const $ = (id) => document.getElementById(id);
  const orbit = $("osOrbit"), lnk = $("osLnk"), dot = $("osDot"), now = $("osNow"), pb = $("osPb");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const RINGS = [{ r: 0.26, speed: 0.00011 }, { r: 0.47, speed: -0.00007 }];
  const cats = CATEGORIES.slice(0, 12);
  const perRing = [Math.ceil(cats.length / 2) - (cats.length > 6 ? 1 : 0)]; perRing[1] = cats.length - perRing[0];
  const seen = [0, 0];
  const pills = cats.map((c, i) => {
    const ri = i < perRing[0] ? 0 : 1;
    const el = document.createElement("a");
    el.className = "os-pill"; el.href = "/category/" + c.slug;
    el.innerHTML = `<i style="background:${DOTS[i % DOTS.length]}"></i>${c.name}`;
    orbit.appendChild(el);
    return { el, c, ring: RINGS[ri], a: (seen[ri]++ / perRing[ri]) * Math.PI * 2 + ri * 0.4 };
  });

  let act = 0, last = performance.now(), paused = false, visible = true;
  const DUR = 2800;
  function setAct(i) {
    act = (i + pills.length) % pills.length;
    pills.forEach((p, j) => p.el.classList.toggle("on", j === act));
    now.classList.add("out");
    setTimeout(() => {
      const c = pills[act].c, n = count(c.slug);
      $("osName").textContent = c.name; $("osTxt").textContent = c.desc;
      $("osCount").textContent = n === 0 ? "Coming soon" : n === 1 ? "1 story" : n + " stories";
      now.href = "/category/" + c.slug; now.classList.remove("out");
    }, 250);
    last = performance.now();
  }
  pills.forEach((p, i) => {
    p.el.addEventListener("mouseenter", () => { paused = true; setAct(i); });
    p.el.addEventListener("mouseleave", () => { paused = false; last = performance.now(); });
    p.el.addEventListener("focus", () => setAct(i));
  });
  now.addEventListener("mouseenter", () => (paused = true));
  now.addEventListener("mouseleave", () => { paused = false; last = performance.now(); });
  if ("IntersectionObserver" in window) new IntersectionObserver((es) => (visible = es[0].isIntersecting)).observe(orbit);
  setAct(0);

  let tAcc = 0, prev = performance.now();
  (function spin(t) {
    const dt = t - prev; prev = t;
    if (visible) {
      if (!paused && !reduce) tAcc += dt;
      const W = orbit.clientWidth, c = W / 2, k = W < 460 ? 0.86 : 1;
      pills.forEach((p) => {
        const a = p.a + tAcc * p.ring.speed;
        p.x = c + Math.cos(a) * W * p.ring.r * k; p.y = c + Math.sin(a) * W * p.ring.r * k;
        p.el.style.transform = `translate(${p.x - p.el.offsetWidth / 2}px,${p.y - p.el.offsetHeight / 2}px)`;
      });
      const ap = pills[act];
      if (ap && ap.x !== undefined) {
        lnk.setAttribute("x1", c); lnk.setAttribute("y1", c); lnk.setAttribute("x2", ap.x); lnk.setAttribute("y2", ap.y);
        dot.setAttribute("cx", ap.x); dot.setAttribute("cy", ap.y);
      }
      if (!paused && !reduce) { const pr = Math.min(1, (t - last) / DUR); pb.style.width = pr * 100 + "%"; if (pr >= 1) setAct(act + 1); }
    }
    requestAnimationFrame(spin);
  })(prev);
})();
