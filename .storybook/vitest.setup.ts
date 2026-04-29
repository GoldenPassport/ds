/**
 * Base Vitest setup for Storybook story tests (Light theme).
 * Called by both the light and dark projects — dark overrides globals after.
 */
import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/react';
import * as preview from './preview';

const annotations = setProjectAnnotations([preview]);

// Run Storybook's own global beforeAll (registers portals, etc.)
beforeAll(annotations.beforeAll);
