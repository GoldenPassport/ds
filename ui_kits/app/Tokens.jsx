// Golden Passport — Tokens & Primitives (Tailwind v4)
// Raw GP values kept for SVG/canvas use only; UI uses Tailwind classes.

const GP = {
  colors: {
    gold500: '#F5C200', gold600: '#D4A500', gold400: '#FBBF24',
    gold100: '#FEF3C7', gold900: '#3D2E00',
    ink50: '#F8F7F4', ink100: '#EDECEA', ink200: '#D6D4CF',
    ink300: '#B0ADA6', ink400: '#7E7A72', ink500: '#55524C',
    ink600: '#3A3733', ink700: '#27241F', ink800: '#1A1714', ink900: '#0E0D0B',
    slate100: '#E1E8F2', slate400: '#5A82B4', slate500: '#3460A0', slate700: '#1A3564',
    success: '#22C55E', successBg: '#DCFCE7',
    warning: '#F59E0B', warningBg: '#FEF3C7',
    error: '#EF4444', errorBg: '#FEE2E2',
    info: '#3B82F6', infoBg: '#DBEAFE',
  },
  fonts: {
    display: "'Plus Jakarta Sans', sans-serif",
    body: "'DM Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  shadow: {
    gold: '0 0 0 3px rgb(245 194 0 / 0.30), 0 0 20px rgb(245 194 0 / 0.10)',
  },
};

const ThemeContext = React.createContext('light');
const useTheme = () => React.useContext(ThemeContext);

// ── Badge ─────────────────────────────────────────────────
function Badge({ label, variant = 'neutral' }) {
  const variants = {
    active:  { wrap: 'bg-green-100 text-green-700',             dot: 'bg-green-500' },
    running: { wrap: 'bg-gold-100 text-gold-700',               dot: 'bg-gold-500' },
    pending: { wrap: 'bg-blue-100 text-blue-700',               dot: 'bg-blue-500' },
    draft:   { wrap: 'bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300', dot: 'bg-ink-300' },
    failed:  { wrap: 'bg-red-100 text-red-700',                 dot: 'bg-red-500' },
    ai:      { wrap: 'bg-slate-100 text-slate-600',             dot: null },
    neutral: { wrap: 'bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300', dot: null },
  };
  const v = variants[variant] || variants.neutral;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full font-body ${v.wrap}`}>
      {v.dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${v.dot}`} />}
      {label}
    </span>
  );
}

// ── Button ────────────────────────────────────────────────
function Btn({ children, variant = 'primary', size = 'md', onClick, disabled, className = '' }) {
  const variants = {
    primary:   'bg-gold-500 text-ink-900 hover:bg-gold-600 border-0',
    secondary: 'bg-ink-100 text-ink-900 hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-50 dark:hover:bg-ink-600 border-0',
    ghost:     'bg-transparent text-ink-500 border border-ink-200 hover:border-ink-400 dark:text-ink-300 dark:border-ink-600 dark:hover:border-ink-400',
    danger:    'bg-red-100 text-red-700 hover:bg-red-200 border-0',
  };
  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs rounded-md',
    md: 'px-[18px] py-[9px] text-sm rounded-lg',
    lg: 'px-6 py-3.5 text-base rounded-xl',
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-semibold font-body cursor-pointer transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// ── Avatar ────────────────────────────────────────────────
function Avatar({ name, size = 32 }) {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      style={{ width: size, height: size, background: 'linear-gradient(135deg, #FBBF24, #D4A500)', fontSize: size * 0.35 }}
      className="rounded-full flex items-center justify-center font-bold text-ink-900 font-display shrink-0"
    >
      {initials}
    </div>
  );
}

Object.assign(window, { GP, ThemeContext, useTheme, Badge, Btn, Avatar });
