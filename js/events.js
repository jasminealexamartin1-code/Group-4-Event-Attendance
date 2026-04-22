// ── Events Page Logic ──────────────────────────────────────────────────
let selectedCategories = ["All"];
let selectedTypes = ["All"];
let allEvents = [];

const categories = ["All", "College", "SHS", "Internship"];
const types = ["All", "online", "walkin"];

function renderFilters() {
  const catEl = document.getElementById("category-filters");
  const typeEl = document.getElementById("type-filters");

  catEl.innerHTML = categories
    .map(
      (c) => `
    <button class="filter-btn ${selectedCategories.includes(c) ? "active-cat" : ""}"
      onclick="filterCategory('${c}')">${c}</button>
  `,
    )
    .join("");

  typeEl.innerHTML = types
    .map(
      (t) => `
    <button class="filter-btn ${selectedTypes.includes(t) ? "active-type" : ""}"
      onclick="filterType('${t}')">${t === "walkin" ? "Walk-in" : t.charAt(0).toUpperCase() + t.slice(1)}</button>
  `,
    )
    .join("");
}

function filterCategory(c) {
  if (c === "All") {
    selectedCategories = ["All"];
  } else {
    // Remove 'All' if a specific category is clicked
    selectedCategories = selectedCategories.filter((cat) => cat !== "All");

    // Toggle the clicked category
    if (selectedCategories.includes(c)) {
      selectedCategories = selectedCategories.filter((cat) => cat !== c);
    } else {
      selectedCategories.push(c);
    }

    // Default back to 'All' if everything is deselected
    if (selectedCategories.length === 0) selectedCategories = ["All"];
  }
  render();
}

function filterType(t) {
  if (t === "All") {
    selectedTypes = ["All"];
  } else {
    // Remove 'All' if a specific type is clicked
    selectedTypes = selectedTypes.filter((type) => type !== "All");

    // Toggle the clicked type
    if (selectedTypes.includes(t)) {
      selectedTypes = selectedTypes.filter((type) => type !== t);
    } else {
      selectedTypes.push(t);
    }

    // Default back to 'All' if everything is deselected
    if (selectedTypes.length === 0) selectedTypes = ["All"];
  }
  render();
}

function getFiltered() {
  return allEvents.filter((e) => {
    const eCat = e.category || "";
    const eType = e.type || "";

    // Check if the event matches ANY of the selected categories
    const cm =
      selectedCategories.includes("All") ||
      selectedCategories.some((cat) => eCat.includes(cat));

    // Check if the event matches ANY of the selected types
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
  const filtered = getFiltered();
  const grid = document.getElementById("events-grid");
  const empty = document.getElementById("no-events");

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
          <div class="meta-row">
            <span class="meta-icon">📅</span>
            <span>${e.date} • ${e.time}</span>
          </div>
          <div class="meta-row">
            <span class="meta-icon">📍</span>
            <span>${e.location}</span>
          </div>
        </div>
      </div>
    </a>
  `;
}
document.addEventListener("DOMContentLoaded", async () => {
  let dbEvents = [];
  try {
    // 1. MUST USE THE FULL LOCALHOST PATH
    const res = await fetch(
      "http://127.0.0.1/EvenTrack/php/admin.php?action=get_events",
    );
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
        // 2. Added fallbacks so your filters and UI don't break
        type: e.type || "walkin",
        time: e.time || "TBA",
        category:
          e.category === "Intern" ? "Internship" : e.category || "College",
      }));
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }

  allEvents = [...dbEvents, ...events]; // Merge them!
  render(); // Now render the grid
});
