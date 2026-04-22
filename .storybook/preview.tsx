import React from 'react';
import type { Preview, Decorator } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '../src/styles/index.css';

/** Wrap every story in a surface-coloured background that respects theme */
const withBackground: Decorator = (Story, context) => {
  const isDark = context.globals.theme === 'dark';
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
  decorators: [
    withThemeByClassName({
      themes: { Light: '', Dark: 'dark' },
      defaultTheme: 'Light',
    }),
    withBackground,
  ],
  parameters: {
    backgrounds: { disable: true },   // use addon-themes instead
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [
          // colour contrast is intentional on gold buttons (dark text on gold)
          { id: 'color-contrast', enabled: true },
        ],
      },
    },
    docs: {
      theme: undefined, // inherits Storybook default
    },
  },
};

export default preview;
