// ── Events Page Logic ──────────────────────────────────────────────────
let selectedCategories = ["All"];
let selectedTypes = ["All"];
let allEvents = [];
let selectedDate = null;

const categories = ["All", "College", "SHS", "Internship"];
const types = ["All", "online", "walkin"];

function renderFilters() {
  const catEl = document.getElementById("category-filters");
  const typeEl = document.getElementById("type-filters");

  catEl.innerHTML = categories
    .map((c) => `<button class="filter-btn ${selectedCategories.includes(c) ? "active-cat" : ""}" onclick="filterCategory('${c}')">${c}</button>`)
    .join("");

  typeEl.innerHTML = types
    .map((t) => `<button class="filter-btn ${selectedTypes.includes(t) ? "active-type" : ""}" onclick="filterType('${t}')">${t === "walkin" ? "Walk-in" : t.charAt(0).toUpperCase() + t.slice(1)}</button>`)
    .join("");
}

function filterCategory(c) {
  if (c === "All") {
    selectedCategories = ["All"];
  } else {
    selectedCategories = selectedCategories.filter((cat) => cat !== "All");
    if (selectedCategories.includes(c)) {
      selectedCategories = selectedCategories.filter((cat) => cat !== c);
    } else {
      selectedCategories.push(c);
    }
    if (selectedCategories.length === 0) selectedCategories = ["All"];
  }
  render();
}

function filterType(t) {
  if (t === "All") {
    selectedTypes = ["All"];
  } else {
    selectedTypes = selectedTypes.filter((type) => type !== "All");
    if (selectedTypes.includes(t)) {
      selectedTypes = selectedTypes.filter((type) => type !== t);
    } else {
      selectedTypes.push(t);
    }
    if (selectedTypes.length === 0) selectedTypes = ["All"];
  }
  render();
}

function getFiltered(eventsToFilter) {
  return eventsToFilter.filter((e) => {
    const eCat = e.category || "";
    const eType = e.type || "";
    const cm = selectedCategories.includes("All") || selectedCategories.some((cat) => eCat.includes(cat));
    const tm = selectedTypes.includes("All") || selectedTypes.some((type) => eType.toLowerCase().includes(type.toLowerCase()));
    return cm && tm;
  });
}

function render() {
  renderFilters();
  const grid = document.getElementById("events-grid");
  const empty = document.getElementById("no-events");
  const gridSection = document.getElementById("grid-section");
  const calendarPrompt = document.getElementById("calendar-prompt");

  // Hide grid until a date is selected
  if (!selectedDate) {
    gridSection.style.display = "none";
    calendarPrompt.style.display = "block";
    return;
  }

  // Only show events for the selected date
  const dateEvents = allEvents.filter((e) => {
    if (!e.date) return false;
    const d = new Date(e.date.trim());
    if (isNaN(d)) return false;
    return d.toISOString().slice(0, 10) === selectedDate;
  });

  const filtered = getFiltered(dateEvents);

  gridSection.style.display = "block";
  calendarPrompt.style.display = "none";

  if (!filtered.length) {
    grid.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
  grid.innerHTML = filtered.map((e) => eventCard(e)).join("");
}

function eventCard(e) {
  return `
    <a href="event-detail.html?id=${e.id}" class="card event-card">
      <div class="event-thumb ${e.gradient}">
        <span class="event-thumb-emoji">${e.monogram}</span>
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
          <div class="meta-row"><span class="meta-icon">📅</span><span>${e.date} • ${e.time}</span></div>
          <div class="meta-row"><span class="meta-icon">📍</span><span>${e.location}</span></div>
        </div>
      </div>
    </a>
  `;
}

// ── Calendar ──────────────────────────────────────────────────────────
let calYear, calMonth;

function initCalendar() {
  const today = new Date();
  calYear = today.getFullYear();
  calMonth = today.getMonth();
  renderCalendar();

  document.getElementById("cal-prev").addEventListener("click", () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar();
  });
  document.getElementById("cal-next").addEventListener("click", () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCalendar();
  });
}

function getEventDatesMap() {
  const map = {};
  allEvents.forEach(e => {
    if (!e.date) return;
    const d = new Date(e.date.trim());
    if (isNaN(d)) return;
    const key = d.toISOString().slice(0, 10);
    if (!map[key]) map[key] = [];
    map[key].push(e);
  });
  return map;
}

function renderCalendar() {
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  document.getElementById("cal-title").textContent = `${monthNames[calMonth]} ${calYear}`;

  const body = document.getElementById("cal-body");
  body.innerHTML = "";

  const eventMap = getEventDatesMap();
  const todayKey = new Date().toISOString().slice(0, 10);
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "cal-day empty";
    body.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const btn = document.createElement("button");
    btn.className = "cal-day";
    btn.textContent = d;

    if (dateKey === todayKey) btn.classList.add("today");
    if (dateKey === selectedDate) btn.classList.add("selected");
    if (eventMap[dateKey]) btn.classList.add("has-event");

    btn.addEventListener("click", () => {
      selectedDate = dateKey;
      renderCalendar();
      showDateEvents(dateKey, eventMap[dateKey] || []);
      render();
      document.getElementById("grid-section").scrollIntoView({ behavior: "smooth" });
    });

    body.appendChild(btn);
  }

  if (selectedDate) showDateEvents(selectedDate, getEventDatesMap()[selectedDate] || []);
}

function showDateEvents(dateKey, evts) {
  const label = document.getElementById("date-events-label");
  const list = document.getElementById("date-events-list");
  const d = new Date(dateKey + "T00:00:00");
  label.textContent = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  if (!evts.length) {
    list.innerHTML = `<div class="no-date-events">No events on this day</div>`;
    return;
  }
  list.innerHTML = evts.map(e => `
    <a href="event-detail.html?id=${e.id}" class="date-event-item">
      <div class="date-event-dot"></div>
      <span class="date-event-name">${e.title}</span>
      <span class="date-event-time">${e.time || "TBA"}</span>
    </a>
  `).join("");
}

// ── Init ──────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  let dbEvents = [];
  try {
    const res = await fetch("http://127.0.0.1/EvenTrack/php/admin.php?action=get_events");
    const data = await res.json();
    if (data.ok && data.events) {
      dbEvents = data.events.map((e) => ({
        ...e,
        title: e.title || e.event_title || e.name,
        monogram: getMonogram(e.title || e.event_title || e.name),
        gradient: e.gradient || "grad-violet",
        attendees: e.attendees || 0,
        capacity: e.capacity || 100,
        status: e.status || "upcoming",
        type: e.type || "walkin",
        time: e.time || "TBA",
        category: e.category === "Intern" ? "Internship" : e.category || "College",
      }));
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }

  allEvents = [...dbEvents, ...events];
  render();
  initCalendar();
});