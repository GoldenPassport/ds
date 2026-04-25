import React from 'react';

// ── Types ─────────────────────────────────────────────────

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  children:     React.ReactNode;
  /** Renders a bordered header section above the body */
  header?:      React.ReactNode;
  /** Renders a bordered footer section below the body */
  footer?:      React.ReactNode;
  /**
   * Body padding size. Default: 'md'
   * Applies the same padding to header and footer when present.
   */
  padding?:     CardPadding;
  /** Grey background on the header section */
  headerMuted?: boolean;
  /** Grey background on the body section */
  bodyMuted?:   boolean;
  /** Grey background on the footer section */
  footerMuted?: boolean;
  className?:   string;
}

// ── Helpers ───────────────────────────────────────────────

const paddingCls: Record<CardPadding, string> = {
  none: '',
  sm:   'px-4 py-3',
  md:   'px-6 py-5',
  lg:   'px-8 py-7',
};

const MUTED = 'bg-ink-50 dark:bg-ink-700/50';

// ── Card ──────────────────────────────────────────────────

export function Card({
  children,
  header,
  footer,
  padding     = 'md',
  headerMuted = false,
  bodyMuted   = false,
  footerMuted = false,
  className   = '',
}: CardProps) {
  const p = paddingCls[padding];

  return (
    <div className={[
      'rounded-2xl border border-ink-200 dark:border-ink-700',
      'bg-white dark:bg-ink-800 shadow-sm overflow-hidden',
      className,
    ].join(' ')}>

      {header && (
        <div className={[
          'border-b border-ink-200 dark:border-ink-700',
          p,
          headerMuted ? MUTED : '',
        ].filter(Boolean).join(' ')}>
          {header}
        </div>
      )}

      <div className={[p, bodyMuted ? MUTED : ''].filter(Boolean).join(' ')}>
        {children}
      </div>

      {footer && (
        <div className={[
          'border-t border-ink-200 dark:border-ink-700',
          p,
          footerMuted ? MUTED : '',
        ].filter(Boolean).join(' ')}>
          {footer}
        </div>
      )}
    </div>
  );
}
