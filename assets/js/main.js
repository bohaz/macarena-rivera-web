/* Macarena Rivera Arquitectura — interacciones mínimas.
   Las animaciones viven en CSS; aquí solo se activan estados. */
(() => {
  'use strict';

  const WA = '56996889647';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Revelado al hacer scroll (con escalonado por grupo) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const groups = new Map();
  revealEls.forEach((el) => {
    const parent = el.parentElement;
    const i = groups.get(parent) || 0;
    el.style.setProperty('--d', `${Math.min(i, 6) * 0.08}s`);
    groups.set(parent, i + 1);
  });

  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Navbar: fondo al hacer scroll + menú móvil ---------- */
  const nav = document.querySelector('[data-nav]');
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('menu');

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.setAttribute('aria-hidden', String(!open));
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Sección activa en el menú ---------- */
  const dockLinks = [...document.querySelectorAll('.nav__links a')];
  const sections = dockLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        dockLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Parallax suave de fondos ---------- */
  const parallax = [...document.querySelectorAll('.services__bg, .voices__bg')];
  if (parallax.length && !reduced) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      parallax.forEach((img) => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1
        img.style.transform = `translate3d(0, ${(-progress * 6 - 6).toFixed(2)}%, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Testimonios ---------- */
  const voices = [...document.querySelectorAll('.voice')];
  const count = document.querySelector('.voices__count b');
  let current = 0;
  let timer;
  const show = (n) => {
    current = (n + voices.length) % voices.length;
    voices.forEach((v, i) => v.classList.toggle('is-active', i === current));
    if (count) count.textContent = String(current + 1).padStart(2, '0');
  };
  const auto = () => {
    clearInterval(timer);
    if (!reduced) timer = setInterval(() => show(current + 1), 7000);
  };
  document.querySelectorAll('.voices .arrow').forEach((btn) => {
    btn.addEventListener('click', () => { show(current + Number(btn.dataset.dir)); auto(); });
  });
  if (voices.length > 1) auto();

  /* ---------- Antes / después ---------- */
  const ba = document.querySelector('.ba');
  if (ba) {
    const range = ba.querySelector('.ba__range');
    const set = (v) => ba.style.setProperty('--pos', `${v}%`);
    range.addEventListener('input', () => { ba.classList.remove('is-intro'); set(range.value); });

    // Pequeña demostración al entrar en pantalla: invita a interactuar.
    if ('IntersectionObserver' in window && !reduced) {
      set(85);
      const intro = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        ba.classList.add('is-intro');
        setTimeout(() => set(range.value), 450);
        setTimeout(() => ba.classList.remove('is-intro'), 2000);
        intro.disconnect();
      }, { threshold: 0.5 });
      intro.observe(ba);
    }
  }

  /* ---------- Mensaje rápido a WhatsApp ---------- */
  const quick = document.querySelector('.quick');
  if (quick) {
    quick.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = quick.msg.value.trim();
      if (!msg) return;
      const text = `Hola Macarena, te escribo desde tu web: ${msg}`;
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      quick.reset();
    });
  }

  /* ---------- Año del footer ---------- */
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
