import React from 'react';

// ── Types ─────────────────────────────────────────────────

/**
 * divided  — items separated by horizontal dividers; no outer border
 * bordered — single card wrapper; padded items divided by thin rules
 * cards    — each item rendered in its own card with a gap between them
 * flush    — single card wrapper; items stretch edge-to-edge (no side padding)
 */
export type ContainerListVariant = 'divided' | 'bordered' | 'cards' | 'flush';

export interface ContainerListProps {
  /** Each element becomes one list item */
  items: React.ReactNode[];
  variant?: ContainerListVariant;
  /** Show dividers between items. Default: true. Not applicable to 'cards' (cards are always separated by a gap). */
  dividers?: boolean;
  className?: string;
}

// ── ContainerList ─────────────────────────────────────────

export function ContainerList({
  items,
  variant = 'divided',
  dividers = true,
  className = '',
}: ContainerListProps) {
  const dividerCls = dividers ? 'divide-y divide-ink-100 dark:divide-ink-700' : '';

  // ── divided ──────────────────────────────────────────────
  if (variant === 'divided') {
    return (
      <ul role="list" className={[dividerCls, className].filter(Boolean).join(' ')}>
        {items.map((item, i) => (
          <li key={i} className="py-4">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  // ── cards ─────────────────────────────────────────────────
  // dividers is not applicable to cards — each card has its own border
  if (variant === 'cards') {
    return (
      <ul role="list" className={['flex flex-col gap-4', className].filter(Boolean).join(' ')}>
        {items.map((item, i) => (
          <li
            key={i}
            className="rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-sm px-6 py-5"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  // ── bordered & flush ──────────────────────────────────────
  // flush: vertical padding only — content spans the full card width
  // bordered: full padding on all sides
  const itemClass = variant === 'flush' ? 'py-3' : 'px-6 py-5';

  return (
    <div
      className={[
        'rounded-2xl border border-ink-200 dark:border-ink-700',
        'bg-white dark:bg-ink-800 shadow-sm overflow-hidden',
        className,
      ].join(' ')}
    >
      <ul role="list" className={dividerCls}>
        {items.map((item, i) => (
          <li key={i} className={itemClass}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
