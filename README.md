# Matrika Homoeopathy — Website

Website for Dr. Puja's homeopathy practice, brand name **Matrika**, with an online appointment booking feature.

## What's in here

```
public/              -> the actual website (deploy this folder)
  index.html          Home
  about.html           About Dr. Puja
  services.html         Conditions we treat
  booking.html           Appointment booking form
  contact.html             Contact page + quick message form
  thank-you.html            Fallback confirmation page
  admin/index.html           Self-hosted admin dashboard (optional, see below)
  css/style.css
  js/main.js, booking.js, footer.js
  images/matrika-logo.jpeg, dr-puja.jpeg

server/               -> OPTIONAL self-hosted backend (only needed if NOT using Netlify)
netlify.toml          -> Netlify deploy config
```

## Recommended: deploy to Netlify (free, no server to manage)

1. Push this folder to a GitHub repo, or drag-and-drop the `public` folder straight into Netlify's dashboard (Sites → Add new site → Deploy manually).
2. If using Git: in Netlify, "Add new site" → connect the repo. `netlify.toml` already sets the publish directory to `public`.
3. Deploy. That's it — no build step, no server.

**Booking tracking is automatic.** Both forms (`booking.html` and `contact.html`) have `data-netlify="true"`, so Netlify detects them on deploy and every submission is captured under **Site → Forms** in your Netlify dashboard — full history, exportable, with an email notification you can turn on per form (Forms → form name → Settings → notifications). This is your "every activity tracked" record.

On submit, the site also opens a pre-filled WhatsApp chat so Dr. Puja gets notified instantly and can reply directly to the patient.

## Before going live — replace these placeholders

Search the project for these and swap in real values:

- **WhatsApp number**: `917017113182` appears in `public/js/booking.js` (top of file) and in every `wa.me` link across the HTML pages. Use international format, no `+`, spaces, or leading zero (e.g. `+91 98765 43210` → `919876543210`).
- **Phone / email**: `+91 70171 13182` and `Matrikahomoeopathy@gmail.com` in `public/js/footer.js`, `contact.html`, `booking.html`.
- **Clinic address + map**: `contact.html` has a placeholder address and a generic map embed — replace with your real address and a proper Google Maps embed link.
- **Dr. Puja's bio/credentials**: `about.html` has `[Add degree...]`, `[Add college/university name]` placeholders — fill in her real qualifications, registration number, and years of experience.
- **Fees**: `services.html` has `[Add fee]` placeholders for in-clinic and online consultations.
- **Clinic hours**: currently a placeholder guess in the footer — update if different.
- **Social links**: Instagram/Facebook icons in the footer currently link to `#`.

## Alternative: self-hosted backend (only if you skip Netlify)

If you'd rather run your own server instead of using Netlify Forms — e.g. you want a custom admin dashboard with a status workflow (New → Contacted → Confirmed → Completed → Cancelled) — the `server/` folder has a small Express app that does this:

```bash
npm install
cp .env.example .env   # edit ADMIN_USER / ADMIN_PASS
npm start              # runs at http://localhost:3000
```

- Bookings are stored in `server/data/bookings.json` (created automatically).
- Visit `http://localhost:3000/admin` (password-protected via `.env`) to view and update bookings.
- This needs a host that runs a persistent Node process — **Render, Railway, or Fly.io work; Netlify does not** (Netlify only runs serverless functions with no persistent file storage).
- If you go this route instead of Netlify Forms, you can remove `data-netlify="true"` and the hidden `form-name` input from the forms, since they won't be needed.

## Local preview (either mode)

Since there's no build step, you can just open `public/index.html` directly in a browser to check styling and layout. The booking form's "save" step will only work once you've deployed to Netlify (for tracking) or are running the local `server/` backend — but the WhatsApp handoff works either way.

## Notes

- The floating WhatsApp button and hero/CTA WhatsApp links all use the same placeholder number — update once, then search-and-replace is easiest.
- The third image sent during setup (an illustration of a woman writing, unrelated to homeopathy) was not used anywhere on the site. Let us know if it belongs somewhere.
