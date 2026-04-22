import React from 'react';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps {
  checked:        boolean;
  onChange:       (checked: boolean) => void;
  label?:         string;
  description?:   string;
  disabled?:      boolean;
  indeterminate?: boolean;
  className?:     string;
  id?:            string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled      = false,
  indeterminate = false,
  className     = '',
  id,
}: CheckboxProps) {
  const checkId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) onChange(e.target.checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled) onChange(indeterminate ? true : !checked);
    }
  };

  const isChecked = indeterminate || checked;

  return (
    <label
      htmlFor={checkId}
      className={[
        'inline-flex items-start gap-2.5 cursor-pointer group',
        disabled ? 'opacity-40 cursor-not-allowed' : '',
        className,
      ].join(' ')}
    >
      {/* Hidden native checkbox for a11y */}
      <input
        type="checkbox"
        id={checkId}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        ref={el => { if (el) el.indeterminate = indeterminate; }}
        className="sr-only"
        aria-describedby={description ? `${checkId}-desc` : undefined}
      />

      {/* Visual checkbox */}
      <span
        role="presentation"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={() => { if (!disabled) onChange(indeterminate ? true : !checked); }}
        className={[
          'mt-0.5 shrink-0 w-4 h-4 rounded flex items-center justify-center',
          'border transition-all duration-150',
          'focus-within:ring-2 focus-within:ring-gold-500/25',
          isChecked
            ? 'bg-gold-500 border-gold-500'
            : 'bg-white dark:bg-ink-700 border-ink-300 dark:border-ink-600 group-hover:border-gold-400',
        ].join(' ')}
      >
        {indeterminate
          ? <Minus  className="w-2.5 h-2.5 text-ink-900 stroke-[3]" />
          : checked
            ? <Check className="w-2.5 h-2.5 text-ink-900 stroke-[3]" />
            : null}
      </span>

      {/* Label + description */}
      {(label || description) && (
        <span className="flex flex-col gap-0.5">
          {label && (
            <span className="text-sm font-medium font-body text-ink-900 dark:text-ink-50 leading-tight">
              {label}
            </span>
          )}
          {description && (
            <span
              id={`${checkId}-desc`}
              className="text-xs text-ink-400 dark:text-ink-500 font-body"
            >
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
}
