import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export type VerticalNavAppearance = 'default' | 'gray' | 'dark';

export interface VerticalNavItem {
  label:     string;
  href?:     string;
  onClick?:  () => void;
  active?:   boolean;
  icon?:     React.ReactNode;
  badge?:    string | number;
  children?: VerticalNavItem[];
}

export interface VerticalNavGroup {
  /** Optional section heading */
  label?: string;
  items:  VerticalNavItem[];
}

export interface VerticalNavProps {
  groups:      VerticalNavGroup[];
  appearance?: VerticalNavAppearance;
  className?:  string;
}

// ── Style tokens ───────────────────────────────────────────

interface Tokens {
  item:        string;
  itemActive:  string;
  icon:        string;
  iconActive:  string;
  badge:       string;
  groupLabel:  string;
  childItem:   string;
  childActive: string;
  chevron:     string;
  childBorder: string;
}

const tokens: Record<VerticalNavAppearance, Tokens> = {
  default: {
    item:        'font-medium text-ink-600 dark:text-ink-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-ink-700/40',
    itemActive:  'font-semibold text-primary-600 bg-primary-50 dark:bg-ink-700/40',
    icon:        'text-ink-400 group-hover:text-primary-600',
    iconActive:  'text-primary-600',
    badge:       'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300',
    groupLabel:  'text-ink-400',
    childItem:   'font-medium text-ink-500 dark:text-ink-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-ink-700/40',
    childActive: 'font-semibold text-primary-600 bg-primary-50 dark:bg-ink-700/40',
    chevron:     'text-ink-400',
    childBorder: 'border-ink-200 dark:border-ink-700',
  },
  gray: {
    item:        'font-medium text-ink-600 hover:text-primary-600 hover:bg-ink-200',
    itemActive:  'font-semibold text-primary-600 bg-ink-200',
    icon:        'text-ink-400 group-hover:text-primary-600',
    iconActive:  'text-primary-600',
    badge:       'bg-ink-200 text-ink-600',
    groupLabel:  'text-ink-400',
    childItem:   'font-medium text-ink-500 hover:text-primary-600 hover:bg-ink-200',
    childActive: 'font-semibold text-primary-600 bg-ink-200',
    chevron:     'text-ink-400',
    childBorder: 'border-ink-300',
  },
  dark: {
    item:        'font-medium text-ink-400 hover:text-white hover:bg-ink-800',
    itemActive:  'font-semibold text-primary-400 bg-ink-800',
    icon:        'text-ink-500 group-hover:text-ink-200',
    iconActive:  'text-primary-400',
    badge:       'bg-ink-800 text-ink-300',
    groupLabel:  'text-ink-500',
    childItem:   'font-medium text-ink-400 hover:text-white hover:bg-ink-800',
    childActive: 'font-semibold text-primary-400 bg-ink-800',
    chevron:     'text-ink-500',
    childBorder: 'border-ink-700',
  },
};

// ── Badge ──────────────────────────────────────────────────

function NavBadge({ value, t }: { value: string | number; t: Tokens }) {
  return (
    <span className={`ml-auto shrink-0 min-w-[1.25rem] px-1.5 py-0.5 text-xs font-medium font-body rounded-full text-center ${t.badge}`}>
      {value}
    </span>
  );
}

// ── NavItem ────────────────────────────────────────────────

function NavItem({ item, t, depth = 0 }: { item: VerticalNavItem; t: Tokens; depth?: number }) {
  const [open, setOpen] = useState(() => item.children?.some(c => c.active) ?? false);
  const hasChildren = item.children && item.children.length > 0;

  const baseCls = [
    'group flex items-center gap-3 w-full rounded-lg text-sm font-body transition-colors text-left',
    depth === 0 ? 'px-3 py-2' : 'px-3 py-1.5',
    item.active
      ? (depth === 0 ? t.itemActive : t.childActive)
      : (depth === 0 ? t.item       : t.childItem),
  ].join(' ');

  const inner = (
    <>
      {item.icon && depth === 0 && (
        <span className={`shrink-0 w-5 h-5 ${item.active ? t.iconActive : t.icon}`} aria-hidden="true">
          {item.icon}
        </span>
      )}
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge !== undefined && !hasChildren && <NavBadge value={item.badge} t={t} />}
      {hasChildren && (
        <ChevronRight
          className={`shrink-0 w-4 h-4 transition-transform duration-200 ${t.chevron} ${open ? 'rotate-90' : ''}`}
          aria-hidden="true"
        />
      )}
    </>
  );

  const trigger = hasChildren ? (
    <button type="button" className={baseCls} aria-expanded={open} onClick={() => setOpen(o => !o)}>
      {inner}
    </button>
  ) : item.href ? (
    <a href={item.href} className={baseCls}>{inner}</a>
  ) : (
    <button type="button" onClick={item.onClick} className={baseCls}>{inner}</button>
  );

  return (
    <li>
      {trigger}
      {hasChildren && open && (
        <ul className={`mt-1 ml-4 pl-3 border-l ${t.childBorder} flex flex-col gap-0.5`}>
          {item.children!.map((child, i) => (
            <NavItem key={i} item={child} t={t} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

// ── VerticalNav ────────────────────────────────────────────

export function VerticalNav({
  groups,
  appearance = 'default',
  className  = '',
}: VerticalNavProps) {
  const t = tokens[appearance];

  return (
    <nav className={`flex flex-col gap-6 ${className}`} aria-label="Sidebar navigation">
      {groups.map((group, gi) => (
        <div key={gi}>
          {group.label && (
            <p className={`mb-1 px-3 text-xs font-semibold font-body uppercase tracking-wider ${t.groupLabel}`}>
              {group.label}
            </p>
          )}
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item, ii) => (
              <NavItem key={ii} item={item} t={t} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
