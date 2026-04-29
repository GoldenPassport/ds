import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
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
    <span className="text-[15px] font-extrabold font-display text-ink-900 dark:text-ink-50 tracking-tight leading-none">Golden Passport</span>
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
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm font-body text-ink-400 dark:text-ink-300">Page content goes here</p>
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

// ── Interactions ──────────────────────────────────────────

export const Interactions: Story = {
  name: 'Interactions — user menu & search',
  args: {},
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [lastClicked, setLastClicked] = useState('');
    return (
      <div className="flex flex-col gap-3">
        <Navbar
          logo={LOGO_LIGHT}
          items={NAV_ITEMS_SIMPLE}
          search
          searchPlaceholder="Search…"
          onSearch={setSearchQuery}
          user={{
            name: 'Alex Johnson',
            email: 'alex@acme.com',
            menuItems: [
              { label: 'Your profile', href: '#' },
              { label: 'Settings', href: '#' },
              { label: 'Sign out', onClick: () => setLastClicked('Sign out'), dividerAbove: true },
            ],
          }}
        />
        {searchQuery && (
          <p data-testid="search-output" className="text-xs font-body text-ink-500 px-4">
            Search: {searchQuery}
          </p>
        )}
        {lastClicked && (
          <p data-testid="menu-clicked" className="text-xs font-body text-ink-500 px-4">
            Clicked: {lastClicked}
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user   = userEvent.setup();

    await step('type into search input → onSearch fires', async () => {
      const input = canvas.getByRole('searchbox');
      await user.click(input);
      await user.type(input, 'dashboard');
      await waitFor(() => {
        expect(canvas.getByTestId('search-output')).toHaveTextContent('dashboard');
      });
    });

    await step('click user avatar button → dropdown opens with menu items', async () => {
      // The user button is the only button that wraps an avatar/name
      // It contains "Alex Johnson" visible text at lg breakpoints
      // Use getAllByRole and pick the one with no aria-label (not hamburger/search)
      const userBtn = canvas.getAllByRole('button').find(
        btn => !btn.getAttribute('aria-label') && btn.querySelector('[class*="rounded-full"]'),
      )!;
      await user.click(userBtn);
      await waitFor(() => {
        expect(within(document.body).getByRole('menuitem', { name: /your profile/i })).toBeInTheDocument();
      });
    });

    await step('click "Sign out" — onClick fires and dropdown closes', async () => {
      await user.click(within(document.body).getByRole('menuitem', { name: /sign out/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('menu-clicked')).toHaveTextContent('Sign out');
      });
      await waitFor(() => {
        expect(within(document.body).queryByRole('menuitem', { name: /your profile/i })).not.toBeInTheDocument();
      });
    });
  },
};

export const MobileMenuInteractions: Story = {
  name: 'Interactions — mobile menu open/close',
  args: {},
  render: () => (
    // Force a narrow container so the hamburger is always visible
    <div style={{ maxWidth: 480 }}>
      <Navbar
        logo={LOGO_LIGHT}
        items={NAV_ITEMS_SIMPLE}
        user={USER}
        search
      />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user   = userEvent.setup();

    await step('hamburger button starts with aria-expanded=false', async () => {
      const burger = await canvas.findByRole('button', { name: /open menu/i, hidden: true });
      expect(burger).toHaveAttribute('aria-expanded', 'false');
    });

    await step('click hamburger → mobile menu opens (aria-expanded=true)', async () => {
      const burger = canvas.getByRole('button', { name: /open menu/i, hidden: true });
      await user.click(burger);
      await waitFor(() => {
        // aria-label switches to "Close menu" when open
        expect(canvas.getByRole('button', { name: /close menu/i, hidden: true })).toHaveAttribute('aria-expanded', 'true');
      });
    });

    await step('mobile nav links are now visible', async () => {
      // Nav items are rendered in the mobile menu section
      const links = canvas.getAllByRole('link', { name: /dashboard/i, hidden: true });
      expect(links.length).toBeGreaterThan(0);
    });

    await step('click hamburger again → mobile menu closes', async () => {
      const closeBtn = canvas.getByRole('button', { name: /close menu/i, hidden: true });
      await user.click(closeBtn);
      await waitFor(() => {
        expect(canvas.getByRole('button', { name: /open menu/i, hidden: true })).toHaveAttribute('aria-expanded', 'false');
      });
    });
  },
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  args: {},
  render: () => (
    <div className="flex flex-col gap-0">
      <Navbar ariaLabel="Light navigation" logo={LOGO_LIGHT} items={NAV_ITEMS_SIMPLE} user={USER} />
      <Navbar ariaLabel="Dark navigation" appearance="dark" logo={LOGO_DARK} items={NAV_ITEMS_SIMPLE} user={USER} />
      <Navbar ariaLabel="Light navigation with search" logo={LOGO_LIGHT} items={NAV_ITEMS_SIMPLE} user={USER} search />
      <Navbar
        ariaLabel="Dark navigation with search and actions"
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

// ── MoreMenu interactions ─────────────────────────────────

export const MoreMenuInteractions: Story = {
  name: 'Interactions — more menu (⋮)',
  args: {},
  render: () => {
    const [lastClicked, setLastClicked] = useState('');
    return (
      <div>
        <Navbar
          logo={LOGO_LIGHT}
          items={NAV_ITEMS_SIMPLE}
          user={USER}
          moreMenu={[
            { label: 'Help & support',     href: '#' },
            { label: 'Keyboard shortcuts', href: '#' },
            { label: 'Sign out',           onClick: () => setLastClicked('Sign out'), dividerAbove: true },
          ]}
        />
        {lastClicked && (
          <p data-testid="more-clicked" className="text-xs font-body text-ink-500 px-4 mt-2">
            Clicked: {lastClicked}
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user   = userEvent.setup();

    await step('click ⋮ button → more menu opens', async () => {
      const moreBtn = await canvas.findByRole('button', { name: /more options/i });
      await user.click(moreBtn);
      await waitFor(() => {
        expect(within(document.body).getByRole('menuitem', { name: /help & support/i })).toBeInTheDocument();
      });
    });

    await step('"Sign out" item is present with divider', async () => {
      expect(within(document.body).getByRole('menuitem', { name: /sign out/i })).toBeInTheDocument();
    });

    await step('click "Sign out" → handler fires and menu closes', async () => {
      await user.click(within(document.body).getByRole('menuitem', { name: /sign out/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('more-clicked')).toHaveTextContent('Sign out');
      });
      await waitFor(() => {
        expect(within(document.body).queryByRole('menuitem', { name: /help & support/i })).not.toBeInTheDocument();
      });
    });
  },
};
