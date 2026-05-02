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
    shape: 'circular',
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

// ── Multi-bar dashboard ───────────────────────────────────

export const Dashboard: Story = {
  name: 'Composition — dashboard metrics',
  render: () => (
    <div className="max-w-sm rounded-xl border border-ink-200 dark:border-ink-700 p-5 space-y-4 bg-white dark:bg-ink-800">
      <h3 className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">
        Resource usage
      </h3>
      <ProgressBar value={82} label="CPU" showValue variant="warning" size="sm" />
      <ProgressBar value={47} label="Memory" showValue variant="default" size="sm" />
      <ProgressBar value={91} label="Storage" showValue variant="error" size="sm" />
      <ProgressBar value={12} label="Network" showValue variant="success" size="sm" />
    </div>
  ),
};

// ── Circular ──────────────────────────────────────────────

export const CircularPlayground: Story = {
  name: 'Circular — playground',
  args: { shape: 'circular', value: 68, showValue: true, label: 'Uploading…' },
};

export const CircularSizes: Story = {
  name: 'Circular — sizes',
  render: () => (
    <div className="flex items-end gap-8">
      <ProgressBar shape="circular" value={70} size="xs" showValue label="xs" />
      <ProgressBar shape="circular" value={70} size="sm" showValue label="sm" />
      <ProgressBar shape="circular" value={70} size="md" showValue label="md" />
      <ProgressBar shape="circular" value={70} size="lg" showValue label="lg" />
    </div>
  ),
};

export const CircularVariants: Story = {
  name: 'Circular — variants',
  render: () => (
    <div className="flex items-end gap-8">
      <ProgressBar shape="circular" value={60} variant="default" showValue label="Default" />
      <ProgressBar shape="circular" value={80} variant="success" showValue label="Success" />
      <ProgressBar shape="circular" value={45} variant="warning" showValue label="Warning" />
      <ProgressBar shape="circular" value={20} variant="error" showValue label="Error" />
    </div>
  ),
};

export const CircularDashboard: Story = {
  name: 'Circular — dashboard tiles',
  render: () => (
    <div className="inline-grid grid-cols-4 gap-6 p-6 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800">
      <ProgressBar shape="circular" size="lg" value={82} variant="warning" showValue label="CPU" />
      <ProgressBar
        shape="circular"
        size="lg"
        value={47}
        variant="default"
        showValue
        label="Memory"
      />
      <ProgressBar
        shape="circular"
        size="lg"
        value={91}
        variant="error"
        showValue
        label="Storage"
      />
      <ProgressBar
        shape="circular"
        size="lg"
        value={12}
        variant="success"
        showValue
        label="Network"
      />
    </div>
  ),
};

export const CircularAnimated: Story = {
  name: 'Circular — animated',
  render: () => {
    const [value, setValue] = React.useState(0);
    const done = value >= 100;

    React.useEffect(() => {
      if (done) return;
      const t = setInterval(() => setValue((v) => Math.min(v + 2, 100)), 100);
      return () => clearInterval(t);
    }, [done]);

    return (
      <div className="flex flex-col items-center gap-4">
        <ProgressBar
          shape="circular"
          size="lg"
          value={value}
          variant={done ? 'success' : 'default'}
          showValue
          label={done ? 'Complete' : 'Uploading…'}
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
