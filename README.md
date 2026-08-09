# Matrika Homoeopathy — Website

Website for Dr. Puja's homeopathy practice, brand name **Matrika**, with online appointment booking and a self-service content editor so Dr. Puja can update site text/images herself.

## What's in here

```
public/                    -> the actual website (deploy this folder)
  index.html                Home
  about.html                 About Dr. Puja
  services.html                Conditions we treat
  booking.html                   Appointment booking form
  contact.html                     Contact page + quick message form
  thank-you.html                    Fallback confirmation page
  admin/                              Content editor (Decap CMS) — Dr. Puja logs in here
    index.html, config.yml
  content/                           Editable JSON content (edited via /admin, or by hand)
    settings.json, home.json, about.json, services.json, testimonials.json
  css/style.css
  js/main.js, footer.js, content.js, booking.js
  images/matrika-logo.jpeg, dr-puja.jpeg

server/                     -> OPTIONAL self-hosted backend (only needed if NOT using Netlify)
netlify.toml                -> Netlify deploy config
```

## Recommended: deploy to Netlify (free, no server to manage)

1. Push this folder to a GitHub repo, or drag-and-drop the `public` folder straight into Netlify's dashboard (Sites → Add new site → Deploy manually).
2. If using Git: in Netlify, "Add new site" → connect the repo. `netlify.toml` already sets the publish directory to `public`.
3. Deploy. That's it — no build step, no server.

**Booking tracking is automatic.** Both forms (`booking.html` and `contact.html`) have `data-netlify="true"`, so Netlify detects them on deploy and every submission is captured under **Site → Forms** in your Netlify dashboard — full history, exportable, with an email notification you can turn on per form (Forms → form name → Settings → notifications). This is your "every activity tracked" record.

On submit, the site also opens a pre-filled WhatsApp chat so Dr. Puja gets notified instantly and can reply directly to the patient.

## Letting Dr. Puja edit the site herself (`/admin`)

The site now has a built-in content editor at `yoursite.netlify.app/admin` (Decap CMS). It lets her edit, without touching code:

- Contact info, WhatsApp number, clinic hours, address, map, social links (Site Settings)
- Home page headline/text, About page bio/photo/credentials
- Conditions treated, consultation types & fees
- Patient testimonials

Every page falls back to the static text baked into the HTML if a content file is ever missing, so the site can't break from this.

**One-time setup you need to do in the Netlify dashboard** (Claude has no access to your Netlify account, so this part is manual):

1. **Site settings → Identity → Enable Identity.**
2. Under Identity → **Registration**, set it to **Invite only** (so random people can't sign themselves up).
3. Under Identity → **Services → Git Gateway**, click **Enable Git Gateway**. This lets the CMS commit changes back to your GitHub repo on Dr. Puja's behalf, without her needing a GitHub account.
4. Under Identity → **Invite users**, invite Dr. Puja's email address. She'll get an email with a link to set her password.
5. Push the latest code (including the `public/admin/` and `public/content/` folders) to GitHub so Netlify redeploys with the CMS included.
6. Once she's accepted the invite, she can log in any time at `yoursite.netlify.app/admin`, make edits, and click **Publish** — changes commit to GitHub and the site redeploys automatically (~1 minute).

No further involvement needed from you after that — she edits, the site updates itself.

## Before going live — replace these placeholders

Easiest to do most of these directly in `/admin` once it's live; a few (like the WhatsApp number format) are safest to double check in code too.

- **WhatsApp number**: `917017113182` — editable in `/admin` → Site Settings → WhatsApp Number, or in `public/content/settings.json` directly. International format, no `+`, spaces, or leading zero (e.g. `+91 98765 43210` → `919876543210`).
- **Phone / email**: editable in `/admin` → Site Settings.
- **Clinic address + map**: editable in `/admin` → Site Settings (paste a Google Maps "Embed a map" URL).
- **Dr. Puja's bio/credentials**: editable in `/admin` → About Page. Still has `[Add degree...]` / `[Add college/university name]` placeholders to fill in.
- **Fees**: editable in `/admin` → Conditions & Consultation Types. Still has `[Add fee]` placeholders.
- **Clinic hours**: editable in `/admin` → Site Settings.
- **Social links**: editable in `/admin` → Site Settings.

## Alternative: self-hosted backend (only if you skip Netlify)

If you'd rather run your own server instead of using Netlify Forms — e.g. you want a status workflow (New → Contacted → Confirmed → Completed → Cancelled) on bookings — the `server/` folder has a small Express app with the API for this:

```bash
npm install
cp .env.example .env   # edit ADMIN_USER / ADMIN_PASS
npm start              # runs at http://localhost:3000
```

- Bookings are stored in `server/data/bookings.json` (created automatically).
- The bookings API lives at `http://localhost:3000/api/admin/bookings` (password-protected via `.env`) — list bookings with `GET`, update status with `PATCH /:id/status`. There's no bundled dashboard UI for it; build a small page against this API if you want one.
- This needs a host that runs a persistent Node process — **Render, Railway, or Fly.io work; Netlify does not** (Netlify only runs serverless functions with no persistent file storage).
- If you go this route instead of Netlify Forms, you can remove `data-netlify="true"` and the hidden `form-name` input from the forms, since they won't be needed.
- Note: the `/admin` path is used by the Decap CMS content editor (Netlify-only feature), so it can't also serve a bookings dashboard.

## Local preview (either mode)

Since there's no build step, you can just open `public/index.html` directly in a browser to check styling and layout. The booking form's "save" step will only work once you've deployed to Netlify (for tracking) or are running the local `server/` backend — but the WhatsApp handoff works either way. The `/admin` content editor only works once deployed to Netlify with Identity + Git Gateway enabled (see above) — it won't function when opened locally or before that setup is done.

## Notes

- All contact/WhatsApp links across the site now pull from `public/content/settings.json` at page load (via `public/js/content.js`), so updating it once in `/admin` updates every page.
- The floating WhatsApp button and hero/CTA WhatsApp links all read the same settings value.
- The third image sent during setup (an illustration of a woman writing, unrelated to homeopathy) was not used anywhere on the site. Let us know if it belongs somewhere.
