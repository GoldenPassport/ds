import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import gpLogo from '../../assets/gp-logo.png';
import { Plus, Settings } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';

const meta = {
  title: 'Navigation/Navbar',
  component: Navbar,
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

const USER = {
  name: 'Alex Johnson',
  email: 'alex@acme.com',
  menuItems: [
    { label: 'Your profile', href: '#' },
    { label: 'Settings', href: '#', icon: <Settings className="w-4 h-4" /> },
    { label: 'Sign out', onClick: () => {}, dividerAbove: true },
  ],
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
          <Button size="sm" variant="secondary">
            Log in
          </Button>
          <Button size="sm" variant="primary">
            Sign up
          </Button>
        </div>
      }
    />
  ),
};

// ── In context ────────────────────────────────────────────

export const InContext: Story = {
  name: 'In context — app shell',
  args: {},
  parameters: {
    // mobile2 = 414 × 896 — below the lg breakpoint (1024 px) so lg:hidden
    // doesn't apply and the hamburger is visible in both the Storybook GUI and
    // the Vitest/Playwright runner.
    viewport: { defaultViewport: 'mobile2' },
  },
  render: () => (
    <Navbar logo={LOGO_LIGHT} items={NAV_ITEMS_SIMPLE} user={USER} search />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('hamburger button starts with aria-expanded=false', async () => {
      const burger = await canvas.findByRole('button', { name: /open menu/i });
      expect(burger).toHaveAttribute('aria-expanded', 'false');
    });

    await step('click hamburger → mobile menu opens (aria-expanded=true)', async () => {
      const burger = canvas.getByRole('button', { name: /open menu/i });
      await user.click(burger);
      await waitFor(() => {
        // aria-label switches to "Close menu" when open
        expect(canvas.getByRole('button', { name: /close menu/i })).toHaveAttribute(
          'aria-expanded',
          'true',
        );
      });
    });

    await step('mobile nav links are now visible', async () => {
      const links = canvas.getAllByRole('link', { name: /dashboard/i });
      expect(links.length).toBeGreaterThan(0);
    });

    await step('click hamburger again → mobile menu closes', async () => {
      const closeBtn = canvas.getByRole('button', { name: /close menu/i });
      await user.click(closeBtn);
      await waitFor(() => {
        expect(canvas.getByRole('button', { name: /open menu/i })).toHaveAttribute(
          'aria-expanded',
          'false',
        );
      });
    });
  },
};

// ── More menu ─────────────────────────────────────────────

const MORE_ITEMS = [
  { label: 'Help & support', href: '#' },
  { label: 'Keyboard shortcuts', href: '#' },
  { label: 'Sign out', onClick: () => {}, dividerAbove: true },
];

export const WithMoreMenu: Story = {
  name: 'With more menu (⋮)',
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
          moreMenu={[
            { label: 'Help & support', href: '#' },
            { label: 'Keyboard shortcuts', href: '#' },
            { label: 'Sign out', onClick: () => setLastClicked('Sign out'), dividerAbove: true },
          ]}
        />
        {searchQuery && (
          <p data-testid="search-output" className="text-xs font-body text-ink-500 dark:text-ink-300 px-4">
            Search: {searchQuery}
          </p>
        )}
        {lastClicked && (
          <p data-testid="menu-clicked" className="text-xs font-body text-ink-500 dark:text-ink-300 px-4">
            Clicked: {lastClicked}
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('type into search input → onSearch fires', async () => {
      const input = canvas.getByRole('searchbox');
      await user.click(input);
      await user.type(input, 'dashboard');
      await waitFor(() => {
        expect(canvas.getByTestId('search-output')).toHaveTextContent('dashboard');
      });
    });

    await step('click user avatar button → dropdown opens with menu items', async () => {
      const userBtn = canvas
        .getAllByRole('button')
        .find(
          (btn) => !btn.getAttribute('aria-label') && btn.querySelector('[class*="rounded-full"]'),
        )!;
      await user.click(userBtn);
      await waitFor(() => {
        expect(
          within(document.body).getByRole('menuitem', { name: /your profile/i }),
        ).toBeInTheDocument();
      });
    });

    await step('click "Sign out" — onClick fires and dropdown closes', async () => {
      await user.click(within(document.body).getByRole('menuitem', { name: /sign out/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('menu-clicked')).toHaveTextContent('Sign out');
      });
      await waitFor(() => {
        expect(
          within(document.body).queryByRole('menuitem', { name: /your profile/i }),
        ).not.toBeInTheDocument();
      });
    });

    await step('click ⋮ button → more menu opens', async () => {
      const moreBtn = await canvas.findByRole('button', { name: /more options/i });
      await user.click(moreBtn);
      await waitFor(() => {
        expect(
          within(document.body).getByRole('menuitem', { name: /help & support/i }),
        ).toBeInTheDocument();
      });
    });

    await step('"Sign out" item is present with divider', async () => {
      expect(
        within(document.body).getByRole('menuitem', { name: /sign out/i }),
      ).toBeInTheDocument();
    });

    await step('click "Sign out" in more menu → handler fires and menu closes', async () => {
      await user.click(within(document.body).getByRole('menuitem', { name: /sign out/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('menu-clicked')).toHaveTextContent('Sign out');
      });
      await waitFor(() => {
        expect(
          within(document.body).queryByRole('menuitem', { name: /help & support/i }),
        ).not.toBeInTheDocument();
      });
    });
  },
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
      <Navbar ariaLabel="Light navigation" logo={LOGO_LIGHT} items={NAV_ITEMS_SIMPLE} user={USER} />
      <Navbar
        ariaLabel="Dark navigation"
        appearance="dark"
        logo={LOGO_DARK}
        items={NAV_ITEMS_SIMPLE}
        user={USER}
      />
      <Navbar
        ariaLabel="Light navigation with search"
        logo={LOGO_LIGHT}
        items={NAV_ITEMS_SIMPLE}
        user={USER}
        search
      />
      <Navbar
        ariaLabel="Dark navigation with search and actions"
        appearance="dark"
        logo={LOGO_DARK}
        items={NAV_ITEMS_SIMPLE}
        user={USER}
        search
        actions={
          <Button size="sm" variant="primary">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        }
      />
    </div>
  ),
};

