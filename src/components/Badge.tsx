// ── Types ─────────────────────────────────────────────────

export type BadgeVariant =
  | 'active' | 'running' | 'pending' | 'draft'
  | 'failed' | 'ai' | 'neutral' | 'warning';

export interface BadgeProps {
  label:      string;
  variant?:   BadgeVariant;
  /** Visual size — default `md` */
  size?:      'sm' | 'md' | 'lg';
  /** Border radius — default `pill` (rounded-full) */
  shape?:     'pill' | 'rounded';
  /** Adds a ring border around the badge */
  outlined?:  boolean;
  /** Show or hide the leading status dot — defaults to the variant's built-in dot */
  dot?:       boolean;
  /** Renders a remove (×) button; call this handler on click */
  onRemove?:  () => void;
  className?: string;
}

// ── Colour config ─────────────────────────────────────────

interface ColourCfg {
  text:        string;
  flatBg:      string;
  outlinedBg:  string;
  ring:        string;
  dot:         string;
  hasDot:      boolean;    // default visibility of the dot
}

const cfg: Record<BadgeVariant, ColourCfg> = {
  active:  {
    text:       'text-green-700 dark:text-green-400',
    flatBg:     'bg-green-100 dark:bg-green-900/40',
    outlinedBg: 'bg-green-50 dark:bg-green-900/20',
    ring:       'ring-green-600/20 dark:ring-green-500/30',
    dot:        'bg-green-500 dark:bg-green-400',
    hasDot:     true,
  },
  running: {
    text:       'text-primary-700 dark:text-primary-400',
    flatBg:     'bg-primary-100 dark:bg-primary-900/40',
    outlinedBg: 'bg-primary-50 dark:bg-primary-900/20',
    ring:       'ring-primary-600/20 dark:ring-primary-500/30',
    dot:        'bg-primary-500 dark:bg-primary-400',
    hasDot:     true,
  },
  pending: {
    text:       'text-blue-700 dark:text-blue-400',
    flatBg:     'bg-blue-100 dark:bg-blue-900/40',
    outlinedBg: 'bg-blue-50 dark:bg-blue-900/20',
    ring:       'ring-blue-600/20 dark:ring-blue-500/30',
    dot:        'bg-blue-500 dark:bg-blue-400',
    hasDot:     true,
  },
  warning: {
    text:       'text-amber-700 dark:text-amber-400',
    flatBg:     'bg-amber-100 dark:bg-amber-900/40',
    outlinedBg: 'bg-amber-50 dark:bg-amber-900/20',
    ring:       'ring-amber-600/20 dark:ring-amber-500/30',
    dot:        'bg-amber-500 dark:bg-amber-400',
    hasDot:     true,
  },
  failed: {
    text:       'text-red-700 dark:text-red-400',
    flatBg:     'bg-red-100 dark:bg-red-900/40',
    outlinedBg: 'bg-red-50 dark:bg-red-900/20',
    ring:       'ring-red-600/20 dark:ring-red-500/30',
    dot:        'bg-red-500 dark:bg-red-400',
    hasDot:     true,
  },
  draft: {
    text:       'text-ink-500 dark:text-ink-300',
    flatBg:     'bg-ink-100 dark:bg-ink-700',
    outlinedBg: 'bg-ink-50 dark:bg-ink-800',
    ring:       'ring-ink-500/20 dark:ring-ink-400/20',
    dot:        'bg-ink-400',
    hasDot:     true,
  },
  ai: {
    text:       'text-slate-600 dark:text-slate-300',
    flatBg:     'bg-slate-100 dark:bg-slate-800',
    outlinedBg: 'bg-slate-50 dark:bg-slate-800/60',
    ring:       'ring-slate-500/20 dark:ring-slate-400/20',
    dot:        'bg-slate-500 dark:bg-slate-400',
    hasDot:     false,
  },
  neutral: {
    text:       'text-ink-600 dark:text-ink-300',
    flatBg:     'bg-ink-100 dark:bg-ink-700',
    outlinedBg: 'bg-ink-50 dark:bg-ink-800',
    ring:       'ring-ink-500/20 dark:ring-ink-400/20',
    dot:        'bg-ink-400',
    hasDot:     false,
  },
};

// ── Size tokens ───────────────────────────────────────────

const sizes = {
  lg: { wrap: 'px-3 py-1 text-xs gap-2',            dot: 'w-2 h-2' },
  md: { wrap: 'px-2.5 py-0.5 text-[11px] gap-1.5',  dot: 'w-1.5 h-1.5' },
  sm: { wrap: 'px-1.5 py-0.5 text-[10px] gap-1',    dot: 'w-1 h-1' },
};

// ── Component ─────────────────────────────────────────────

export function Badge({
  label,
  variant   = 'neutral',
  size      = 'md',
  shape     = 'pill',
  outlined  = false,
  dot,
  onRemove,
  className = '',
}: BadgeProps) {
  const c   = cfg[variant];
  const sz  = sizes[size];

  const showDot = dot !== undefined ? dot : c.hasDot;
  const bgClass = outlined ? c.outlinedBg : c.flatBg;
  const radius  = shape === 'pill' ? 'rounded-full' : 'rounded-md';

  return (
    <span
      className={[
        'inline-flex items-center font-semibold font-body',
        sz.wrap,
        radius,
        bgClass,
        c.text,
        outlined ? `ring-1 ring-inset ${c.ring}` : '',
        className,
      ].join(' ')}
    >
      {showDot && (
        <span className={`shrink-0 rounded-full ${sz.dot} ${c.dot}`} />
      )}

      {label}

      {onRemove && (
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className={[
            'shrink-0 -mr-0.5 font-normal leading-none text-[1.1em]',
            'opacity-40 hover:opacity-70 transition-opacity',
            'focus:outline-none focus-visible:ring-1 focus-visible:ring-current',
          ].join(' ')}
          aria-hidden="false"
        >
          ×
        </button>
      )}
    </span>
  );
}
