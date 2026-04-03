// ── Events Page Logic ──────────────────────────────────────────────────
let selectedCategory = 'All';
let selectedType = 'All';

const categories = ['All', 'College', 'SHS', 'Internship'];
const types = ['All', 'online', 'walkin'];

function renderFilters() {
  const catEl  = document.getElementById('category-filters');
  const typeEl = document.getElementById('type-filters');

  catEl.innerHTML = categories.map(c => `
    <button class="filter-btn ${c === selectedCategory ? 'active-cat' : ''}"
      onclick="filterCategory('${c}')">${c}</button>
  `).join('');

  typeEl.innerHTML = types.map(t => `
    <button class="filter-btn ${t === selectedType ? 'active-type' : ''}"
      onclick="filterType('${t}')">${t === 'walkin' ? 'Walk-in' : t.charAt(0).toUpperCase()+t.slice(1)}</button>
  `).join('');
}

function filterCategory(c) { selectedCategory = c; render(); }
function filterType(t)      { selectedType = t;      render(); }

function getFiltered() {
  return events.filter(e => {
    const cm = selectedCategory === 'All' || e.category === selectedCategory;
    const tm = selectedType     === 'All' || e.type     === selectedType;
    return cm && tm;
  });
}

function render() {
  renderFilters();
  const filtered = getFiltered();
  const grid  = document.getElementById('events-grid');
  const empty = document.getElementById('no-events');

  if (!filtered.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = filtered.map(e => eventCard(e)).join('');
}

function eventCard(e) {
  const pct = Math.round((e.attendees / e.capacity) * 100);
  return `
    <a href="event-detail.html?id=${e.id}" class="card event-card">
      <div class="event-thumb ${e.gradient}">
        <span class="event-thumb-emoji">${e.icon}</span>
      </div>
      <div class="event-body">
        <div class="event-badges">
          ${categoryBadge(e.category)}
          ${statusBadge(e.status)}
          ${typeBadge(e.type)}
        </div>
        <div>
          <div class="event-title">${e.title}</div>
          <p class="event-desc">${e.description}</p>
        </div>
        <div class="event-meta">
          <div class="meta-row">
            <span class="meta-icon">📅</span>
            <span>${e.date} • ${e.time}</span>
          </div>
          <div class="meta-row">
            <span class="meta-icon">📍</span>
            <span>${e.location}</span>
          </div>
          <div class="meta-row">
            <span class="meta-icon">👥</span>
            <span>${e.attendees} / ${e.capacity} attendees</span>
          </div>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
      </div>
    </a>
  `;
}

document.addEventListener('DOMContentLoaded', render);
