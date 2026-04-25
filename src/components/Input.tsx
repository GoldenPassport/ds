import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:         string;
  hint?:          string;
  error?:         string;
  /** Lucide icon (or any ReactNode) rendered inside the left edge of the input */
  icon?:          React.ReactNode;
  /** Arbitrary element (e.g. show/hide button) rendered inside the right edge */
  rightAction?:   React.ReactNode;
  /**
   * Text or element joined to the LEFT of the input (e.g. "https://", "@", "$").
   * Renders a rounded left-side addon that shares a single border with the input.
   */
  leadingAddon?:  React.ReactNode;
  /**
   * Text or element joined to the RIGHT of the input (e.g. "USD", ".com", "%").
   * Renders a rounded right-side addon that shares a single border with the input.
   */
  trailingAddon?: React.ReactNode;
  /**
   * Small text shown in the top-right of the label row (e.g. "Optional", "0 / 140").
   * Only rendered when `label` is also set.
   */
  cornerHint?:    React.ReactNode;
  wrapClassName?: string;
}

export function Input({
  label,
  hint,
  error,
  icon,
  rightAction,
  leadingAddon,
  trailingAddon,
  cornerHint,
  wrapClassName = '',
  className     = '',
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  const hasLeading  = !!leadingAddon;
  const hasTrailing = !!trailingAddon;

  // ── Border / radius tokens based on addon presence ────────
  const borderErr    = 'border-red-400 dark:border-red-500';
  const borderNormal = 'border-ink-200 dark:border-ink-600';

  // Addon shared style — bg slightly off-white to distinguish from input
  const addonBase = [
    'inline-flex items-center px-3 text-sm font-body select-none whitespace-nowrap',
    'bg-ink-50 dark:bg-ink-800 text-ink-500 dark:text-ink-400',
  ].join(' ');

  // ── Input element ─────────────────────────────────────────
  const inputEl = (
    <input
      id={inputId}
      className={[
        'w-full py-2.5 text-sm font-body',
        // left padding: icon overrides leading addon (icon is inside the input)
        icon        ? 'pl-9'  : 'pl-3',
        rightAction ? 'pr-10' : 'pr-3',
        'bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-50',
        'placeholder:text-ink-400 dark:placeholder:text-ink-500',
        'transition-all duration-150 outline-none',
        '[&::-webkit-search-cancel-button]:hidden',
        // border: always present; radius shaped by addon presence
        'border',
        error ? borderErr : borderNormal,
        // focus ring on standalone input (addons handle group ring separately)
        !hasLeading && !hasTrailing
          ? error
            ? 'rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
            : 'rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25'
          : [
              hasLeading  ? 'rounded-l-none border-l-0' : 'rounded-l-xl',
              hasTrailing ? 'rounded-r-none border-r-0' : 'rounded-r-xl',
              // focus ring is subtle — the group ring shows on the wrapper
              error
                ? 'focus:border-red-500'
                : 'focus:border-primary-500',
            ].join(' '),
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      ].join(' ')}
      aria-invalid={!!error}
      aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
      {...props}
    />
  );

  // ── Icon + rightAction overlay (relative wrapper needed) ──
  const inputWithOverlays = (icon || rightAction) ? (
    <div className="relative flex-1 min-w-0">
      {icon && (
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 dark:text-ink-500 pointer-events-none"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {inputEl}
      {rightAction && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
          {rightAction}
        </span>
      )}
    </div>
  ) : (
    // No overlays — just the input, but still needs flex-1 inside addon group
    hasLeading || hasTrailing
      ? <div className="flex-1 min-w-0">{inputEl}</div>
      : inputEl
  );

  // ── Addon group wrapper ────────────────────────────────────
  // When addons are present we wrap everything in a flex row and add a
  // focus-within ring so the whole group highlights together.
  const inputRow = (hasLeading || hasTrailing) ? (
    <div
      className={[
        'flex items-stretch rounded-xl',
        'focus-within:ring-2',
        error
          ? 'focus-within:ring-red-500/30'
          : 'focus-within:ring-primary-500/25',
      ].join(' ')}
    >
      {hasLeading && (
        <span className={[
          addonBase,
          'rounded-l-xl border',
          error ? borderErr : borderNormal,
          'border-r-0',
        ].join(' ')}>
          {leadingAddon}
        </span>
      )}

      {inputWithOverlays}

      {hasTrailing && (
        <span className={[
          addonBase,
          'rounded-r-xl border',
          error ? borderErr : borderNormal,
          'border-l-0',
        ].join(' ')}>
          {trailingAddon}
        </span>
      )}
    </div>
  ) : inputWithOverlays;

  return (
    <div className={`flex flex-col gap-1.5 ${wrapClassName}`}>
      {/* Label row — optional cornerHint sits on the far right */}
      {label && (
        <div className="flex items-baseline justify-between gap-2">
          <label
            htmlFor={inputId}
            className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50"
          >
            {label}
          </label>
          {cornerHint && (
            <span className="text-xs font-body text-ink-400 dark:text-ink-500 shrink-0">
              {cornerHint}
            </span>
          )}
        </div>
      )}

      {inputRow}

      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400 font-body">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-ink-400 dark:text-ink-500 font-body">
          {hint}
        </p>
      )}
    </div>
  );
}
