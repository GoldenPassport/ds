import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Select } from '../components/Select';

const MODEL_OPTIONS = [
  { value: 'claude-35-sonnet', label: 'Claude 3.5 Sonnet' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gemini-15-pro', label: 'Gemini 1.5 Pro' },
  { value: 'llama-3', label: 'Llama 3', disabled: true },
];

const DEPT_OPTIONS = [
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'HR' },
  { value: 'support', label: 'Customer Support' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'procurement', label: 'Procurement' },
];

const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['custom', 'native'],
      description: '`custom` = styled Headless UI dropdown; `native` = OS picker',
    },
    label: { control: 'text', description: 'Label shown above the select' },
    hint: { control: 'text', description: 'Helper text shown below' },
    error: { control: 'text', description: 'Error message (overrides hint)' },
    disabled: { control: 'boolean', description: 'Disables the select' },
    options: { control: false, description: 'Array of { value, label, disabled? } options' },
    value: { control: false },
    onChange: { control: false },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'custom',
    label: 'AI Model',
    hint: 'Used for workflow generation',
    disabled: false,
    value: '',
    onChange: () => {},
    options: [],
  },
  render: (args) => {
    const [val, setVal] = React.useState('claude-35-sonnet');
    return (
      <div className="w-72">
        <Select {...args} value={val} onChange={setVal} options={MODEL_OPTIONS} />
      </div>
    );
  },
};

// ── Side-by-side comparison ───────────────────────────────

export const Comparison: Story = {
  name: 'Custom vs Native',
  args: { value: '', onChange: () => {}, options: [] },
  render: () => {
    const [customVal, setCustomVal] = React.useState('finance');
    const [nativeVal, setNativeVal] = React.useState('finance');
    return (
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-64 flex flex-col gap-1">
          <p className="text-xs font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wide mb-1">
            Custom
          </p>
          <Select
            variant="custom"
            label="Department"
            value={customVal}
            onChange={setCustomVal}
            options={DEPT_OPTIONS}
          />
        </div>
        <div className="w-64 flex flex-col gap-1">
          <p className="text-xs font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wide mb-1">
            Native
          </p>
          <Select
            variant="native"
            label="Department"
            value={nativeVal}
            onChange={setNativeVal}
            options={DEPT_OPTIONS}
          />
        </div>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const user = userEvent.setup();

    await step('open the custom select', async () => {
      // Custom select trigger — first button labelled "Department"
      const trigger = canvas.getAllByRole('button', { name: /department/i })[0];
      await user.click(trigger);
      await waitFor(() => expect(body.getByRole('listbox')).toBeVisible());
    });

    await step('select "Analytics" → trigger updates', async () => {
      await user.click(body.getByRole('option', { name: 'Analytics' }));
      await waitFor(() => {
        expect(canvas.getAllByRole('button', { name: /department/i })[0]).toHaveTextContent(
          'Analytics',
        );
      });
    });
  },
};

// ── Error state ───────────────────────────────────────────

export const WithError: Story = {
  name: 'With error',
  args: { value: '', onChange: () => {}, options: [] },
  render: () => {
    const [cv, setCv] = React.useState('');
    const [nv, setNv] = React.useState('');
    return (
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-64">
          <Select
            variant="custom"
            label="Region (custom)"
            error="Please select a region"
            value={cv}
            onChange={setCv}
            options={[
              { value: 'us-east', label: 'US East' },
              { value: 'eu-west', label: 'EU West' },
            ]}
          />
        </div>
        <div className="w-64">
          <Select
            variant="native"
            label="Region (native)"
            error="Please select a region"
            value={nv}
            onChange={setNv}
            options={[
              { value: 'us-east', label: 'US East' },
              { value: 'eu-west', label: 'EU West' },
            ]}
          />
        </div>
      </div>
    );
  },
};

// ── Disabled ──────────────────────────────────────────────

export const Disabled: Story = {
  args: { value: '', onChange: () => {}, options: [] },
  render: () => (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      <div className="w-64">
        <Select
          variant="custom"
          label="Region (custom)"
          value="us-east"
          onChange={() => {}}
          disabled
          hint="Region is locked after deployment"
          options={[{ value: 'us-east', label: 'US East (Virginia)' }]}
        />
      </div>
      <div className="w-64">
        <Select
          variant="native"
          label="Region (native)"
          value="us-east"
          onChange={() => {}}
          disabled
          hint="Region is locked after deployment"
          options={[{ value: 'us-east', label: 'US East (Virginia)' }]}
        />
      </div>
    </div>
  ),
};

