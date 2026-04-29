/**
 * Vitest setup for the Dark-theme project.
 *
 * Two-layer approach so dark mode is guaranteed regardless of which layer
 * the Storybook/Vitest runtime uses:
 *
 * 1. setProjectAnnotations globals: { theme: 'Dark' }
 *    → tells withThemeByClassName to apply the 'dark' class via the decorator
 *
 * 2. beforeEach / afterEach DOM manipulation
 *    → directly toggles .dark on <html> as a belt-and-braces fallback, so
 *      CSS custom properties resolved at paint time (e.g. --link-primary via
 *      oklch) always pick up the dark variant even if the decorator hasn't
 *      run yet.
 */
import { beforeAll, beforeEach, afterEach } from 'vitest';
import { setProjectAnnotations } from '@storybook/react';
import * as preview from './.storybook/preview';

const annotations = setProjectAnnotations([
  preview,
  { globals: { theme: 'Dark' } },
]);

beforeAll(annotations.beforeAll);

beforeEach(() => {
  document.documentElement.classList.add('dark');
});

afterEach(() => {
  document.documentElement.classList.remove('dark');
});
