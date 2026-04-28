import React from 'react';

// ── Types ─────────────────────────────────────────────────

export interface ButtonGroupItem<T extends string | number = string> {
  label:      string;
  /** Required when using controlled value/onChange on the group */
  value?:     T;
  icon?:      React.ReactNode;
  onClick?:   () => void;
  disabled?:  boolean;
  /** Manual active highlight — ignored when value/onChange are provided */
  active?:    boolean;
  /** Accessible label when only an icon is shown */
  ariaLabel?: string;
}

export interface ButtonGroupProps<T extends string | number = string> {
  items?:     ButtonGroupItem<T>[];
  /** Controlled selected value */
  value?:     T | T[];
  /** Called with the new value or values array */
  onChange?:  (value: T | T[]) => void;
  /** Allow selecting multiple items (requires value/onChange) */
  multiple?:  boolean;
  size?:      'sm' | 'md' | 'lg';
  variant?:   'default' | 'ghost';
  /** Render button labels — set false for icon-only groups */
  showLabel?: boolean;
  /** 'never' = shrink-wrap (default), 'always' = fill container, 'mobile' = full-width on small screens only */
  fullWidth?: 'never' | 'always' | 'mobile';
  /** Label rendered above the group */
  label?:     string;
  /** Helper text rendered below the group */
  hint?:      string;
  className?: string;
}

// ── Sizes ─────────────────────────────────────────────────

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2.5',
};

// ── Component ─────────────────────────────────────────────

export function ButtonGroup<T extends string | number = string>({
  items = [],
  value,
  onChange,
  multiple  = false,
  size      = 'md',
  variant   = 'default',
  showLabel = true,
  fullWidth = 'never',
  label,
  hint,
  className = '',
}: ButtonGroupProps<T>) {
  const isControlled = value !== undefined && onChange !== undefined;

  const selectedValues: T[] = isControlled
    ? multiple
      ? (value as T[])
      : value !== undefined && value !== null && value !== ('' as T)
        ? [value as T]
        : []
    : [];

  const isActive = (item: ButtonGroupItem<T>): boolean => {
    if (isControlled && item.value !== undefined) return selectedValues.includes(item.value);
    return item.active ?? false;
  };

  const handleClick = (item: ButtonGroupItem<T>) => {
    if (isControlled && item.value !== undefined && onChange) {
      if (multiple) {
        const current = value as T[];
        onChange(
          current.includes(item.value)
            ? current.filter(x => x !== item.value)
            : [...current, item.value]
        );
      } else {
        onChange(item.value);
      }
    }
    item.onClick?.();
  };

  const count = items.length;

  // Width classes — base is always inline (shrink-wrap); mobile overrides below sm.
  // items-start prevents label/hint text from stretching the group to their width.
  const outerClass = fullWidth === 'always'
    ? 'flex flex-col gap-1.5 w-full'
    : fullWidth === 'mobile'
      ? 'inline-flex flex-col gap-1.5 items-start max-sm:flex max-sm:w-full max-sm:items-stretch'
      : 'inline-flex flex-col gap-1.5 items-start';

  const groupWidthClass = fullWidth === 'always'
    ? 'flex w-full'
    : fullWidth === 'mobile'
      ? 'inline-flex max-sm:flex max-sm:w-full'
      : 'inline-flex';

  const btnFlexClass = fullWidth === 'always'
    ? 'flex-1 justify-center'
    : fullWidth === 'mobile'
      ? 'max-sm:flex-1 max-sm:justify-center'
      : '';

  // ARIA roles
  const groupRole = isControlled && !multiple ? 'radiogroup' : 'group';
  const btnRole   = isControlled ? (multiple ? 'checkbox' : 'radio') : undefined;

  return (
    <div className={`${outerClass} ${className}`}>
      {label && (
        <span className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50">
          {label}
        </span>
      )}

      <div
        role={groupRole}
        aria-label={label}
        className={[
          groupWidthClass,
          'rounded-lg overflow-hidden',
          variant === 'default'
            ? 'border border-ink-200 dark:border-ink-600 shadow-sm'
            : 'border border-ink-200 dark:border-ink-700',
        ].join(' ')}
      >
        {items.map((item, i) => {
          const active     = isActive(item);
          const prevActive = i > 0 && isActive(items[i - 1]);
          const isFirst    = i === 0;
          const isLast     = i === count - 1;

          // Border between buttons:
          // active|active   → visible gold divider so selections are distinguishable
          // active|inactive → transparent (gold background provides enough contrast)
          // inactive|active → normal ink border
          // inactive|inactive → normal ink border
          const dividerClass = isFirst
            ? ''
            : active && prevActive
              ? 'border-l border-primary-400 dark:border-primary-600'
              : active
                ? 'border-l border-transparent'
                : 'border-l border-ink-200 dark:border-ink-600';

          return (
            <button
              key={item.value !== undefined ? String(item.value) : i}
              role={btnRole}
              onClick={() => handleClick(item)}
              disabled={item.disabled}
              aria-label={item.ariaLabel ?? (showLabel ? undefined : item.label)}
              aria-pressed={!isControlled ? active : undefined}
              aria-checked={isControlled ? active : undefined}
              className={[
                'inline-flex items-center font-medium font-body cursor-pointer',
                btnFlexClass,
                'transition-colors duration-150 outline-none border-0',
                'focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:z-10 relative',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                sizes[size],
                dividerClass,
                isFirst ? 'rounded-l-lg' : '',
                isLast  ? 'rounded-r-lg' : '',
                active
                  ? 'bg-primary-500 text-ink-900 dark:bg-primary-500'
                  : variant === 'default'
                    ? 'bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-700'
                    : 'bg-transparent text-ink-500 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700/60 hover:text-ink-900 dark:hover:text-ink-100',
              ].join(' ')}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              {showLabel && item.label}
            </button>
          );
        })}
      </div>

      {hint && (
        <p className="text-xs text-ink-500 dark:text-ink-300 font-body">{hint}</p>
      )}
    </div>
  );
}
