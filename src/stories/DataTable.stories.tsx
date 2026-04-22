import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from '../components/DataTable';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    loading:      { control: 'boolean', description: 'Shows a skeleton loading state' },
    stickyHeader: { control: 'boolean', description: 'Pins the header row on scroll' },
    className:    { control: 'text',    description: 'Extra CSS class on the table wrapper' },
    columns:      { control: false,     description: 'Column definitions: { key, header, sortable?, align?, render? }' },
    data:         { control: false,     description: 'Array of row objects — must include an `id` field' },
    emptyState:   { control: false,     description: 'ReactNode shown when data is empty' },
    onRowClick:   { control: false,     description: 'Called with the row object when a row is clicked' },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

type Workflow = {
  id: number;
  name: string;
  dept: string;
  status: 'active' | 'running' | 'pending' | 'draft' | 'failed';
  runs: number;
  lastRun: string;
};

const WORKFLOWS: Workflow[] = [
  { id: 1, name: 'Invoice Approval',         dept: 'Finance',     status: 'active',  runs: 142, lastRun: '2h ago' },
  { id: 2, name: 'Employee Onboarding',       dept: 'HR',          status: 'running', runs: 38,  lastRun: '5m ago' },
  { id: 3, name: 'Customer Support Routing',  dept: 'Support',     status: 'active',  runs: 892, lastRun: '1m ago' },
  { id: 4, name: 'Monthly Report Pipeline',   dept: 'Analytics',   status: 'draft',   runs: 0,   lastRun: 'Never'  },
  { id: 5, name: 'Vendor Onboarding',         dept: 'Procurement', status: 'pending', runs: 12,  lastRun: '1d ago' },
  { id: 6, name: 'PTO Request Handler',       dept: 'HR',          status: 'failed',  runs: 67,  lastRun: '3h ago' },
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

export const Playground: Story = {
  args: { loading: false, stickyHeader: false },
  render: (args) => (
    <DataTable
      {...args}
      columns={columns}
      data={WORKFLOWS}
      onRowClick={row => alert(`Clicked: ${(row as Workflow).name}`)}
    />
  ),
};

export const Default: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={WORKFLOWS}
      onRowClick={row => alert(`Clicked: ${row.name}`)}
    />
  ),
};

export const Sortable: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-xs text-ink-400 dark:text-ink-500 font-body">Click column headers to sort</p>
      <DataTable columns={columns} data={WORKFLOWS} />
    </div>
  ),
};

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
