import React, { useState } from 'react';
import { ChevronRight, ChevronUp, LogOut, Settings } from 'lucide-react';
import { Menu as HLMenu, Transition } from '@headlessui/react';
import { Avatar } from './Avatar';
import type { VerticalNavGroup, VerticalNavItem } from './VerticalNav';

export type { VerticalNavGroup, VerticalNavItem };

// ── Types ─────────────────────────────────────────────────

export type SidebarNavAppearance = 'light' | 'dark';

export interface SidebarNavUser {
  name:       string;
  email?:     string;
  avatarUrl?: string;
  menuItems?: { label: string; href?: string; onClick?: () => void; dividerAbove?: boolean }[];
}

export interface SidebarNavProps {
  /** Logo / brand slot at the top */
  logo?:       React.ReactNode;
  groups:      VerticalNavGroup[];
  user?:       SidebarNavUser;
  /** Arbitrary content pinned above the user section */
  footer?:     React.ReactNode;
  appearance?: SidebarNavAppearance;
  /** Render as a rounded card panel rather than a flush edge sidebar */
  rounded?:         boolean;
  /** Show a left-border active indicator on nav items — default `false` */
  activeIndicator?: boolean;
  className?:       string;
}

// ── Style tokens ───────────────────────────────────────────

interface Tokens {
  sidebar:      string;
  border:       string;
  item:         string;
  itemActive:   string;
  icon:         string;
  iconActive:   string;
  badge:        string;
  groupLabel:   string;
  childItem:    string;
  childActive:  string;
  chevron:      string;
  childBorder:  string;
  userName:     string;
  userEmail:    string;
  userBtn:      string;
  dropdownBg:   string;
  dropdownDivider: string;
  dropdownItem: string;
  dropdownItemHover: string;
}

const tokens: Record<SidebarNavAppearance, Tokens> = {
  light: {
    sidebar:     'bg-ink-50 dark:bg-ink-800',
    border:      'border-ink-200 dark:border-ink-700',
    item:        'border-transparent font-medium text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-700',
    itemActive:  'border-primary-500 font-medium text-ink-700 dark:text-ink-100 bg-ink-100 dark:bg-ink-700',
    icon:        'text-ink-500 dark:text-ink-300',
    iconActive:  'text-primary-800',
    badge:       'bg-ink-100 dark:bg-ink-700 text-ink-500 dark:text-ink-300',
    groupLabel:  'text-ink-500 dark:text-ink-300',
    childItem:   'font-medium text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-700',
    childActive: 'font-medium text-ink-700 dark:text-ink-100 bg-ink-100 dark:bg-ink-700',
    chevron:     'text-ink-500 dark:text-ink-300',
    childBorder: 'border-ink-200 dark:border-ink-700',
    userName:    'text-ink-900 dark:text-white',
    userEmail:   'text-ink-500 dark:text-ink-300',
    userBtn:     'hover:bg-ink-100 dark:hover:bg-ink-700',
    dropdownBg:  'bg-white dark:bg-ink-800 border-ink-200 dark:border-ink-700 shadow-md',
    dropdownDivider: 'border-ink-100 dark:border-ink-700',
    dropdownItem: 'text-ink-700 dark:text-ink-200',
    dropdownItemHover: 'bg-ink-50 dark:bg-ink-700',
  },
  dark: {
    sidebar:     'bg-ink-900',
    border:      'border-ink-700',
    item:        'font-medium text-ink-300 hover:text-white hover:bg-ink-800',
    itemActive:  'font-medium text-primary-400 bg-ink-800',
    icon:        'text-ink-500 group-hover:text-ink-200',
    iconActive:  'text-primary-400',
    badge:       'bg-ink-800 text-ink-300',
    groupLabel:  'text-ink-500',
    childItem:   'font-medium text-ink-300 hover:text-white hover:bg-ink-800',
    childActive: 'font-medium text-primary-400 bg-ink-800',
    chevron:     'text-ink-500',
    childBorder: 'border-ink-700',
    userName:    'text-white',
    userEmail:   'text-ink-300',
    userBtn:     'hover:bg-ink-800',
    dropdownBg:  'bg-ink-800 border-ink-700 shadow-dark-md',
    dropdownDivider: 'border-ink-700',
    dropdownItem: 'text-ink-200',
    dropdownItemHover: 'bg-ink-700',
  },
};

// ── NavBadge ───────────────────────────────────────────────

function NavBadge({ value, t }: { value: string | number; t: Tokens }) {
  return (
    <span className={`ml-auto shrink-0 min-w-5 px-1.5 py-0.5 text-xs font-medium font-body rounded-full text-center ${t.badge}`}>
      {value}
    </span>
  );
}

// ── NavItem ────────────────────────────────────────────────

function NavItem({
  item,
  t,
  depth            = 0,
  activeIndicator  = false,
}: {
  item:             VerticalNavItem;
  t:                Tokens;
  depth?:           number;
  activeIndicator?: boolean;
}) {
  const [open, setOpen] = useState(() => item.children?.some(c => c.active) ?? false);
  const hasChildren = item.children && item.children.length > 0;

  const baseCls = [
    'group flex items-center gap-3 w-full rounded-xl text-sm font-body transition-colors text-left',
    // border-l-2 is only added when the active indicator is enabled;
    // the border-primary-500 / border-transparent tokens are inert without it
    depth === 0 ? `px-3 py-2${activeIndicator ? ' border-l-2' : ''}` : 'px-3 py-1.5',
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
      {depth > 0 && (
        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-current opacity-40 ml-1" aria-hidden="true" />
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
            <NavItem key={i} item={child} t={t} depth={depth + 1} activeIndicator={activeIndicator} />
          ))}
        </ul>
      )}
    </li>
  );
}

// ── UserSection ────────────────────────────────────────────

function UserSection({ user, t }: { user: SidebarNavUser; t: Tokens }) {
  return (
    <HLMenu as="div" className="relative">
      <HLMenu.Button
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors focus:outline-none ${t.userBtn}`}
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
        ) : (
          <Avatar name={user.name} size={32} />
        )}
        <div className="flex-1 min-w-0 text-left">
          <p className={`text-sm font-semibold font-body truncate ${t.userName}`}>{user.name}</p>
          {user.email && <p className={`text-xs font-body truncate ${t.userEmail}`}>{user.email}</p>}
        </div>
        <ChevronUp className={`shrink-0 w-4 h-4 ${t.chevron}`} aria-hidden="true" />
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
        <HLMenu.Items
          className={`absolute bottom-full left-0 right-0 mb-1 z-50 rounded-xl border overflow-hidden focus:outline-none ${t.dropdownBg}`}
        >
          {/* Header */}
          <div className={`px-4 py-3 border-b ${t.dropdownDivider}`}>
            <p className={`text-xs font-semibold font-body truncate ${t.userName}`}>{user.name}</p>
            {user.email && <p className={`text-xs font-body truncate ${t.userEmail}`}>{user.email}</p>}
          </div>

          <div className="py-1">
            {/* Custom menu items */}
            {user.menuItems?.map((mi, i) => (
              <React.Fragment key={i}>
                {mi.dividerAbove && <div className={`my-1 border-t ${t.dropdownDivider}`} />}
                <HLMenu.Item>
                  {({ active }) => {
                    const cls = `flex w-full items-center px-4 py-2 text-sm font-body text-left transition-colors ${t.dropdownItem} ${active ? t.dropdownItemHover : ''}`;
                    return mi.href ? (
                      <a href={mi.href} className={cls}>{mi.label}</a>
                    ) : (
                      <button type="button" onClick={mi.onClick} className={cls}>{mi.label}</button>
                    );
                  }}
                </HLMenu.Item>
              </React.Fragment>
            ))}

            {/* Default items if no custom ones */}
            {!user.menuItems?.length && (
              <>
                <HLMenu.Item>
                  {({ active }) => (
                    <button type="button" className={`flex w-full items-center gap-2.5 px-4 py-2 text-sm font-body ${t.dropdownItem} ${active ? t.dropdownItemHover : ''}`}>
                      <Settings className="w-4 h-4 opacity-50" aria-hidden="true" />
                      Settings
                    </button>
                  )}
                </HLMenu.Item>
                <HLMenu.Item>
                  {({ active }) => (
                    <button type="button" className={`flex w-full items-center gap-2.5 px-4 py-2 text-sm font-body ${t.dropdownItem} ${active ? t.dropdownItemHover : ''}`}>
                      <LogOut className="w-4 h-4 opacity-50" aria-hidden="true" />
                      Sign out
                    </button>
                  )}
                </HLMenu.Item>
              </>
            )}
          </div>
        </HLMenu.Items>
      </Transition>
    </HLMenu>
  );
}

// ── SidebarNav ─────────────────────────────────────────────

export function SidebarNav({
  logo,
  groups,
  user,
  footer,
  appearance       = 'light',
  rounded          = false,
  activeIndicator  = false,
  className        = '',
}: SidebarNavProps) {
  const t = tokens[appearance];

  return (
    <aside
      className={[
        'flex flex-col h-full border',
        rounded ? 'rounded-2xl overflow-hidden shadow-sm' : 'border-0 border-r',
        t.sidebar,
        t.border,
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Logo */}
      {logo && (
        <div className="shrink-0 flex items-center h-16 px-4">
          {logo}
        </div>
      )}

      {/* Scrollable nav */}
      <nav
        className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6"
        aria-label="Sidebar navigation"
      >
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className={`mb-1 px-3 text-xs font-semibold font-body uppercase tracking-wider ${t.groupLabel}`}>
                {group.label}
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item, ii) => (
                <NavItem key={ii} item={item} t={t} activeIndicator={activeIndicator} />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer slot */}
      {footer && (
        <div className={`shrink-0 px-3 py-3 border-t ${t.border}`}>
          {footer}
        </div>
      )}

      {/* User section */}
      {user && (
        <div className={`shrink-0 px-3 py-3 border-t ${t.border}`}>
          <UserSection user={user} t={t} />
        </div>
      )}
    </aside>
  );
}
