import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ── Accessible high-contrast palette (colorblind-safe) ──
         *
         *  Deutan/Protan/Tritan-friendly via:
         *  - Distinct luminance separation (avoid red-only warnings)
         *  - Blue + Orange primary actions (not red/green)
         *  - Labels/icons alongside color cues
         */
        brand: {
          50:  '#eef4ff',
          100: '#dce6fd',
          200: '#b9ccfb',
          300: '#96b3f9',
          400: '#4f7df4',
          500: '#2050d6',   // Primary — strong blue
          600: '#1a42b3',
          700: '#14348f',
          800: '#0e266c',
          900: '#081848',
          950: '#040e2d',
        },
        accent: {
          50:  '#fff7ed',
          100: '#ffecd4',
          200: '#ffd9a8',
          300: '#ffb96a',
          400: '#ff9933',
          500: '#e67300',   // Call-to-action — warm orange
          600: '#cc6600',
          700: '#994d00',
          800: '#663300',
          900: '#331a00',
        },
        surface: {
          50:  '#f8f9fb',
          100: '#f0f2f5',
          200: '#e2e5ec',
          300: '#c4c9d4',
          400: '#9ea4b3',
          500: '#7a8090',
          600: '#5a6070',
          700: '#3d4352',
          800: '#282d3a',
          900: '#1a1d26',
          950: '#0f1117',
        },
        /* Semantic — all distinguishable by shape+label */
        info:    '#2050d6',  // blue
        success: '#1a7b3a',  // dark green (works even with red-blindness)
        warning: '#b35900',  // dark orange
        danger:  '#b32424',  // dark red (paired with icon, not standalone)
      },
      fontFamily: {
        sans: [
          'Inter', 'system-ui', '-apple-system', 'Segoe UI',
          'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif',
        ],
        mono: [
          'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas',
          'Menlo', 'Monaco', 'monospace',
        ],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      maxWidth: {
        '8xl': '1440px',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#1a1d26',
            '--tw-prose-headings': '#0f1117',
            '--tw-prose-links': '#2050d6',
            '--tw-prose-code': '#1a1d26',
            '--tw-prose-pre-bg': '#0f1117',
            '--tw-prose-quotes': '#3d4352',
            '--tw-prose-bullets': '#9ea4b3',
            maxWidth: '75ch',
            code: {
              fontWeight: '500',
              borderRadius: '0.25rem',
              padding: '0.125rem 0.25rem',
              backgroundColor: '#f0f2f5',
            },
            'code::before': { content: '""' },
            'code::after':  { content: '""' },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': '#e2e5ec',
            '--tw-prose-headings': '#f8f9fb',
            '--tw-prose-links': '#96b3f9',
            '--tw-prose-code': '#e2e5ec',
            '--tw-prose-pre-bg': '#0f1117',
            '--tw-prose-quotes': '#c4c9d4',
            '--tw-prose-bullets': '#5a6070',
            code: {
              backgroundColor: '#282d3a',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
