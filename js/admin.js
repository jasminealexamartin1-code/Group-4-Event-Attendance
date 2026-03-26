// ── Admin Page Logic ────────────────────────────────────────────────────

const recentAttendees = [
  { name: 'John Doe',       email: 'john@example.com',   event: 'Tech Innovation Summit',    date: '2026-04-15', status: 'confirmed' },
  { name: 'Jane Smith',     email: 'jane@example.com',   event: 'Web Development Workshop',  date: '2026-03-28', status: 'confirmed' },
  { name: 'Mike Johnson',   email: 'mike@example.com',   event: 'AI & ML Bootcamp',          date: '2026-04-22', status: 'pending'   },
  { name: 'Sarah Williams', email: 'sarah@example.com',  event: 'Career Fair 2026',          date: '2026-05-05', status: 'confirmed' },
  { name: 'Chris Brown',    email: 'chris@example.com',  event: 'Design Thinking Workshop',  date: '2026-03-10', status: 'confirmed' },
];

// ── Tab Switching ──────────────────────────────────────────────────────
function switchTab(tabName, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tabName).classList.add('active');
  if (btn) btn.classList.add('active');
  if (tabName === 'analytics') setTimeout(renderCharts, 50);
}

// ── Dashboard Lists ────────────────────────────────────────────────────
function renderDashboardEvents() {
  const el = document.getElementById('dash-events-list');
  el.innerHTML = events.slice(0, 4).map(e => `
    <div class="list-item">
      <div class="list-thumb ${e.gradient}">${e.icon}</div>
      <div class="list-info">
        <div class="list-name">${e.title}</div>
        <div class="list-sub">${e.date}</div>
      </div>
      ${statusBadge(e.status)}
    </div>
  `).join('');
}

function renderDashboardAttendees() {
  const el = document.getElementById('dash-attendees-list');
  el.innerHTML = recentAttendees.slice(0, 4).map(a => `
    <div class="list-item">
      <div class="list-avatar">${a.name.charAt(0)}</div>
      <div class="list-info">
        <div class="list-name">${a.name}</div>
        <div class="list-sub">${a.event}</div>
      </div>
      ${attendeeStatusBadge(a.status)}
    </div>
  `).join('');
}

// ── Events Table ───────────────────────────────────────────────────────
function renderEventsTable() {
  const tbody = document.getElementById('events-tbody');
  tbody.innerHTML = events.map(e => `
    <tr>
      <td>
        <div class="td-event">
          <div class="td-thumb ${e.gradient}">${e.icon}</div>
          <div>
            <div class="td-name">${e.title}</div>
            <div class="td-sub">${e.location}</div>
          </div>
        </div>
      </td>
      <td>${e.date}</td>
      <td>${categoryBadge(e.category)}</td>
      <td>${e.attendees} / ${e.capacity}</td>
      <td>${statusBadge(e.status)}</td>
      <td>
        <div class="action-btns">
          <button class="action-btn" title="View" onclick="window.open('event-detail.html?id=${e.id}','_blank')">👁</button>
          <button class="action-btn" title="Edit">✏️</button>
          <button class="action-btn del" title="Delete">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Attendees Table ────────────────────────────────────────────────────
function renderAttendeesTable() {
  const tbody = document.getElementById('attendees-tbody');
  tbody.innerHTML = recentAttendees.map(a => `
    <tr>
      <td>
        <div class="td-event">
          <div class="td-avatar">${a.name.charAt(0)}</div>
          <div class="td-name">${a.name}</div>
        </div>
      </td>
      <td>${a.email}</td>
      <td>${a.event}</td>
      <td>${a.date}</td>
      <td>${attendeeStatusBadge(a.status)}</td>
      <td>
        <div class="action-btns">
          <button class="action-btn" title="View">👁</button>
          <button class="action-btn del" title="Delete">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Attendee status badge ──────────────────────────────────────────────
function attendeeStatusBadge(status) {
  const map = { confirmed: 'badge-green', pending: 'badge-amber' };
  return `<span class="badge ${map[status] || 'badge-slate'}">${status}</span>`;
}

// ── Popular Events List ────────────────────────────────────────────────
function renderPopularList() {
  const sorted = [...events].sort((a,b) => b.attendees - a.attendees).slice(0, 5);
  document.getElementById('popular-list').innerHTML = sorted.map((e,i) => `
    <div class="popular-item">
      <div class="popular-rank">#${i+1}</div>
      <div>
        <div class="popular-name">${e.title}</div>
        <div class="popular-att">${e.attendees} attendees</div>
      </div>
    </div>
  `).join('');
}

// ── Charts (pure canvas, no library) ──────────────────────────────────
let chartsRendered = false;
function renderCharts() {
  if (chartsRendered) return;
  chartsRendered = true;
  renderPopularList();
  drawLineChart();
  drawDonutChart();
  drawBarChart();
}

function drawLineChart() {
  const canvas = document.getElementById('chart-reg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth || 400;
  canvas.height = 220;
  const W = canvas.width, H = canvas.height;
  const data   = [40, 65, 90, 75, 120, 95, 150, 175, 210, 195, 230, 250];
  const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const pad    = { top:20, right:20, bottom:36, left:44 };
  const gW = W - pad.left - pad.right;
  const gH = H - pad.top  - pad.bottom;
  const max = Math.max(...data);

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth   = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (gH / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
  }

  // Y-axis labels
  ctx.fillStyle  = 'rgba(148,163,184,0.7)';
  ctx.font       = '11px Figtree, sans-serif';
  ctx.textAlign  = 'right';
  for (let i = 0; i <= 4; i++) {
    const val = Math.round(max - (max / 4) * i);
    const y   = pad.top + (gH / 4) * i;
    ctx.fillText(val, pad.left - 8, y + 4);
  }

  // X-axis labels
  ctx.textAlign = 'center';
  labels.forEach((lbl, i) => {
    const x = pad.left + (gW / (data.length - 1)) * i;
    ctx.fillText(lbl, x, H - 8);
  });

  // Gradient fill
  const points = data.map((v, i) => ({
    x: pad.left + (gW / (data.length - 1)) * i,
    y: pad.top  + gH - (v / max) * gH
  }));
  const grad = ctx.createLinearGradient(0, pad.top, 0, H - pad.bottom);
  grad.addColorStop(0, 'rgba(139,92,246,0.35)');
  grad.addColorStop(1, 'rgba(139,92,246,0)');
  ctx.beginPath();
  ctx.moveTo(points[0].x, H - pad.bottom);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length-1].x, H - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth   = 2.5;
  ctx.lineJoin    = 'round';
  points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.stroke();

  // Dots
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle   = '#8b5cf6';
    ctx.fill();
    ctx.strokeStyle = '#0d1526';
    ctx.lineWidth   = 2;
    ctx.stroke();
  });
}

function drawDonutChart() {
  const canvas = document.getElementById('chart-cat');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth || 400;
  canvas.height = 220;
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2 - 10, r = Math.min(W, H) * 0.32, inner = r * 0.55;

  const slices = [
    { label: 'College',    value: 4, color: '#60a5fa' },
    { label: 'SHS',        value: 2, color: '#fbbf24' },
    { label: 'Internship', value: 2, color: '#c084fc' },
  ];
  const total = slices.reduce((s, x) => s + x.value, 0);
  let angle   = -Math.PI / 2;

  slices.forEach(sl => {
    const sweep = (sl.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = sl.color;
    ctx.fill();
    angle += sweep;
  });

  // Hole
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = '#0d1526';
  ctx.fill();

  // Center label
  ctx.fillStyle  = '#ffffff';
  ctx.font       = 'bold 14px Syne, sans-serif';
  ctx.textAlign  = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Events', cx, cy - 8);
  ctx.fillStyle  = 'rgba(148,163,184,0.8)';
  ctx.font       = '11px Figtree, sans-serif';
  ctx.fillText(total + ' total', cx, cy + 10);

  // Legend
  const lgY = H - 26;
  let lgX = (W - (slices.length * 100)) / 2;
  slices.forEach(sl => {
    ctx.fillStyle = sl.color;
    ctx.beginPath(); ctx.roundRect(lgX, lgY, 10, 10, 2); ctx.fill();
    ctx.fillStyle  = 'rgba(148,163,184,0.8)';
    ctx.font       = '11px Figtree, sans-serif';
    ctx.textAlign  = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(sl.label, lgX + 14, lgY + 5);
    lgX += 100;
  });
}

function drawBarChart() {
  const canvas = document.getElementById('chart-att');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth || 400;
  canvas.height = 220;
  const W = canvas.width, H = canvas.height;

  const items  = events.slice(0, 6).map(e => ({
    label: e.title.split(' ').slice(0,2).join(' '),
    pct:   Math.round((e.attendees / e.capacity) * 100)
  }));
  const pad  = { top:16, right:16, bottom:40, left:16 };
  const gW   = W - pad.left - pad.right;
  const gH   = H - pad.top  - pad.bottom;
  const bW   = (gW / items.length) * 0.55;
  const gap  = gW / items.length;

  ctx.clearRect(0, 0, W, H);

  items.forEach((item, i) => {
    const x    = pad.left + gap * i + (gap - bW) / 2;
    const barH = (item.pct / 100) * gH;
    const y    = pad.top + gH - barH;

    // Track
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.roundRect(x, pad.top, bW, gH, 6);
    ctx.fill();

    // Fill
    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, '#8b5cf6');
    grad.addColorStop(1, '#d946ef');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, bW, barH, 6);
    ctx.fill();

    // Pct label
    ctx.fillStyle  = '#ffffff';
    ctx.font       = 'bold 11px Figtree, sans-serif';
    ctx.textAlign  = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(item.pct + '%', x + bW / 2, y - 4);

    // Event label
    ctx.fillStyle  = 'rgba(148,163,184,0.8)';
    ctx.font       = '10px Figtree, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(item.label, x + bW / 2, H - pad.bottom + 6);
  });
}

// ── Modal ──────────────────────────────────────────────────────────────
function showCreateModal() {
  document.getElementById('create-modal').style.display = 'flex';
}
function closeModal() {
  document.getElementById('create-modal').style.display = 'none';
}
function closeModalOutside(e) {
  if (e.target.id === 'create-modal') closeModal();
}
function handleCreate(e) {
  e.preventDefault();
  closeModal();
  alert('Event created successfully! (Demo – not saved to data)');
}

// ── Init ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderDashboardEvents();
  renderDashboardAttendees();
  renderEventsTable();
  renderAttendeesTable();
});
