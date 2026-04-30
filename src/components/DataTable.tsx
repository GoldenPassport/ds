/**
 * DataTable — generic sortable table with optional pagination
 *
 * Client-side pagination (DataTable slices data internally):
 *   <DataTable columns={cols} data={allRows} pagination={{ pageSize: 10 }} />
 *
 * Server-side pagination (consumer owns page state):
 *   <DataTable
 *     columns={cols}
 *     data={pageOfRows}
 *     pagination={{ page, pageSize, total, onPageChange: (p, ps) => fetch(p, ps) }}
 *   />
 */
import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Pagination } from './Pagination';

export type SortDirection = 'asc' | 'desc' | null;

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, index: number) => React.ReactNode;
  width?: string;
}

export interface DataTablePaginationConfig {
  /** Default/initial page size (default: 10) */
  pageSize?: number;
  /** Page size options shown in the selector. Pass [] to hide. */
  pageSizeOptions?: number[];
  /** Show "X–Y of Z" summary (default: true) */
  showSummary?: boolean;

  // ── Controlled / server-side mode ──────────────────────
  /** Current page (1-indexed). When set, DataTable is in controlled mode. */
  page?: number;
  /** Total item count across all pages. Required for controlled mode. */
  total?: number;
  /** Called when the user changes page or page size (controlled mode). */
  onPageChange?: (page: number, pageSize: number) => void;
}

export interface DataTableProps<T extends { id: string | number }> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  loading?: boolean;
  className?: string;
  stickyHeader?: boolean;
  /** Accessible name for the table element */
  ariaLabel?: string;
  /** Strips the outer card wrapper — use when DataTable lives inside ListCard */
  flat?: boolean;
  /** Attach pagination below the table. Omit to disable. */
  pagination?: DataTablePaginationConfig;
}

type SortState = { key: string; direction: SortDirection };

function SortIcon({ state }: { state: SortDirection }) {
  if (state === 'asc') return <ChevronUp className="w-3.5 h-3.5 text-primary-500" />;
  if (state === 'desc') return <ChevronDown className="w-3.5 h-3.5 text-primary-500" />;
  return <ChevronsUpDown className="w-3.5 h-3.5 text-ink-300 dark:text-ink-600" />;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  emptyState,
  loading = false,
  className = '',
  stickyHeader = false,
  ariaLabel,
  flat = false,
  pagination,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<SortState>({ key: '', direction: null });
  const [internalPage, setInternalPage] = React.useState(1);
  const [internalPageSize, setInternalPageSize] = React.useState(pagination?.pageSize ?? 10);

  const controlled = pagination !== undefined && pagination.total !== undefined;
  const hasPagination = pagination !== undefined;

  // Resolve effective page / pageSize
  const page = controlled ? (pagination.page ?? 1) : internalPage;
  const pageSize = controlled ? (pagination.pageSize ?? internalPageSize) : internalPageSize;
  const total = controlled ? (pagination.total ?? 0) : data.length;

  const handlePageChange = (p: number, ps: number) => {
    if (controlled) {
      pagination.onPageChange?.(p, ps);
    } else {
      setInternalPage(p);
      setInternalPageSize(ps);
    }
  };

  // Sort
  const handleSort = (col: DataTableColumn<T>) => {
    if (!col.sortable) return;
    const key = String(col.key);
    setSort((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'asc'
          ? 'desc'
          : prev.key === key && prev.direction === 'desc'
            ? null
            : 'asc',
    }));
  };

  const sorted = React.useMemo(() => {
    if (!sort.key || !sort.direction) return data;
    return [...data].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sort.key];
      const bv = (b as Record<string, unknown>)[sort.key];
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [data, sort]);

  // Slice for client-side pagination
  const visibleRows = React.useMemo(() => {
    if (!hasPagination || controlled) return sorted;
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, hasPagination, controlled, page, pageSize]);

  const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' };

  const inner = (
    <>
      <div className="overflow-x-auto">
        <table aria-label={ariaLabel} className="w-full border-collapse">
          <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
            <tr className="bg-ink-50 dark:bg-ink-700/50 border-b border-ink-100 dark:border-ink-700">
              {columns.map((col) => {
                const colKey = String(col.key);
                const sortDir = sort.key === colKey ? sort.direction : null;
                const ariaSortValue = col.sortable
                  ? sortDir === 'asc'
                    ? 'ascending'
                    : sortDir === 'desc'
                      ? 'descending'
                      : 'none'
                  : undefined;
                return (
                  <th
                    key={colKey}
                    scope="col"
                    style={col.width ? { width: col.width } : undefined}
                    onClick={() => handleSort(col)}
                    aria-sort={ariaSortValue}
                    className={[
                      'px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-300 font-body',
                      alignClass[col.align ?? 'left'],
                      col.sortable
                        ? 'cursor-pointer select-none hover:text-ink-700 dark:hover:text-ink-300 transition-colors'
                        : '',
                    ].join(' ')}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col.header || (
                        <span className="sr-only">
                          {colKey.charAt(0).toUpperCase() + colKey.slice(1)}
                        </span>
                      )}
                      {col.sortable && (
                        <SortIcon state={sort.key === String(col.key) ? sort.direction : null} />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </td>
              </tr>
            ) : visibleRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-ink-500 dark:text-ink-300 font-body"
                >
                  {emptyState ?? 'No data available'}
                </td>
              </tr>
            ) : (
              visibleRows.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                  className={[
                    'border-b border-ink-100 dark:border-ink-700 last:border-0',
                    'transition-colors duration-100',
                    onRowClick
                      ? 'cursor-pointer hover:bg-ink-50 dark:hover:bg-ink-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500/40'
                      : '',
                  ].join(' ')}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-5 py-3.5 text-sm font-body text-ink-900 dark:text-ink-50 ${alignClass[col.align ?? 'left']}`}
                    >
                      {col.render
                        ? col.render(row, i)
                        : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {hasPagination && (
        <div className="px-5 py-3.5 border-t border-ink-100 dark:border-ink-700 bg-ink-50/50 dark:bg-ink-700/20">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            pageSizeOptions={pagination.pageSizeOptions ?? [10, 25, 50]}
            showSummary={pagination.showSummary ?? true}
          />
        </div>
      )}
    </>
  );

  if (flat) return inner;

  return (
    <div
      aria-busy={loading || undefined}
      className={`flex flex-col gap-0 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl overflow-hidden shadow-sm ${className}`}
    >
      {inner}
    </div>
  );
}
