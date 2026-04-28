/**
 * Select — single-select with two render modes:
 *
 * - `variant="custom"` (default) — Headless UI Listbox; fully styled dropdown,
 *   keyboard-accessible, works identically on all platforms.
 *
 * - `variant="native"` — plain `<select>` element; delegates the picker UI to
 *   the OS/browser. Recommended on mobile where native pickers are optimal.
 *
 * Usage:
 *   <Select label="AI Model" value={v} onChange={setV} options={opts} />
 *   <Select variant="native" label="Department" value={v} onChange={setV} options={opts} />
 */
import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';
import { useFieldId } from './Fieldset';

export interface SelectOption<T = string> {
  value:     T;
  label:     string;
  disabled?: boolean;
}

export interface SelectProps<T = string> {
  value:      T;
  onChange:   (value: T) => void;
  options:    SelectOption<T>[];
  /**
   * `"custom"` — fully styled Headless UI dropdown (default).
   * `"native"` — OS/browser native `<select>` picker; best on mobile.
   */
  variant?:   'custom' | 'native';
  label?:     string;
  hint?:      string;
  error?:     string;
  disabled?:  boolean;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
}

// ── Shared style tokens ───────────────────────────────────

const triggerBase = [
  'relative w-full rounded-xl border px-3 py-2.5 text-sm font-body',
  'bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-50',
  'transition-all duration-150',
  'disabled:opacity-40 disabled:cursor-not-allowed',
].join(' ');

const triggerBorderNormal = 'border-ink-200 dark:border-ink-600 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25';
const triggerBorderError  = 'border-red-400 dark:border-red-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/25';

// ── Custom variant (Headless UI Listbox) ──────────────────

function SelectCustom<T extends string | number>({
  value, onChange, options, label, hint, error, disabled = false, className = '',
}: SelectProps<T>) {
  const id       = React.useId();
  const selected = options.find(o => o.value === value) ?? options[0];

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className={`relative flex flex-col gap-1.5 ${className}`}>
        {label && (
          <Listbox.Label className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50">
            {label}
          </Listbox.Label>
        )}
        <div className="relative">
          <Listbox.Button
            aria-describedby={hint ? `${id}-hint` : error ? `${id}-error` : undefined}
            aria-invalid={!!error || undefined}
            className={[
              triggerBase,
              'cursor-pointer text-left pr-9',
              error ? triggerBorderError : triggerBorderNormal,
            ].join(' ')}
          >
            <span className="block truncate">{selected?.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink-400">
              <ChevronDown className="h-4 w-4" />
            </span>
          </Listbox.Button>

          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-1"
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 -translate-y-1"
            enterTo="opacity-100 translate-y-0"
          >
            <Listbox.Options className={[
              'absolute top-full left-0 z-50 mt-1 w-full overflow-auto rounded-xl py-1',
              'bg-white dark:bg-ink-800 shadow-lg',
              'border border-ink-200 dark:border-ink-700',
              'focus:outline-none text-sm font-body max-h-60',
            ].join(' ')}>
              {options.map(option => (
                <Listbox.Option
                  key={String(option.value)}
                  value={option.value}
                  disabled={option.disabled}
                  className={({ active, selected: sel }) => [
                    'relative cursor-pointer select-none px-3.5 py-2.5 transition-colors duration-75',
                    active  ? 'bg-ink-50 dark:bg-ink-700' : '',
                    sel     ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'text-ink-900 dark:text-ink-50',
                    option.disabled ? 'opacity-40 cursor-not-allowed' : '',
                  ].join(' ')}
                >
                  {({ selected: sel }) => (
                    <span className="flex items-center justify-between">
                      <span className="block truncate">{option.label}</span>
                      {sel && <Check className="h-4 w-4 text-primary-500 shrink-0" />}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>

        {hint && !error && (
          <p id={`${id}-hint`} className="text-xs text-ink-500 dark:text-ink-300 font-body">{hint}</p>
        )}
        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400 font-body">{error}</p>
        )}
      </div>
    </Listbox>
  );
}

// ── Native variant (<select>) ─────────────────────────────

function SelectNative<T extends string | number>({
  value, onChange, options, label, hint, error, disabled = false, placeholder, className = '', 'aria-label': ariaLabel,
}: SelectProps<T>) {
  const autoId  = React.useId();
  const fieldId = useFieldId(); // '' when not inside a Field
  // When the component has its own visible label it uses autoId so the internal
  // <label htmlFor> wires up to the <select>.  When there is no visible label
  // (the consumer is using a Fieldset <Label> above), we fall back to the
  // Field's generated id so that Label ↔ <select> connection is maintained.
  const id = label ? autoId : (fieldId || autoId);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50"
        >
          {label}
        </label>
      )}

      {/* Wrapper gives us the custom chevron while keeping the native picker */}
      <div className="relative">
        <select
          id={id}
          aria-label={!label ? ariaLabel : undefined}
          value={String(value)}
          onChange={e => {
            const raw = e.target.value as T;
            onChange(raw);
          }}
          disabled={disabled}
          aria-describedby={hint ? `${id}-hint` : error ? `${id}-error` : undefined}
          aria-invalid={!!error || undefined}
          className={[
            triggerBase,
            'appearance-none cursor-pointer pr-9',
            // suppress default OS arrow on WebKit
            '[&::-webkit-inner-spin-button]:hidden [&::-ms-expand]:hidden',
            error ? triggerBorderError : triggerBorderNormal,
          ].join(' ')}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(o => (
            <option key={String(o.value)} value={String(o.value)} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Custom chevron — pointer-events-none so clicks pass through to <select> */}
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink-500 dark:text-ink-300">
          <ChevronDown className="h-4 w-4" />
        </span>
      </div>

      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-ink-500 dark:text-ink-300 font-body">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400 font-body">{error}</p>
      )}
    </div>
  );
}

// ── Public export ─────────────────────────────────────────

export function Select<T extends string | number>(props: SelectProps<T>) {
  return props.variant === 'native'
    ? <SelectNative {...props} />
    : <SelectCustom {...props} />;
}
