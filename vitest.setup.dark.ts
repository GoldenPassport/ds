/**
 * Vitest setup for the Dark-theme project.
 *
 * @storybook/addon-vitest (≥ 10.3) applies preview annotations automatically,
 * so setProjectAnnotations is no longer needed here.
 *
 * We still toggle .dark on <html> directly so CSS custom properties resolved
 * at paint time (e.g. --link-primary via oklch) always pick up the dark
 * variant, regardless of when the withThemeByClassName decorator runs.
 */
import { beforeEach, afterEach } from 'vitest';

beforeEach(() => {
  document.documentElement.classList.add('dark');
});

afterEach(() => {
  document.documentElement.classList.remove('dark');
});
