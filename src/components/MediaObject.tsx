import React from 'react';

// ── Types ─────────────────────────────────────────────────

export type MediaObjectAlign = 'top' | 'center' | 'bottom' | 'stretch';
export type MediaObjectSide = 'left' | 'right';
export type MediaObjectGap = 'sm' | 'md' | 'lg';

export interface MediaObjectProps {
  /** The media element: image, avatar, icon, etc. */
  media: React.ReactNode;
  children: React.ReactNode;
  /** Vertical alignment of the media relative to content */
  align?: MediaObjectAlign;
  /** Which side the media sits on */
  side?: MediaObjectSide;
  /** Stack vertically on small screens */
  responsive?: boolean;
  gap?: MediaObjectGap;
  className?: string;
}

export interface MediaObjectListProps {
  children: React.ReactNode;
  /** Render a divider line between items */
  divided?: boolean;
  className?: string;
}

// ── MediaObject ────────────────────────────────────────────

const alignCls: Record<MediaObjectAlign, string> = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
  stretch: 'items-stretch',
};

const gapCls: Record<MediaObjectGap, string> = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
};

export function MediaObject({
  media,
  children,
  align = 'top',
  side = 'left',
  responsive = false,
  gap = 'md',
  className = '',
}: MediaObjectProps) {
  const direction = side === 'right' ? 'flex-row-reverse' : 'flex-row';
  const stack = responsive ? `flex-col sm:${direction}` : direction;

  return (
    <div
      className={['flex', stack, alignCls[align], gapCls[gap], className].filter(Boolean).join(' ')}
    >
      <div className="shrink-0">{media}</div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// ── MediaObjectList ────────────────────────────────────────

export function MediaObjectList({
  children,
  divided = false,
  className = '',
}: MediaObjectListProps) {
  const items = React.Children.toArray(children);
  return (
    <div
      className={[
        'flex flex-col',
        divided ? 'divide-y divide-ink-100 dark:divide-ink-700' : 'gap-4',
        className,
      ].join(' ')}
    >
      {divided
        ? items.map((child, i) => (
            <div key={i} className="py-4 first:pt-0 last:pb-0">
              {child}
            </div>
          ))
        : items}
    </div>
  );
}
