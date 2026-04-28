/**
 * FlyoutMenu — rich navigation flyout backed by Headless UI v2 Popover.
 *
 * Variants:
 *  - `simple`       — plain list of links
 *  - `descriptions` — each item has a supporting description line
 *  - `icons`        — icon square + title + description (most common for nav)
 *  - `two-column`   — same as `icons` but laid out in a 2-column grid
 *
 * Optional footer:
 *  - `footerActions` — CTA-style action buttons in a divided grid at the bottom
 *  - `footerLinks`   — lighter text links on a tinted footer bar
 */
import React from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

// ── Public types ──────────────────────────────────────────

export interface FlyoutMenuItem {
  label:        string;
  description?: string;
  /** Icon element rendered in a tinted square (icons / two-column variants) */
  icon?:        React.ReactNode;
  href?:        string;
  onClick?:     () => void;
  badge?:       string;
}

export interface FlyoutMenuAction {
  label:    string;
  href?:    string;
  onClick?: () => void;
  icon?:    React.ReactNode;
}

export type FlyoutMenuVariant = 'simple' | 'descriptions' | 'icons' | 'two-column';

export interface FlyoutMenuProps {
  /** Trigger element — typically a `<button>` with a label + chevron */
  trigger:        React.ReactNode;
  /** Navigation items shown in the panel body */
  items:          FlyoutMenuItem[];
  /** Visual layout variant. Default: `'simple'` */
  variant?:       FlyoutMenuVariant;
  /** CTA action(s) in a divided grid footer (up to 4) */
  footerActions?: FlyoutMenuAction[];
  /** Lighter text link(s) on a tinted footer bar */
  footerLinks?:   FlyoutMenuAction[];
  /** Horizontal alignment of the panel relative to trigger. Default: `'left'` */
  align?:         'left' | 'right' | 'center';
  className?:     string;
}

// ── Panel max-width per variant ───────────────────────────

const panelMaxW: Record<FlyoutMenuVariant, string> = {
  simple:       'max-w-xs',
  descriptions: 'max-w-sm',
  icons:        'max-w-md',
  'two-column': 'max-w-2xl',
};

// ── Item renderers ────────────────────────────────────────

function SimpleItem({ item }: { item: FlyoutMenuItem }) {
  const cls = 'group relative flex items-center justify-between gap-2 rounded-lg px-4 py-2.5 text-sm font-body font-semibold text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors duration-75 cursor-pointer';
  const inner = (
    <>
      {item.label}
      {item.badge && (
        <span className="shrink-0 text-[10px] font-semibold font-body px-1.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
          {item.badge}
        </span>
      )}
    </>
  );
  return item.href
    ? <a href={item.href} className={cls}>{inner}</a>
    : <button type="button" className={`w-full text-left ${cls}`} onClick={item.onClick}>{inner}</button>;
}

function DescriptionItem({ item }: { item: FlyoutMenuItem }) {
  const cls = 'group relative flex flex-col gap-0.5 rounded-lg px-4 py-3 hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors duration-75 cursor-pointer';
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
        <span className="text-xs font-body text-ink-500 dark:text-ink-300 leading-relaxed">{item.description}</span>
      )}
    </>
  );
  return item.href
    ? <a href={item.href} className={cls}>{inner}</a>
    : <button type="button" className={`w-full text-left ${cls}`} onClick={item.onClick}>{inner}</button>;
}

function IconItem({ item }: { item: FlyoutMenuItem }) {
  const cls = 'group relative flex gap-x-4 rounded-xl p-4 hover:bg-ink-50 dark:hover:bg-white/5 transition-colors duration-75 cursor-pointer';
  const inner = (
    <>
      {item.icon && (
        <div className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-lg bg-ink-100 dark:bg-ink-700/50 text-ink-500 dark:text-ink-300 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-75">
          <span className="size-6 flex items-center justify-center">{item.icon}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-75">
            {item.label}
          </span>
          {item.badge && (
            <span className="text-[10px] font-semibold font-body px-1.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
              {item.badge}
            </span>
          )}
        </span>
        {item.description && (
          <p className="mt-1 text-xs font-body text-ink-500 dark:text-ink-300 leading-relaxed">{item.description}</p>
        )}
        {/* Full-card link overlay */}
        {item.href && <span className="absolute inset-0" />}
      </div>
    </>
  );
  return item.href
    ? <a href={item.href} className={cls}>{inner}</a>
    : <button type="button" className={`w-full text-left ${cls}`} onClick={item.onClick}>{inner}</button>;
}

// ── Footer renderers ──────────────────────────────────────

function FooterActions({ actions }: { actions: FlyoutMenuAction[] }) {
  return (
    <div
      className={[
        'grid divide-x divide-ink-200 dark:divide-ink-700',
        'border-t border-ink-200 dark:border-ink-700',
        'bg-ink-50 dark:bg-ink-800/60',
      ].join(' ')}
      style={{ gridTemplateColumns: `repeat(${Math.min(actions.length, 4)}, minmax(0, 1fr))` }}
    >
      {actions.map((action, i) => {
        const cls = 'flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold font-body text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors duration-75 cursor-pointer';
        const inner = (
          <>
            {action.icon && (
              <span className="size-5 shrink-0 text-ink-500 dark:text-ink-300 flex items-center justify-center">
                {action.icon}
              </span>
            )}
            {action.label}
          </>
        );
        return action.href
          ? <a key={i} href={action.href} className={cls}>{inner}</a>
          : <button key={i} type="button" className={cls} onClick={action.onClick}>{inner}</button>;
      })}
    </div>
  );
}

function FooterLinks({ links }: { links: FlyoutMenuAction[] }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 px-4 py-3 border-t border-ink-100 dark:border-ink-700 bg-ink-50 dark:bg-ink-800/50">
      {links.map((link, i) => {
        const cls = 'inline-flex items-center gap-1.5 text-xs font-semibold font-body text-ink-500 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 transition-colors duration-75';
        const inner = (
          <>
            {link.icon && <span className="size-3.5 shrink-0 flex items-center justify-center">{link.icon}</span>}
            {link.label}
          </>
        );
        return link.href
          ? <a key={i} href={link.href} className={cls}>{inner}</a>
          : <button key={i} type="button" className={cls} onClick={link.onClick}>{inner}</button>;
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
    align === 'right'  ? 'right-0'                         :
    align === 'center' ? 'left-1/2 -translate-x-1/2'       :
    'left-0';

  const isTwoCol = variant === 'two-column';

  return (
    <Popover className={`relative inline-block ${className}`}>
      {({ open }) => (
        <>
          <PopoverButton as={React.Fragment}>
            {React.isValidElement(trigger)
              ? React.cloneElement(trigger as React.ReactElement<{ 'data-open'?: boolean }>, { 'data-open': open })
              : trigger}
          </PopoverButton>

          <PopoverPanel
            transition
            className={[
              'absolute z-200 mt-2',
              alignCls,
              'w-screen',
              panelMaxW[variant],
              'flex-auto overflow-hidden rounded-2xl',
              'bg-white dark:bg-ink-800',
              'border border-ink-200 dark:border-ink-700',
              'shadow-xl',
              // v2 transition via data attributes
              'transition',
              'data-closed:translate-y-1 data-closed:opacity-0',
              'data-enter:duration-200 data-enter:ease-out',
              'data-leave:duration-150 data-leave:ease-in',
            ].join(' ')}
          >
            {/* Items */}
            <div className={[
              'p-2',
              isTwoCol ? 'grid grid-cols-2' : '',
            ].join(' ')}>
              {items.map((item, i) => {
                if (variant === 'simple')       return <SimpleItem      key={i} item={item} />;
                if (variant === 'descriptions') return <DescriptionItem key={i} item={item} />;
                return                                 <IconItem        key={i} item={item} />;
              })}
            </div>

            {/* Footer */}
            {footerActions && footerActions.length > 0 && (
              <FooterActions actions={footerActions} />
            )}
            {footerLinks && footerLinks.length > 0 && (
              <FooterLinks links={footerLinks} />
            )}
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}

// ── FlyoutTrigger — convenience styled trigger button ─────

export interface FlyoutTriggerProps {
  label:      string;
  chevron?:   boolean;
  className?: string;
}

export const FlyoutTrigger = React.forwardRef<
  HTMLButtonElement,
  FlyoutTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function FlyoutTrigger({
  label,
  chevron   = true,
  className = '',
  ...rest
}, ref) {
  const isOpen = (rest as { 'data-open'?: boolean })['data-open'];
  return (
    <button
      type="button"
      ref={ref}
      {...rest}
      className={[
        'inline-flex items-center gap-1 text-sm font-semibold font-body',
        'text-ink-700 dark:text-ink-200 hover:text-ink-900 dark:hover:text-ink-50',
        'outline-none transition-colors duration-150',
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
});
