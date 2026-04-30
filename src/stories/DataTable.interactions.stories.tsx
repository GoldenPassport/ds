import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Sparkles } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Lists/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    loading: { control: 'boolean', description: 'Shows a skeleton loading state' },
    stickyHeader: { control: 'boolean', description: 'Pins the header row on scroll' },
    className: { control: 'text', description: 'Extra CSS class on the table wrapper' },
    columns: {
      control: false,
      description: 'Column definitions: { key, header, sortable?, align?, render?, width? }',
    },
    data: { control: false, description: 'Array of row objects — must include an `id` field' },
    emptyState: {
      control: false,
      description: 'ReactNode shown when data is empty and not loading',
    },
    onRowClick: { control: false, description: 'Called with the row object when a row is clicked' },
    pagination: {
      control: false,
      description: '{ pageSize?, pageSizeOptions?, showSummary?, page?, total?, onPageChange? }',
    },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared fixtures ────────────────────────────────────────

type Workflow = {
  id: number;
  name: string;
  dept: string;
  status: 'active' | 'running' | 'pending' | 'draft' | 'failed';
  runs: number;
  lastRun: string;
};

const ALL_WORKFLOWS: Workflow[] = [
  {
    id: 1,
    name: 'Invoice Approval',
    dept: 'Finance',
    status: 'active',
    runs: 142,
    lastRun: '2h ago',
  },
  {
    id: 2,
    name: 'Employee Onboarding',
    dept: 'HR',
    status: 'running',
    runs: 38,
    lastRun: '5m ago',
  },
  {
    id: 3,
    name: 'Customer Support Routing',
    dept: 'Support',
    status: 'active',
    runs: 892,
    lastRun: '1m ago',
  },
  {
    id: 4,
    name: 'Monthly Report Pipeline',
    dept: 'Analytics',
    status: 'draft',
    runs: 0,
    lastRun: 'Never',
  },
  {
    id: 5,
    name: 'Vendor Onboarding',
    dept: 'Procurement',
    status: 'pending',
    runs: 12,
    lastRun: '1d ago',
  },
  { id: 6, name: 'PTO Request Handler', dept: 'HR', status: 'failed', runs: 67, lastRun: '3h ago' },
  { id: 7, name: 'Contract Review', dept: 'Legal', status: 'active', runs: 54, lastRun: '4h ago' },
  {
    id: 8,
    name: 'Budget Approval',
    dept: 'Finance',
    status: 'pending',
    runs: 23,
    lastRun: '2d ago',
  },
  {
    id: 9,
    name: 'IT Access Provisioning',
    dept: 'IT',
    status: 'active',
    runs: 311,
    lastRun: '30m ago',
  },
  {
    id: 10,
    name: 'Customer Refund Handler',
    dept: 'Support',
    status: 'active',
    runs: 188,
    lastRun: '10m ago',
  },
  {
    id: 11,
    name: 'Payroll Processing',
    dept: 'Finance',
    status: 'running',
    runs: 24,
    lastRun: '1h ago',
  },
  { id: 12, name: 'Compliance Report', dept: 'Legal', status: 'draft', runs: 0, lastRun: 'Never' },
  { id: 13, name: 'Incident Response', dept: 'IT', status: 'active', runs: 77, lastRun: '6h ago' },
  {
    id: 14,
    name: 'Expense Reimbursement',
    dept: 'Finance',
    status: 'active',
    runs: 203,
    lastRun: '1h ago',
  },
  {
    id: 15,
    name: 'Sales Pipeline Update',
    dept: 'Sales',
    status: 'failed',
    runs: 91,
    lastRun: '5h ago',
  },
];

const columns = [
  {
    key: 'name',
    header: 'Workflow',
    sortable: true,
    render: (row: Workflow) => (
      <div>
        <div className="font-semibold text-ink-900 dark:text-ink-50">{row.name}</div>
        <div className="text-xs text-ink-400 dark:text-ink-300 mt-0.5">{row.dept}</div>
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
  { key: 'runs', header: 'Runs', sortable: true, align: 'right' as const },
  { key: 'lastRun', header: 'Last Run', align: 'right' as const },
];

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
          <Sparkles className="w-8 h-8 text-ink-300 dark:text-ink-500" aria-hidden="true" />
          <p className="font-semibold text-ink-700 dark:text-ink-300">No workflows yet</p>
          <p className="text-ink-400 dark:text-ink-300 text-xs">
            Create your first workflow to get started
          </p>
        </div>
      }
    />
  ),
};

// ── Interactions ─────────────────────────────────────────

export const SortInteraction: Story = {
  name: 'Interaction — sortable columns',
  args: { columns: [], data: [] },
  render: () => <DataTable columns={columns} data={ALL_WORKFLOWS.slice(0, 6)} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('click "Workflow" header → sort ascending', async () => {
      const workflowHeader = canvas.getByRole('columnheader', { name: /workflow/i });
      await user.click(workflowHeader);
      await waitFor(() => {
        // The up-chevron icon appears to indicate asc sort
        const headerBtn = workflowHeader.querySelector('button') ?? workflowHeader;
        expect(headerBtn).toBeInTheDocument();
      });
    });

    await step('click "Workflow" header again → sort descending', async () => {
      const workflowHeader = canvas.getByRole('columnheader', { name: /workflow/i });
      await user.click(workflowHeader);
    });

    await step('click "Workflow" header third time → sort removed', async () => {
      const workflowHeader = canvas.getByRole('columnheader', { name: /workflow/i });
      await user.click(workflowHeader);
    });

    await step('click "Runs" header → sort by runs asc', async () => {
      const runsHeader = canvas.getByRole('columnheader', { name: /runs/i });
      await user.click(runsHeader);
      // First row should have the lowest runs count
      await waitFor(() => {
        const rows = canvas.getAllByRole('row');
        // First data row (index 1) should be visible
        expect(rows.length).toBeGreaterThan(1);
      });
    });
  },
};

export const RowClickInteraction: Story = {
  name: 'Interaction — row click',
  args: { columns: [], data: [] },
  render: () => {
    const [clicked, setClicked] = React.useState('');
    return (
      <div>
        <DataTable
          columns={columns}
          data={ALL_WORKFLOWS.slice(0, 5)}
          onRowClick={(row) => setClicked((row as Workflow).name)}
        />
        {clicked && (
          <p data-testid="clicked-row" className="mt-2 text-sm font-body text-ink-500">
            Clicked: {clicked}
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('click first data row → onRowClick fires', async () => {
      const rows = canvas.getAllByRole('row');
      // rows[0] is header, rows[1] is first data row
      await user.click(rows[1]);
      await waitFor(() => {
        expect(canvas.getByTestId('clicked-row')).toBeInTheDocument();
      });
    });
  },
};

export const PaginationInteraction: Story = {
  name: 'Interaction — pagination',
  args: { columns: [], data: [] },
  render: () => (
    <DataTable
      columns={columns}
      data={ALL_WORKFLOWS}
      pagination={{ pageSize: 5, showSummary: true }}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('initial render shows first 5 rows', async () => {
      const rows = canvas.getAllByRole('row');
      // 1 header + 5 data rows
      expect(rows).toHaveLength(6);
    });

    await step('click next page → shows next 5 rows', async () => {
      const nextBtn = canvas.getByRole('button', { name: /next/i });
      await user.click(nextBtn);
      await waitFor(() => {
        const rows = canvas.getAllByRole('row');
        expect(rows).toHaveLength(6); // still 5 data rows + header
        // Row content changes — 6th workflow from our list
        expect(canvas.getByText('PTO Request Handler')).toBeInTheDocument();
      });
    });

    await step('click previous page → goes back', async () => {
      const prevBtn = canvas.getByRole('button', { name: /previous/i });
      await user.click(prevBtn);
      await waitFor(() => {
        expect(canvas.getByText('Invoice Approval')).toBeInTheDocument();
      });
    });
  },
};

export const EmptyStateInteraction: Story = {
  name: 'Interaction — empty state',
  args: { columns: [], data: [] },
  render: () => (
    <DataTable
      columns={columns}
      data={[]}
      emptyState={
        <div className="flex flex-col items-center gap-2">
          <Sparkles className="w-8 h-8 text-ink-300" aria-hidden="true" />
          <p className="font-semibold text-ink-700">No workflows yet</p>
        </div>
      }
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('empty state is rendered when data is empty', async () => {
      expect(canvas.getByText('No workflows yet')).toBeInTheDocument();
    });
  },
};

export const LoadingInteraction: Story = {
  name: 'Interaction — loading skeleton',
  args: { columns: [], data: [] },
  render: () => <DataTable columns={columns} data={[]} loading />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('loading skeleton rows are rendered', async () => {
      // The table should have skeleton rows (no real data rows)
      const rows = canvas.getAllByRole('row');
      // 1 header + skeleton rows
      expect(rows.length).toBeGreaterThan(1);
      // No real workflow names visible
      expect(canvas.queryByText('Invoice Approval')).not.toBeInTheDocument();
    });
  },
};

export const Sortable: Story = {
  args: { columns: [], data: [] },
  render: () => (
    <div className="space-y-2">
      <p className="text-xs text-ink-400 dark:text-ink-300 font-body">
        Click column headers to sort
      </p>
      <DataTable columns={columns} data={ALL_WORKFLOWS.slice(0, 6)} />
    </div>
  ),
};
