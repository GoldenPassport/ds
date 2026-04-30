/**
 * Menu — wraps Headless UI v2 Menu (dropdown action menu)
 * Use for ⋯ action menus, context menus, user menus.
 *
 * Usage:
 *   <Menu trigger={<button>⋯</button>} items={[
 *     { label: 'Edit',   onClick: () => {} },
 *     { label: 'Delete', onClick: () => {}, destructive: true },
 *   ]} />
 */
import React from 'react';
import { Menu as HLMenu, MenuButton, MenuItems, MenuItem as HLMenuItem } from '@headlessui/react';

export interface MenuItem {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  dividerAbove?: boolean;
}

export interface MenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: 'left' | 'right';
  ariaLabel?: string;
  className?: string;
}

export function Menu({ trigger, items, align = 'right', ariaLabel, className = '' }: MenuProps) {
  return (
    <HLMenu as="div" className={`relative inline-block text-left ${className}`}>
      <MenuButton as={React.Fragment}>
        {React.isValidElement(trigger)
          ? React.cloneElement(
              trigger as React.ReactElement<Record<string, unknown>>,
              ariaLabel ? { 'aria-label': ariaLabel } : {},
            )
          : trigger}
      </MenuButton>

      <MenuItems
        transition
        className={[
          'absolute z-50 mt-1.5 w-52 rounded-xl overflow-hidden',
          'bg-white dark:bg-ink-800 shadow-lg',
          'border border-ink-200 dark:border-ink-700',
          'focus:outline-none py-1',
          align === 'right' ? 'right-0' : 'left-0',
          // v2 transition via data attributes
          'transition',
          'data-closed:translate-y-1 data-closed:opacity-0',
          'data-enter:duration-150 data-enter:ease-out',
          'data-leave:duration-100 data-leave:ease-in',
        ].join(' ')}
      >
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {item.dividerAbove && (
              <div className="my-1 border-t border-ink-100 dark:border-ink-700" />
            )}
            <HLMenuItem disabled={item.disabled}>
              {({ focus, disabled: dis }) => {
                const cls = [
                  'flex items-center gap-2.5 w-full px-3.5 py-2 text-sm font-body text-left transition-colors duration-75',
                  focus && !item.destructive ? 'bg-ink-50 dark:bg-ink-700' : '',
                  focus && item.destructive ? 'bg-red-50 dark:bg-red-900/20' : '',
                  item.destructive
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-ink-900 dark:text-ink-50',
                  dis ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                ].join(' ');

                return item.href ? (
                  <a href={item.href} className={cls}>
                    {item.icon && (
                      <span className="shrink-0 text-current opacity-70" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </a>
                ) : (
                  <button onClick={item.onClick} className={cls}>
                    {item.icon && (
                      <span className="shrink-0 text-current opacity-70" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </button>
                );
              }}
            </HLMenuItem>
          </React.Fragment>
        ))}
      </MenuItems>
    </HLMenu>
  );
}
