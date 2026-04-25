import React from 'react';
import { Dialog as HLDialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize      = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerProps {
  open:        boolean;
  onClose:     () => void;
  title?:      string;
  description?: string;
  children:    React.ReactNode;
  /** Which edge the drawer slides in from */
  placement?:  DrawerPlacement;
  /** Width (for left/right) or height (for top/bottom) */
  size?:       DrawerSize;
  /** Show close button inside the header */
  closeButton?: boolean;
  /** Show close button outside the panel (above/beside it) */
  closeOutside?: boolean;
  /** Slot rendered as a sticky footer */
  footer?:     React.ReactNode;
  className?:  string;
}

// ── Size maps ──────────────────────────────────────────────

const sideSizes: Record<DrawerSize, string> = {
  sm:   'w-72',
  md:   'w-80',
  lg:   'w-96',
  xl:   'w-[32rem]',
  full: 'w-full',
};

const edgeSizes: Record<DrawerSize, string> = {
  sm:   'h-1/3',
  md:   'h-1/2',
  lg:   'h-2/3',
  xl:   'h-3/4',
  full: 'h-full',
};

// ── Slide transitions per placement ───────────────────────

const slides: Record<DrawerPlacement, { from: string; to: string; panel: string }> = {
  left:   { from: '-translate-x-full', to: 'translate-x-0', panel: 'inset-y-0 left-0 h-full' },
  right:  { from: 'translate-x-full',  to: 'translate-x-0', panel: 'inset-y-0 right-0 h-full' },
  top:    { from: '-translate-y-full', to: 'translate-y-0', panel: 'inset-x-0 top-0 w-full'  },
  bottom: { from: 'translate-y-full',  to: 'translate-y-0', panel: 'inset-x-0 bottom-0 w-full' },
};

// ── Drawer ─────────────────────────────────────────────────

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  placement    = 'right',
  size         = 'md',
  closeButton  = true,
  closeOutside = false,
  footer,
  className    = '',
}: DrawerProps) {
  const isHorizontal = placement === 'left' || placement === 'right';
  const sizeCls = isHorizontal ? sideSizes[size] : edgeSizes[size];
  const slide   = slides[placement];

  // Outside close button position
  const outsidePos: Record<DrawerPlacement, string> = {
    right:  'absolute top-4 left-0 -translate-x-full pr-2',
    left:   'absolute top-4 right-0 translate-x-full pl-2',
    bottom: 'absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-2',
    top:    'absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-2',
  };

  return (
    <Transition appear show={open} as={React.Fragment}>
      <HLDialog as="div" className="relative z-50" onClose={onClose}>

        {/* Backdrop */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200"  leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ink-900/50 dark:bg-ink-900/80" />
        </Transition.Child>

        {/* Slide panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className={['absolute', slide.panel].join(' ')}>
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom={slide.from}
                enterTo={slide.to}
                leave="transform transition ease-in duration-200"
                leaveFrom={slide.to}
                leaveTo={slide.from}
              >
                <HLDialog.Panel
                  className={[
                    'relative flex flex-col bg-white dark:bg-ink-800',
                    'shadow-xl border-ink-200 dark:border-ink-700',
                    placement === 'right'  ? 'border-l h-full' : '',
                    placement === 'left'   ? 'border-r h-full' : '',
                    placement === 'top'    ? 'border-b w-full' : '',
                    placement === 'bottom' ? 'border-t w-full' : '',
                    sizeCls,
                    className,
                  ].filter(Boolean).join(' ')}
                >
                  {/* Outside close button */}
                  {closeOutside && (
                    <div className={outsidePos[placement]}>
                      <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close drawer"
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-ink-700 shadow-md text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Header */}
                  {(title || (closeButton && !closeOutside)) && (
                    <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-ink-100 dark:border-ink-700 shrink-0">
                      <div className="min-w-0">
                        {title && (
                          <HLDialog.Title className="text-base font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight">
                            {title}
                          </HLDialog.Title>
                        )}
                        {description && (
                          <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-400">
                            {description}
                          </p>
                        )}
                      </div>
                      {closeButton && !closeOutside && (
                        <button
                          type="button"
                          onClick={onClose}
                          aria-label="Close drawer"
                          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Scrollable body */}
                  <div className="flex-1 overflow-y-auto px-6 py-5">
                    {children}
                  </div>

                  {/* Sticky footer */}
                  {footer && (
                    <div className="shrink-0 px-6 py-4 border-t border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800">
                      {footer}
                    </div>
                  )}
                </HLDialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>

      </HLDialog>
    </Transition>
  );
}
