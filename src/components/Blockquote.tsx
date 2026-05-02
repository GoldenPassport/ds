import React from 'react';

// ── Types ─────────────────────────────────────────────────

export type BlockquoteVariant = 'default' | 'bordered' | 'card';
export type BlockquoteSize    = 'sm' | 'md' | 'lg';

export interface BlockquoteProps {
  /** The quoted text */
  children: React.ReactNode;
  /** Name of the person being quoted */
  author?: string;
  /** Publication, book, or document title */
  source?: string;
  /** URL of the source document — wires the HTML `cite` attribute and makes the source a link */
  sourceUrl?: string;
  /**
   * Visual treatment.
   * - `default`  — plain italic text with a decorative quote mark (default)
   * - `bordered`  — prominent left border in the primary accent colour
   * - `card`      — contained card with border and subtle background
   */
  variant?: BlockquoteVariant;
  /**
   * Text size.
   * - `sm`  — text-sm
   * - `md`  — text-base / text-lg (default)
   * - `lg`  — text-xl / text-2xl
   */
  size?: BlockquoteSize;
  /** Show the decorative opening quotation mark. Default `true` for `default`, `false` for others. */
  showIcon?: boolean;
  className?: string;
}

// ── Config ────────────────────────────────────────────────

const containerCls: Record<BlockquoteVariant, string> = {
  default:  '',
  bordered: 'border-l-4 border-primary-500 pl-6',
  card:     'rounded-2xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 px-7 py-6',
};

const quoteSizeCls: Record<BlockquoteSize, string> = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
};

const citeSizeCls: Record<BlockquoteSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

// Decorative SVG open-quote mark
function QuoteIcon({ size }: { size: BlockquoteSize }) {
  const iconCls = { sm: 'w-5 h-5', md: 'w-7 h-7', lg: 'w-9 h-9' }[size];
  return (
    <svg
      aria-hidden="true"
      className={`${iconCls} text-primary-300 dark:text-primary-700 mb-3`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179Zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179Z" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────

export function Blockquote({
  children,
  author,
  source,
  sourceUrl,
  variant = 'default',
  size = 'md',
  showIcon,
  className = '',
}: BlockquoteProps) {
  // Icon shown by default only on the plain `default` variant
  const displayIcon = showIcon ?? variant === 'default';

  const hasAttribution = author || source;

  const quoteText = (
    <p
      className={[
        quoteSizeCls[size],
        'font-body italic leading-relaxed text-ink-700 dark:text-ink-200',
      ].join(' ')}
    >
      {children}
    </p>
  );

  const attribution = hasAttribution && (
    <figcaption
      className={[
        citeSizeCls[size],
        'font-body text-ink-500 dark:text-ink-300 not-italic',
        variant === 'default' ? 'mt-5' : 'mt-4',
      ].join(' ')}
    >
      {author && (
        <span className="font-semibold text-ink-700 dark:text-ink-200">{author}</span>
      )}
      {author && source && (
        <span className="mx-1 text-ink-400 dark:text-ink-500">&mdash;</span>
      )}
      {source && (
        sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-ink-700 dark:hover:text-ink-200 transition-colors"
          >
            <cite className="not-italic">{source}</cite>
          </a>
        ) : (
          <cite className="not-italic">{source}</cite>
        )
      )}
    </figcaption>
  );

  return (
    <figure className={[containerCls[variant], className].filter(Boolean).join(' ')}>
      {displayIcon && <QuoteIcon size={size} />}
      <blockquote cite={sourceUrl}>
        {quoteText}
      </blockquote>
      {attribution}
    </figure>
  );
}
