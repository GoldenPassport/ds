import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import gpLogo from '../../assets/gp-logo.png';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BarChart2,
  FileText,
  Settings,
  Bell,
  HelpCircle,
  ShieldCheck,
  Zap,
  GitBranch,
  Database,
  Globe,
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

const SIMPLE_GROUPS = [
  {
    items: [
      { label: 'Dashboard', href: '#', active: true },
      { label: 'Team', href: '#' },
      { label: 'Projects', href: '#' },
      { label: 'Calendar', href: '#' },
      { label: 'Documents', href: '#' },
      { label: 'Reports', href: '#' },
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
      { label: 'Help', href: '#', icon: <HelpCircle className="w-5 h-5" /> },
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

// ── With footer slot ──────────────────────────────────────

export const WithFooter: Story = {
  name: 'With footer slot',
  args: { groups: [] },
  render: () => {
    const [lastClicked, setLastClicked] = useState('');
    return (
      <div className="w-64 h-screen bg-white dark:bg-ink-900 flex flex-col">
        <SidebarNav
          logo={<Logo />}
          groups={EXPANDABLE_GROUPS}
          user={{
            name: 'Alex Johnson',
            email: 'alex@acme.com',
            menuItems: [
              { label: 'Your profile', href: '#' },
              { label: 'Settings', href: '#' },
              { label: 'Sign out', onClick: () => setLastClicked('Sign out'), dividerAbove: true },
            ],
          }}
          footer={
            <div className="flex flex-col gap-2">
              <Button variant="primary" size="sm" className="w-full justify-center">
                <Plus className="w-4 h-4 mr-1.5" />
                New project
              </Button>
              <div className="flex items-center gap-2 px-3 py-2">
                <Bell className="w-4 h-4 text-ink-500 dark:text-ink-300" />
                <span className="text-sm font-body text-ink-700 dark:text-ink-200 flex-1">
                  Notifications
                </span>
                <Badge label="4" variant="warning" />
              </div>
            </div>
          }
        />
        {lastClicked && (
          <p data-testid="user-menu-clicked" className="text-xs font-body text-ink-500 dark:text-ink-300 px-3 py-2">
            Clicked: {lastClicked}
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('expandable "Team" item starts collapsed', async () => {
      const teamBtn = await canvas.findByRole('button', { name: /team/i });
      expect(teamBtn).toHaveAttribute('aria-expanded', 'false');
      expect(canvas.queryByRole('link', { name: /members/i })).not.toBeInTheDocument();
    });

    await step('click "Team" — expands and shows children', async () => {
      await user.click(canvas.getByRole('button', { name: /team/i }));
      await waitFor(() => {
        expect(canvas.getByRole('button', { name: /team/i })).toHaveAttribute(
          'aria-expanded',
          'true',
        );
        expect(canvas.getByRole('link', { name: /members/i })).toBeInTheDocument();
        expect(canvas.getByRole('link', { name: /invitations/i })).toBeInTheDocument();
      });
    });

    await step('click "Team" again — collapses and hides children', async () => {
      await user.click(canvas.getByRole('button', { name: /team/i }));
      await waitFor(() => {
        expect(canvas.getByRole('button', { name: /team/i })).toHaveAttribute(
          'aria-expanded',
          'false',
        );
        expect(canvas.queryByRole('link', { name: /members/i })).not.toBeInTheDocument();
      });
    });

    await step('expand "Projects" — different section opens independently', async () => {
      await user.click(canvas.getByRole('button', { name: /projects/i }));
      await waitFor(() => {
        expect(canvas.getByRole('button', { name: /projects/i })).toHaveAttribute(
          'aria-expanded',
          'true',
        );
        expect(canvas.getByRole('link', { name: /all projects/i })).toBeInTheDocument();
      });
    });

    await step('click user avatar/name button → dropdown opens', async () => {
      const userBtn = await canvas.findByRole('button', { name: /alex johnson/i });
      await user.click(userBtn);
      await waitFor(() => {
        expect(
          within(document.body).getByRole('menuitem', { name: /your profile/i }),
        ).toBeInTheDocument();
      });
    });

    await step('"Sign out" item is present in menu', async () => {
      expect(
        within(document.body).getByRole('menuitem', { name: /sign out/i }),
      ).toBeInTheDocument();
    });

    await step('click "Sign out" → handler fires and menu closes', async () => {
      await user.click(within(document.body).getByRole('menuitem', { name: /sign out/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('user-menu-clicked')).toHaveTextContent('Sign out');
      });
      await waitFor(() => {
        expect(
          within(document.body).queryByRole('menuitem', { name: /your profile/i }),
        ).not.toBeInTheDocument();
      });
    });
  },
};

// ── Rounded card ─────────────────────────────────────────

export const RoundedCard: Story = {
  name: 'Rounded card panel',
  args: { groups: [] },
  render: () => (
    <div className="flex h-screen bg-ink-100 dark:bg-ink-800 p-4">
      <div className="w-64 shrink-0 h-full">
        <SidebarNav rounded logo={<Logo />} groups={BADGE_GROUPS} user={USER} />
      </div>
      <main className="flex-1 p-6">
        <p className="text-sm font-body text-ink-500 dark:text-ink-300">Page content</p>
      </main>
    </div>
  ),
};

// ── Rounded card dark ─────────────────────────────────────

export const RoundedCardDark: Story = {
  name: 'Rounded card panel — dark',
  args: { groups: [] },
  render: () => (
    <div className="flex h-screen bg-ink-800 p-4">
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
        <p className="text-sm font-body text-ink-300">Page content</p>
      </main>
    </div>
  ),
};

// ── No user ───────────────────────────────────────────────

export const NoUser: Story = {
  name: 'No user section',
  args: { groups: [] },
  render: () => <Shell sidebar={<SidebarNav logo={<Logo />} groups={SIMPLE_GROUPS} />} />,
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
              <img src={gpLogo} alt="Golden Passport" className="h-6 w-auto" />
              <span className="text-[15px] font-extrabold font-display text-white tracking-tight leading-none">
                Golden Passport
              </span>
            </div>
          }
          groups={GROUPED_GROUPS}
          user={USER}
        />
      }
    />
  ),
};

