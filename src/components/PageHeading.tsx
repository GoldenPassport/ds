import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import type { BreadcrumbItem } from './Breadcrumbs';

// ── Types ─────────────────────────────────────────────────

export interface PageHeadingTab {
  label:  string;
  value:  string;
  badge?: string | number;
}

export interface PageHeadingProps {
  title:        React.ReactNode;
  description?: React.ReactNode;
  /** Breadcrumb trail rendered above the title */
  breadcrumbs?: BreadcrumbItem[];
  /** Buttons / menus rendered to the right of the title */
  actions?:     React.ReactNode;
  /** Badges, tags, or status indicators rendered below the title */
  meta?:        React.ReactNode;
  /** Avatar or icon rendered to the left of the title */
  avatar?:      React.ReactNode;
  /** Back link — renders an arrow-left button above the title */
  backHref?:    string;
  onBack?:      () => void;
  /** Tab bar rendered at the bottom of the heading */
  tabs?:        PageHeadingTab[];
  activeTab?:   string;
  onTabChange?: (value: string) => void;
  /** Add a bottom border. Default: false */
  bordered?:    boolean;
  className?:   string;
}

// ── PageHeading ───────────────────────────────────────────

export function PageHeading({
  title,
  description,
  breadcrumbs,
  actions,
  meta,
  avatar,
  backHref,
  onBack,
  tabs,
  activeTab,
  onTabChange,
  bordered  = false,
  className = '',
}: PageHeadingProps) {

  const hasBack = backHref || onBack;

  const BackEl = hasBack ? (
    <div className="mb-3">
      {backHref ? (
        <a
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-body text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back
        </a>
      ) : (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-body text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back
        </button>
      )}
    </div>
  ) : null;

  return (
    <div className={[
      bordered ? 'border-b border-ink-200 dark:border-ink-700' : '',
      className,
    ].filter(Boolean).join(' ')}>

      {/* Back link */}
      {BackEl}

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-2">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {avatar && (
            <div className="shrink-0">{avatar}</div>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight truncate">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-400">
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Meta row */}
      {meta && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {meta}
        </div>
      )}

      {/* Tab bar */}
      {tabs && tabs.length > 0 && (
        <div className="mt-4 -mb-px flex gap-0 overflow-x-auto">
          {tabs.map(tab => {
            const isActive = tab.value === activeTab;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onTabChange?.(tab.value)}
                className={[
                  'inline-flex items-center gap-2 px-1 py-3 mr-6 text-sm font-medium font-body border-b-2 whitespace-nowrap transition-colors',
                  isActive
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:border-ink-300 dark:hover:border-ink-600',
                ].join(' ')}
              >
                {tab.label}
                {tab.badge != null && (
                  <span className={[
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                      : 'bg-ink-100 dark:bg-ink-700 text-ink-600 dark:text-ink-300',
                  ].join(' ')}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
