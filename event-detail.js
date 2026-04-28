// ── Event Detail Page ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  const id = getParam("id");
  const main = document.getElementById("page-content");

  // 1. Fetch live events from DB using the FULL PATH
  let dbEvents = [];
  try {
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
        fullDescription: e.description || "No detailed description available.",
        attendees: e.attendees || 0,
        capacity: e.capacity || 100,
        type: e.type || "walkin",
        time: e.time || "TBA",
        category:
          e.category === "Intern" ? "Internship" : e.category || "College",
      }));
    }
  } catch (err) {
    console.error(err);
  }

  // 2. Combine DB events with static placeholders
  const allEvents = [...dbEvents, ...events];

  // 3. Find event (Using String() so '1' matches 1)
  const event = allEvents.find((e) => String(e.id) === String(id));

  if (!event) {
    main.innerHTML = `
      <div class="container not-found">
        <div class="nf-icon">😕</div>
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist.</p>
        <a href="events.html" class="btn btn-primary">Browse Events</a>
      </div>`;
    document.title = "Not Found — EvenTrack";
    return;
  }

  document.title = `${event.title} — EvenTrack`;
  const pct = Math.round((event.attendees / event.capacity) * 100);

  // Exclusive AND Inclusive button logic
  const typesStr = (event.type || "walkin").toLowerCase();
  const hasOnline = typesStr.includes("online");
  const hasWalkin = typesStr.includes("walkin");

  let sidebarBtnsHtml = "";
  if (hasOnline && hasWalkin) {
    sidebarBtnsHtml = `
     <a href="register.html?id=${event.id}&type=walkin" class="btn btn-primary btn-full">🚶 Register for Walk-in</a>
     <a href="register.html?id=${event.id}&type=online" class="btn btn-outline btn-full">🌐 Join Online Instead</a>
   `;
  } else if (hasOnline) {
    sidebarBtnsHtml = `<a href="register.html?id=${event.id}&type=online" class="btn btn-primary btn-full">🌐 Register for Online Event</a>`;
  } else {
    sidebarBtnsHtml = `<a href="register.html?id=${event.id}&type=walkin" class="btn btn-primary btn-full">🚶 Register for Walk-in</a>`;
  }

  main.innerHTML = `
    <div class="detail-banner ${event.gradient}">
      <div class="banner-overlay"></div>
      <a href="events.html" class="back-link">
        ← Back to Events
      </a>
      <span class="detail-banner-emoji">${event.monogram}</span>
    </div>

    <section>
      <div class="container detail-layout">
        <div>
          <div class="detail-badges">
            ${statusBadge(event.status)}
            ${typeBadge(event.type)}
          </div>
          <h1 class="detail-title">${event.title}</h1>
          <p class="detail-desc">${event.description}</p>

          <div class="detail-block" style="margin-top:32px">
            <h2>About This Event</h2>
            <p style="line-height:1.75;color:var(--slate-1)">${event.fullDescription}</p>
          </div>

          <div class="detail-block">
            <h2>What You'll Get</h2>
            <div class="perks-grid">
              <div class="perk-item"><span style="font-size:1.4rem">📚</span> Comprehensive learning materials</div>
              <div class="perk-item"><span style="font-size:1.4rem">🎁</span> Event swag and goodies</div>
              <div class="perk-item"><span style="font-size:1.4rem">🤝</span> Networking opportunities</div>
              <div class="perk-item"><span style="font-size:1.4rem">📜</span> Certificate of attendance</div>
            </div>
          </div>
        </div>

        <aside class="detail-sidebar">
          <div class="sidebar-card">
            <h3>Event Details</h3>
            <div class="detail-info-list">
              <div class="detail-info-row">
                <span class="info-icon">📅</span>
                <div>
                  <div class="info-label">Date &amp; Time</div>
                  <div class="info-val">${event.date}</div>
                  <div class="info-sub">${event.time}</div>
                </div>
              </div>
              <div class="detail-info-row">
                <span class="info-icon">📍</span>
                <div>
                  <div class="info-label">Location</div>
                  <div class="info-val">${event.location}</div>
                </div>
              </div>
              <div class="detail-info-row">
              </div>
              <div class="detail-info-row">
                <span class="info-icon">🏷️</span>
                <div>
                  <div class="info-label">Category</div>
                  <div class="info-val">${event.category}</div>
                </div>
              </div>
            </div>

            <div class="sidebar-btns">
              ${sidebarBtnsHtml}
            </div>

            <div class="info-note">
              <span style="font-size:1.2rem">ℹ️</span>
              <span>You'll receive a confirmation email with event details and QR code after registration.</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  `;
});
