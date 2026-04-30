/**
 * Dialog — wraps Headless UI Dialog
 * Accessible modal with GP styling, focus trap, and backdrop.
 *
 * Usage:
 *   <Dialog open={open} onClose={setOpen} title="Delete Workflow">
 *     <p>Are you sure?</p>
 *     <Dialog.Footer>
 *       <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
 *       <Button variant="danger">Delete</Button>
 *     </Dialog.Footer>
 *   </Dialog>
 */
import React from 'react';
import { Dialog as HLDialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

export interface DialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };

export function Dialog({
  open,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}: DialogProps) {
  return (
    <Transition appear show={open} as={React.Fragment}>
      <HLDialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ink-900/60 dark:bg-ink-900/80 backdrop-blur-sm" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95 translate-y-2"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HLDialog.Panel
                className={[
                  'w-full rounded-2xl shadow-xl overflow-hidden',
                  'bg-white dark:bg-ink-800',
                  'border border-ink-200 dark:border-ink-700',
                  sizeMap[size],
                  className,
                ].join(' ')}
              >
                {/* Header */}
                {title && (
                  <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-ink-100 dark:border-ink-700">
                    <HLDialog.Title className="text-base font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight">
                      {title}
                    </HLDialog.Title>
                    <button
                      onClick={() => onClose(false)}
                      className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 bg-transparent border-0 cursor-pointer transition-colors p-0.5 rounded"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                )}

                {/* Body */}
                <div className="px-6 py-5 text-sm font-body text-ink-700 dark:text-ink-300 leading-relaxed">
                  {children}
                </div>
              </HLDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HLDialog>
    </Transition>
  );
}

/** Convenience footer row — place inside Dialog body */
Dialog.Footer = function DialogFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end gap-2.5 pt-4 mt-4 border-t border-ink-100 dark:border-ink-700">
      {children}
    </div>
  );
};
