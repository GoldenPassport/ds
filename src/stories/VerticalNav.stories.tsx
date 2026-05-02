import { expect, userEvent, within, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import {
  LayoutDashboard,
  Users,
  BarChart2,
  FileText,
  Settings,
  FolderOpen,
  Bell,
  HelpCircle,
  ShieldCheck,
  Zap,
  GitBranch,
  Database,
  Globe,
} from 'lucide-react';
import { VerticalNav } from '../components/VerticalNav';

const meta = {
  title: 'Navigation/VerticalNav',
  component: VerticalNav,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    spacing: { control: 'select', options: ['none', 'xs', 'sm', 'md'] },
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'full'] },
    shadow: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    bordered: { control: 'boolean' },
    activeIndicator: { control: 'boolean' },
    groups: { control: false },
  },
} satisfies Meta<typeof VerticalNav>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Fixtures ──────────────────────────────────────────────

const SIMPLE_ITEMS = [
  { label: 'Dashboard', href: '#', active: true },
  { label: 'Team', href: '#' },
  { label: 'Projects', href: '#' },
  { label: 'Calendar', href: '#' },
  { label: 'Documents', href: '#' },
  { label: 'Reports', href: '#' },
];

const BADGE_ITEMS = [
  { label: 'Dashboard', href: '#', active: true, badge: 5 },
  { label: 'Team', href: '#', badge: 12 },
  { label: 'Projects', href: '#', badge: 3 },
  { label: 'Calendar', href: '#' },
  { label: 'Documents', href: '#', badge: 'New' },
  { label: 'Reports', href: '#' },
];

const ICON_ITEMS = [
  { label: 'Dashboard', href: '#', active: true, icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Team', href: '#', icon: <Users className="w-5 h-5" /> },
  { label: 'Projects', href: '#', icon: <FolderOpen className="w-5 h-5" /> },
  { label: 'Calendar', href: '#', icon: <Bell className="w-5 h-5" /> },
  { label: 'Documents', href: '#', icon: <FileText className="w-5 h-5" /> },
  { label: 'Reports', href: '#', icon: <BarChart2 className="w-5 h-5" /> },
];

const ICON_BADGE_ITEMS = [
  {
    label: 'Dashboard',
    href: '#',
    active: true,
    icon: <LayoutDashboard className="w-5 h-5" />,
    badge: 5,
  },
  { label: 'Team', href: '#', icon: <Users className="w-5 h-5" />, badge: 12 },
  { label: 'Projects', href: '#', icon: <FolderOpen className="w-5 h-5" /> },
  { label: 'Documents', href: '#', icon: <FileText className="w-5 h-5" />, badge: 'New' },
  { label: 'Reports', href: '#', icon: <BarChart2 className="w-5 h-5" /> },
];

const SECONDARY_GROUPS = [
  {
    items: [
      {
        label: 'Dashboard',
        href: '#',
        active: true,
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        label: 'Team',
        icon: <Users className="w-5 h-5" />,
        children: [
          { label: 'Members', href: '#', active: false },
          { label: 'Invitations', href: '#', active: false },
          { label: 'Roles', href: '#', active: false },
        ],
      },
      {
        label: 'Projects',
        icon: <FolderOpen className="w-5 h-5" />,
        children: [
          { label: 'All projects', href: '#' },
          { label: 'Archived', href: '#' },
        ],
      },
      { label: 'Reports', href: '#', icon: <BarChart2 className="w-5 h-5" /> },
      { label: 'Documents', href: '#', icon: <FileText className="w-5 h-5" /> },
    ],
  },
];

const GROUPED_GROUPS = [
  {
    label: 'General',
    items: [
      {
        label: 'Dashboard',
        href: '#',
        active: true,
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      { label: 'Analytics', href: '#', icon: <BarChart2 className="w-5 h-5" />, badge: 'New' },
      { label: 'Documents', href: '#', icon: <FileText className="w-5 h-5" /> },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Workflows', href: '#', icon: <Zap className="w-5 h-5" /> },
      { label: 'Pipelines', href: '#', icon: <GitBranch className="w-5 h-5" /> },
      { label: 'Integrations', href: '#', icon: <Globe className="w-5 h-5" /> },
      { label: 'Databases', href: '#', icon: <Database className="w-5 h-5" /> },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Team', href: '#', icon: <Users className="w-5 h-5" /> },
      { label: 'Permissions', href: '#', icon: <ShieldCheck className="w-5 h-5" /> },
      { label: 'Settings', href: '#', icon: <Settings className="w-5 h-5" /> },
      { label: 'Help', href: '#', icon: <HelpCircle className="w-5 h-5" /> },
    ],
  },
];

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    size: 'md',
    spacing: 'xs',
    radius: 'lg',
    shadow: 'none',
    bordered: false,
    activeIndicator: false,
    groups: [],
  },
  render: (args) => (
    <div className="bg-white dark:bg-ink-900 rounded-2xl p-4 w-64">
      <VerticalNav {...args} groups={[{ items: ICON_ITEMS }]} />
    </div>
  ),
};

// ── Simple ────────────────────────────────────────────────

export const Simple: Story = {
  name: 'Simple',
  args: { groups: [] },
  render: () => (
    <div className="bg-white dark:bg-ink-800 rounded-2xl p-4 w-56">
      <VerticalNav groups={[{ items: SIMPLE_ITEMS }]} />
    </div>
  ),
};

// ── With badges ───────────────────────────────────────────

export const WithBadges: Story = {
  name: 'With badges',
  args: { groups: [] },
  render: () => (
    <div className="bg-white dark:bg-ink-800 rounded-2xl p-4 w-56">
      <VerticalNav groups={[{ items: BADGE_ITEMS }]} />
    </div>
  ),
};

// ── With icons ────────────────────────────────────────────

export const WithIcons: Story = {
  name: 'With icons',
  args: { groups: [] },
  render: () => (
    <div className="bg-white dark:bg-ink-900 rounded-2xl p-4 w-64">
      <VerticalNav groups={[{ items: ICON_ITEMS }]} />
    </div>
  ),
};

// ── With icons and badges ─────────────────────────────────

export const WithIconsAndBadges: Story = {
  name: 'With icons and badges',
  args: { groups: [] },
  render: () => (
    <div className="bg-white dark:bg-ink-900 rounded-2xl p-4 w-64">
      <VerticalNav groups={[{ items: ICON_BADGE_ITEMS }]} />
    </div>
  ),
};

// ── With secondary navigation ─────────────────────────────

export const WithSecondaryNav: Story = {
  name: 'With secondary navigation',
  args: { groups: [] },
  render: () => (
    <div className="bg-white dark:bg-ink-900 rounded-2xl p-4 w-64">
      <VerticalNav groups={SECONDARY_GROUPS} />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('"Team" group is collapsed initially', async () => {
      expect(canvas.getByRole('button', { name: /^team$/i })).toHaveAttribute('aria-expanded', 'false');
    });
    await step('click Team → group expands, child items appear', async () => {
      await user.click(canvas.getByRole('button', { name: /^team$/i }));
      await waitFor(() => {
        expect(canvas.getByRole('button', { name: /^team$/i })).toHaveAttribute('aria-expanded', 'true');
        expect(canvas.getByRole('link', { name: /^members$/i })).toBeVisible();
      });
    });
    await step('click Team again → group collapses', async () => {
      await user.click(canvas.getByRole('button', { name: /^team$/i }));
      await waitFor(() =>
        expect(canvas.getByRole('button', { name: /^team$/i })).toHaveAttribute('aria-expanded', 'false'),
      );
    });
  },
};

// ── With groups ───────────────────────────────────────────

export const WithGroups: Story = {
  name: 'With section groups',
  args: { groups: [] },
  render: () => (
    <div className="bg-white dark:bg-ink-900 rounded-2xl p-4 w-64">
      <VerticalNav groups={GROUPED_GROUPS} />
    </div>
  ),
};
