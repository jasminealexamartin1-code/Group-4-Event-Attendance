// ── Register Page ──────────────────────────────────────────────────────
let attendanceType = 'online';

document.addEventListener('DOMContentLoaded', () => {
  const id    = getParam('id');
  const event = events.find(e => e.id === id);
  const main  = document.getElementById('page-content');

  if (!event) {
    main.innerHTML = `
      <div class="container" style="text-align:center;padding:120px 0">
        <div style="font-size:4rem;margin-bottom:16px">😕</div>
        <h2>Event Not Found</h2>
        <p style="margin-bottom:24px">The event you're trying to register for doesn't exist.</p>
        <a href="events.html" class="btn btn-primary">Browse Events</a>
      </div>`;
    return;
  }

  attendanceType = event.type;
  document.title = `Register: ${event.title} — EvenTrack`;
  renderForm(event, main);
});

function renderForm(event, container) {
  container.innerHTML = `
    <div class="register-wrap">
      <a onclick="history.back()" class="register-back">← Back</a>
      <div class="register-header">
        <h1>Register for <span class="gradient-text">${event.title}</span></h1>
        <p>Fill out the form below to secure your spot at this amazing event.</p>
      </div>

      <form id="reg-form">
        <!-- Personal Info -->
        <div class="form-panel">
          <div class="form-section">
            <h3>Personal Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">First Name *</label>
                <input type="text" class="form-input" placeholder="Juan" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Last Name *</label>
                <input type="text" class="form-input" placeholder="Dela Cruz" required/>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="form-section">
            <h3>Contact Information</h3>
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" class="form-input" placeholder="juan@example.com" required/>
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="tel" class="form-input" placeholder="+63 912 345 6789" required/>
            </div>
          </div>

          <!-- Additional -->
          <div class="form-section">
            <h3>Additional Details</h3>
            <div class="form-group">
              <label class="form-label">Organization / School *</label>
              <input type="text" class="form-input" placeholder="Your school or organization" required/>
            </div>
            <div class="form-group">
              <label class="form-label">Role / Year Level *</label>
              <select class="form-input" required>
                <option value="">Select your role/year</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
                <option>1st Year College</option>
                <option>2nd Year College</option>
                <option>3rd Year College</option>
                <option>4th Year College</option>
                <option>Professional</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <!-- Attendance Type -->
          <div class="form-section">
            <h3>Attendance Type</h3>
            <div class="attendance-grid">
              <button type="button" id="btn-online" onclick="setAttend('online')"
                class="attend-btn ${attendanceType === 'online' ? 'active' : ''}">
                <div class="attend-emoji">🌐</div>
                <div class="attend-label">Online</div>
                <div class="attend-sub">Join virtually from anywhere</div>
              </button>
              <button type="button" id="btn-walkin" onclick="setAttend('walkin')"
                class="attend-btn ${attendanceType === 'walkin' ? 'active' : ''}">
                <div class="attend-emoji">🚶</div>
                <div class="attend-label">Walk-in</div>
                <div class="attend-sub">Attend in person at the venue</div>
              </button>
            </div>
          </div>

          <!-- Special Requirements -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label">Special Requirements (Optional)</label>
              <textarea class="form-input" rows="4"
                placeholder="Dietary restrictions, accessibility needs, etc."></textarea>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-full btn-lg">
          Complete Registration
        </button>
      </form>
    </div>
  `;

  document.getElementById('reg-form').addEventListener('submit', function(e) {
    e.preventDefault();
    showSuccess(event);
  });
}

function setAttend(type) {
  attendanceType = type;
  document.getElementById('btn-online').classList.toggle('active', type === 'online');
  document.getElementById('btn-walkin').classList.toggle('active', type === 'walkin');
}

function showSuccess(event) {
  const main = document.getElementById('page-content');
  main.innerHTML = `
    <div class="success-wrap">
      <div class="success-card">
        <div class="success-icon">✅</div>
        <h2>Registration Successful!</h2>
        <p>You're all set for <strong style="color:var(--white)">${event.title}</strong>.
           A confirmation email has been sent with all event details and your unique QR code.</p>
        <div class="success-summary">
          <div class="summary-row"><span class="key">Event</span><span class="val">${event.title}</span></div>
          <div class="summary-row"><span class="key">Date</span><span class="val">${event.date}</span></div>
          <div class="summary-row"><span class="key">Time</span><span class="val">${event.time}</span></div>
          <div class="summary-row"><span class="key">Type</span><span class="val" style="text-transform:capitalize">${attendanceType}</span></div>
        </div>
        <div class="success-actions">
          <a href="events.html" class="btn btn-primary" style="flex:1">Browse More Events</a>
          <a href="index.html"  class="btn btn-outline" style="flex:1">Back to Home</a>
        </div>
      </div>
    </div>
  `;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
