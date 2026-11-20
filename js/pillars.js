// js/pillars.js: "Learn it. Grow it. Enjoy it." auto-playing panels on the homepage.
// Panels open one after another. Hover pauses, click/tap opens a panel,
// arrow keys move between panels, and every topic links to its category page.
(function () {
  const box = document.getElementById("pillars");
  if (!box || typeof CATEGORIES === "undefined") return;

  // ---------- EDIT: the three panels ----------
  // cats = categories shown as buttons, items = topics in the moving list [name, category slug]
  const P = [
    { key: "Learn", cls: "g", label: "Learn & understand", tag: "Clear guides that make hard things simple.",
      ds: "Study help, tech explained in plain words and health basics you can trust.", btn: "Start learning", href: "/category/education",
      cats: ["education", "technology", "health"],
      items: [["Exam tips", "education"], ["AI tools", "technology"], ["How-to guides", "technology"], ["Science explained", "education"], ["Healthy habits", "health"], ["Smartphones", "technology"], ["Study planners", "education"], ["Mental wellbeing", "health"]] },
    { key: "Grow", cls: "c", label: "Money & career", tag: "Smart moves for your money and your career.",
      ds: "Personal finance, startup stories and career advice to help you move ahead.", btn: "Start growing", href: "/category/business",
      cats: ["business", "education"],
      items: [["Personal finance", "business"], ["Saving & investing", "business"], ["Startups", "business"], ["Career advice", "education"], ["Side hustles", "business"], ["Job skills", "education"], ["Small business", "business"]] },
    { key: "Enjoy", cls: "b", label: "Life & leisure", tag: "Stories for the fun side of life.",
      ds: "Movies, matches, trips and everyday ideas that make your free time better.", btn: "Start exploring", href: "/category/entertainment",
      cats: ["entertainment", "lifestyle", "sports", "travel"],
      items: [["Movies & shows", "entertainment"], ["Cricket", "sports"], ["Budget trips", "travel"], ["Home & style", "lifestyle"], ["Music", "entertainment"], ["Food & recipes", "lifestyle"], ["Weekend getaways", "travel"], ["Big matches", "sports"]] }
  ];
  const DUR = 5200; // time each panel stays open (milliseconds)

  // ---------- Styles (site colours, so dark mode works) ----------
  const css = `
  #pillars{padding:90px 0 84px;background:var(--soft)}
  #pillars .pl-hd{display:flex;justify-content:space-between;align-items:flex-end;gap:30px;margin-bottom:36px}
  #pillars .pl-ey{display:inline-block;font:700 12px/1 var(--body);letter-spacing:.16em;text-transform:uppercase;color:var(--blue);margin-bottom:14px}
  #pillars h2{font:800 clamp(34px,4.6vw,60px)/1.04 var(--head);letter-spacing:-.025em;color:var(--ink);margin:0;max-width:760px}
  #pillars h2 em{font-style:normal;color:var(--blue)}
  #pillars .pl-side{max-width:340px;color:var(--muted);font-size:15.5px;line-height:1.6;margin:0}
  #pillars .pl-acc{display:flex;gap:14px;height:480px}
  #pillars .pl{position:relative;isolation:isolate;flex:1 1 0;min-width:0;overflow:hidden;cursor:pointer;padding:30px;border-radius:26px;outline:none;
    transition:flex-grow .8s cubic-bezier(.65,0,.25,1),box-shadow .4s,transform .4s}
  #pillars .pl.on{flex-grow:3.2;cursor:default}
  #pillars .pl:focus-visible{box-shadow:0 0 0 3px var(--blue)}
  #pillars .pl.g{background:linear-gradient(155deg,#3a74ff,#1456e8 55%,#0a2a7a);color:#fff}
  #pillars .pl.c{background:linear-gradient(155deg,#132552,#050b1f);color:#fff;box-shadow:inset 0 0 0 1px rgba(127,176,255,.18)}
  #pillars .pl.b{background:var(--surface);color:var(--ink);box-shadow:inset 0 0 0 1px var(--line)}
  #pillars .pl:not(.on):hover{transform:translateY(-4px);box-shadow:0 24px 50px rgba(10,42,122,.18)}
  #pillars .pl-ghost{position:absolute;right:-14px;bottom:-46px;font:800 230px/1 var(--head);letter-spacing:-.06em;color:transparent;-webkit-text-stroke:1.5px currentColor;opacity:.14;z-index:-1;white-space:nowrap;transition:transform 1s cubic-bezier(.2,.8,.2,1),opacity .6s}
  #pillars .pl:not(.on) .pl-ghost{opacity:0;transform:translateX(40px)}
  #pillars .pl-glow{position:absolute;width:420px;height:420px;border-radius:50%;right:-120px;top:-160px;background:radial-gradient(closest-side,rgba(127,224,255,.35),transparent);z-index:-1;pointer-events:none;transition:opacity .6s}
  #pillars .pl.b .pl-glow{background:radial-gradient(closest-side,rgba(20,86,232,.14),transparent)}
  #pillars .pl:not(.on) .pl-glow{opacity:0}
  #pillars .pl-top{display:flex;justify-content:space-between;align-items:center;font:700 12px var(--body);letter-spacing:.14em;text-transform:uppercase;opacity:.8}
  #pillars .pl:not(.on) .pl-top span:last-child{opacity:0}
  #pillars .pl-top span:last-child{transition:opacity .3s}
  #pillars .pl-vt{position:absolute;left:30px;bottom:30px;top:80px;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start;transition:opacity .4s .35s}
  #pillars .pl-vt h3{writing-mode:vertical-rl;transform:rotate(180deg);font:800 48px/1 var(--head);letter-spacing:-.02em;margin:0}
  #pillars .pl-plus{width:46px;height:46px;border-radius:50%;border:1.5px solid currentColor;display:flex;align-items:center;justify-content:center;font-size:24px;line-height:1;transition:transform .4s,background .3s}
  #pillars .pl:hover .pl-plus{transform:rotate(90deg)}
  #pillars .pl.on .pl-vt{opacity:0;pointer-events:none;transition-delay:0s}
  #pillars .pl-bd{position:absolute;inset:80px 30px 34px 30px;display:grid;grid-template-columns:1.1fr .9fr;gap:30px;opacity:0;transform:translateY(16px);transition:opacity .35s,transform .35s;pointer-events:none;min-width:560px}
  #pillars .pl.on .pl-bd{opacity:1;transform:none;pointer-events:auto;transition:opacity .6s .35s,transform .6s .35s cubic-bezier(.2,.8,.2,1)}
  #pillars .pl-lt{display:flex;flex-direction:column}
  #pillars .pl-bd h3{font:800 clamp(56px,6vw,86px)/.95 var(--head);letter-spacing:-.035em;margin:0}
  #pillars .pl-bd h3 em{font-style:normal}
  #pillars .pl.g h3 em,#pillars .pl.c h3 em{color:#9fe6ff} #pillars .pl.b h3 em{color:var(--blue)}
  #pillars .pl-tag{font:600 19px/1.4 var(--head);margin:14px 0 0;max-width:330px}
  #pillars .pl-ds{font-size:14.5px;line-height:1.55;margin:10px 0 0;opacity:.78;max-width:340px}
  #pillars .pl-cats{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
  #pillars .pl-cats a{font:600 12.5px var(--body);padding:7px 13px;border-radius:999px;text-decoration:none;color:inherit;transition:transform .2s,background .2s}
  #pillars .pl.g .pl-cats a,#pillars .pl.c .pl-cats a{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.2)}
  #pillars .pl.b .pl-cats a{background:var(--tint);color:var(--blue)}
  #pillars .pl-cats a:hover{transform:translateY(-2px)}
  #pillars .pl.g .pl-cats a:hover,#pillars .pl.c .pl-cats a:hover{background:rgba(255,255,255,.26)}
  #pillars .pl-btn{margin-top:auto;align-self:flex-start;display:inline-flex;align-items:center;gap:8px;padding:13px 22px;border-radius:999px;font:700 15px var(--head);text-decoration:none;transition:transform .2s,box-shadow .2s}
  #pillars .pl.g .pl-btn,#pillars .pl.c .pl-btn{background:#fff;color:#0a1733}
  #pillars .pl.b .pl-btn{background:linear-gradient(180deg,#2a66f0,#1046c9);color:#fff;box-shadow:0 10px 24px rgba(20,86,232,.28)}
  #pillars .pl-btn:hover{transform:translateY(-2px)}
  #pillars .pl-btn span{transition:transform .2s} #pillars .pl-btn:hover span{transform:translateX(4px)}
  #pillars .pl-tk{position:relative;overflow:hidden;-webkit-mask:linear-gradient(transparent,#000 16%,#000 84%,transparent);mask:linear-gradient(transparent,#000 16%,#000 84%,transparent)}
  #pillars .pl-tr{display:flex;flex-direction:column;gap:10px;animation:plTk 16s linear infinite}
  #pillars .pl:hover .pl-tr{animation-play-state:paused}
  @keyframes plTk{to{transform:translateY(-50%)}}
  @keyframes plTkX{to{transform:translateX(-50%)}}
  #pillars .pl-it{display:flex;align-items:center;gap:12px;padding:13px 16px;border-radius:14px;font:600 15px var(--body);white-space:nowrap;text-decoration:none;color:inherit;transition:background .2s,transform .2s}
  #pillars .pl-it i{width:8px;height:8px;border-radius:50%;flex:0 0 auto;background:currentColor;opacity:.6}
  #pillars .pl-it b{margin-left:auto;font-weight:600;opacity:0;transition:opacity .2s}
  #pillars .pl-it:hover b{opacity:1}
  #pillars .pl.g .pl-it{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.16)}
  #pillars .pl.c .pl-it{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1)}
  #pillars .pl.b .pl-it{background:var(--soft);border:1px solid var(--line)}
  #pillars .pl.b .pl-it i{background:var(--blue);opacity:1}
  #pillars .pl-it:hover{transform:translateX(4px)}
  #pillars .pl.g .pl-it:hover,#pillars .pl.c .pl-it:hover{background:rgba(255,255,255,.22)}
  #pillars .pl.b .pl-it:hover{background:var(--tint)}
  #pillars .pl-pg{position:absolute;left:0;right:0;bottom:0;height:4px;background:rgba(127,140,180,.25);opacity:0;transition:opacity .3s}
  #pillars .pl.on .pl-pg{opacity:1}
  #pillars .pl-pg i{display:block;height:100%;width:0;background:currentColor}
  #pillars .pl.b .pl-pg i{background:var(--blue)}
  #pillars .pl-nav{display:flex;justify-content:space-between;align-items:center;margin-top:20px;font-size:13px;color:var(--muted)}
  #pillars .pl-dots{display:flex;gap:8px}
  #pillars .pl-dots button{width:34px;height:5px;border-radius:5px;border:0;padding:0;cursor:pointer;background:var(--line);transition:background .3s,width .3s}
  #pillars .pl-dots button.on{background:var(--blue);width:56px}
  #pillars .pl-hint{display:flex;align-items:center;gap:8px}
  #pillars .pl-hint b{width:8px;height:8px;border-radius:50%;background:var(--blue);animation:plPing 2s infinite}
  #pillars .pl-hint.paused b{animation:none;background:var(--muted)}
  @keyframes plPing{0%{box-shadow:0 0 0 0 rgba(20,86,232,.45)}80%,100%{box-shadow:0 0 0 8px rgba(20,86,232,0)}}
  #pillars .pl-rev{opacity:0;transform:translateY(28px);transition:opacity .8s ease,transform .8s ease}
  #pillars .pl-rev.in{opacity:1;transform:none}
  @media (max-width:1100px){#pillars .pl-acc{height:540px}#pillars .pl-bd h3{font-size:clamp(48px,6vw,64px)}#pillars .pl-bd{grid-template-columns:1fr;min-width:0;display:flex;flex-direction:column}#pillars .pl-ds{display:none}
    #pillars .pl-tk{order:2;margin-top:18px;flex:0 0 auto;-webkit-mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
    #pillars .pl-tr{flex-direction:row;width:max-content;animation-name:plTkX}#pillars .pl-lt{display:contents}#pillars .pl-btn{order:3;margin-top:18px}}
  @media (max-width:860px){
    #pillars{padding:64px 0 60px}
    #pillars .pl-hd{flex-direction:column;align-items:flex-start}
    #pillars .pl-acc{flex-direction:column;height:auto;gap:10px}
    #pillars .pl{flex:none;height:96px;transition:height .7s cubic-bezier(.65,0,.25,1)}
    #pillars .pl-acc{height:auto}
    #pillars .pl.on{height:540px}
    #pillars .pl-vt{left:24px;right:24px;top:24px;bottom:auto;height:48px;flex-direction:row;align-items:center;justify-content:space-between}
    #pillars .pl-vt h3{writing-mode:horizontal-tb;transform:none;font-size:34px}
    #pillars .pl-top{display:none} #pillars .pl.on .pl-top{display:flex}
    #pillars .pl-bd{inset:66px 24px 28px 24px}
    #pillars .pl-bd h3{font-size:50px}
    #pillars .pl-ghost{font-size:150px}
    #pillars .pl-hint{display:none}
  }
  @media (prefers-reduced-motion:reduce){#pillars .pl-tr,#pillars .pl-hint b{animation:none}#pillars .pl-rev{opacity:1;transform:none}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---------- Markup ----------
  const catName = (s) => (CATEGORIES.find((c) => c.slug === s) || { name: s }).name;
  const items = (arr) => { const h = arr.map(([t, s]) => `<a class="pl-it" href="/category/${s}"><i></i>${t}<b>&rarr;</b></a>`).join(""); return h + h; };
  const panel = (p, i) => `
    <div class="pl ${p.cls}" tabindex="0" role="button" aria-label="${p.key}: ${p.label}" aria-expanded="false">
      <span class="pl-glow" aria-hidden="true"></span><span class="pl-ghost" aria-hidden="true">${p.key}</span>
      <div class="pl-top"><span>0${i + 1}</span><span>${p.label}</span></div>
      <div class="pl-vt" aria-hidden="true"><h3>${p.key}</h3><span class="pl-plus">+</span></div>
      <div class="pl-bd">
        <div class="pl-lt"><h3><em>${p.key}</em> it.</h3><p class="pl-tag">${p.tag}</p><p class="pl-ds">${p.ds}</p>
          <div class="pl-cats">${p.cats.map((s) => `<a href="/category/${s}">${catName(s)}</a>`).join("")}</div>
          <a class="pl-btn" href="${p.href}">${p.btn} <span>&rarr;</span></a></div>
        <div class="pl-tk"><div class="pl-tr">${items(p.items)}</div></div>
      </div>
      <span class="pl-pg"><i></i></span>
    </div>`;
  box.innerHTML = `
  <div class="wrap">
    <div class="pl-hd pl-rev">
      <div><span class="pl-ey">Three ways to read Mamta Media</span><h2>Read to <em>learn</em>. Read to <em>grow</em>. Read to <em>enjoy</em>.</h2></div>
      <p class="pl-side">Whatever brings you here, we have a section for it. Pick a path, or let the panels show you around.</p>
    </div>
    <div class="pl-acc pl-rev" id="plAcc">${P.map(panel).join("")}</div>
    <div class="pl-nav"><div class="pl-dots" id="plDots">${P.map((p) => `<button type="button" aria-label="Show ${p.key}"></button>`).join("")}</div>
      <span class="pl-hint" id="plHint"><b></b><span>Auto-playing &middot; hover to pause</span></span></div>
  </div>`;

  // ---------- Behaviour ----------
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const acc = document.getElementById("plAcc"), pls = [...acc.querySelectorAll(".pl")], dots = [...document.querySelectorAll("#plDots button")], hint = document.getElementById("plHint");
  let cur = 0, t0 = performance.now(), paused = false, visible = false, pausedAt = 0;
  function go(i, focus) {
    cur = (i + pls.length) % pls.length;
    pls.forEach((p, j) => { p.classList.toggle("on", j === cur); p.setAttribute("aria-expanded", j === cur); p.querySelector(".pl-pg i").style.width = "0"; });
    dots.forEach((d, j) => d.classList.toggle("on", j === cur));
    t0 = performance.now(); pausedAt = 0;
    if (focus) pls[cur].focus();
  }
  pls.forEach((p, i) => {
    p.addEventListener("click", (e) => { if (!e.target.closest("a")) go(i); });
    p.addEventListener("keydown", (e) => {
      if (e.target !== p) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(i); }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(i + 1, true); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(i - 1, true); }
    });
  });
  dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
  const setPaused = (v) => { paused = v; hint.classList.toggle("paused", v); hint.lastElementChild.textContent = v ? "Paused" : "Auto-playing · hover to pause"; };
  acc.addEventListener("mouseenter", () => { if (matchMedia("(hover:hover)").matches) setPaused(true); });
  acc.addEventListener("mouseleave", () => setPaused(false));
  acc.addEventListener("focusin", () => setPaused(true));
  acc.addEventListener("focusout", (e) => { if (!acc.contains(e.relatedTarget)) setPaused(false); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => (visible = es[0].isIntersecting), { threshold: 0.3 }).observe(acc);
    const rio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } }), { threshold: 0.12 });
    box.querySelectorAll(".pl-rev").forEach((el) => rio.observe(el));
  } else { visible = true; box.querySelectorAll(".pl-rev").forEach((el) => el.classList.add("in")); }
  go(0);
  (function tick(now) {
    if (paused || !visible || reduce) { if (!pausedAt) pausedAt = now; }
    else {
      if (pausedAt) { t0 += now - pausedAt; pausedAt = 0; }
      const p = Math.min(1, (now - t0) / DUR);
      pls[cur].querySelector(".pl-pg i").style.width = p * 100 + "%";
      if (p >= 1) go(cur + 1);
    }
    requestAnimationFrame(tick);
  })(performance.now());
})();
