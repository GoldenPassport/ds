import path from 'node:path';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import TimingReporter from './vitest.reporter.timing';

// Dark-theme variant — CLI only (pnpm test-storybook:dark).
// Runs separately from vitest.config.ts to avoid the duplicate project-name
// error that occurs when both configs share the same Storybook configDir.
export default defineConfig({
  plugins: [storybookTest({ configDir: path.join(import.meta.dirname, '.storybook') })],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
  test: {
    testTimeout: 30_000,
    reporters: ['default', new TimingReporter()],
    globalSetup: ['./vitest.globalSetup.ts'],
    setupFiles: ['./vitest.setup.dark.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
