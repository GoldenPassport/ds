
// ── Types ─────────────────────────────────────────────────
export type BadgeVariant =
  | 'active' | 'running' | 'pending' | 'draft'
  | 'failed' | 'ai' | 'neutral' | 'warning';

export interface BadgeProps {
  label:    string;
  variant?: BadgeVariant;
  className?: string;
}

// ── Config ────────────────────────────────────────────────
const cfg: Record<BadgeVariant, { wrap: string; dot?: string }> = {
  active:  { wrap: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',       dot: 'bg-green-500 dark:bg-green-400' },
  running: { wrap: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400', dot: 'bg-primary-500 dark:bg-primary-400' },
  pending: { wrap: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',           dot: 'bg-blue-500 dark:bg-blue-400' },
  warning: { wrap: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',       dot: 'bg-amber-500 dark:bg-amber-400' },
  failed:  { wrap: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',               dot: 'bg-red-500 dark:bg-red-400' },
  draft:   { wrap: 'bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300',                  dot: 'bg-ink-400 dark:bg-ink-400' },
  ai:      { wrap: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
  neutral: { wrap: 'bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-300' },
};

// ── Component ─────────────────────────────────────────────
export function Badge({ label, variant = 'neutral', className = '' }: BadgeProps) {
  const { wrap, dot } = cfg[variant];
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full font-body',
        wrap,
        className,
      ].join(' ')}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />}
      {label}
    </span>
  );
}
