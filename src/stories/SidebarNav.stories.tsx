import type { Meta, StoryObj } from '@storybook/react';
import {
  LayoutDashboard, Users, FolderOpen, BarChart2, FileText, Settings,
  Bell, HelpCircle, ShieldCheck, Zap, GitBranch, Database, Globe,
  Plus,
} from 'lucide-react';
import { SidebarNav } from '../components/SidebarNav';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Navigation/SidebarNav',
  component: SidebarNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    appearance: { control: { type: 'select', options: ['light', 'dark'] } },
    groups:     { control: false },
    logo:       { control: false },
    user:       { control: false },
    footer:     { control: false },
  },
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Fixtures ──────────────────────────────────────────────

const USER = {
  name:  'Alex Johnson',
  email: 'alex@acme.com',
  menuItems: [
    { label: 'Your profile', href: '#' },
    { label: 'Settings',     href: '#' },
    { label: 'Sign out',     onClick: () => {}, dividerAbove: true },
  ],
};

const SIMPLE_GROUPS = [
  {
    items: [
      { label: 'Dashboard', href: '#', active: true  },
      { label: 'Team',      href: '#'                },
      { label: 'Projects',  href: '#'                },
      { label: 'Calendar',  href: '#'                },
      { label: 'Documents', href: '#'                },
      { label: 'Reports',   href: '#'                },
    ],
  },
];

const ICON_GROUPS = [
  {
    items: [
      { label: 'Dashboard', href: '#', active: true, icon: <LayoutDashboard className="w-5 h-5" /> },
      { label: 'Team',      href: '#',               icon: <Users           className="w-5 h-5" /> },
      { label: 'Projects',  href: '#',               icon: <FolderOpen      className="w-5 h-5" /> },
      { label: 'Reports',   href: '#',               icon: <BarChart2       className="w-5 h-5" /> },
      { label: 'Documents', href: '#',               icon: <FileText        className="w-5 h-5" /> },
    ],
  },
];

const BADGE_GROUPS = [
  {
    items: [
      { label: 'Dashboard', href: '#', active: true, icon: <LayoutDashboard className="w-5 h-5" />, badge: 5    },
      { label: 'Team',      href: '#',               icon: <Users           className="w-5 h-5" />, badge: 12   },
      { label: 'Projects',  href: '#',               icon: <FolderOpen      className="w-5 h-5" />              },
      { label: 'Documents', href: '#',               icon: <FileText        className="w-5 h-5" />, badge: 'New'},
      { label: 'Reports',   href: '#',               icon: <BarChart2       className="w-5 h-5" />              },
    ],
  },
];

const EXPANDABLE_GROUPS = [
  {
    items: [
      { label: 'Dashboard', href: '#', active: true, icon: <LayoutDashboard className="w-5 h-5" /> },
      {
        label: 'Team',
        icon: <Users className="w-5 h-5" />,
        children: [
          { label: 'Members',     href: '#' },
          { label: 'Invitations', href: '#' },
          { label: 'Roles',       href: '#' },
        ],
      },
      {
        label: 'Projects',
        icon: <FolderOpen className="w-5 h-5" />,
        children: [
          { label: 'All projects', href: '#' },
          { label: 'Archived',     href: '#' },
          { label: 'Templates',    href: '#' },
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
      { label: 'Dashboard',  href: '#', active: true, icon: <LayoutDashboard className="w-5 h-5" /> },
      { label: 'Analytics',  href: '#',               icon: <BarChart2       className="w-5 h-5" />, badge: 'New' },
      { label: 'Documents',  href: '#',               icon: <FileText        className="w-5 h-5" /> },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Workflows',    href: '#', icon: <Zap        className="w-5 h-5" /> },
      { label: 'Pipelines',    href: '#', icon: <GitBranch  className="w-5 h-5" /> },
      { label: 'Integrations', href: '#', icon: <Globe      className="w-5 h-5" /> },
      { label: 'Databases',    href: '#', icon: <Database   className="w-5 h-5" /> },
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

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`text-lg font-bold font-display tracking-tight ${dark ? 'text-white' : 'text-ink-900'}`}>
      Acme
    </span>
  );
}

// ── Sidebar shell ─────────────────────────────────────────

function Shell({ sidebar }: { sidebar: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="w-64 shrink-0 h-full">{sidebar}</div>
      <main className="flex-1 p-8 overflow-y-auto bg-ink-50 dark:bg-ink-950">
        <p className="text-sm font-body text-ink-400 dark:text-ink-500">Page content</p>
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

// ── Light ─────────────────────────────────────────────────

export const Light: Story = {
  name: 'Light',
  args: { groups: [] },
  render: () => (
    <Shell
      sidebar={
        <SidebarNav
          logo={<Logo />}
          groups={ICON_GROUPS}
          user={USER}
        />
      }
    />
  ),
};

// ── Dark ──────────────────────────────────────────────────

export const Dark: Story = {
  name: 'Dark',
  args: { groups: [] },
  render: () => (
    <Shell
      sidebar={
        <SidebarNav
          appearance="dark"
          logo={<Logo dark />}
          groups={ICON_GROUPS}
          user={USER}
        />
      }
    />
  ),
};

// ── With badges ───────────────────────────────────────────

export const WithBadges: Story = {
  name: 'With badges',
  args: { groups: [] },
  render: () => (
    <Shell
      sidebar={
        <SidebarNav
          logo={<Logo />}
          groups={BADGE_GROUPS}
          user={USER}
        />
      }
    />
  ),
};

// ── With expandable sections ──────────────────────────────

export const WithExpandable: Story = {
  name: 'With expandable sections',
  args: { groups: [] },
  render: () => (
    <Shell
      sidebar={
        <SidebarNav
          logo={<Logo />}
          groups={EXPANDABLE_GROUPS}
          user={USER}
        />
      }
    />
  ),
};

// ── Dark with expandable sections ─────────────────────────

export const DarkExpandable: Story = {
  name: 'Dark — with expandable sections',
  args: { groups: [] },
  render: () => (
    <Shell
      sidebar={
        <SidebarNav
          appearance="dark"
          logo={<Logo dark />}
          groups={EXPANDABLE_GROUPS}
          user={USER}
        />
      }
    />
  ),
};

// ── With section groups ───────────────────────────────────

export const WithGroups: Story = {
  name: 'With section groups',
  args: { groups: [] },
  render: () => (
    <Shell
      sidebar={
        <SidebarNav
          logo={<Logo />}
          groups={GROUPED_GROUPS}
          user={USER}
        />
      }
    />
  ),
};

// ── Dark with section groups ──────────────────────────────

export const DarkGroups: Story = {
  name: 'Dark — with section groups',
  args: { groups: [] },
  render: () => (
    <Shell
      sidebar={
        <SidebarNav
          appearance="dark"
          logo={<Logo dark />}
          groups={GROUPED_GROUPS}
          user={USER}
        />
      }
    />
  ),
};

// ── With footer slot ──────────────────────────────────────

export const WithFooter: Story = {
  name: 'With footer slot',
  args: { groups: [] },
  render: () => (
    <Shell
      sidebar={
        <SidebarNav
          logo={<Logo />}
          groups={ICON_GROUPS}
          user={USER}
          footer={
            <div className="flex flex-col gap-2">
              <Button variant="primary" size="sm" className="w-full justify-center">
                <Plus className="w-4 h-4 mr-1.5" />
                New project
              </Button>
              <div className="flex items-center gap-2 px-3 py-2">
                <Bell className="w-4 h-4 text-ink-400" />
                <span className="text-sm font-body text-ink-600 flex-1">Notifications</span>
                <Badge label="4" variant="warning" />
              </div>
            </div>
          }
        />
      }
    />
  ),
};

// ── Rounded card ─────────────────────────────────────────

export const RoundedCard: Story = {
  name: 'Rounded card panel',
  args: { groups: [] },
  render: () => (
    <div className="flex h-screen bg-ink-100 dark:bg-ink-950 p-4">
      <div className="w-64 shrink-0 h-full">
        <SidebarNav
          rounded
          logo={<Logo />}
          groups={BADGE_GROUPS}
          user={USER}
        />
      </div>
      <main className="flex-1 p-6">
        <p className="text-sm font-body text-ink-400 dark:text-ink-500">Page content</p>
      </main>
    </div>
  ),
};

// ── Rounded card dark ─────────────────────────────────────

export const RoundedCardDark: Story = {
  name: 'Rounded card panel — dark',
  args: { groups: [] },
  render: () => (
    <div className="flex h-screen bg-ink-950 p-4">
      <div className="w-64 shrink-0 h-full">
        <SidebarNav
          rounded
          appearance="dark"
          logo={<Logo dark />}
          groups={BADGE_GROUPS}
          user={USER}
        />
      </div>
      <main className="flex-1 p-6">
        <p className="text-sm font-body text-ink-500">Page content</p>
      </main>
    </div>
  ),
};

// ── No user ───────────────────────────────────────────────

export const NoUser: Story = {
  name: 'No user section',
  args: { groups: [] },
  render: () => (
    <Shell
      sidebar={
        <SidebarNav
          logo={<Logo />}
          groups={SIMPLE_GROUPS}
        />
      }
    />
  ),
};

// ── Branded dark ──────────────────────────────────────────

export const BrandedDark: Story = {
  name: 'Branded — dark with coloured logo',
  args: { groups: [] },
  render: () => (
    <Shell
      sidebar={
        <SidebarNav
          appearance="dark"
          logo={
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-ink-900" />
              </div>
              <span className="text-base font-bold font-display text-white tracking-tight">Acme</span>
            </div>
          }
          groups={GROUPED_GROUPS}
          user={USER}
        />
      }
    />
  ),
};
