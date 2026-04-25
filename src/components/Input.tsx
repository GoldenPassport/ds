import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:    string;
  hint?:     string;
  error?:    string;
  wrapClassName?: string;
}

export function Input({
  label,
  hint,
  error,
  wrapClassName = '',
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${wrapClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full px-3 py-2.5 rounded-xl border text-sm font-body',
          'bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-50',
          'placeholder:text-ink-400 dark:placeholder:text-ink-500',
          'transition-all duration-150 outline-none',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
            : 'border-ink-200 dark:border-ink-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25',
          className,
        ].join(' ')}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
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
