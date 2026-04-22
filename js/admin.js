// Admin Page Logic

const BASE_URL = "http://127.0.0.1/EvenTrack/php/admin.php";

let dbEvents = [];

async function loadDbEvents() {
  try {
    const response = await fetch(`${BASE_URL}?action=get_events`);
    const data = await response.json();
    if (data.ok && data.events) {
      dbEvents = data.events;
      renderEventsTable(); 
      renderDashboardEvents(); 
    }
  } catch (err) {
    console.error("Error loading DB events", err);
  }
}

const AUTH = {
  me: `${BASE_URL}?action=me`,
  login: `${BASE_URL}?action=login`,
  register: `${BASE_URL}?action=register`,
  logout: `${BASE_URL}?action=logout`,
};
async function authFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {
      ok: false,
      error:
        "Invalid server response. Open admin via http://localhost/... (PHP required).",
    };
  }
  return { res, data };
}

function setAuthView(loggedIn) {
  const gate = document.getElementById("admin-login-gate");
  const app = document.getElementById("admin-app");
  if (!gate || !app) return;

  // change the CSS display property instead of using the hidden attribute
  if (loggedIn) {
    gate.style.display = "none";
    app.style.display = "block";
  } else {
    gate.style.display = "flex";
    app.style.display = "none";
  }
}

function clearAuthErrors() {
  ["login-error", "register-error"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = "";
      el.hidden = true;
    }
  });
}

function showAuthError(id, message) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = message;
    el.hidden = !message;
  }
}

async function initAdminAuth() {
  const { data } = await authFetch(AUTH.me, { method: "GET" });
  setAuthView(!!data.ok);
}

function setupAdminAuthUI() {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const logoutBtn = document.getElementById("admin-logout-btn");

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAuthErrors();
      const username =
        document.getElementById("login-username")?.value?.trim() || "";
      const password = document.getElementById("login-password")?.value || "";
      const { res, data } = await authFetch(AUTH.login, {
        method: "POST",
        body: JSON.stringify({ login_id: username, password }),
      });
      if (data.ok) {
        setAuthView(true);
        loginForm.reset();

        // NEW: Fetch all data immediately after a successful login!
        loadDbEvents();
        loadAdmins();
        loadRecentAttendees();
      } else {
        showAuthError(
          "login-error",
          data.error ||
            (res.status === 401
              ? "Invalid username or password."
              : "Sign in failed."),
        );
      }
    });
  }

  // Handle Admin Creation
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAuthErrors();
      const email = document.getElementById("reg-email")?.value?.trim() || "";
      const password = document.getElementById("reg-password")?.value || "";
      const confirmPassword =
        document.getElementById("reg-confirm")?.value || "";

      // NEW: Check if the email already exists in the frontend list
      const alreadyExists = dbAdmins.some(
        (admin) => admin.username.toLowerCase() === email.toLowerCase(),
      );
      if (alreadyExists) {
        showAuthError(
          "register-error",
          "This email is already in the list of admins.",
        );
        return; // Stop the form submission
      }

      const { res, data } = await authFetch(AUTH.register, {
        method: "POST",
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      if (data.ok) {
        alert(`Successfully granted admin access to: ${email}`);
        registerForm.reset();
        loadAdmins(); // Refresh table automatically
      } else {
        showAuthError(
          "register-error",
          data.error || `Could not register (${res.status}).`,
        );
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await authFetch(AUTH.logout, { method: "POST", body: "{}" });
      setAuthView(false);
    });
  }
}

// ── Tab Switching ──────────────────────────────────────────────────────
function switchTab(tabName, btn) {
  document
    .querySelectorAll(".tab-panel")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".sidebar-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("tab-" + tabName).classList.add("active");
  if (btn) btn.classList.add("active");
  if (tabName === "analytics") setTimeout(renderCharts, 50);
}

// ── Dashboard Lists ────────────────────────────────────────────────────
function renderDashboardEvents() {
  const el = document.getElementById("dash-events-list");
  
  if (!dbEvents || dbEvents.length === 0) {
    el.innerHTML = "<p style='padding: 16px; color: var(--slate-2);'>No events created yet.</p>";
    return;
  }

  // Display only the 4 most recently created real database events
  el.innerHTML = dbEvents.slice(0, 4).map((e) => `
    <div class="list-item">
      <div class="list-thumb ${e.gradient || 'grad-violet'}">${getMonogram(e.title || e.name || e.event_title)}</div>
      <div class="list-info">
        <div class="list-name">${e.title || e.name || e.event_title}</div>
        <div class="list-sub">${e.date}</div>
      </div>
      ${statusBadge(e.status || 'upcoming')}
    </div>
  `).join("");
}

async function loadRecentAttendees() {
  try {
    const response = await fetch(`${BASE_URL}?action=get_recent_attendees`, { credentials: 'include' });
    const data = await response.json();
    renderDashboardAttendees(data.ok ? data.attendees : []);
  } catch (err) {
    console.error("Error loading recent attendees", err);
  }
}

function renderDashboardAttendees(attendees) {
  const el = document.getElementById("dash-attendees-list");
  
  if (!attendees || attendees.length === 0) {
    el.innerHTML = "<p style='padding: 16px; color: var(--slate-2);'>No recent registrations yet.</p>";
    return;
  }

  // Display the 4 most recent real registrations
  el.innerHTML = attendees.map((a) => {
    const evtName = a.event_name || a.event_title || 'Unknown Event';
    const statusHtml = a.attended == 1 
        ? `<span class="badge badge-green">Present</span>` 
        : `<span class="badge badge-slate" style="text-transform:capitalize">${(a.attendance_type || 'Registered')}</span>`;
    return `
    <div class="list-item">
      <div class="list-avatar">${a.first_name.charAt(0)}</div>
      <div class="list-info">
        <div class="list-name">${a.first_name} ${a.last_name}</div>
        <div class="list-sub">${evtName}</div>
      </div>
      ${statusHtml}
    </div>
  `}).join("");
}

// ── Events Table ───────────────────────────────────────────────────────
function renderEventsTable() {
  const tbody = document.getElementById("events-tbody");

  // Combine real database events with your static placeholders from data.js
  const allEvents = [...dbEvents, ...events];

  tbody.innerHTML = allEvents
    .map(
      (e) => `
    <tr>
      <td>
        <div class="td-event">
          <div class="td-thumb ${e.gradient || "grad-violet"}">${getMonogram(e.title || e.event_title || e.name)}</div>
          <div>
            <div class="td-name">${e.title || e.event_title || e.name}</div>
            <div class="td-sub">${e.location}</div>
          </div>
        </div>
      </td>
      <td>${e.date}</td>
      <td>${categoryBadge(e.category)}</td>
      <td>${e.attendees || 0} ${e.capacity > 0 ? "/ " + e.capacity : "(Unlimited)"}</td>
      <td>${statusBadge(e.status || "upcoming")}</td>
      <td>
        <div class="action-btns">
          <button class="action-btn" title="Manage Attendees" onclick="openEventAttendees('${e.id}')">👥</button>
          <button class="action-btn" title="Edit" onclick="openEditModal('${e.id}')">✏️</button>
          <button class="action-btn del" title="Delete" onclick="deleteEvent('${e.id}')">🗑</button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("");
}

// ── Attendees Table ────────────────────────────────────────────────────
function renderAttendeesTable() {
  const tbody = document.getElementById("attendees-tbody");
  tbody.innerHTML = recentAttendees
    .map(
      (a) => `
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
  `,
    )
    .join("");
}

// ── Attendee status badge ──────────────────────────────────────────────
function attendeeStatusBadge(status) {
  const map = { confirmed: "badge-green", pending: "badge-amber" };
  return `<span class="badge ${map[status] || "badge-slate"}">${status}</span>`;
}

// ── Popular Events List ────────────────────────────────────────────────
function renderPopularList() {
  const sorted = [...events]
    .sort((a, b) => b.attendees - a.attendees)
    .slice(0, 5);
  document.getElementById("popular-list").innerHTML = sorted
    .map(
      (e, i) => `
    <div class="popular-item">
      <div class="popular-rank">#${i + 1}</div>
      <div>
        <div class="popular-name">${e.title}</div>
        <div class="popular-att">${e.attendees} attendees</div>
      </div>
    </div>
  `,
    )
    .join("");
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
  const canvas = document.getElementById("chart-reg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth || 400;
  canvas.height = 220;
  const W = canvas.width,
    H = canvas.height;
  const data = [40, 65, 90, 75, 120, 95, 150, 175, 210, 195, 230, 250];
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const pad = { top: 20, right: 20, bottom: 36, left: 44 };
  const gW = W - pad.left - pad.right;
  const gH = H - pad.top - pad.bottom;
  const max = Math.max(...data);

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (gH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();
  }

  // Y-axis labels
  ctx.fillStyle = "rgba(148,163,184,0.7)";
  ctx.font = "11px Figtree, sans-serif";
  ctx.textAlign = "right";
  for (let i = 0; i <= 4; i++) {
    const val = Math.round(max - (max / 4) * i);
    const y = pad.top + (gH / 4) * i;
    ctx.fillText(val, pad.left - 8, y + 4);
  }

  // X-axis labels
  ctx.textAlign = "center";
  labels.forEach((lbl, i) => {
    const x = pad.left + (gW / (data.length - 1)) * i;
    ctx.fillText(lbl, x, H - 8);
  });

  // Gradient fill
  const points = data.map((v, i) => ({
    x: pad.left + (gW / (data.length - 1)) * i,
    y: pad.top + gH - (v / max) * gH,
  }));
  const grad = ctx.createLinearGradient(0, pad.top, 0, H - pad.bottom);
  grad.addColorStop(0, "rgba(139,92,246,0.35)");
  grad.addColorStop(1, "rgba(139,92,246,0)");
  ctx.beginPath();
  ctx.moveTo(points[0].x, H - pad.bottom);
  points.forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, H - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = "#8b5cf6";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  points.forEach((p, i) =>
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y),
  );
  ctx.stroke();

  // Dots
  points.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#8b5cf6";
    ctx.fill();
    ctx.strokeStyle = "#0d1526";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

function drawDonutChart() {
  const canvas = document.getElementById("chart-cat");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth || 400;
  canvas.height = 220;
  const W = canvas.width,
    H = canvas.height;
  const cx = W / 2,
    cy = H / 2 - 10,
    r = Math.min(W, H) * 0.32,
    inner = r * 0.55;

  const slices = [
    { label: "College", value: 4, color: "#60a5fa" },
    { label: "SHS", value: 2, color: "#fbbf24" },
    { label: "Internship", value: 2, color: "#c084fc" },
  ];
  const total = slices.reduce((s, x) => s + x.value, 0);
  let angle = -Math.PI / 2;

  slices.forEach((sl) => {
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
  ctx.fillStyle = "#0d1526";
  ctx.fill();

  // Center label
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px Syne, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Events", cx, cy - 8);
  ctx.fillStyle = "rgba(148,163,184,0.8)";
  ctx.font = "11px Figtree, sans-serif";
  ctx.fillText(total + " total", cx, cy + 10);

  // Legend
  const lgY = H - 26;
  let lgX = (W - slices.length * 100) / 2;
  slices.forEach((sl) => {
    ctx.fillStyle = sl.color;
    ctx.beginPath();
    ctx.roundRect(lgX, lgY, 10, 10, 2);
    ctx.fill();
    ctx.fillStyle = "rgba(148,163,184,0.8)";
    ctx.font = "11px Figtree, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(sl.label, lgX + 14, lgY + 5);
    lgX += 100;
  });
}

function drawBarChart() {
  const canvas = document.getElementById("chart-att");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth || 400;
  canvas.height = 220;
  const W = canvas.width,
    H = canvas.height;

  const items = events.slice(0, 6).map((e) => ({
    label: e.title.split(" ").slice(0, 2).join(" "),
    pct: Math.round((e.attendees / e.capacity) * 100),
  }));
  const pad = { top: 16, right: 16, bottom: 40, left: 16 };
  const gW = W - pad.left - pad.right;
  const gH = H - pad.top - pad.bottom;
  const bW = (gW / items.length) * 0.55;
  const gap = gW / items.length;

  ctx.clearRect(0, 0, W, H);

  items.forEach((item, i) => {
    const x = pad.left + gap * i + (gap - bW) / 2;
    const barH = (item.pct / 100) * gH;
    const y = pad.top + gH - barH;

    // Track
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.roundRect(x, pad.top, bW, gH, 6);
    ctx.fill();

    // Fill
    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, "#8b5cf6");
    grad.addColorStop(1, "#d946ef");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, bW, barH, 6);
    ctx.fill();

    // Pct label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px Figtree, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(item.pct + "%", x + bW / 2, y - 4);

    // Event label
    ctx.fillStyle = "rgba(148,163,184,0.8)";
    ctx.font = "10px Figtree, sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText(item.label, x + bW / 2, H - pad.bottom + 6);
  });
}

// ── Modal & CRUD Logic ─────────────────────────────────────────────────
function showCreateModal() {
  const form = document.getElementById("create-form");
  form.reset();
  document.getElementById("event-id").value = ""; // Clear hidden ID
  document.getElementById("modal-title").textContent = "Create New Event";
  document.getElementById("modal-submit-btn").textContent = "Create Event";
  document.getElementById("create-modal").style.display = "flex";
}

function openEditModal(id) {
  // Prevent editing static placeholders from data.js
  if (isNaN(id)) {
    alert("This is a placeholder event and cannot be edited.");
    return;
  }

  const event = dbEvents.find((e) => String(e.id) === String(id));
  if (!event) return;

  const form = document.getElementById("create-form");
  form.reset();

  // Switch UI to "Edit" Mode
  document.getElementById("event-id").value = event.id;
  document.getElementById("modal-title").textContent = "Edit Event";
  document.getElementById("modal-submit-btn").textContent = "Save Changes";

  // Fill text fields
  form.elements["title"].value = event.name || event.title || "";
  form.elements["date"].value = event.date || "";
  form.elements["location"].value = event.location || "";
  form.elements["capacity"].value = event.capacity || "";
  form.elements["description"].value = event.description || "";

  // Fill category checkboxes (handle multiple)
  const categories = (event.category || "").split(",").map((s) => s.trim());
  form.querySelectorAll('input[name="category[]"]').forEach((cb) => {
    cb.checked =
      categories.includes(cb.value) ||
      categories.includes(cb.value === "Internship" ? "Intern" : "");
  });

  // Fill type checkboxes (handle multiple)
  const types = (event.type || "")
    .split(",")
    .map((s) => s.trim().toLowerCase());
  form.querySelectorAll('input[name="type[]"]').forEach((cb) => {
    cb.checked = types.includes(cb.value.toLowerCase());
  });

  document.getElementById("create-modal").style.display = "flex";
}

async function deleteEvent(id) {
  if (isNaN(id)) {
    alert("This is a placeholder event and cannot be deleted.");
    return;
  }

  // WARNING CONFIRMATION FOR DELETE
  if (
    !confirm(
      "Are you sure you want to delete this event? This action cannot be undone.",
    )
  ) {
    return;
  }

  const formData = new FormData();
  formData.append("id", id);

  try {
    const response = await fetch(`${BASE_URL}?action=delete_event`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.ok) {
      loadDbEvents(); // Refresh data table automatically
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    alert("Server error while deleting event.");
  }
}

function closeModal() {
  document.getElementById("create-modal").style.display = "none";
}

function closeModalOutside(e) {
  if (e.target.id === "create-modal") closeModal();
}

async function handleCreate(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Check if hidden ID field has a value to determine if editing or creating
  const isEdit = !!formData.get("id");
  const action = isEdit ? "update_event" : "create_event";

  // CONFIRMATION BEFORE APPLYING EDITS
  if (isEdit) {
    if (
      !confirm("Are you sure you want to apply these changes to the event?")
    ) {
      return; // Stop submission if they click cancel
    }
  }

  try {
    const response = await fetch(`${BASE_URL}?action=${action}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.ok) {
      closeModal();
      form.reset();
      loadDbEvents(); // Refresh table automatically
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    alert("Server error while saving event.");
  }
}

// --- ADMIN MANAGEMENT LOGIC ---
let currentEventId = null;
let currentEventAttendees = []; // Added to store data for the CSV export!

async function openEventAttendees(eventId) {
  if (isNaN(eventId)) {
    alert("This is a placeholder event from data.js. No attendees can be managed.");
    return;
  }

  currentEventId = eventId;
  switchTab("event-attendees"); 
  document.getElementById("spec-attendees-tbody").innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 24px;">Loading attendees...</td></tr>';
  document.getElementById("event-specific-stats").style.display = "none";
  
  // Hide export button while loading
  const exportBtn = document.getElementById("event-export-container");
  if (exportBtn) exportBtn.style.display = "none"; 

  try {
    const response = await fetch(`${BASE_URL}?action=get_event_attendees&event_id=${eventId}`, { credentials: "include" });
    const data = await response.json();

    if (data.ok) {
      currentEventAttendees = data.attendees; 
      const evtName = data.event ? data.event.name || data.event.event_title : "Event Attendees";
      document.getElementById("spec-event-title").textContent = evtName;
      renderEventAttendees(data.attendees);
    } else {
      document.getElementById("spec-attendees-tbody").innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--rose);">Error: ${data.error}</td></tr>`;
    }
  } catch (err) {
    document.getElementById("spec-attendees-tbody").innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--rose);">Server error while loading attendees.</td></tr>';
  }
}

function renderEventAttendees(attendees) {
  const tbody = document.getElementById("spec-attendees-tbody");
  const statsContainer = document.getElementById("event-specific-stats");
  const exportBtn = document.getElementById("event-export-container"); 

  if (!attendees || attendees.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--slate-2);">No students have registered for this event yet.</td></tr>';
    if (statsContainer) statsContainer.style.display = "none";
    if (exportBtn) exportBtn.style.display = "none";
    return;
  }

  // 1. Render Table
  tbody.innerHTML = attendees.map(a => `
    <tr>
      <td>
        <div class="td-event">
          <div class="td-avatar">${a.first_name.charAt(0)}</div>
          <div>
            <div class="td-name">${a.first_name} ${a.last_name}</div>
            <div class="td-sub">${a.email}</div>
          </div>
        </div>
      </td>
      <td>${a.section}</td>
      <td><span class="badge ${a.category === "College" ? "badge-blue" : "badge-amber"}">${a.category}</span></td>
      <td style="text-transform: capitalize;">${a.attendance_type || "N/A"}</td>
      <td>
        <span class="badge ${a.attended == 1 ? "badge-green" : "badge-slate"}">${a.attended == 1 ? "Present" : "Absent"}</span>
      </td>
      <td>
        <div style="display:flex; gap:8px; align-items:center;">
          <button class="btn ${a.attended == 1 ? "btn-outline" : "btn-primary"} btn-sm" onclick="toggleAttendance(${a.id}, ${a.attended == 1 ? 0 : 1})">
            ${a.attended == 1 ? "Mark Absent" : "Mark Present"}
          </button>
          <button class="action-btn del" title="Remove Attendee" onclick="deleteAttendee(${a.id})" style="border:none; padding:4px;">🗑</button>
        </div>
      </td>
    </tr>
  `).join("");

  // 2. Calculate Stats
  const total = attendees.length;
  const present = attendees.filter(a => a.attended == 1).length;
  const presentRate = total > 0 ? Math.round((present / total) * 100) : 0;

  const onlineRegs = attendees.filter(a => (a.attendance_type || "").toLowerCase() === 'online');
  const onlinePresent = onlineRegs.filter(a => a.attended == 1).length;
  const onlinePresentRate = onlineRegs.length > 0 ? Math.round((onlinePresent / onlineRegs.length) * 100) : 0;

  const walkinRegs = attendees.filter(a => (a.attendance_type || "").toLowerCase() === 'walkin').length;
  const walkinMix = total > 0 ? Math.round((walkinRegs / total) * 100) : 0;
  const onlineMix = total > 0 ? Math.round((onlineRegs.length / total) * 100) : 0;

  const shs = attendees.filter(a => a.category === 'SHS').length;
  const college = attendees.filter(a => a.category === 'College').length;
  
  // 3. Inject Stats UI (Using var(--font-body) to un-squish the numbers!)
  if (statsContainer) {
    statsContainer.style.display = "grid";
    if (exportBtn) exportBtn.style.display = "flex";

    statsContainer.innerHTML = `
      <div class="card stat-card" style="padding: 20px;">
        <div class="stat-change ${presentRate >= 50 ? 'up' : 'down'}">${presentRate}%</div>
        <div class="stat-val" style="font-size: 2.2rem; font-family: var(--font-body); font-weight: 800;">${present} <span style="font-size: 1.1rem; color: var(--slate-3); font-weight: 600;">/ ${total}</span></div>
        <div class="stat-label">Total Attended</div>
      </div>
      <div class="card stat-card" style="padding: 20px;">
        <div class="stat-change ${onlinePresentRate >= 50 ? 'up' : 'down'}">${onlinePresentRate}%</div>
        <div class="stat-val" style="font-size: 2.2rem; font-family: var(--font-body); font-weight: 800;">${onlinePresent} <span style="font-size: 1.1rem; color: var(--slate-3); font-weight: 600;">/ ${onlineRegs.length}</span></div>
        <div class="stat-label">Online Attendance</div>
      </div>
      <div class="card stat-card" style="padding: 20px;">
        <div class="stat-val" style="font-size: 2.2rem; font-family: var(--font-body); font-weight: 800;">${walkinMix}% <span style="font-size: 1.1rem; color: var(--slate-3); font-weight: 600;">/ ${onlineMix}%</span></div>
        <div class="stat-label">Walk-in vs Online Mix</div>
      </div>
      <div class="card stat-card" style="padding: 20px;">
        <div class="stat-val" style="font-size: 2.2rem; font-family: var(--font-body); font-weight: 800;">${shs} <span style="font-size: 1.1rem; color: var(--slate-3); font-weight: 600;">/ ${college}</span></div>
        <div class="stat-label">SHS / College Ratio</div>
      </div>
    `;
  }
}

// ── Export to Excel (CSV) ──
function exportEventCSV() {
  if (!currentEventAttendees || currentEventAttendees.length === 0) {
    alert("No attendees to export.");
    return;
  }
  
  const title = document.getElementById("spec-event-title").textContent.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Headers
  csvContent += "First Name,Last Name,Email,Section,Category,Attendance Type,Status\n";
  
  // Rows
  currentEventAttendees.forEach(a => {
    const status = a.attended == 1 ? "Present" : "Absent";
    const type = (a.attendance_type || "N/A").toUpperCase();
    const row = [a.first_name, a.last_name, a.email, a.section, a.category, type, status];
    csvContent += row.join(",") + "\n";
  });
  
  // Trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `event_export_${title}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function toggleAttendance(attendeeId, newStatus) {
  const formData = new FormData();
  formData.append("id", attendeeId);
  formData.append("status", newStatus);

  try {
    const response = await fetch(`${BASE_URL}?action=toggle_attendance`, {
      method: "POST", body: formData, credentials: "include",
    });
    const data = await response.json();
    if (data.ok) openEventAttendees(currentEventId);
    else alert("Error: " + data.error);
  } catch (err) { alert("Server error updating attendance."); }
}
let dbAdmins = [];

async function deleteAttendee(attendeeId) {
  if (!confirm("Are you sure you want to remove this student from the event?"))
    return;

  const formData = new FormData();
  formData.append("id", attendeeId);

  try {
    const response = await fetch(`${BASE_URL}?action=delete_attendee`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const data = await response.json();

    if (data.ok) {
      openEventAttendees(currentEventId); // Instantly refresh table
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    alert("Server error deleting attendee.");
  }
}

// Fetch the admins from the database
async function loadAdmins() {
  try {
    // Added credentials: 'include' so PHP knows you are logged in
    const response = await fetch(`${BASE_URL}?action=get_admins`, {
      credentials: "include",
    });
    const data = await response.json();
    if (data.ok && data.admins) {
      dbAdmins = data.admins;
      renderAdminsTable();
    }
  } catch (err) {
    console.error("Error loading admins", err);
  }
}

// Render the admins table
function renderAdminsTable() {
  const tbody = document.getElementById("admins-tbody");
  if (!tbody) return;

  tbody.innerHTML = dbAdmins
    .map(
      (admin) => `
    <tr>
      <td style="font-weight:bold; color:var(--slate-2)">#${admin.id}</td>
      <td>
        <div class="td-event">
          <div class="td-avatar">${admin.username.charAt(0).toUpperCase()}</div>
          <div class="td-name">${admin.username}</div>
        </div>
      </td>
      <td>
        <div class="action-btns">
          <button class="action-btn del" title="Revoke Access" onclick="deleteAdmin('${admin.id}')">🗑</button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("");
}

// Handle Admin Deletion
async function deleteAdmin(id) {
  if (
    !confirm(
      "Are you sure you want to revoke this user's admin access? This cannot be undone.",
    )
  ) {
    return;
  }

  const formData = new FormData();
  formData.append("id", id);

  try {
    const response = await fetch(`${BASE_URL}?action=delete_admin`, {
      method: "POST",
      body: formData,
      credentials: "include", // <--- Added this!
    });
    const data = await response.json();
    if (data.ok) {
      loadAdmins(); // Refresh the table
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    alert("Server error while deleting admin.");
  }
}

// ── Init ───────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  setupAdminAuthUI();
  await initAdminAuth();

  // Fetch data immediately if already logged in on page load
  loadDbEvents();
  loadAdmins();
  loadRecentAttendees();

  renderEventsTable();  
});
