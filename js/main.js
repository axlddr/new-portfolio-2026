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

  // Nav brand — align then wave on hover
  document.addEventListener('DOMContentLoaded', () => {
    const brand = document.querySelector('.nav__brand');
    if (!brand) return;
    const rects = Array.from(brand.querySelectorAll('.nav__brand-mark rect'));

    // Offsets (px) that bring all three rects to the same horizontal centre line.
    // Left/right sit at y=8 → shift up −4; middle sits at y=0 → shift down +4.
    const ALIGN = [-4, 4, -4];
    const SPEED = 0.032; // wave phase per frame
    const AMP   = 3;     // wave amplitude in px
    const LERP  = 0.10;  // smoothing factor
    const TOL   = 0.12;  // "close enough" threshold

    let state   = 'idle';  // aligning | waving | returning | idle
    let phase   = 0;
    let waveAmp = 0;       // actual amplitude, ramped up from 0 on wave entry
    let rafId   = null;
    const y     = [0, 0, 0];

    function tick() {
      if (state === 'waving') {
        phase   += SPEED;
        waveAmp += (AMP - waveAmp) * 0.025; // ramp amplitude in gradually
      } else {
        waveAmp = 0;
      }

      rects.forEach((r, i) => {
        const target =
          state === 'aligning'  ? ALIGN[i] :
          state === 'waving'    ? ALIGN[i] + Math.sin(phase + i * 1.1) * waveAmp :
          /* returning / idle */  0;
        y[i] += (target - y[i]) * LERP;
        r.setAttribute('transform', `translate(0,${y[i].toFixed(2)})`);
      });

      if (state === 'aligning' && y.every((v, i) => Math.abs(v - ALIGN[i]) < TOL)) {
        state = 'waving';
        phase = 0; // always start the sine from 0 → no abrupt offset at wave entry
      }
      if (state === 'returning' && y.every(v => Math.abs(v) < TOL)) {
        rects.forEach(r => r.removeAttribute('transform'));
        state = 'idle';
        rafId = null;
        return;
      }

      rafId = requestAnimationFrame(tick);
    }

    brand.addEventListener('mouseenter', () => {
      if (state === 'idle' || state === 'returning') state = 'aligning';
      if (!rafId) rafId = requestAnimationFrame(tick);
    });
    brand.addEventListener('mouseleave', () => {
      if (state !== 'idle') state = 'returning';
    });
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
