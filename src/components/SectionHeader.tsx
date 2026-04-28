import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from './Button';
import { Menu } from './Menu';
import type { ButtonVariant } from './Button';
import type { MenuItem } from './Menu';

// ── Types ─────────────────────────────────────────────────

export interface SectionHeaderAction {
  label:    string;
  onClick:  () => void;
  icon?:    React.ReactNode;
  variant?: ButtonVariant;
}

export interface SectionHeaderProps {
  title:          string;
  subtitle?:      string;
  /** Renders a Button on the right */
  primaryAction?: SectionHeaderAction;
  /**
   * Renders a ⋮ menu button on the right.
   * Combined with primaryAction → Button + ⋮ menu.
   */
  menuItems?:     MenuItem[];
  className?:     string;
}

// ── Component ─────────────────────────────────────────────

export function SectionHeader({
  title,
  subtitle,
  primaryAction,
  menuItems,
  className = '',
}: SectionHeaderProps) {
  const hasActions = primaryAction || (menuItems && menuItems.length > 0);

  const menuButton = menuItems && menuItems.length > 0 && (
    <Menu
      trigger={
        <button aria-label="More options" className="inline-flex items-center justify-center w-8 h-8 rounded-xl text-ink-500 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors border-0 bg-transparent cursor-pointer">
          <MoreVertical className="w-4 h-4" aria-hidden="true" />
        </button>
      }
      items={menuItems}
    />
  );

  return (
    <div className={['flex items-start justify-between gap-4', className].join(' ')}>
      {/* Left: title + subtitle + primary action on mobile */}
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight leading-snug">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-300 leading-snug">
            {subtitle}
          </p>
        )}
        {/* Primary action below subtitle on mobile only */}
        {primaryAction && (
          <div className="mt-3 md:hidden">
            <Button
              variant={primaryAction.variant ?? 'primary'}
              size="sm"
              onClick={primaryAction.onClick}
            >
              {primaryAction.icon && primaryAction.icon}
              {primaryAction.label}
            </Button>
          </div>
        )}
      </div>

      {/* Right: primary action (md+) + ⋮ always */}
      {hasActions && (
        <div className="flex items-center gap-2 shrink-0">
          {primaryAction && (
            <div className="hidden md:block">
              <Button
                variant={primaryAction.variant ?? 'primary'}
                size="sm"
                onClick={primaryAction.onClick}
              >
                {primaryAction.icon && primaryAction.icon}
                {primaryAction.label}
              </Button>
            </div>
          )}
          {menuButton}
        </div>
      )}
    </div>
  );
}
