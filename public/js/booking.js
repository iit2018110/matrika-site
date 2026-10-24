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

const WHATSAPP_NUMBER_FALLBACK = '918744957031';

function getWhatsAppNumber() {
  return (window.__matrikaSettings && window.__matrikaSettings.whatsappNumber) || WHATSAPP_NUMBER_FALLBACK;
}

function encodeFormData(formData) {
  return Array.from(formData.entries())
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

function buildWhatsAppMessage(data) {
  const isContact = data.get('form-name') === 'contact-message';
  let lines;
  if (isContact) {
    lines = [
      'Hello Matrika Homoeopathy, I have a question.',
      '',
      `Name: ${data.get('name') || '-'}`,
      `Phone: ${data.get('phone') || '-'}`
    ];
    if (data.get('email')) lines.push(`Email: ${data.get('email')}`);
    lines.push(`Message: ${data.get('message') || '-'}`);
  } else {
    lines = [
      'Hello! I would like to book an online consultation with Dr. Pujaa Scinde.',
      '',
      `Your name: ${data.get('name') || '-'}`,
      `Your age: ${data.get('age') || '-'}`,
      `Your city and state: ${data.get('location') || '-'}`,
      `Phone: ${data.get('phone') || '-'}`,
      `Consultation type: ${data.get('service') || '-'}`,
      `Preferred date: ${data.get('preferredDate') || '-'}`,
      `Preferred consultation time: ${data.get('preferredTime') || '-'}`
    ];
    if (data.get('message')) lines.push(`Health concern: ${data.get('message')}`);
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

    const formData = new FormData(form);
    const waMessage = buildWhatsAppMessage(formData);
    const waUrl = `https://wa.me/${getWhatsAppNumber()}?text=${waMessage}`;

    // 1) Record the booking with Netlify Forms in the BACKGROUND. We no
    //    longer wait for it, so WhatsApp opens instantly. keepalive lets the
    //    request finish even if this page navigates away.
    try {
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData(formData),
        keepalive: true
      }).catch((err) => console.warn('Netlify Forms submission failed.', err));
    } catch (err) {
      console.warn('Netlify Forms submission failed.', err);
    }

    // 2) Open WhatsApp immediately, straight from the tap (so browsers don't
    //    block it). If a popup blocker stops it, use this tab instead.
    const waWindow = window.open(waUrl, '_blank');
    if (!waWindow) {
      window.location.href = waUrl;
      return;
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
