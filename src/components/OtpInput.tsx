/**
 * OtpInput — accessible one-time password / PIN input.
 *
 * - Sequential focus: only the next empty cell (and all filled cells before it)
 *   are enabled. Cells beyond the first empty one are disabled until reached.
 * - Error reset: any Backspace/Delete while `error` is set clears the whole
 *   value and returns focus to cell 0 so the user starts fresh.
 * - Auto-advances focus when a digit is entered
 * - Backspace clears current cell and moves back (normal mode)
 * - Arrow Left / Right navigate between enabled cells
 * - Paste fills all cells from the clipboard value
 * - `onComplete` fires when every cell is filled
 *
 * Usage:
 *   <OtpInput length={6} value={otp} onChange={setOtp} onComplete={verify} />
 */
import React, { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

// ── Types ─────────────────────────────────────────────────

export type OtpInputSize = 'sm' | 'md' | 'lg';

export interface OtpInputProps {
  /** Controlled value string (length ≤ `length`). */
  value:        string;
  onChange:     (value: string) => void;
  /** Called once when all cells are filled. */
  onComplete?:  (value: string) => void;
  /** Total number of cells. Default: 6 */
  length?:      number;
  /** Restrict input to digits 0-9. Default: true */
  numeric?:     boolean;
  /** Mask values like a password field. */
  mask?:        boolean;
  /** Size of each cell. Default: `'md'` */
  size?:        OtpInputSize;
  label?:       string;
  hint?:        string;
  error?:       string;
  disabled?:    boolean;
  /** Auto-focus the first cell on mount. */
  autoFocus?:   boolean;
  className?:   string;
}

// ── Style maps ────────────────────────────────────────────

const sizeCls: Record<OtpInputSize, string> = {
  sm: 'w-9 h-9 text-sm rounded-lg',
  md: 'w-12 h-12 text-xl rounded-xl',
  lg: 'w-16 h-16 text-2xl rounded-2xl',
};

const gapCls: Record<OtpInputSize, string> = {
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
};

// Text-size class used by the mask-bullet overlay (must match sizeCls font size)
const bulletSizeCls: Record<OtpInputSize, string> = {
  sm: 'text-sm',
  md: 'text-xl',
  lg: 'text-2xl',
};

// ── Component ─────────────────────────────────────────────

export function OtpInput({
  value,
  onChange,
  onComplete,
  length    = 6,
  numeric   = true,
  mask      = false,
  size      = 'md',
  label,
  hint,
  error,
  disabled  = false,
  autoFocus = false,
  className = '',
}: OtpInputProps) {
  const inputId   = React.useId();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Keep an internal array in sync with the controlled value string
  const cells = Array.from({ length }, (_, i) => value[i] ?? '');

  // ── Sequential enable range ────────────────────────────
  // All filled cells + the very next empty cell are enabled.
  // Every cell beyond the first gap stays disabled until the user reaches it.
  const firstEmptyIdx = cells.findIndex(c => !c);
  const enabledUpTo   = firstEmptyIdx === -1 ? length - 1 : firstEmptyIdx;

  // Focus helper — never focuses a cell that is currently disabled
  function focusCell(index: number) {
    const target = Math.max(0, Math.min(index, enabledUpTo));
    inputRefs.current[target]?.focus();
  }

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus) inputRefs.current[0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus]);

  // When the parent resets value to '' (e.g. after a failed OTP attempt),
  // automatically return focus to cell 0 so the user can re-enter immediately.
  const prevValueRef = useRef(value);
  useEffect(() => {
    const prev = prevValueRef.current;
    prevValueRef.current = value;
    if (value === '' && prev !== '') {
      inputRefs.current[0]?.focus();
    }
  }, [value]);

  function updateValue(index: number, char: string) {
    const next = cells.slice();
    next[index] = char;
    const str = next.join('');
    onChange(str);
    if (str.replace(/\s/g, '').length === length) {
      onComplete?.(str);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); focusCell(index - 1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); focusCell(index + 1); return; }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();

      // ── Error-state reset ──────────────────────────────
      // Any removal while an error is showing clears the whole value and
      // snaps focus back to cell 0 so the user re-enters from scratch.
      if (error) {
        // flushSync commits the re-render (setting enabledUpTo → 0, re-enabling
        // cell 0) before we call focus, so the element is guaranteed interactive.
        flushSync(() => onChange(''));
        inputRefs.current[0]?.focus();
        return;
      }

      // ── Normal backspace/delete ────────────────────────
      if (e.key === 'Delete') {
        updateValue(index, '');
        return;
      }

      if (cells[index]) {
        // Cell has a value — clear it in place
        updateValue(index, '');
      } else {
        // Cell is empty — clear the previous cell and move back
        if (index > 0) {
          updateValue(index - 1, '');
          focusCell(index - 1);
        }
      }
      return;
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const raw = e.target.value;
    const char = raw.slice(-1);
    if (!char) return;

    if (numeric && !/^\d$/.test(char)) return;  // reject non-digits in numeric mode

    // flushSync forces React to commit the state update (which increments
    // enabledUpTo, enabling the next cell in the DOM) before we call focus.
    flushSync(() => updateValue(index, char));
    inputRefs.current[Math.min(index + 1, length - 1)]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    let pasted = e.clipboardData.getData('text').replace(/\s/g, '');
    if (numeric) pasted = pasted.replace(/\D/g, '');
    const chars = pasted.slice(0, length).split('');
    const next  = cells.slice();
    chars.forEach((c, i) => { next[i] = c; });
    const str = next.join('');
    flushSync(() => onChange(str));
    if (str.replace(/\s/g, '').length === length) onComplete?.(str);
    // After flushSync all pasted cells are enabled in the DOM
    inputRefs.current[Math.min(chars.length, length - 1)]?.focus();
  }

  // Clicking an already-focused cell: select its content so typing replaces it
  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.select();
  }

  // ── Render ────────────────────────────────────────────────

  const borderBase = error
    ? 'border-red-400 dark:border-red-500 focus:border-red-500'
    : 'border-ink-200 dark:border-ink-600 focus:border-primary-500';

  const cellBase = [
    'text-center font-bold font-display tabular-nums select-none',
    'border outline-none',
    'bg-white dark:bg-ink-700',
    'text-ink-900 dark:text-ink-50',
    'caret-primary-500',
    'transition-all duration-150',
    borderBase,
    sizeCls[size],
  ].join(' ');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          id={`${inputId}-label`}
          className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50"
        >
          {label}
        </label>
      )}

      <div
        role="group"
        aria-labelledby={label ? `${inputId}-label` : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={`flex items-center justify-center ${gapCls[size]}`}
      >
        {cells.map((cell, i) => {
          const isCellDisabled = disabled || i > enabledUpTo;
          return (
            // Wrapper div needed for the mask-bullet overlay
            <div key={i} className="relative">
              <input
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode={numeric ? 'numeric' : 'text'}
                autoComplete={!mask && i === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                // When masked the input is always visually empty — the bullet is
                // rendered by the overlay below so we control its vertical position.
                value={mask ? '' : cell}
                disabled={isCellDisabled}
                aria-label={`Digit ${i + 1} of ${length}`}
                className={[
                  cellBase,
                  isCellDisabled ? 'opacity-40 cursor-not-allowed' : '',
                ].join(' ')}
                onChange={e => handleInput(e, i)}
                onKeyDown={e => handleKeyDown(e, i)}
                onPaste={handlePaste}
                onFocus={handleFocus}
              />
              {/* Mask bullet — absolutely centred so flexbox controls alignment,
                  not the browser's password-input glyph metrics. */}
              {mask && cell && (
                <span
                  aria-hidden="true"
                  className={[
                    'absolute inset-0 flex items-center justify-center',
                    'pointer-events-none select-none',
                    'font-bold font-display',
                    'text-ink-900 dark:text-ink-50',
                    isCellDisabled ? 'opacity-40' : '',
                    bulletSizeCls[size],
                  ].join(' ')}
                >
                  •
                </span>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs font-body text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs font-body text-ink-500 dark:text-ink-300">
          {hint}
        </p>
      )}
    </div>
  );
}
