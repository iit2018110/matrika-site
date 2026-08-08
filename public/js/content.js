/**
 * Matrika content loader.
 *
 * Pulls editable content from /content/*.json (edited by Dr. Puja via the
 * /admin CMS panel, which commits changes back to these files in git) and
 * renders it into the page.
 *
 * Every HTML page still ships with sensible default text baked in, so if
 * this script fails to load (offline, JSON missing, etc.) the site still
 * looks correct -- it just won't reflect the latest edits.
 */

async function fetchJSON(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function waLink(number, message) {
  const q = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${number}${q}`;
}

/* ---------------- Site-wide settings (every page) ---------------- */

async function applySettings() {
  let settings;
  try {
    settings = await fetchJSON('content/settings.json');
  } catch (err) {
    console.warn('Matrika: could not load settings.json, keeping defaults in HTML.', err);
    return null;
  }

  window.__matrikaSettings = settings;

  document.querySelectorAll('[data-cms="phone-text"]').forEach((el) => (el.textContent = settings.phone));
  document.querySelectorAll('[data-cms="phone-tel"]').forEach((el) => (el.href = `tel:${settings.phoneTel}`));
  document.querySelectorAll('[data-cms="email-text"]').forEach((el) => (el.textContent = settings.email));
  document.querySelectorAll('[data-cms="email-mailto"]').forEach((el) => (el.href = `mailto:${settings.email}`));
  document.querySelectorAll('[data-cms="address"]').forEach((el) => (el.textContent = settings.address));
  document.querySelectorAll('[data-cms="hours-weekday"]').forEach((el) => (el.textContent = settings.hoursWeekday));
  document.querySelectorAll('[data-cms="hours-sunday"]').forEach((el) => (el.textContent = settings.hoursSunday));
  document.querySelectorAll('[data-cms="map-embed"]').forEach((el) => {
    if (settings.mapEmbedUrl) el.src = settings.mapEmbedUrl;
  });
  document.querySelectorAll('[data-cms="instagram"]').forEach((el) => {
    if (settings.instagramUrl) el.href = settings.instagramUrl;
  });
  document.querySelectorAll('[data-cms="facebook"]').forEach((el) => {
    if (settings.facebookUrl) el.href = settings.facebookUrl;
  });
  document.querySelectorAll('[data-cms="wa-link"]').forEach((el) => {
    const msg = el.getAttribute('data-wa-message') || '';
    el.href = waLink(settings.whatsappNumber, msg);
  });

  document.dispatchEvent(new CustomEvent('matrika:settings-ready', { detail: settings }));
  return settings;
}

/* ---------------- Home page ---------------- */

async function renderHome() {
  const root = document.querySelector('[data-page="home"]');
  if (!root) return;

  try {
    const [home, services, testimonials] = await Promise.all([
      fetchJSON('content/home.json'),
      fetchJSON('content/services.json'),
      fetchJSON('content/testimonials.json')
    ]);

    setText('[data-cms="hero-tagline"]', home.heroTagline);
    setText('[data-cms="hero-heading"]', home.heroHeading);
    setText('[data-cms="hero-lead"]', home.heroLead);
    setText('[data-cms="photo-tag"]', home.photoTag);
    setText('[data-cms="about-preview-badge"]', home.aboutPreviewBadge);
    setText('[data-cms="about-preview-heading"]', home.aboutPreviewHeading);
    setText('[data-cms="about-preview-text1"]', home.aboutPreviewText1);
    setText('[data-cms="about-preview-text2"]', home.aboutPreviewText2);

    const conditionsWrap = document.querySelector('[data-cms="home-conditions"]');
    if (conditionsWrap && Array.isArray(services.conditions)) {
      conditionsWrap.innerHTML = services.conditions
        .slice(0, 8)
        .map((c) => conditionCardHTML(c))
        .join('');
    }

    const testimonialsWrap = document.querySelector('[data-cms="home-testimonials"]');
    if (testimonialsWrap && Array.isArray(testimonials.items)) {
      testimonialsWrap.innerHTML = testimonials.items.map((t) => testimonialCardHTML(t)).join('');
    }
  } catch (err) {
    console.warn('Matrika: could not load home content, keeping defaults in HTML.', err);
  }
}

/* ---------------- About page ---------------- */

async function renderAbout() {
  const root = document.querySelector('[data-page="about"]');
  if (!root) return;

  try {
    const about = await fetchJSON('content/about.json');

    document.querySelectorAll('[data-cms="about-photo"]').forEach((el) => {
      if (about.photo) el.src = about.photo;
    });
    setText('[data-cms="about-badge"]', about.badge);
    setText('[data-cms="about-heading"]', about.heading);
    setText('[data-cms="about-bio1"]', about.bio1);
    setText('[data-cms="about-bio2"]', about.bio2);
    setText('[data-cms="about-bio3"]', about.bio3);
    setText('[data-cms="about-education"]', about.education);
    setText('[data-cms="about-practice-title"]', about.practiceTitle);
    setText('[data-cms="about-areas-of-focus"]', about.areasOfFocus);
    setText('[data-cms="about-credentials-note"]', about.credentialsNote);
  } catch (err) {
    console.warn('Matrika: could not load about content, keeping defaults in HTML.', err);
  }
}

/* ---------------- Services page ---------------- */

async function renderServices() {
  const root = document.querySelector('[data-page="services"]');
  if (!root) return;

  try {
    const services = await fetchJSON('content/services.json');

    const conditionsWrap = document.querySelector('[data-cms="all-conditions"]');
    if (conditionsWrap && Array.isArray(services.conditions)) {
      conditionsWrap.innerHTML = services.conditions.map((c) => conditionCardHTML(c)).join('');
    }

    const typesWrap = document.querySelector('[data-cms="consultation-types"]');
    if (typesWrap && Array.isArray(services.consultationTypes)) {
      typesWrap.innerHTML = services.consultationTypes.map((t) => consultationTypeCardHTML(t)).join('');
    }
  } catch (err) {
    console.warn('Matrika: could not load services content, keeping defaults in HTML.', err);
  }
}

/* ---------------- Card HTML builders ---------------- */

function conditionCardHTML(c) {
  const items = (c.items || []).map((item) => `<li>${escapeHTML(item)}</li>`).join('');
  return `
    <div class="card condition-card">
      <div class="card__icon">${escapeHTML(c.icon || '🌿')}</div>
      <h3>${escapeHTML(c.title)}</h3>
      <ul>${items}</ul>
    </div>
  `;
}

function consultationTypeCardHTML(t) {
  return `
    <div class="card">
      <div class="card__icon">${escapeHTML(t.icon || '🩺')}</div>
      <h3>${escapeHTML(t.title)}</h3>
      <p>${escapeHTML(t.description)}</p>
      <p class="form-note">Duration: ${escapeHTML(t.duration)} · ${escapeHTML(t.fee)}</p>
    </div>
  `;
}

function testimonialCardHTML(t) {
  return `
    <div class="testimonial">
      <div class="testimonial__stars">★★★★★</div>
      <p class="testimonial__quote">"${escapeHTML(t.quote)}"</p>
      <div class="testimonial__author">
        <span class="testimonial__avatar">${escapeHTML(t.initial || (t.name || '?').charAt(0))}</span> ${escapeHTML(t.name)}
      </div>
    </div>
  `;
}

/* ---------------- Utilities ---------------- */

function setText(selector, value) {
  if (value == null) return;
  document.querySelectorAll(selector).forEach((el) => (el.textContent = value));
}

/* ---------------- Init ---------------- */

document.addEventListener('DOMContentLoaded', () => {
  applySettings();
  renderHome();
  renderAbout();
  renderServices();
});
