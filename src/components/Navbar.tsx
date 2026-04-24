import React, { useState } from 'react';
import { Menu as HLMenu, Transition } from '@headlessui/react';
import { Search, Menu as MenuIcon, X, MoreVertical, UserCircle } from 'lucide-react';
import { Avatar } from './Avatar';

// ── Types ─────────────────────────────────────────────────

export type NavbarAppearance = 'light' | 'dark';

export interface NavbarItem {
  label:    string;
  href?:    string;
  onClick?: () => void;
  active?:  boolean;
  icon?:    React.ReactNode;
}

export interface NavbarUserItem {
  label:         string;
  href?:         string;
  onClick?:      () => void;
  dividerAbove?: boolean;
}

export interface NavbarUser {
  name?:      string;
  email?:     string;
  avatarUrl?: string;
  menuItems?: NavbarUserItem[];
}

export interface NavbarProps {
  logo?:              React.ReactNode;
  items?:             NavbarItem[];
  user?:              NavbarUser;
  /** Show a search input in the right section */
  search?:            boolean;
  onSearch?:          (query: string) => void;
  searchPlaceholder?: string;
  /** Arbitrary right-side content (icon buttons, quick actions, etc.) */
  actions?:           React.ReactNode;
  /** Three-dot overflow menu items */
  moreMenu?:          NavbarUserItem[];
  appearance?:        NavbarAppearance;
  /** Bottom border */
  bordered?:          boolean;
  className?:         string;
}

// ── Style tokens ───────────────────────────────────────────

interface Tokens {
  nav:              string;
  border:           string;
  link:             string;
  linkActive:       string;
  searchWrap:       string;
  searchInput:      string;
  searchIcon:       string;
  iconBtn:          string;
  mobileMenu:       string;
  mobileLink:       string;
  mobileLinkActive: string;
  userName:         string;
  userEmail:        string;
  userBtn:          string;
  dropdownBg:       string;
  dropdownDivider:  string;
  dropdownItemBase: string;
  dropdownItemHover:string;
}

const tokens: Record<NavbarAppearance, Tokens> = {
  light: {
    nav:               'bg-white',
    border:            'border-ink-200',
    link:              'text-ink-600 hover:text-ink-900 hover:bg-ink-50',
    linkActive:        'text-ink-900 bg-ink-100',
    searchWrap:        'bg-ink-50 border-ink-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/25',
    searchInput:       'text-ink-900 placeholder:text-ink-400',
    searchIcon:        'text-ink-400',
    iconBtn:           'text-ink-500 hover:text-ink-700 hover:bg-ink-100',
    mobileMenu:        'bg-white border-t border-ink-200',
    mobileLink:        'text-ink-600 hover:text-ink-900 hover:bg-ink-50',
    mobileLinkActive:  'text-ink-900 bg-ink-100',
    userName:          'text-ink-900',
    userEmail:         'text-ink-500',
    userBtn:           'hover:bg-ink-50',
    dropdownBg:        'bg-white border-ink-200 shadow-md',
    dropdownDivider:   'border-ink-100',
    dropdownItemBase:  'text-ink-700',
    dropdownItemHover: 'bg-ink-50',
  },
  dark: {
    nav:               'bg-ink-900',
    border:            'border-ink-700',
    link:              'text-ink-300 hover:text-white hover:bg-ink-800',
    linkActive:        'text-white bg-ink-800',
    searchWrap:        'bg-ink-800 border-ink-700 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/25',
    searchInput:       'text-white placeholder:text-ink-500',
    searchIcon:        'text-ink-500',
    iconBtn:           'text-ink-400 hover:text-ink-100 hover:bg-ink-800',
    mobileMenu:        'bg-ink-900 border-t border-ink-700',
    mobileLink:        'text-ink-300 hover:text-white hover:bg-ink-800',
    mobileLinkActive:  'text-white bg-ink-800',
    userName:          'text-white',
    userEmail:         'text-ink-400',
    userBtn:           'hover:bg-ink-800',
    dropdownBg:        'bg-ink-800 border-ink-700 shadow-dark-md',
    dropdownDivider:   'border-ink-700',
    dropdownItemBase:  'text-ink-200',
    dropdownItemHover: 'bg-ink-700',
  },
};

// ── NavLink ────────────────────────────────────────────────

function NavLink({ item, t }: { item: NavbarItem; t: Tokens }) {
  const base = 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium font-body transition-colors';
  const cls  = item.active ? `${base} ${t.linkActive}` : `${base} ${t.link}`;
  return item.href ? (
    <a href={item.href} className={cls}>
      {item.icon && <span className="shrink-0" aria-hidden="true">{item.icon}</span>}
      {item.label}
    </a>
  ) : (
    <button type="button" onClick={item.onClick} className={cls}>
      {item.icon && <span className="shrink-0" aria-hidden="true">{item.icon}</span>}
      {item.label}
    </button>
  );
}

// ── UserMenu ───────────────────────────────────────────────

function UserMenu({ user, t }: { user: NavbarUser; t: Tokens }) {
  return (
    <HLMenu as="div" className="relative">
      <HLMenu.Button
        className={`flex items-center gap-2.5 rounded-xl p-1.5 transition-colors focus:outline-none ${t.userBtn}`}
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name ?? 'User'} className="w-8 h-8 rounded-full object-cover" />
        ) : user.name ? (
          <Avatar name={user.name} size={32} />
        ) : (
          <UserCircle className={`w-8 h-8 ${t.iconBtn}`} aria-hidden="true" />
        )}
        {user.name && (
          <span className={`hidden lg:block text-sm font-medium font-body ${t.userName}`}>
            {user.name}
          </span>
        )}
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
          className={`absolute right-0 z-50 mt-1.5 w-56 rounded-xl border overflow-hidden focus:outline-none ${t.dropdownBg}`}
        >
          {(user.name || user.email) && (
            <div className={`px-4 py-3 border-b ${t.dropdownDivider}`}>
              {user.name && <p className={`text-xs font-semibold font-body truncate ${t.userName}`}>{user.name}</p>}
              {user.email && <p className={`text-xs font-body truncate ${t.userEmail}`}>{user.email}</p>}
            </div>
          )}

          {user.menuItems && user.menuItems.length > 0 && (
            <div className="py-1">
              {user.menuItems.map((mi, i) => (
                <React.Fragment key={i}>
                  {mi.dividerAbove && <div className={`my-1 border-t ${t.dropdownDivider}`} />}
                  <HLMenu.Item>
                    {({ active }) => {
                      const cls = `flex w-full items-center px-4 py-2 text-sm font-body text-left transition-colors ${t.dropdownItemBase} ${active ? t.dropdownItemHover : ''}`;
                      return mi.href ? (
                        <a href={mi.href} className={cls}>{mi.label}</a>
                      ) : (
                        <button type="button" onClick={mi.onClick} className={cls}>{mi.label}</button>
                      );
                    }}
                  </HLMenu.Item>
                </React.Fragment>
              ))}
            </div>
          )}
        </HLMenu.Items>
      </Transition>
    </HLMenu>
  );
}

// ── SearchBox ──────────────────────────────────────────────

function SearchBox({ t, placeholder, onSearch, className = '' }: {
  t: Tokens; placeholder: string; onSearch?: (q: string) => void; className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 h-9 px-3 rounded-lg border transition-all ${t.searchWrap} ${className}`}>
      <Search className={`w-4 h-4 shrink-0 ${t.searchIcon}`} aria-hidden="true" />
      <input
        type="search"
        placeholder={placeholder}
        onChange={e => onSearch?.(e.target.value)}
        className={`flex-1 text-sm font-body bg-transparent outline-none min-w-0 ${t.searchInput}`}
      />
    </div>
  );
}

// ── MoreMenu ───────────────────────────────────────────────

function MoreMenu({ items, t }: { items: NavbarUserItem[]; t: Tokens }) {
  return (
    <HLMenu as="div" className="relative">
      <HLMenu.Button
        className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors focus:outline-none ${t.iconBtn}`}
        aria-label="More options"
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
        <HLMenu.Items
          className={`absolute right-0 z-50 mt-1.5 w-48 rounded-xl border overflow-hidden focus:outline-none ${t.dropdownBg}`}
        >
          <div className="py-1">
            {items.map((mi, i) => (
              <React.Fragment key={i}>
                {mi.dividerAbove && <div className={`my-1 border-t ${t.dropdownDivider}`} />}
                <HLMenu.Item>
                  {({ active }) => {
                    const cls = `flex w-full items-center px-4 py-2 text-sm font-body text-left transition-colors ${t.dropdownItemBase} ${active ? t.dropdownItemHover : ''}`;
                    return mi.href ? (
                      <a href={mi.href} className={cls}>{mi.label}</a>
                    ) : (
                      <button type="button" onClick={mi.onClick} className={cls}>{mi.label}</button>
                    );
                  }}
                </HLMenu.Item>
              </React.Fragment>
            ))}
          </div>
        </HLMenu.Items>
      </Transition>
    </HLMenu>
  );
}

// ── Navbar ─────────────────────────────────────────────────

export function Navbar({
  logo,
  items             = [],
  user,
  search            = false,
  onSearch,
  searchPlaceholder = 'Search…',
  actions,
  moreMenu,
  appearance        = 'light',
  bordered          = true,
  className         = '',
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = tokens[appearance];

  return (
    <nav className={[t.nav, bordered ? `border-b ${t.border}` : '', className].filter(Boolean).join(' ')}>
      <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Left: burger + logo + desktop nav */}
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(o => !o)}
              className={`lg:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors shrink-0 ${t.iconBtn}`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>

            {logo && <div className="shrink-0">{logo}</div>}

            {items.length > 0 && (
              <div className="hidden lg:flex items-center gap-1">
                {items.map((item, i) => <NavLink key={i} item={item} t={t} />)}
              </div>
            )}
          </div>

          {/* Right: search + actions + user */}
          <div className="flex items-center gap-2 shrink-0">
            {search && (
              <SearchBox
                t={t}
                placeholder={searchPlaceholder}
                onSearch={onSearch}
                className="hidden sm:flex w-48 xl:w-64"
              />
            )}
            {actions && <div className="flex items-center gap-1">{actions}</div>}
            {moreMenu && moreMenu.length > 0 && <MoreMenu items={moreMenu} t={t} />}
            {user && <UserMenu user={user} t={t} />}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        show={mobileOpen}
        as={React.Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-2"
      >
        <div className={`lg:hidden ${t.mobileMenu}`}>
          <div className="mx-auto max-w-[80rem] px-4 sm:px-6 py-3 flex flex-col gap-1">
            {search && (
              <SearchBox
                t={t}
                placeholder={searchPlaceholder}
                onSearch={onSearch}
                className="mb-2"
              />
            )}

            {items.map((item, i) => {
              const base = 'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium font-body transition-colors text-left';
              const cls  = item.active ? `${base} ${t.mobileLinkActive}` : `${base} ${t.mobileLink}`;
              return item.href ? (
                <a key={i} href={item.href} className={cls} onClick={() => setMobileOpen(false)}>
                  {item.icon && <span aria-hidden="true">{item.icon}</span>}
                  {item.label}
                </a>
              ) : (
                <button key={i} type="button" onClick={() => { item.onClick?.(); setMobileOpen(false); }} className={cls}>
                  {item.icon && <span aria-hidden="true">{item.icon}</span>}
                  {item.label}
                </button>
              );
            })}

            {user && (
              <div className={`mt-2 pt-3 border-t ${t.dropdownDivider}`}>
                {(user.name || user.email || user.avatarUrl) && (
                  <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name ?? 'User'} className="w-9 h-9 rounded-full object-cover shrink-0" />
                    ) : user.name ? (
                      <Avatar name={user.name} size={36} />
                    ) : (
                      <UserCircle className={`w-9 h-9 shrink-0 ${t.iconBtn}`} aria-hidden="true" />
                    )}
                    <div className="min-w-0">
                      {user.name && <p className={`text-sm font-semibold font-body truncate ${t.userName}`}>{user.name}</p>}
                      {user.email && <p className={`text-xs font-body truncate ${t.userEmail}`}>{user.email}</p>}
                    </div>
                  </div>
                )}
                {user.menuItems?.map((mi, i) => (
                  <React.Fragment key={i}>
                    {mi.dividerAbove && <div className={`my-1 border-t ${t.dropdownDivider}`} />}
                    {mi.href ? (
                      <a href={mi.href} className={`flex w-full items-center px-3 py-2 text-sm font-body rounded-xl transition-colors ${t.mobileLink}`}>
                        {mi.label}
                      </a>
                    ) : (
                      <button type="button" onClick={mi.onClick} className={`flex w-full items-center px-3 py-2 text-sm font-body rounded-xl transition-colors text-left ${t.mobileLink}`}>
                        {mi.label}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </Transition>
    </nav>
  );
}
