import { useId } from 'react';

export type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error';
export type ProgressBarSize    = 'xs' | 'sm' | 'md' | 'lg';
export type ProgressBarShape   = 'linear' | 'circular';

export interface ProgressBarProps {
  /** Current progress value (0–max) */
  value:           number;
  /** Maximum value. Defaults to 100. */
  max?:            number;
  size?:           ProgressBarSize;
  variant?:        ProgressBarVariant;
  shape?:          ProgressBarShape;
  /**
   * Visible text label rendered above-left (linear) or below (circular).
   * When set, the progressbar's accessible name is linked to it via
   * `aria-labelledby` automatically.
   */
  label?:          string;
  /** Show the computed percentage */
  showValue?:      boolean;
  /** Pulse animation on the fill — useful for active/uploading states */
  animated?:       boolean;
  /** Indeterminate state: hides value and shows a sweeping fill */
  indeterminate?:  boolean;
  /**
   * Accessible name when no visible `label` is rendered. Required for a11y
   * if `label` is omitted (axe rule `aria-progressbar-name`). Ignored when
   * `label` is provided (the visible label is used instead via labelledby).
   */
  'aria-label'?:        string;
  /** Id of an external element labelling this progressbar. */
  'aria-labelledby'?:   string;
  /**
   * Human-readable value description for assistive tech. Defaults to the
   * computed percentage when `showValue` is true, otherwise unset.
   */
  'aria-valuetext'?:    string;
  className?:      string;
}

// ── Linear config ─────────────────────────────────────────

const trackH: Record<ProgressBarSize, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const fillColor: Record<ProgressBarVariant, string> = {
  default: 'bg-primary-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error:   'bg-red-500',
};

// ── Circular config ───────────────────────────────────────

const circularSizePx: Record<ProgressBarSize, number> = {
  xs: 48,
  sm: 64,
  md: 80,
  lg: 96,
};

const circularStrokePx: Record<ProgressBarSize, number> = {
  xs: 4,
  sm: 5,
  md: 6,
  lg: 8,
};

const circularTextSize: Record<ProgressBarSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const strokeColor: Record<ProgressBarVariant, string> = {
  default: 'text-primary-500',
  success: 'text-green-500',
  warning: 'text-amber-500',
  error:   'text-red-500',
};

// ── Component ─────────────────────────────────────────────

export function ProgressBar({
  value,
  max           = 100,
  size          = 'md',
  variant       = 'default',
  shape         = 'linear',
  label,
  showValue     = false,
  animated      = false,
  indeterminate = false,
  className     = '',
  'aria-label':       ariaLabel,
  'aria-labelledby':  ariaLabelledBy,
  'aria-valuetext':   ariaValueText,
}: ProgressBarProps) {
  const pct     = indeterminate ? 100 : Math.min(100, Math.max(0, (value / max) * 100));
  const display = `${Math.round(pct)}%`;

  // Wire the visible label as the accessible name when present.
  const labelId = useId();
  const resolvedLabelledBy = ariaLabelledBy ?? (label ? labelId : undefined);
  const resolvedAriaLabel  = resolvedLabelledBy ? undefined : (ariaLabel ?? 'Progress');
  const resolvedValueText  =
    ariaValueText ?? (indeterminate ? undefined : showValue ? display : undefined);

  // ── Circular ──────────────────────────────────────────

  if (shape === 'circular') {
    const sz  = circularSizePx[size];
    const sw  = circularStrokePx[size];
    const r   = (sz - sw) / 2;
    const c   = 2 * Math.PI * r;
    const offset = indeterminate ? 0 : c - (pct / 100) * c;

    return (
      <div className={`inline-flex flex-col items-center gap-1.5 ${className}`}>
        <div
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuetext={resolvedValueText}
          aria-label={resolvedAriaLabel}
          aria-labelledby={resolvedLabelledBy}
          className="relative"
          style={{ width: sz, height: sz }}
        >
          <svg
            width={sz}
            height={sz}
            className="-rotate-90"
            style={{ display: 'block' }}
          >
            {/* Track */}
            <circle
              cx={sz / 2}
              cy={sz / 2}
              r={r}
              fill="none"
              strokeWidth={sw}
              className="stroke-ink-100 dark:stroke-ink-700"
            />
            {/* Fill */}
            <circle
              cx={sz / 2}
              cy={sz / 2}
              r={r}
              fill="none"
              strokeWidth={sw}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              stroke="currentColor"
              className={[
                strokeColor[variant],
                'transition-[stroke-dashoffset] duration-500 ease-out',
                animated || indeterminate ? 'animate-gp-pulse' : '',
              ].join(' ')}
            />
          </svg>

          {showValue && !indeterminate && (
            // Value is conveyed to AT via aria-valuenow/aria-valuetext on the
            // progressbar container; this span is purely visual.
            // aria-hidden prevents axe from scanning it for contrast against
            // the SVG background (which axe cannot resolve as an "image node").
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <span className={[
                'font-semibold font-body tabular-nums text-ink-900 dark:text-ink-50',
                circularTextSize[size],
              ].join(' ')}>
                {display}
              </span>
            </div>
          )}
        </div>

        {label && (
          <span
            id={labelId}
            className="text-xs font-medium font-body text-ink-600 dark:text-ink-300 text-center leading-tight"
          >
            {label}
          </span>
        )}
      </div>
    );
  }

  // ── Linear ────────────────────────────────────────────

  const hasHeader = label || showValue;

  return (
    <div className={`w-full ${className}`}>
      {hasHeader && (
        <div className="flex justify-between items-baseline mb-1.5">
          {label && (
            <span
              id={labelId}
              className="text-sm font-medium font-body text-ink-700 dark:text-ink-200"
            >
              {label}
            </span>
          )}
          {showValue && !indeterminate && (
            <span className="text-sm font-medium font-body text-ink-500 dark:text-ink-300 tabular-nums">
              {display}
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={resolvedValueText}
        aria-label={resolvedAriaLabel}
        aria-labelledby={resolvedLabelledBy}
        className={[
          'w-full rounded-full overflow-hidden',
          'bg-ink-100 dark:bg-ink-700',
          trackH[size],
        ].join(' ')}
      >
        <div
          className={[
            'h-full rounded-full transition-[width] duration-500 ease-out',
            fillColor[variant],
            animated || indeterminate ? 'animate-gp-pulse' : '',
          ].join(' ')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
