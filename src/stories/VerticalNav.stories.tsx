import type { Meta, StoryObj } from '@storybook/react';
import gpLogo from '../../assets/gp-logo.png';
import {
  LayoutDashboard, Users, BarChart2, FileText, Settings, FolderOpen,
  Bell, HelpCircle, ShieldCheck, Zap, GitBranch, Database, Globe,
} from 'lucide-react';
import { VerticalNav } from '../components/VerticalNav';

const meta = {
  title: 'Navigation/VerticalNav',
  component: VerticalNav,
  tags: ['autodocs'],
  argTypes: {
    appearance: { control: { type: 'select', options: ['default', 'gray', 'dark'] } },
    groups:     { control: false },
  },
} satisfies Meta<typeof VerticalNav>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Fixtures ──────────────────────────────────────────────

const SIMPLE_ITEMS = [
  { label: 'Dashboard', href: '#', active: true  },
  { label: 'Team',      href: '#'                },
  { label: 'Projects',  href: '#'                },
  { label: 'Calendar',  href: '#'                },
  { label: 'Documents', href: '#'                },
  { label: 'Reports',   href: '#'                },
];

const BADGE_ITEMS = [
  { label: 'Dashboard', href: '#', active: true, badge: 5    },
  { label: 'Team',      href: '#',               badge: 12   },
  { label: 'Projects',  href: '#',               badge: 3    },
  { label: 'Calendar',  href: '#'                             },
  { label: 'Documents', href: '#',               badge: 'New'},
  { label: 'Reports',   href: '#'                             },
];

const ICON_ITEMS = [
  { label: 'Dashboard', href: '#', active: true, icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Team',      href: '#',               icon: <Users           className="w-5 h-5" /> },
  { label: 'Projects',  href: '#',               icon: <FolderOpen      className="w-5 h-5" /> },
  { label: 'Calendar',  href: '#',               icon: <Bell            className="w-5 h-5" /> },
  { label: 'Documents', href: '#',               icon: <FileText        className="w-5 h-5" /> },
  { label: 'Reports',   href: '#',               icon: <BarChart2       className="w-5 h-5" /> },
];

const ICON_BADGE_ITEMS = [
  { label: 'Dashboard', href: '#', active: true, icon: <LayoutDashboard className="w-5 h-5" />, badge: 5  },
  { label: 'Team',      href: '#',               icon: <Users           className="w-5 h-5" />, badge: 12 },
  { label: 'Projects',  href: '#',               icon: <FolderOpen      className="w-5 h-5" />            },
  { label: 'Documents', href: '#',               icon: <FileText        className="w-5 h-5" />, badge: 'New' },
  { label: 'Reports',   href: '#',               icon: <BarChart2       className="w-5 h-5" />            },
];

const SECONDARY_GROUPS = [
  {
    items: [
      { label: 'Dashboard', href: '#', active: true, icon: <LayoutDashboard className="w-5 h-5" /> },
      {
        label: 'Team',
        icon: <Users className="w-5 h-5" />,
        children: [
          { label: 'Members',     href: '#', active: false },
          { label: 'Invitations', href: '#', active: false },
          { label: 'Roles',       href: '#', active: false },
        ],
      },
      {
        label: 'Projects',
        icon: <FolderOpen className="w-5 h-5" />,
        children: [
          { label: 'All projects', href: '#' },
          { label: 'Archived',     href: '#' },
        ],
      },
      { label: 'Reports',   href: '#', icon: <BarChart2 className="w-5 h-5" /> },
      { label: 'Documents', href: '#', icon: <FileText  className="w-5 h-5" /> },
    ],
  },
];

const GROUPED_GROUPS = [
  {
    label: 'General',
    items: [
      { label: 'Dashboard', href: '#', active: true, icon: <LayoutDashboard className="w-5 h-5" /> },
      { label: 'Analytics',  href: '#',              icon: <BarChart2       className="w-5 h-5" />, badge: 'New' },
      { label: 'Documents',  href: '#',              icon: <FileText        className="w-5 h-5" /> },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Workflows',   href: '#', icon: <Zap        className="w-5 h-5" /> },
      { label: 'Pipelines',   href: '#', icon: <GitBranch  className="w-5 h-5" /> },
      { label: 'Integrations',href: '#', icon: <Globe      className="w-5 h-5" /> },
      { label: 'Databases',   href: '#', icon: <Database   className="w-5 h-5" /> },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Team',        href: '#', icon: <Users       className="w-5 h-5" /> },
      { label: 'Permissions', href: '#', icon: <ShieldCheck className="w-5 h-5" /> },
      { label: 'Settings',    href: '#', icon: <Settings    className="w-5 h-5" /> },
      { label: 'Help',        href: '#', icon: <HelpCircle  className="w-5 h-5" /> },
    ],
  },
];

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: { appearance: 'default', groups: [] },
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
    <div className="bg-white rounded-2xl p-4 w-56">
      <VerticalNav groups={[{ items: SIMPLE_ITEMS }]} />
    </div>
  ),
};

// ── With badges ───────────────────────────────────────────

export const WithBadges: Story = {
  name: 'With badges',
  args: { groups: [] },
  render: () => (
    <div className="bg-white rounded-2xl p-4 w-56">
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
};

// ── Dark ──────────────────────────────────────────────────

export const Dark: Story = {
  name: 'Dark — with secondary nav',
  args: { groups: [] },
  render: () => (
    <div className="bg-ink-900 rounded-2xl p-3 w-64">
      <VerticalNav appearance="dark" groups={SECONDARY_GROUPS} />
    </div>
  ),
};

// ── Dark with groups ──────────────────────────────────────

export const DarkWithGroups: Story = {
  name: 'Dark — with section groups',
  args: { groups: [] },
  render: () => (
    <div className="bg-ink-900 rounded-2xl p-3 w-64">
      <VerticalNav appearance="dark" groups={GROUPED_GROUPS} />
    </div>
  ),
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

// ── On gray ───────────────────────────────────────────────

export const OnGray: Story = {
  name: 'On gray background',
  args: { groups: [] },
  render: () => (
    <div className="bg-ink-50 dark:bg-ink-900 rounded-2xl p-4 w-64">
      <VerticalNav appearance="gray" groups={[{ items: ICON_BADGE_ITEMS }]} />
    </div>
  ),
};

// ── In context — app sidebar ──────────────────────────────

export const InContext: Story = {
  name: 'In context — app sidebar',
  args: { groups: [] },
  render: () => (
    <div className="min-h-screen flex bg-ink-50 dark:bg-ink-900">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-ink-200 dark:border-ink-700 shrink-0">
          <div className="flex items-center gap-2">
            <img src={gpLogo} alt="Golden Passport" className="h-6 w-auto" />
            <span className="text-[15px] font-extrabold font-display text-ink-900 dark:text-ink-50 tracking-tight leading-none">Golden Passport</span>
          </div>
        </div>
        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-5 px-3">
          <VerticalNav groups={GROUPED_GROUPS} />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 bg-white dark:bg-ink-900">
        <p className="text-sm font-body text-ink-400 dark:text-ink-300">Page content goes here</p>
      </main>
    </div>
  ),
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  args: { groups: [] },
  render: () => (
    <div className="flex gap-12 flex-wrap items-start">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-body text-ink-400 dark:text-ink-300">Simple</p>
        <div className="bg-white dark:bg-ink-900 rounded-2xl p-3 w-52"><VerticalNav groups={[{ items: SIMPLE_ITEMS }]} aria-label="Simple navigation" /></div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-body text-ink-400 dark:text-ink-300">With badges</p>
        <div className="bg-white dark:bg-ink-900 rounded-2xl p-3 w-52"><VerticalNav groups={[{ items: BADGE_ITEMS }]} aria-label="Navigation with badges" /></div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-body text-ink-400 dark:text-ink-300">With icons</p>
        <div className="bg-white dark:bg-ink-900 rounded-2xl p-3 w-64"><VerticalNav groups={[{ items: ICON_ITEMS }]} aria-label="Navigation with icons" /></div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-body text-ink-400 dark:text-ink-300">Icons + badges</p>
        <div className="bg-white dark:bg-ink-900 rounded-2xl p-3 w-64"><VerticalNav groups={[{ items: ICON_BADGE_ITEMS }]} aria-label="Navigation with icons and badges" /></div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-body text-ink-400 dark:text-ink-300">Secondary nav</p>
        <div className="bg-white dark:bg-ink-900 rounded-2xl p-3 w-64"><VerticalNav groups={SECONDARY_GROUPS} aria-label="Secondary navigation" /></div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-body text-ink-400 dark:text-ink-300">On gray</p>
        <div className="bg-ink-50 dark:bg-ink-900 rounded-2xl p-4 w-64">
          <VerticalNav appearance="gray" groups={[{ items: ICON_BADGE_ITEMS }]} aria-label="Navigation on gray" />
        </div>
      </div>
    </div>
  ),
};
