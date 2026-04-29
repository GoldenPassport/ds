/**
 * Vitest setup for the Dark-theme project.
 * Merges project annotations with initialGlobals: { theme: 'Dark' }
 * so the withThemeByClassName decorator applies the 'dark' class.
 */
import { beforeAll, beforeEach, afterEach } from 'vitest';
import { setProjectAnnotations } from '@storybook/react';
import * as preview from './.storybook/preview';

const annotations = setProjectAnnotations([
  preview,
  {
    // Override the default theme global for every story in this project
    initialGlobals: { theme: 'Dark' },
  },
]);

beforeAll(annotations.beforeAll);

// Belt-and-braces: also set the class directly so any CSS that resolves
// at paint time (e.g. --link-primary via oklch) picks up the dark variant.
beforeEach(() => {
  document.documentElement.classList.add('dark');
});

afterEach(() => {
  document.documentElement.classList.remove('dark');
});
