// Injects the shared navbar into any page
function renderNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.innerHTML = `
    <nav class="navbar">
      <div class="container nav-inner">
        <a href="index.html" class="nav-logo">
          <div class="nav-logo-dot"></div>
          EvenTrack
        </a>
        <div class="nav-links">
          <a href="index.html"   class="nav-link">Home</a>
          <a href="events.html"  class="nav-link">Events</a>
          <a href="about.html"   class="nav-link">About</a>
          <a href="contact.html" class="nav-link">Contact</a>
          <a href="admin.html"   class="nav-cta">Admin</a>
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
  const el = document.getElementById('footer');
  if (!el) return;
  el.innerHTML = `
    <footer class="footer">
      <div class="container">
        <p>© 2026 <a href="index.html">EvenTrack</a>. All rights reserved. Built with ❤️ by Group 4.</p>
      </div>
    </footer>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
});
