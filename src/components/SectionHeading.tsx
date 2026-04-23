import React from 'react';

// ── Types ─────────────────────────────────────────────────

export interface SectionHeadingTab {
  label:  string;
  value:  string;
  badge?: string | number;
}

export interface SectionHeadingProps {
  title:        React.ReactNode;
  description?: React.ReactNode;
  /** Small eyebrow text rendered above the title */
  label?:       string;
  /** Buttons / menus rendered to the right of the title */
  actions?:     React.ReactNode;
  /** Render a full-width divider below the heading */
  divider?:     boolean;
  /** Tab bar rendered below the heading */
  tabs?:        SectionHeadingTab[];
  activeTab?:   string;
  onTabChange?: (value: string) => void;
  /** Heading element level. Default: 'h2' */
  as?:          'h2' | 'h3';
  className?:   string;
}

// ── SectionHeading ────────────────────────────────────────

export function SectionHeading({
  title,
  description,
  label,
  actions,
  divider    = false,
  tabs,
  activeTab,
  onTabChange,
  as:        Tag = 'h2',
  className  = '',
}: SectionHeadingProps) {

  const titleSize = Tag === 'h2'
    ? 'text-base font-semibold'
    : 'text-sm font-semibold';

  const hasTabs = tabs && tabs.length > 0;

  return (
    <div className={className}>
      {/* Label / eyebrow */}
      {label && (
        <p className="mb-1 text-xs font-semibold font-body uppercase tracking-wider text-primary-600 dark:text-primary-400">
          {label}
        </p>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Tag className={`${titleSize} font-display text-ink-900 dark:text-ink-50 tracking-tight leading-snug`}>
            {title}
          </Tag>
          {description && (
            <p className="mt-0.5 text-sm font-body text-ink-500 dark:text-ink-400">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Tabs */}
      {hasTabs && (
        <div className="mt-3 -mb-px flex gap-0 overflow-x-auto">
          {tabs.map(tab => {
            const isActive = tab.value === activeTab;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onTabChange?.(tab.value)}
                className={[
                  'inline-flex items-center gap-2 px-1 py-2.5 mr-5 text-sm font-medium font-body border-b-2 whitespace-nowrap transition-colors',
                  isActive
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:border-ink-300 dark:hover:border-ink-600',
                ].join(' ')}
              >
                {tab.label}
                {tab.badge != null && (
                  <span className={[
                    'rounded-full px-1.5 py-0.5 text-xs font-medium',
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

      {/* Divider */}
      {divider && !hasTabs && (
        <div className="mt-3 border-t border-ink-200 dark:border-ink-700" />
      )}
      {divider && hasTabs && (
        <div className="border-t border-ink-200 dark:border-ink-700" />
      )}
    </div>
  );
}
