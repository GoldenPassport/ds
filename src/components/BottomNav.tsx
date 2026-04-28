import React from 'react';

// ── Types ─────────────────────────────────────────────────

export interface BottomNavItem {
  label:   string;
  icon:    React.ReactNode;
  value:   string;
  badge?:  number | string;
}

export type BottomNavAppearance = 'light' | 'dark';

export interface BottomNavProps {
  items:         BottomNavItem[];
  activeValue:   string;
  onChange:      (value: string) => void;
  appearance?:   BottomNavAppearance;
  /** Show text labels below icons (default: true) */
  showLabels?:   boolean;
  /** Fix to the bottom of the viewport (default: true) */
  fixed?:        boolean;
  className?:    string;
}

// ── Tokens ────────────────────────────────────────────────

const tokens = {
  light: {
    bar:            'bg-white dark:bg-ink-900 border-t border-ink-200 dark:border-ink-700',
    itemInactive:   'text-ink-500 dark:text-ink-300',
    itemActive:     'text-primary-600 dark:text-primary-400',
    indicator:      'bg-primary-50 dark:bg-primary-900/30',
    indicatorHover: 'hover:bg-ink-100 dark:hover:bg-ink-800',
    badge:          'bg-primary-500 text-ink-900',
  },
  dark: {
    bar:            'bg-ink-900 border-t border-ink-700',
    itemInactive:   'text-ink-400',
    itemActive:     'text-primary-400',
    indicator:      'bg-ink-700',
    indicatorHover: 'hover:bg-ink-800',
    badge:          'bg-primary-500 text-ink-900',
  },
};

// ── Component ─────────────────────────────────────────────

export function BottomNav({
  items,
  activeValue,
  onChange,
  appearance  = 'light',
  showLabels  = true,
  fixed       = true,
  className   = '',
}: BottomNavProps) {
  const t = tokens[appearance];

  return (
    <nav
      aria-label="Bottom navigation"
      className={[
        fixed ? 'fixed bottom-0 left-0 right-0 z-50' : 'relative',
        t.bar,
        'pb-safe',                  // respects iOS home-indicator safe area
        className,
      ].filter(Boolean).join(' ')}
    >
      <div className="flex items-stretch">
        {items.map(item => {
          const isActive = item.value === activeValue;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className={[
                'flex-1 flex items-center justify-center py-2 min-h-[56px]',
                'transition-colors duration-150 focus:outline-none',
                isActive ? t.itemActive : t.itemInactive,
              ].join(' ')}
            >
              {/* Pill — wraps icon + label */}
              <span
                className={[
                  'relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200',
                  isActive ? t.indicator : t.indicatorHover,
                ].join(' ')}
              >
                {/* Icon */}
                <span className="relative w-6 h-6 flex items-center justify-center shrink-0">
                  {item.icon}
                  {/* Badge */}
                  {item.badge != null && (
                    <span className={[
                      'absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full',
                      'text-[10px] font-bold font-body flex items-center justify-center',
                      t.badge,
                    ].join(' ')}>
                      {item.badge}
                    </span>
                  )}
                </span>

                {/* Label */}
                {showLabels && (
                  <span className={[
                    'text-[11px] font-body leading-none transition-all duration-150',
                    isActive ? 'font-semibold' : 'font-medium',
                  ].join(' ')}>
                    {item.label}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
