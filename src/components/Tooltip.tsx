import React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingArrow,
} from '@floating-ui/react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export type TooltipRadius = 'sm' | 'md' | 'lg' | 'full';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: TooltipPlacement;
  /** Open delay in ms (close is always 100 ms) */
  delay?: number;
  /** Border radius of the tooltip bubble. sm=rounded, md=rounded-lg (default), lg=rounded-xl, full=pill */
  radius?: TooltipRadius;
  className?: string;
}

const ARROW_HEIGHT = 7;
const ARROW_GAP = 2;

const RADIUS_CLASS: Record<TooltipRadius, string> = {
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
};

export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 300,
  radius = 'md',
  className = '',
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const arrowRef = React.useRef<SVGSVGElement>(null);

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(ARROW_HEIGHT + ARROW_GAP),
      flip({ fallbackAxisSideDirection: 'start' }),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
  });

  const hover = useHover(context, { move: false, delay: { open: delay, close: 100 } });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  return (
    <>
      <span
        ref={refs.setReference}
        aria-describedby={open ? id : undefined}
        style={{ display: 'inline-flex' }}
        {...getReferenceProps()}
      >
        {children}
      </span>

      {open && (
        <FloatingPortal>
          <div
            id={id}
            ref={refs.setFloating}
            style={{ ...floatingStyles, opacity: isPositioned ? 1 : 0 }}
            {...getFloatingProps()}
            className={[
              'z-50 px-2.5 py-1.5 text-xs font-medium font-body max-w-xs',
              RADIUS_CLASS[radius],
              'bg-ink-900 dark:bg-ink-700 text-ink-50',
              'shadow-lg pointer-events-none',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {content}
            <FloatingArrow
              ref={arrowRef}
              context={context}
              width={14}
              height={ARROW_HEIGHT}
              tipRadius={2}
              className="fill-ink-900 dark:fill-ink-700"
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
