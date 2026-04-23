import { ChevronRight, Home } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export interface BreadcrumbItem {
  label:  string;
  href?:  string;
}

export type BreadcrumbSeparator = 'slash' | 'chevron';

export interface BreadcrumbsProps {
  items:         BreadcrumbItem[];
  /** Separator style. Default: 'chevron' */
  separator?:    BreadcrumbSeparator;
  /** Replace the first item's label with a home icon */
  homeIcon?:     boolean;
  /** Wrap in a full-width contained bar */
  contained?:    boolean;
  className?:    string;
}

// ── Separator ─────────────────────────────────────────────

function Separator({ type }: { type: BreadcrumbSeparator }) {
  if (type === 'slash') {
    return (
      <span className="mx-2 text-ink-300 dark:text-ink-600 select-none" aria-hidden="true">
        /
      </span>
    );
  }
  return (
    <ChevronRight
      className="mx-1.5 w-4 h-4 shrink-0 text-ink-300 dark:text-ink-600"
      aria-hidden="true"
    />
  );
}

// ── Breadcrumbs ───────────────────────────────────────────

export function Breadcrumbs({
  items,
  separator = 'chevron',
  homeIcon  = false,
  contained = false,
  className = '',
}: BreadcrumbsProps) {
  const nav = (
    <nav aria-label="Breadcrumb" className={contained ? '' : className}>
      <ol role="list" className="flex flex-wrap items-center">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const isFirst = i === 0;

          const labelNode = isFirst && homeIcon ? (
            <>
              <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">{item.label}</span>
            </>
          ) : (
            item.label
          );

          return (
            <li key={i} className="flex items-center">
              {i > 0 && <Separator type={separator} />}

              {isLast || !item.href ? (
                <span
                  className={[
                    'text-sm font-body font-medium',
                    isLast
                      ? 'text-ink-500 dark:text-ink-400'
                      : 'text-ink-400 dark:text-ink-500',
                  ].join(' ')}
                  {...(isLast ? { 'aria-current': 'page' as const } : {})}
                >
                  {labelNode}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="flex items-center gap-1.5 text-sm font-body font-medium text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-ink-200 transition-colors"
                >
                  {labelNode}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );

  if (contained) {
    return (
      <div className={[
        'border-b border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800',
        className,
      ].join(' ')}>
        <div className="px-6 py-3">
          {nav}
        </div>
      </div>
    );
  }

  return nav;
}
