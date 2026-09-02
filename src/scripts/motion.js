/* ============================================================
   ANVESHANA — MOTION ENGINE
   ------------------------------------------------------------
   Hand-written so the whole site ships a few kilobytes of
   motion code instead of a 150 KB animation library. Every
   behaviour is opt-in via a data attribute, and every one of
   them is skipped entirely when the visitor has asked for
   reduced motion.
   ============================================================ */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');

const prefersReduced = () => reduced.matches;

/* Marks the document as JS-capable. Reveal styles hang off this
   class so that if the bundle never arrives, content is simply
   visible rather than stuck at opacity 0. */
document.documentElement.classList.add('motion-ready');

/* ------------------------------------------------------------
   1. SCROLL REVEAL
   Elements rise and fade in once, as they enter the viewport.
   Children of [data-reveal-group] are staggered automatically.
   ------------------------------------------------------------ */
function initReveal() {
  const items = document.querySelectorAll('[data-reveal], [data-draw-rule]');
  if (!items.length) return;

  if (prefersReduced() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  /* Stagger group children before observing, so each card in a
     grid trails the one before it. */
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    const step = Number(group.dataset.revealGroup) || 90;
    Array.from(group.children).forEach((child, i) => {
      const target = child.matches('[data-reveal]')
        ? child
        : child.querySelector('[data-reveal]');
      if (target && !target.style.getPropertyValue('--reveal-delay')) {
        target.style.setProperty('--reveal-delay', `${i * step}ms`);
      }
    });
  });

  const pending = new Set(items);

  const reveal = (el) => {
    el.classList.add('is-revealed');
    pending.delete(el);
    io.unobserve(el);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    },
    /* Fire slightly before the element reaches the fold so the
       motion is already settling by the time it is read. */
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
  );

  items.forEach((el) => io.observe(el));

  /* Safety net. IntersectionObserver delivers asynchronously and
     can miss an element during a very fast programmatic scroll
     or an anchor jump — and a missed element would stay at
     opacity 0 permanently, which is far worse than an unanimated
     one. This sweep catches any straggler that is on screen, and
     detaches itself as soon as nothing is left to reveal. */
  let sweeping = false;
  const sweep = () => {
    sweeping = false;
    pending.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) reveal(el);
    });
    if (!pending.size) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  };

  const onScroll = () => {
    if (sweeping) return;
    sweeping = true;
    requestAnimationFrame(sweep);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

/* ------------------------------------------------------------
   2. SPLIT-LINE DELAYS
   Markup supplies the lines (see SplitText.astro); this only
   assigns the cascade so each line trails the one above it.
   ------------------------------------------------------------ */
function initSplitDelays() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    const step = Number(el.dataset.split) || 105;
    el.querySelectorAll('.split-line__inner').forEach((line, i) => {
      line.style.setProperty('--line-delay', `${i * step}ms`);
    });
  });
}

/* ------------------------------------------------------------
   3. 3D DEPTH SCENE
   Pointer position drives --px/--py on the scene; each layer
   multiplies them by its own --depth. Layers sit at different
   Z translations in CSS, so this is true perspective parallax
   rather than a flat 2D offset.
   ------------------------------------------------------------ */
function initDepth() {
  const scenes = document.querySelectorAll('[data-depth-scene]');
  if (!scenes.length || prefersReduced() || !finePointer.matches) return;

  scenes.forEach((scene) => {
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const tick = () => {
      /* Lerp toward the pointer. The low factor is what makes
         the movement feel weighted rather than twitchy. */
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      scene.style.setProperty('--px', cx.toFixed(4));
      scene.style.setProperty('--py', cy.toFixed(4));
      raf = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001
        ? requestAnimationFrame(tick)
        : 0;
    };

    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onMove = (e) => {
      const r = scene.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      start();
    };

    const onLeave = () => { tx = 0; ty = 0; start(); };

    scene.addEventListener('pointermove', onMove, { passive: true });
    scene.addEventListener('pointerleave', onLeave, { passive: true });
  });
}

/* ------------------------------------------------------------
   4. CARD TILT
   A restrained rotation on hover. Capped low on purpose — a
   steep tilt reads as a novelty, a shallow one reads as depth.
   ------------------------------------------------------------ */
function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length || prefersReduced() || !finePointer.matches) return;

  cards.forEach((card) => {
    const max = Number(card.dataset.tilt) || 5;

    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.classList.add('is-tilting');
      card.style.transform =
        `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) ` +
        `rotateY(${(px * max).toFixed(2)}deg) translate3d(0,0,0)`;
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.transform = '';
    });
  });
}

/* ------------------------------------------------------------
   5. MAGNETIC ELEMENTS
   The control drifts toward the cursor within its own bounds.
   ------------------------------------------------------------ */
function initMagnetic() {
  const els = document.querySelectorAll('[data-magnetic]');
  if (!els.length || prefersReduced() || !finePointer.matches) return;

  els.forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.28;

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.classList.add('is-magnetised');
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }, { passive: true });

    el.addEventListener('pointerleave', () => {
      el.classList.remove('is-magnetised');
      el.style.transform = '';
    });
  });
}

/* ------------------------------------------------------------
   6. COUNTERS
   ------------------------------------------------------------ */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const render = (el, value) => {
    const decimals = Number(el.dataset.countDecimals) || 0;
    el.textContent =
      (el.dataset.countPrefix || '') +
      value.toFixed(decimals) +
      (el.dataset.countSuffix || '');
  };

  if (prefersReduced() || !('IntersectionObserver' in window)) {
    els.forEach((el) => render(el, Number(el.dataset.count)));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);

      const target = Number(el.dataset.count);
      const duration = Number(el.dataset.countDuration) || 1700;
      const start = performance.now();

      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        /* Same expo-out curve as the CSS, so counters settle in
           sympathy with everything else on screen. */
        const eased = 1 - Math.pow(1 - t, 4);
        render(el, target * eased);
        if (t < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  els.forEach((el) => { render(el, 0); io.observe(el); });
}

/* ------------------------------------------------------------
   7. HEADER STATE
   Condenses on scroll, and hides when the visitor scrolls down
   past the fold so the reading column is never crowded.
   ------------------------------------------------------------ */
function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  let last = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);

    const menuOpen = document.body.classList.contains('is-locked');
    header.classList.toggle('is-hidden', !menuOpen && y > 560 && y > last);

    last = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });

  update();
}

/* ------------------------------------------------------------
   8. MOBILE MENU
   ------------------------------------------------------------ */
function initMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('is-locked', open);
    /* Keep the panel out of the tab order while closed. */
    menu.querySelectorAll('a, button').forEach((el) => {
      el.tabIndex = open ? 0 : -1;
    });
    if (open) menu.querySelector('a')?.focus({ preventScroll: true });
  };

  setOpen(false);

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ------------------------------------------------------------
   9. CUSTOM CURSOR
   Fine pointers only — never shown on touch or coarse input.
   ------------------------------------------------------------ */
function initCursor() {
  if (prefersReduced() || !finePointer.matches) return;

  const cursor = document.querySelector('[data-cursor]');
  if (!cursor) return;

  const ring = cursor.querySelector('.cursor__ring');
  const gavel = cursor.querySelector('.cursor__gavel');
  const impact = cursor.querySelector('.cursor__impact');
  if (!ring || !gavel || !impact) return;

  /* Only now is the native pointer hidden. If anything above
     returned early, the visitor keeps their system cursor. */
  document.documentElement.classList.add('has-gavel');

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let gx = mx;
  let gy = my;
  let rx = mx;
  let ry = my;
  let raf = 0;

  const INTERACTIVE = 'a, button, summary, [data-cursor-hover], input, textarea, select';

  const tick = () => {
    /* Two different lags. The gavel is heavy and trails a
       little; the halo trails further still. Matching speeds
       would make the whole thing read as one rigid sprite. */
    gx += (mx - gx) * 0.22;
    gy += (my - gy) * 0.22;
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;

    /* Snap once the remaining distance is sub-pixel, so the
       trail always lands exactly on the pointer rather than
       creeping toward it forever. */
    if (Math.abs(mx - gx) < 0.4 && Math.abs(my - gy) < 0.4) { gx = mx; gy = my; }
    if (Math.abs(mx - rx) < 0.4 && Math.abs(my - ry) < 0.4) { rx = mx; ry = my; }

    gavel.style.translate = `${gx}px ${gy}px`;
    ring.style.translate = `${rx}px ${ry}px`;
    impact.style.translate = `${mx}px ${my}px`;

    /* Runs continuously while the cursor is on screen. An
       earlier version stopped once "settled" and could be left
       stranded mid-trail when the pointer arrived in a single
       jump and then stopped — which is exactly what happens
       when someone moves to a button and holds still. */
    raf = requestAnimationFrame(tick);
  };

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX;
    my = e.clientY;
    cursor.classList.add('is-active');
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });

  document.addEventListener('pointerover', (e) => {
    if (e.target?.closest?.(INTERACTIVE)) cursor.classList.add('is-hovering');
  }, { passive: true });

  document.addEventListener('pointerout', (e) => {
    if (e.target?.closest?.(INTERACTIVE)) cursor.classList.remove('is-hovering');
  }, { passive: true });

  /* The strike. Restarting the class on every press means rapid
     clicks each get their own swing rather than the first one
     swallowing the rest. */
  let strikeTimer = 0;
  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    cursor.classList.remove('is-striking');
    void cursor.offsetWidth; // force reflow so the animation replays
    cursor.classList.add('is-striking');
    clearTimeout(strikeTimer);
    strikeTimer = setTimeout(() => cursor.classList.remove('is-striking'), 660);
  }, { passive: true });

  /* Leaving the window stops the loop as well as hiding the
     cursor — no reason to burn frames on an off-screen mark. */
  document.addEventListener('pointerleave', () => {
    cursor.classList.remove('is-active');
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
  });
}

/* ------------------------------------------------------------
   13. THEME
   The stored theme is already applied by the inline script in
   <head>; this only wires up the switches and keeps them, and
   the browser chrome colour, in step.
   ------------------------------------------------------------ */
function initTheme() {
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  if (!toggles.length) return;

  const meta = document.querySelector('[data-theme-color]');
  const root = document.documentElement;

  const sync = (theme) => {
    toggles.forEach((el) => el.setAttribute('aria-checked', String(theme === 'light')));
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f1ede2' : '#0a1626');
  };

  sync(root.dataset.theme === 'light' ? 'light' : 'dark');

  toggles.forEach((el) => {
    el.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      if (next === 'light') root.dataset.theme = 'light';
      else delete root.dataset.theme;

      try {
        localStorage.setItem('anv:theme', next);
      } catch {
        /* storage blocked — the choice simply won't persist */
      }
      sync(next);
    });
  });
}

/* ------------------------------------------------------------
   10. ENTRY CURTAIN
   Shown once per browsing session, not on every navigation —
   a preloader the visitor sits through repeatedly stops being
   an occasion and becomes an obstacle.
   ------------------------------------------------------------ */
function initCurtain() {
  const curtain = document.querySelector('[data-curtain]');

  /* Hero elements add this to their reveal delay so their
     entrance begins as the curtain parts, not behind it. */
  const setHold = (ms) =>
    document.documentElement.style.setProperty('--stage-hold', `${ms}ms`);

  if (!curtain) {
    setHold(0);
    return;
  }

  const finish = () => {
    curtain.classList.add('is-lifting');
    document.body.classList.remove('is-locked');
    setTimeout(() => curtain.classList.add('is-done'), 1000);
  };

  let seen = false;
  try {
    seen = sessionStorage.getItem('anv:entered') === '1';
    sessionStorage.setItem('anv:entered', '1');
  } catch {
    /* Private browsing or blocked storage — treat as first visit. */
  }

  if (seen || prefersReduced()) {
    curtain.classList.add('is-done');
    document.body.classList.remove('is-locked');
    setHold(0);
    return;
  }

  document.body.classList.add('is-locked');
  /* Long enough for the monogram to draw itself, not so long
     that it costs the visitor real time. */
  const HOLD = 1850;
  setHold(HOLD + 260);
  setTimeout(finish, HOLD);
}

/* ------------------------------------------------------------
   11. PAGE TRANSITION
   An ink wipe covers the viewport before navigation commits.
   Astro's prefetch has usually already cached the destination,
   so the wipe hides the load rather than adding to it.
   ------------------------------------------------------------ */
function initPageTransition() {
  const wipe = document.querySelector('[data-wipe]');
  if (!wipe || prefersReduced()) return;

  /* Arriving from a wipe: cover, then clear. */
  let incoming = false;
  try {
    incoming = sessionStorage.getItem('anv:wiping') === '1';
    sessionStorage.removeItem('anv:wiping');
  } catch { /* storage unavailable */ }

  if (incoming) {
    wipe.style.transform = 'translate3d(0, 0, 0)';
    requestAnimationFrame(() => {
      wipe.classList.add('is-clearing');
      setTimeout(() => {
        wipe.classList.remove('is-clearing');
        wipe.style.transform = '';
      }, 560);
    });
  }

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest?.('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || link.target === '_blank' || link.hasAttribute('download')) return;
    if (/^(mailto:|tel:|#)/.test(href)) return;
    if (link.origin !== window.location.origin) return;
    if (link.pathname === window.location.pathname && link.hash) return;

    e.preventDefault();
    try { sessionStorage.setItem('anv:wiping', '1'); } catch { /* ignore */ }
    wipe.classList.add('is-covering');
    setTimeout(() => { window.location.href = link.href; }, 430);
  });

  /* Restoring from bfcache must not leave the wipe stuck up. */
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      wipe.classList.remove('is-covering', 'is-clearing');
      wipe.style.transform = '';
    }
  });
}

/* ------------------------------------------------------------
   12. MARQUEE DURATION
   Scales the loop to content width so long and short tracks
   scroll at the same perceived speed.
   ------------------------------------------------------------ */
function initMarquee() {
  document.querySelectorAll('.marquee__track').forEach((track) => {
    const speed = Number(track.dataset.speed) || 62; // px per second
    const width = track.scrollWidth;
    if (width) track.style.setProperty('--marquee-dur', `${width / speed}s`);
  });
}

/* ------------------------------------------------------------
   BOOT
   ------------------------------------------------------------ */
function boot() {
  /* Must run first: it publishes --stage-hold, which hero
     elements add to their own reveal delay so that they animate
     in after the curtain lifts rather than behind it. */
  initCurtain();
  initSplitDelays();
  initReveal();
  initDepth();
  initTilt();
  initMagnetic();
  initCounters();
  initHeader();
  initMenu();
  initTheme();
  initCursor();
  initPageTransition();
  initMarquee();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
