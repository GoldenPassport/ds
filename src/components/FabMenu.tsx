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
  small:   'w-10 h-10 rounded-xl   text-sm shadow-md',
  regular: 'w-14 h-14 rounded-2xl  text-base shadow-lg',
  large:   'w-24 h-24 rounded-[28px] text-2xl shadow-xl',
};

const colorCls: Record<FabMenuColor, string> = {
  primary:   'bg-primary-500 text-ink-900 hover:bg-primary-600',
  secondary: 'bg-ink-100 dark:bg-ink-700 text-ink-700 dark:text-ink-100 hover:bg-ink-200 dark:hover:bg-ink-600',
  surface:   'bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-700',
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
  const isOpen   = controlledOpen !== undefined ? controlledOpen : internalOpen;

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

      {/* Container */}
      <div className={[
        posRoot,
        positionCls[position],
        'z-50 flex flex-col gap-3',
        itemAlignCls[position],
        className,
      ].join(' ')}>

        {/* Action items — rendered top-to-bottom, reversed so first item is closest to FAB */}
        <div className={['flex flex-col-reverse gap-3', itemAlignCls[position]].join(' ')}>
          {items.map((item, i) => {
            const delay = isOpen
              ? `${i * 40}ms`
              : `${(items.length - 1 - i) * 30}ms`;

            const base = [
              'flex items-center gap-3 transition-all duration-200',
              isOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-4 pointer-events-none',
              position === 'bottom-left' ? 'flex-row' : 'flex-row-reverse',
            ].join(' ');

            const miniFab = (
              <button
                type="button"
                onClick={() => { item.onClick?.(); close(); }}
                aria-label={item.label}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-100 shadow-md hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors shrink-0"
              >
                <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
              </button>
            );

            const chipLabel = (
              <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-100 text-sm font-medium font-body shadow-md whitespace-nowrap">
                {item.label}
              </span>
            );

            return item.href ? (
              <a
                key={i}
                href={item.href}
                className={base}
                style={{ transitionDelay: delay }}
                aria-label={item.label}
              >
                {position === 'bottom-left' ? <>{miniFab}{chipLabel}</> : <>{chipLabel}{miniFab}</>}
              </a>
            ) : (
              <div
                key={i}
                className={base}
                style={{ transitionDelay: delay }}
              >
                {position === 'bottom-left' ? <>{miniFab}{chipLabel}</> : <>{chipLabel}{miniFab}</>}
              </div>
            );
          })}
        </div>

        {/* Trigger FAB */}
        <button
          type="button"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-label={label ?? (isOpen ? 'Close menu' : 'Open menu')}
          className={[
            'inline-flex items-center justify-center gap-2 font-semibold font-body transition-all duration-200 focus:outline-none',
            triggerSize[variant],
            colorCls[color],
            label ? 'px-4' : '',
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
