import type { StorybookConfig } from '@storybook/react-vite';

// addon-mcp uses import.meta.env dynamically which triggers Vite 6's module
// runner Proxy guard during Vitest serialisation. Exclude it in test runs
// where it serves no purpose.
const isVitest = !!process.env.VITEST;

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  core: {
    disableTelemetry: true,
  },
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
    ...(!isVitest ? ['@storybook/addon-mcp'] : []),
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    // Tailwind v4 is handled by vite.config.ts plugin
    return config;
  },
};

export default config;
