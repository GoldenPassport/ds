import React, { useEffect, useRef, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from './Input';

// ── Types ─────────────────────────────────────────────────

export interface SearchCardProps {
  /** Controlled search query */
  value:             string;
  /** Called with the (debounced) query string — fire your server request here */
  onChange:          (query: string) => void;
  /** Total number of matching items returned by the server */
  total?:            number;
  /** Current page, 1-indexed — used to compute the "Showing X–Y" range */
  page?:             number;
  /** Items per page (the server-side limit) */
  pageSize?:         number;
  /** Called when the user picks a new page size */
  onPageSizeChange?: (size: number) => void;
  /** Available page-size options. Default [10, 25, 50, 100] */
  pageSizeOptions?:  number[];
  /** Debounce delay in ms before onChange fires. Default 350 */
  debounce?:         number;
  /** Show a spinner inside the search icon while the server is fetching */
  loading?:          boolean;
  placeholder?:      string;
  /** Optional label rendered above the input */
  label?:            string;
  /** Slot for filter chips, dropdowns, or any extra controls */
  filters?:          React.ReactNode;
  className?:        string;
}

// ── Component ─────────────────────────────────────────────

export function SearchCard({
  value,
  onChange,
  total,
  page             = 1,
  pageSize         = 25,
  onPageSizeChange,
  pageSizeOptions  = [10, 25, 50, 100],
  debounce         = 350,
  loading          = false,
  placeholder      = 'Search…',
  label,
  filters,
  className        = '',
}: SearchCardProps) {
  const [draft, setDraft] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // Keep local draft in sync if parent resets the value (e.g. clear-all)
  useEffect(() => { setDraft(value); }, [value]);

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(timer.current), []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setDraft(q);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(q), debounce);
  }

  function handleClear() {
    setDraft('');
    clearTimeout(timer.current);
    onChange('');
  }

  // ── Summary text ──────────────────────────────────────────
  const hasTotal = total !== undefined;
  const from = hasTotal && total > 0 ? (page - 1) * pageSize + 1 : 0;
  const to   = hasTotal             ? Math.min(page * pageSize, total) : 0;

  const summaryText = !hasTotal
    ? null
    : total === 0
      ? 'No results found'
      : total <= pageSize
        ? `${total.toLocaleString()} result${total !== 1 ? 's' : ''}`
        : `Showing ${from.toLocaleString()}–${to.toLocaleString()} of ${total.toLocaleString()} results`;

  const showFooter = hasTotal || !!onPageSizeChange;

  return (
    <div
      className={[
        'bg-white dark:bg-ink-800',
        'border border-ink-200 dark:border-ink-700 rounded-2xl shadow-sm',
        'p-4 flex flex-col gap-3',
        className,
      ].join(' ')}
    >
      {/* ── Search input ──────────────────────────────────── */}
      <Input
        type="search"
        value={draft}
        onChange={handleChange}
        placeholder={placeholder}
        label={label}
        icon={
          loading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Search  className="w-4 h-4" />
        }
        rightAction={
          draft ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={handleClear}
              className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors p-1 rounded-xl"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : undefined
        }
      />

      {/* ── Filters slot ──────────────────────────────────── */}
      {filters && (
        <div className="flex flex-wrap items-center gap-2">
          {filters}
        </div>
      )}

      {/* ── Footer: result count + page-size picker ───────── */}
      {showFooter && (
        <div className="flex items-center justify-between gap-3">
          {/* Result summary */}
          <span className="text-xs font-body text-ink-400 dark:text-ink-500">
            {loading && !hasTotal ? 'Searching…' : summaryText}
          </span>

          {/* Page-size selector */}
          {onPageSizeChange && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-body text-ink-400 dark:text-ink-500">Per page</span>
              <select
                value={pageSize}
                onChange={e => onPageSizeChange(Number(e.target.value))}
                aria-label="Items per page"
                className={[
                  'text-xs font-body font-medium rounded-xl px-2 py-1 cursor-pointer',
                  'bg-ink-50 dark:bg-ink-700',
                  'border border-ink-200 dark:border-ink-600',
                  'text-ink-700 dark:text-ink-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500',
                  'transition-colors',
                ].join(' ')}
              >
                {pageSizeOptions.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
