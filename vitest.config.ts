import path from 'node:path';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname = import.meta.dirname;

// Default config — used by the Storybook UI "Run tests" button (light theme).
// The storybookTest plugin injects test.name = "storybook:{configDir}" when
// VITEST_STORYBOOK=true so the Storybook test manager can filter to this project.
export default defineConfig({
  plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
  // Pre-bundle React JSX runtimes so Vite never discovers them mid-test and
  // triggers an unexpected reload that can cause flaky / duplicated runs.
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
    ],
  },
  test: {
    // Retry once so a transient browser-worker race during startup doesn't
    // fail the whole suite — the second attempt always connects cleanly.
    retry: 1,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      // Give the Playwright → Vitest WebSocket handshake more time on slower
      // CI runners (default is often 30 s which isn't enough when 60+ story
      // files compete for browser resources simultaneously).
      connectTimeout: 60_000,
    },
  },
});
