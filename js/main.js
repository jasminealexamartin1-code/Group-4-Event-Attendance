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

// ─── Utility: Category badge ──────────────────────────────────────────
function categoryBadge(catStr) {
  if (!catStr) return '';
  const map = { College: 'badge-blue', SHS: 'badge-amber', Internship: 'badge-purple', Intern: 'badge-purple' };
  
  return catStr.split(',').map(c => {
    const clean = c.trim();
    const label = clean === 'Intern' ? 'Internship' : clean;
    return `<span class="badge ${map[clean] || 'badge-slate'}">${label}</span>`;
  }).join(' ');
}

// ─── Utility: Status badge ────────────────────────────────────────────
function statusBadge(status) {
  const map = { live: 'badge-green', upcoming: 'badge-violet', past: 'badge-slate' };
  return `<span class="badge badge-border ${map[status] || 'badge-slate'}">${status}</span>`;
}

// ─── Utility: Type badge ──────────────────────────────────────────────
function typeBadge(typeStr) {
  if (!typeStr) return '';
  
  return typeStr.split(',').map(t => {
    const clean = t.trim().toLowerCase();
    return clean === 'online'
      ? `<span class="badge badge-cyan">🌐 Online</span>`
      : `<span class="badge badge-rose">🚶 Walk-in</span>`;
  }).join(' ');
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

// ─── Utility: Generate Monogram ───────────────────────────────────────
function getMonogram(title) {
  if (!title) return "EV"; // Fallback
  const cleanTitle = title.trim();
  const words = cleanTitle.split(" ").filter(w => w.length > 0);
  
  // If the title has multiple words, grab the first letter of the first two words
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  // If it's a single word, grab the first two letters
  return cleanTitle.substring(0, 2).toUpperCase();
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initMobileMenu();
  initScrollReveal();
});
