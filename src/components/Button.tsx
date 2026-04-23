import React from 'react';
import { Loader2 } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize    = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?:    ButtonSize;
  loading?: boolean;
}

// ── Styles ────────────────────────────────────────────────
const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-primary-500 text-ink-900 hover:bg-primary-600 border-transparent',
  secondary: 'bg-ink-100 text-ink-900 hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-50 dark:hover:bg-ink-600 border-transparent',
  ghost:     'bg-transparent text-ink-500 border border-ink-200 hover:border-ink-400 dark:text-ink-300 dark:border-ink-600 dark:hover:border-ink-400',
  danger:    'bg-red-100 text-red-700 hover:bg-red-200 border-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-xs rounded-md gap-1',
  md: 'px-[18px] py-[9px] text-sm rounded-lg gap-1.5',
  lg: 'px-6 py-3.5 text-base rounded-xl gap-2',
};

// ── Component ─────────────────────────────────────────────
export function Button({
  variant = 'primary',
  size    = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        'inline-flex items-center justify-center font-semibold font-body',
        'cursor-pointer transition-all duration-150 border',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : children}
    </button>
  );
}
