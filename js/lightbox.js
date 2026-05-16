/* ============================================
   LIGHTBOX
   Opens any [data-lightbox] image fullscreen.
   Caption comes from the img's data-caption attr.
   Close: click backdrop · click × · Escape key.
   ============================================ */
(function () {
  'use strict';

  /* ── Build overlay DOM (once, on script load) ── */
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image agrandie');
  overlay.innerHTML =
    '<button class="lightbox__close" aria-label="Fermer">' +
      '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">' +
        '<line x1="1" y1="1" x2="17" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
        '<line x1="17" y1="1" x2="1" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>' +
    '</button>' +
    '<figure class="lightbox__figure">' +
      '<img class="lightbox__img" src="" alt="" />' +
      '<figcaption class="lightbox__caption"></figcaption>' +
    '</figure>';

  document.body.appendChild(overlay);

  const lbImg     = overlay.querySelector('.lightbox__img');
  const lbCaption = overlay.querySelector('.lightbox__caption');
  const lbClose   = overlay.querySelector('.lightbox__close');

  /* ── Open ─────────────────────────────────────── */
  function open(src, alt, caption) {
    lbImg.src       = src;
    lbImg.alt       = alt || '';
    lbCaption.textContent = caption || '';
    lbCaption.hidden = !caption;
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  /* ── Close ────────────────────────────────────── */
  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    // Clear src after transition so there's no stale image on re-open
    setTimeout(function () {
      if (!overlay.classList.contains('is-open')) lbImg.src = '';
    }, 280);
  }

  /* ── Events ───────────────────────────────────── */

  // Delegate: click any [data-lightbox] image to open
  document.addEventListener('click', function (e) {
    const img = e.target.closest('[data-lightbox]');
    if (img) open(img.src, img.alt, img.dataset.caption || '');
  });

  // Click on backdrop (not inside figure) closes
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  lbClose.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });
})();
