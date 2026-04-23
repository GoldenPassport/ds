import React from 'react';

// ── Types ─────────────────────────────────────────────────

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerAlign       = 'left' | 'center' | 'right';

export interface DividerProps {
  /** Text, icon, button, or any node to embed in the line */
  label?:       React.ReactNode;
  /** Where the label sits along the line. Default: 'center' */
  align?:       DividerAlign;
  orientation?: DividerOrientation;
  className?:   string;
}

// ── Component ─────────────────────────────────────────────

const LINE = 'border-ink-200 dark:border-ink-700';

export function Divider({
  label,
  align       = 'center',
  orientation = 'horizontal',
  className   = '',
}: DividerProps) {

  // ── Vertical ───────────────────────────────────────────
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={['self-stretch border-l', LINE, className].join(' ')}
      />
    );
  }

  // ── Horizontal — no label ─────────────────────────────
  if (!label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={['border-t', LINE, className].join(' ')}
      />
    );
  }

  // ── Horizontal — with label ───────────────────────────
  const labelNode = (
    <span className="shrink-0 flex items-center">
      {label}
    </span>
  );

  const line = <div className={['flex-1 border-t', LINE].join(' ')} />;

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={['flex items-center gap-3', className].join(' ')}
    >
      {align === 'right'  && line}
      {align === 'center' && line}
      {labelNode}
      {align === 'left'   && line}
      {align === 'center' && line}
    </div>
  );
}
