// Shared footer, injected on every page so it only needs to be edited once.
// TODO: replace phone / email / address placeholders with Dr. Pujaa's real details.
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('site-footer-placeholder');
  if (!el) return;

  el.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">
            <img src="images/matrika-logo.jpeg" alt="Matrika Homoeopathy logo" />
            <span>Matrika Homoeopathy</span>
          </div>
          <p class="footer-note">Healing from within, guided by nature. Personalized homeopathic care from Dr. Pujaa for the whole family.</p>
          <div class="social-row">
            <a href="#" data-cms="instagram" aria-label="Instagram">📷</a>
            <a href="#" data-cms="facebook" aria-label="Facebook">📘</a>
            <a href="https://wa.me/917017113182" data-cms="wa-link" aria-label="WhatsApp"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.04 21.785h-.01a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741 1.379 1.006-3.649-.29-.401a9.86 9.86 0 0 1-1.51-5.239c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.943c0 2.106.549 4.16 1.595 5.982L0 24l6.335-1.662a11.882 11.882 0 0 0 5.71 1.454h.005c6.582 0 11.942-5.36 11.945-11.944 0-3.191-1.244-6.19-3.502-8.399"/></svg></a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Dr. Pujaa</a></li>
            <li><a href="services.html">Conditions We Treat</a></li>
            <li><a href="booking.html">Book Appointment</a></li>
          </ul>
        </div>
        <div>
          <h4>Get in Touch</h4>
          <ul>
            <li><a href="contact.html">Contact Us</a></li>
            <li><a href="tel:+917017113182" data-cms="phone-tel"><span data-cms="phone-text">+91 70171 13182</span></a></li>
            <li><a href="mailto:Matrikahomoeopathy@gmail.com" data-cms="email-mailto"><span data-cms="email-text">Matrikahomoeopathy@gmail.com</span></a></li>
          </ul>
        </div>
        <div>
          <h4>Clinic Hours</h4>
          <ul>
            <li data-cms="hours-weekday">Mon – Sat: 10:00 AM – 7:00 PM</li>
            <li data-cms="hours-sunday">Sunday: By appointment only</li>
            <li>Online consults available daily</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Matrika Homoeopathy. All rights reserved.</span>
        <span>Medical Disclaimer: Information on this site is for educational purposes and does not replace professional medical advice.</span>
      </div>
      <div class="footer-credit">
        Website by Vikash Kumar &middot;
        <a href="mailto:vk042082@gmail.com">Email</a> &middot;
        <a href="https://wa.me/919935567365" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
  `;
});
