import React from 'react';

// ── Types ─────────────────────────────────────────────────

export interface OptionGroupItem<T extends string | number = string> {
  value:     T;
  label:     string;
  icon?:     React.ReactNode;
  disabled?: boolean;
}

export interface OptionGroupProps<T extends string | number = string> {
  options:    OptionGroupItem<T>[];
  /** Single-select: pass T. Multi-select: pass T[]. */
  value:      T | T[];
  onChange:   (value: T | T[]) => void;
  /** Allow selecting multiple options at once */
  multiple?:  boolean;
  size?:      'sm' | 'md' | 'lg';
  label?:     string;
  hint?:      string;
  className?: string;
}

// ── Sizes ─────────────────────────────────────────────────

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2.5',
};

// ── Component ─────────────────────────────────────────────

export function OptionGroup<T extends string | number = string>({
  options,
  value,
  onChange,
  multiple  = false,
  size      = 'md',
  label,
  hint,
  className = '',
}: OptionGroupProps<T>) {
  const selectedValues: T[] = multiple
    ? (value as T[])
    : value !== undefined && value !== null && value !== ('' as T)
      ? [value as T]
      : [];

  const isSelected = (v: T) => selectedValues.includes(v);

  const handleClick = (v: T) => {
    if (multiple) {
      const current = value as T[];
      onChange(
        current.includes(v)
          ? current.filter(x => x !== v)
          : [...current, v]
      );
    } else {
      onChange(v);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50">
          {label}
        </span>
      )}

      <div
        role={multiple ? 'group' : 'radiogroup'}
        aria-label={label}
        className="inline-flex rounded-lg border border-ink-200 dark:border-ink-600 overflow-hidden"
      >
        {options.map((opt, i) => {
          const selected  = isSelected(opt.value);
          const isFirst = i === 0;

          return (
            <button
              key={String(opt.value)}
              role={multiple ? 'checkbox' : 'radio'}
              aria-checked={selected}
              aria-disabled={opt.disabled}
              disabled={opt.disabled}
              onClick={() => !opt.disabled && handleClick(opt.value)}
              className={[
                'inline-flex items-center font-medium font-body cursor-pointer',
                'transition-all duration-150 border-0 outline-none',
                'focus-visible:ring-2 focus-visible:ring-gold-500/40 focus-visible:z-10 relative',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                sizeClasses[size],
                // Dividers between buttons
                !isFirst ? 'border-l border-ink-200 dark:border-ink-600' : '',
                // Remove border between selected and adjacent
                selected ? 'border-l-transparent' : '',
                selected
                  ? 'bg-gold-500 text-ink-900'
                  : 'bg-white dark:bg-ink-800 text-ink-500 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700 hover:text-ink-900 dark:hover:text-ink-100',
              ].join(' ')}
            >
              {opt.icon && <span className="shrink-0">{opt.icon}</span>}
              {opt.label}
            </button>
          );
        })}
      </div>

      {hint && (
        <p className="text-xs text-ink-400 dark:text-ink-500 font-body">{hint}</p>
      )}
    </div>
  );
}
