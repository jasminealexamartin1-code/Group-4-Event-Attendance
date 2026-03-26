// ─── Navigation Active State ───────────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ─── Mobile Menu Toggle ────────────────────────────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    const isOpen = menu.classList.contains('open');
    toggle.innerHTML = isOpen
      ? `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`
      : `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>`;
  });
}

// ─── Utility: Get query param ──────────────────────────────────────────
function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

// ─── Utility: Category color ──────────────────────────────────────────
function categoryBadge(cat) {
  const map = { College: 'badge-blue', SHS: 'badge-amber', Internship: 'badge-purple' };
  return `<span class="badge ${map[cat] || 'badge-slate'}">${cat}</span>`;
}

// ─── Utility: Status badge ────────────────────────────────────────────
function statusBadge(status) {
  const map = { live: 'badge-green', upcoming: 'badge-violet', past: 'badge-slate' };
  return `<span class="badge badge-border ${map[status] || 'badge-slate'}">${status}</span>`;
}

// ─── Utility: Type badge ──────────────────────────────────────────────
function typeBadge(type) {
  return type === 'online'
    ? `<span class="badge badge-cyan">🌐 Online</span>`
    : `<span class="badge badge-rose">🚶 Walk-in</span>`;
}

// ─── Animate elements on scroll ───────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initMobileMenu();
  initScrollReveal();
});
