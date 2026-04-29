import React from 'react';
import { ExternalLink } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export type HyperlinkVariant   = 'default' | 'muted' | 'danger';
export type HyperlinkUnderline = 'always' | 'hover' | 'none';

export interface HyperlinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The URL to link to */
  href: string;
  /**
   * Visual style.
   * - `'default'` — primary brand colour (default)
   * - `'muted'`   — subdued ink colour, blends into body text
   * - `'danger'`  — red, for destructive or warning links
   */
  variant?:   HyperlinkVariant;
  /**
   * When to show an underline.
   * - `'hover'`  — underline on hover/focus only (default)
   * - `'always'` — always underlined
   * - `'none'`   — never underlined
   */
  underline?: HyperlinkUnderline;
  /** Opens in a new tab with `rel="noopener noreferrer"` and appends an external-link icon */
  external?:  boolean;
  children:   React.ReactNode;
}

// ── Tokens ────────────────────────────────────────────────

const variantCls: Record<HyperlinkVariant, string> = {
  // Uses --link-primary: auto-darkened from primary-500 in light mode (≈5.5:1 on white),
  // stays bright primary-500 in dark mode. Override --link-primary on any container
  // to tune the shade for intermediate backgrounds.
  default: 'text-[var(--link-primary)] decoration-[var(--link-primary)]',
  muted:   'text-ink-500    dark:text-ink-300  decoration-ink-400/60 dark:decoration-ink-400/60',
  danger:  'text-red-600    dark:text-red-400  decoration-red-500/60 dark:decoration-red-400/60',
};

const underlineCls: Record<HyperlinkUnderline, string> = {
  always: 'underline',
  hover:  'no-underline hover:underline focus-visible:underline',
  none:   'no-underline',
};

// ── Component ─────────────────────────────────────────────

export function Hyperlink({
  href,
  variant   = 'default',
  underline = 'hover',
  external  = false,
  children,
  className = '',
  ...rest
}: HyperlinkProps) {
  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <a
      href={href}
      {...externalProps}
      {...rest}
      className={[
        'inline-flex items-center gap-1 font-body transition-colors',
        'underline-offset-2',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded-sm',
        variantCls[variant],
        underlineCls[underline],
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
      {external && (
        <ExternalLink
          className="w-3 h-3 shrink-0 opacity-70"
          aria-label="(opens in new tab)"
        />
      )}
    </a>
  );
}
