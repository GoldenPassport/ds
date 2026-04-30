import type { Meta, StoryObj } from '@storybook/react';
import { DescriptionList, type DescriptionListItem } from '../components/DescriptionList';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Data Display/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs'],
  argTypes: {
    layout: { control: { type: 'select', options: ['stacked', 'side-by-side'] } },
    striped: { control: 'boolean' },
    bordered: { control: 'boolean' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    items: { control: false },
    className: { control: 'text' },
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared fixtures ────────────────────────────────────────

const PROFILE: DescriptionListItem[] = [
  { label: 'Full name', value: 'Leslie Alexander' },
  { label: 'Email address', value: 'leslie.alexander@example.com' },
  { label: 'Job title', value: 'Co-Founder / CEO' },
  { label: 'Department', value: 'Executive' },
  { label: 'Location', value: 'Toronto, Canada' },
];

const PROFILE_WITH_ACTIONS: DescriptionListItem[] = [
  { label: 'Full name', value: 'Leslie Alexander', action: { label: 'Edit', onClick: () => {} } },
  {
    label: 'Email address',
    value: 'leslie.alexander@example.com',
    action: { label: 'Edit', onClick: () => {} },
  },
  { label: 'Job title', value: 'Co-Founder / CEO', action: { label: 'Edit', onClick: () => {} } },
  { label: 'Department', value: 'Executive', action: { label: 'Edit', onClick: () => {} } },
  { label: 'Location', value: 'Toronto, Canada', action: { label: 'Edit', onClick: () => {} } },
  {
    label: 'About',
    value:
      'Passionate about building products that solve real problems. Previously co-founded two SaaS companies.',
    action: { label: 'Edit', onClick: () => {} },
  },
];

const PROJECT: DescriptionListItem[] = [
  { label: 'Project name', value: 'GraphQL API' },
  { label: 'Status', value: <Badge label="Active" variant="active" /> },
  { label: 'Environment', value: 'Production' },
  { label: 'Region', value: 'us-east-1' },
  { label: 'Last deployed', value: '23 April 2026 at 09:41' },
  { label: 'Created', value: '1 January 2024' },
];

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    items: PROFILE,
    layout: 'side-by-side',
    striped: false,
    bordered: false,
  },
};

// ── Side by side ──────────────────────────────────────────

export const SideBySide: Story = {
  name: 'Side by side',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl">
      <DescriptionList items={PROFILE} layout="side-by-side" />
    </div>
  ),
};

// ── Stacked ───────────────────────────────────────────────

export const Stacked: Story = {
  name: 'Stacked',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl">
      <DescriptionList items={PROFILE} layout="stacked" />
    </div>
  ),
};

// ── Striped rows ──────────────────────────────────────────

export const Striped: Story = {
  name: 'Striped rows',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-8">
      <DescriptionList items={PROFILE} layout="side-by-side" striped />
      <DescriptionList items={PROFILE} layout="stacked" striped />
    </div>
  ),
};

// ── With edit actions ─────────────────────────────────────

export const WithActions: Story = {
  name: 'With edit actions',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl">
      <DescriptionList items={PROFILE_WITH_ACTIONS} layout="side-by-side" />
    </div>
  ),
};

// ── Bordered — with header ────────────────────────────────

export const Bordered: Story = {
  name: 'Bordered — with header',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-6">
      <DescriptionList
        items={PROFILE_WITH_ACTIONS}
        layout="side-by-side"
        bordered
        title="Personal information"
        subtitle="Update your photo and personal details here."
      />
      <DescriptionList items={PROJECT} layout="side-by-side" bordered title="Project details" />
    </div>
  ),
};

// ── Bordered stacked ──────────────────────────────────────

export const BorderedStacked: Story = {
  name: 'Bordered — stacked layout',
  args: { items: [] },
  render: () => (
    <div className="max-w-lg">
      <DescriptionList
        items={PROFILE_WITH_ACTIONS}
        layout="stacked"
        bordered
        title="Personal information"
        subtitle="Name, contact details, and role."
      />
    </div>
  ),
};

// ── Bordered striped ──────────────────────────────────────

export const BorderedStriped: Story = {
  name: 'Bordered — striped rows',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl">
      <DescriptionList
        items={PROJECT}
        layout="side-by-side"
        bordered
        striped
        title="Deployment details"
      />
    </div>
  ),
};

// ── With rich values ──────────────────────────────────────

export const WithRichValues: Story = {
  name: 'With rich values — badges and mixed content',
  args: { items: [] },
  render: () => {
    const items: DescriptionListItem[] = [
      { label: 'Name', value: 'GraphQL API', action: { label: 'Edit', onClick: () => {} } },
      {
        label: 'Status',
        value: <Badge label="Active" variant="active" />,
        action: { label: 'Change', onClick: () => {} },
      },
      {
        label: 'Plan',
        value: <Badge label="Running" variant="running" />,
        action: { label: 'Upgrade', onClick: () => {} },
      },
      {
        label: 'Region',
        value: 'us-east-1 (N. Virginia)',
        action: { label: 'Edit', onClick: () => {} },
      },
      { label: 'Last deployed', value: '23 April 2026 at 09:41' },
      {
        label: 'Team',
        value: (
          <div className="flex flex-wrap gap-1.5">
            {['Leslie A.', 'Michael F.', 'Dries V.'].map((n) => (
              <span
                key={n}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-ink-100 dark:bg-ink-700 text-ink-600 dark:text-ink-300 font-body"
              >
                {n}
              </span>
            ))}
          </div>
        ),
        action: { label: 'Manage', onClick: () => {} },
      },
    ];
    return (
      <div className="max-w-2xl">
        <DescriptionList items={items} layout="side-by-side" bordered title="Project overview" />
      </div>
    );
  },
};
