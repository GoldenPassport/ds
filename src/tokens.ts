/** Design token constants — use in non-Tailwind contexts (SVG, canvas, inline style) */
export const tokens = {
  colors: {
    primary50:  '#FFFBEB',
    primary100: '#FEF3C7',
    primary200: '#FDE68A',
    primary300: '#FCD34D',
    primary400: '#FBBF24',
    primary500: '#F5C200',   // primary brand
    primary600: '#D4A500',
    primary700: '#A37C00',
    primary800: '#725600',
    primary900: '#3D2E00',

    ink50:  '#F8F7F4',
    ink100: '#EDECEA',
    ink200: '#D6D4CF',
    ink300: '#B0ADA6',
    ink400: '#7E7A72',
    ink500: '#55524C',
    ink600: '#3A3733',
    ink700: '#27241F',
    ink800: '#1A1714',
    ink900: '#0E0D0B',

    slate100: '#E1E8F2',
    slate300: '#93AECF',
    slate400: '#5A82B4',
    slate500: '#3460A0',
    slate700: '#1A3564',

    success: '#22C55E',  successBg: '#DCFCE7',
    warning: '#F59E0B',  warningBg: '#FEF3C7',
    error:   '#EF4444',  errorBg:   '#FEE2E2',
    info:    '#3B82F6',  infoBg:    '#DBEAFE',
  },
  fonts: {
    display: "'Plus Jakarta Sans', sans-serif",
    body:    "'DM Sans', sans-serif",
    mono:    "'JetBrains Mono', monospace",
  },
  radius: {
    sm:   '4px',
    md:   '8px',
    lg:   '12px',
    xl:   '16px',
    '2xl':'24px',
    full: '9999px',
  },
  shadow: {
    sm:     '0 1px 2px 0 rgb(14 13 11 / 0.06)',
    md:     '0 4px 12px 0 rgb(14 13 11 / 0.08), 0 1px 3px 0 rgb(14 13 11 / 0.04)',
    lg:     '0 12px 32px 0 rgb(14 13 11 / 0.10), 0 3px 8px 0 rgb(14 13 11 / 0.06)',
    primary: '0 0 0 3px rgb(245 194 0 / 0.25), 0 0 20px rgb(245 194 0 / 0.10)',
    darkMd: '0 4px 12px 0 rgb(0 0 0 / 0.40)',
  },
} as const;

export type Theme = 'light' | 'dark';
