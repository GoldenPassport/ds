/**
 * Combobox — wraps Headless UI Combobox
 * Searchable select with filtering and keyboard navigation.
 *
 * Usage:
 *   <Combobox
 *     label="Assign to"
 *     value={selected}
 *     onChange={setSelected}
 *     options={users}
 *     displayValue={u => u.name}
 *     filterFn={(query, option) => option.name.toLowerCase().includes(query.toLowerCase())}
 *   />
 */
import React from 'react';
import {
  Combobox as HLCombobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  Transition,
} from '@headlessui/react';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface ComboboxOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps<T = string> {
  value:        T | null;
  onChange:     (value: T | null) => void;
  options:      ComboboxOption<T>[];
  label?:       string;
  hint?:        string;
  placeholder?: string;
  disabled?:    boolean;
  className?:   string;
}

export function Combobox<T extends string | number>({
  value,
  onChange,
  options,
  label,
  hint,
  placeholder = 'Search…',
  disabled = false,
  className = '',
}: ComboboxProps<T>) {
  const [query, setQuery] = React.useState('');

  const filtered = query === ''
    ? options
    : options.filter(o =>
        o.label.toLowerCase().includes(query.toLowerCase())
      );

  const selected = options.find(o => o.value === value) ?? null;

  return (
    <HLCombobox value={value} onChange={onChange} disabled={disabled}>
      <div className={`relative flex flex-col gap-1.5 ${className}`}>
        {label && (
          <HLCombobox.Label className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50">
            {label}
          </HLCombobox.Label>
        )}

        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400">
            <Search className="h-4 w-4" />
          </span>
          <ComboboxInput
            className={[
              'w-full pl-9 pr-9 py-2.5 rounded-lg border text-sm font-body',
              'bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-50',
              'border-ink-200 dark:border-ink-600 placeholder:text-ink-400 dark:placeholder:text-ink-500',
              'focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/25',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'transition-all duration-150',
            ].join(' ')}
            displayValue={() => selected?.label ?? ''}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
          />
          <ComboboxButton className="absolute inset-y-0 right-3 flex items-center text-ink-400 bg-transparent border-0 cursor-pointer">
            <ChevronDown className="h-4 w-4" />
          </ComboboxButton>
        </div>

        {hint && (
          <p className="text-xs text-ink-400 dark:text-ink-500 font-body">{hint}</p>
        )}

        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
          enter="transition ease-out duration-150"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          afterLeave={() => setQuery('')}
        >
          <ComboboxOptions className={[
            'absolute z-50 mt-1 w-full overflow-auto rounded-xl py-1',
            'bg-white dark:bg-ink-800 shadow-lg dark:shadow-dark-md',
            'border border-ink-200 dark:border-ink-700',
            'focus:outline-none text-sm font-body max-h-60',
          ].join(' ')}>
            {filtered.length === 0 ? (
              <div className="px-3.5 py-3 text-ink-400 dark:text-ink-500 text-sm font-body">
                No results for &ldquo;{query}&rdquo;
              </div>
            ) : (
              filtered.map(option => (
                <ComboboxOption
                  key={String(option.value)}
                  value={option.value}
                  disabled={option.disabled}
                  className={({ active, selected: sel }) => [
                    'relative cursor-pointer select-none px-3.5 py-2.5 transition-colors duration-75',
                    active   ? 'bg-ink-50 dark:bg-ink-700' : '',
                    sel      ? 'text-gold-600 dark:text-gold-400 font-semibold' : 'text-ink-900 dark:text-ink-50',
                    option.disabled ? 'opacity-40 cursor-not-allowed' : '',
                  ].join(' ')}
                >
                  {({ selected: sel }) => (
                    <span className="flex items-center justify-between">
                      <span className="truncate">{option.label}</span>
                      {sel && <Check className="h-4 w-4 text-gold-500 shrink-0" />}
                    </span>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </Transition>
      </div>
    </HLCombobox>
  );
}
