// ── Event Detail Page ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const id    = getParam('id');
  const event = events.find(e => e.id === id);
  const main  = document.getElementById('page-content');

  if (!event) {
    main.innerHTML = `
      <div class="container not-found">
        <div class="nf-icon">😕</div>
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist.</p>
        <a href="events.html" class="btn btn-primary">Browse Events</a>
      </div>`;
    document.title = 'Not Found — EvenTrack';
    return;
  }

  document.title = `${event.title} — EvenTrack`;
  const pct = Math.round((event.attendees / event.capacity) * 100);

  main.innerHTML = `
    <!-- Banner -->
    <div class="detail-banner ${event.gradient}">
      <div class="banner-overlay"></div>
      <a href="events.html" class="back-link">
        ← Back to Events
      </a>
      <span class="detail-banner-emoji">${event.icon}</span>
    </div>

    <!-- Content -->
    <section>
      <div class="container detail-layout">
        <!-- Left -->
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

        <!-- Sidebar -->
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
                <span class="info-icon">👥</span>
                <div>
                  <div class="info-label">Attendees</div>
                  <div class="info-val">${event.attendees} / ${event.capacity}</div>
                  <div class="progress-track" style="margin-top:8px">
                    <div class="progress-fill" style="width:${pct}%"></div>
                  </div>
                </div>
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
              <a href="register.html?id=${event.id}" class="btn btn-primary btn-full">
                ${event.type === 'online' ? '🌐 Register for Online Event' : '🚶 Register for Walk-in'}
              </a>
              ${event.type === 'walkin' ? `<a href="register.html?id=${event.id}" class="btn btn-outline btn-full">💻 Join Online Instead</a>` : ''}
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
