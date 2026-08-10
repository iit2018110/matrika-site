// Shared behavior across all pages: mobile nav toggle + active link highlight.
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav__links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.textContent = expanded ? '✕' : '☰';
    });

    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.textContent = '☰';
      })
    );
  }

  // Highlight current page in nav
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Hide the floating WhatsApp bubble once the footer scrolls into view --
  // otherwise it sits on top of the footer's contact links / disclaimer text
  // on mobile, where there's no room for it to float clear.
  const waFloat = document.querySelector('.whatsapp-float');
  const footer = document.querySelector('.site-footer');
  if (waFloat && footer) {
    const updateWaFloatVisibility = () => {
      const footerTop = footer.getBoundingClientRect().top;
      waFloat.classList.toggle('is-hidden', footerTop < window.innerHeight);
    };
    window.addEventListener('scroll', updateWaFloatVisibility, { passive: true });
    window.addEventListener('resize', updateWaFloatVisibility);
    updateWaFloatVisibility();
  }
});
