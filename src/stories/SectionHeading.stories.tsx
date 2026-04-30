import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Plus, Download, Settings } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { ContainerList } from '../components/ContainerList';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Headings/SectionHeading',
  component: SectionHeading,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    label: { control: 'text' },
    divider: { control: 'boolean' },
    as: { control: { type: 'select', options: ['h2', 'h3'] } },
    actions: { control: false },
    tabs: { control: false },
  },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared fixtures ───────────────────────────────────────

const PEOPLE = [
  {
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    status: 'active' as const,
  },
  {
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'Co-Founder / CTO',
    status: 'active' as const,
  },
  {
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Business Relations',
    status: 'pending' as const,
  },
];

function PersonRow({ name, email, role, status }: (typeof PEOPLE)[0]) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar name={name} size={36} />
        <div className="min-w-0">
          <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 truncate">
            {name}
          </p>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 truncate">{email}</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <span className="text-sm font-body text-ink-500 dark:text-ink-300">{role}</span>
        <Badge label={status.charAt(0).toUpperCase() + status.slice(1)} variant={status} />
      </div>
    </div>
  );
}

const LIST_ITEMS = PEOPLE.map((p) => <PersonRow key={p.email} {...p} />);

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    title: 'Team members',
    description: 'Manage who has access to this workspace.',
    divider: false,
  },
};

// ── Simple ────────────────────────────────────────────────

export const Simple: Story = {
  name: 'Simple — title only',
  args: { title: '' },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-4">
      <SectionHeading title="Team members" />
      <ContainerList variant="divided" items={LIST_ITEMS} />
    </div>
  ),
};

// ── With description ──────────────────────────────────────

export const WithDescription: Story = {
  name: 'With description',
  args: { title: '' },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-4">
      <SectionHeading title="Team members" description="Manage who has access to this workspace." />
      <ContainerList variant="divided" items={LIST_ITEMS} />
    </div>
  ),
};

// ── With actions ──────────────────────────────────────────

export const WithActions: Story = {
  name: 'With actions',
  args: { title: '' },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-4">
      <SectionHeading
        title="Team members"
        description="Manage who has access to this workspace."
        actions={
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Invite member
          </Button>
        }
      />
      <ContainerList variant="divided" items={LIST_ITEMS} />
    </div>
  ),
};

// ── With divider ──────────────────────────────────────────

export const WithDivider: Story = {
  name: 'With divider',
  args: { title: '' },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-4">
      <SectionHeading
        title="Team members"
        description="Manage who has access to this workspace."
        divider
        actions={
          <Button variant="secondary" size="sm">
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Export
          </Button>
        }
      />
      <ContainerList variant="divided" items={LIST_ITEMS} />
    </div>
  ),
};

// ── With label ────────────────────────────────────────────

export const WithLabel: Story = {
  name: 'With label / eyebrow',
  args: { title: '' },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <SectionHeading
          label="Workspace"
          title="Team members"
          description="Manage who has access to this workspace."
          actions={
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              Invite
            </Button>
          }
        />
        <ContainerList variant="divided" items={LIST_ITEMS} />
      </div>
    </div>
  ),
};

// ── With tabs ─────────────────────────────────────────────

function WithTabsDemo() {
  const [active, setActive] = React.useState('members');
  return (
    <div className="max-w-2xl flex flex-col gap-0">
      <SectionHeading
        title="Team"
        divider
        tabs={[
          { label: 'Members', value: 'members', badge: 12 },
          { label: 'Invitations', value: 'invitations', badge: 3 },
          { label: 'Roles', value: 'roles' },
        ]}
        activeTab={active}
        onTabChange={setActive}
        actions={
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            {active === 'members' ? 'Invite' : active === 'invitations' ? 'New invite' : 'New role'}
          </Button>
        }
      />
      <div className="mt-4">
        <ContainerList variant="divided" items={LIST_ITEMS} />
      </div>
    </div>
  );
}

export const WithTabs: Story = {
  name: 'With tabs',
  args: { title: '' },
  render: () => <WithTabsDemo />,
};

// ── h3 level ──────────────────────────────────────────────

export const AsH3: Story = {
  name: 'h3 — nested section',
  args: { title: '' },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-8">
      {/* Parent h2 section */}
      <div className="flex flex-col gap-4">
        <SectionHeading
          title="Profile"
          description="This information will be displayed publicly."
          divider
        />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <SectionHeading as="h3" title="Personal details" />
            <div className="h-20 rounded-xl border-2 border-dashed border-ink-200 dark:border-ink-700 flex items-center justify-center">
              <span className="text-xs font-body text-ink-500 dark:text-ink-300">Form fields</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <SectionHeading
              as="h3"
              title="Notifications"
              actions={
                <Button variant="secondary" size="sm" aria-label="Settings">
                  <Settings className="w-3.5 h-3.5" />
                </Button>
              }
            />
            <div className="h-20 rounded-xl border-2 border-dashed border-ink-200 dark:border-ink-700 flex items-center justify-center">
              <span className="text-xs font-body text-ink-500 dark:text-ink-300">
                Toggle settings
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  args: { title: '' },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-10">
      {[
        { name: 'Simple', node: <SectionHeading title="Team members" /> },
        {
          name: 'With description',
          node: (
            <SectionHeading
              title="Team members"
              description="Manage who has access to this workspace."
            />
          ),
        },
        {
          name: 'With divider',
          node: (
            <SectionHeading
              title="Team members"
              description="Manage who has access to this workspace."
              divider
            />
          ),
        },
        {
          name: 'With label',
          node: (
            <SectionHeading
              label="Workspace"
              title="Team members"
              description="Manage who has access to this workspace."
            />
          ),
        },
        {
          name: 'With actions',
          node: (
            <SectionHeading
              title="Team members"
              actions={
                <Button variant="primary" size="sm">
                  <Plus className="w-3.5 h-3.5" />
                  Invite
                </Button>
              }
            />
          ),
        },
        {
          name: 'Label + divider + actions',
          node: (
            <SectionHeading
              label="Workspace"
              title="Team members"
              description="Manage who has access to this workspace."
              divider
              actions={
                <Button variant="primary" size="sm">
                  <Plus className="w-3.5 h-3.5" />
                  Invite
                </Button>
              }
            />
          ),
        },
      ].map(({ name, node }) => (
        <div key={name}>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-3">{name}</p>
          {node}
        </div>
      ))}
    </div>
  ),
};
