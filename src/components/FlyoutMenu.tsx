/**
 * FlyoutMenu — rich navigation flyout backed by Headless UI Popover.
 *
 * Variants:
 *  - `simple`       — plain list of links
 *  - `descriptions` — each item has a supporting description line
 *  - `icons`        — icon square + title + description (most common for nav)
 *  - `two-column`   — same as `icons` but laid out in a 2-column grid
 *
 * Optional footer:
 *  - `footerActions` — CTA-style button(s) across the bottom
 *  - `footerLinks`   — lighter text links across the bottom
 *
 * Usage:
 *   <FlyoutMenu
 *     trigger={<button>Solutions <ChevronDown /></button>}
 *     variant="icons"
 *     items={[{ label: 'Analytics', description: '…', icon: <BarChart /> }]}
 *     footerActions={[{ label: 'View all', href: '/solutions' }]}
 *   />
 */
import React from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

// ── Public types ──────────────────────────────────────────

export interface FlyoutMenuItem {
  label:        string;
  description?: string;
  /** Icon element rendered in a tinted square (used by `icons` / `two-column` variants) */
  icon?:        React.ReactNode;
  href?:        string;
  onClick?:     () => void;
  /** Optional pill badge on the right */
  badge?:       string;
}

export interface FlyoutMenuAction {
  label:    string;
  href?:    string;
  onClick?: () => void;
  icon?:    React.ReactNode;
  /** `'primary'` = filled button, `'ghost'` = outline (default) */
  variant?: 'primary' | 'ghost';
}

export type FlyoutMenuVariant = 'simple' | 'descriptions' | 'icons' | 'two-column';

export interface FlyoutMenuProps {
  /** Trigger element — typically a `<button>` with a label + chevron */
  trigger:        React.ReactNode;
  /** Navigation items shown in the panel body */
  items:          FlyoutMenuItem[];
  /** Visual layout variant. Default: `'simple'` */
  variant?:       FlyoutMenuVariant;
  /** CTA-style action button(s) rendered in the panel footer */
  footerActions?: FlyoutMenuAction[];
  /** Lighter text link(s) rendered in the panel footer */
  footerLinks?:   FlyoutMenuAction[];
  /** Horizontal alignment of the panel relative to the trigger. Default: `'left'` */
  align?:         'left' | 'right' | 'center';
  className?:     string;
}

// ── Panel width per variant ───────────────────────────────

const panelWidth: Record<FlyoutMenuVariant, string> = {
  simple:       'w-48',
  descriptions: 'w-72',
  icons:        'w-80',
  'two-column': 'w-[560px]',
};

// ── Item renderers ────────────────────────────────────────

function SimpleItem({ item, close }: { item: FlyoutMenuItem; close: () => void }) {
  const cls = 'flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-body text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-700 hover:text-ink-900 dark:hover:text-ink-50 rounded-lg transition-colors duration-75 cursor-pointer';
  const inner = (
    <>
      {item.label}
      {item.badge && (
        <span className="ml-auto shrink-0 text-[10px] font-semibold font-body px-1.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
          {item.badge}
        </span>
      )}
    </>
  );
  return item.href ? (
    <a href={item.href} className={cls} onClick={close}>{inner}</a>
  ) : (
    <button type="button" className={cls} onClick={() => { item.onClick?.(); close(); }}>{inner}</button>
  );
}

function DescriptionItem({ item, close }: { item: FlyoutMenuItem; close: () => void }) {
  const cls = 'flex flex-col gap-0.5 px-4 py-3 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors duration-75 cursor-pointer';
  const inner = (
    <>
      <span className="flex items-center gap-2">
        <span className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">{item.label}</span>
        {item.badge && (
          <span className="text-[10px] font-semibold font-body px-1.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
            {item.badge}
          </span>
        )}
      </span>
      {item.description && (
        <span className="text-xs font-body text-ink-500 dark:text-ink-400 leading-relaxed">{item.description}</span>
      )}
    </>
  );
  return item.href ? (
    <a href={item.href} className={cls} onClick={close}>{inner}</a>
  ) : (
    <button type="button" className={`w-full text-left ${cls}`} onClick={() => { item.onClick?.(); close(); }}>{inner}</button>
  );
}

function IconItem({ item, close }: { item: FlyoutMenuItem; close: () => void }) {
  const cls = 'flex items-start gap-3 p-3 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-700/60 transition-colors duration-75 cursor-pointer group';
  const inner = (
    <>
      {item.icon && (
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors duration-75">
          {item.icon}
        </div>
      )}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 leading-tight">{item.label}</p>
          {item.badge && (
            <span className="shrink-0 text-[10px] font-semibold font-body px-1.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
              {item.badge}
            </span>
          )}
        </div>
        {item.description && (
          <p className="mt-0.5 text-xs font-body text-ink-500 dark:text-ink-400 leading-relaxed">{item.description}</p>
        )}
      </div>
    </>
  );
  return item.href ? (
    <a href={item.href} className={cls} onClick={close}>{inner}</a>
  ) : (
    <button type="button" className={`w-full text-left ${cls}`} onClick={() => { item.onClick?.(); close(); }}>{inner}</button>
  );
}

// ── Footer renderers ──────────────────────────────────────

function FooterActions({ actions, close }: { actions: FlyoutMenuAction[]; close: () => void }) {
  return (
    <div className="flex gap-3 px-4 py-3 border-t border-ink-100 dark:border-ink-700">
      {actions.map((action, i) => {
        const cls = [
          'flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold font-body transition-colors duration-150',
          action.variant === 'primary'
            ? 'bg-primary-500 text-ink-900 hover:bg-primary-600'
            : 'bg-ink-100 dark:bg-ink-700 text-ink-700 dark:text-ink-200 hover:bg-ink-200 dark:hover:bg-ink-600',
        ].join(' ');
        const inner = (
          <>
            {action.icon && <span className="w-4 h-4 shrink-0">{action.icon}</span>}
            {action.label}
          </>
        );
        return action.href ? (
          <a key={i} href={action.href} className={cls} onClick={close}>{inner}</a>
        ) : (
          <button key={i} type="button" className={cls} onClick={() => { action.onClick?.(); close(); }}>{inner}</button>
        );
      })}
    </div>
  );
}

function FooterLinks({ links, close }: { links: FlyoutMenuAction[]; close: () => void }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 px-4 py-3 border-t border-ink-100 dark:border-ink-700 bg-ink-50 dark:bg-ink-800/50">
      {links.map((link, i) => {
        const cls = 'inline-flex items-center gap-1 text-xs font-semibold font-body text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-50 transition-colors duration-75';
        const inner = (
          <>
            {link.icon && <span className="w-3.5 h-3.5 shrink-0">{link.icon}</span>}
            {link.label}
          </>
        );
        return link.href ? (
          <a key={i} href={link.href} className={cls} onClick={close}>{inner}</a>
        ) : (
          <button key={i} type="button" className={cls} onClick={() => { link.onClick?.(); close(); }}>{inner}</button>
        );
      })}
    </div>
  );
}

// ── FlyoutMenu ────────────────────────────────────────────

export function FlyoutMenu({
  trigger,
  items,
  variant       = 'simple',
  footerActions,
  footerLinks,
  align         = 'left',
  className     = '',
}: FlyoutMenuProps) {

  const alignCls =
    align === 'right'  ? 'right-0' :
    align === 'center' ? 'left-1/2 -translate-x-1/2' :
    'left-0';

  const isTwoCol = variant === 'two-column';

  return (
    <Popover className={`relative inline-block ${className}`}>
      {({ open, close }) => (
        <>
          <Popover.Button as={React.Fragment}>
            {/* Wrap trigger so we can inject the open state for chevron rotation */}
            {React.isValidElement(trigger)
              ? React.cloneElement(trigger as React.ReactElement<{ 'data-open'?: boolean }>, { 'data-open': open })
              : trigger}
          </Popover.Button>

          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              className={[
                'absolute z-[200] mt-2',
                alignCls,
                panelWidth[variant],
                'rounded-2xl overflow-hidden',
                'bg-white dark:bg-ink-800',
                'border border-ink-200 dark:border-ink-700',
                'shadow-xl dark:shadow-dark-md',
                'focus:outline-none',
              ].join(' ')}
            >
              {/* Items */}
              <div className={[
                'p-2',
                isTwoCol ? 'grid grid-cols-2 gap-0.5' : 'flex flex-col gap-0.5',
              ].join(' ')}>
                {items.map((item, i) => {
                  if (variant === 'simple') {
                    return <SimpleItem key={i} item={item} close={close} />;
                  }
                  if (variant === 'descriptions') {
                    return <DescriptionItem key={i} item={item} close={close} />;
                  }
                  // icons + two-column
                  return <IconItem key={i} item={item} close={close} />;
                })}
              </div>

              {/* Footer */}
              {footerActions && footerActions.length > 0 && (
                <FooterActions actions={footerActions} close={close} />
              )}
              {footerLinks && footerLinks.length > 0 && (
                <FooterLinks links={footerLinks} close={close} />
              )}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

// ── FlyoutTrigger — convenience styled trigger button ─────

export interface FlyoutTriggerProps {
  label:      string;
  /** Show a rotating chevron. Default: true */
  chevron?:   boolean;
  className?: string;
}

/**
 * Pre-styled trigger button that rotates its chevron when the panel is open.
 * Pass as the `trigger` prop of `<FlyoutMenu>` for a ready-made nav link style.
 */
export function FlyoutTrigger({ label, chevron = true, className = '', ...rest }: FlyoutTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const isOpen = (rest as { 'data-open'?: boolean })['data-open'];
  return (
    <button
      type="button"
      {...rest}
      className={[
        'inline-flex items-center gap-1 text-sm font-semibold font-body',
        'text-ink-700 dark:text-ink-200 hover:text-ink-900 dark:hover:text-ink-50',
        'transition-colors duration-150 outline-none',
        className,
      ].join(' ')}
    >
      {label}
      {chevron && (
        <ChevronDown
          className={[
            'w-4 h-4 text-ink-400 transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
