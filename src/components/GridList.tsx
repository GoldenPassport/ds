import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Menu } from './Menu';
import type { MenuItem } from './Menu';

// ── Types ─────────────────────────────────────────────────

export interface GridListItemMeta {
  icon?:  React.ReactNode;
  label:  string;
}

export interface GridListItem {
  id:           string | number;
  title:        React.ReactNode;
  description?: React.ReactNode;
  /** Leading element in the card header — avatar, icon, image, etc. */
  leading?:     React.ReactNode;
  /** Status badge rendered top-right alongside the menu */
  badge?:       React.ReactNode;
  /** Footer metadata chips — icon + label pairs */
  meta?:        GridListItemMeta[];
  /** Overflow menu items */
  menuItems?:   MenuItem[];
  /** Makes the title a clickable link */
  href?:        string;
  /** Makes the title a clickable button */
  onClick?:     () => void;
}

export type GridListColumns = 2 | 3 | 4;

export interface GridListProps {
  items:        GridListItem[];
  /** Number of columns at the lg breakpoint. Default: 3 */
  columns?:     GridListColumns;
  /** Custom card renderer — replaces the default card entirely */
  renderItem?:  (item: GridListItem, index: number) => React.ReactNode;
  className?:   string;
}

// ── Column map ─────────────────────────────────────────────

const colClass: Record<GridListColumns, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

// ── Default card ───────────────────────────────────────────

function DefaultCard({ item }: { item: GridListItem }) {
  const hasMenu    = item.menuItems && item.menuItems.length > 0;
  const hasFooter  = item.meta && item.meta.length > 0;
  const interactive = !!(item.href || item.onClick);

  const titleNode = interactive ? (
    item.href ? (
      <a
        href={item.href}
        className="font-semibold text-sm text-ink-900 dark:text-ink-50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors leading-snug focus:outline-none focus-visible:underline"
      >
        {item.title}
      </a>
    ) : (
      <button
        type="button"
        onClick={item.onClick}
        className="font-semibold text-sm text-ink-900 dark:text-ink-50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors leading-snug text-left focus:outline-none focus-visible:underline"
      >
        {item.title}
      </button>
    )
  ) : (
    <p className="font-semibold text-sm text-ink-900 dark:text-ink-50 leading-snug">
      {item.title}
    </p>
  );

  return (
    <div className="flex flex-col h-full rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-sm p-5 gap-3">

      {/* Header row: leading + title / badge + menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {item.leading && (
            <div className="shrink-0">{item.leading}</div>
          )}
          <div className="min-w-0">
            {titleNode}
          </div>
        </div>

        {(item.badge || hasMenu) && (
          <div className="flex items-center gap-1.5 shrink-0">
            {item.badge}
            {hasMenu && (
              <Menu
                trigger={
                  <button className="inline-flex items-center justify-center w-7 h-7 rounded-xl text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors border-0 bg-transparent cursor-pointer">
                    <MoreVertical className="w-4 h-4" aria-hidden="true" />
                  </button>
                }
                items={item.menuItems!}
              />
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-sm font-body text-ink-500 dark:text-ink-300 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      )}

      {/* Footer metadata */}
      {hasFooter && (
        <div className="mt-auto pt-3 border-t border-ink-100 dark:border-ink-700 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {item.meta!.map((m, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs font-body text-ink-500 dark:text-ink-300">
              {m.icon && <span className="shrink-0 text-ink-300 dark:text-ink-600" aria-hidden="true">{m.icon}</span>}
              {m.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── GridList ───────────────────────────────────────────────

export function GridList({
  items,
  columns   = 3,
  renderItem,
  className = '',
}: GridListProps) {
  return (
    <ul
      role="list"
      className={[
        'grid gap-5',
        colClass[columns],
        className,
      ].filter(Boolean).join(' ')}
    >
      {items.map((item, i) => (
        <li key={item.id} className="flex flex-col">
          {renderItem ? renderItem(item, i) : <DefaultCard item={item} />}
        </li>
      ))}
    </ul>
  );
}
