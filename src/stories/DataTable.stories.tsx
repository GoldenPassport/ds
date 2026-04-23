import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Play, Copy, Trash2, ExternalLink } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Menu } from '../components/Menu';

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    loading:       { control: 'boolean', description: 'Shows a skeleton loading state' },
    stickyHeader:  { control: 'boolean', description: 'Pins the header row on scroll' },
    className:     { control: 'text',    description: 'Extra CSS class on the table wrapper' },
    columns:       { control: false,     description: 'Column definitions: { key, header, sortable?, align?, render?, width? }' },
    data:          { control: false,     description: 'Array of row objects — must include an `id` field' },
    emptyState:    { control: false,     description: 'ReactNode shown when data is empty and not loading' },
    onRowClick:    { control: false,     description: 'Called with the row object when a row is clicked' },
    pagination:    { control: false,     description: '{ pageSize?, pageSizeOptions?, showSummary?, page?, total?, onPageChange? }' },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared fixtures ────────────────────────────────────────

type Workflow = {
  id:      number;
  name:    string;
  dept:    string;
  status:  'active' | 'running' | 'pending' | 'draft' | 'failed';
  runs:    number;
  lastRun: string;
};

const ALL_WORKFLOWS: Workflow[] = [
  { id:  1, name: 'Invoice Approval',         dept: 'Finance',     status: 'active',  runs: 142, lastRun: '2h ago'  },
  { id:  2, name: 'Employee Onboarding',       dept: 'HR',          status: 'running', runs: 38,  lastRun: '5m ago'  },
  { id:  3, name: 'Customer Support Routing',  dept: 'Support',     status: 'active',  runs: 892, lastRun: '1m ago'  },
  { id:  4, name: 'Monthly Report Pipeline',   dept: 'Analytics',   status: 'draft',   runs: 0,   lastRun: 'Never'   },
  { id:  5, name: 'Vendor Onboarding',         dept: 'Procurement', status: 'pending', runs: 12,  lastRun: '1d ago'  },
  { id:  6, name: 'PTO Request Handler',       dept: 'HR',          status: 'failed',  runs: 67,  lastRun: '3h ago'  },
  { id:  7, name: 'Contract Review',           dept: 'Legal',       status: 'active',  runs: 54,  lastRun: '4h ago'  },
  { id:  8, name: 'Budget Approval',           dept: 'Finance',     status: 'pending', runs: 23,  lastRun: '2d ago'  },
  { id:  9, name: 'IT Access Provisioning',    dept: 'IT',          status: 'active',  runs: 311, lastRun: '30m ago' },
  { id: 10, name: 'Customer Refund Handler',   dept: 'Support',     status: 'active',  runs: 188, lastRun: '10m ago' },
  { id: 11, name: 'Payroll Processing',        dept: 'Finance',     status: 'running', runs: 24,  lastRun: '1h ago'  },
  { id: 12, name: 'Compliance Report',         dept: 'Legal',       status: 'draft',   runs: 0,   lastRun: 'Never'   },
  { id: 13, name: 'Incident Response',         dept: 'IT',          status: 'active',  runs: 77,  lastRun: '6h ago'  },
  { id: 14, name: 'Expense Reimbursement',     dept: 'Finance',     status: 'active',  runs: 203, lastRun: '1h ago'  },
  { id: 15, name: 'Sales Pipeline Update',     dept: 'Sales',       status: 'failed',  runs: 91,  lastRun: '5h ago'  },
];

const columns = [
  {
    key: 'name',
    header: 'Workflow',
    sortable: true,
    render: (row: Workflow) => (
      <div>
        <div className="font-semibold text-ink-900 dark:text-ink-50">{row.name}</div>
        <div className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">{row.dept}</div>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Workflow) => (
      <Badge
        label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        variant={row.status}
      />
    ),
  },
  { key: 'runs',    header: 'Runs',     sortable: true, align: 'right' as const },
  { key: 'lastRun', header: 'Last Run', align: 'right' as const },
];

// ── Stories ───────────────────────────────────────────────

export const Playground: Story = {
  args: { loading: false, stickyHeader: false, columns: [], data: [] },
  render: (args) => (
    <DataTable
      {...args}
      columns={columns}
      data={ALL_WORKFLOWS}
      onRowClick={row => alert(`Clicked: ${(row as Workflow).name}`)}
    />
  ),
};

export const Default: Story = {
  args: { columns: [], data: [] },
  render: () => (
    <DataTable
      columns={columns}
      data={ALL_WORKFLOWS.slice(0, 6)}
      onRowClick={row => alert(`Clicked: ${row.name}`)}
    />
  ),
};

// ── Pagination stories ────────────────────────────────────

export const ClientSidePagination: Story = {
  name: 'Pagination — client-side',
  args: { columns: [], data: [] },
  render: () => (
    <DataTable
      columns={columns}
      data={ALL_WORKFLOWS}
      pagination={{ pageSize: 5 }}
      onRowClick={row => alert(`Clicked: ${row.name}`)}
    />
  ),
};

export const CustomPageSizes: Story = {
  name: 'Pagination — custom page sizes',
  args: { columns: [], data: [] },
  render: () => (
    <DataTable
      columns={columns}
      data={ALL_WORKFLOWS}
      pagination={{ pageSize: 3, pageSizeOptions: [3, 5, 10, 15] }}
    />
  ),
};

export const ServerSidePagination: Story = {
  name: 'Pagination — server-side (controlled)',
  args: { columns: [], data: [] },
  render: () => {
    const PAGE_SIZE = 5;
    const [page, setPage]         = React.useState(1);
    const [pageSize, setPageSize] = React.useState(PAGE_SIZE);
    const [loading, setLoading]   = React.useState(false);

    // Simulate a server fetch
    const total = ALL_WORKFLOWS.length;
    const pageData = ALL_WORKFLOWS.slice((page - 1) * pageSize, page * pageSize);

    const handlePageChange = (p: number, ps: number) => {
      setLoading(true);
      setTimeout(() => {
        setPage(p);
        setPageSize(ps);
        setLoading(false);
      }, 400);
    };

    return (
      <div className="space-y-2">
        <p className="text-xs text-ink-400 dark:text-ink-500 font-body">
          Simulates server fetch (400ms delay) on page/size change.
        </p>
        <DataTable
          columns={columns}
          data={pageData}
          loading={loading}
          pagination={{ page, pageSize, total, onPageChange: handlePageChange }}
        />
      </div>
    );
  },
};

export const NoPaginationSizeSelector: Story = {
  name: 'Pagination — no size selector',
  args: { columns: [], data: [] },
  render: () => (
    <DataTable
      columns={columns}
      data={ALL_WORKFLOWS}
      pagination={{ pageSize: 5, pageSizeOptions: [], showSummary: true }}
    />
  ),
};

// ── Action columns ────────────────────────────────────────

export const WithActionButton: Story = {
  name: 'Actions — single button',
  args: { columns: [], data: [] },
  render: () => {
    const columnsWithAction = [
      ...columns,
      {
        key: 'actions',
        header: '',
        width: '80px',
        align: 'right' as const,
        render: (row: Workflow) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={e => { e.stopPropagation(); alert(`Run: ${row.name}`); }}
          >
            <Play className="w-3.5 h-3.5" /> Run
          </Button>
        ),
      },
    ];
    return <DataTable columns={columnsWithAction} data={ALL_WORKFLOWS.slice(0, 6)} />;
  },
};

export const WithActionMenu: Story = {
  name: 'Actions — overflow menu',
  args: { columns: [], data: [] },
  render: () => {
    const columnsWithMenu = [
      ...columns,
      {
        key: 'actions',
        header: '',
        width: '48px',
        align: 'right' as const,
        render: (row: Workflow) => (
          <Menu
            align="right"
            trigger={
              <button
                onClick={e => e.stopPropagation()}
                className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700 hover:text-ink-700 dark:hover:text-ink-200 transition-colors border-0 bg-transparent cursor-pointer text-base leading-none"
              >
                ···
              </button>
            }
            items={[
              { label: 'View details', icon: <ExternalLink className="w-4 h-4" />, onClick: () => alert(`View: ${row.name}`) },
              { label: 'Run now',      icon: <Play className="w-4 h-4" />,         onClick: () => alert(`Run: ${row.name}`) },
              { label: 'Duplicate',    icon: <Copy className="w-4 h-4" />,         onClick: () => alert(`Dupe: ${row.name}`) },
              { label: 'Delete',       icon: <Trash2 className="w-4 h-4" />,       onClick: () => alert(`Delete: ${row.name}`), destructive: true, dividerAbove: true },
            ]}
          />
        ),
      },
    ];
    return <DataTable columns={columnsWithMenu} data={ALL_WORKFLOWS.slice(0, 6)} onRowClick={row => alert(`Row: ${row.name}`)} />;
  },
};

export const WithBothActions: Story = {
  name: 'Actions — button + menu',
  args: { columns: [], data: [] },
  render: () => {
    const columnsWithBoth = [
      ...columns,
      {
        key: 'actions',
        header: '',
        width: '120px',
        align: 'right' as const,
        render: (row: Workflow) => (
          <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
            <Button variant="ghost" size="sm" onClick={() => alert(`Run: ${row.name}`)}>
              <Play className="w-3.5 h-3.5" /> Run
            </Button>
            <Menu
              align="right"
              trigger={
                <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700 hover:text-ink-700 dark:hover:text-ink-200 transition-colors border-0 bg-transparent cursor-pointer text-base leading-none">
                  ···
                </button>
              }
              items={[
                { label: 'Duplicate', icon: <Copy className="w-4 h-4" />,   onClick: () => alert(`Dupe: ${row.name}`) },
                { label: 'Delete',    icon: <Trash2 className="w-4 h-4" />, onClick: () => alert(`Delete: ${row.name}`), destructive: true },
              ]}
            />
          </div>
        ),
      },
    ];
    return <DataTable columns={columnsWithBoth} data={ALL_WORKFLOWS.slice(0, 6)} onRowClick={row => alert(`Row: ${row.name}`)} />;
  },
};

// ── Other states ──────────────────────────────────────────

export const Loading: Story = {
  args: { columns: [], data: [] },
  render: () => <DataTable columns={columns} data={[]} loading />,
};

export const Empty: Story = {
  args: { columns: [], data: [] },
  render: () => (
    <DataTable
      columns={columns}
      data={[]}
      emptyState={
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl">✦</span>
          <p className="font-semibold text-ink-700 dark:text-ink-300">No workflows yet</p>
          <p className="text-ink-400 dark:text-ink-500 text-xs">Create your first workflow to get started</p>
        </div>
      }
    />
  ),
};

export const Sortable: Story = {
  args: { columns: [], data: [] },
  render: () => (
    <div className="space-y-2">
      <p className="text-xs text-ink-400 dark:text-ink-500 font-body">Click column headers to sort</p>
      <DataTable columns={columns} data={ALL_WORKFLOWS.slice(0, 6)} />
    </div>
  ),
};
