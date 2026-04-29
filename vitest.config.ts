import path from 'node:path';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname = import.meta.dirname;

const browser = {
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [{ browser: 'chromium' }],
} as const;

export default defineConfig({
  test: {
    projects: [
      // ── Light theme ───────────────────────────────────────
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook-light',
          browser,
          setupFiles: ['./.storybook/vitest.setup.ts'],
        },
      },

      // ── Dark theme ────────────────────────────────────────
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook-dark',
          browser,
          setupFiles: ['./vitest.setup.dark.ts'],
        },
      },
    ],
  },
});
