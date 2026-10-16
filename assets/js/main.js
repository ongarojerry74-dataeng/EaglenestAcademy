/**
 * main.js – Eaglenest Academy
 *
 * Bootstraps all shared interactive behaviours:
 *   1. Component injection (header, footer, WhatsApp FAB)
 *   2. Mobile menu toggle + hamburger animation
 *   3. Scroll-reveal via IntersectionObserver
 *   4. Animated stat counters
 *   5. Accordion handler
 *   6. Back-to-top button
 *
 * This file should be the last <script> before </body> on every page.
 */

/* ══════════════════════════════════════════════════════════════════════════
   1. BOOTSTRAP — wait for the DOM
   ══════════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* Render shared components first so the DOM nodes they create exist
     before the event listeners below try to query them. */
  if (typeof initComponents === 'function') {
    initComponents();
  }

  initMobileMenu();
  initScrollReveal();
  initStatCounters();
  initAccordions();
  initBackToTop();
  initNavbarShadow();
});

/* ══════════════════════════════════════════════════════════════════════════
   2. MOBILE MENU TOGGLE
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Wires the hamburger button to open/close the mobile nav drawer.
 * Also animates the three hamburger lines into an ✕ when open.
 */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const hbgTop = document.getElementById('hbg-top');
  const hbgMid = document.getElementById('hbg-mid');
  const hbgBot = document.getElementById('hbg-bot');

  if (!toggle || !drawer) return;

  let isOpen = false;

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    toggle.setAttribute('aria-expanded', String(isOpen));

    if (isOpen) {
      /* Open: expand drawer */
      drawer.style.maxHeight = drawer.scrollHeight + 'px';
      drawer.classList.add('border-t');

      /* Animate lines → ✕ */
      if (hbgTop) hbgTop.style.transform = 'translateY(7px) rotate(45deg)';
      if (hbgMid) hbgMid.style.opacity   = '0';
      if (hbgBot) hbgBot.style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      /* Close: collapse drawer */
      drawer.style.maxHeight = '0';

      /* Restore lines */
      if (hbgTop) hbgTop.style.transform = '';
      if (hbgMid) hbgMid.style.opacity   = '';
      if (hbgBot) hbgBot.style.transform = '';
    }
  });

  /* Close drawer when a link inside it is clicked */
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (!isOpen) return;
      isOpen = false;
      toggle.setAttribute('aria-expanded', 'false');
      drawer.style.maxHeight = '0';
      if (hbgTop) hbgTop.style.transform = '';
      if (hbgMid) hbgMid.style.opacity   = '';
      if (hbgBot) hbgBot.style.transform = '';
    });
  });

  /* Close drawer on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
      toggle.setAttribute('aria-expanded', 'false');
      drawer.style.maxHeight = '0';
      toggle.focus(); // return focus to the trigger
      if (hbgTop) hbgTop.style.transform = '';
      if (hbgMid) hbgMid.style.opacity   = '';
      if (hbgBot) hbgBot.style.transform = '';
    }
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   3. SCROLL-REVEAL (IntersectionObserver)
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Watches all elements with .reveal or .reveal-stagger and adds .is-visible
 * when they enter the viewport. CSS transitions handle the fade-in effect.
 *
 * Respects prefers-reduced-motion: skips animation and shows immediately.
 */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const targets = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!targets.length) return;

  if (prefersReduced) {
    /* Skip animation – make everything visible at once */
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // fire once
        }
      });
    },
    {
      threshold: 0.12,   // trigger when 12 % of the element is visible
      rootMargin: '0px 0px -40px 0px', // slight bottom offset
    }
  );

  targets.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════════════════════
   4. ANIMATED STAT COUNTERS
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Counts up a number element from 0 to its data-target value.
 *
 * HTML usage:
 *   <span class="stat-number" data-target="1200" data-suffix="+"></span>
 *
 * The animation starts when the element enters the viewport.
 */
function initStatCounters() {
  const statEls = document.querySelectorAll('[data-target]');
  if (!statEls.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = parseInt(el.dataset.duration || '1800', 10); // ms

        obs.unobserve(el);

        if (prefersReduced || isNaN(target)) {
          el.textContent = target + suffix;
          return;
        }

        /* easeOutQuart curve for a snappy feel */
        const startTime = performance.now();

        function step(now) {
          const elapsed  = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 4); // easeOutQuart
          const current  = Math.round(eased * target);

          el.textContent = current.toLocaleString() + suffix;

          if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
      });
    },
    { threshold: 0.4 }
  );

  statEls.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════════════════════
   5. ACCORDION HANDLER
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Handles accordion panels.
 *
 * HTML structure expected:
 *   <div class="accordion-item">
 *     <button class="accordion-trigger" aria-expanded="false" aria-controls="panel-1">
 *       Question text
 *     </button>
 *     <div id="panel-1" class="accordion-content" role="region">
 *       Answer text
 *     </div>
 *   </div>
 *
 * By default only one panel can be open at a time (single-expand).
 * Add data-multi="true" to the accordion wrapper for multi-expand behaviour.
 */
function initAccordions() {
  /* Find all accordion wrappers (or fall back to searching globally) */
  const wrappers = document.querySelectorAll('[data-accordion]');

  if (wrappers.length) {
    wrappers.forEach(wrapper => {
      const multiExpand = wrapper.dataset.multi === 'true';
      const triggers    = wrapper.querySelectorAll('.accordion-trigger');
      triggers.forEach(btn => wireAccordion(btn, triggers, multiExpand));
    });
  } else {
    /* No explicit wrapper: treat all triggers independently */
    const triggers = document.querySelectorAll('.accordion-trigger');
    triggers.forEach(btn => wireAccordion(btn, triggers, false));
  }
}

/**
 * Attaches click logic to a single accordion trigger.
 * @param {HTMLElement} trigger
 * @param {NodeList}    allTriggers  – sibling triggers (for single-expand)
 * @param {boolean}     multi        – allow multiple open panels
 */
function wireAccordion(trigger, allTriggers, multi) {
  trigger.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    const panelId  = trigger.getAttribute('aria-controls');
    const panel    = panelId ? document.getElementById(panelId) : null;

    /* Close all siblings first (single-expand mode) */
    if (!multi) {
      allTriggers.forEach(other => {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          const otherPanel = document.getElementById(other.getAttribute('aria-controls'));
          if (otherPanel) otherPanel.classList.remove('open');
        }
      });
    }

    /* Toggle this item */
    const nowExpanded = !expanded;
    trigger.setAttribute('aria-expanded', String(nowExpanded));
    if (panel) panel.classList.toggle('open', nowExpanded);
  });

  /* Keyboard: Space / Enter already handled natively for <button>,
     but if the trigger is a <div> we intercept manually. */
  if (trigger.tagName !== 'BUTTON') {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   6. BACK-TO-TOP BUTTON
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Creates a back-to-top button and shows it after scrolling 400 px.
 * Clicking it scrolls to the top of the page smoothly.
 */
function initBackToTop() {
  /* Create the button element (styled via custom.css #back-to-top) */
  let btn = document.getElementById('back-to-top');

  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Back to top');
    btn.title = 'Back to top';

    /* Up-arrow chevron icon */
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
           aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
      </svg>`;

    document.body.appendChild(btn);
  }

  /* Show / hide on scroll */
  const THRESHOLD = 400; // px from top before button appears

  const onScroll = () => {
    if (window.scrollY > THRESHOLD) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load in case page is already scrolled

  /* Scroll to top on click */
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   7. NAVBAR SHADOW ON SCROLL
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Adds a more prominent shadow to the navbar once the user scrolls down,
 * reinforcing the "sticky / elevated" visual.
 */
function initNavbarShadow() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 10) {
      navbar.classList.add('shadow-card');
      navbar.classList.remove('shadow-soft');
    } else {
      navbar.classList.remove('shadow-card');
      navbar.classList.add('shadow-soft');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
