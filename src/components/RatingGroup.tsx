import React, { useState, useId } from 'react';
import { Star } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export type RatingGroupSize = 'sm' | 'md' | 'lg';

export interface RatingGroupProps {
  /** Total number of rating items */
  count?:          number;
  /** Controlled current value */
  value?:          number;
  /** Initial value for uncontrolled usage */
  defaultValue?:   number;
  /** Called when the rating changes */
  onChange?:       (value: number) => void;
  /** Called when the hover value changes */
  onHoverChange?:  (value: number | null) => void;
  /** Enable half-step (0.5) increments */
  allowHalf?:      boolean;
  /** Prevent value changes without disabling visually */
  readOnly?:       boolean;
  disabled?:       boolean;
  size?:           RatingGroupSize;
  /** Hidden form input name */
  name?:           string;
  /** Label rendered above the stars */
  label?:          React.ReactNode;
  /** Custom icon for empty state */
  iconEmpty?:      React.ReactNode;
  /** Custom icon for half-filled state (defaults to clip-path overlay) */
  iconHalf?:       React.ReactNode;
  /** Custom icon for fully-filled state */
  iconFull?:       React.ReactNode;
  /** Text direction */
  dir?:            'ltr' | 'rtl';
  className?:      string;
}

// ── Size tokens ────────────────────────────────────────────

const sizeTokens: Record<RatingGroupSize, { star: string; gap: string; label: string }> = {
  sm: { star: 'w-5 h-5', gap: 'gap-1',   label: 'text-xs'  },
  md: { star: 'w-6 h-6', gap: 'gap-1.5', label: 'text-sm'  },
  lg: { star: 'w-8 h-8', gap: 'gap-2',   label: 'text-base' },
};

// ── Internal helpers ───────────────────────────────────────

type StarState = 'empty' | 'half' | 'full';

function getStarState(index: number, displayValue: number): StarState {
  if (displayValue >= index)       return 'full';
  if (displayValue >= index - 0.5) return 'half';
  return 'empty';
}

// Renders the correct icon filling its parent container
function StarIcon({
  state,
  iconEmpty,
  iconHalf,
  iconFull,
}: {
  state:     StarState;
  iconEmpty: React.ReactNode;
  iconHalf?: React.ReactNode;
  iconFull:  React.ReactNode;
}) {
  if (state === 'full') {
    return (
      <span className="block w-full h-full text-primary-400">
        {iconFull}
      </span>
    );
  }

  if (state === 'half') {
    // Use provided custom half icon, or clip-path overlay approach
    if (iconHalf) {
      return (
        <span className="block w-full h-full text-primary-400">
          {iconHalf}
        </span>
      );
    }
    return (
      <span className="relative block w-full h-full">
        {/* Muted base */}
        <span className="block w-full h-full text-ink-300 dark:text-ink-600">
          {iconEmpty}
        </span>
        {/* Coloured left half */}
        <span
          className="absolute inset-0 text-primary-400"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
          aria-hidden="true"
        >
          {iconFull}
        </span>
      </span>
    );
  }

  // empty
  return (
    <span className="block w-full h-full text-ink-300 dark:text-ink-600">
      {iconEmpty}
    </span>
  );
}

// ── RatingGroup ────────────────────────────────────────────

export function RatingGroup({
  count        = 5,
  value,
  defaultValue = 0,
  onChange,
  onHoverChange,
  allowHalf    = false,
  readOnly     = false,
  disabled     = false,
  size         = 'md',
  name,
  label,
  iconEmpty,
  iconHalf,
  iconFull,
  dir          = 'ltr',
  className    = '',
}: RatingGroupProps) {
  const id = useId();
  const t  = sizeTokens[size];

  const isControlled               = value !== undefined;
  const [internalValue, setInternal] = useState(defaultValue);
  const [hoverValue, setHover]       = useState<number | null>(null);

  const committedValue = isControlled ? value! : internalValue;
  const displayValue   = hoverValue ?? committedValue;
  const interactive    = !readOnly && !disabled;

  // Default icons
  const emptyIcon = iconEmpty ?? (
    <Star className="w-full h-full" strokeWidth={1.5} />
  );
  const fullIcon = iconFull ?? (
    <Star className="w-full h-full fill-current" strokeWidth={1.5} />
  );

  // Resolve the value the user intends based on mouse position within a star
  function resolveValue(e: React.MouseEvent<HTMLButtonElement>, index: number): number {
    if (!allowHalf) return index;
    const rect  = e.currentTarget.getBoundingClientRect();
    const relX  = dir === 'rtl' ? rect.right - e.clientX : e.clientX - rect.left;
    return relX < rect.width / 2 ? index - 0.5 : index;
  }

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>, index: number) {
    const v = resolveValue(e, index);
    if (v === hoverValue) return;
    setHover(v);
    onHoverChange?.(v);
  }

  function handleMouseEnter(index: number) {
    // When not using half-steps, a simple enter is enough
    if (allowHalf) return; // handled by mousemove
    setHover(index);
    onHoverChange?.(index);
  }

  function handleMouseLeave() {
    setHover(null);
    onHoverChange?.(null);
  }

  function handleClick(e: React.MouseEvent<HTMLButtonElement>, index: number) {
    const v = resolveValue(e, index);
    const next = v === committedValue ? 0 : v;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const step   = allowHalf ? 0.5 : 1;
    let   next   = committedValue;

    if (e.key === 'ArrowRight' || e.key === 'ArrowUp')  next = Math.min(count, committedValue + step);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowDown') next = Math.max(0,     committedValue - step);
    if (next === committedValue) return;

    e.preventDefault();
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  return (
    <div
      className={['inline-flex flex-col gap-1.5', className].filter(Boolean).join(' ')}
      dir={dir}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={[
            'font-medium font-body text-ink-700 dark:text-ink-300',
            t.label,
          ].join(' ')}
        >
          {label}
        </label>
      )}

      {/* Stars */}
      <div
        id={id}
        role="group"
        aria-label={typeof label === 'string' ? label : 'Rating'}
        aria-disabled={disabled || undefined}
        onMouseLeave={interactive ? handleMouseLeave : undefined}
        onKeyDown={interactive ? handleKeyDown : undefined}
        className={[
          'flex items-center',
          t.gap,
          disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
        ].filter(Boolean).join(' ')}
      >
        {Array.from({ length: count }, (_, idx) => {
          const index = idx + 1;
          const state = getStarState(index, displayValue);
          const label = `${allowHalf && state === 'half' ? index - 0.5 : index} of ${count} stars`;

          const starIcon = (
            <StarIcon
              state={state}
              iconEmpty={emptyIcon}
              iconHalf={iconHalf}
              iconFull={fullIcon}
            />
          );

          if (!interactive) {
            return (
              <span
                key={index}
                className={`block shrink-0 ${t.star}`}
                aria-hidden="true"
              >
                {starIcon}
              </span>
            );
          }

          return (
            <button
              key={index}
              type="button"
              aria-label={label}
              className={[
                `shrink-0 ${t.star}`,
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
                'focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-ink-900',
                'rounded transition-transform duration-75',
                hoverValue !== null
                  ? (index <= Math.ceil(hoverValue) ? 'scale-110' : '')
                  : '',
              ].filter(Boolean).join(' ')}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onClick={(e) => handleClick(e, index)}
            >
              {starIcon}
            </button>
          );
        })}
      </div>

      {/* Hidden form input */}
      {name && (
        <input type="hidden" name={name} value={committedValue} />
      )}
    </div>
  );
}
