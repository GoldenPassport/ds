import React from 'react';

// ── Types ─────────────────────────────────────────────────

export interface ButtonGroupItem {
  label:     string;
  icon?:     React.ReactNode;
  onClick:   () => void;
  disabled?: boolean;
  /** Highlights this button as the active/pressed state */
  active?:   boolean;
  /** Accessible label when only an icon is shown */
  ariaLabel?: string;
}

export interface ButtonGroupProps {
  items:      ButtonGroupItem[];
  size?:      'sm' | 'md' | 'lg';
  variant?:   'default' | 'ghost';
  /** Render labels — set false to show icons only */
  showLabel?: boolean;
  className?: string;
}

// ── Sizes ─────────────────────────────────────────────────

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2.5',
};

// ── Component ─────────────────────────────────────────────

export function ButtonGroup({
  items,
  size      = 'md',
  variant   = 'default',
  showLabel = true,
  className = '',
}: ButtonGroupProps) {
  const count = items.length;

  return (
    <div
      role="group"
      className={[
        'inline-flex rounded-lg overflow-hidden',
        variant === 'default'
          ? 'border border-ink-200 dark:border-ink-600 shadow-sm'
          : 'border border-ink-200 dark:border-ink-700',
        className,
      ].join(' ')}
    >
      {items.map((item, i) => {
        const isFirst = i === 0;
        const isLast  = i === count - 1;

        return (
          <button
            key={i}
            onClick={item.onClick}
            disabled={item.disabled}
            aria-label={item.ariaLabel ?? (showLabel ? undefined : item.label)}
            aria-pressed={item.active}
            className={[
              'inline-flex items-center justify-center font-medium font-body cursor-pointer',
              'transition-colors duration-150 outline-none border-0',
              'focus-visible:ring-2 focus-visible:ring-gold-500/40 focus-visible:z-10 relative',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              sizes[size],
              // Divider between buttons
              !isFirst ? 'border-l border-ink-200 dark:border-ink-600' : '',
              // Active state overrides the divider colour on adjacent buttons
              item.active && !isFirst ? 'border-l-gold-400/50' : '',
              // Outer radius — only on first and last
              isFirst ? 'rounded-l-lg' : '',
              isLast  ? 'rounded-r-lg' : '',
              // Colour
              item.active
                ? 'bg-gold-500 text-ink-900 dark:bg-gold-500 border-l-transparent'
                : variant === 'default'
                  ? 'bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-700'
                  : 'bg-transparent text-ink-500 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700/60 hover:text-ink-900 dark:hover:text-ink-100',
            ].join(' ')}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            {showLabel && item.label}
          </button>
        );
      })}
    </div>
  );
}
