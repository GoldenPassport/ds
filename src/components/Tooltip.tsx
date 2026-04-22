/**
 * Tooltip — lightweight floating label using @floating-ui/react
 * Shows on hover/focus; accessible via aria-describedby.
 *
 * Usage:
 *   <Tooltip content="Run this workflow now">
 *     <Button variant="primary">Deploy</Button>
 *   </Tooltip>
 */
import React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content:    React.ReactNode;
  children:   React.ReactElement;
  placement?: TooltipPlacement;
  delay?:     number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 300,
  className = '',
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ fallbackAxisSideDirection: 'start' }),
      shift({ padding: 8 }),
    ],
  });

  const hover   = useHover(context,   { move: false, delay: { open: delay, close: 100 } });
  const focus   = useFocus(context);
  const dismiss = useDismiss(context);
  const role    = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover, focus, dismiss, role,
  ]);

  const trigger = React.cloneElement(children, {
    ref: refs.setReference,
    'aria-describedby': open ? id : undefined,
    ...getReferenceProps(),
  });

  return (
    <>
      {trigger}
      {open && (
        <FloatingPortal>
          <div
            id={id}
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={[
              'z-50 px-2.5 py-1.5 rounded-lg text-xs font-medium font-body max-w-xs',
              'bg-ink-900 dark:bg-ink-700 text-ink-50',
              'shadow-lg pointer-events-none',
              'animate-gp-fade-in',
              className,
            ].join(' ')}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
