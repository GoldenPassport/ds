import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export type VerticalNavSize = 'sm' | 'md' | 'lg';
export type VerticalNavSpacing = 'none' | 'xs' | 'sm' | 'md';
export type VerticalNavRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type VerticalNavShadow = 'none' | 'sm' | 'md' | 'lg';

export interface VerticalNavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: VerticalNavItem[];
}

export interface VerticalNavGroup {
  /** Optional section heading */
  label?: string;
  items: VerticalNavItem[];
}

export interface VerticalNavProps {
  groups: VerticalNavGroup[];
  /** Show a left border accent on the active item (default: false) */
  activeIndicator?: boolean;
  /** Item size — controls padding and text size (default: 'md') */
  size?: VerticalNavSize;
  /** Gap between individual nav buttons (default: 'xs') */
  spacing?: VerticalNavSpacing;
  /** Border radius of each item button (default: 'lg') */
  radius?: VerticalNavRadius;
  /** Drop shadow on the nav wrapper (default: 'none') */
  shadow?: VerticalNavShadow;
  /** Show a border around the nav wrapper (default: false) */
  bordered?: boolean;
  /** Accessible label for the nav landmark. Override when multiple VerticalNavs appear on the same page. */
  'aria-label'?: string;
  className?: string;
}

// ── Style tokens (light + dark: variants) ─────────────────

const tokens = {
  item: 'border-transparent font-medium text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-700',
  itemActive:
    'border-primary-500 font-medium text-ink-700 dark:text-ink-100 bg-ink-100 dark:bg-ink-700',
  icon: 'text-ink-500 dark:text-ink-300',
  iconActive: 'text-primary-500 dark:text-primary-400',
  badge: 'bg-ink-100 dark:bg-ink-700 text-ink-500 dark:text-ink-300',
  groupLabel: 'text-ink-500 dark:text-ink-300',
  childItem:
    'font-medium text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-700',
  childActive: 'font-medium text-ink-700 dark:text-ink-100 bg-ink-100 dark:bg-ink-700',
  chevron: 'text-ink-500 dark:text-ink-300',
  childBorder: 'border-ink-200 dark:border-ink-700',
  navBorder: 'border-ink-200 dark:border-ink-700',
};

// ── Size tokens ────────────────────────────────────────────

interface SizeConfig {
  text: string;
  px: string;
  pyTop: string;
  pyChild: string;
  iconSz: string;
  itemGap: string;
}

const sizeTokens: Record<VerticalNavSize, SizeConfig> = {
  sm: {
    text: 'text-xs',
    px: 'px-2.5',
    pyTop: 'py-1.5',
    pyChild: 'py-1',
    iconSz: 'w-4 h-4',
    itemGap: 'gap-2',
  },
  md: {
    text: 'text-sm',
    px: 'px-3',
    pyTop: 'py-2',
    pyChild: 'py-1.5',
    iconSz: 'w-5 h-5',
    itemGap: 'gap-3',
  },
  lg: {
    text: 'text-base',
    px: 'px-4',
    pyTop: 'py-2.5',
    pyChild: 'py-2',
    iconSz: 'w-5 h-5',
    itemGap: 'gap-3',
  },
};

// ── Spacing, radius, shadow maps ──────────────────────────

const spacingCls: Record<VerticalNavSpacing, string> = {
  none: 'gap-0',
  xs: 'gap-0.5',
  sm: 'gap-1',
  md: 'gap-2',
};

const radiusCls: Record<VerticalNavRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
};

const shadowCls: Record<VerticalNavShadow, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-lg',
};

// ── Badge ──────────────────────────────────────────────────

function NavBadge({ value }: { value: string | number }) {
  return (
    <span
      className={`ml-auto shrink-0 min-w-5 px-1.5 py-0.5 text-xs font-medium font-body rounded-full text-center ${tokens.badge}`}
    >
      {value}
    </span>
  );
}

// ── NavItem ────────────────────────────────────────────────

function NavItem({
  item,
  sz,
  radius,
  spacing,
  depth = 0,
  activeIndicator = false,
}: {
  item: VerticalNavItem;
  sz: SizeConfig;
  radius: string;
  spacing: string;
  depth?: number;
  activeIndicator?: boolean;
}) {
  const [open, setOpen] = useState(() => item.children?.some((c) => c.active) ?? false);
  const hasChildren = item.children && item.children.length > 0;

  const baseCls = [
    `group flex items-center ${sz.itemGap} w-full ${sz.text} font-body transition-colors text-left`,
    radius,
    depth === 0
      ? `${sz.px} ${sz.pyTop}${activeIndicator ? ' border-l-2' : ''}`
      : `${sz.px} ${sz.pyChild}`,
    item.active
      ? depth === 0
        ? tokens.itemActive
        : tokens.childActive
      : depth === 0
        ? tokens.item
        : tokens.childItem,
  ].join(' ');

  const inner = (
    <>
      {item.icon && depth === 0 && (
        <span
          className={`shrink-0 ${sz.iconSz} ${item.active ? tokens.iconActive : tokens.icon}`}
          aria-hidden="true"
        >
          {item.icon}
        </span>
      )}
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge !== undefined && !hasChildren && <NavBadge value={item.badge} />}
      {hasChildren && (
        <ChevronRight
          className={`shrink-0 w-4 h-4 transition-transform duration-200 ${tokens.chevron} ${open ? 'rotate-90' : ''}`}
          aria-hidden="true"
        />
      )}
    </>
  );

  const trigger = hasChildren ? (
    <button
      type="button"
      className={baseCls}
      aria-expanded={open}
      onClick={() => setOpen((o) => !o)}
    >
      {inner}
    </button>
  ) : item.href ? (
    <a href={item.href} className={baseCls}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={item.onClick} className={baseCls}>
      {inner}
    </button>
  );

  return (
    <li>
      {trigger}
      {hasChildren && open && (
        <ul className={`mt-1 ml-4 pl-3 border-l ${tokens.childBorder} flex flex-col ${spacing}`}>
          {item.children!.map((child, i) => (
            <NavItem
              key={i}
              item={child}
              sz={sz}
              radius={radius}
              spacing={spacing}
              depth={depth + 1}
              activeIndicator={activeIndicator}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// ── VerticalNav ────────────────────────────────────────────

export function VerticalNav({
  groups,
  activeIndicator = false,
  size = 'md',
  spacing = 'xs',
  radius = 'lg',
  shadow = 'none',
  bordered = false,
  'aria-label': navAriaLabel = 'Sidebar navigation',
  className = '',
}: VerticalNavProps) {
  const sz = sizeTokens[size];
  const rCls = radiusCls[radius];
  const sCls = spacingCls[spacing];
  const shCls = shadowCls[shadow];

  return (
    <nav
      className={[
        'flex flex-col gap-6',
        shCls,
        bordered ? `border ${tokens.navBorder} rounded-xl p-2` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={navAriaLabel}
    >
      {groups.map((group, gi) => (
        <div key={gi}>
          {group.label && (
            <p
              className={`mb-1 px-3 text-xs font-semibold font-body uppercase tracking-wider ${tokens.groupLabel}`}
            >
              {group.label}
            </p>
          )}
          <ul className={`flex flex-col ${sCls}`}>
            {group.items.map((item, ii) => (
              <NavItem
                key={ii}
                item={item}
                sz={sz}
                radius={rCls}
                spacing={sCls}
                activeIndicator={activeIndicator}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
