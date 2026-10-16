/**
 * components.js – Eaglenest Academy
 *
 * Renders shared UI components into their placeholder elements:
 *   • #site-header  → sticky navbar with mobile drawer
 *   • #site-footer  → 4-column footer
 *   • floating WhatsApp FAB (appended to <body>)
 *
 * Call initComponents() after the DOM is ready (or from main.js).
 */

/* ── Configuration ────────────────────────────────────────────────────────── */
const SITE = {
  name:    'Eaglenest Academy',
  phone:   '+254XXXXXXXXX',          // placeholder – replace with real number
  email:   'info@eaglenestacademy.ac.ke',
  address: '123 Eagle Ridge, Nairobi, Kenya',
  hours: {
    weekdays: 'Mon – Fri: 7:00 AM – 5:00 PM',
    saturday: 'Sat: 8:00 AM – 12:00 PM',
    sunday:   'Sun: Closed',
  },
  socials: {
    facebook:  '#',
    twitter:   '#',
    instagram: '#',
    youtube:   '#',
  },
};

/* ── Navigation links ─────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home',        href: 'index.html'       },
  { label: 'About',       href: 'about.html'        },
  { label: 'Academics',   href: 'academics.html'    },
  { label: 'Student Life',href: 'student-life.html' },
  { label: 'Admissions',  href: 'admissions.html'   },
  { label: 'Contact',     href: 'contact.html'      },
];

/* ══════════════════════════════════════════════════════════════════════════
   HEADER / NAVBAR
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Determines which nav link matches the current page and returns its href.
 * Falls back to 'index.html' for the root URL.
 */
function getActivePage() {
  const path     = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  return filename;
}

/**
 * Builds a single nav <a> element.
 * @param {{ label: string, href: string }} link
 * @param {string} activePage  – current filename, e.g. "about.html"
 * @param {boolean} mobile     – true → render mobile-drawer variant
 */
function buildNavLink(link, activePage, mobile = false) {
  const isActive = link.href === activePage;

  if (mobile) {
    return `
      <a href="${link.href}"
         class="mobile-nav-link block px-4 py-3 rounded-md text-base font-medium
                text-ink hover:bg-sky-50 hover:text-sky-500 transition-colors
                ${isActive ? 'active-link' : ''}">
        ${link.label}
      </a>`;
  }

  return `
    <a href="${link.href}"
       class="nav-link text-sm font-medium text-ink hover:text-sky-500
              transition-colors duration-200 whitespace-nowrap
              ${isActive ? 'active-link' : ''}">
      ${link.label}
    </a>`;
}

/**
 * Injects the sticky navbar into #site-header.
 */
function renderHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const activePage = getActivePage();

  const desktopLinks = NAV_LINKS
    .map(l => buildNavLink(l, activePage, false))
    .join('');

  const mobileLinks = NAV_LINKS
    .map(l => buildNavLink(l, activePage, true))
    .join('');

  header.innerHTML = `
    <!-- ── Sticky navbar ──────────────────────────────────────────── -->
    <nav id="navbar"
         class="fixed inset-x-0 top-0 z-40 bg-white/95 backdrop-blur-sm
                shadow-soft transition-shadow duration-300"
         aria-label="Main navigation">

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 lg:h-18">

          <!-- Logo -->
          <a href="index.html"
             class="flex items-center gap-2 shrink-0"
             aria-label="${SITE.name} home">
            <img src="assets/images/logo/logo.png"
                 alt="${SITE.name} logo"
                 class="h-10 w-auto"
                 onerror="this.style.display='none'">
            <span class="font-heading text-xl text-ink leading-tight">
              Eaglenest<br>
              <span class="text-leaf-500 text-base font-semibold">Academy</span>
            </span>
          </a>

          <!-- Desktop links -->
          <div class="hidden lg:flex items-center gap-7">
            ${desktopLinks}
          </div>

          <!-- Desktop CTA -->
          <div class="hidden lg:block">
            <a href="admissions.html"
               class="btn btn-primary text-sm">
              Apply Now
            </a>
          </div>

          <!-- Hamburger (mobile) -->
          <button id="menu-toggle"
                  type="button"
                  aria-controls="mobile-drawer"
                  aria-expanded="false"
                  aria-label="Open main menu"
                  class="lg:hidden flex flex-col gap-[5px] p-2 rounded-md
                         text-ink hover:text-leaf-500 focus-visible:ring-2
                         focus-visible:ring-leaf-500 transition-colors">
            <span class="hamburger-line" id="hbg-top"></span>
            <span class="hamburger-line" id="hbg-mid"></span>
            <span class="hamburger-line" id="hbg-bot"></span>
          </button>

        </div><!-- /flex row -->
      </div><!-- /container -->

      <!-- ── Mobile drawer ───────────────────────────────────────── -->
      <div id="mobile-drawer"
           role="dialog"
           aria-modal="true"
           aria-label="Mobile navigation"
           class="lg:hidden overflow-hidden max-h-0 transition-[max-height]
                  duration-300 ease-in-out bg-white border-t border-sky-100">
        <div class="px-4 py-4 space-y-1">
          ${mobileLinks}
          <div class="pt-3 border-t border-sky-100">
            <a href="admissions.html"
               class="btn btn-primary w-full text-sm mt-1">
              Apply Now
            </a>
          </div>
        </div>
      </div><!-- /mobile-drawer -->

    </nav><!-- /navbar -->

    <!-- Spacer so page content clears the fixed navbar -->
    <div class="h-16 lg:h-18" aria-hidden="true"></div>
  `;
}

/* ══════════════════════════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════════════════════════ */

/** SVG icon helpers (inline, no extra dependency). */
const ICONS = {
  phone:    `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
               <path stroke-linecap="round" stroke-linejoin="round"
                 d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372
                    c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97
                    1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441
                    .004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125
                    1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
             </svg>`,
  email:    `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
               <path stroke-linecap="round" stroke-linejoin="round"
                 d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75
                    m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75
                    6.563L2.25 6.75"/>
             </svg>`,
  location: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
               <path stroke-linecap="round" stroke-linejoin="round"
                 d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
               <path stroke-linecap="round" stroke-linejoin="round"
                 d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
             </svg>`,
  clock:    `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
               <path stroke-linecap="round" stroke-linejoin="round"
                 d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
             </svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor"
               viewBox="0 0 24 24" aria-hidden="true">
               <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5
                        5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z"/>
             </svg>`,
  twitter:  `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor"
               viewBox="0 0 24 24" aria-hidden="true">
               <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99
                        21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161
                        17.52h1.833L7.084 4.126H5.117z"/>
             </svg>`,
  instagram:`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor"
               viewBox="0 0 24 24" aria-hidden="true">
               <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919
                        4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149
                        3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204
                        0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07
                        -1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771
                        4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014
                        7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014
                        3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12
                        24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28
                        .073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78
                        -6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324
                        6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44
                        1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
             </svg>`,
  youtube:  `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor"
               viewBox="0 0 24 24" aria-hidden="true">
               <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12
                        3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0
                        3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505
                        0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502
                        -5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
             </svg>`,
};

/**
 * Injects the 4-column footer into #site-footer.
 */
function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  footer.innerHTML = `
    <footer class="bg-ink text-white" aria-label="Site footer">

      <!-- ── Main grid ─────────────────────────────────────────── -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <!-- Column 1 – About blurb -->
          <div>
            <a href="index.html"
               class="flex items-center gap-2 mb-4"
               aria-label="${SITE.name} home">
              <img src="assets/images/logo/logo.png"
                   alt="${SITE.name} logo"
                   class="h-9 w-auto brightness-0 invert"
                   onerror="this.style.display='none'">
              <span class="font-heading text-lg leading-tight">
                Eaglenest<br>
                <span class="text-leaf-400 text-sm">Academy</span>
              </span>
            </a>
            <p class="text-sky-100/70 text-sm leading-relaxed">
              Nurturing curious minds and building confident leaders
              from nursery through secondary – where every learner
              earns their wings.
            </p>
          </div>

          <!-- Column 2 – Quick links -->
          <div>
            <h3 class="font-heading text-base mb-4 text-white">Quick Links</h3>
            <ul class="space-y-2 text-sm" role="list">
              ${NAV_LINKS.map(l => `
              <li>
                <a href="${l.href}"
                   class="text-sky-100/70 hover:text-leaf-400 transition-colors">
                  ${l.label}
                </a>
              </li>`).join('')}
            </ul>
          </div>

          <!-- Column 3 – Contact details -->
          <div>
            <h3 class="font-heading text-base mb-4 text-white">Contact Us</h3>
            <ul class="space-y-3 text-sm" role="list">
              <li>
                <a href="tel:${SITE.phone}"
                   class="flex items-center gap-2 text-sky-100/70
                          hover:text-leaf-400 transition-colors">
                  ${ICONS.phone}
                  <span>${SITE.phone}</span>
                </a>
              </li>
              <li>
                <a href="mailto:${SITE.email}"
                   class="flex items-center gap-2 text-sky-100/70
                          hover:text-leaf-400 transition-colors break-all">
                  ${ICONS.email}
                  <span>${SITE.email}</span>
                </a>
              </li>
              <li class="flex items-start gap-2 text-sky-100/70">
                ${ICONS.location}
                <address class="not-italic leading-snug">${SITE.address}</address>
              </li>
            </ul>
          </div>

          <!-- Column 4 – Hours & socials -->
          <div>
            <h3 class="font-heading text-base mb-4 text-white">Hours</h3>
            <ul class="space-y-2 text-sm mb-6" role="list">
              <li class="flex items-center gap-2 text-sky-100/70">
                ${ICONS.clock}
                <span>${SITE.hours.weekdays}</span>
              </li>
              <li class="flex items-center gap-2 text-sky-100/70">
                ${ICONS.clock}
                <span>${SITE.hours.saturday}</span>
              </li>
              <li class="flex items-center gap-2 text-sky-100/70">
                ${ICONS.clock}
                <span>${SITE.hours.sunday}</span>
              </li>
            </ul>

            <!-- Social icons -->
            <div class="flex items-center gap-3">
              <a href="${SITE.socials.facebook}" target="_blank" rel="noopener"
                 aria-label="Facebook"
                 class="text-sky-100/60 hover:text-leaf-400 transition-colors">
                ${ICONS.facebook}
              </a>
              <a href="${SITE.socials.twitter}" target="_blank" rel="noopener"
                 aria-label="X / Twitter"
                 class="text-sky-100/60 hover:text-leaf-400 transition-colors">
                ${ICONS.twitter}
              </a>
              <a href="${SITE.socials.instagram}" target="_blank" rel="noopener"
                 aria-label="Instagram"
                 class="text-sky-100/60 hover:text-leaf-400 transition-colors">
                ${ICONS.instagram}
              </a>
              <a href="${SITE.socials.youtube}" target="_blank" rel="noopener"
                 aria-label="YouTube"
                 class="text-sky-100/60 hover:text-leaf-400 transition-colors">
                ${ICONS.youtube}
              </a>
            </div>
          </div>

        </div><!-- /grid -->
      </div>

      <!-- ── Bottom bar ─────────────────────────────────────────── -->
      <div class="border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5
                    flex flex-col sm:flex-row items-center justify-between
                    gap-3 text-xs text-sky-100/50">
          <p>&copy; <span id="footer-year"></span> ${SITE.name}. All rights reserved.</p>
          <p>Designed with care for learners everywhere.</p>
        </div>
      </div>

    </footer>
  `;

  /* Inject current year dynamically */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ══════════════════════════════════════════════════════════════════════════
   WHATSAPP FLOATING ACTION BUTTON
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Appends a floating WhatsApp button to <body>.
 * Opens a pre-filled wa.me link in a new tab.
 */
function renderWhatsAppFAB() {
  /* Avoid duplicates if called more than once */
  if (document.getElementById('whatsapp-fab')) return;

  const waNumber  = SITE.phone.replace(/\D/g, ''); // digits only for wa.me
  const waMessage = encodeURIComponent('Hello! I would like to know more about Eaglenest Academy.');

  const fab = document.createElement('a');
  fab.id            = 'whatsapp-fab';
  fab.href          = `https://wa.me/${waNumber}?text=${waMessage}`;
  fab.target        = '_blank';
  fab.rel           = 'noopener noreferrer';
  fab.setAttribute('aria-label', 'Chat with us on WhatsApp');
  fab.title         = 'Chat on WhatsApp';

  /* WhatsApp SVG logo */
  fab.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 32 32"
         class="w-7 h-7"
         fill="white"
         aria-hidden="true">
      <path d="M16.003 2C8.28 2 2.007 8.272 2.007 15.997c0 2.477.65 4.897 1.882
               7.022L2 30l7.184-1.862a13.95 13.95 0 006.82 1.784h.006C23.73 29.922
               30 23.648 30 15.924 30 8.272 23.728 2 16.003 2zm0 25.577a11.61 11.61
               0 01-5.904-1.604l-.424-.251-4.39 1.137 1.162-4.275-.276-.438a11.574
               11.574 0 01-1.792-6.148c0-6.398 5.222-11.612 11.63-11.612 6.407 0
               11.622 5.214 11.622 11.612 0 6.398-5.215 11.58-11.628 11.58zm6.368
               -8.674c-.35-.174-2.065-1.016-2.386-1.133-.32-.116-.554-.174-.787.174
               -.233.35-.903 1.133-1.107 1.368-.203.232-.407.26-.757.087-.35-.175
               -1.477-.543-2.813-1.733-1.04-.926-1.742-2.07-1.946-2.42-.203-.35
               -.022-.538.153-.713.158-.156.35-.405.524-.609.175-.203.233-.35.35
               -.582.116-.233.058-.437-.029-.611-.087-.175-.787-1.894-1.078-2.594
               -.283-.682-.574-.589-.787-.599-.203-.01-.437-.012-.67-.012-.234 0
               -.611.087-.93.437-.32.35-1.22 1.193-1.22 2.91s1.249 3.377 1.423
               3.61c.175.233 2.456 3.75 5.95 5.258.832.36 1.482.574 1.987.736.835.266
               1.596.228 2.197.138.67-.1 2.065-.843 2.358-1.657.29-.814.29-1.512.203
               -1.657-.087-.145-.32-.232-.67-.407z"/>
    </svg>
  `;

  document.body.appendChild(fab);
}

/* ══════════════════════════════════════════════════════════════════════════
   PUBLIC ENTRY POINT
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Initialise all shared components.
 * Called from main.js on DOMContentLoaded.
 */
function initComponents() {
  renderHeader();
  renderFooter();
  renderWhatsAppFAB();
}
