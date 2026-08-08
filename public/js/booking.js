/**
 * Matrika booking form handler.
 *
 * Flow on submit:
 *   1. Validate required fields.
 *   2. Submit to Netlify Forms (AJAX) so the booking is captured/tracked
 *      automatically in the Netlify dashboard + email notification.
 *   3. Open a pre-filled WhatsApp chat with Dr. Puja's clinic so she's
 *      notified instantly, in parallel with the tracked record.
 *
 * TODO before going live: replace WHATSAPP_NUMBER below with the real
 * clinic WhatsApp number, in international format with no "+", spaces,
 * or leading zeros -- e.g. India number +91 98765 43210 becomes
 * "919876543210".
 */

const WHATSAPP_NUMBER = '917017113182'; // TODO: replace with Dr. Puja's real WhatsApp number

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
  const successActions = successBox ? successBox.querySelector('.form-success__actions') : null;
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

    const waMessage = buildWhatsAppMessage(formData);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

    // Nothing is actually confirmed until the patient sends the WhatsApp
    // message themselves, so we don't auto-redirect (that's also unreliable --
    // browsers block window.open() once it's outside a direct click, which is
    // exactly what happens after an awaited fetch). Instead we show a real
    // button so the tap itself is the trusted user action.
    if (successActions) {
      successActions.innerHTML = `
        <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn--whatsapp">
          💬 Confirm on WhatsApp
        </a>
      `;
    }

    if (successBox) {
      successBox.classList.add('show');
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form.js-booking-form').forEach(initBookingForm);
});
