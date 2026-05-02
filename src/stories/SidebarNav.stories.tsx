import { expect, userEvent, within, waitFor } from 'storybook/test';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import gpLogo from '../../assets/gp-logo.png';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BarChart2,
  FileText,
  Settings,
  ShieldCheck,
  Zap,
  GitBranch,
  Database,
  Globe,
} from 'lucide-react';
import { SidebarNav } from '../components/SidebarNav';

const meta = {
  title: 'Navigation/SidebarNav',
  component: SidebarNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    appearance: { control: { type: 'select', options: ['light', 'dark'] } },
    groups: { control: false },
    logo: { control: false },
    user: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Fixtures ──────────────────────────────────────────────

const USER = {
  name: 'Alex Johnson',
  email: 'alex@acme.com',
  menuItems: [
    { label: 'Your profile', href: '#' },
    { label: 'Settings', href: '#' },
    { label: 'Sign out', onClick: () => {}, dividerAbove: true },
  ],
};

const ICON_GROUPS = [
  {
    items: [
      {
        label: 'Dashboard',
        href: '#',
        active: true,
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      { label: 'Team', href: '#', icon: <Users className="w-5 h-5" /> },
      { label: 'Projects', href: '#', icon: <FolderOpen className="w-5 h-5" /> },
      { label: 'Reports', href: '#', icon: <BarChart2 className="w-5 h-5" /> },
      { label: 'Documents', href: '#', icon: <FileText className="w-5 h-5" /> },
    ],
  },
];

const BADGE_GROUPS = [
  {
    items: [
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
    ],
  },
];

const EXPANDABLE_GROUPS = [
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
          { label: 'Members', href: '#' },
          { label: 'Invitations', href: '#' },
          { label: 'Roles', href: '#' },
        ],
      },
      {
        label: 'Projects',
        icon: <FolderOpen className="w-5 h-5" />,
        children: [
          { label: 'All projects', href: '#' },
          { label: 'Archived', href: '#' },
          { label: 'Templates', href: '#' },
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
    ],
  },
];

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <img src={gpLogo} alt="Golden Passport" className="h-6 w-auto" />
      <span
        className={`text-[15px] font-extrabold font-display tracking-tight leading-none ${dark ? 'text-white' : 'text-ink-900 dark:text-white'}`}
      >
        Golden Passport
      </span>
    </div>
  );
}

// ── Sidebar shell ─────────────────────────────────────────

function Shell({ sidebar }: { sidebar: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="w-64 shrink-0 h-full">{sidebar}</div>
      <main className="flex-1 p-8 overflow-y-auto bg-white dark:bg-ink-900">
        <p className="text-sm font-body text-ink-500 dark:text-ink-300">Page content</p>
      </main>
    </div>
  );
}

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: { groups: [], appearance: 'light' },
  render: (args) => (
    <Shell
      sidebar={
        <SidebarNav
          {...args}
          logo={<Logo dark={args.appearance === 'dark'} />}
          groups={ICON_GROUPS}
          user={USER}
        />
      }
    />
  ),
};

// ── Themes (Light + Dark) ─────────────────────────────────

export const Themes: Story = {
  name: 'Themes',
  args: { groups: [] },
  render: () => (
    <div className="flex h-screen">
      <div className="w-64 shrink-0 h-full">
        <SidebarNav logo={<Logo />} groups={ICON_GROUPS} user={USER} />
      </div>
      <div className="w-64 shrink-0 h-full">
        <SidebarNav appearance="dark" logo={<Logo dark />} groups={ICON_GROUPS} user={USER} />
      </div>
      <main className="flex-1 p-8 overflow-y-auto bg-white dark:bg-ink-900">
        <p className="text-sm font-body text-ink-500 dark:text-ink-300">Page content</p>
      </main>
    </div>
  ),
};

// ── With badges ───────────────────────────────────────────

export const WithBadges: Story = {
  name: 'With badges',
  args: { groups: [] },
  render: () => (
    <Shell sidebar={<SidebarNav logo={<Logo />} groups={BADGE_GROUPS} user={USER} />} />
  ),
};

// ── With expandable sections ──────────────────────────────

export const WithExpandable: Story = {
  name: 'With expandable sections',
  args: { groups: [] },
  render: () => (
    <div className="flex h-screen">
      <div className="w-64 shrink-0 h-full">
        <SidebarNav logo={<Logo />} groups={EXPANDABLE_GROUPS} user={USER} />
      </div>
      <div className="w-64 shrink-0 h-full">
        <SidebarNav appearance="dark" logo={<Logo dark />} groups={EXPANDABLE_GROUPS} user={USER} />
      </div>
      <main className="flex-1 p-8 overflow-y-auto bg-white dark:bg-ink-900">
        <p className="text-sm font-body text-ink-500 dark:text-ink-300">Page content</p>
      </main>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('"Team" group is collapsed initially', async () => {
      // Two sidebars rendered — target the first one
      const [teamBtn] = canvas.getAllByRole('button', { name: /^team$/i });
      expect(teamBtn).toHaveAttribute('aria-expanded', 'false');
    });
    await step('click Team → group expands, child items appear', async () => {
      const [teamBtn] = canvas.getAllByRole('button', { name: /^team$/i });
      await user.click(teamBtn);
      await waitFor(() => {
        expect(teamBtn).toHaveAttribute('aria-expanded', 'true');
        expect(canvas.getAllByRole('link', { name: /^members$/i })[0]).toBeVisible();
      });
    });
    await step('click Team again → group collapses', async () => {
      const [teamBtn] = canvas.getAllByRole('button', { name: /^team$/i });
      await user.click(teamBtn);
      await waitFor(() => expect(teamBtn).toHaveAttribute('aria-expanded', 'false'));
    });
  },
};

// ── With section groups ───────────────────────────────────

export const WithGroups: Story = {
  name: 'With section groups',
  args: { groups: [] },
  render: () => (
    <div className="flex h-screen">
      <div className="w-64 shrink-0 h-full">
        <SidebarNav logo={<Logo />} groups={GROUPED_GROUPS} user={USER} />
      </div>
      <div className="w-64 shrink-0 h-full">
        <SidebarNav appearance="dark" logo={<Logo dark />} groups={GROUPED_GROUPS} user={USER} />
      </div>
      <main className="flex-1 p-8 overflow-y-auto bg-white dark:bg-ink-900">
        <p className="text-sm font-body text-ink-500 dark:text-ink-300">Page content</p>
      </main>
    </div>
  ),
};
