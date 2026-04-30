import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export type StatsVariant = 'cards' | 'bordered' | 'simple';

export interface StatItem {
  label: string;
  value: string | number;
  /** e.g. "+4.75%" or "−1.39%" — include sign and unit */
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  /** Icon node rendered in a coloured background */
  icon?: React.ReactNode;
  /** Secondary line below the value */
  description?: string;
  /** Make the whole card a link */
  href?: string;
}

export interface StatsProps {
  items: StatItem[];
  /** Layout variant. Default: 'cards' */
  variant?: StatsVariant;
  /** Number of columns. Default: auto (1 → sm:2 → lg:cols) */
  columns?: 2 | 3 | 4;
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────

const colsCls: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

function ChangeIndicator({
  change,
  changeType,
}: {
  change: string;
  changeType?: StatItem['changeType'];
}) {
  const type = changeType ?? 'neutral';

  const colours = {
    increase: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    decrease: 'text-red-700  dark:text-red-400  bg-red-50  dark:bg-red-900/20',
    neutral: 'text-ink-500  dark:text-ink-300  bg-ink-100 dark:bg-ink-700/50',
  };

  const Icon = type === 'increase' ? TrendingUp : type === 'decrease' ? TrendingDown : Minus;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium font-body ${colours[type]}`}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      {change}
    </span>
  );
}

// ── StatCard ──────────────────────────────────────────────

function StatCard({ item, variant }: { item: StatItem; variant: StatsVariant }) {
  const inner = (
    <div className="flex flex-col gap-3 h-full">
      {/* Icon + label row */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium font-body text-ink-500 dark:text-ink-300 leading-snug">
          {item.label}
        </p>
        {item.icon && (
          <div className="shrink-0 w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-800 dark:text-primary-400">
            {item.icon}
          </div>
        )}
      </div>

      {/* Value */}
      <p className="text-3xl font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight leading-none">
        {item.value}
      </p>

      {/* Change + description */}
      <div className="flex flex-wrap items-center gap-2 mt-auto">
        {item.change && <ChangeIndicator change={item.change} changeType={item.changeType} />}
        {item.description && (
          <p className="text-xs font-body text-ink-500 dark:text-ink-300">{item.description}</p>
        )}
      </div>
    </div>
  );

  if (variant === 'cards') {
    const cls =
      'block rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-sm px-6 py-5 h-full';
    return item.href ? (
      <a href={item.href} className={`${cls} hover:shadow-md transition-shadow`}>
        {inner}
      </a>
    ) : (
      <div className={cls}>{inner}</div>
    );
  }

  // simple & bordered — no card chrome, padding handled by the grid wrapper
  return <div className="h-full">{inner}</div>;
}

// ── Stats ─────────────────────────────────────────────────

export function Stats({
  items,
  variant = 'cards',
  columns = items.length >= 4 ? 4 : items.length >= 3 ? 3 : 2,
  className = '',
}: StatsProps) {
  const grid = `grid ${colsCls[columns]} gap-4`;

  // ── cards ──────────────────────────────────────────────
  if (variant === 'cards') {
    return (
      <div className={[grid, className].filter(Boolean).join(' ')}>
        {items.map((item, i) => (
          <StatCard key={i} item={item} variant="cards" />
        ))}
      </div>
    );
  }

  // ── simple ─────────────────────────────────────────────
  if (variant === 'simple') {
    return (
      <dl className={[grid, className].filter(Boolean).join(' ')}>
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-2">
            <dt className="text-sm font-medium font-body text-ink-500 dark:text-ink-300">
              {item.label}
            </dt>
            <dd className="flex flex-col gap-1.5">
              <span className="text-3xl font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight leading-none">
                {item.value}
              </span>
              {(item.change || item.description) && (
                <div className="flex flex-wrap items-center gap-2">
                  {item.change && (
                    <ChangeIndicator change={item.change} changeType={item.changeType} />
                  )}
                  {item.description && (
                    <span className="text-xs font-body text-ink-500 dark:text-ink-300">
                      {item.description}
                    </span>
                  )}
                </div>
              )}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  // ── bordered ───────────────────────────────────────────
  return (
    <div
      className={[
        'rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-sm overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <dl
        className={`grid divide-ink-200 dark:divide-ink-700 ${
          columns === 2
            ? 'grid-cols-1 sm:grid-cols-2 sm:divide-x divide-y sm:divide-y-0'
            : columns === 3
              ? 'grid-cols-1 sm:grid-cols-3 sm:divide-x divide-y sm:divide-y-0'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x divide-y lg:divide-y-0'
        }`}
      >
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-3 px-6 py-5">
            <dt className="text-sm font-medium font-body text-ink-500 dark:text-ink-300">
              {item.label}
            </dt>
            <dd className="flex flex-col gap-1.5">
              <span className="text-3xl font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight leading-none">
                {item.value}
              </span>
              {(item.change || item.description) && (
                <div className="flex flex-wrap items-center gap-2">
                  {item.change && (
                    <ChangeIndicator change={item.change} changeType={item.changeType} />
                  )}
                  {item.description && (
                    <span className="text-xs font-body text-ink-500 dark:text-ink-300">
                      {item.description}
                    </span>
                  )}
                </div>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
