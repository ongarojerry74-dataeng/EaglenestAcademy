/**
 * tailwind-config.js
 * Eaglenest Academy – Tailwind CSS configuration.
 * Loaded BEFORE the Tailwind CDN script via a <script> block so the CDN
 * picks it up through the `tailwind.config` global.
 *
 * Usage in every page:
 *   <script src="assets/js/tailwind-config.js"></script>
 *   <script src="https://cdn.tailwindcss.com"></script>
 */

tailwind.config = {
  /* ── Theme ─────────────────────────────────────────────────────────────── */
  theme: {
    extend: {

      /* ── Brand colours ──────────────────────────────────────────────── */
      colors: {
        sky: {
          50:  '#F0F9FF',
          100: '#E0F2FE',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        leaf: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
        },
        ink: '#0F2A43',   // deep navy – primary text / dark backgrounds
      },

      /* ── Typography ─────────────────────────────────────────────────── */
      fontFamily: {
        heading: ['"Century Gothic"', '"Questrial"', 'sans-serif'],
        body:    ['"Montserrat"',     'sans-serif'],
      },

      /* ── Box shadows (soft / elevated card look) ────────────────────── */
      boxShadow: {
        soft:    '0 2px 12px rgba(15, 42, 67, 0.08)',
        card:    '0 4px 24px rgba(15, 42, 67, 0.12)',
        elevated:'0 8px 40px rgba(15, 42, 67, 0.16)',
      },

      /* ── Border-radius scale ────────────────────────────────────────── */
      borderRadius: {
        xs:  '4px',
        sm:  '6px',
        md:  '10px',
        lg:  '16px',
        xl:  '24px',
        '2xl': '32px',
        pill: '9999px',
      },
    },
  },

  /* ── Plugins (none needed for CDN-only build) ───────────────────────────── */
  plugins: [],
};
