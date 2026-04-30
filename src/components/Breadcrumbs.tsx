import { ChevronRight, Home } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type BreadcrumbSeparator = 'slash' | 'chevron';

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Separator style. Default: 'chevron' */
  separator?: BreadcrumbSeparator;
  /** Replace the first item's label with a home icon */
  homeIcon?: boolean;
  /** Wrap in a full-width contained bar */
  contained?: boolean;
  /** Accessible label for the <nav> landmark. Default: 'Breadcrumb'.
   *  Must be unique when multiple breadcrumb navs appear on the same page. */
  ariaLabel?: string;
  className?: string;
}

// ── Separator ─────────────────────────────────────────────

function Separator({ type }: { type: BreadcrumbSeparator }) {
  if (type === 'slash') {
    return (
      <span className="mx-2 text-ink-500 dark:text-ink-300 select-none" aria-hidden="true">
        /
      </span>
    );
  }
  return (
    <ChevronRight
      className="mx-1.5 w-4 h-4 shrink-0 text-ink-500 dark:text-ink-300"
      aria-hidden="true"
    />
  );
}

// ── Breadcrumbs ───────────────────────────────────────────

export function Breadcrumbs({
  items,
  separator = 'chevron',
  homeIcon = false,
  contained = false,
  ariaLabel = 'Breadcrumb',
  className = '',
}: BreadcrumbsProps) {
  const nav = (
    <nav aria-label={ariaLabel} className={contained ? '' : className}>
      <ol role="list" className="flex flex-wrap items-center">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const isFirst = i === 0;

          const labelNode =
            isFirst && homeIcon ? (
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
                    isLast ? 'text-ink-900 dark:text-ink-100' : 'text-ink-600 dark:text-ink-300',
                  ].join(' ')}
                  {...(isLast ? { 'aria-current': 'page' as const } : {})}
                >
                  {labelNode}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="flex items-center gap-1.5 text-sm font-body font-medium text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-100 transition-colors"
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
      <div
        className={[
          'border-b border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800',
          className,
        ].join(' ')}
      >
        <div className="px-6 py-3">{nav}</div>
      </div>
    );
  }

  return nav;
}
