import type { Preview, Decorator } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/styles/index.css';

// Disable CSS transitions and animations during Vitest runs so that
// toBeVisible() assertions don't race against enter/leave transitions
// (e.g. HeadlessUI Dialog fading in at opacity-0 → opacity-100).
if (import.meta.env.VITEST) {
  const style = document.createElement('style');
  style.textContent = '*, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; animation-delay: 0s !important; animation-fill-mode: forwards !important; }';
  document.head.appendChild(style);
}

// For the desktop-dark Vitest project, vitest.config.dark.ts injects
// STORYBOOK_THEME = "Dark" via Vite define.  Apply the class synchronously
// at module-load time — before the first React render — so Axe always sees
// a fully-resolved dark DOM.  Using initialGlobals instead triggers a
// Storybook globals update that causes a mid-scan re-render, which corrupts
// Axe's background-colour trace and produces spurious contrast failures.
if (import.meta.env.STORYBOOK_THEME === 'Dark') {
  document.documentElement.classList.add('dark');
}

/** Wrap every story in a surface-coloured background that respects theme */
const withBackground: Decorator = (Story, context) => {
  const isDark =
    context.globals.theme === 'Dark' ||
    import.meta.env.STORYBOOK_THEME === 'Dark';
  return (
    <div
      className={`min-h-screen p-8 font-body ${
        isDark ? 'bg-ink-900' : 'bg-ink-50'
      }`}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for all stories',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['Light', 'Dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: { Light: '', Dark: 'dark' },
      defaultTheme: (import.meta.env.STORYBOOK_THEME as string | undefined) ?? 'Light',
    }),
    withBackground,
  ],
  parameters: {
    backgrounds: { disabled: true },   // use addon-themes instead
    layout: 'fullscreen',
    a11y: {
      // Override the addon's default of "todo" (warn-only) so violations fail the
      // Vitest run.  Individual stories can downgrade back to "todo" or "off".
      test: 'error',
      // Limit Axe to WCAG 2.x / 2.1 rules only (~40 rules vs ~90 by default).
      // This roughly halves scan time per story without losing meaningful coverage.
      // Note: `a11y.timeout` is NOT a real parameter — the addon only reads
      //       `config` and `options`; animation waiting is hardcoded at 5 s.
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
      config: {
        rules: [
          // colour contrast is intentional on primary buttons (dark text on primary)
          { id: 'color-contrast', enabled: true },
          // Showcase stories intentionally render multiple instances of the same
          // landmark (nav, aside…) on one page for visual comparison.  This rule
          // fires on those stories but is not a real-world violation.
          { id: 'landmark-unique', enabled: false },
        ],
      },
    },
    docs: {
      theme: undefined, // inherits Storybook default
    },
  },
};

export default preview;
