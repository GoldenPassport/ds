import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from '../components/DataTable';
import { Badge } from '../components/Badge';

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
  args: { loading: false, stickyHeader: false },
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
  render: () => (
    <DataTable
      columns={columns}
      data={ALL_WORKFLOWS}
      pagination={{ pageSize: 5, pageSizeOptions: [], showSummary: true }}
    />
  ),
};

// ── Other states ──────────────────────────────────────────

export const Loading: Story = {
  render: () => <DataTable columns={columns} data={[]} loading />,
};

export const Empty: Story = {
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
  render: () => (
    <div className="space-y-2">
      <p className="text-xs text-ink-400 dark:text-ink-500 font-body">Click column headers to sort</p>
      <DataTable columns={columns} data={ALL_WORKFLOWS.slice(0, 6)} />
    </div>
  ),
};
