
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
  active:  { wrap: 'bg-green-100 text-green-700',                                    dot: 'bg-green-500' },
  running: { wrap: 'bg-gold-100 text-gold-700',                                      dot: 'bg-gold-500'  },
  pending: { wrap: 'bg-blue-100 text-blue-700',                                      dot: 'bg-blue-500'  },
  warning: { wrap: 'bg-amber-100 text-amber-700',                                    dot: 'bg-amber-500' },
  failed:  { wrap: 'bg-red-100 text-red-700',                                        dot: 'bg-red-500'   },
  draft:   { wrap: 'bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300',      dot: 'bg-ink-300'   },
  ai:      { wrap: 'bg-slate-100 text-slate-600' },
  neutral: { wrap: 'bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300' },
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
