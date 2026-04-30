import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export interface PaginationProps {
  /** Current page, 1-indexed */
  page: number;
  /** Number of rows per page */
  pageSize: number;
  /** Total number of items across all pages */
  total: number;
  /** Called when page or pageSize changes */
  onChange: (page: number, pageSize: number) => void;
  /** Available page-size options. Set to [] to hide the selector. */
  pageSizeOptions?: number[];
  /** Show "Showing X–Y of Z" summary label */
  showSummary?: boolean;
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────

function pageNumbers(page: number, totalPages: number): (number | '…')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages: (number | '…')[] = [1];
  if (page > 3) pages.push('…');

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (page < totalPages - 2) pages.push('…');
  pages.push(totalPages);

  return pages;
}

// ── Sub-components ────────────────────────────────────────

function PageBtn({
  children,
  active,
  disabled,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      className={[
        'inline-flex items-center justify-center w-8 h-8 rounded-xl text-[13px] font-medium font-body',
        'transition-colors duration-100 border-0 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        active
          ? 'bg-primary-500 text-ink-900'
          : 'bg-transparent text-ink-500 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-700',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

// ── Component ─────────────────────────────────────────────

export function Pagination({
  page,
  pageSize,
  total,
  onChange,
  pageSizeOptions = [10, 25, 50, 100],
  showSummary = true,
  className = '',
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = Math.min((page - 1) * pageSize + 1, total);
  const to = Math.min(page * pageSize, total);

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange(p, pageSize);
  };

  const changePageSize = (newSize: number) => {
    // Keep the user on a sensible page after resize
    const newPage = Math.min(page, Math.ceil(total / newSize));
    onChange(newPage, newSize);
  };

  const pages = pageNumbers(page, totalPages);

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 ${className}`}>
      {/* Left: page-size picker + summary */}
      <div className="flex items-center gap-3">
        {pageSizeOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-ink-500 dark:text-ink-300 font-body whitespace-nowrap">
              Rows per page
            </span>
            <select
              value={pageSize}
              onChange={(e) => changePageSize(Number(e.target.value))}
              aria-label="Rows per page"
              className={[
                'text-[13px] font-body font-medium rounded-xl px-2.5 py-1.5',
                'bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700',
                'text-ink-900 dark:text-ink-50',
                'focus:outline-none focus:border-primary-500',
                'transition-all duration-150 cursor-pointer',
              ].join(' ')}
            >
              {pageSizeOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        )}

        {showSummary && total > 0 && (
          <span className="text-[13px] text-ink-500 dark:text-ink-300 font-body whitespace-nowrap">
            {from}–{to} of {total.toLocaleString()}
          </span>
        )}
      </div>

      {/* Right: prev / page numbers / next */}
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <PageBtn
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          ariaLabel="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </PageBtn>

        {pages.map((p, i) =>
          p === '…' ? (
            <span
              key={`ellipsis-${i}`}
              aria-hidden="true"
              className="w-8 h-8 inline-flex items-center justify-center text-[13px] text-ink-500 dark:text-ink-300 select-none"
            >
              …
            </span>
          ) : (
            <PageBtn key={p} active={p === page} onClick={() => goTo(p)} ariaLabel={`Page ${p}`}>
              {p}
            </PageBtn>
          ),
        )}

        <PageBtn
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          ariaLabel="Go to next page"
        >
          <ChevronRight className="w-4 h-4" />
        </PageBtn>
      </nav>
    </div>
  );
}
