import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  wrapClassName?: string;
}

export function Textarea({
  label,
  hint,
  error,
  resize = 'vertical',
  rows = 4,
  wrapClassName = '',
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  const resizeClass = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
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
      {/*
        Wrapper provides the border + focus ring + rounded corners.
        The textarea hides its native resizer; we paint our own grip
        SVG in the corner so it sits cleanly inside the radius.
      */}
      <div
        className={[
          'relative rounded-xl overflow-hidden',
          error
            ? 'border border-red-400 focus-within:border-red-500'
            : 'border border-ink-200 dark:border-ink-600 focus-within:border-primary-500',
          'transition-all duration-150',
        ].join(' ')}
      >
        <textarea
          id={textareaId}
          rows={rows}
          className={[
            'block w-full px-3 py-2.5 text-sm font-body',
            'bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-50',
            'placeholder:text-ink-500 dark:placeholder:text-ink-400',
            'outline-none border-none',
            // hide the native OS resizer on all engines
            '[&::-webkit-resizer]:hidden',
            resizeClass,
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className,
          ].join(' ')}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />

        {/* Custom grip — only shown when resizable */}
        {resize !== 'none' && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[6px] right-[6px] text-ink-300 dark:text-ink-600"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="8.5" cy="8.5" r="1" />
              <circle cx="5" cy="8.5" r="1" />
              <circle cx="8.5" cy="5" r="1" />
            </svg>
          </span>
        )}
      </div>
      {error && (
        <p
          id={`${textareaId}-error`}
          role="alert"
          className="text-xs text-red-700 dark:text-red-400 font-body"
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${textareaId}-hint`} className="text-xs text-ink-500 dark:text-ink-300 font-body">
          {hint}
        </p>
      )}
    </div>
  );
}
