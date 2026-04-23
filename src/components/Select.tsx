/**
 * Select — wraps Headless UI Listbox
 * Fully accessible single-select with GP styling.
 *
 * Usage:
 *   <Select
 *     label="AI Model"
 *     value={selected}
 *     onChange={setSelected}
 *     options={[{ value: 'claude', label: 'Claude 3.5 Sonnet' }]}
 *   />
 */
import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption<T = string> {
  value:    T;
  label:    string;
  disabled?: boolean;
}

export interface SelectProps<T = string> {
  value:     T;
  onChange:  (value: T) => void;
  options:   SelectOption<T>[];
  label?:    string;
  hint?:     string;
  error?:    string;
  disabled?: boolean;
  className?: string;
}

export function Select<T extends string | number>({
  value,
  onChange,
  options,
  label,
  hint,
  error,
  disabled = false,
  className = '',
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

        {/* Trigger + panel anchored together */}
        <div className="relative">
          <Listbox.Button
            aria-describedby={hint ? `${id}-hint` : error ? `${id}-error` : undefined}
            aria-invalid={!!error || undefined}
            className={[
            'relative w-full cursor-pointer rounded-lg border px-3 py-2.5 pr-9 text-left text-sm font-body',
            'bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-50',
            error
              ? 'border-red-400 dark:border-red-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/25'
              : 'border-ink-200 dark:border-ink-600 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'transition-all duration-150',
          ].join(' ')}>
            <span className="block truncate">{selected?.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink-400">
              <ChevronDown className="h-4 w-4" />
            </span>
          </Listbox.Button>

          {/* Dropdown — absolute relative to the button wrapper */}
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
              'bg-white dark:bg-ink-800 shadow-lg dark:shadow-dark-md',
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
                    active   ? 'bg-ink-50 dark:bg-ink-700' : '',
                    sel      ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'text-ink-900 dark:text-ink-50',
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
          <p id={`${id}-hint`} className="text-xs text-ink-400 dark:text-ink-500 font-body">{hint}</p>
        )}
        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs text-red-500 dark:text-red-400 font-body">{error}</p>
        )}
      </div>
    </Listbox>
  );
}
