import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const configDir = path.join(import.meta.dirname, '.storybook');

// The Storybook GUI sets VITEST_STORYBOOK=true in the Node env before spawning
// Vitest.  Give afterEach hooks (where Axe runs) 30 s in the GUI so slow or
// complex stories don't time out; keep 10 s for vitest run.
const hookTimeout = process.env.VITEST_STORYBOOK === 'true' ? 30_000 : 10_000;

export default defineConfig({
  plugins: [storybookTest({ configDir }), tailwindcss()],
  optimizeDeps: {
    include: ['react/jsx-dev-runtime'],
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
