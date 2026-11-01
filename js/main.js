/* ===== CONFIGURAÇÃO: edite aqui seus dados ===== */
const CONFIG = {
  name: "Carlos Guilherme Sposito dos Santos",   // nome completo (rodapé e título da aba)
  displayName: "Carlos Santos",                   // nome grande da abertura
  role: "Estudante de TI",
  city: "Campinas, SP — Brasil",
  portfolioLabel: "Portfólio 2026",
  github: "https://github.com/Carlossantos238"
};

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement, body = document.body;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isReduced = () => root.dataset.motion === "off";   // controlado pelo botão "Animações" e pelo sistema
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const BALL = '<svg viewBox="-24 -24 48 48"><circle r="22" fill="#F4F2EC"/><path d="M-22 0Q0-10 22 0M-15-16Q0 0-15 16M15-16Q0 0 15 16" stroke="#0A0A0A" stroke-width="1.2" fill="none" opacity=".55"/></svg>';

  /* ---------- Textos a partir do CONFIG ---------- */
  $$("[data-bind]").forEach(el => { if (CONFIG[el.dataset.bind]) el.textContent = CONFIG[el.dataset.bind]; });
  const [first, ...rest] = CONFIG.displayName.split(" ");
  const nameEl = $("#nameTop");
  nameEl.innerHTML = rest.length ? `${first} <em>${rest.join(" ")}</em>` : `<em>${first}</em>`;
  document.title = CONFIG.name + " — Portfólio";
  const mail = $("#mail"); mail.href = CONFIG.github; mail.textContent = CONFIG.github.replace("https://", "");
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Letras: nome reage ao mouse; títulos entram letra a letra ---------- */
  (function chars(node) {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const f = document.createDocumentFragment();
        n.textContent.split(/( )/).forEach(part => {
          if (part === " ") return f.append(" ");
          if (!part) return;
          const w = document.createElement("span"); w.className = "nw";
          [...part].forEach(ch => { const s = document.createElement("span"); s.className = "ch"; s.textContent = ch; w.append(s); });
          f.append(w);
        });
        n.replaceWith(f);
      } else if (n.nodeType === 1) chars(n);
    });
  })(nameEl);
  let idx = 0;
  $$("[data-split]").forEach(el => {
    const text = el.textContent.trim(); el.setAttribute("aria-label", text); el.textContent = "";
    text.split(" ").forEach(word => {
      const w = document.createElement("span"); w.className = "w"; w.setAttribute("aria-hidden", "true");
      [...word].forEach(ch => { const c = document.createElement("span"); c.className = "c"; c.style.setProperty("--i", idx++); c.textContent = ch; w.append(c); });
      el.append(w, " ");
    });
    idx = 0;
  });

  /* ---------- Cena: poeira dourada flutuando + bola ajustada ao tamanho da tela ---------- */
  const scene = $("#scene"), serve = $("#serve"), dust = $("#dust");
  for (let i = 0; i < 24; i++) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", Math.random() * 1440); c.setAttribute("cy", 150 + Math.random() * 190); c.setAttribute("r", .8 + Math.random() * 1.6);
    c.style.animationDuration = 7 + Math.random() * 8 + "s"; c.style.animationDelay = -Math.random() * 12 + "s";
    dust.append(c);
  }
  function fitServe() {            // mantém a bola grande o bastante para tocar, inclusive no celular
    const ctm = scene.getScreenCTM(), k = ctm ? ctm.a : 1, s = Math.max(1, 1.05 / k);
    serve.setAttribute("transform", `translate(${innerWidth < 900 ? 420 : 400} ${300 - (s - 1) * 12}) scale(${s})`);
  }
  fitServe(); addEventListener("resize", fitServe);

  /* ---------- Faíscas douradas ---------- */
  function burst(x, y, n = 16) {
    if (isReduced()) return;
    for (let i = 0; i < n; i++) {
      const d = document.createElement("i"); d.className = "spark"; d.style.left = x + "px"; d.style.top = y + "px"; body.append(d);
      const a = Math.random() * 6.28, v = 60 + Math.random() * 110;
      d.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${Math.cos(a) * v}px,${Math.sin(a) * v - 40}px) scale(0)`, opacity: 0 }],
        { duration: 800 + Math.random() * 400, easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => d.remove();
    }
  }

  /* ---------- Contadores ---------- */
  const counters = $$("[data-count]");
  if (!isReduced()) counters.forEach(c => c.textContent = "0");
  function countUp(el) {
    const end = +el.dataset.count, t0 = performance.now();
    (function step(t) {
      const p = Math.min((t - t0) / 1600, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- Revelação ao rolar (uma vez) + link ativo ---------- */
  let observing = false;
  function startObservers() {
    if (observing) return; observing = true;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: .15, rootMargin: "0px 0px -8% 0px" });
    $$(".rv").forEach(el => io.observe(el));
    const co = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { isReduced() ? e.target.textContent = e.target.dataset.count : countUp(e.target); co.unobserve(e.target); }
    }), { threshold: .6 });
    counters.forEach(c => co.observe(c));
    const links = $$("#menu a");
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.hash === "#" + e.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    $$(".sec").forEach(s => spy.observe(s));
    setTimeout(() => { $$(".rv").forEach(el => el.classList.add("in")); counters.forEach(c => c.textContent = c.dataset.count); }, 12000);
  }

  /* ---------- START = SAQUE ----------
     1 bola voa sobre a rede  2 íris dourada nasce onde ela cai
     3 conteúdo troca por trás  4 painel sobe revelando o site */
  const intro = $("#intro"), panel = $("#panel");
  let busy = false;
  function swap() {
    intro.classList.add("gone"); body.classList.add("started"); body.classList.remove("locked");
    root.style.scrollBehavior = "auto"; scrollTo(0, 0); root.style.scrollBehavior = "";
    startObservers();
  }
  async function start() {
    if (busy) return; busy = true;
    if (isReduced()) { panel.style.display = "none"; swap(); return; }
    const cr = $("#sball circle").getBoundingClientRect(), d = cr.width;
    const x0 = cr.left + d / 2, y0 = cr.top + d / 2, x1 = innerWidth * .8, H = Math.min(innerHeight * .55, 420);
    const fly = document.createElement("div"); fly.className = "fly"; fly.style.cssText = `width:${d}px;height:${d}px`; fly.innerHTML = BALL; body.append(fly);
    serve.style.visibility = "hidden"; intro.classList.add("leaving");
    const kf = []; for (let i = 0; i <= 30; i++) { const t = i / 30; kf.push({ offset: t, transform: `translate(${x0 - d / 2 + (x1 - x0) * t}px,${y0 - d / 2 - 4 * H * t * (1 - t)}px) rotate(${t * 720}deg)` }); }
    await fly.animate(kf, { duration: 1200, easing: "linear", fill: "forwards" }).finished;
    panel.style.setProperty("--cx", x1 + "px"); panel.style.setProperty("--cy", y0 + "px");
    burst(x1, y0 + d / 2, 22);
    panel.classList.add("cover");                 // íris dourada
    await wait(1000); fly.remove(); swap();
    await wait(750);                              // mostra as iniciais
    panel.classList.replace("cover", "reveal");   // painel sobe
    await wait(1050); panel.style.display = "none";
  }
  serve.addEventListener("click", start);
  serve.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); start(); } });

  /* ---------- Ímã, inclinação e paralaxe (só com mouse) ---------- */
  function magnet(el, k = .3) {
    el.addEventListener("mousemove", e => {
      if (isReduced()) return;
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * k}px,${(e.clientY - r.top - r.height / 2) * k}px)`;
    });
    el.addEventListener("mouseleave", () => el.style.transform = "");
  }
  const depth = $$("[data-depth]", scene);
  const dot = $("#dot"), ring = $("#ring");
  let mx = 0, my = 0, rx = 0, ry = 0;
  if (fine) {
    $$(".socials a, .mail").forEach(el => magnet(el, .25));
    intro.addEventListener("mousemove", e => {
      if (isReduced()) return;
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      depth.forEach(g => g.style.transform = `translate(${-nx * g.dataset.depth * 40}px,${-ny * g.dataset.depth * 16}px)`);
    });
    $$(".project-img").forEach(el => {
      el.addEventListener("mousemove", e => {
        if (isReduced()) return;
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      });
      el.addEventListener("mouseleave", () => el.style.transform = "");
    });
    addEventListener("mousemove", e => {
      if (isReduced()) return;
      mx = e.clientX; my = e.clientY;
      if (!root.classList.contains("has-cursor")) { rx = mx; ry = my; root.classList.add("has-cursor"); }
      dot.style.transform = `translate(${mx}px,${my}px)`;
    });
    document.addEventListener("mouseover", e => ring.classList.toggle("big", !!e.target.closest("a,button,#serve,.ch")));
  }

  /* ---------- Loop: cursor suave + faixa acelera com a rolagem ---------- */
  const track = $(".track");
  let lastY = scrollY, vel = 0;
  (function loop() {
    const dy = scrollY - lastY; lastY = scrollY; vel += (Math.abs(dy) - vel) * .12;
    if (!isReduced()) {
      const a = track.getAnimations()[0]; if (a) a.updatePlaybackRate(1 + Math.min(vel * .3, 10));
      rx += (mx - rx) * .15; ry += (my - ry) * .15;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
    }
    requestAnimationFrame(loop);
  })();

  /* ---------- Progresso (com bola rolando) + parallax ---------- */
  const bar = $("#progress"), pball = $("#pball"), pars = $$("[data-par]");
  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const max = root.scrollHeight - innerHeight, f = max > 0 ? scrollY / max : 0;
      bar.style.transform = `scaleX(${f})`;
      pball.style.transform = `translateX(${f * (innerWidth - 11)}px) rotate(${scrollY / 2}deg)`;
      if (!isReduced()) pars.forEach(el => {
        const r = el.getBoundingClientRect(), p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        el.style.transform = `translateY(${Math.max(-1, Math.min(1, p)) * -(+el.dataset.par)}px)`;
      });
      ticking = false;
    });
  }, { passive: true });

  /* ---------- Bola de toques ---------- */
  const ball = $("#ball"), taps = $("#taps");
  let n = 0;
  ball.addEventListener("click", () => {
    taps.textContent = ++n;
    ball.setAttribute("aria-label", "Manter a bola no ar. Toques: " + n);
    const r = ball.getBoundingClientRect();
    if (!isReduced()) $("svg", ball).animate(
      [{ transform: "translateY(0) rotate(0)" }, { transform: "translateY(-26px) rotate(180deg)", offset: .45 }, { transform: "translateY(0) rotate(360deg)" }],
      { duration: 520, easing: "cubic-bezier(.3,.8,.5,1)" });
    if (n % 10 === 0) burst(r.left + 20, r.top, 20);
  });

  /* ---------- Menu mobile ---------- */
  const nav = $(".nav"), toggle = $("#toggle");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "Fechar" : "Menu";
    body.classList.toggle("locked", open);
    if (open) $("#menu a").focus(); else toggle.focus({ preventScroll: true });
  }
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) setMenu(false); });
  $$("#menu a").forEach(a => a.addEventListener("click", () => nav.classList.contains("open") && setMenu(false)));
})();
