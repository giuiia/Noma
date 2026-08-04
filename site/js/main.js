/* ============================================================
   NOMA Monte Verde — main.js v2.0 | Ago 2026
   ============================================================ */

(function () {
  'use strict';

  /* ── SCROLL REVEAL ─────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ── HEADER — transparente → sólido ao rolar ──────────── */
  const header = document.getElementById('header');
  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ── MENU MOBILE ──────────────────────────────────────── */
  const menuToggle   = document.getElementById('menuToggle');
  const mobileNav    = document.getElementById('mobileNav');
  const closeMenuBtn = document.getElementById('closeMenu');

  function openMenu() {
    mobileNav.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileNav.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);

    mobileNav.querySelectorAll('.mobile-nav-link, .btn-primary').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.style.display === 'flex') closeMenu();
    });
  }

  /* ── SMOOTH SCROLL ────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── GALERIA DOS REFÚGIOS ─────────────────────────────── */
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const track  = slider.querySelector('.refugio-slides');
    const slides = slider.querySelectorAll('.refugio-slide');
    const dots   = slider.querySelectorAll('.slide-dot');
    const prevBtn = slider.querySelector('.slide-prev');
    const nextBtn = slider.querySelector('.slide-next');
    const total = slides.length;
    let current = 0;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Dots clicáveis
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Suporte a touch / swipe
    let startX = 0;
    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    }, { passive: true });
  });

  /* ── FAQ ACCORDION ─────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', function () {
      const item   = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Fechar todos
      document.querySelectorAll('.faq-item.open').forEach((el) => {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Abrir o clicado (se estava fechado)
      if (!isOpen) {
        item.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

})();
