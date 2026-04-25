import type { Meta, StoryObj } from '@storybook/react';
import gpLogo from '../../assets/gp-logo.png';
import { Bell, Plus, Settings, LayoutDashboard, Users, BarChart2, FileText } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';

const meta = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    appearance: { control: { type: 'select', options: ['light', 'dark'] } },
    actions:    { control: false },
    moreMenu:   { control: false },
    logo:       { control: false },
    items:      { control: false },
    user:       { control: false },
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Fixtures ──────────────────────────────────────────────

const LOGO_LIGHT = (
  <div className="flex items-center gap-2">
    <img src={gpLogo} alt="Golden Passport" className="h-6 w-auto" />
    <span className="text-[15px] font-extrabold font-display text-ink-900 tracking-tight leading-none">Golden Passport</span>
  </div>
);

const LOGO_DARK = (
  <div className="flex items-center gap-2">
    <img src={gpLogo} alt="Golden Passport" className="h-6 w-auto" />
    <span className="text-[15px] font-extrabold font-display text-white tracking-tight leading-none">Golden Passport</span>
  </div>
);

const NAV_ITEMS = [
  { label: 'Dashboard', href: '#', active: true,  icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Team',      href: '#', active: false, icon: <Users           className="w-4 h-4" /> },
  { label: 'Reports',   href: '#', active: false, icon: <BarChart2       className="w-4 h-4" /> },
  { label: 'Documents', href: '#', active: false, icon: <FileText        className="w-4 h-4" /> },
];

const NAV_ITEMS_SIMPLE = [
  { label: 'Dashboard', href: '#', active: true  },
  { label: 'Team',      href: '#', active: false },
  { label: 'Projects',  href: '#', active: false },
  { label: 'Calendar',  href: '#', active: false },
];

const USER = {
  name:  'Alex Johnson',
  email: 'alex@acme.com',
  menuItems: [
    { label: 'Your profile',   href: '#' },
    { label: 'Settings',       href: '#', icon: <Settings className="w-4 h-4" /> },
    { label: 'Sign out',       onClick: () => {}, dividerAbove: true },
  ],
};

function IconBtn({ label, appearance = 'light' }: { label: string; appearance?: 'light' | 'dark' }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={[
        'flex items-center justify-center w-9 h-9 rounded-lg transition-colors',
        appearance === 'dark'
          ? 'text-ink-400 hover:text-ink-100 hover:bg-ink-800'
          : 'text-ink-500 hover:text-ink-700 hover:bg-ink-100',
      ].join(' ')}
    >
      <Bell className="w-5 h-5" />
    </button>
  );
}

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    appearance: 'light',
    search:     true,
    bordered:   true,
  },
  render: (args) => (
    <Navbar
      {...args}
      logo={args.appearance === 'dark' ? LOGO_DARK : LOGO_LIGHT}
      items={NAV_ITEMS_SIMPLE}
      user={USER}
    />
  ),
};

// ── Simple light ──────────────────────────────────────────

export const Simple: Story = {
  name: 'Simple',
  args: {},
  render: () => (
    <Navbar
      logo={LOGO_LIGHT}
      items={NAV_ITEMS_SIMPLE}
      user={USER}
    />
  ),
};

// ── Simple dark ───────────────────────────────────────────

export const SimpleDark: Story = {
  name: 'Simple — dark',
  args: {},
  render: () => (
    <Navbar
      appearance="dark"
      logo={LOGO_DARK}
      items={NAV_ITEMS_SIMPLE}
      user={USER}
    />
  ),
};

// ── With search ───────────────────────────────────────────

export const WithSearch: Story = {
  name: 'With search',
  args: {},
  render: () => (
    <Navbar
      logo={LOGO_LIGHT}
      items={NAV_ITEMS_SIMPLE}
      user={USER}
      search
      searchPlaceholder="Search…"
    />
  ),
};

// ── Dark with search ──────────────────────────────────────

export const DarkWithSearch: Story = {
  name: 'Dark — with search',
  args: {},
  render: () => (
    <Navbar
      appearance="dark"
      logo={LOGO_DARK}
      items={NAV_ITEMS_SIMPLE}
      user={USER}
      search
    />
  ),
};

// ── With quick action ─────────────────────────────────────

export const WithQuickAction: Story = {
  name: 'With quick action',
  args: {},
  render: () => (
    <Navbar
      logo={LOGO_LIGHT}
      items={NAV_ITEMS_SIMPLE}
      user={USER}
      actions={
        <>
          <IconBtn label="Notifications" />
          <Button size="sm" variant="primary">
            <Plus className="w-4 h-4 mr-1" />
            New project
          </Button>
        </>
      }
    />
  ),
};

// ── Dark with quick action ────────────────────────────────

export const DarkWithQuickAction: Story = {
  name: 'Dark — with quick action',
  args: {},
  render: () => (
    <Navbar
      appearance="dark"
      logo={LOGO_DARK}
      items={NAV_ITEMS_SIMPLE}
      user={USER}
      actions={
        <>
          <IconBtn label="Notifications" appearance="dark" />
          <Button size="sm" variant="primary">
            <Plus className="w-4 h-4 mr-1" />
            New project
          </Button>
        </>
      }
    />
  ),
};

// ── With icons ────────────────────────────────────────────

export const WithIcons: Story = {
  name: 'Nav links with icons',
  args: {},
  render: () => (
    <Navbar
      logo={LOGO_LIGHT}
      items={NAV_ITEMS}
      user={USER}
      search
      actions={<IconBtn label="Notifications" />}
    />
  ),
};

// ── No user ───────────────────────────────────────────────

export const NoUser: Story = {
  name: 'No user menu',
  args: {},
  render: () => (
    <Navbar
      logo={LOGO_LIGHT}
      items={NAV_ITEMS_SIMPLE}
      search
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="secondary">Log in</Button>
          <Button size="sm" variant="primary">Sign up</Button>
        </div>
      }
    />
  ),
};

// ── In context ────────────────────────────────────────────

export const InContext: Story = {
  name: 'In context — app shell',
  args: {},
  render: () => (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900 flex flex-col">
      <Navbar
        logo={LOGO_LIGHT}
        items={NAV_ITEMS}
        user={USER}
        search
        actions={
          <>
            <IconBtn label="Notifications" />
            <Button size="sm" variant="primary">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </>
        }
      />
      <main className="flex-1 mx-auto max-w-[80rem] w-full px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm font-body text-ink-400 dark:text-ink-500">Page content goes here</p>
      </main>
    </div>
  ),
};

// ── More menu ─────────────────────────────────────────────

const MORE_ITEMS = [
  { label: 'Help & support',  href: '#' },
  { label: 'Keyboard shortcuts', href: '#' },
  { label: 'Sign out', onClick: () => {}, dividerAbove: true },
];

export const WithMoreMenu: Story = {
  name: 'With more menu (⋮)',
  args: {},
  render: () => (
    <Navbar
      logo={LOGO_LIGHT}
      items={NAV_ITEMS_SIMPLE}
      user={USER}
      moreMenu={MORE_ITEMS}
    />
  ),
};

export const DarkWithMoreMenu: Story = {
  name: 'Dark — with more menu (⋮)',
  args: {},
  render: () => (
    <Navbar
      appearance="dark"
      logo={LOGO_DARK}
      items={NAV_ITEMS_SIMPLE}
      user={USER}
      moreMenu={MORE_ITEMS}
    />
  ),
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  args: {},
  render: () => (
    <div className="flex flex-col gap-0">
      <Navbar logo={LOGO_LIGHT} items={NAV_ITEMS_SIMPLE} user={USER} />
      <Navbar appearance="dark" logo={LOGO_DARK} items={NAV_ITEMS_SIMPLE} user={USER} />
      <Navbar logo={LOGO_LIGHT} items={NAV_ITEMS_SIMPLE} user={USER} search />
      <Navbar
        appearance="dark"
        logo={LOGO_DARK}
        items={NAV_ITEMS_SIMPLE}
        user={USER}
        search
        actions={
          <Button size="sm" variant="primary">
            <Plus className="w-4 h-4 mr-1" />New
          </Button>
        }
      />
    </div>
  ),
};
