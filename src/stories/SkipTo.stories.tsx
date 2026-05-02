import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { SkipTo } from '../components/SkipTo';

const meta = {
  title: 'Accessibility/SkipTo',
  component: SkipTo,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    links: { control: false },
  },
} satisfies Meta<typeof SkipTo>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  render: () => (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900">
      <SkipTo />
      <nav
        id="site-nav"
        tabIndex={-1}
        className="px-6 py-4 bg-white dark:bg-ink-800 border-b border-ink-200 dark:border-ink-700 flex items-center gap-4"
      >
        <span className="font-semibold font-display text-ink-900 dark:text-ink-50 text-sm">
          My App
        </span>
        <a href="#" className="text-sm font-body text-ink-500 dark:text-ink-300 hover:underline">Dashboard</a>
        <a href="#" className="text-sm font-body text-ink-500 dark:text-ink-300 hover:underline">Settings</a>
      </nav>
      <main
        id="main-content"
        tabIndex={-1}
        className="p-8 outline-none"
      >
        <p className="text-sm font-body text-ink-500 dark:text-ink-300">
          Press <kbd className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-700 font-mono text-xs text-ink-700 dark:text-ink-300">Tab</kbd> to reveal the skip link, then <kbd className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-700 font-mono text-xs text-ink-700 dark:text-ink-300">Enter</kbd> to activate it.
        </p>
        <h1 className="mt-4 text-2xl font-bold font-display text-ink-900 dark:text-ink-50">
          Main content
        </h1>
        <p className="mt-2 text-sm font-body text-ink-500 dark:text-ink-300">
          Focus lands here when the skip link is activated.
        </p>
      </main>
    </div>
  ),
};

// ── Default — single link ─────────────────────────────────

export const Default: Story = {
  name: 'Default (single link)',
  render: () => (
    <div className="min-h-[200px] bg-ink-50 dark:bg-ink-900 relative">
      <SkipTo />
      <div className="pt-12 px-6">
        <p className="text-xs font-body text-ink-500 dark:text-ink-300">
          Tab into this frame to reveal the skip link at the top.
        </p>
        <main id="main-content" tabIndex={-1} className="mt-4 outline-none">
          <p data-testid="main-label" className="text-xs font-mono text-ink-500 dark:text-ink-300">
            #main-content
          </p>
        </main>
      </div>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('link is initially off-screen (translate-y-full)', async () => {
      const link = canvas.getByRole('link', { name: 'Skip to main content' });
      // Element is in DOM and accessible tree but shifted out of viewport
      expect(link).toBeInTheDocument();
      expect(link).toHaveClass('-translate-y-full');
    });

    await step('Tab → link receives focus → slides into view', async () => {
      await user.tab();
      const link = canvas.getByRole('link', { name: 'Skip to main content' });
      await waitFor(() => expect(link).toHaveFocus());
      // focus:translate-y-0 is applied via Tailwind's focus variant
      expect(link).toHaveAttribute('href', '#main-content');
    });

    await step('Enter → focus moves to #main-content', async () => {
      await user.keyboard('{Enter}');
      await waitFor(() => {
        const main = canvasElement.querySelector('#main-content') as HTMLElement;
        expect(document.activeElement).toBe(main);
      });
    });
  },
};

// ── Multiple skip targets ─────────────────────────────────

export const MultipleLinks: Story = {
  name: 'Multiple skip targets',
  render: () => (
    <div className="min-h-[200px] bg-ink-50 dark:bg-ink-900 relative">
      <SkipTo
        links={[
          { label: 'Skip to main content', target: '#main-content' },
          { label: 'Skip to navigation',   target: '#site-nav' },
          { label: 'Skip to search',        target: '#search' },
        ]}
      />
      <div className="pt-12 px-6 flex flex-col gap-3">
        <nav id="site-nav" tabIndex={-1} className="outline-none">
          <p className="text-xs font-mono text-ink-500 dark:text-ink-300">#site-nav</p>
        </nav>
        <div id="search" tabIndex={-1} className="outline-none">
          <p className="text-xs font-mono text-ink-500 dark:text-ink-300">#search</p>
        </div>
        <main id="main-content" tabIndex={-1} className="outline-none">
          <p className="text-xs font-mono text-ink-500 dark:text-ink-300">#main-content</p>
        </main>
      </div>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('all three skip links are in the DOM', async () => {
      expect(canvas.getByRole('link', { name: 'Skip to main content' })).toBeInTheDocument();
      expect(canvas.getByRole('link', { name: 'Skip to navigation' })).toBeInTheDocument();
      expect(canvas.getByRole('link', { name: 'Skip to search' })).toBeInTheDocument();
    });

    await step('Tab → first link focused', async () => {
      await user.tab();
      await waitFor(() =>
        expect(canvas.getByRole('link', { name: 'Skip to main content' })).toHaveFocus(),
      );
    });

    await step('Tab → second link focused', async () => {
      await user.tab();
      await waitFor(() =>
        expect(canvas.getByRole('link', { name: 'Skip to navigation' })).toHaveFocus(),
      );
    });

    await step('Tab → third link focused', async () => {
      await user.tab();
      await waitFor(() =>
        expect(canvas.getByRole('link', { name: 'Skip to search' })).toHaveFocus(),
      );
    });

    await step('Enter on "Skip to search" → #search receives focus', async () => {
      await user.keyboard('{Enter}');
      await waitFor(() => {
        const target = canvasElement.querySelector('#search') as HTMLElement;
        expect(document.activeElement).toBe(target);
      });
    });
  },
};

// ── In-page layout context ────────────────────────────────
// Shows SkipTo as it would appear in a real app — Navbar, sidebar, main.

export const InPageLayout: Story = {
  name: 'In-page layout',
  render: () => (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-900">
      <SkipTo
        links={[
          { label: 'Skip to main content', target: '#main-content' },
          { label: 'Skip to navigation',   target: '#site-nav' },
        ]}
      />

      {/* Top navigation */}
      <header className="bg-white dark:bg-ink-800 border-b border-ink-200 dark:border-ink-700 px-6 py-3 flex items-center justify-between">
        <span className="font-bold font-display text-ink-900 dark:text-ink-50 text-sm">
          Golden Passport
        </span>
        <nav id="site-nav" tabIndex={-1} className="flex gap-4 outline-none" aria-label="Site navigation">
          {['Dashboard', 'Workflows', 'Team', 'Settings'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-body text-ink-500 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 hover:underline"
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* Page body */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 p-8 outline-none"
        aria-label="Main content"
      >
        <h1 className="text-xl font-bold font-display text-ink-900 dark:text-ink-50">
          Dashboard
        </h1>
        <p className="mt-2 text-sm font-body text-ink-500 dark:text-ink-300 max-w-prose">
          Keyboard users can press <kbd className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-700 font-mono text-xs text-ink-700 dark:text-ink-300">Tab</kbd> to
          reveal skip links at the top of the page, bypassing repeated navigation
          on every page load — satisfying WCAG 2.4.1 Bypass Blocks (Level A).
        </p>
      </main>
    </div>
  ),
};
