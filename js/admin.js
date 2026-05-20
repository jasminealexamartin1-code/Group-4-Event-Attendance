// Admin Page Logic

const BASE_URL = "http://127.0.0.1/EvenTrack/php/admin.php";

// --- LOCATION DATA STRUCTURE ---
const LOCATION_DATA = {
  "2nd Floor": ["Room 201", "Room 202", "Room 203", "Room 204", "Room 205"],
  "3rd Floor": ["Room 301", "Room 302", "Room 303", "Room 304"],
  "4th Floor": ["Room 401", "Room 402", "Room 403", "Room 404"],
  "5th Floor": ["Cafeteria Main Hall"],
  "6th Floor": [
    "601",
    "602",
    "603",
    "604",
    "605",
    "606",
    "607",
    "608",
    "609",
    "610",
    "611",
    "612",
    "613",
    "614",
    "615",
    "616",
    "617",
    "Meeting Room 1",
    "Meeting Room 2",
    "Meeting Room 3",
    "Meeting Room 4",
    "Accreditation Room",
  ],
  "7th Floor": [
    "701",
    "702",
    "703",
    "704",
    "705",
    "706",
    "707",
    "708",
    "709",
    "710",
    "711",
    "712",
    "713",
    "714",
    "715",
    "716",
    "717",
    "SHS Library Extension",
  ],
  "8th Floor": [
    "801",
    "802",
    "803",
    "804",
    "805",
    "806",
    "807",
    "808",
    "809",
    "810",
    "811",
    "812",
    "813",
    "814",
    "815",
    "816",
    "817",
    "Computer Lab 1",
    "Computer Lab 2",
    "Computer Lab 3",
    "Computer Lab 4",
    "Computer Lab 5",
    "Science Lab 1",
    "Science Lab 2",
    "Audio Visual Room",
    "Main Library",
  ],
  "9th Floor": [
    "901",
    "902",
    "903",
    "904",
    "905",
    "906",
    "907",
    "908",
    "909",
    "910",
    "911",
    "912",
    "913",
    "914",
    "915",
    "916",
    "917",
    "Auditorium",
  ],
  "10th Floor": [
    "Fashion Room 1",
    "Fashion Room 2",
    "Green Room/Photography Room",
  ],
  Rooftop: ["Lower Penthouse", "Upper Penthouse", "Rooftop Open Area"],
  Virtual: ["Zoom", "Google Meet", "MS Teams", "Other Platform"],
};

// --- DEPENDENT DROPDOWN LOGIC ---
function initLocationDropdowns() {
  const floorSelect = document.getElementById("location-floor");
  if (!floorSelect) return;

  // Clear existing options except the first one
  floorSelect.innerHTML = '<option value="">Select Floor...</option>';

  // Populate the floors
  for (const floor in LOCATION_DATA) {
    floorSelect.add(new Option(floor, floor));
  }
}

// --- FORM VALIDATION LOGIC (Untangled) ---
let validateFormGlobal = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("create-form");
  if (!form) return;

  const submitBtn = document.getElementById("create-submit-btn");
  const titleInput = form.querySelector('[name="title"]');
  const dateInput = form.querySelector('[name="date"]');

  const floorSelect = document.getElementById("location-floor");
  const roomSelect = document.getElementById("location-room");

  const today = new Date().toISOString().split("T")[0];
  if (dateInput) dateInput.setAttribute("min", today);

  function toggleError(inputElement, errorId, isInvalid) {
    const errorMsg = document.getElementById(errorId);
    if (isInvalid) {
      if (inputElement) inputElement.classList.add("is-invalid");
      if (errorMsg) errorMsg.classList.add("show");
    } else {
      if (inputElement) inputElement.classList.remove("is-invalid");
      if (errorMsg) errorMsg.classList.remove("show");
    }
  }

  validateFormGlobal = function () {
    let isValid = true;

    // 1. Check Title
    if (titleInput && titleInput.value.trim().length < 3) {
      toggleError(titleInput, "title-error", true);
      isValid = false;
    } else {
      toggleError(titleInput, "title-error", false);
    }

    // 2. Check Date (Allow past dates if editing, otherwise strict)
    const isEditing = document.getElementById("event-id").value !== "";
    if (dateInput) {
      if (!dateInput.value || (!isEditing && dateInput.value < today)) {
        toggleError(dateInput, "date-error", true);
        isValid = false;
      } else {
        toggleError(dateInput, "date-error", false);
      }
    }

    // 3. Check Location Dropdowns
    if (!floorSelect.value || !roomSelect.value) {
      if (floorSelect) floorSelect.classList.add("is-invalid");
      if (roomSelect) roomSelect.classList.add("is-invalid");
      isValid = false;
    } else {
      if (floorSelect) floorSelect.classList.remove("is-invalid");
      if (roomSelect) roomSelect.classList.remove("is-invalid");
    }

    // Unlock or lock the submit button
    submitBtn.disabled = !isValid;
  };

  form.addEventListener("input", validateFormGlobal);
  form.addEventListener("change", validateFormGlobal);
});

function updateRoomDropdown() {
  const floorSelect = document.getElementById("location-floor");
  const roomSelect = document.getElementById("location-room");
  const selectedFloor = floorSelect.value;

  // Reset and disable room dropdown if no floor selected
  roomSelect.innerHTML = '<option value="">Select Room...</option>';
  if (!selectedFloor) {
    roomSelect.disabled = true;
    return;
  }

  // Enable and populate rooms based on selected floor
  roomSelect.disabled = false;
  const rooms = LOCATION_DATA[selectedFloor];
  rooms.forEach((room) => {
    roomSelect.add(new Option(room, room));
  });
}

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

      const alreadyExists = dbAdmins.some(
        (admin) => admin.username.toLowerCase() === email.toLowerCase(),
      );
      if (alreadyExists) {
        showAuthError(
          "register-error",
          "This email is already in the list of admins.",
        );
        return;
      }

      const { res, data } = await authFetch(AUTH.register, {
        method: "POST",
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      if (data.ok) {
        alert(`Successfully granted admin access to: ${email}`);
        registerForm.reset();
        loadAdmins();
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

// Tab Switching
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

// Dashboard Lists
function renderDashboardEvents() {
  const el = document.getElementById("dash-events-list");

  if (!dbEvents || dbEvents.length === 0) {
    el.innerHTML =
      "<p style='padding: 16px; color: var(--slate-2);'>No events created yet.</p>";
    return;
  }

  // Display only the 4 most recently created events
  el.innerHTML = dbEvents
    .slice(0, 4)
    .map(
      (e) => `
    <div class="list-item">
      <div class="list-thumb" style="overflow: hidden; padding: 0; background: var(--slate-4);">
  <img src="${e.image_url || "img/default-event.jpg"}" style="width: 100%; height: 100%; object-fit: cover;" alt="Thumb">
</div>
      <div class="list-info">
        <div class="list-name">${e.title || e.name || e.event_title}</div>
        <div class="list-sub">${e.date}</div>
      </div>
      ${statusBadge(e.status || "upcoming")}
    </div>
  `,
    )
    .join("");
}

async function loadRecentAttendees() {
  try {
    const response = await fetch(`${BASE_URL}?action=get_recent_attendees`, {
      credentials: "include",
    });
    const data = await response.json();
    renderDashboardAttendees(data.ok ? data.attendees : []);
  } catch (err) {
    console.error("Error loading recent attendees", err);
  }
}

function renderDashboardAttendees(attendees) {
  const el = document.getElementById("dash-attendees-list");

  if (!attendees || attendees.length === 0) {
    el.innerHTML =
      "<p style='padding: 16px; color: var(--slate-2);'>No recent registrations yet.</p>";
    return;
  }

  // Display the 4 most recent registrations
  el.innerHTML = attendees
    .map((a) => {
      const evtName = a.event_name || a.event_title || "Unknown Event";
      const statusHtml =
        a.attended == 1
          ? `<span class="badge badge-green">Present</span>`
          : `<span class="badge badge-slate" style="text-transform:capitalize">${a.attendance_type || "Registered"}</span>`;
      return `
    <div class="list-item">
      <div class="list-avatar">${a.first_name.charAt(0)}</div>
      <div class="list-info">
        <div class="list-name">${a.first_name} ${a.last_name}</div>
        <div class="list-sub">${evtName}</div>
      </div>
      ${statusHtml}
    </div>
  `;
    })
    .join("");
}

// ── Events Table ───────────────────────────────────────────────────────
function renderEventsTable() {
  const tbody = document.getElementById("events-tbody");

  const allEvents = [...dbEvents, ...events];

  tbody.innerHTML = allEvents
    .map(
      (e) => `
    <tr>
      <td>
        <div class="td-event">
         <div class="td-thumb" style="overflow: hidden; padding: 0; background: var(--slate-4);">
  <img src="${e.image_url || "img/default-event.jpg"}" style="width: 100%; height: 100%; object-fit: cover;" alt="Event">
</div>
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
          
          ${
            !isNaN(e.id)
              ? `
            <button class="action-btn" 
                    title="${e.status === "past" ? "Resume Event" : "Stop Event"}" 
                    onclick="toggleEventStatus('${e.id}', '${e.status}')" 
                    style="color: ${e.status === "past" ? "var(--emerald)" : "var(--rose)"};">
              ${e.status === "past" ? "▶️" : "🛑"}
            </button>
          `
              : ""
          }
          
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

// ── Modal & CRUD Logic ─────────────────────────────────────────────────
function showCreateModal() {
  const form = document.getElementById("create-form");
  form.reset();
  document.getElementById("event-id").value = "";
  document.getElementById("modal-title").textContent = "Create New Event";
  document.getElementById("create-submit-btn").textContent = "Create Event";
  document.getElementById("create-modal").style.display = "flex";

  initLocationDropdowns();
  updateRoomDropdown();

  document.getElementById("create-modal").style.display = "flex";
}

function openEditModal(id) {
  if (isNaN(id)) {
    alert("This is a placeholder event and cannot be edited.");
    return;
  }

  const event = dbEvents.find((e) => String(e.id) === String(id));
  if (!event) return;

  const form = document.getElementById("create-form");
  form.reset();

  document.getElementById("event-id").value = event.id;
  document.getElementById("modal-title").textContent = "Edit Event";
  document.getElementById("create-submit-btn").textContent = "Save Changes";

  // Fill text fields
  form.elements["title"].value = event.name || event.title || "";
  form.elements["date"].value = event.date || "";
  form.elements["time"].value = event.time || "";
  form.elements["capacity"].value = event.capacity || "";
  form.elements["description"].value = event.description || "";

  const locationString = event.location || "";
  document.getElementById("final-location").value = locationString;

  const parts = locationString.split(" - ");

  initLocationDropdowns();

  if (parts.length === 2 && LOCATION_DATA[parts[0]]) {
    document.getElementById("location-floor").value = parts[0];
    updateRoomDropdown();
    document.getElementById("location-room").value = parts[1];
  } else {
    document.getElementById("location-floor").value = "";
    updateRoomDropdown();
  }

  // Fill category checkboxes
  const categories = (event.category || "").split(",").map((s) => s.trim());
  form.querySelectorAll('input[name="category[]"]').forEach((cb) => {
    cb.checked =
      categories.includes(cb.value) ||
      categories.includes(cb.value === "Internship" ? "Intern" : "");
  });

  // Fill type checkboxes
  const types = (event.type || "")
    .split(",")
    .map((s) => s.trim().toLowerCase());
  form.querySelectorAll('input[name="type[]"]').forEach((cb) => {
    cb.checked = types.includes(cb.value.toLowerCase());
  });

  document.getElementById("create-modal").style.display = "flex";

  // Trigger validation so the "Save Changes" button unlocks
  if (typeof validateFormGlobal === "function") validateFormGlobal();
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

// --- TOGGLE EVENT STATUS (Stop / Resume) ---
async function toggleEventStatus(id, currentStatus) {
  if (isNaN(id)) {
    alert("This is a placeholder event and cannot be modified.");
    return;
  }

  // Determine what we are doing based on the current status
  const isStopping = currentStatus !== "past";
  const newStatus = isStopping ? "past" : "upcoming";
  const actionWord = isStopping ? "stop" : "resume";
  const confirmMsg = isStopping
    ? "Are you sure you want to STOP this event? Registration will be closed."
    : "Are you sure you want to RESUME this event? Registration will be re-opened.";

  if (!confirm(confirmMsg)) return;

  const formData = new FormData();
  formData.append("id", id);
  formData.append("status", newStatus);

  try {
    const response = await fetch(`${BASE_URL}?action=update_event_status`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const data = await response.json();

    if (data.ok) {
      alert(`Event ${actionWord}d successfully.`);
      loadDbEvents();

      if (currentEventId == id) {
        openEventAttendees(id);
      }
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    alert(`Server error while trying to ${actionWord} event.`);
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

  const floor = document.getElementById("location-floor").value;
  const room = document.getElementById("location-room").value;
  if (!floor || !room) {
    alert("Please select both a Floor and a Specific Room.");
    return;
  }

  document.getElementById("final-location").value = `${floor} - ${room}`;

  const form = e.target;
  const formData = new FormData(form);

  const isEdit = !!formData.get("id");
  const action = isEdit ? "update_event" : "create_event";

  // CONFIRMATION BEFORE APPLYING EDITS
  if (isEdit) {
    if (
      !confirm("Are you sure you want to apply these changes to the event?")
    ) {
      return;
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
      loadDbEvents();
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    alert("Server error while saving event.");
  }
}

// --- ADMIN MANAGEMENT LOGIC ---
let currentEventId = null;
let currentEventAttendees = [];

async function openEventAttendees(eventId) {
  if (isNaN(eventId)) {
    alert(
      "This is a placeholder event from data.js. No attendees can be managed.",
    );
    return;
  }

  currentEventId = eventId;
  switchTab("event-attendees");
  document.getElementById("spec-attendees-tbody").innerHTML =
    '<tr><td colspan="6" style="text-align:center; padding: 24px;">Loading attendees...</td></tr>';
  document.getElementById("event-specific-stats").style.display = "none";

  // Hide export button while loading
  const exportBtn = document.getElementById("event-export-container");
  if (exportBtn) exportBtn.style.display = "none";

  try {
    const response = await fetch(
      `${BASE_URL}?action=get_event_attendees&event_id=${eventId}`,
      { credentials: "include" },
    );
    const data = await response.json();

    if (data.ok) {
      currentEventAttendees = data.attendees;
      const evtName = data.event
        ? data.event.name || data.event.event_title
        : "Event Attendees";
      document.getElementById("spec-event-title").textContent = evtName;
      renderEventAttendees(data.attendees);
    } else {
      document.getElementById("spec-attendees-tbody").innerHTML =
        `<tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--rose);">Error: ${data.error}</td></tr>`;
    }
  } catch (err) {
    document.getElementById("spec-attendees-tbody").innerHTML =
      '<tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--rose);">Server error while loading attendees.</td></tr>';
  }
}

function renderEventAttendees(attendees) {
  const tbody = document.getElementById("spec-attendees-tbody");
  const statsContainer = document.getElementById("event-specific-stats");
  const exportBtn = document.getElementById("event-export-container");

  if (!attendees || attendees.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--slate-2);">No students have registered for this event yet.</td></tr>';
    if (statsContainer) statsContainer.style.display = "none";
    if (exportBtn) exportBtn.style.display = "none";
    return;
  }

  // 1. Render Table
  tbody.innerHTML = attendees
    .map(
      (a) => `
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
  `,
    )
    .join("");

  // 2. Calculate Stats
  const total = attendees.length;
  const present = attendees.filter((a) => a.attended == 1).length;
  const presentRate = total > 0 ? Math.round((present / total) * 100) : 0;

  const onlineRegs = attendees.filter(
    (a) => (a.attendance_type || "").toLowerCase() === "online",
  );
  const onlinePresent = onlineRegs.filter((a) => a.attended == 1).length;
  const onlinePresentRate =
    onlineRegs.length > 0
      ? Math.round((onlinePresent / onlineRegs.length) * 100)
      : 0;

  const walkinRegs = attendees.filter(
    (a) => (a.attendance_type || "").toLowerCase() === "walkin",
  ).length;
  const walkinMix = total > 0 ? Math.round((walkinRegs / total) * 100) : 0;
  const onlineMix =
    total > 0 ? Math.round((onlineRegs.length / total) * 100) : 0;

  const shs = attendees.filter((a) => a.category === "SHS").length;
  const college = attendees.filter((a) => a.category === "College").length;

  // 3. Inject Stats UI
  if (statsContainer) {
    statsContainer.style.display = "grid";
    if (exportBtn) exportBtn.style.display = "flex";

    statsContainer.innerHTML = `
      <div class="card stat-card" style="padding: 20px;">
        <div class="stat-change ${presentRate >= 50 ? "up" : "down"}">${presentRate}%</div>
        <div class="stat-val" style="font-size: 2.2rem; font-family: var(--font-body); font-weight: 800;">${present} <span style="font-size: 1.1rem; color: var(--slate-3); font-weight: 600;">/ ${total}</span></div>
        <div class="stat-label">Total Attended</div>
      </div>
      <div class="card stat-card" style="padding: 20px;">
        <div class="stat-change ${onlinePresentRate >= 50 ? "up" : "down"}">${onlinePresentRate}%</div>
        <div class="stat-val" style="font-size: 2.2rem; font-family: var(--font-body); font-weight: 800;">${onlinePresent} <span style="font-size: 1.1rem; color: var(--slate-3); font-weight: 600;">/ ${onlineRegs.length}</span></div>
        <div class="stat-label">Online Attendance</div>
      </div>
      <div class="card stat-card" style="padding: 20px;">
        <div class="stat-val" style="font-size: 2.2rem; font-family: var(--font-body); font-weight: 800;">${walkinMix}% <span style="font-size: 1.1rem; color: var(--slate-3); font-weight: 600;">/ ${onlineMix}%</span></div>
        <div class="stat-label">Walk-in vs Online Mix</div>
      </div>
      <div class="card stat-card" style="padding: 20px;">
        <div class="stat-val" style="font-size: 2.2rem; font-family: var(--font-body); font-weight: 800;">${shs} <span style="font-size: 1.1rem; color: var(--slate-3); font-weight: 600;">: ${college}</span></div>
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

  const title = document
    .getElementById("spec-event-title")
    .textContent.replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();
  let csvContent = "data:text/csv;charset=utf-8,";

  // Headers
  csvContent +=
    "First Name,Last Name,Email,Section,Category,Attendance Type,Status\n";

  // Rows
  currentEventAttendees.forEach((a) => {
    const status = a.attended == 1 ? "Present" : "Absent";
    const type = (a.attendance_type || "N/A").toUpperCase();
    const row = [
      a.first_name,
      a.last_name,
      a.email,
      a.section,
      a.category,
      type,
      status,
    ];
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
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const data = await response.json();
    if (data.ok) openEventAttendees(currentEventId);
    else alert("Error: " + data.error);
  } catch (err) {
    alert("Server error updating attendance.");
  }
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
      openEventAttendees(currentEventId);
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
      credentials: "include",
    });
    const data = await response.json();
    if (data.ok) {
      loadAdmins();
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    alert("Server error while deleting admin.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  setupAdminAuthUI();
  await initAdminAuth();

  loadDbEvents();
  loadAdmins();
  loadRecentAttendees();

  renderEventsTable();
});
