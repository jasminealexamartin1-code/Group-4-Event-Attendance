// ── Register Page ──────────────────────────────────────────────────────
let attendanceType = "walkin";
let currentEvent = null;

document.addEventListener("DOMContentLoaded", async () => {
  const id = getParam("id");
  attendanceType = getParam("type") || "walkin";
  const main = document.getElementById("page-content");

  let dbEvents = [];
  try {
    const res = await fetch("http://127.0.0.1/EvenTrack/php/admin.php?action=get_events");
    const data = await res.json();
    if (data.ok && data.events) {
      dbEvents = data.events.map((e) => ({
        ...e,
        title: e.title || e.event_title || e.name,
        type: e.type || "walkin",
        time: e.time || "TBA",
        date: e.date || "TBA",
        category: e.category === "Intern" ? "Internship" : e.category || "College",
      }));
    }
  } catch (err) {
    console.error(err);
  }

  const allEvents = [...dbEvents, ...events];
  const event = allEvents.find((e) => String(e.id) === String(id));
  if (!event) {
    main.innerHTML = `<div class="container" style="text-align:center;padding:120px 0"><h2>Event Not Found</h2></div>`;
    return;
  }

  currentEvent = event;
  document.title = `Register: ${event.title} — EvenTrack`;
  renderForm(event, main);
});

// ── Year level validation ─────────────────────────────────────────────
// Returns an error message string if invalid, or null if OK
function validateYearLevel(yearLevel, eventCategory) {
  const cat = (eventCategory || "").toLowerCase();
  const yl = (yearLevel || "").toLowerCase();

  const isSHSLevel = yl.includes("grade");
  const isCollegeLevel = yl.includes("year college") || yl === "professional" || yl === "other";
  const isInternshipLevel = yl.includes("year college") || yl === "professional"; // internship = college level

  // Event is SHS only
  if (cat === "shs" && !isSHSLevel) {
    return "This event is for SHS students only (Grade 11 or Grade 12). College students cannot register.";
  }

  // Event is College only
  if (cat === "college" && isSHSLevel) {
    return "This event is for College students only. SHS students (Grade 11/12) cannot register.";
  }

  // Event is Internship (college students only)
  if (cat === "internship" && isSHSLevel) {
    return "This event is for College/Internship students only. SHS students cannot register.";
  }

  return null; // Valid
}

function renderForm(event, container) {
  container.innerHTML = `
    <div class="register-wrap">
      <a onclick="history.back()" class="register-back">← Back</a>
      <div class="register-header">
        <h1>Register for <span class="gradient-text">${event.title}</span></h1>
        <p>Fill out the form below to secure your spot at this amazing event.</p>
        <div id="eligibility-note" style="
          margin-top: 12px;
          padding: 10px 16px;
          background: #e8eeff;
          border-radius: 10px;
          font-size: 0.85rem;
          color: #0a2463;
          font-weight: 600;
        ">
          📋 This event is for: <strong>${event.category}</strong> students
        </div>
      </div>

      <form id="reg-form">
        <div class="form-panel">
          <div class="form-section">
            <h3>Personal Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">First Name *</label>
                <input type="text" name="first_name" class="form-input" placeholder="Juan" required/>
              </div>
              <div class="form-group" style="margin-top: 0;">
                <label class="form-label">Last Name *</label>
                <input type="text" name="last_name" class="form-input" placeholder="Dela Cruz" required/>
              </div>
            </div>
            <div class="form-group" style="margin-top: 16px;">
              <label class="form-label">Email Address *</label>
              <input type="email" name="email" class="form-input" placeholder="juan@iacademy.edu.ph" required/>
            </div>
          </div>

          <div class="form-section">
            <h3>Additional Details</h3>
            <div class="form-group">
              <label class="form-label">Section *</label>
              <input type="text" name="section" class="form-input" placeholder="Your section" required/>
            </div>
            <div class="form-group">
              <label class="form-label">Year Level *</label>
              <select name="year_level" class="form-input" required id="year-level-select">
                <option value="">Select your year level</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
                <option value="1st Year College">1st Year College</option>
                <option value="2nd Year College">2nd Year College</option>
                <option value="3rd Year College">3rd Year College</option>
                <option value="4th Year College">4th Year College</option>
                <option value="Professional">Professional</option>
                <option value="Other">Other</option>
              </select>
              <!-- Error shown here -->
              <div id="year-level-error" style="
                display: none;
                margin-top: 8px;
                padding: 10px 14px;
                background: #fff0f0;
                border: 1px solid #ffb3b3;
                border-radius: 8px;
                color: #c0392b;
                font-size: 0.83rem;
                font-weight: 600;
              "></div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-group">
              <label class="form-label">Special Requirements (Optional)</label>
              <textarea class="form-input" rows="4" placeholder="Dietary restrictions, accessibility needs, etc."></textarea>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-full btn-lg" id="submit-btn">Complete Registration</button>
      </form>
    </div>
  `;

  // Live validation when year level changes
  document.getElementById("year-level-select").addEventListener("change", function () {
    const yearLevel = this.value;
    const errorEl = document.getElementById("year-level-error");
    const submitBtn = document.getElementById("submit-btn");

    if (!yearLevel) {
      errorEl.style.display = "none";
      return;
    }

    const error = validateYearLevel(yearLevel, currentEvent.category);
    if (error) {
      errorEl.textContent = "⚠️ " + error;
      errorEl.style.display = "block";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.5";
      submitBtn.style.cursor = "not-allowed";
    } else {
      errorEl.style.display = "none";
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
      submitBtn.style.cursor = "pointer";
    }
  });

  document.getElementById("reg-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = e.target;
    const yearLevel = document.getElementById("year-level-select").value;

    // Double-check on submit
    const error = validateYearLevel(yearLevel, currentEvent.category);
    if (error) {
      const errorEl = document.getElementById("year-level-error");
      errorEl.textContent = "⚠️ " + error;
      errorEl.style.display = "block";
      return;
    }

    const formData = new FormData(form);
    formData.append("event_id", event.id);
    formData.append("attendance_type", attendanceType);

    try {
      const response = await fetch(
        "http://127.0.0.1/EvenTrack/php/admin.php?action=register_attendee",
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (data.ok) showSuccess(event);
      else alert("Registration failed: " + data.error);
    } catch (err) {
      alert("Server error.");
    }
  });
}

function showSuccess(event) {
  const main = document.getElementById("page-content");
  main.innerHTML = `
    <div class="success-wrap">
      <div class="success-card">
        <div class="success-icon">✅</div>
        <h2>Registration Successful!</h2>
        <p>You're all set for <strong style="color:var(--white)">${event.title}</strong>.</p>
        <div class="success-summary">
          <div class="summary-row"><span class="key">Event</span><span class="val">${event.title}</span></div>
          <div class="summary-row"><span class="key">Date</span><span class="val">${event.date}</span></div>
          <div class="summary-row"><span class="key">Time</span><span class="val">${event.time}</span></div>
          <div class="summary-row"><span class="key">Type</span><span class="val" style="text-transform:capitalize">${attendanceType}</span></div>
        </div>
        <div class="success-actions">
          <a href="events.html" class="btn btn-primary" style="flex:1">Browse More Events</a>
        </div>
      </div>
    </div>
  `;
}