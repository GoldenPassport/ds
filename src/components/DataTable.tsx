/**
 * DataTable — generic sortable table component
 *
 * Usage:
 *   <DataTable
 *     columns={[
 *       { key: 'name',    header: 'Workflow',  sortable: true },
 *       { key: 'status',  header: 'Status',    render: row => <Badge label={row.status} variant={row.status} /> },
 *       { key: 'runs',    header: 'Runs',      sortable: true, align: 'right' },
 *       { key: 'lastRun', header: 'Last Run',  align: 'right' },
 *     ]}
 *     data={workflows}
 *     onRowClick={row => navigate(`/workflows/${row.id}`)}
 *     emptyState={<p>No workflows yet.</p>}
 *   />
 */
import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc' | null;

export interface DataTableColumn<T> {
  key:       keyof T | string;
  header:    string;
  sortable?: boolean;
  align?:    'left' | 'center' | 'right';
  render?:   (row: T, index: number) => React.ReactNode;
  width?:    string;
}

export interface DataTableProps<T extends { id: string | number }> {
  columns:      DataTableColumn<T>[];
  data:         T[];
  onRowClick?:  (row: T) => void;
  emptyState?:  React.ReactNode;
  loading?:     boolean;
  className?:   string;
  stickyHeader?: boolean;
}

type SortState = { key: string; direction: SortDirection };

function SortIcon({ state }: { state: SortDirection }) {
  if (state === 'asc')  return <ChevronUp   className="w-3.5 h-3.5 text-gold-500" />;
  if (state === 'desc') return <ChevronDown  className="w-3.5 h-3.5 text-gold-500" />;
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
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<SortState>({ key: '', direction: null });

  const handleSort = (col: DataTableColumn<T>) => {
    if (!col.sortable) return;
    const key = String(col.key);
    setSort(prev => ({
      key,
      direction:
        prev.key === key && prev.direction === 'asc'  ? 'desc' :
        prev.key === key && prev.direction === 'desc' ? null   : 'asc',
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

  const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' };

  return (
    <div className={`bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl overflow-hidden shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
            <tr className="bg-ink-50 dark:bg-ink-700/50 border-b border-ink-100 dark:border-ink-700">
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => handleSort(col)}
                  className={[
                    'px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500 font-body',
                    alignClass[col.align ?? 'left'],
                    col.sortable ? 'cursor-pointer select-none hover:text-ink-700 dark:hover:text-ink-300 transition-colors' : '',
                  ].join(' ')}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <SortIcon state={sort.key === String(col.key) ? sort.direction : null} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-ink-400 dark:text-ink-500 font-body">
                  {emptyState ?? 'No data available'}
                </td>
              </tr>
            ) : (
              sorted.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={[
                    'border-b border-ink-100 dark:border-ink-700 last:border-0',
                    'transition-colors duration-100',
                    onRowClick ? 'cursor-pointer hover:bg-ink-50 dark:hover:bg-ink-700/50' : '',
                  ].join(' ')}
                >
                  {columns.map(col => (
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
    </div>
  );
}
