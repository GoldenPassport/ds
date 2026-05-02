import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { SkipTo } from '../components/SkipTo';

const meta = {
  title: 'Accessibility/SkipTo',
  component: SkipTo,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    label:         { control: 'text' },
    shortcut:      { control: 'text' },
    headingLevels: { control: false },
    root:          { control: false },
  },
} satisfies Meta<typeof SkipTo>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared page scaffold ──────────────────────────────────

function PageScaffold({
  children,
  skipTo,
}: {
  children?: React.ReactNode;
  skipTo?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-900 font-body">
      {skipTo}

      <header role="banner" className="px-6 py-3 bg-white dark:bg-ink-800 border-b border-ink-200 dark:border-ink-700 flex items-center justify-between">
        <span className="font-bold font-display text-sm text-ink-900 dark:text-ink-50">Golden Passport</span>
        <nav id="site-nav" aria-label="Main Menu">
          {['Dashboard', 'Workflows', 'Team', 'Settings'].map((item) => (
            <a key={item} href="#" className="ml-4 text-sm text-ink-500 dark:text-ink-300 hover:underline">{item}</a>
          ))}
        </nav>
        <div role="search" aria-label="Site search">
          <input
            type="search"
            placeholder="Search…"
            aria-label="Search"
            className="text-xs border border-ink-200 dark:border-ink-700 rounded-lg px-2 py-1 bg-white dark:bg-ink-900 text-ink-700 dark:text-ink-300 outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </header>

      <main id="main-content" className="flex-1 p-8 outline-none" tabIndex={-1} aria-label="Main content">
        <h1 className="text-2xl font-bold font-display text-ink-900 dark:text-ink-50">Dashboard</h1>

        <h2 className="mt-6 text-lg font-semibold font-display text-ink-900 dark:text-ink-50">Recent activity</h2>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Your last 7 days at a glance.</p>

        <h2 className="mt-6 text-lg font-semibold font-display text-ink-900 dark:text-ink-50">Deployments</h2>
        <h3 className="mt-3 text-base font-semibold font-display text-ink-700 dark:text-ink-200">Production</h3>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">4 deployments this week.</p>
        <h3 className="mt-3 text-base font-semibold font-display text-ink-700 dark:text-ink-200">Staging</h3>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">12 deployments this week.</p>

        {children}
      </main>

      <aside aria-label="Notifications" className="hidden">Aside content</aside>
      <footer role="contentinfo" className="px-6 py-3 border-t border-ink-200 dark:border-ink-700 text-xs text-ink-500 dark:text-ink-400">
        © 2025 Golden Passport
      </footer>
    </div>
  );
}

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <PageScaffold skipTo={<SkipTo {...args} shortcut="" />} />
  ),
  args: {
    label:         'Skip To…',
    headingLevels: [1, 2, 3],
  },
};

// ── Default ───────────────────────────────────────────────

export const Default: Story = {
  name: 'Default',
  render: () => (
    <PageScaffold skipTo={<SkipTo shortcut="" />} />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user   = userEvent.setup();

    await step('button is off-screen before Tab', async () => {
      const btn = canvas.getByRole('button', { name: /skip to/i });
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveClass('-translate-y-full');
    });

    await step('Tab → button receives focus; menu opens; focus stays on button', async () => {
      await user.tab();
      await waitFor(() => expect(canvas.getByRole('button', { name: /skip to/i })).toHaveFocus());
      expect(canvas.getByRole('menu')).toBeInTheDocument();
    });

    await step('menu lists landmark regions', async () => {
      const menu = canvas.getByRole('menu');
      expect(within(menu).getByText(/Landmark Regions/)).toBeInTheDocument();
      expect(within(menu).getByRole('menuitem', { name: 'Main: Main content' })).toBeInTheDocument();
      expect(within(menu).getByRole('menuitem', { name: 'Navigation: Main Menu' })).toBeInTheDocument();
    });

    await step('menu lists headings in main region', async () => {
      const menu = canvas.getByRole('menu');
      expect(within(menu).getByText(/Headings in Main Region/)).toBeInTheDocument();
      expect(within(menu).getByRole('menuitem', { name: 'Dashboard' })).toBeInTheDocument();
      expect(within(menu).getByRole('menuitem', { name: 'Deployments' })).toBeInTheDocument();
    });

    await step('ArrowDown from button → first menu item focused', async () => {
      const menu  = canvas.getByRole('menu');
      const items = within(menu).getAllByRole('menuitem');
      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(items[0]).toHaveFocus());
    });

    await step('ArrowDown → second item focused', async () => {
      const items = within(canvas.getByRole('menu')).getAllByRole('menuitem');
      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(items[1]).toHaveFocus());
    });

    await step('Escape closes menu and returns focus to button', async () => {
      await user.keyboard('{Escape}');
      await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
      await waitFor(() => expect(canvas.getByRole('button', { name: /skip to/i })).toHaveFocus());
    });

    await step('click "Main" landmark → #main-content receives focus', async () => {
      // Re-open via Enter
      await user.keyboard('{Enter}');
      await waitFor(() => expect(canvas.getByRole('menu')).toBeInTheDocument());
      const mainItem = within(canvas.getByRole('menu')).getByRole('menuitem', { name: 'Main: Main content' });
      await user.click(mainItem);
      await waitFor(() => {
        const mainEl = canvasElement.querySelector<HTMLElement>('#main-content');
        expect(document.activeElement).toBe(mainEl);
      });
    });
  },
};

// ── Multiple heading levels ───────────────────────────────

export const AllHeadingLevels: Story = {
  name: 'All heading levels (h1–h6)',
  render: () => (
    <PageScaffold
      skipTo={<SkipTo shortcut="" headingLevels={[1, 2, 3, 4, 5, 6]} />}
    >
      <h4 className="mt-4 text-sm font-semibold font-display text-ink-700 dark:text-ink-200">Canary</h4>
      <h5 className="mt-2 text-sm font-medium font-display text-ink-600 dark:text-ink-300">Region A</h5>
      <h6 className="mt-1 text-xs font-medium font-display text-ink-500 dark:text-ink-400">Sub-region A.1</h6>
    </PageScaffold>
  ),
};

// ── Custom label & shortcut ───────────────────────────────

export const CustomLabelShortcut: Story = {
  name: 'Custom label & shortcut',
  render: () => (
    <PageScaffold
      skipTo={<SkipTo label="Navigate to…" shortcut="alt+1" />}
    />
  ),
};

// ── No landmarks fallback ─────────────────────────────────

export const NoLandmarks: Story = {
  name: 'Fallback — no landmarks found',
  render: () => {
    // A minimal container with no semantic landmarks so the fallback message shows.
    return (
      <div className="p-8 bg-ink-50 dark:bg-ink-900 min-h-[200px]">
        <SkipTo shortcut="" />
        <p className="text-sm text-ink-500 dark:text-ink-300">
          This page has no landmark regions or headings — the menu shows the empty state.
        </p>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user   = userEvent.setup();

    await step('Tab opens the menu', async () => {
      await user.tab();
      await waitFor(() => expect(canvas.getByRole('menu')).toBeInTheDocument());
    });

    await step('fallback message is shown', async () => {
      expect(canvas.getByText(/no landmarks or headings found/i)).toBeInTheDocument();
    });
  },
};
