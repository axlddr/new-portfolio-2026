/* ============================================
   THEME TOGGLE
   Persists the chosen theme in localStorage.
   The inline <script> in <head> applies it
   immediately on load to prevent a flash.
   ============================================ */
(function () {
  'use strict';

  const ROOT        = document.documentElement;
  const STORAGE_KEY = 'theme';

  function current() {
    return ROOT.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  function apply(theme) {
    ROOT.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    updateButton();
  }

  function updateButton() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    const dark = current() === 'dark';
    btn.textContent = dark ? 'Light' : 'Dark';
    btn.setAttribute('aria-label', dark ? 'Passer en mode clair' : 'Passer en mode sombre');
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateButton();
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.addEventListener('click', () => apply(current() === 'dark' ? 'light' : 'dark'));
  });
})();
