import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Plus, Settings, Trash2, Share2, Bell, MoreVertical } from 'lucide-react';
import { PageHeading } from '../components/PageHeading';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import type { PageHeadingAction } from '../components/PageHeading';

const PLAYGROUND_ACTION_ITEMS: PageHeadingAction[] = [
  { label: 'Settings', icon: <Settings className="w-4 h-4" />, onClick: () => {}, variant: 'secondary' },
  { label: 'New run',  icon: <Plus      className="w-4 h-4" />, onClick: () => {}, variant: 'primary'   },
];

const PLAYGROUND_TABS = [
  { label: 'Overview',    value: 'overview' },
  { label: 'Runs',        value: 'runs',    badge: 12 },
  { label: 'Deployments', value: 'deployments' },
  { label: 'Settings',    value: 'settings' },
];

const PLAYGROUND_BREADCRUMBS = [
  { label: 'Projects', href: '#' },
  { label: 'GraphQL API' },
];

const meta = {
  title: 'Headings/PageHeading',
  component: PageHeading,
  tags: ['autodocs'],
  argTypes: {
    title:         { control: 'text' },
    description:   { control: 'text' },
    bordered:      { control: 'boolean' },
    sticky:        { control: 'boolean' },
    mobileVariant:      { control: 'select', options: ['master', 'small', 'medium', 'large'] },
    searchPlaceholder:  { control: 'text' },
    onMenuClick:        { control: false },
    activeTab:     { control: 'select', options: ['overview', 'runs', 'deployments', 'settings'] },
    actions:       { control: false },
    meta:          { control: false },
    avatar:        { control: false },
    breadcrumbs:   { control: false },
    tabs:          { control: false },
    actionItems:   { control: false },
    onBack:        { control: false },
    onTabChange:   { control: false },
  },
} satisfies Meta<typeof PageHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

function PlaygroundDemo(args: React.ComponentProps<typeof PageHeading>) {
  const [activeTab, setActiveTab] = React.useState(args.activeTab ?? 'overview');
  React.useEffect(() => { setActiveTab(args.activeTab ?? 'overview'); }, [args.activeTab]);
  return (
    <PageHeading
      {...args}
      actionItems={PLAYGROUND_ACTION_ITEMS}
      breadcrumbs={PLAYGROUND_BREADCRUMBS}
      tabs={PLAYGROUND_TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBack={() => {}}
      meta={
        <>
          <Badge label="Active"     variant="active" />
          <Badge label="Production" variant="draft"  />
        </>
      }
      avatar={<Avatar name="GraphQL API" size={48} />}
    />
  );
}

export const Playground: Story = {
  args: {
    title:         'GraphQL API',
    description:   'Last run 2 hours ago · 4 active deployments',
    bordered:      true,
    sticky:        false,
    mobileVariant: 'medium',
    activeTab:     'overview',
  },
  render: (args) => <PlaygroundDemo {...args} />,
};

// ── Simple ────────────────────────────────────────────────

export const Simple: Story = {
  name: 'Simple — title + actions',
  args: { title: '' },
  render: () => (
    <PageHeading
      title="Projects"
      description="All projects in your workspace."
      actions={
        <Button variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          New project
        </Button>
      }
    />
  ),
};

// ── With breadcrumbs ──────────────────────────────────────

export const WithBreadcrumbs: Story = {
  name: 'With breadcrumbs',
  args: { title: '' },
  render: () => (
    <PageHeading
      breadcrumbs={[
        { label: 'Projects',    href: '#' },
        { label: 'GraphQL API', href: '#' },
        { label: 'Settings' },
      ]}
      title="Settings"
      description="Manage configuration and access for this project."
      actions={
        <Button variant="secondary" size="sm">Save changes</Button>
      }
    />
  ),
};

// ── With back button ──────────────────────────────────────

const BACK_BUTTON_ACTIONS: PageHeadingAction[] = [
  { label: 'Settings', icon: <Settings className="w-4 h-4" />, onClick: () => {}, variant: 'secondary' },
  { label: 'New run',  icon: <Plus      className="w-4 h-4" />, onClick: () => {}, variant: 'primary'   },
];

export const WithBackButton: Story = {
  name: 'With back button',
  args: { title: '' },
  render: () => (
    <PageHeading
      onBack={() => {}}
      title="GraphQL API"
      description="Last run 2 hours ago · 4 active deployments"
      actionItems={BACK_BUTTON_ACTIONS}
    />
  ),
};

// ── With meta ─────────────────────────────────────────────

export const WithMeta: Story = {
  name: 'With meta — badges',
  args: { title: '' },
  render: () => (
    <PageHeading
      title="GraphQL API"
      meta={
        <>
          <Badge label="Active"      variant="active" />
          <Badge label="Production"  variant="draft" />
          <Badge label="v2.4.1"      variant="pending" />
        </>
      }
      actions={
        <>
          <Button variant="secondary" size="sm">
            <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
            Share
          </Button>
          <Button variant="primary" size="sm">Deploy</Button>
        </>
      }
    />
  ),
};

// ── With avatar ───────────────────────────────────────────

export const WithAvatar: Story = {
  name: 'With avatar',
  args: { title: '' },
  render: () => (
    <PageHeading
      avatar={<Avatar name="GraphQL API" size={48} />}
      title="GraphQL API"
      description="Created by Leslie Alexander · 3 members"
      meta={
        <>
          <Badge label="Active"  variant="active" />
          <Badge label="Public"  variant="draft" />
        </>
      }
      actions={
        <>
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
    />
  ),
};

// ── With tabs ─────────────────────────────────────────────

function WithTabsDemo() {
  const [active, setActive] = React.useState('overview');
  return (
    <PageHeading
      title="GraphQL API"
      description="Last run 2 hours ago"
      bordered
      actions={
        <Button variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          New run
        </Button>
      }
      tabs={[
        { label: 'Overview',    value: 'overview' },
        { label: 'Runs',        value: 'runs',    badge: 12 },
        { label: 'Deployments', value: 'deployments' },
        { label: 'Settings',    value: 'settings' },
      ]}
      activeTab={active}
      onTabChange={setActive}
    />
  );
}

export const WithTabs: Story = {
  name: 'With tabs',
  args: { title: '' },
  render: () => <WithTabsDemo />,
};

// ── With tabs + breadcrumbs ───────────────────────────────

function WithTabsAndBreadcrumbsDemo() {
  const [active, setActive] = React.useState('runs');
  return (
    <PageHeading
      breadcrumbs={[
        { label: 'Projects',    href: '#' },
        { label: 'GraphQL API' },
      ]}
      title="GraphQL API"
      bordered
      actions={
        <>
          <Button variant="secondary" size="sm">
            <Settings className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            New run
          </Button>
        </>
      }
      tabs={[
        { label: 'Overview',    value: 'overview' },
        { label: 'Runs',        value: 'runs',    badge: 4 },
        { label: 'Deployments', value: 'deployments' },
        { label: 'Settings',    value: 'settings' },
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

function InContextDemo() {
  const [active, setActive] = React.useState('overview');
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900">
      <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 pt-8">
        <PageHeading
          breadcrumbs={[
            { label: 'Projects', href: '#' },
            { label: 'GraphQL API' },
          ]}
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
              <Button variant="secondary" size="sm">
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
            { label: 'Overview',    value: 'overview' },
            { label: 'Runs',        value: 'runs',    badge: 12 },
            { label: 'Deployments', value: 'deployments' },
            { label: 'Settings',    value: 'settings' },
          ]}
          activeTab={active}
          onTabChange={setActive}
        />
        <div className="mt-8 h-64 rounded-2xl border-2 border-dashed border-ink-200 dark:border-ink-700 flex items-center justify-center">
          <span className="text-sm font-body text-ink-400 dark:text-ink-500">
            {active.charAt(0).toUpperCase() + active.slice(1)} content
          </span>
        </div>
      </div>
    </div>
  );
}

export const InContext: Story = {
  name: 'In context — full page',
  args: { title: '' },
  render: () => <InContextDemo />,
};

// ── Sticky ────────────────────────────────────────────────

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
          { label: 'Overview',    value: 'overview' },
          { label: 'Runs',        value: 'runs',    badge: 12 },
          { label: 'Deployments', value: 'deployments' },
          { label: 'Settings',    value: 'settings' },
        ]}
        activeTab={active}
        onTabChange={setActive}
      />
      <div className="px-6 py-4 space-y-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="h-12 rounded-xl bg-ink-200 dark:bg-ink-700 flex items-center px-4">
            <span className="text-sm font-body text-ink-500 dark:text-ink-400">Content row {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Sticky: Story = {
  name: 'Sticky — scrollable container',
  args: { title: '' },
  render: () => <StickyDemo />,
};

// ── Master ────────────────────────────────────────────────

export const Master: Story = {
  name: 'Master — search bar nav',
  args: { title: '' },
  render: () => (
    <div className="bg-ink-50 dark:bg-ink-900 p-4 space-y-4">
      <p className="text-xs font-body text-ink-400 mb-1">With hamburger + bell + avatar</p>
      <PageHeading
        title=""
        mobileVariant="master"
        bordered
        sticky={false}
        onMenuClick={() => {}}
        searchPlaceholder="Search product"
        actions={
          <>
            <button type="button" className="inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors">
              <Bell className="w-5 h-5" aria-hidden="true" />
            </button>
            <Avatar name="Leslie Alexander" size={36} />
          </>
        }
      />
      <p className="text-xs font-body text-ink-400 mb-1 mt-6">With bell + 3-dot menu (no hamburger)</p>
      <PageHeading
        title=""
        mobileVariant="master"
        bordered
        searchPlaceholder="Search…"
        actions={
          <>
            <button type="button" className="inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors">
              <Bell className="w-5 h-5" aria-hidden="true" />
            </button>
            <button type="button" className="inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors">
              <MoreVertical className="w-5 h-5" aria-hidden="true" />
            </button>
          </>
        }
      />
      <p className="text-xs font-body text-ink-400 mb-1 mt-6">With CTA button</p>
      <PageHeading
        title=""
        mobileVariant="master"
        bordered
        onMenuClick={() => {}}
        searchPlaceholder="Search projects"
        actions={
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            New
          </Button>
        }
      />
    </div>
  ),
};
