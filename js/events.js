// Events Page
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
    .map(
      (c) =>
        `<button class="filter-btn ${selectedCategories.includes(c) ? "active-cat" : ""}" onclick="filterCategory('${c}')">${c}</button>`,
    )
    .join("");

  typeEl.innerHTML = types
    .map(
      (t) =>
        `<button class="filter-btn ${selectedTypes.includes(t) ? "active-type" : ""}" onclick="filterType('${t}')">${t === "walkin" ? "Walk-in" : t.charAt(0).toUpperCase() + t.slice(1)}</button>`,
    )
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

// Applies category and type filters to a given list of events
function getFiltered(eventsToFilter) {
  return eventsToFilter.filter((e) => {
    const eCat = e.category || "";
    const eType = e.type || "";
    const cm =
      selectedCategories.includes("All") ||
      selectedCategories.some((cat) => eCat.includes(cat));
    const tm =
      selectedTypes.includes("All") ||
      selectedTypes.some((type) =>
        eType.toLowerCase().includes(type.toLowerCase()),
      );
    return cm && tm;
  });
}

function render() {
  renderFilters();
  const grid = document.getElementById("events-grid");
  const empty = document.getElementById("no-events");
  const gridSection = document.getElementById("grid-section");
  const calendarPrompt = document.getElementById("calendar-prompt");

  // 1. Hide grid until a date is selected from the calendar
  if (!selectedDate) {
    if (gridSection) gridSection.style.display = "none";
    if (calendarPrompt) calendarPrompt.style.display = "block";
    return;
  }

  // 2. Only show events for the selected date
  const dateEvents = allEvents.filter((e) => {
    let rawDate = e.date || e.event_date;
    if (!rawDate) return false;

    const dateOnly = String(rawDate).trim().split(" ")[0];
    const d = new Date(dateOnly);

    if (isNaN(d)) return false;
    return d.toISOString().slice(0, 10) === selectedDate;
  });

  // 3. Apply category and type filters to those specific daily events
  const filtered = getFiltered(dateEvents);

  if (gridSection) gridSection.style.display = "block";
  if (calendarPrompt) calendarPrompt.style.display = "none";

  if (!filtered.length) {
    grid.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  grid.innerHTML = filtered.map((e) => eventCard(e)).join("");
}

function eventCard(e) {
  const isPast = e.status === "past";

  // 1. Check if an image exists. If yes, draw an <img> tag. If no, draw the monogram.
  let thumbContent = "";
  let thumbStyle = "";

  if (e.image_url && e.image_url.trim() !== "") {
    // Show the uploaded image
    thumbContent = `<img src="${e.image_url}" alt="${e.title}" style="width: 100%; height: 100%; object-fit: cover;">`;
    thumbStyle = "padding: 0; overflow: hidden;"; // Removes padding so image hits the edges
  } else {
    // Fallback to the colored box with letters
    thumbContent = `<span class="event-thumb-emoji">${e.monogram}</span>`;
  }

  // 2. Return the HTML card
  return `
    <a href="${isPast ? "javascript:void(0)" : `event-detail.html?id=${e.id}`}" 
       class="card event-card ${isPast ? "past-event" : ""}">
      
      <div class="event-thumb ${e.image_url ? "" : e.gradient}" style="${thumbStyle}">
        ${thumbContent}
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

// Calendar Logic
let calYear, calMonth;

function initCalendar() {
  const today = new Date();
  calYear = today.getFullYear();
  calMonth = today.getMonth();
  renderCalendar();

  document.getElementById("cal-prev").addEventListener("click", () => {
    calMonth--;
    if (calMonth < 0) {
      calMonth = 11;
      calYear--;
    }
    renderCalendar();
  });
  document.getElementById("cal-next").addEventListener("click", () => {
    calMonth++;
    if (calMonth > 11) {
      calMonth = 0;
      calYear++;
    }
    renderCalendar();
  });
}

function getEventDatesMap() {
  const map = {};
  allEvents.forEach((e) => {
    let rawDate = e.date || e.event_date;
    if (!rawDate) return;

    const dateOnly = String(rawDate).trim().split(" ")[0];
    const d = new Date(dateOnly);

    if (isNaN(d)) return;
    const key = d.toISOString().slice(0, 10);
    if (!map[key]) map[key] = [];
    map[key].push(e);
  });
  return map;
}

function renderCalendar() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  document.getElementById("cal-title").textContent =
    `${monthNames[calMonth]} ${calYear}`;

  const body = document.getElementById("cal-body");
  if (!body) return;
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
    const dateKey = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
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
      document
        .getElementById("grid-section")
        .scrollIntoView({ behavior: "smooth" });
    });

    body.appendChild(btn);
  }

  if (selectedDate)
    showDateEvents(selectedDate, getEventDatesMap()[selectedDate] || []);
}

function showDateEvents(dateKey, evts) {
  const label = document.getElementById("date-events-label");
  const list = document.getElementById("date-events-list");
  if (!label || !list) return;

  const d = new Date(dateKey + "T00:00:00");
  label.textContent = d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (!evts.length) {
    list.innerHTML = `<div class="no-date-events">No events on this day</div>`;
    return;
  }
  list.innerHTML = evts
    .map(
      (e) => `
    <a href="${e.status === "past" ? "javascript:void(0)" : `event-detail.html?id=${e.id}`}" class="date-event-item">
      <div class="date-event-dot"></div>
      <span class="date-event-name">${e.title}</span>
      <span class="date-event-time">${e.time || "TBA"}</span>
    </a>
  `,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  let dbEvents = [];
  try {
    const res = await fetch(
      "http://localhost/EvenTrack/php/admin.php?action=get_events",
    );
    const rawText = await res.text();

    try {
      const data = JSON.parse(rawText);
      if (data.ok && data.events) {
        dbEvents = data.events.map((e) => {
          const eventName = e.title || e.event_title || e.name || "Untitled";
          return {
            ...e,
            title: eventName,
            date: e.date || e.event_date,
            time: e.time || e.event_time || "TBA",
            image_url: e.image_url || null,
            monogram: eventName.substring(0, 2).toUpperCase(),
            gradient: e.gradient || "grad-violet",
            attendees: e.attendees || 0,
            capacity: e.capacity || 100,
            status: e.status || "upcoming",
            type: e.type || "walkin",
            category:
              e.category === "Intern" ? "Internship" : e.category || "College",
          };
        });
      } else {
        console.error("API returned an error:", data.error);
      }
    } catch (parseError) {
      alert(
        "PHP Server Error! The backend sent bad data. Check your console.\n\n" +
          rawText.substring(0, 100),
      );
      console.error("Raw PHP Output:", rawText);
    }
  } catch (err) {
    console.error("Network Error: Could not reach the database.", err);
  }

  allEvents = [...dbEvents, ...events];
  render();
  initCalendar();
});
