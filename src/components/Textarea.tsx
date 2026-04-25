import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:         string;
  hint?:          string;
  error?:         string;
  resize?:        'none' | 'vertical' | 'horizontal' | 'both';
  wrapClassName?: string;
}

export function Textarea({
  label,
  hint,
  error,
  resize        = 'vertical',
  rows          = 4,
  wrapClassName = '',
  className     = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  const resizeClass = {
    none:       'resize-none',
    vertical:   'resize-y',
    horizontal: 'resize-x',
    both:       'resize',
  }[resize];

  return (
    <div className={`flex flex-col gap-1.5 ${wrapClassName}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={[
          'w-full px-3 py-2.5 rounded-xl border text-sm font-body',
          'bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-50',
          'placeholder:text-ink-400 dark:placeholder:text-ink-500',
          'transition-all duration-150 outline-none',
          resizeClass,
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
            : 'border-ink-200 dark:border-ink-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          className,
        ].join(' ')}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400 font-body">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${textareaId}-hint`} className="text-xs text-ink-400 dark:text-ink-500 font-body">
          {hint}
        </p>
      )}
    </div>
  );
}
