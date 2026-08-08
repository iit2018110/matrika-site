const express = require('express');
const db = require('../db');

const router = express.Router();

function isBlank(v) {
  return !v || String(v).trim().length === 0;
}

// Public: create a booking (called from the on-site booking form)
router.post('/', (req, res) => {
  const { name, phone, email, service, preferredDate, preferredTime, message } = req.body || {};

  const errors = [];
  if (isBlank(name)) errors.push('name is required');
  if (isBlank(phone)) errors.push('phone is required');
  if (isBlank(service)) errors.push('service is required');

  if (errors.length) {
    return res.status(400).json({ ok: false, errors });
  }

  const booking = db.addBooking({
    name: String(name).trim(),
    phone: String(phone).trim(),
    email: email ? String(email).trim() : '',
    service: String(service).trim(),
    preferredDate: preferredDate || '',
    preferredTime: preferredTime || '',
    message: message ? String(message).trim() : '',
    source: 'website'
  });

  return res.status(201).json({ ok: true, booking });
});

module.exports = router;
