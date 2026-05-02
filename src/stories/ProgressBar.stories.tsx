import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from '../components/ProgressBar';

const meta = {
  title: 'Navigation/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    value: 60,
    max: 100,
    size: 'md',
    variant: 'default',
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress (0–max)',
    },
    max: { control: 'number', description: 'Maximum value. Default 100.' },
    shape: {
      control: 'select',
      options: ['linear', 'circular'],
      description: 'Visual shape of the progress indicator',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Track height (linear) or diameter (circular)',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Fill colour',
    },
    label: { control: 'text', description: 'Label shown above-left (linear) or below (circular)' },
    showValue: { control: 'boolean', description: 'Show percentage' },
    animated: { control: 'boolean', description: 'Pulse animation on the fill' },
    indeterminate: {
      control: 'boolean',
      description: 'Unknown progress — shows an animated full bar',
    },
    className: { control: 'text' },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: { value: 60, label: 'Uploading…', showValue: true },
};

// ── Sizes ─────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-5 max-w-md">
      <ProgressBar value={70} size="xs" label="xs" showValue />
      <ProgressBar value={70} size="sm" label="sm" showValue />
      <ProgressBar value={70} size="md" label="md (default)" showValue />
      <ProgressBar value={70} size="lg" label="lg" showValue />
    </div>
  ),
};

// ── Variants ──────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-5 max-w-md">
      <ProgressBar value={60} variant="default" label="Default" showValue />
      <ProgressBar value={80} variant="success" label="Success" showValue />
      <ProgressBar value={45} variant="warning" label="Warning" showValue />
      <ProgressBar value={20} variant="error" label="Error" showValue />
    </div>
  ),
};

// ── Label + value ─────────────────────────────────────────

export const WithLabel: Story = {
  name: 'With label',
  render: () => (
    <div className="flex flex-col gap-5 max-w-md">
      <ProgressBar value={35} label="Uploading files…" />
      <ProgressBar value={75} label="Processing" showValue />
      <ProgressBar value={100} variant="success" label="Complete" showValue />
    </div>
  ),
};

// ── No label ──────────────────────────────────────────────

export const Bare: Story = {
  name: 'Bare — no label or value',
  parameters: {
    docs: {
      description: {
        story:
          'When no visible `label` is rendered, supply `aria-label` so the progressbar has an accessible name (axe rule `aria-progressbar-name`).',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3 max-w-md">
      <ProgressBar value={25} aria-label="Download progress" />
      <ProgressBar value={55} variant="success" aria-label="Sync progress" />
      <ProgressBar value={80} variant="warning" aria-label="Quota usage" />
    </div>
  ),
};

// ── Animated ──────────────────────────────────────────────

export const Animated: Story = {
  name: 'Animated — active upload',
  render: () => {
    const [value, setValue] = React.useState(0);
    const done = value >= 100;

    React.useEffect(() => {
      if (done) return;
      const t = setInterval(() => setValue((v) => Math.min(v + 3, 100)), 150);
      return () => clearInterval(t);
    }, [done]);

    return (
      <div className="max-w-md space-y-2">
        <ProgressBar
          value={value}
          label={done ? 'Upload complete' : 'Uploading…'}
          variant={done ? 'success' : 'default'}
          showValue
          animated={!done}
        />
        <button
          onClick={() => setValue(0)}
          className="text-xs text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-200 font-body underline"
        >
          Reset
        </button>
      </div>
    );
  },
};

// ── Indeterminate ─────────────────────────────────────────

export const Indeterminate: Story = {
  name: 'Indeterminate — unknown progress',
  render: () => (
    <div className="flex flex-col gap-5 max-w-md">
      <ProgressBar value={0} indeterminate label="Connecting to server…" />
      <ProgressBar value={0} indeterminate size="xs" />
    </div>
  ),
};

// Step stories have moved to StepsBar.stories.tsx
// Circular stories have moved to ProgressBar.circular.stories.tsx
