const express = require('express');
const db = require('../db');

const router = express.Router();

const VALID_STATUSES = ['New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'];

// Protected (basic auth applied at mount time in server.js): list all bookings
router.get('/', (req, res) => {
  const bookings = db.listBookings();
  res.json({ ok: true, bookings });
});

// Protected: update a booking's status for tracking/follow-up
router.patch('/:id/status', (req, res) => {
  const { status, note } = req.body || {};
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ ok: false, error: `status must be one of ${VALID_STATUSES.join(', ')}` });
  }
  const updated = db.updateBookingStatus(req.params.id, status, note);
  if (!updated) {
    return res.status(404).json({ ok: false, error: 'booking not found' });
  }
  res.json({ ok: true, booking: updated });
});

module.exports = router;
