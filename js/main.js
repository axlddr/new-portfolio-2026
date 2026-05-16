/* ============================================
   MAIN
   - Page fade-in
   - Active nav state (set per page in HTML,
     but verified here as a safety net)
   - Project filters (work.html)
   ============================================ */
(function () {
  // Page fade-in
  // Skip if data-manual-ready is set — case-parser.js handles it instead.
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.querySelector('.page');
    if (page && !page.hasAttribute('data-manual-ready')) {
      requestAnimationFrame(() => page.classList.add('is-ready'));
    }
  });

  // Nav hide-on-scroll-down / show-on-scroll-up
  document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const siteHeader = document.querySelector('.site-header');
    let lastY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      if (delta > 4 && currentY > nav.offsetHeight) {
        nav.classList.add('nav--hidden');
      } else if (delta < -4) {
        nav.classList.remove('nav--hidden');
      }

      if (siteHeader) {
        nav.classList.toggle('nav--scrolled', currentY > siteHeader.offsetHeight);
      }

      lastY = currentY;
    }, { passive: true });
  });

  // Filters (only present on work.html)
  document.addEventListener('DOMContentLoaded', () => {
    const filterBar = document.querySelector('[data-filters]');
    if (!filterBar) return;

    const buttons = filterBar.querySelectorAll('.filter');
    const projects = document.querySelectorAll('[data-tags]');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter || 'all';

        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));

        projects.forEach((p) => {
          const tags = (p.dataset.tags || '').split(/\s+/);
          const match = filter === 'all' || tags.includes(filter);
          p.classList.toggle('project--hidden', !match);
        });
      });
    });
  });
})();
