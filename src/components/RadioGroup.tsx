import React from 'react';
import { Check } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export type RadioGroupVariant = 'list' | 'cards' | 'grid' | 'minicards' | 'stacked';

export interface RadioGroupOption<T extends string | number = string> {
  value:        T;
  label:        string;
  description?: string;
  /** Inline right-aligned content (e.g. price). Used by `cards` variant. */
  trailing?:    React.ReactNode;
  /** Bottom content inside each tile (e.g. user count). Used by `grid` variant. */
  footer?:      React.ReactNode;
  disabled?:    boolean;
}

export interface RadioGroupProps<T extends string | number = string> {
  options:    RadioGroupOption<T>[];
  value:      T | null;
  onChange:   (value: T) => void;
  /** list      — vertical list with radio circles
   *  cards     — full-width stacked rows with optional trailing content
   *  grid      — horizontal grid of tiles with checkmark badge + optional footer
   *  minicards — compact labelled buttons, filled when selected
   *  stacked   — full-width rows with checkmark badge on the right */
  variant?:          RadioGroupVariant;
  /** Which side the radio/check indicator sits on. Defaults: list → left, stacked → right */
  indicatorPosition?: 'left' | 'right';
  /** Show a horizontal divider line between items (list and cards variants) */
  dividers?:  boolean;
  label?:     string;
  hint?:      string;
  disabled?:  boolean;
  className?: string;
}

// ── Radio dot indicator ───────────────────────────────────

function RadioDot({ selected, disabled, size = 'sm' }: { selected: boolean; disabled: boolean; size?: 'sm' | 'lg' }) {
  return (
    <span
      aria-hidden="true"
      className={[
        'shrink-0 rounded-full border-2',
        'flex items-center justify-center transition-all duration-150',
        size === 'lg' ? 'mt-0.5 w-6 h-6' : 'mt-0.5 w-4 h-4',
        selected
          ? 'border-primary-500 bg-primary-500'
          : disabled
            ? 'border-ink-200 dark:border-ink-600 bg-white dark:bg-ink-700'
            : 'border-ink-300 dark:border-ink-600 bg-white dark:bg-ink-700 group-hover:border-primary-400',
      ].join(' ')}
    >
      {selected && (
        <span className={size === 'lg' ? 'w-2 h-2 rounded-full bg-ink-900' : 'w-1.5 h-1.5 rounded-full bg-ink-900 dark:bg-ink-900'} />
      )}
    </span>
  );
}

// ── Check badge (shared by grid + stacked) ────────────────

function CheckBadge({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={[
        'shrink-0 w-5 h-5 rounded-full flex items-center justify-center',
        'transition-all duration-150',
        selected
          ? 'bg-primary-500'
          : 'border-2 border-ink-200 dark:border-ink-600',
      ].join(' ')}
    >
      {selected && <Check className="w-3 h-3 text-ink-900" strokeWidth={3} />}
    </span>
  );
}

// ── Component ─────────────────────────────────────────────

export function RadioGroup<T extends string | number = string>({
  options,
  value,
  onChange,
  variant           = 'list',
  indicatorPosition,
  dividers          = false,
  label,
  hint,
  disabled  = false,
  className = '',
}: RadioGroupProps<T>) {
  const groupId = React.useId();
  const hintId  = `${groupId}-hint`;

  const isListVariant = variant === 'list';

  const labelEl = label && (
    <legend className={[
      'font-semibold font-body text-ink-900 dark:text-ink-50',
      isListVariant ? 'text-base mb-4' : 'text-[13px] mb-2.5',
    ].join(' ')}>
      {label}
    </legend>
  );
  const hintEl = hint && (
    <p id={hintId} className={[
      'mt-3 font-body text-ink-400 dark:text-ink-500',
      isListVariant ? 'text-sm' : 'mt-2 text-xs',
    ].join(' ')}>{hint}</p>
  );

  // ── List ──────────────────────────────────────────────

  if (variant === 'list') {
    const dotRight = (indicatorPosition ?? 'left') === 'right';
    return (
      <fieldset aria-describedby={hint ? hintId : undefined} className={`border-0 m-0 p-0 min-w-0 ${className}`}>
        {labelEl}
        <div className={['flex flex-col', dividers ? 'divide-y divide-ink-200 dark:divide-ink-700' : 'gap-5'].join(' ')}>
          {options.map(opt => {
            const id         = `${groupId}-${opt.value}`;
            const isSelected = opt.value === value;
            const isDisabled = disabled || !!opt.disabled;
            const dot = <RadioDot selected={isSelected} disabled={isDisabled} size="lg" />;
            const text = (
              <span className="flex flex-col gap-1 flex-1">
                <span className="text-base font-semibold font-body text-ink-900 dark:text-ink-50 leading-tight">
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-sm text-ink-500 dark:text-ink-400 font-body leading-snug">
                    {opt.description}
                  </span>
                )}
              </span>
            );
            return (
              <label
                key={String(opt.value)}
                htmlFor={id}
                className={[
                  'group inline-flex items-start gap-4',
                  dividers ? 'py-5' : '',
                  isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
                ].filter(Boolean).join(' ')}
              >
                <input
                  type="radio"
                  id={id}
                  name={groupId}
                  value={String(opt.value)}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                />
                {dotRight ? <>{text}{dot}</> : <>{dot}{text}</>}
              </label>
            );
          })}
        </div>
        {hintEl}
      </fieldset>
    );
  }

  // ── Cards ─────────────────────────────────────────────

  if (variant === 'cards') {
    return (
      <fieldset aria-describedby={hint ? hintId : undefined} className={`border-0 m-0 p-0 min-w-0 ${className}`}>
        {labelEl}
        <div className={['flex flex-col', dividers ? 'divide-y divide-ink-200 dark:divide-ink-700' : 'gap-3'].join(' ')}>
          {options.map(opt => {
            const id         = `${groupId}-${opt.value}`;
            const isSelected = opt.value === value;
            const isDisabled = disabled || !!opt.disabled;
            return (
              <label
                key={String(opt.value)}
                htmlFor={id}
                className={[
                  'flex items-center justify-between gap-4 px-5 py-4',
                  'transition-all duration-150',
                  dividers
                    ? ''
                    : 'rounded-xl border-2 focus-within:ring-2 focus-within:ring-primary-500/30 focus-within:ring-offset-1',
                  dividers
                    ? isSelected ? 'bg-primary-50 dark:bg-primary-900/10' : 'bg-white dark:bg-ink-800'
                    : isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                      : 'border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800',
                  isDisabled
                    ? 'cursor-not-allowed opacity-40'
                    : isSelected
                      ? 'cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/20'
                      : 'cursor-pointer hover:bg-ink-50 dark:hover:bg-ink-700/30',
                ].filter(Boolean).join(' ')}
              >
                <input
                  type="radio"
                  id={id}
                  name={groupId}
                  value={String(opt.value)}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                />
                <span className="flex flex-col gap-0.5 min-w-0">
                  <span className={[
                    'text-sm font-semibold font-body leading-tight',
                    isSelected
                      ? 'text-ink-900 dark:text-ink-50'
                      : 'text-ink-700 dark:text-ink-200',
                  ].join(' ')}>
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span className="text-xs text-ink-500 dark:text-ink-400 font-body leading-snug">
                      {opt.description}
                    </span>
                  )}
                </span>
                {opt.trailing && (
                  <span className="shrink-0 text-right">{opt.trailing}</span>
                )}
              </label>
            );
          })}
        </div>
        {hintEl}
      </fieldset>
    );
  }

  // ── Grid ──────────────────────────────────────────────

  if (variant === 'grid') {
    return (
      <fieldset aria-describedby={hint ? hintId : undefined} className={`border-0 m-0 p-0 min-w-0 ${className}`}>
        {labelEl}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
          {options.map(opt => {
            const id         = `${groupId}-${opt.value}`;
            const isSelected = opt.value === value;
            const isDisabled = disabled || !!opt.disabled;
            return (
              <label
                key={String(opt.value)}
                htmlFor={id}
                className={[
                  'flex flex-col rounded-xl border-2 p-4',
                  'transition-all duration-150',
                  'focus-within:ring-2 focus-within:ring-primary-500/30 focus-within:ring-offset-1',
                  isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                    : 'border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800',
                  isDisabled
                    ? 'cursor-not-allowed opacity-40'
                    : isSelected
                      ? 'cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/20'
                      : 'cursor-pointer hover:border-ink-300 dark:hover:border-ink-600',
                ].join(' ')}
              >
                <input
                  type="radio"
                  id={id}
                  name={groupId}
                  value={String(opt.value)}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                />
                <div className="flex items-start justify-between gap-2">
                  <span className={[
                    'text-sm font-semibold font-body leading-tight',
                    isSelected
                      ? 'text-ink-900 dark:text-ink-50'
                      : 'text-ink-700 dark:text-ink-200',
                  ].join(' ')}>
                    {opt.label}
                  </span>
                  <CheckBadge selected={isSelected} />
                </div>
                {opt.description && (
                  <span className="mt-1 text-xs text-ink-500 dark:text-ink-400 font-body leading-snug">
                    {opt.description}
                  </span>
                )}
                {opt.footer && (
                  <div className="mt-4 text-sm font-semibold font-body text-ink-900 dark:text-ink-50">
                    {opt.footer}
                  </div>
                )}
              </label>
            );
          })}
        </div>
        {hintEl}
      </fieldset>
    );
  }

  // ── Minicards ─────────────────────────────────────────

  if (variant === 'minicards') {
    return (
      <fieldset aria-describedby={hint ? hintId : undefined} className={`border-0 m-0 p-0 min-w-0 ${className}`}>
        {labelEl}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
          {options.map(opt => {
            const id         = `${groupId}-${opt.value}`;
            const isSelected = opt.value === value;
            const isDisabled = disabled || !!opt.disabled;
            return (
              <label
                key={String(opt.value)}
                htmlFor={id}
                className={[
                  'flex items-center justify-center py-3 rounded-xl border-2',
                  'text-sm font-semibold font-body text-center',
                  'transition-all duration-150',
                  'focus-within:ring-2 focus-within:ring-primary-500/30 focus-within:ring-offset-1',
                  isSelected
                    ? 'bg-primary-500 border-primary-500 text-ink-900'
                    : 'bg-white dark:bg-ink-800 border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-200',
                  isDisabled
                    ? 'cursor-not-allowed opacity-40'
                    : isSelected
                      ? 'cursor-pointer hover:bg-primary-400 hover:border-primary-400'
                      : 'cursor-pointer hover:border-ink-300 dark:hover:border-ink-600',
                ].join(' ')}
              >
                <input
                  type="radio"
                  id={id}
                  name={groupId}
                  value={String(opt.value)}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            );
          })}
        </div>
        {hintEl}
      </fieldset>
    );
  }

  // ── Stacked ───────────────────────────────────────────

  const badgeLeft = (indicatorPosition ?? 'right') === 'left';

  return (
    <fieldset aria-describedby={hint ? hintId : undefined} className={`border-0 m-0 p-0 min-w-0 ${className}`}>
      {labelEl}
      <div className="flex flex-col">
        {options.map((opt, index) => {
          const id         = `${groupId}-${opt.value}`;
          const isSelected = opt.value === value;
          const isDisabled = disabled || !!opt.disabled;
          const isFirst    = index === 0;
          const isLast     = index === options.length - 1;
          const badge = <CheckBadge selected={isSelected} />;
          const text = (
            <span className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className={[
                'text-sm font-semibold font-body leading-tight',
                isSelected
                  ? 'text-ink-900 dark:text-ink-50'
                  : 'text-ink-700 dark:text-ink-200',
              ].join(' ')}>
                {opt.label}
              </span>
              {opt.description && (
                <span className="text-xs text-ink-500 dark:text-ink-400 font-body leading-snug">
                  {opt.description}
                </span>
              )}
            </span>
          );
          return (
            <label
              key={String(opt.value)}
              htmlFor={id}
              className={[
                'flex items-center gap-4 px-5 py-4',
                'border-2 transition-colors duration-150',
                !isFirst && '-mt-0.5',
                isFirst  && 'rounded-t-xl',
                isLast   && 'rounded-b-xl',
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 relative z-10'
                  : 'border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800',
                isDisabled
                  ? 'cursor-not-allowed opacity-40'
                  : isSelected
                    ? 'cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/20'
                    : 'cursor-pointer hover:bg-ink-50 dark:hover:bg-ink-700/40',
              ].filter(Boolean).join(' ')}
            >
              <input
                type="radio"
                id={id}
                name={groupId}
                value={String(opt.value)}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              {badgeLeft ? <>{badge}{text}</> : <>{text}{badge}</>}
            </label>
          );
        })}
      </div>
      {hintEl}
    </fieldset>
  );
}
