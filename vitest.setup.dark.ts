/**
 * Vitest setup for the Dark-theme project.
 *
 * Two-layer approach so dark mode is applied regardless of execution order:
 *
 * 1. setProjectAnnotations globals: { theme: 'Dark' }
 *    → tells withThemeByClassName to apply the 'dark' class via the decorator.
 *    We intentionally omit the preview import — @storybook/addon-vitest ≥ 10.3
 *    provisions preview annotations automatically, and passing them here too
 *    would trigger a conflict warning.
 *
 * 2. beforeEach / afterEach DOM manipulation
 *    → directly toggles .dark on <html> as a fallback so CSS custom properties
 *      resolved at paint time (e.g. oklch dark tokens) always pick up the dark
 *      variant even before the decorator runs.
 */
import { setProjectAnnotations } from '@storybook/react';
import { beforeAll, beforeEach, afterEach } from 'vitest';

// Pass only the globals override — not the preview (plugin handles that).
// Cast to `any`: the Storybook type `NamedOrDefaultProjectAnnotations` doesn't
// declare `globals` even though the runtime accepts it at this position.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const annotations = setProjectAnnotations([{ globals: { theme: 'Dark' } } as any]);
beforeAll(annotations.beforeAll);

beforeEach(() => {
  document.documentElement.classList.add('dark');
});

afterEach(() => {
  document.documentElement.classList.remove('dark');
});
