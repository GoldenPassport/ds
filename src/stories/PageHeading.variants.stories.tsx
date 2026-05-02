import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Plus, Settings, Trash2, Bell } from 'lucide-react';
import { PageHeading } from '../components/PageHeading';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';

const meta = {
  title: 'Headings/PageHeading',
  component: PageHeading,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    bordered: { control: 'boolean' },
    sticky: { control: 'boolean' },
    mobileVariant: { control: 'select', options: ['master', 'small', 'medium', 'large'] },
    searchPlaceholder: { control: 'text' },
    onMenuClick: { control: false },
    activeTab: { control: 'select', options: ['overview', 'runs', 'deployments', 'settings'] },
    actions: { control: false },
    meta: { control: false },
    avatar: { control: false },
    breadcrumbs: { control: false },
    tabs: { control: false },
    actionItems: { control: false },
    onBack: { control: false },
    onTabChange: { control: false },
  },
} satisfies Meta<typeof PageHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── With tabs + breadcrumbs ───────────────────────────────

function WithTabsAndBreadcrumbsDemo() {
  const [active, setActive] = React.useState('runs');
  return (
    <PageHeading
      breadcrumbs={[{ label: 'Projects', href: '#' }, { label: 'GraphQL API' }]}
      title="GraphQL API"
      bordered
      actions={
        <>
          <Button variant="secondary" size="sm" aria-label="Settings">
            <Settings className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            New run
          </Button>
        </>
      }
      tabs={[
        { label: 'Overview', value: 'overview' },
        { label: 'Runs', value: 'runs', badge: 4 },
        { label: 'Deployments', value: 'deployments' },
        { label: 'Settings', value: 'settings' },
      ]}
      activeTab={active}
      onTabChange={setActive}
    />
  );
}

export const WithTabsAndBreadcrumbs: Story = {
  name: 'With tabs + breadcrumbs',
  args: { title: '' },
  render: () => <WithTabsAndBreadcrumbsDemo />,
};

// ── Bordered ──────────────────────────────────────────────

export const Bordered: Story = {
  name: 'Bordered — bottom divider',
  args: { title: '' },
  render: () => (
    <PageHeading
      title="Team members"
      description="Manage who has access to this workspace."
      bordered
      actions={
        <Button variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          Invite member
        </Button>
      }
    />
  ),
};

// ── In context ────────────────────────────────────────────

function StickyDemo() {
  const [active, setActive] = React.useState('overview');
  return (
    <div className="h-[500px] overflow-y-auto bg-ink-50 dark:bg-ink-900">
      <PageHeading
        title="GraphQL API"
        description="Last run 2 hours ago · 4 active deployments"
        bordered
        sticky
        actions={
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            New run
          </Button>
        }
        tabs={[
          { label: 'Overview', value: 'overview' },
          { label: 'Runs', value: 'runs', badge: 12 },
          { label: 'Deployments', value: 'deployments' },
          { label: 'Settings', value: 'settings' },
        ]}
        activeTab={active}
        onTabChange={setActive}
      />
      <div className="px-6 py-4 space-y-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="h-12 rounded-xl bg-ink-200 dark:bg-ink-700 flex items-center px-4"
          >
            <span className="text-sm font-body text-ink-500 dark:text-ink-300">
              Content row {i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InContextDemo() {
  const [active, setActive] = React.useState('overview');
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <PageHeading
          breadcrumbs={[{ label: 'Projects', href: '#' }, { label: 'GraphQL API' }]}
          avatar={<Avatar name="GraphQL API" size={48} />}
          title="GraphQL API"
          description="Last run 2 hours ago · 4 active deployments"
          bordered
          meta={
            <>
              <Badge label="Active" variant="active" />
              <Badge label="Production" variant="draft" />
            </>
          }
          actions={
            <>
              <Button variant="secondary" size="sm" aria-label="Delete">
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </Button>
              <Button variant="secondary" size="sm">
                <Settings className="w-3.5 h-3.5" aria-hidden="true" />
                Settings
              </Button>
              <Button variant="primary" size="sm">
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                New run
              </Button>
            </>
          }
          tabs={[
            { label: 'Overview', value: 'overview' },
            { label: 'Runs', value: 'runs', badge: 12 },
            { label: 'Deployments', value: 'deployments' },
            { label: 'Settings', value: 'settings' },
          ]}
          activeTab={active}
          onTabChange={setActive}
        />
        <div className="mt-8 h-64 rounded-2xl border-2 border-dashed border-ink-200 dark:border-ink-700 flex items-center justify-center">
          <span className="text-sm font-body text-ink-500 dark:text-ink-300">
            {active.charAt(0).toUpperCase() + active.slice(1)} content
          </span>
        </div>
      </div>
    </div>
  );
}

export const InContext: Story = {
  name: 'In context',
  args: { title: '' },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2 px-4">Sticky — scrollable container</p>
        <StickyDemo />
      </div>
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2 px-4">In context — full page</p>
        <InContextDemo />
      </div>
    </div>
  ),
};

// ── Master ────────────────────────────────────────────────

const MASTER_ITEMS = [
  { id: 1, name: 'Invoice Approval', dept: 'Finance', status: 'Active' },
  { id: 2, name: 'Employee Onboarding', dept: 'HR', status: 'Running' },
  { id: 3, name: 'Customer Support Routing', dept: 'Support', status: 'Active' },
  { id: 4, name: 'Monthly Report Pipeline', dept: 'Analytics', status: 'Draft' },
  { id: 5, name: 'Vendor Onboarding', dept: 'Procurement', status: 'Pending' },
  { id: 6, name: 'Expense Approval', dept: 'Finance', status: 'Active' },
  { id: 7, name: 'IT Provisioning', dept: 'IT', status: 'Active' },
  { id: 8, name: 'Leave Request', dept: 'HR', status: 'Running' },
];

// ── Master ────────────────────────────────────────────────

function MasterSimpleDemo() {
  const [query, setQuery] = React.useState('');
  const filtered = MASTER_ITEMS.filter(
    (item) =>
      !query ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.dept.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="max-w-lg rounded-2xl overflow-hidden border border-ink-200 dark:border-ink-700">
      <PageHeading
        title=""
        mobileVariant="master-simple"
        bordered
        sticky={false}
        onMenuClick={() => {}}
        searchPlaceholder="Search workflows…"
        searchValue={query}
        onSearchChange={setQuery}
        actions={
          <>
            <button
              type="button"
              aria-label="Notifications"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-500 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
            </button>
            <Avatar name="Leslie Alexander" size={36} />
          </>
        }
      />
      <div className="divide-y divide-ink-100 dark:divide-ink-700">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-sm font-body text-center text-ink-500 dark:text-ink-300">
            No workflows found
          </p>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">
                  {item.name}
                </p>
                <p className="text-xs font-body text-ink-500 dark:text-ink-300">{item.dept}</p>
              </div>
              <Badge
                label={item.status}
                variant={
                  item.status === 'Active'
                    ? 'active'
                    : item.status === 'Running'
                      ? 'running'
                      : item.status === 'Pending'
                        ? 'pending'
                        : 'draft'
                }
                size="sm"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MasterFullDemo() {
  const [active, setActive] = React.useState('overview');
  const [backClicked, setBackClicked] = React.useState(false);
  return (
    <div className="flex flex-col gap-3">
      <PageHeading
        onBack={() => setBackClicked(true)}
        title="GraphQL API"
        description="Last run 2 hours ago"
        bordered
        tabs={[
          { label: 'Overview', value: 'overview' },
          { label: 'Runs', value: 'runs', badge: 12 },
          { label: 'Deployments', value: 'deployments' },
          { label: 'Settings', value: 'settings' },
        ]}
        activeTab={active}
        onTabChange={setActive}
      />
      <p data-testid="active-tab" className="text-xs font-body text-ink-500 dark:text-ink-300">
        Active: {active}
      </p>
      {backClicked && (
        <p data-testid="back-clicked" className="text-xs font-body text-ink-500 dark:text-ink-300">
          Back clicked
        </p>
      )}
    </div>
  );
}

export const Master: Story = {
  name: 'Master',
  args: { title: '' },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">Master — simple</p>
        <MasterSimpleDemo />
      </div>
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">Master — full</p>
        <MasterFullDemo />
      </div>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('back button is present (rendered for both mobile and desktop)', async () => {
      // PageHeading renders two back buttons — one per breakpoint layout — so use findAllByRole
      const backBtns = await canvas.findAllByRole('button', { name: /back/i });
      expect(backBtns.length).toBeGreaterThan(0);
    });

    await step('click "Runs" tab → activeTab updates', async () => {
      // PageHeading renders tab bars for both breakpoints — pick the first match
      const runsBtns = canvas.getAllByRole('button', { name: /^runs/i });
      await user.click(runsBtns[0]);
      await waitFor(() => {
        expect(canvas.getByTestId('active-tab')).toHaveTextContent('runs');
      });
    });

    await step('click "Settings" tab → activeTab updates', async () => {
      const settingsBtns = canvas.getAllByRole('button', { name: /^settings/i });
      await user.click(settingsBtns[0]);
      await waitFor(() => {
        expect(canvas.getByTestId('active-tab')).toHaveTextContent('settings');
      });
    });

    await step('click back button → onBack fires', async () => {
      // Pick the first matching back button (mobile variant has aria-label="Back")
      const backBtns = canvas.getAllByRole('button', { name: /back/i });
      await user.click(backBtns[0]);
      await waitFor(() => {
        expect(canvas.getByTestId('back-clicked')).toBeInTheDocument();
      });
    });
  },
};

