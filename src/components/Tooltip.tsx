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

  const hover   = useHover(context, { move: false, delay: { open: delay, close: 100 } });
  const focus   = useFocus(context);
  const dismiss = useDismiss(context);
  const role    = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover, focus, dismiss, role,
  ]);

  return (
    <>
      {/*
        Wrap in a span so any child (including ones that don't forwardRef)
        gets the floating-ui reference and interaction props.
        display:contents keeps the wrapper invisible to layout.
      */}
      <span
        ref={refs.setReference}
        aria-describedby={open ? id : undefined}
        style={{ display: 'contents' }}
        {...getReferenceProps()}
      >
        {children}
      </span>

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
