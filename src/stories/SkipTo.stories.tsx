import React, { useRef, useState, useEffect } from 'react';
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
    <PageScaffold skipTo={<SkipTo {...args} />} />
  ),
  args: {
    label:         'Skip To…',
    shortcut:      'alt+0',
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

    await step('Tab → button slides into view; menu stays closed', async () => {
      await user.tab();
      await waitFor(() => expect(canvas.getByRole('button', { name: /skip to/i })).toHaveFocus());
      expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
    });

    await step('Enter → submenu opens', async () => {
      await user.keyboard('{Enter}');
      await waitFor(() => expect(canvas.getByRole('menu')).toBeInTheDocument());
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

    await step('ArrowDown → first menu item focused', async () => {
      const items = within(canvas.getByRole('menu')).getAllByRole('menuitem');
      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(items[0]).toHaveFocus());
    });

    await step('ArrowDown → second item focused', async () => {
      const items = within(canvas.getByRole('menu')).getAllByRole('menuitem');
      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(items[1]).toHaveFocus());
    });

    await step('Escape → closes submenu, returns focus to button', async () => {
      await user.keyboard('{Escape}');
      await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
      await waitFor(() => expect(canvas.getByRole('button', { name: /skip to/i })).toHaveFocus());
    });

    await step('Enter reopens; navigate to "Main: Main content" with Enter → focus jumps to #main-content, menu closes', async () => {
      await user.keyboard('{Enter}');
      await waitFor(() => expect(canvas.getByRole('menu')).toBeInTheDocument());
      // Arrow down to the "Main: Main content" item (index 3 in landmark group).
      await user.keyboard('{ArrowDown}'); // Banner
      await user.keyboard('{ArrowDown}'); // Navigation: Main Menu
      await user.keyboard('{ArrowDown}'); // Search: Site search
      await user.keyboard('{ArrowDown}'); // Main: Main content
      await waitFor(() =>
        expect(within(canvas.getByRole('menu')).getByRole('menuitem', { name: 'Main: Main content' })).toHaveFocus()
      );
      await user.keyboard('{Enter}');
      // Menu must close on activation.
      await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
      // Focus must land on the target page element.
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
    // Scope the scan to this container so Storybook's own injected headings
    // (e.g. <h1>No Preview</h1>) don't appear in the menu.
    const containerRef = useRef<HTMLDivElement>(null);
    const [root, setRoot] = useState<HTMLElement | null>(null);
    useEffect(() => { setRoot(containerRef.current); }, []);

    return (
      <div ref={containerRef} className="p-8 bg-ink-50 dark:bg-ink-900 min-h-[200px]">
        <SkipTo shortcut="" root={root} />
        <p className="text-sm text-ink-500 dark:text-ink-300">
          This page has no landmark regions or headings — the menu shows the empty state.
        </p>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user   = userEvent.setup();

    await step('Tab → button visible, menu closed', async () => {
      await user.tab();
      await waitFor(() => expect(canvas.getByRole('button', { name: /skip to/i })).toHaveFocus());
      expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
    });

    await step('Enter → menu opens with fallback message', async () => {
      await user.keyboard('{Enter}');
      await waitFor(() => expect(canvas.getByRole('menu')).toBeInTheDocument());
      expect(canvas.getByText(/no landmarks or headings found/i)).toBeInTheDocument();
    });

    await step('ArrowDown in empty menu → no-op (covers previewPageElement out-of-bounds guard)', async () => {
      // itemsRef is empty → idx arithmetic produces NaN → no crash, menu stays open
      await user.keyboard('{ArrowDown}');
      expect(canvas.getByRole('menu')).toBeInTheDocument();
    });
  },
};

// ── Search activation ─────────────────────────────────────

export const SearchActivation: Story = {
  name: 'Search landmark → input focused immediately',
  render: () => (
    <PageScaffold skipTo={<SkipTo shortcut="" />} />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user   = userEvent.setup();

    await step('open menu', async () => {
      await user.tab();
      await waitFor(() => expect(canvas.getByRole('button', { name: /skip to/i })).toHaveFocus());
      await user.keyboard('{Enter}');
      await waitFor(() => expect(canvas.getByRole('menu')).toBeInTheDocument());
    });

    await step('ArrowDown × 3 → "Search: Site search" focused', async () => {
      await user.keyboard('{ArrowDown}'); // Banner
      await user.keyboard('{ArrowDown}'); // Navigation: Main Menu
      await user.keyboard('{ArrowDown}'); // Search: Site search
      await waitFor(() =>
        expect(within(canvas.getByRole('menu')).getByRole('menuitem', { name: 'Search: Site search' })).toHaveFocus()
      );
    });

    await step('Space → menu closes; search <input> receives focus (natively focusable path)', async () => {
      await user.keyboard(' ');
      await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
      await waitFor(() => {
        const input = canvasElement.querySelector<HTMLElement>('input[type="search"]');
        expect(document.activeElement).toBe(input);
      });
    });
  },
};

// ── Heading activation ────────────────────────────────────

export const HeadingActivation: Story = {
  name: 'Heading → h1 focused (tabindex temp-inject path)',
  render: () => (
    <PageScaffold skipTo={<SkipTo shortcut="" />} />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user   = userEvent.setup();

    await step('open menu', async () => {
      await user.tab();
      await waitFor(() => expect(canvas.getByRole('button', { name: /skip to/i })).toHaveFocus());
      await user.keyboard('{Enter}');
      await waitFor(() => expect(canvas.getByRole('menu')).toBeInTheDocument());
    });

    await step('navigate to "Dashboard" heading (5 landmarks then h1)', async () => {
      // Landmarks: Banner(0) Nav(1) Search(2) Main(3) Footer(4); then Dashboard h1(5)
      for (let i = 0; i < 6; i++) await user.keyboard('{ArrowDown}');
      await waitFor(() =>
        expect(within(canvas.getByRole('menu')).getByRole('menuitem', { name: 'Dashboard' })).toHaveFocus()
      );
    });

    await step('Enter → menu closes; h1 receives focus (tabindex=-1 injected)', async () => {
      await user.keyboard('{Enter}');
      await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
      await waitFor(() => {
        const h1 = canvasElement.querySelector<HTMLElement>('h1');
        expect(document.activeElement).toBe(h1);
      });
    });
  },
};

// ── ArrowUp + Close button ────────────────────────────────

export const ArrowUpAndCloseButton: Story = {
  name: 'ArrowUp wraps to last item; Close button closes menu',
  render: () => (
    <PageScaffold skipTo={<SkipTo shortcut="" />} />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user   = userEvent.setup();

    await step('open menu', async () => {
      await user.tab();
      await waitFor(() => expect(canvas.getByRole('button', { name: /skip to/i })).toHaveFocus());
      await user.keyboard('{Enter}');
      await waitFor(() => expect(canvas.getByRole('menu')).toBeInTheDocument());
    });

    await step('ArrowUp from button → last menu item focused (wrap-around)', async () => {
      await user.keyboard('{ArrowUp}');
      const items = within(canvas.getByRole('menu')).getAllByRole('menuitem');
      await waitFor(() => expect(items[items.length - 1]).toHaveFocus());
    });

    await step('click Close → menu closes, focus returns to trigger button', async () => {
      await user.click(canvas.getByRole('button', { name: 'Close' }));
      await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
      await waitFor(() => expect(canvas.getByRole('button', { name: /skip to/i })).toHaveFocus());
    });
  },
};

// ── Tab exits menu ────────────────────────────────────────

export const TabExitsMenu: Story = {
  name: 'Tab from menu item closes menu without stealing focus',
  render: () => (
    <PageScaffold skipTo={<SkipTo shortcut="" />} />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user   = userEvent.setup();

    await step('open menu and focus first item', async () => {
      await user.tab();
      await waitFor(() => expect(canvas.getByRole('button', { name: /skip to/i })).toHaveFocus());
      await user.keyboard('{Enter}');
      await waitFor(() => expect(canvas.getByRole('menu')).toBeInTheDocument());
      await user.keyboard('{ArrowDown}');
      const items = within(canvas.getByRole('menu')).getAllByRole('menuitem');
      await waitFor(() => expect(items[0]).toHaveFocus());
    });

    await step('Tab → menu closes; focus moves to next page element (not back to button)', async () => {
      await user.tab();
      await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
      // Tab propagated — focus should NOT be on the SkipTo trigger button
      expect(canvas.getByRole('button', { name: /skip to/i })).not.toHaveFocus();
    });
  },
};

// ── Mouse outside + button toggle ────────────────────────

export const MouseAndButtonToggle: Story = {
  name: 'Mousedown outside closes menu; button click toggles',
  render: () => (
    <PageScaffold skipTo={<SkipTo shortcut="" />} />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user   = userEvent.setup();

    await step('open menu via Tab + Enter', async () => {
      await user.tab();
      await waitFor(() => expect(canvas.getByRole('button', { name: /skip to/i })).toHaveFocus());
      await user.keyboard('{Enter}');
      await waitFor(() => expect(canvas.getByRole('menu')).toBeInTheDocument());
    });

    await step('click inside page (outside widget) → menu closes', async () => {
      await user.click(canvasElement.querySelector('main')!);
      await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
    });

    await step('click button → menu opens', async () => {
      await user.click(canvas.getByRole('button', { name: /skip to/i }));
      await waitFor(() => expect(canvas.getByRole('menu')).toBeInTheDocument());
    });

    await step('click button again (toggle) → menu closes', async () => {
      await user.click(canvas.getByRole('button', { name: /skip to/i }));
      await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
    });
  },
};

// ── Accessible name from aria-labelledby and title ────────

export const LabelledByAndTitle: Story = {
  name: 'Accessible name via aria-labelledby and title',
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [root, setRoot] = useState<HTMLElement | null>(null);
    useEffect(() => { setRoot(containerRef.current); }, []);

    return (
      <div ref={containerRef} className="p-8 bg-ink-50 dark:bg-ink-900 min-h-screen">
        <SkipTo shortcut="" root={root} />
        <main>
          <h2 id="analytics-heading" className="text-lg font-semibold text-ink-900 dark:text-ink-50">
            Analytics
          </h2>
          {/* aria-labelledby: name derived from referenced element's text content */}
          <section
            role="region"
            aria-labelledby="analytics-heading"
            className="mt-4 p-4 bg-white dark:bg-ink-800 rounded-xl"
          >
            <p className="text-sm text-ink-500 dark:text-ink-300">Chart data here.</p>
          </section>

          {/* title: fallback accessible name when no aria-label / labelledby */}
          <nav title="Breadcrumb" className="mt-6">
            <a href="#" className="text-sm text-ink-700 dark:text-ink-200 underline">Home</a>
          </nav>
        </main>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user   = userEvent.setup();

    await step('open menu', async () => {
      await user.tab();
      await waitFor(() => expect(canvas.getByRole('button', { name: /skip to/i })).toHaveFocus());
      await user.keyboard('{Enter}');
      await waitFor(() => expect(canvas.getByRole('menu')).toBeInTheDocument());
    });

    await step('aria-labelledby name appears in menu (covers labelledBy branch)', async () => {
      expect(within(canvas.getByRole('menu')).getByRole('menuitem', { name: 'Region: Analytics' })).toBeInTheDocument();
    });

    await step('title attribute name appears in menu (covers title branch)', async () => {
      expect(within(canvas.getByRole('menu')).getByRole('menuitem', { name: 'Navigation: Breadcrumb' })).toBeInTheDocument();
    });
  },
};

// ── Non-alt shortcut (covers formatButtonShortcut else branch) ──

export const CtrlShortcut: Story = {
  name: 'Non-Alt shortcut (Ctrl+K)',
  render: () => (
    <PageScaffold
      skipTo={<SkipTo label="Jump to…" shortcut="ctrl+k" />}
    />
  ),
};
