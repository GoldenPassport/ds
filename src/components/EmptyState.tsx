import React from 'react';
import { Button } from './Button';
import type { ButtonVariant } from './Button';

// ── Types ─────────────────────────────────────────────────

export interface EmptyStateAction {
  label:    string;
  onClick?: () => void;
  href?:    string;
  icon?:    React.ReactNode;
  variant?: ButtonVariant;
}

export interface EmptyStateProps {
  /** Large icon rendered above the title */
  icon?:             React.ReactNode;
  title:             string;
  description?:      string;
  primaryAction?:    EmptyStateAction;
  secondaryAction?:  EmptyStateAction;
  /**
   * Wraps the content in a dashed rounded border.
   * Use when the empty state replaces a list or table in-place.
   */
  bordered?:         boolean;
  className?:        string;
}

// ── Action helper ─────────────────────────────────────────

function ActionButton({ action }: { action: EmptyStateAction }) {
  if (action.href) {
    return (
      <a href={action.href}>
        <Button variant={action.variant ?? 'primary'} size="sm">
          {action.icon && <span aria-hidden="true">{action.icon}</span>}
          {action.label}
        </Button>
      </a>
    );
  }
  return (
    <Button variant={action.variant ?? 'primary'} size="sm" onClick={action.onClick}>
      {action.icon && <span aria-hidden="true">{action.icon}</span>}
      {action.label}
    </Button>
  );
}

// ── EmptyState ────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  bordered  = false,
  className = '',
}: EmptyStateProps) {
  const inner = (
    <div className="flex flex-col items-center text-center py-12 px-6">
      {icon && (
        <div className="mb-4 text-ink-300 dark:text-ink-600" aria-hidden="true">
          {icon}
        </div>
      )}

      <h3 className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">
        {title}
      </h3>

      {description && (
        <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-400 max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {primaryAction  && <ActionButton action={primaryAction}  />}
          {secondaryAction && <ActionButton action={{ variant: 'secondary', ...secondaryAction }} />}
        </div>
      )}
    </div>
  );

  if (bordered) {
    return (
      <div className={[
        'rounded-2xl border-2 border-dashed border-ink-200 dark:border-ink-700',
        className,
      ].join(' ')}>
        {inner}
      </div>
    );
  }

  return (
    <div className={className}>
      {inner}
    </div>
  );
}
