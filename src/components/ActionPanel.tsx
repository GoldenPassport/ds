import React from 'react';

// ── Types ─────────────────────────────────────────────────

export type ActionPanelVariant = 'default' | 'danger';
export type ActionPanelLayout  = 'stacked' | 'inline';

export interface ActionPanelProps {
  title:        string;
  description?: React.ReactNode;
  /**
   * The action control(s) — a button, toggle, input+button row, etc.
   * stacked: renders below the description, left-aligned.
   * inline:  rendered to the right of the text, vertically centred.
   */
  children?:    React.ReactNode;
  /**
   * default — neutral white/surface card
   * danger  — red-tinted border + red title for destructive settings
   */
  variant?:     ActionPanelVariant;
  /**
   * stacked — action sits below the description (default)
   * inline  — action sits to the right of the text block
   */
  layout?:      ActionPanelLayout;
  className?:   string;
}

// ── Variant config ────────────────────────────────────────

const containerCls: Record<ActionPanelVariant, string> = {
  default: 'bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700',
  danger:  'bg-red-50/40 dark:bg-red-900/10 border border-red-200 dark:border-red-800',
};

const titleCls: Record<ActionPanelVariant, string> = {
  default: 'text-ink-900 dark:text-ink-50',
  danger:  'text-red-800 dark:text-red-200',
};

const descCls: Record<ActionPanelVariant, string> = {
  default: 'text-ink-500 dark:text-ink-400',
  danger:  'text-red-700/80 dark:text-red-300/80',
};

// ── Component ─────────────────────────────────────────────

export function ActionPanel({
  title,
  description,
  children,
  variant   = 'default',
  layout    = 'stacked',
  className = '',
}: ActionPanelProps) {
  const textBlock = (
    <div className="min-w-0 flex-1">
      <h3 className={['text-sm font-semibold font-body leading-snug', titleCls[variant]].join(' ')}>
        {title}
      </h3>
      {description && (
        <p className={['mt-1 text-sm font-body leading-relaxed', descCls[variant]].join(' ')}>
          {description}
        </p>
      )}
    </div>
  );

  if (layout === 'inline') {
    return (
      <div className={['rounded-2xl px-6 py-5 flex items-center gap-8', containerCls[variant], className].join(' ')}>
        {textBlock}
        {children && (
          <div className="shrink-0">{children}</div>
        )}
      </div>
    );
  }

  // stacked
  return (
    <div className={['rounded-2xl px-6 py-5', containerCls[variant], className].join(' ')}>
      {textBlock}
      {children && (
        <div className="mt-4">{children}</div>
      )}
    </div>
  );
}
