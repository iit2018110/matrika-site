/**
 * Matrika booking form handler.
 *
 * Flow on submit:
 *   1. Validate required fields.
 *   2. Submit to Netlify Forms (AJAX) so the booking is captured/tracked
 *      automatically in the Netlify dashboard + email notification.
 *   3. Open a pre-filled WhatsApp chat with Dr. Pujaa's clinic so she's
 *      notified instantly, in parallel with the tracked record.
 *
 * The WhatsApp number is read from content/settings.json (editable via the
 * /admin CMS) at submit time, with this constant kept only as a fallback
 * in case that file can't be loaded.
 */

const WHATSAPP_NUMBER_FALLBACK = '917017113182';

function getWhatsAppNumber() {
  return (window.__matrikaSettings && window.__matrikaSettings.whatsappNumber) || WHATSAPP_NUMBER_FALLBACK;
}

function encodeFormData(formData) {
  return Array.from(formData.entries())
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

function buildWhatsAppMessage(data) {
  const lines = [
    'Hello Matrika Homoeopathy, I would like to book an appointment.',
    '',
    `Name: ${data.get('name') || '-'}`,
    `Phone: ${data.get('phone') || '-'}`,
    `Service: ${data.get('service') || '-'}`,
    `Preferred date: ${data.get('preferredDate') || '-'}`,
    `Preferred time: ${data.get('preferredTime') || '-'}`
  ];
  const message = data.get('message');
  if (message) {
    lines.push('', `Notes: ${message}`);
  }
  return encodeURIComponent(lines.join('\n'));
}

function initBookingForm(form) {
  const successBox = form.querySelector('.form-success');
  const errorBox = form.querySelector('.form-error');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot spam check (Netlify convention: field named bot-field)
    const honeypot = form.querySelector('input[name="bot-field"]');
    if (honeypot && honeypot.value) {
      return; // silently drop likely-bot submissions
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    successBox && successBox.classList.remove('show');
    errorBox && errorBox.classList.remove('show');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = 'Booking...';
    }

    // iOS Safari only allows window.open() to succeed when it's called
    // synchronously inside the user's tap — any await/setTimeout before it
    // and Safari silently blocks the popup. So we open a blank tab right
    // now, then redirect that same tab to the real WhatsApp URL once it's
    // built below.
    const waWindow = window.open('', '_blank', 'noopener');

    const formData = new FormData(form);

    try {
      // 1) Captured + tracked via Netlify Forms
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData(formData)
      });
    } catch (err) {
      // Even if the tracked submission fails (e.g. running locally without
      // Netlify), we still let the patient reach the clinic on WhatsApp.
      console.warn('Netlify Forms submission failed, continuing to WhatsApp handoff.', err);
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.originalText || 'Book Appointment';
    }

    if (successBox) {
      successBox.classList.add('show');
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const waMessage = buildWhatsAppMessage(formData);
    const waUrl = `https://wa.me/${getWhatsAppNumber()}?text=${waMessage}`;

    form.reset();

    if (waWindow) {
      // Tab was already open (from the synchronous call above) — just
      // point it at the real WhatsApp link now that it's built.
      waWindow.location.href = waUrl;
    } else {
      // Popup was blocked outright (e.g. browser setting) — fall back to
      // navigating the current tab so the handoff still happens.
      window.location.href = waUrl;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form.js-booking-form').forEach(initBookingForm);
});
