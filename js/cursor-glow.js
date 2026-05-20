/* ============================================
   GRID GLOW
   24×24 tiles in [data-cursor-zone].
   Per-tile brightness noise + randomised decay rate
   give organic variation in shading and turn-off.
   Canvas sits at z-index −2 — below noise::after (−1).
   ============================================ */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const zone = document.querySelector('[data-cursor-zone]');
  if (!zone) return;

  const CELL          = 8;     // tile size in CSS px
  const GAP           = 1;     // gap between tiles
  const BR            = 1;     // border-radius
  const HOT_LERP      = 0.07;  // hot-spot tracking speed (lower = more lag)
  const HOT_RADIUS    = 80;    // influence radius in px
  const ON_MAX_DELAY  = 300;   // ms — max stagger on turn-on
  const OFF_MAX_DELAY = 2500;  // ms — max stagger on turn-off

  /* ── Canvas ──────────────────────────────── */
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'absolute', inset: '0',
    width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '-2',
  });
  zone.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  /* ── Accent color ────────────────────────── */
  function accentRgb() {
    const hex = (getComputedStyle(document.documentElement)
      .getPropertyValue('--color-accent').trim() || '#9F181A').replace('#', '');
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  let rgb = accentRgb();
  new MutationObserver(() => { rgb = accentRgb(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* ── Grid state ──────────────────────────── */
  let cols = 0, rows = 0;
  let liveAlpha;    // Float32Array — current rendered alpha
  let fadeStartAt;  // Float32Array — timestamp to begin fading (off delay)
  let onDelayEnd;   // Float32Array — timestamp when tile may start turning on
  let tileNoise;    // Float32Array — per-tile brightness multiplier (stable)
  let decayRate;    // Float32Array — per-tile fade speed (stable)

  function initGrid() {
    cols = Math.ceil(canvas.width  / CELL) + 1;
    rows = Math.ceil(canvas.height / CELL) + 1;
    const n = cols * rows;
    liveAlpha   = new Float32Array(n);
    fadeStartAt = new Float32Array(n);
    onDelayEnd  = new Float32Array(n);

    // Stable per-tile randoms — regenerated on resize only
    tileNoise = new Float32Array(n);
    decayRate = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      // Brightness: 0.35–1.0  →  same-distance tiles can be much darker
      tileNoise[i] = 0.35 + Math.random() * 0.65;
      // Decay multiplier per frame: 0.78–0.96  →  wide spread in fade speed
      decayRate[i] = 0.78 + Math.random() * 0.18;
    }
  }

  function resize() {
    canvas.width  = zone.offsetWidth;
    canvas.height = zone.offsetHeight;
    initGrid();
  }

  /* ── Mouse state ─────────────────────────── */
  let mouseX = null;   // actual cursor position (zone-relative)
  let mouseY = null;
  let hotX   = null;   // lagged hot-spot position (lerped each frame)
  let hotY   = null;
  let rafId  = null;

  /* ── Render loop ─────────────────────────── */
  const BUCKETS = 40;
  const buckets = Array.from({ length: BUCKETS }, () => []);
  const TILE_S  = CELL - GAP * 2;

  function tick(now) {
    const [r, g, b] = rgb;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Lerp hot-spot toward real cursor — creates trailing delay
    if (mouseX !== null) {
      if (hotX === null) { hotX = mouseX; hotY = mouseY; }
      hotX += (mouseX - hotX) * HOT_LERP;
      hotY += (mouseY - hotY) * HOT_LERP;
    }

    let needsNextFrame = false;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        let alpha = liveAlpha[i];

        /* ── Trigger: cursor sweeps over a dark, idle tile ── */
        if (mouseX !== null && alpha < 0.005 && !onDelayEnd[i] && !fadeStartAt[i]) {
          const cx = col * CELL + CELL / 2;
          const cy = row * CELL + CELL / 2;
          const d  = Math.sqrt((cx - hotX) ** 2 + (cy - hotY) ** 2);
          const t  = Math.max(0, 1 - d / HOT_RADIUS);
          /* Probability drops as t³ — center tiles almost always trigger,
             edge tiles rarely do, giving a natural soft boundary */
          if (t > 0 && Math.random() < t * t * t * t * t) {
            onDelayEnd[i] = now + Math.random() * ON_MAX_DELAY;
          }
        }

        /* ── Fire: on-delay expired → snap to peak, start fade timer ── */
        if (onDelayEnd[i]) {
          if (now < onDelayEnd[i]) {
            needsNextFrame = true; // still waiting — keep loop alive
            continue;
          }
          alpha = tileNoise[i];   // peak brightness (per-tile variation)
          onDelayEnd[i]  = 0;
          fadeStartAt[i] = now + Math.random() * OFF_MAX_DELAY;
        }

        /* ── Fade: every lit tile decays on its own schedule ── */
        if (alpha > 0.005) {
          if (!fadeStartAt[i]) fadeStartAt[i] = now; // safety
          if (now >= fadeStartAt[i]) alpha *= decayRate[i];
        }

        liveAlpha[i] = alpha < 0.006 ? 0 : alpha;
        if (liveAlpha[i] < 0.006) {
          liveAlpha[i]  = 0;
          fadeStartAt[i] = 0; // fully dark — tile can be triggered again
          continue;
        }
        needsNextFrame = true;

        /* Bucket by quantised alpha — one draw call per bucket */
        const bi = Math.min(BUCKETS - 1, Math.floor(alpha * BUCKETS));
        buckets[bi].push(col * CELL + GAP, row * CELL + GAP);
      }
    }

    /* Flush — one beginPath + fill per alpha level */
    for (let bi = 0; bi < BUCKETS; bi++) {
      if (!buckets[bi].length) continue;
      const alpha = (bi + 0.5) / BUCKETS;
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
      ctx.beginPath();
      for (let j = 0; j < buckets[bi].length; j += 2) {
        ctx.roundRect(buckets[bi][j], buckets[bi][j + 1], TILE_S, TILE_S, BR);
      }
      ctx.fill();
      buckets[bi].length = 0;
    }

    rafId = (mouseX !== null || needsNextFrame) ? requestAnimationFrame(tick) : null;
  }

  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  /* ── Events ─────────────────────────────────
     Track mouse globally so hovering the fixed nav
     (which overlaps the zone geometrically but is a
     separate DOM element) doesn't kill the effect.
     ────────────────────────────────────────────── */
  let inZone = false;

  document.addEventListener('mousemove', e => {
    const rect = zone.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top  && e.clientY <= rect.bottom;

    if (inside) {
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      if (!inZone) inZone = true;
      startLoop();
    } else if (inZone) {
      /* Cursor genuinely left the zone — tiles already have their own fade timers */
      inZone = false;
      mouseX = null;
      mouseY = null;
      hotX   = null;
      hotY   = null;
      startLoop();
    }
  }, { passive: true });

  /* ── Init ────────────────────────────────── */
  // ResizeObserver covers both window resizes and image-load expansions
  // (the header grows after the cover image loads — a window 'resize' event
  //  never fires for that, but ResizeObserver does).
  const ro = new ResizeObserver(() => resize());
  ro.observe(zone);
})();
