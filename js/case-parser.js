/* ============================================
   CASE PARSER
   Fetches content.md, parses a two-level block syntax,
   and renders case study content into two mounts:

   #case-hero     (inside .site-header) — receives the [case] block:
                  hero title, description, and meta items as a .hero section.
                  If hero: image is specified, also renders a .case__cover below.

   #case-content  (inside main > .frame) — receives all [block] groups.

   DOCUMENT STRUCTURE
   ──────────────────────────────────────────────
   [case]                      ← special first block (hero)
     hero: img/hero.png
     hero-alt: Alt text
     title: Project title
     text: Short intro sentence.
     meta: Label | Value
     meta: Label | Value

   [block]                     ← opens a .block div
   [section]                   ← section heading with accent underline
   Title

   [image]
   src: image.png
   alt: Description

   [split-title]
   title: Left title
   text: Right paragraph text.

   [split-text]
   text: Paragraph one.

   Another paragraph after a blank line.

   - Bullet one
   - Bullet two

   [/block]                    ← optional closing (also auto-closes on next [block])
   ============================================ */
(function () {
  'use strict';

  const contentMount = document.getElementById('case-content');
  if (!contentMount) return;

  const heroMount  = document.getElementById('case-hero');  // case info below header
  const coverMount = document.getElementById('case-cover'); // image inside header
  const src = contentMount.dataset.src;
  if (!src) return;

  const page = document.querySelector('.page');

  fetch(src)
    .then(r => {
      if (!r.ok) throw new Error(`[case-parser] Cannot load "${src}" (${r.status})`);
      return r.text();
    })
    .then(md => {
      const groups = parse(md);
      render(groups, contentMount, heroMount, coverMount);
      if (page) requestAnimationFrame(() => page.classList.add('is-ready'));
    })
    .catch(err => {
      console.error(err);
      if (page) requestAnimationFrame(() => page.classList.add('is-ready'));
    });

  /* ==========================================
     PARSER  — two-level
     Level 1: [case]  |  [block ...]  |  [/block]
     Level 2: [section] [image] [split-title] [split-text]
     ========================================== */

  function parse(text) {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const groups = [];

    let currentGroup = null;
    let currentItem  = null;

    const flushItem = () => {
      if (currentItem && currentGroup) {
        const body = currentItem.lines.join('\n').trim();
        currentGroup.children.push({ type: currentItem.type, props: parseProps(currentItem.type, body) });
      }
      currentItem = null;
    };

    const flushGroup = () => {
      flushItem();
      if (currentGroup) groups.push(currentGroup);
      currentGroup = null;
    };

    for (const line of lines) {
      if (/^\[case\]\s*$/i.test(line)) {
        flushGroup();
        currentGroup = { type: 'case', lines: [] };
        currentItem  = null;
        continue;
      }

      const blockOpen = line.match(/^\[block([^\]]*)\]\s*$/i);
      if (blockOpen) {
        flushGroup();
        const extra = blockOpen[1].trim();
        currentGroup = { type: 'group', className: 'block' + (extra ? ' ' + extra : ''), children: [] };
        currentItem  = null;
        continue;
      }

      if (/^\[\/block\]\s*$/i.test(line)) {
        flushGroup();
        continue;
      }

      const itemHeader = line.match(/^\[([a-z][\w-]*)\]\s*$/i);
      if (itemHeader && currentGroup && currentGroup.type !== 'case') {
        flushItem();
        currentItem = { type: itemHeader[1].toLowerCase(), lines: [] };
        continue;
      }

      if (currentGroup) {
        if (currentGroup.type === 'case') {
          currentGroup.lines.push(line);
        } else if (currentItem) {
          currentItem.lines.push(line);
        }
      }
    }

    flushGroup();

    return groups.map(g => {
      if (g.type === 'case') {
        return { type: 'case', props: parseProps('case', g.lines.join('\n').trim()) };
      }
      return g;
    });
  }

  function parseProps(type, body) {
    if (type === 'section') return { title: body };

    const props  = {};
    const metas  = [];
    const lines  = body.split('\n');
    let key      = null;
    let valLines = [];

    const flush = () => {
      if (key) { props[key] = valLines.join('\n').trim(); key = null; valLines = []; }
    };

    for (const line of lines) {
      const kv = line.match(/^([\w-]+):\s*(.*)/);
      if (kv) {
        const [, k, v] = kv;
        if (k === 'meta') { flush(); metas.push(v.trim()); }
        else              { flush(); key = k; valLines = [v]; }
      } else if (key) {
        valLines.push(line);
      }
    }
    flush();

    if (metas.length) props.metas = metas;
    return props;
  }

  /* ==========================================
     RENDERER
     ========================================== */

  // Sections collected during render — used to build the TOC
  const tocSections = [];

  function render(groups, contentMount, heroMount, coverMount) {
    groups.forEach(group => {
      if (group.type === 'case') {
        renderCaseHero(group.props, heroMount || contentMount, coverMount);
        return;
      }

      // Regular .block group
      const blockEl = el('div', group.className);
      group.children.forEach(item => {
        const node = renderItem(item);
        if (node) blockEl.appendChild(node);
      });
      contentMount.appendChild(blockEl);
    });

    // Build TOC once all sections are known
    if (tocSections.length >= 2) buildToc(tocSections);
  }

  /* ── Item renderers ── */

  function renderItem(item) {
    switch (item.type) {
      case 'section':     return renderSection(item.props);
      case 'image':       return renderImage(item.props);
      case 'split-title': return renderSplit(item.props, true);
      case 'split-text':  return renderSplit(item.props, false);
      default:
        console.warn('[case-parser] Unknown item type:', item.type);
        return null;
    }
  }

  /** [section] → .section-head with top border + brand mark */
  function renderSection(p) {
    const head = el('div', 'section-head');

    // Anchor ID from slugified title — used by the TOC
    const id = slugify(p.title || '');
    if (id) {
      head.id = id;
      tocSections.push({ title: p.title || '', id });
    }

    const h = el('h2', 'h3');
    h.textContent = p.title || '';
    head.appendChild(h);

    // Brand mark — same 3-square SVG as the nav logo
    const NS  = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 24 16');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('section-head__mark');
    [
      [0, 8], [8, 0], [16, 8],
    ].forEach(([x, y]) => {
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', x); r.setAttribute('y', y);
      r.setAttribute('width', 8); r.setAttribute('height', 8);
      r.setAttribute('rx', 2);
      r.setAttribute('fill', 'var(--color-accent)');
      svg.appendChild(r);
    });
    head.appendChild(svg);

    return head;
  }

  /** [image] → <figure> with full-width img + optional figcaption */
  function renderImage(p) {
    const figure = document.createElement('figure');
    figure.className = 'case__figure';

    const img = document.createElement('img');
    img.className = 'case__image';
    img.src = resolveImage(p.src);
    img.alt = p.alt || '';
    img.setAttribute('data-lightbox', '');
    if (p.caption) img.dataset.caption = p.caption;
    figure.appendChild(img);

    if (p.caption) {
      const cap = document.createElement('figcaption');
      cap.className = 'case__caption';
      cap.textContent = p.caption;
      figure.appendChild(cap);
    }

    return figure;
  }

  /** [split-title] / [split-text] → .case__split 1fr 2fr grid */
  function renderSplit(p, hasTitle) {
    const split = el('div', 'case__split');
    const left  = el('div', 'case__split-left');
    const right = el('div', 'case__split-right');

    if (hasTitle && p.title) {
      const h = el('h3', 'h3');
      h.textContent = p.title;
      left.appendChild(h);
    }

    if (p.text) renderTextContent(p.text, right);

    split.appendChild(left);
    split.appendChild(right);
    return split;
  }

  /**
   * Parse inline **bold** markers into an array of DOM nodes.
   * Plain text → TextNode, **wrapped** text → <span class="bold">.
   */
  function parseInline(text) {
    const nodes = [];
    text.split(/\*\*(.*?)\*\*/g).forEach(function (part, i) {
      if (!part) return;
      if (i % 2 === 1) {
        const s = document.createElement('span');
        s.className = 'bold';
        s.textContent = part;
        nodes.push(s);
      } else {
        nodes.push(document.createTextNode(part));
      }
    });
    return nodes;
  }

  /**
   * Render rich text into a container element.
   * Blank lines         → paragraph break
   * Lines starting "- " → bullet list
   * Single newlines     → <br> within the same paragraph
   * **text**            → <strong>
   */
  function renderTextContent(text, container) {
    const blocks = text.split(/\n{2,}/);

    blocks.forEach(block => {
      const trimmed = block.trim();
      if (!trimmed) return;

      const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);

      if (lines.every(l => l.startsWith('- '))) {
        const count = lines.length;
        const cols  = count === 3 ? 3 : count >= 2 ? 2 : 1;
        const ul    = el('ul', 'case__list case__list--cols-' + cols);
        lines.forEach(l => {
          const li = document.createElement('li');
          const span = document.createElement('span');
          parseInline(l.slice(2).trim()).forEach(n => span.appendChild(n));
          li.appendChild(span);
          ul.appendChild(li);
        });
        container.appendChild(ul);
        return;
      }

      const p = document.createElement('p');
      lines.forEach((line, i) => {
        if (i > 0) p.appendChild(document.createTextNode(' '));
        parseInline(line).forEach(n => p.appendChild(n));
      });
      container.appendChild(p);
    });
  }

  /* ── [case] block ────────────────────────────────────────────
     Cover image  → coverTarget  (#case-cover, inside site-header)
     Info section → infoTarget   (#case-hero,  in .case__info below header)
     ─────────────────────────────────────────────────────────── */
  function renderCaseHero(p, infoTarget, coverTarget) {
    // ── Cover image (fills the site-header, z-index: -3 via CSS) ──
    if (p.hero && coverTarget) {
      const img = document.createElement('img');
      img.className = 'case__header-img';
      img.src = resolveImage(p.hero);
      img.alt = p['hero-alt'] || '';
      coverTarget.appendChild(img);
    }

    // ── Info: title, description, meta (below the header) ──
    const content = el('div', 'hero__content');

    if (p.title) {
      const h = el('h1', 'h1');
      h.textContent = p.title;
      content.appendChild(h);
    }

    if (p.text) {
      const desc = el('div', 'hero__desc');
      renderTextContent(p.text, desc);
      content.appendChild(desc);
    }

    if (p.metas && p.metas.length) {
      const dl = el('dl', 'case__hero-meta');
      p.metas.forEach(m => {
        const [label, value] = m.split('|').map(s => s.trim());
        const item = el('div', 'case__hero-meta-item');
        const dt   = el('dt', 'label');
        dt.textContent = label || '';
        const dd = document.createElement('dd');
        dd.textContent = value || '';
        item.appendChild(dt);
        item.appendChild(dd);
        dl.appendChild(item);
      });
      content.appendChild(dl);
    }

    infoTarget.appendChild(content);
  }

  /* ==========================================
     TABLE OF CONTENTS
     ========================================== */

  function buildToc(sections) {
    const main = document.querySelector('main');
    if (!main) return;

    const nav = el('nav', 'case-toc');
    nav.setAttribute('aria-label', 'Table des matières');

    const ul = el('ul', 'case-toc__list');
    sections.forEach(({ title, id }) => {
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href       = '#' + id;
      a.className  = 'case-toc__link';
      a.textContent = title;
      li.appendChild(a);
      ul.appendChild(li);
    });
    nav.appendChild(ul);

    // Inject as first child of <main> so sticky works within the scroll flow
    main.insertBefore(nav, main.firstChild);
    main.classList.add('has-toc');

    // ── Scroll-spy via IntersectionObserver ──
    const links    = Array.from(nav.querySelectorAll('.case-toc__link'));
    const headings = sections.map(s => document.getElementById(s.id)).filter(Boolean);
    let activeId      = null;
    let suppressSpy   = false;  // true while a click-triggered scroll is animating
    let suppressTimer = null;

    function setActive(id) {
      if (id === activeId) return;
      activeId = id;
      links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
    }

    const observer = new IntersectionObserver(function () {
      if (suppressSpy) return; // ignore observer fires during smooth scroll
      let found = null;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= window.innerHeight * 0.3) found = h;
        else break;
      }
      setActive(found ? found.id : (headings[0] ? headings[0].id : null));
    }, { rootMargin: '0px 0px -65% 0px', threshold: 0 });

    headings.forEach(function (h) { observer.observe(h); });

    // ── Smooth scroll with 64px breathing room above target ──
    nav.addEventListener('click', function (e) {
      const a = e.target.closest('.case-toc__link');
      if (!a) return;
      e.preventDefault();
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;

      // Immediately mark the clicked item as active and freeze the spy
      setActive(a.getAttribute('href').slice(1));
      suppressSpy = true;
      clearTimeout(suppressTimer);
      suppressTimer = setTimeout(function () { suppressSpy = false; }, 900);

      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* ==========================================
     HELPERS
     ========================================== */

  function slugify(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function resolveImage(value) {
    if (!value) return '';
    if (value.startsWith('http') || value.includes('/')) return value;
    return 'img/' + value;
  }

  function el(tag, className) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
  }

})();
