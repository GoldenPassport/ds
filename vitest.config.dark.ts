import path from 'node:path';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname = import.meta.dirname;

// Dark-theme variant — intended for CLI use only (pnpm test-storybook:dark).
// Run separately from vitest.config.ts to avoid the duplicate project-name
// error that occurs when both configs share the same Storybook configDir.
export default defineConfig({
  plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
  test: {
    retry: 1,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      connectTimeout: 60_000,
    },
    setupFiles: ['./vitest.setup.dark.ts'],
  },
});
