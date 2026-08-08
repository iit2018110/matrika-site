// Simple JSON-file based storage for bookings.
// No native dependencies required -- works anywhere Node runs.
// For higher traffic, swap this out for a real database (Postgres/SQLite),
// but the readBookings/writeBookings/appendBooking interface below can stay the same.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'bookings.json');

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ bookings: [], nextId: 1 }, null, 2));
  }
}

function readStore() {
  ensureStore();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    // Corrupt file safety net -- back it up and start fresh rather than crash the server.
    fs.renameSync(DATA_FILE, `${DATA_FILE}.corrupt-${Date.now()}`);
    const fresh = { bookings: [], nextId: 1 };
    fs.writeFileSync(DATA_FILE, JSON.stringify(fresh, null, 2));
    return fresh;
  }
}

function writeStore(store) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

function listBookings() {
  return readStore().bookings;
}

function getBooking(id) {
  return readStore().bookings.find((b) => b.id === Number(id));
}

function addBooking(data) {
  const store = readStore();
  const now = new Date().toISOString();
  const booking = {
    id: store.nextId,
    name: data.name,
    phone: data.phone,
    email: data.email || '',
    service: data.service,
    preferredDate: data.preferredDate || '',
    preferredTime: data.preferredTime || '',
    message: data.message || '',
    status: 'New',
    source: data.source || 'website',
    createdAt: now,
    updatedAt: now,
    activityLog: [{ at: now, event: 'Booking submitted' }]
  };
  store.bookings.unshift(booking);
  store.nextId += 1;
  writeStore(store);
  return booking;
}

function updateBookingStatus(id, status, note) {
  const store = readStore();
  const booking = store.bookings.find((b) => b.id === Number(id));
  if (!booking) return null;
  const now = new Date().toISOString();
  booking.status = status;
  booking.updatedAt = now;
  booking.activityLog.push({ at: now, event: `Status changed to ${status}${note ? ' - ' + note : ''}` });
  writeStore(store);
  return booking;
}

module.exports = {
  listBookings,
  getBooking,
  addBooking,
  updateBookingStatus
};
