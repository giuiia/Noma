/**
 * NOMA Monte Verde — main.js
 * v1.0 | Jul 2026
 */

/* ============================
   LOADING SCREEN
   ============================ */
window.addEventListener('load', () => {
  const loading = document.getElementById('loading');
  setTimeout(() => {
    loading.classList.add('fade-out');
    setTimeout(() => loading.style.display = 'none', 950);
  }, 2000);
});

/* ============================
   HEADER — scroll behavior
   ============================ */
const header = document.getElementById('header');

const updateHeader = () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/* ============================
   HERO — sticky scroll (3 slides)
   ============================ */
const hero      = document.getElementById('hero');
const slides    = document.querySelectorAll('.hero-slide');
const dots      = document.querySelectorAll('.dot');
const heroDotsEl = document.querySelector('.hero-dots');

let currentSlide = 0;

const setSlide = (index) => {
  if (index === currentSlide) return;
  currentSlide = index;
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === index);
  });
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === index);
    d.setAttribute('aria-selected', i === index ? 'true' : 'false');
  });
};

const handleHeroScroll = () => {
  const heroTop    = hero.offsetTop;
  const heroHeight = hero.offsetHeight;
  const vh         = window.innerHeight;
  const scrollY    = window.scrollY;

  // Mostrar / esconder dots conforme está na seção hero
  const inHero = scrollY >= heroTop && scrollY < heroTop + heroHeight - vh;
  heroDotsEl.style.opacity = inHero ? '1' : '0';
  heroDotsEl.style.pointerEvents = inHero ? 'auto' : 'none';

  if (!inHero) return;

  // Progresso de 0 a 1 dentro do hero
  const progress = (scrollY - heroTop) / (heroHeight - vh);
  const index = Math.min(Math.floor(progress * slides.length), slides.length - 1);
  setSlide(index);
};

window.addEventListener('scroll', handleHeroScroll, { passive: true });
handleHeroScroll();

// Dots clicáveis — scroll para o slide correspondente
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    const heroTop    = hero.offsetTop;
    const heroHeight = hero.offsetHeight;
    const vh         = window.innerHeight;
    const scrollable = heroHeight - vh;
    const targetScroll = heroTop + (i / slides.length) * scrollable;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  });
});

/* ============================
   SCROLL REVEAL
   ============================ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animação só uma vez
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* ============================
   FAQ — accordion
   ============================ */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Fecha todos
    faqItems.forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Abre o clicado (se não estava aberto)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ============================
   MOBILE MENU
   ============================ */
const menuToggle  = document.getElementById('menuToggle');
const mobileNav   = document.getElementById('mobileNav');
const closeMenu   = document.getElementById('closeMenu');

const openMobileNav = () => {
  mobileNav.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};
const closeMobileNav = () => {
  mobileNav.style.display = 'none';
  document.body.style.overflow = '';
};

menuToggle?.addEventListener('click', openMobileNav);
closeMenu?.addEventListener('click', closeMobileNav);

// Fecha ao clicar em um link do menu mobile
mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// Estilo inline para links do mobile nav
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
  link.style.cssText = `
    font-family: var(--font-serif, Georgia, serif);
    font-size: 2rem;
    font-weight: 300;
    color: #F4E8D3;
    letter-spacing: 0.02em;
    transition: color 0.3s;
  `;
  link.addEventListener('mouseenter', () => link.style.color = '#CBB585');
  link.addEventListener('mouseleave', () => link.style.color = '#F4E8D3');
});

/* ============================
   SMOOTH SCROLL — links internos
   ============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  });
});

/* ============================
   LINHA BÚSSOLA — animação no scroll
   ============================ */
const compassPath = document.getElementById('hero-compass-path');
const compassDot  = document.getElementById('hero-compass-dot');
const compassHalo = document.getElementById('hero-compass-halo');

if (compassPath) {
  const totalLen = compassPath.getTotalLength();

  // Inicializa com linha invisível
  compassPath.style.strokeDasharray  = totalLen;
  compassPath.style.strokeDashoffset = totalLen;

  const updateCompassLine = () => {
    const heroTop    = hero.offsetTop;
    const heroHeight = hero.offsetHeight;
    const vh         = window.innerHeight;
    const scrollY    = window.scrollY;
    const inHero     = scrollY >= heroTop && scrollY < heroTop + heroHeight - vh;

    if (!inHero) return;

    const progress = (scrollY - heroTop) / (heroHeight - vh); // 0 → 1
    const drawn    = totalLen * Math.min(progress * 1.3, 1);  // pequena antecipação

    compassPath.style.strokeDashoffset = totalLen - drawn;

    // Move o ponto para a extremidade da linha desenhada
    if (drawn > 0) {
      const pt = compassPath.getPointAtLength(drawn);
      compassDot.setAttribute('cx', pt.x);
      compassDot.setAttribute('cy', pt.y);
      compassHalo.setAttribute('cx', pt.x);
      compassHalo.setAttribute('cy', pt.y);
      compassDot.style.opacity  = drawn < 10 ? drawn / 10 : '0.95';
      compassHalo.style.opacity = drawn < 10 ? drawn / 20 : '0.7';
    }
  };

  window.addEventListener('scroll', updateCompassLine, { passive: true });
  updateCompassLine();
}

/* ============================
   BÚSSOLA — rotação suave ao hover
   ============================ */
document.querySelectorAll('.loading-compass').forEach(compass => {
  compass.addEventListener('mouseenter', () => {
    compass.style.transform = 'rotate(360deg)';
    compass.style.transition = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
  });
  compass.addEventListener('mouseleave', () => {
    compass.style.transform = 'rotate(0deg)';
  });
});
