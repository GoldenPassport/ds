import React from 'react';

// ── Types ─────────────────────────────────────────────────

export interface DescriptionListAction {
  label:    string;
  onClick?: () => void;
  href?:    string;
}

export interface DescriptionListItem {
  label:   string;
  value:   React.ReactNode;
  /** Optional inline action — "Edit", "Update", etc. */
  action?: DescriptionListAction;
}

export type DescriptionListLayout = 'stacked' | 'side-by-side';

export interface DescriptionListProps {
  items:      DescriptionListItem[];
  /**
   * stacked     — label above value (default)
   * side-by-side — label left, value right in a 3-column grid
   */
  layout?:    DescriptionListLayout;
  /** Alternating row backgrounds */
  striped?:   boolean;
  /** Wraps in a bordered rounded card with overflow-hidden */
  bordered?:  boolean;
  /** Optional title rendered above the list — only shown when bordered=true */
  title?:     string;
  /** Optional subtitle rendered below the title */
  subtitle?:  string;
  className?: string;
}

// ── Action link ───────────────────────────────────────────

function ActionLink({ action }: { action: DescriptionListAction }) {
  const cls = 'text-xs font-semibold font-body text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors shrink-0';
  return action.href ? (
    <a href={action.href} className={cls}>{action.label}</a>
  ) : (
    <button type="button" onClick={action.onClick} className={cls}>{action.label}</button>
  );
}

// ── Row — stacked layout ──────────────────────────────────

function StackedRow({ item, striped, index }: { item: DescriptionListItem; striped: boolean; index: number }) {
  return (
    <div className={[
      'px-6 py-4',
      striped && index % 2 === 0 ? 'bg-ink-50 dark:bg-ink-900/40' : '',
    ].filter(Boolean).join(' ')}>
      <dt className="text-sm font-medium font-body text-ink-500 dark:text-ink-400">
        {item.label}
      </dt>
      <dd className="mt-1 flex items-start justify-between gap-4">
        <span className="text-sm font-body text-ink-900 dark:text-ink-50">
          {item.value}
        </span>
        {item.action && <ActionLink action={item.action} />}
      </dd>
    </div>
  );
}

// ── Row — side-by-side layout ─────────────────────────────

function SideBySideRow({ item, striped, index }: { item: DescriptionListItem; striped: boolean; index: number }) {
  return (
    <div className={[
      'grid grid-cols-3 gap-4 px-6 py-4',
      striped && index % 2 === 0 ? 'bg-ink-50 dark:bg-ink-900/40' : '',
    ].filter(Boolean).join(' ')}>
      <dt className="text-sm font-medium font-body text-ink-500 dark:text-ink-400 col-span-1 self-start pt-px">
        {item.label}
      </dt>
      <dd className="text-sm font-body text-ink-900 dark:text-ink-50 col-span-2 flex items-start justify-between gap-4">
        <span>{item.value}</span>
        {item.action && <ActionLink action={item.action} />}
      </dd>
    </div>
  );
}

// ── DescriptionList ───────────────────────────────────────

export function DescriptionList({
  items,
  layout   = 'side-by-side',
  striped  = false,
  bordered = false,
  title,
  subtitle,
  className = '',
}: DescriptionListProps) {
  const list = (
    <dl className={[
      'divide-y divide-ink-100 dark:divide-ink-700',
      !bordered ? className : '',
    ].filter(Boolean).join(' ')}>
      {items.map((item, i) =>
        layout === 'side-by-side' ? (
          <SideBySideRow key={i} item={item} striped={striped} index={i} />
        ) : (
          <StackedRow key={i} item={item} striped={striped} index={i} />
        )
      )}
    </dl>
  );

  if (bordered) {
    return (
      <div className={[
        'rounded-2xl border border-ink-200 dark:border-ink-700',
        'bg-white dark:bg-ink-800 shadow-sm overflow-hidden',
        className,
      ].join(' ')}>
        {(title || subtitle) && (
          <div className="px-6 py-5 border-b border-ink-200 dark:border-ink-700">
            {title && (
              <h3 className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm font-body text-ink-500 dark:text-ink-400">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {list}
      </div>
    );
  }

  return list;
}
