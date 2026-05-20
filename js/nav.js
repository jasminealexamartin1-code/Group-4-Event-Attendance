// Injects the shared navbar into any page
function renderNav() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  nav.innerHTML = `
    <nav class="navbar">
      <div class="container nav-inner">
        <a href="index.html" class="nav-logo">
          <div class="nav-logo-dot"></div>
          EvenTrack
        </a>
        <div class="nav-links">
        <a href="index.html" class="nav-link">Home</a>
        <a href="events.html" class="nav-link">Events</a>
        <a href="contact.html" class="nav-link">Contact</a> <a href="admin.html" class="nav-cta">Admin Panel</a>
        
        <div class="theme-toggle" role="switch" aria-label="Toggle dark mode">
          <span class="toggle-icon icon-sun">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4"/>
              <line x1="12" y1="2" x2="12" y2="5"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
              <line x1="2" y1="12" x2="5" y2="12"/>
              <line x1="19" y1="12" x2="22" y2="12"/>
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
              <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
            </svg>
          </span>
          <div class="toggle-track"><div class="toggle-knob"></div></div>
          <span class="toggle-icon icon-moon">
            <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </span>
        </div>
        </div>
        <button id="mobile-toggle" class="mobile-toggle" aria-label="Menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </nav>
    <div id="mobile-menu" class="mobile-menu">
      <a href="index.html"   class="nav-link">Home</a>
      <a href="events.html"  class="nav-link">Events</a>
      <a href="about.html"   class="nav-link">About</a>
      <a href="contact.html" class="nav-link">Contact</a>
      <a href="admin.html"   class="nav-cta btn">Admin</a>
    </div>
  `;
}

// Injects shared footer
function renderFooter() {
  const el = document.getElementById("footer");
  if (!el) return;
  el.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 32px; margin-bottom: 20px; font-size: 0.95rem; color: var(--primary-navy); font-weight: 600;">
          <a href="mailto:info@eventrack.com" style="display: flex; align-items: center; gap: 8px;">
            ✉️ info@eventrack.com
          </a>
          <a href="tel:+15551234567" style="display: flex; align-items: center; gap: 8px;">
            📞 +1 (555) 123-4567
          </a>
          <span style="display: flex; align-items: center; gap: 8px;">
            📍 123 Event Street, Tech City
          </span>
        </div>
        <p>© 2026 <a href="index.html">EvenTrack</a>. All rights reserved.</p>
      </div>
    </footer>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  renderFooter();
});
