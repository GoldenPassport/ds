import React from 'react';
import { ArrowLeft, MoreVertical, Menu } from 'lucide-react';
import { Menu as HLMenu, Transition } from '@headlessui/react';
import { Breadcrumbs } from './Breadcrumbs';
import type { BreadcrumbItem } from './Breadcrumbs';
import type { ButtonVariant } from './Button';
import { SearchSet } from './SearchSet';
import type { SearchSetTag, SearchSetFilterDef, SearchSetFilterValues } from './SearchSet';

// ── Types ─────────────────────────────────────────────────

export interface PageHeadingTab {
  label: string;
  value: string;
  badge?: string | number;
}

export interface PageHeadingAction {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: ButtonVariant;
}

/**
 * Mobile layout variant:
 * - master-simple : search input only — no tags, no info button, no summary row (all screen sizes)
 * - master-full   : full SearchSet (tags + info + summary) on desktop; simple search on mobile
 * - master        : alias for master-simple (kept for backward compatibility)
 * - small         : back + title + actions on a single compact row
 * - medium        : back/actions top bar, large title stacked below (default)
 * - large         : back/actions top bar, extra-large title stacked below
 */
export type PageHeadingMobileVariant =
  | 'master'
  | 'master-simple'
  | 'master-full'
  | 'small'
  | 'medium'
  | 'large';

export interface PageHeadingProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  /**
   * Structured actions — full buttons on desktop;
   * icon-only / overflow-menu on mobile automatically.
   */
  actionItems?: PageHeadingAction[];
  /** Freeform slot rendered on the right (desktop) or trailing (master) */
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  avatar?: React.ReactNode;
  backHref?: string;
  onBack?: () => void;
  tabs?: PageHeadingTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  bordered?: boolean;
  /** Mobile layout type. Default: 'medium' */
  mobileVariant?: PageHeadingMobileVariant;
  /** Stick the header to the top of the viewport on scroll */
  sticky?: boolean;
  /** master variant — hamburger click handler; shows hamburger when provided */
  onMenuClick?: () => void;
  /** master variant — controlled search query */
  searchValue?: string;
  /** master variant — called with debounced query */
  onSearchChange?: (query: string) => void;
  /** master variant — show spinner while fetching */
  searchLoading?: boolean;
  /** master variant — search input placeholder */
  searchPlaceholder?: string;
  /** master variant — AND/OR committed search tags */
  searchTags?: SearchSetTag[];
  /** master variant — called when search tags change */
  onSearchTagsChange?: (tags: SearchSetTag[]) => void;
  /** master variant — result summary shown below the input */
  searchSummary?: React.ReactNode;
  /** master variant — filter field definitions (shows filter button) */
  searchFilterDefs?: SearchSetFilterDef[];
  /** master variant — controlled filter values */
  searchFilterValues?: SearchSetFilterValues;
  /** master variant — called when filters are applied */
  onSearchFilterChange?: (values: SearchSetFilterValues) => void;
  /** master variant — filter dialog title */
  searchFilterTitle?: string;
  className?: string;
}

// ── Mobile overflow menu ───────────────────────────────────

function OverflowMenu({ items }: { items: PageHeadingAction[] }) {
  return (
    <HLMenu as="div" className="relative">
      <HLMenu.Button
        className="inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-500 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors focus:outline-none"
        aria-label="More actions"
      >
        <MoreVertical className="w-5 h-5" aria-hidden="true" />
      </HLMenu.Button>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 scale-95 translate-y-1"
        enterTo="opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <HLMenu.Items className="absolute right-0 z-50 mt-1 w-48 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-md overflow-hidden focus:outline-none">
          <div className="py-1">
            {items.map((item, i) => (
              <HLMenu.Item key={i}>
                {({ active }) => {
                  const cls = `flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-body text-left text-ink-700 dark:text-ink-200 transition-colors ${active ? 'bg-ink-50 dark:bg-ink-700' : ''}`;
                  return item.href ? (
                    <a href={item.href} className={cls}>
                      <span className="w-4 h-4 shrink-0 text-ink-500">{item.icon}</span>
                      {item.label}
                    </a>
                  ) : (
                    <button type="button" onClick={item.onClick} className={cls}>
                      <span className="w-4 h-4 shrink-0 text-ink-500">{item.icon}</span>
                      {item.label}
                    </button>
                  );
                }}
              </HLMenu.Item>
            ))}
          </div>
        </HLMenu.Items>
      </Transition>
    </HLMenu>
  );
}

// ── Desktop action buttons ─────────────────────────────────

const variantDesktopCls: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 text-ink-900 hover:bg-primary-600 border-transparent',
  secondary:
    'bg-ink-100 text-ink-900 hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-100 dark:hover:bg-ink-600 border-transparent',
  ghost:
    'bg-transparent text-ink-600 border border-ink-300 hover:bg-ink-50 dark:text-ink-300 dark:border-ink-600 dark:hover:bg-ink-800',
  danger:
    'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 border-transparent',
};

function DesktopActionButton({ item }: { item: PageHeadingAction }) {
  const cls = [
    'inline-flex items-center gap-1.5 px-[18px] py-[9px] text-sm font-semibold font-body rounded-xl border transition-all duration-150',
    variantDesktopCls[item.variant ?? 'secondary'],
  ].join(' ');
  return item.href ? (
    <a href={item.href} className={cls}>
      <span className="w-4 h-4 shrink-0" aria-hidden="true">
        {item.icon}
      </span>
      {item.label}
    </a>
  ) : (
    <button type="button" onClick={item.onClick} className={cls}>
      <span className="w-4 h-4 shrink-0" aria-hidden="true">
        {item.icon}
      </span>
      {item.label}
    </button>
  );
}

// ── PageHeading ───────────────────────────────────────────

export function PageHeading({
  title,
  description,
  breadcrumbs,
  actionItems,
  actions,
  meta,
  avatar,
  backHref,
  onBack,
  tabs,
  activeTab,
  onTabChange,
  bordered = false,
  mobileVariant = 'medium',
  sticky = true,
  onMenuClick,
  searchValue = '',
  onSearchChange,
  searchLoading = false,
  searchPlaceholder = 'Search…',
  searchTags,
  onSearchTagsChange,
  searchSummary,
  searchFilterDefs,
  searchFilterValues,
  onSearchFilterChange,
  searchFilterTitle,
  className = '',
}: PageHeadingProps) {
  const hasBack = backHref || onBack;
  const iconBtnCls =
    'inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-500 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors focus:outline-none';
  const backLinkCls = `${iconBtnCls} -ml-2`;

  const BackIcon = hasBack ? (
    backHref ? (
      <a href={backHref} aria-label="Back" className={backLinkCls}>
        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
      </a>
    ) : (
      <button type="button" onClick={onBack} aria-label="Back" className={backLinkCls}>
        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
      </button>
    )
  ) : null;

  // 1 action → icon button; 2+ → overflow ⋮ menu
  const MobileTrailing =
    actionItems && actionItems.length > 0 ? (
      actionItems.length === 1 ? (
        (() => {
          const item = actionItems[0];
          return item.href ? (
            <a href={item.href} aria-label={item.label} className={iconBtnCls}>
              <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={item.onClick}
              aria-label={item.label}
              className={iconBtnCls}
            >
              <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
            </button>
          );
        })()
      ) : (
        <OverflowMenu items={actionItems} />
      )
    ) : null;

  const TabBar = ({ compact }: { compact?: boolean }) =>
    tabs && tabs.length > 0 ? (
      <div className={['flex gap-0 overflow-x-auto', compact ? '-mb-px' : 'mt-4 -mb-px'].join(' ')}>
        {tabs.map((tab) => {
          const isActive = tab.value === activeTab;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onTabChange?.(tab.value)}
              className={[
                'inline-flex items-center gap-2 px-1 py-3 mr-6 text-sm font-medium font-body border-b-2 whitespace-nowrap transition-colors',
                isActive
                  ? 'border-primary-500 text-ink-900 dark:text-ink-50'
                  : 'border-transparent text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-200 hover:border-ink-300 dark:hover:border-ink-600',
              ].join(' ')}
            >
              {tab.label}
              {tab.badge != null && (
                <span
                  className={[
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    isActive
                      ? 'bg-ink-100 dark:bg-ink-700 text-ink-900 dark:text-ink-50'
                      : 'bg-ink-100 dark:bg-ink-700 text-ink-600 dark:text-ink-300',
                  ].join(' ')}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    ) : null;

  const TitleBlock = ({ size }: { size: 'sm' | 'md' | 'lg' }) => (
    <div className="flex items-center gap-3">
      {avatar && size !== 'sm' && <div className="shrink-0">{avatar}</div>}
      <div className="min-w-0">
        <h1
          className={[
            'font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight leading-tight',
            size === 'sm' ? 'text-base' : '',
            size === 'md' ? 'text-[28px]' : '',
            size === 'lg' ? 'text-[34px]' : '',
          ].join(' ')}
        >
          {title}
        </h1>
        {description && (
          <p
            className={[
              'font-body text-ink-500 dark:text-ink-300',
              size === 'sm' ? 'mt-0 text-xs leading-tight' : 'mt-0.5 text-sm',
            ].join(' ')}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );

  const borderCls = bordered ? 'border-b border-ink-200 dark:border-ink-700' : '';

  // ── Master variants — unified search bar ─────────────────
  if (
    mobileVariant === 'master' ||
    mobileVariant === 'master-simple' ||
    mobileVariant === 'master-full'
  ) {
    const isFull = mobileVariant === 'master-full';

    /** Shared bar chrome — hamburger + search slot + actions */
    const MasterBar = ({ simple }: { simple: boolean }) => (
      <div className="flex items-center gap-3 px-3 py-2">
        {/* Hamburger */}
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className={`${iconBtnCls} sm:hidden shrink-0`}
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        )}

        {/* SearchSet — simple strips tags/summary/info */}
        <div className="flex-1 min-w-0 max-w-[180px] sm:max-w-none sm:flex-none sm:w-80 lg:w-96">
          <SearchSet
            value={searchValue}
            onChange={onSearchChange ?? (() => {})}
            placeholder={searchPlaceholder}
            loading={searchLoading}
            filterDefs={searchFilterDefs}
            filterValues={searchFilterValues}
            onFilterChange={onSearchFilterChange}
            filterTitle={searchFilterTitle}
            {...(!simple && {
              tags: searchTags,
              onTagsChange: onSearchTagsChange,
              summary: searchSummary,
            })}
          />
        </div>

        {/* Trailing actions */}
        {actions && <div className="ml-auto flex items-center gap-1 shrink-0">{actions}</div>}
      </div>
    );

    /** Desktop full bar: search+filter constrained, actions pinned right, summary+tags full-width below */
    const FullDesktopBar = () => (
      <div className="hidden sm:flex items-start gap-3 px-3 py-2">
        {/* SearchSet fills the row; input row is width-constrained via searchClassName */}
        <div className="flex-1 min-w-0">
          <SearchSet
            value={searchValue}
            onChange={onSearchChange ?? (() => {})}
            placeholder={searchPlaceholder}
            loading={searchLoading}
            filterDefs={searchFilterDefs}
            filterValues={searchFilterValues}
            onFilterChange={onSearchFilterChange}
            filterTitle={searchFilterTitle}
            tags={searchTags}
            onTagsChange={onSearchTagsChange}
            summary={searchSummary}
            searchClassName="w-80 lg:w-96"
          />
        </div>
        {/* Actions sit beside the input row (top-aligned, same height) */}
        {actions && <div className="shrink-0 flex items-center gap-1">{actions}</div>}
      </div>
    );

    return (
      <div
        className={[sticky ? 'sticky top-0 z-10 bg-inherit' : '', borderCls, className]
          .filter(Boolean)
          .join(' ')}
      >
        {isFull ? (
          <>
            {/* Mobile — simple search */}
            <div className="sm:hidden">
              <MasterBar simple />
            </div>
            {/* Desktop — two-row layout */}
            <FullDesktopBar />
          </>
        ) : (
          /* master / master-simple — always simple */
          <MasterBar simple />
        )}
      </div>
    );
  }

  // ── Standard variants ─────────────────────────────────────
  return (
    <div
      className={[sticky ? 'sticky top-0 z-10 bg-inherit' : '', borderCls, className]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Mobile ── */}
      <div className="sm:hidden">
        {/* small: single compact row with inline title */}
        {mobileVariant === 'small' && (
          <>
            <div className="flex items-center gap-2 h-14 px-1">
              {BackIcon ?? <div className="w-10 shrink-0" />}
              <div className="flex-1 min-w-0">
                <TitleBlock size="sm" />
              </div>
              <div className="flex items-center gap-1 shrink-0">{MobileTrailing}</div>
            </div>
            <TabBar compact />
          </>
        )}

        {/* medium: top bar + 28px title below */}
        {mobileVariant === 'medium' && (
          <>
            <div className="flex items-center justify-between h-14 px-1">
              <div>{BackIcon ?? <div className="w-10" />}</div>
              <div className="flex items-center gap-1">{MobileTrailing}</div>
            </div>
            <div className="px-1 pb-4">
              <TitleBlock size="md" />
            </div>
            {meta && <div className="px-1 pb-3 flex flex-wrap items-center gap-2">{meta}</div>}
            <TabBar compact />
          </>
        )}

        {/* large: top bar + 34px title below */}
        {mobileVariant === 'large' && (
          <>
            <div className="flex items-center justify-between h-14 px-1">
              <div>{BackIcon ?? <div className="w-10" />}</div>
              <div className="flex items-center gap-1">{MobileTrailing}</div>
            </div>
            <div className="px-1 pb-5">
              <TitleBlock size="lg" />
            </div>
            {meta && <div className="px-1 pb-3 flex flex-wrap items-center gap-2">{meta}</div>}
            <TabBar compact />
          </>
        )}
      </div>

      {/* ── Desktop ── */}
      <div className="hidden sm:block">
        {hasBack && (
          <div className="mb-3">
            {backHref ? (
              <a
                href={backHref}
                className="inline-flex items-center gap-1.5 text-sm font-body text-ink-500 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back
              </a>
            ) : (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-sm font-body text-ink-500 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back
              </button>
            )}
          </div>
        )}

        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-2">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {avatar && <div className="shrink-0">{avatar}</div>}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-300">
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {actionItems?.map((item, i) => (
              <DesktopActionButton key={i} item={item} />
            ))}
            {actions}
          </div>
        </div>

        {meta && <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>}

        <TabBar />
      </div>
    </div>
  );
}
