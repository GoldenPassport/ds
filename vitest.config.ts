import path from 'node:path';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import TimingReporter from './vitest.reporter.timing';

export default defineConfig({
  plugins: [storybookTest({ configDir: path.join(import.meta.dirname, '.storybook') })],
  // Pre-bundle React so Vite doesn't discover them mid-test and trigger an
  // unexpected reload that causes flaky or duplicated runs.
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
  test: {
    // axe-core a11y scans are slow on complex stories — 30 s gives enough headroom.
    testTimeout: 30_000,
    reporters: ['default', new TimingReporter()],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**'],
      exclude: ['src/**/*.stories.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    },
    // Force-exit after teardown on CLI runs — see vitest.globalSetup.ts.
    globalSetup: ['./vitest.globalSetup.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
