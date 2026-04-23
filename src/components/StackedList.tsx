import React from 'react';

// ── Types ─────────────────────────────────────────────────

export interface StackedListItem {
  id:            string | number;
  /** Primary text */
  title:         React.ReactNode;
  /** Secondary text below the title */
  subtitle?:     React.ReactNode;
  /** Leading element — avatar, icon, image, etc. */
  leading?:      React.ReactNode;
  /** Right-side primary content — role, label, badge, etc. */
  trailing?:     React.ReactNode;
  /** Right-side secondary content — last seen, date, status, etc. */
  trailingMeta?: React.ReactNode;
  /** Makes the entire row a <button> */
  onClick?:      () => void;
  /** Makes the entire row an <a> */
  href?:         string;
}

export interface StackedListProps {
  items:        StackedListItem[];
  /**
   * Custom row renderer — bypasses the default two-column layout.
   * Receives the item and its 0-indexed position.
   */
  renderItem?:  (item: StackedListItem, index: number) => React.ReactNode;
  /** Horizontal dividers between items. Default: true */
  divided?:     boolean;
  /** Wraps the list in a bordered, rounded card. Default: false */
  bordered?:    boolean;
  /** Show or hide the leading slot (avatar/icon). Default: true */
  showLeading?: boolean;
  className?:   string;
}

// ── Default row ───────────────────────────────────────────

function DefaultRow({ item, showLeading }: { item: StackedListItem; showLeading: boolean }) {
  const interactive = !!(item.onClick || item.href);

  const inner = (
    <div className={[
      'flex items-center justify-between gap-6 py-4',
      interactive ? 'transition-colors duration-100' : '',
    ].join(' ')}>

      {/* Left: leading + title / subtitle */}
      <div className="flex items-center gap-4 min-w-0">
        {showLeading && item.leading && (
          <div className="shrink-0">{item.leading}</div>
        )}
        <div className="min-w-0">
          <p className={[
            'text-sm font-semibold font-body truncate',
            interactive
              ? 'text-ink-900 dark:text-ink-50 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-100'
              : 'text-ink-900 dark:text-ink-50',
          ].join(' ')}>
            {item.title}
          </p>
          {item.subtitle && (
            <p className="mt-0.5 text-xs font-body text-ink-500 dark:text-ink-400 truncate">
              {item.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: trailing + trailingMeta — hidden on mobile */}
      {(item.trailing || item.trailingMeta) && (
        <div className="hidden sm:flex sm:flex-col sm:items-end shrink-0">
          {item.trailing && (
            <div className="text-sm font-body text-ink-700 dark:text-ink-200">
              {item.trailing}
            </div>
          )}
          {item.trailingMeta && (
            <div className="mt-1 text-xs font-body text-ink-400 dark:text-ink-500">
              {item.trailingMeta}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (item.href) {
    return (
      <a href={item.href} className="group block">
        {inner}
      </a>
    );
  }
  if (item.onClick) {
    return (
      <button
        type="button"
        onClick={item.onClick}
        className="group w-full text-left"
      >
        {inner}
      </button>
    );
  }
  return inner;
}

// ── StackedList ───────────────────────────────────────────

export function StackedList({
  items,
  renderItem,
  divided      = true,
  bordered     = false,
  showLeading  = true,
  className    = '',
}: StackedListProps) {
  const list = (
    <ul
      role="list"
      className={[
        divided && !bordered ? 'divide-y divide-ink-100 dark:divide-ink-700' : '',
        divided && bordered  ? 'divide-y divide-ink-100 dark:divide-ink-700' : '',
        !bordered ? className : '',
      ].filter(Boolean).join(' ')}
    >
      {items.map((item, i) => (
        <li key={item.id}>
          {renderItem ? renderItem(item, i) : <DefaultRow item={item} showLeading={showLeading} />}
        </li>
      ))}
    </ul>
  );

  if (bordered) {
    return (
      <div className={[
        'rounded-2xl overflow-hidden border border-ink-200 dark:border-ink-700',
        'bg-white dark:bg-ink-800 shadow-sm',
        className,
      ].join(' ')}>
        <div className="px-6">
          {list}
        </div>
      </div>
    );
  }

  return list;
}
