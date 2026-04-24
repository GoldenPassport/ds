import React from 'react';
import { X } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export type FabMenuVariant  = 'small' | 'regular' | 'large';
export type FabMenuColor    = 'primary' | 'secondary' | 'surface';
export type FabMenuPosition = 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface FabMenuItem {
  label:    string;
  icon:     React.ReactNode;
  onClick?: () => void;
  href?:    string;
}

export interface FabMenuProps {
  /** Icon shown when closed */
  icon:          React.ReactNode;
  /** Icon shown when open — defaults to X */
  closeIcon?:    React.ReactNode;
  /** Text label — turns the trigger into an Extended FAB */
  label?:        string;
  items:         FabMenuItem[];
  variant?:      FabMenuVariant;
  color?:        FabMenuColor;
  position?:     FabMenuPosition;
  /** Use fixed viewport positioning (default: true) */
  fixed?:        boolean;
  defaultOpen?:  boolean;
  open?:         boolean;
  onOpenChange?: (open: boolean) => void;
  className?:    string;
}

// ── Styles ────────────────────────────────────────────────

const triggerSize: Record<FabMenuVariant, string> = {
  small:   'w-10 h-10 text-sm  shadow-md',
  regular: 'w-14 h-14 text-base shadow-lg',
  large:   'w-24 h-24 text-2xl shadow-xl',
};

// Trigger FAB fill colour
const triggerColor: Record<FabMenuColor, string> = {
  primary:   'bg-primary-500 text-ink-900 hover:bg-primary-600',
  secondary: 'bg-ink-500 dark:bg-ink-600 text-white hover:bg-ink-600 dark:hover:bg-ink-500',
  surface:   'bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-700 shadow-md',
};

// Action pill colour — tinted version of the FAB colour
const itemColor: Record<FabMenuColor, string> = {
  primary:   'bg-primary-100 dark:bg-primary-900/40 text-primary-900 dark:text-primary-100 hover:bg-primary-200 dark:hover:bg-primary-900/60',
  secondary: 'bg-ink-200 dark:bg-ink-700 text-ink-800 dark:text-ink-100 hover:bg-ink-300 dark:hover:bg-ink-600',
  surface:   'bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-100 shadow hover:bg-ink-50 dark:hover:bg-ink-700',
};

const positionCls: Record<FabMenuPosition, string> = {
  'bottom-right':  'bottom-6 right-6',
  'bottom-left':   'bottom-6 left-6',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
};

const itemAlignCls: Record<FabMenuPosition, string> = {
  'bottom-right':  'items-end',
  'bottom-left':   'items-start',
  'bottom-center': 'items-center',
};

// ── Component ─────────────────────────────────────────────

export function FabMenu({
  icon,
  closeIcon,
  label,
  items,
  variant      = 'regular',
  color        = 'primary',
  position     = 'bottom-right',
  fixed        = true,
  defaultOpen  = false,
  open: controlledOpen,
  onOpenChange,
  className    = '',
}: FabMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const toggle = () => {
    const next = !isOpen;
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  const close = () => {
    setInternalOpen(false);
    onOpenChange?.(false);
  };

  const posRoot = fixed ? 'fixed' : 'absolute';

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className={`${posRoot} inset-0 z-40`}
          aria-hidden="true"
          onClick={close}
        />
      )}

      {/* Stack */}
      <div className={[
        posRoot,
        positionCls[position],
        'z-50 flex flex-col gap-3',
        itemAlignCls[position],
        className,
      ].join(' ')}>

        {/* Action pills — flex-col-reverse so first item sits closest to the FAB */}
        <div className={['flex flex-col-reverse gap-2.5', itemAlignCls[position]].join(' ')}>
          {items.map((item, i) => {
            const delay = isOpen
              ? `${i * 40}ms`
              : `${(items.length - 1 - i) * 30}ms`;

            const pillCls = [
              'inline-flex items-center gap-3 pl-4 pr-5 py-3 rounded-full',
              'text-sm font-semibold font-body whitespace-nowrap',
              'transition-all duration-200',
              itemColor[color],
              isOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-4 pointer-events-none',
            ].join(' ');

            const inner = (
              <>
                <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                  {item.icon}
                </span>
                {item.label}
              </>
            );

            return item.href ? (
              <a
                key={i}
                href={item.href}
                className={pillCls}
                style={{ transitionDelay: delay }}
              >
                {inner}
              </a>
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => { item.onClick?.(); close(); }}
                className={pillCls}
                style={{ transitionDelay: delay }}
              >
                {inner}
              </button>
            );
          })}
        </div>

        {/* Trigger FAB — always a circle */}
        <button
          type="button"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-label={label ?? (isOpen ? 'Close menu' : 'Open menu')}
          className={[
            'inline-flex items-center justify-center gap-2 rounded-full',
            'font-semibold font-body transition-all duration-200 focus:outline-none',
            triggerSize[variant],
            triggerColor[color],
            label ? 'px-5' : '',
          ].join(' ')}
        >
          <span
            className={[
              'flex items-center justify-center transition-transform duration-300',
              isOpen ? 'rotate-45' : 'rotate-0',
              variant === 'large' ? 'w-8 h-8' : 'w-5 h-5',
            ].join(' ')}
          >
            {isOpen && closeIcon ? closeIcon : isOpen ? <X /> : icon}
          </span>
          {label && !isOpen && (
            <span className="text-sm">{label}</span>
          )}
        </button>
      </div>
    </>
  );
}
