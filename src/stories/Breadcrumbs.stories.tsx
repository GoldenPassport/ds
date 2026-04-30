import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from '../components/Breadcrumbs';

const meta = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  argTypes: {
    separator: { control: { type: 'select', options: ['slash', 'chevron'] } },
    homeIcon: { control: 'boolean' },
    contained: { control: 'boolean' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared fixtures ────────────────────────────────────────

const ITEMS = [
  { label: 'Home', href: '#' },
  { label: 'Projects', href: '#' },
  { label: 'GraphQL API' },
];

const DEEP = [
  { label: 'Home', href: '#' },
  { label: 'Settings', href: '#' },
  { label: 'Workspace', href: '#' },
  { label: 'Integrations', href: '#' },
  { label: 'GitHub' },
];

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    items: ITEMS,
    separator: 'chevron',
    homeIcon: false,
    contained: false,
  },
};

// ── Chevron separator ─────────────────────────────────────

export const ChevronSeparator: Story = {
  name: 'Chevron separator',
  args: { items: [] },
  render: () => (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={ITEMS} separator="chevron" ariaLabel="Breadcrumb" />
      <Breadcrumbs items={DEEP} separator="chevron" ariaLabel="Deep breadcrumb" />
    </div>
  ),
};

// ── Slash separator ───────────────────────────────────────

export const SlashSeparator: Story = {
  name: 'Slash separator',
  args: { items: [] },
  render: () => (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={ITEMS} separator="slash" ariaLabel="Breadcrumb" />
      <Breadcrumbs items={DEEP} separator="slash" ariaLabel="Deep breadcrumb" />
    </div>
  ),
};

// ── With home icon ────────────────────────────────────────

export const WithHomeIcon: Story = {
  name: 'With home icon',
  args: { items: [] },
  render: () => (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={ITEMS} homeIcon ariaLabel="Breadcrumb" />
      <Breadcrumbs items={ITEMS} homeIcon separator="slash" ariaLabel="Breadcrumb with slash" />
      <Breadcrumbs items={DEEP} homeIcon ariaLabel="Deep breadcrumb" />
    </div>
  ),
};

// ── Contained bar ─────────────────────────────────────────

export const ContainedBar: Story = {
  name: 'Contained bar',
  args: { items: [] },
  render: () => (
    <div className="flex flex-col gap-6 -mx-4">
      <Breadcrumbs items={ITEMS} contained homeIcon ariaLabel="Breadcrumb" />
      <Breadcrumbs items={DEEP} contained separator="slash" ariaLabel="Deep breadcrumb" />
    </div>
  ),
};

// ── In context — above page heading ──────────────────────

export const InContext: Story = {
  name: 'In context — above page heading',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-1">
      <Breadcrumbs
        items={[
          { label: 'Projects', href: '#' },
          { label: 'GraphQL API', href: '#' },
          { label: 'Settings' },
        ]}
        homeIcon
      />
      <h1 className="mt-2 text-2xl font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight">
        Settings
      </h1>
      <p className="text-sm font-body text-ink-500 dark:text-ink-300">
        Manage configuration, environment variables, and access for this project.
      </p>
    </div>
  ),
};

// ── Single level ──────────────────────────────────────────

export const SingleLevel: Story = {
  name: 'Single level',
  args: { items: [] },
  render: () => (
    <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Dashboard' }]} homeIcon />
  ),
};
