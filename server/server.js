// OPTIONAL SELF-HOSTED BACKEND (fallback)
// -----------------------------------------------------------------------
// If you deploy Matrika to Netlify, you do NOT need this file -- Netlify
// Forms handles booking capture and tracking for you (see /public and README).
//
// This Express server exists as an alternative for a custom admin dashboard
// with status tracking (New / Contacted / Confirmed / Completed / Cancelled).
// It only works on hosts that run a persistent Node process, e.g. Render,
// Railway, Fly.io, or your own VPS -- NOT Netlify.
// -----------------------------------------------------------------------

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const basicAuth = require('express-basic-auth');

const bookingsRouter = require('./routes/bookings');
const adminBookingsRouter = require('./routes/adminBookings');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Admin endpoints AND the /admin-bookings static page must be auth-protected
// and registered *before* the general public static middleware below --
// otherwise express.static would serve public/admin-bookings/index.html to
// anyone without ever checking credentials.
//
// Note: /admin itself is now the Decap CMS content editor (a static page
// that talks to Netlify Identity + Git Gateway, only functional once
// deployed on Netlify with Identity enabled). The old bookings dashboard
// lives at /admin-bookings instead so the two don't collide.
const adminAuth = basicAuth({
  users: { [process.env.ADMIN_USER || 'admin']: process.env.ADMIN_PASS || 'change-me' },
  challenge: true,
  realm: 'Matrika Admin'
});

app.use('/api/admin/bookings', adminAuth, adminBookingsRouter);
app.use('/admin-bookings', adminAuth, express.static(path.join(__dirname, '..', 'public', 'admin-bookings')));

// Public endpoint: create a booking
app.use('/api/bookings', bookingsRouter);

// General static site (everything else in /public)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Matrika backend running at http://localhost:${PORT}`);
  console.log(`Bookings dashboard (if using self-hosted mode): http://localhost:${PORT}/admin-bookings`);
});
