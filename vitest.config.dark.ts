// Dark-theme companion config.  Run alongside vitest.config.ts to cover a11y
// violations that only appear in dark mode.  Not used by the Storybook GUI
// (which auto-discovers vitest.config.ts only); run explicitly via the
// test-storybook:dark or test-storybook:all package.json scripts.
//
// Vite's `define` replaces the literal expression
//   import.meta.env.STORYBOOK_THEME
// with "Dark" in every processed file — including .storybook/preview.tsx —
// so the conditional spread there sets initialGlobals.theme = "Dark" for
// every story without touching the light config or calling setProjectAnnotations.

import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const configDir = path.join(import.meta.dirname, '.storybook');

const hookTimeout = process.env.VITEST_STORYBOOK === 'true' ? 30_000 : 10_000;

export default defineConfig({
  plugins: [storybookTest({ configDir }), tailwindcss()],
  optimizeDeps: {
    include: ['react/jsx-dev-runtime'],
  },
  define: {
    'import.meta.env.STORYBOOK_THEME': JSON.stringify('Dark'),
  },
  test: {
    hookTimeout,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
