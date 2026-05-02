import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Plus, Settings, Share2 } from 'lucide-react';
import { PageHeading } from '../components/PageHeading';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import type { PageHeadingAction } from '../components/PageHeading';

const PLAYGROUND_ACTION_ITEMS: PageHeadingAction[] = [
  {
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
    onClick: () => {},
    variant: 'secondary',
  },
  { label: 'New run', icon: <Plus className="w-4 h-4" />, onClick: () => {}, variant: 'primary' },
];

const PLAYGROUND_TABS = [
  { label: 'Overview', value: 'overview' },
  { label: 'Runs', value: 'runs', badge: 12 },
  { label: 'Deployments', value: 'deployments' },
  { label: 'Settings', value: 'settings' },
];

const PLAYGROUND_BREADCRUMBS = [{ label: 'Projects', href: '#' }, { label: 'GraphQL API' }];

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

// ── Playground ────────────────────────────────────────────

function PlaygroundDemo(args: React.ComponentProps<typeof PageHeading>) {
  const [activeTab, setActiveTab] = React.useState(args.activeTab ?? 'overview');
  React.useEffect(() => {
    setActiveTab(args.activeTab ?? 'overview');
  }, [args.activeTab]);
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
          <Badge label="Active" variant="active" />
          <Badge label="Production" variant="draft" />
        </>
      }
      avatar={<Avatar name="GraphQL API" size={48} />}
    />
  );
}

export const Playground: Story = {
  args: {
    title: 'GraphQL API',
    description: 'Last run 2 hours ago · 4 active deployments',
    bordered: true,
    sticky: false,
    mobileVariant: 'medium',
    activeTab: 'overview',
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
        { label: 'Projects', href: '#' },
        { label: 'GraphQL API', href: '#' },
        { label: 'Settings' },
      ]}
      title="Settings"
      description="Manage configuration and access for this project."
      actions={
        <Button variant="secondary" size="sm">
          Save changes
        </Button>
      }
    />
  ),
};

// ── With back button ──────────────────────────────────────

const BACK_BUTTON_ACTIONS: PageHeadingAction[] = [
  {
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
    onClick: () => {},
    variant: 'secondary',
  },
  { label: 'New run', icon: <Plus className="w-4 h-4" />, onClick: () => {}, variant: 'primary' },
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
          <Badge label="Active" variant="active" />
          <Badge label="Production" variant="draft" />
          <Badge label="v2.4.1" variant="pending" />
        </>
      }
      actions={
        <>
          <Button variant="secondary" size="sm">
            <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
            Share
          </Button>
          <Button variant="primary" size="sm">
            Deploy
          </Button>
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
          <Badge label="Active" variant="active" />
          <Badge label="Public" variant="draft" />
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
        { label: 'Overview', value: 'overview' },
        { label: 'Runs', value: 'runs', badge: 12 },
        { label: 'Deployments', value: 'deployments' },
        { label: 'Settings', value: 'settings' },
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

