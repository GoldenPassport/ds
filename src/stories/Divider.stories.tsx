import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Plus, Settings } from 'lucide-react';
import { Divider } from '../components/Divider';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Layout/Dividers',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    label:       { control: false,   description: 'Text, icon, button, or any node embedded in the line' },
    align:       { control: 'select', options: ['left', 'center', 'right'], description: 'Position of the label along the line' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'],  description: '"vertical" renders a border-l that fills its container height' },
    className:   { control: 'text' },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    align:       'center',
    orientation: 'horizontal',
  },
  render: (args) => (
    <div className="max-w-xl py-4">
      <Divider {...args} label={<span className="text-sm text-ink-400 dark:text-ink-500 font-body">Section heading</span>} />
    </div>
  ),
};

// ── Simple ────────────────────────────────────────────────

export const Simple: Story = {
  name: 'Simple',
  args: {},
  render: () => (
    <div className="max-w-xl flex flex-col gap-8 py-4">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-body text-ink-500 dark:text-ink-400">Content above</p>
        <Divider />
        <p className="text-sm font-body text-ink-500 dark:text-ink-400">Content below</p>
      </div>
    </div>
  ),
};

// ── With label ────────────────────────────────────────────

export const WithLabel: Story = {
  name: 'With label',
  args: {},
  render: () => (
    <div className="max-w-xl flex flex-col gap-6 py-4">
      <Divider label={<span className="text-sm text-ink-400 dark:text-ink-500 font-body">Or continue with</span>} />
      <Divider label={<span className="text-sm text-ink-400 dark:text-ink-500 font-body">Section title</span>} align="left" />
      <Divider label={<span className="text-sm text-ink-400 dark:text-ink-500 font-body">End of results</span>} align="right" />
    </div>
  ),
};

// ── Alignments ────────────────────────────────────────────

export const Alignments: Story = {
  name: 'Label alignments',
  args: {},
  render: () => (
    <div className="max-w-xl flex flex-col gap-6 py-4">
      <div>
        <p className="text-xs font-semibold font-body text-ink-400 uppercase tracking-wider mb-3">Left</p>
        <Divider align="left" label={<span className="text-sm font-semibold font-body text-ink-500 dark:text-ink-400">January 2026</span>} />
      </div>
      <div>
        <p className="text-xs font-semibold font-body text-ink-400 uppercase tracking-wider mb-3">Center</p>
        <Divider align="center" label={<span className="text-sm font-semibold font-body text-ink-500 dark:text-ink-400">January 2026</span>} />
      </div>
      <div>
        <p className="text-xs font-semibold font-body text-ink-400 uppercase tracking-wider mb-3">Right</p>
        <Divider align="right" label={<span className="text-sm font-semibold font-body text-ink-500 dark:text-ink-400">January 2026</span>} />
      </div>
    </div>
  ),
};

// ── With icon ─────────────────────────────────────────────

export const WithIcon: Story = {
  name: 'With icon',
  args: {},
  render: () => (
    <div className="max-w-xl flex flex-col gap-6 py-4">
      <Divider label={<Settings className="w-4 h-4 text-ink-300 dark:text-ink-600" />} />
      <Divider label={<Plus className="w-4 h-4 text-ink-300 dark:text-ink-600" />} />
    </div>
  ),
};

// ── With badge ────────────────────────────────────────────

export const WithBadge: Story = {
  name: 'With badge',
  args: {},
  render: () => (
    <div className="max-w-xl flex flex-col gap-6 py-4">
      <Divider label={<Badge label="New" variant="active" />} />
      <Divider align="left" label={<Badge label="3 unread" variant="ai" />} />
    </div>
  ),
};

// ── With button ───────────────────────────────────────────

export const WithButton: Story = {
  name: 'With button',
  args: {},
  render: () => (
    <div className="max-w-xl flex flex-col gap-6 py-4">
      <Divider
        label={
          <Button variant="ghost" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Add section
          </Button>
        }
      />
      <Divider
        align="left"
        label={
          <Button variant="ghost" size="sm">
            <Plus className="w-3.5 h-3.5" />
            New workflow
          </Button>
        }
      />
    </div>
  ),
};

// ── With toolbar ──────────────────────────────────────────

export const WithToolbar: Story = {
  name: 'With toolbar',
  args: {},
  render: () => (
    <div className="max-w-xl flex flex-col gap-6 py-4">
      <Divider
        label={
          <span className="flex items-center gap-2">
            <Button variant="ghost" size="sm">Edit</Button>
            <Button variant="ghost" size="sm">Duplicate</Button>
            <Button variant="danger" size="sm">Delete</Button>
          </span>
        }
      />
      <Divider
        align="left"
        label={
          <span className="flex items-center gap-1.5">
            <span className="text-xs font-semibold font-body text-ink-500 dark:text-ink-400 mr-1">Filters</span>
            <Button variant="ghost" size="sm">Status</Button>
            <Button variant="ghost" size="sm">Date</Button>
            <Button variant="ghost" size="sm">Assignee</Button>
          </span>
        }
      />
    </div>
  ),
};

// ── Vertical ──────────────────────────────────────────────

export const Vertical: Story = {
  name: 'Vertical',
  args: {},
  render: () => (
    <div className="flex flex-col gap-8 py-4">
      <div className="flex items-center gap-4 h-8">
        <span className="text-sm font-body text-ink-500">Dashboard</span>
        <Divider orientation="vertical" />
        <span className="text-sm font-body text-ink-500">Workflows</span>
        <Divider orientation="vertical" />
        <span className="text-sm font-body text-ink-500">Reports</span>
        <Divider orientation="vertical" />
        <span className="text-sm font-body text-ink-500">Settings</span>
      </div>

      <div className="flex items-center gap-3 h-9">
        <Button variant="ghost" size="sm">Copy</Button>
        <Divider orientation="vertical" />
        <Button variant="ghost" size="sm">Cut</Button>
        <Button variant="ghost" size="sm">Paste</Button>
        <Divider orientation="vertical" />
        <Button variant="ghost" size="sm">Delete</Button>
      </div>
    </div>
  ),
};

// ── In context ────────────────────────────────────────────

export const InContext: Story = {
  name: 'In context — settings page',
  args: {},
  render: () => (
    <div className="max-w-2xl flex flex-col gap-0 py-4">
      {[
        { label: 'Profile',       desc: 'Update your name, photo, and personal details.' },
        { label: 'Notifications', desc: 'Choose what you want to be notified about.' },
        { label: 'Security',      desc: 'Manage passwords and two-factor authentication.' },
        { label: 'Billing',       desc: 'Manage your subscription and payment methods.' },
      ].map((item, i, arr) => (
        <React.Fragment key={item.label}>
          <div className="py-5">
            <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">{item.label}</p>
            <p className="text-sm font-body text-ink-500 dark:text-ink-400 mt-0.5">{item.desc}</p>
          </div>
          {i < arr.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </div>
  ),
};
