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
    actions: { control: false },
    moreMenu: { control: false },
    logo: { control: false },
    items: { control: false },
    user: { control: false },
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Fixtures ──────────────────────────────────────────────

const LOGO_LIGHT = (
  <div className="flex items-center gap-2">
    <img src={gpLogo} alt="Golden Passport" className="h-6 w-auto" />
    <span className="text-[15px] font-extrabold font-display text-ink-900 dark:text-ink-50 tracking-tight leading-none">
      Golden Passport
    </span>
  </div>
);

const LOGO_DARK = (
  <div className="flex items-center gap-2">
    <img src={gpLogo} alt="Golden Passport" className="h-6 w-auto" />
    <span className="text-[15px] font-extrabold font-display text-white tracking-tight leading-none">
      Golden Passport
    </span>
  </div>
);

const NAV_ITEMS_SIMPLE = [
  { label: 'Dashboard', href: '#', active: true },
  { label: 'Team', href: '#', active: false },
  { label: 'Projects', href: '#', active: false },
  { label: 'Calendar', href: '#', active: false },
];

const NAV_ITEMS = [
  { label: 'Dashboard', href: '#', active: true, icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Team', href: '#', active: false, icon: <Users className="w-4 h-4" /> },
  { label: 'Reports', href: '#', active: false, icon: <BarChart2 className="w-4 h-4" /> },
  { label: 'Documents', href: '#', active: false, icon: <FileText className="w-4 h-4" /> },
];

const USER = {
  name: 'Alex Johnson',
  email: 'alex@acme.com',
  menuItems: [
    { label: 'Your profile', href: '#' },
    { label: 'Settings', href: '#', icon: <Settings className="w-4 h-4" /> },
    { label: 'Sign out', onClick: () => {}, dividerAbove: true },
  ],
};

function IconBtn({
  label,
  appearance = 'light',
}: {
  label: string;
  appearance?: 'light' | 'dark';
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={[
        'flex items-center justify-center w-9 h-9 rounded-lg transition-colors',
        appearance === 'dark'
          ? 'text-ink-300 hover:text-ink-100 hover:bg-ink-800'
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
    search: true,
    bordered: true,
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

// ── Simple ────────────────────────────────────────────────

export const Simple: Story = {
  name: 'Simple',
  args: {},
  render: () => (
    <div className="flex flex-col gap-0">
      <Navbar logo={LOGO_LIGHT} items={NAV_ITEMS_SIMPLE} user={USER} />
      <Navbar appearance="dark" logo={LOGO_DARK} items={NAV_ITEMS_SIMPLE} user={USER} />
    </div>
  ),
};

// ── With search ───────────────────────────────────────────

export const WithSearch: Story = {
  name: 'With search',
  args: {},
  render: () => (
    <div className="flex flex-col gap-0">
      <Navbar
        logo={LOGO_LIGHT}
        items={NAV_ITEMS_SIMPLE}
        user={USER}
        search
        searchPlaceholder="Search…"
      />
      <Navbar appearance="dark" logo={LOGO_DARK} items={NAV_ITEMS_SIMPLE} user={USER} search />
    </div>
  ),
};

// ── With quick action ─────────────────────────────────────

export const WithQuickAction: Story = {
  name: 'With quick action',
  args: {},
  render: () => (
    <div className="flex flex-col gap-0">
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
    </div>
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
