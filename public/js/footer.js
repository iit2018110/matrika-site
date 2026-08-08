// Shared footer, injected on every page so it only needs to be edited once.
// TODO: replace phone / email / address placeholders with Dr. Puja's real details.
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
          <p class="footer-note">Healing from within, guided by nature. Personalized homeopathic care from Dr. Puja for the whole family.</p>
          <div class="social-row">
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="https://wa.me/917017113182" aria-label="WhatsApp">💬</a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Dr. Puja</a></li>
            <li><a href="services.html">Conditions We Treat</a></li>
            <li><a href="booking.html">Book Appointment</a></li>
          </ul>
        </div>
        <div>
          <h4>Get in Touch</h4>
          <ul>
            <li><a href="contact.html">Contact Us</a></li>
            <li><a href="tel:+917017113182">+91 70171 13182</a></li>
            <li><a href="mailto:Matrikahomoeopathy@gmail.com">Matrikahomoeopathy@gmail.com</a></li>
          </ul>
        </div>
        <div>
          <h4>Clinic Hours</h4>
          <ul>
            <li>Mon – Sat: 10:00 AM – 7:00 PM</li>
            <li>Sunday: By appointment only</li>
            <li>Online consults available daily</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Matrika Homoeopathy. All rights reserved.</span>
        <span>Medical Disclaimer: Information on this site is for educational purposes and does not replace professional medical advice.</span>
      </div>
    </div>
  `;
});
