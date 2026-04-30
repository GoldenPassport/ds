import React from 'react';
import { SectionHeader } from './SectionHeader';
import type { SectionHeaderAction } from './SectionHeader';
import type { MenuItem } from './Menu';

// ── Types ─────────────────────────────────────────────────

export interface ListCardProps {
  // ── Optional header ──────────────────────────────────────
  title?: string;
  subtitle?: string;
  primaryAction?: SectionHeaderAction;
  menuItems?: MenuItem[];

  /**
   * Rendered below the sm breakpoint (mobile).
   * Pass a <StackedList /> without `bordered`.
   */
  list?: React.ReactNode;
  /**
   * Rendered at sm+ breakpoint (desktop).
   * Pass a <DataTable flat /> to skip the DataTable's own card wrapper.
   */
  table?: React.ReactNode;

  className?: string;
}

// ── Component ─────────────────────────────────────────────

export function ListCard({
  title,
  subtitle,
  primaryAction,
  menuItems,
  list,
  table,
  className = '',
}: ListCardProps) {
  const hasHeader = !!(title || subtitle || primaryAction || (menuItems && menuItems.length > 0));

  return (
    <div
      className={[
        'rounded-2xl border border-ink-200 dark:border-ink-700',
        'bg-white dark:bg-ink-800 shadow-sm overflow-hidden',
        className,
      ].join(' ')}
    >
      {/* Header */}
      {hasHeader && (
        <div className="px-6 py-4 border-b border-ink-100 dark:border-ink-700">
          <SectionHeader
            title={title!}
            subtitle={subtitle}
            primaryAction={primaryAction}
            menuItems={menuItems}
          />
        </div>
      )}

      {/* Mobile: list slot */}
      {list && <div className="sm:hidden px-6">{list}</div>}

      {/* Desktop: table slot */}
      {table && <div className="hidden sm:block">{table}</div>}
    </div>
  );
}
