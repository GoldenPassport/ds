import React from 'react';
import { useFieldId } from './Fieldset';

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
  cornerHint?:            React.ReactNode;
  /** Extra classes applied to the leading addon wrapper span */
  leadingAddonClassName?: string;
  /** Extra classes applied to the trailing addon wrapper span */
  trailingAddonClassName?: string;
  wrapClassName?: string;
  /**
   * When to surface HTML5 constraint-validation errors (required, pattern, type, etc.).
   * - `'onBlur'`   — validate as soon as the field loses focus; re-validates on every
   *                  keystroke once the field has been touched.
   * - `'onSubmit'` — validate only when the native form `submit` fires; errors appear
   *                  all at once and clear as the user corrects each field.
   * - `'both'`     — combines both: shows errors on blur AND on submit attempt.
   *
   * When unset the component behaves as before: only the `error` prop is displayed.
   */
  validate?:      'onBlur' | 'onSubmit' | 'both';
}

export function Input({
  label,
  hint,
  error: errorProp,
  icon,
  rightAction,
  leadingAddon,
  trailingAddon,
  cornerHint,
  leadingAddonClassName  = '',
  trailingAddonClassName = '',
  wrapClassName = '',
  className     = '',
  id,
  validate,
  onBlur:   userOnBlur,
  onChange: userOnChange,
  ...props
}: InputProps) {
  // Fall back to the nearest <Field>'s generated id when no explicit id is given.
  // This auto-wires Label ↔ Input when used inside the Fieldset system.
  const fieldId = useFieldId(); // returns '' when not inside a Field
  const autoId  = React.useId();
  const inputId = id ?? (fieldId || undefined) ?? autoId;

  // ── Constraint-validation state (only active when `validate` is set) ──
  const [internalError, setInternalError] = React.useState('');
  const [touched,       setTouched]       = React.useState(false);

  function runValidation(el: HTMLInputElement) {
    setInternalError(el.checkValidity() ? '' : el.validationMessage);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (validate === 'onBlur' || validate === 'both') {
      setTouched(true);
      runValidation(e.target);
    }
    userOnBlur?.(e);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Once touched, re-validate on every keystroke so errors clear as the user types
    if (touched && validate) runValidation(e.target);
    userOnChange?.(e);
  }

  function handleInvalid(e: React.InvalidEvent<HTMLInputElement>) {
    e.preventDefault(); // suppress the browser's native validation tooltip
    if (validate === 'onSubmit' || validate === 'both') {
      setTouched(true);
      setInternalError(e.target.validationMessage);
    }
  }

  // External `error` prop always wins; fall back to internal constraint message
  const displayError = errorProp || (validate ? internalError : '');

  const hasLeading  = !!leadingAddon;
  const hasTrailing = !!trailingAddon;

  // ── Border / radius tokens based on addon presence ────────
  const borderErr    = 'border-red-400 dark:border-red-500';
  const borderNormal = 'border-ink-200 dark:border-ink-600';

  // Use displayError everywhere `error` was referenced below
  const error = displayError;

  // Addon shared style — bg slightly off-white to distinguish from input
  const addonBase = [
    'inline-flex items-center px-3 text-sm font-body select-none whitespace-nowrap',
    'bg-ink-50 dark:bg-ink-800 text-ink-500 dark:text-ink-300',
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
        'placeholder:text-ink-500 dark:placeholder:text-ink-400',
        'transition-all duration-150 outline-none',
        '[&::-webkit-search-cancel-button]:hidden',
        // border: always present; radius shaped by addon presence
        'border',
        error ? borderErr : borderNormal,
        // border colour change on focus; no ring so the border stays a single clean line
        !hasLeading && !hasTrailing
          ? error
            ? 'rounded-xl focus:border-red-500'
            : 'rounded-xl focus:border-primary-500'
          : [
              hasLeading  ? 'rounded-l-none border-l-0' : 'rounded-l-xl',
              hasTrailing ? 'rounded-r-none border-r-0' : 'rounded-r-xl',
              error
                ? 'focus:border-red-500'
                : 'focus:border-primary-500',
            ].join(' '),
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      ].join(' ')}
      aria-invalid={!!error}
      aria-describedby={error || hint ? (error ? `${inputId}-error` : `${inputId}-hint`) : undefined}
      onBlur={handleBlur}
      onChange={handleChange}
      onInvalid={handleInvalid}
      {...props}
    />
  );

  // ── Icon + rightAction overlay (relative wrapper needed) ──
  const inputWithOverlays = (icon || rightAction) ? (
    <div className="relative flex-1 min-w-0">
      {icon && (
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 dark:text-ink-300 pointer-events-none"
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
      ].join(' ')}
    >
      {hasLeading && (
        <span className={[
          addonBase,
          'rounded-l-xl border',
          error ? borderErr : borderNormal,
          'border-r-0',
          leadingAddonClassName,
        ].filter(Boolean).join(' ')}>
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
          trailingAddonClassName,
        ].filter(Boolean).join(' ')}>
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
            <span className="text-xs font-body text-ink-500 dark:text-ink-300 shrink-0">
              {cornerHint}
            </span>
          )}
        </div>
      )}

      {inputRow}

      {/*
        Always rendered so the line height is permanently reserved — errors
        appearing or disappearing never shift other fields down the page.
      */}
      <p
        id={error ? `${inputId}-error` : `${inputId}-hint`}
        role={error ? 'alert' : undefined}
        className={[
          'min-h-4 text-xs font-body leading-none',
          error
            ? 'text-red-700 dark:text-red-400'
            : 'text-ink-500 dark:text-ink-300',
        ].join(' ')}
      >
        {error || hint || ''}
      </p>
    </div>
  );
}
