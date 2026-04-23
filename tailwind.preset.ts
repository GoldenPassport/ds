/**
 * Golden Passport Tailwind Preset
 *
 * Usage in a consumer app's CSS (Tailwind v4):
 *   @import "@golden-passport/ds/styles";
 *
 * Or extend programmatically (Tailwind v3 / vite plugin):
 *   import gpPreset from '@golden-passport/ds/tailwind-preset';
 *   // In tailwind.config.js: presets: [gpPreset]
 */

/** @type {import('tailwindcss').Config} */
const gpPreset = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F5C200',
          600: '#D4A500',
          700: '#A37C00',
          800: '#725600',
          900: '#3D2E00',
        },
        ink: {
          50:  '#F8F7F4',
          100: '#EDECEA',
          200: '#D6D4CF',
          300: '#B0ADA6',
          400: '#7E7A72',
          500: '#55524C',
          600: '#3A3733',
          700: '#27241F',
          800: '#1A1714',
          900: '#0E0D0B',
        },
        slate: {
          50:  '#F1F4F9',
          100: '#E1E8F2',
          200: '#C3D1E5',
          300: '#93AECF',
          400: '#5A82B4',
          500: '#3460A0',
          600: '#254A82',
          700: '#1A3564',
          800: '#112247',
          900: '#0A1428',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm:   '4px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
        '2xl':'24px',
      },
      boxShadow: {
        sm:        '0 1px 2px 0 rgb(14 13 11 / 0.06)',
        md:        '0 4px 12px 0 rgb(14 13 11 / 0.08), 0 1px 3px 0 rgb(14 13 11 / 0.04)',
        lg:        '0 12px 32px 0 rgb(14 13 11 / 0.10), 0 3px 8px 0 rgb(14 13 11 / 0.06)',
        primary:   '0 0 0 3px rgb(245 194 0 / 0.25), 0 0 20px rgb(245 194 0 / 0.10)',
        'dark-sm': '0 1px 2px 0 rgb(0 0 0 / 0.30)',
        'dark-md': '0 4px 12px 0 rgb(0 0 0 / 0.40)',
      },
      animation: {
        'gp-pulse':   'gpPulse 2s ease-in-out infinite',
        'gp-fade-in': 'gpFadeIn 0.2s ease-out',
        'gp-slide-up':'gpSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        gpPulse:   { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
        gpFadeIn:  { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        gpSlideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
};

export default gpPreset;
module.exports = gpPreset;
