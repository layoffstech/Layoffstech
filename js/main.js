const $ = (s) => document.querySelector(s);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtNum = (n) => n.toLocaleString("en-IN");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Dark mode
const root = document.documentElement;
try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}
document.addEventListener("click", (e) => {
  if (!e.target.closest("#themeBtn")) return;
  const dark = root.dataset.theme === "dark" ||
    (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});

// Homepage: list + search + category filter
const list = $("#postList");
if (list) {
  const sorted = [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
  const cats = ["All", ...new Set(sorted.map((p) => p.category))];
  let cat = "All", q = "";

  $("#totalCount").textContent = fmtNum(sorted.reduce((s, p) => s + p.count, 0));
  $("#filters").innerHTML = cats.map((c) =>
    `<button class="chip" data-cat="${esc(c)}" aria-pressed="${c === "All"}">${esc(c)}</button>`).join("");

  const render = () => {
    const rows = sorted.filter((p) =>
      (cat === "All" || p.category === cat) &&
      (p.title + p.company + p.summary).toLowerCase().includes(q));
    list.innerHTML = rows.length ? rows.map((p) => `
      <li><a class="row" href="post.html?slug=${encodeURIComponent(p.slug)}">
        <span class="count"><small>jobs cut</small>−${fmtNum(p.count)}</span>
        <span class="info">
          <span class="meta">${esc(p.company)}, ${fmtDate(p.date)}, ${esc(p.category)}</span>
          <h2>${esc(p.title)}</h2>
          <p>${esc(p.summary)}</p>
        </span>
      </a></li>`).join("") : `<li class="empty">Koi post nahi mili. Search ya category badal ke dekho.</li>`;
  };
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    cat = b.dataset.cat;
    document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
    render();
  });
  $("#search").addEventListener("input", (e) => { q = e.target.value.toLowerCase().trim(); render(); });
  render();
}

// Post page
const art = $("#article");
if (art) {
  const slug = new URLSearchParams(location.search).get("slug");
  const p = POSTS.find((x) => x.slug === slug);
  if (!p) {
    art.innerHTML = `<h1>Post nahi mili</h1><p><a href="index.html">Homepage pe wapas jao</a></p>`;
  } else {
    document.title = p.title + " | Layoffstech";
    art.innerHTML = `
      <p class="meta">${esc(p.company)}, ${fmtDate(p.date)}, ${esc(p.category)}</p>
      <h1>${esc(p.title)}</h1>
      <p class="big"><small>jobs cut</small>−${fmtNum(p.count)}</p>
      ${p.body.map((t) => `<p>${esc(t)}</p>`).join("")}
      ${p.source ? `<p class="src">Source: <a href="${esc(p.source)}" rel="noopener" target="_blank">${esc(p.source)}</a></p>` : ""}
      <p><a href="index.html">Saari news dekho</a></p>`;
  }
}
