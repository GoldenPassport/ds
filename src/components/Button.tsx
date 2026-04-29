import React from 'react';
import { Loader2 } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize    = 'sm' | 'md' | 'lg';
export type ButtonRadius  = 'square' | 'rounded' | 'pill';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  radius?:   ButtonRadius;
  loading?:  boolean;
  /** Square equal-padding layout for icon-only buttons */
  iconOnly?: boolean;
}

// ── Styles ────────────────────────────────────────────────
const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-primary-500 text-ink-900 hover:bg-primary-600 border-transparent',
  secondary: 'bg-ink-100 text-ink-900 hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-100 dark:hover:bg-ink-600 border-transparent',
  ghost:     'bg-transparent text-ink-600 border border-ink-300 hover:bg-ink-50 hover:border-ink-400 dark:text-ink-300 dark:border-ink-600 dark:hover:bg-ink-800 dark:hover:border-ink-500',
  danger:    'bg-red-100 text-red-700 hover:bg-red-200 border-transparent dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50',
};

// Padding + font size only — no rounded (applied separately via radius)
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-xs gap-1',
  md: 'px-[18px] py-[9px] text-sm gap-1.5',
  lg: 'px-6 py-3.5 text-base gap-2',
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  sm: 'p-1.5 text-xs',
  md: 'p-2.5 text-sm',
  lg: 'p-3.5 text-base',
};

// Default radius per size (used when radius='rounded')
const defaultRadiusClasses: Record<ButtonSize, string> = {
  sm: 'rounded-xl',
  md: 'rounded-xl',
  lg: 'rounded-xl',
};

const radiusClasses: Record<ButtonRadius, string> = {
  square:  'rounded-none',
  rounded: '',        // resolved per-size below
  pill:    'rounded-full',
};

// ── Component ─────────────────────────────────────────────
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({
    variant  = 'primary',
    size     = 'md',
    radius   = 'rounded',
    loading  = false,
    iconOnly = false,
    disabled,
    className = '',
    children,
    ...props
  }, ref) {
    const resolvedRadius = radius === 'rounded' ? defaultRadiusClasses[size] : radiusClasses[radius];

    return (
      <button
        ref={ref}
        disabled={disabled}
        aria-busy={loading || undefined}
        className={[
          'inline-flex items-center justify-center font-semibold font-body',
          'cursor-pointer transition-all duration-150 border',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          loading ? 'pointer-events-none' : '',
          iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
          resolvedRadius,
          variantClasses[variant],
          className,
        ].join(' ')}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
            <span className="sr-only">{children}</span>
          </>
        ) : children}
      </button>
    );
  }
);
