import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '../components/Select';

const MODEL_OPTIONS = [
  { value: 'claude-35-sonnet', label: 'Claude 3.5 Sonnet' },
  { value: 'gpt-4o',           label: 'GPT-4o'            },
  { value: 'gemini-15-pro',    label: 'Gemini 1.5 Pro'    },
  { value: 'llama-3',          label: 'Llama 3', disabled: true },
];

const DEPT_OPTIONS = [
  { value: 'finance',     label: 'Finance'          },
  { value: 'hr',          label: 'HR'               },
  { value: 'support',     label: 'Customer Support' },
  { value: 'analytics',   label: 'Analytics'        },
  { value: 'procurement', label: 'Procurement'      },
];

const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    variant:  { control: 'radio',   options: ['custom', 'native'], description: '`custom` = styled Headless UI dropdown; `native` = OS picker' },
    label:    { control: 'text',    description: 'Label shown above the select' },
    hint:     { control: 'text',    description: 'Helper text shown below' },
    error:    { control: 'text',    description: 'Error message (overrides hint)' },
    disabled: { control: 'boolean', description: 'Disables the select' },
    options:  { control: false,     description: 'Array of { value, label, disabled? } options' },
    value:    { control: false },
    onChange: { control: false },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant:  'custom',
    label:    'AI Model',
    hint:     'Used for workflow generation',
    disabled: false,
    value:    '',
    onChange: () => {},
    options:  [],
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

// ── Custom variant ────────────────────────────────────────

export const Custom: Story = {
  name: 'Custom — styled dropdown',
  args: { value: '', onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState('claude-35-sonnet');
    return (
      <div className="w-72">
        <Select
          variant="custom"
          label="AI Model"
          hint="Uses Headless UI — consistent across all platforms"
          value={val}
          onChange={setVal}
          options={MODEL_OPTIONS}
        />
      </div>
    );
  },
};

// ── Native variant ────────────────────────────────────────

export const Native: Story = {
  name: 'Native — OS picker',
  args: { value: '', onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState('claude-35-sonnet');
    return (
      <div className="w-72">
        <Select
          variant="native"
          label="AI Model"
          hint="Uses the OS/browser picker — recommended on mobile"
          value={val}
          onChange={setVal}
          options={MODEL_OPTIONS}
        />
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
          <p className="text-xs font-semibold font-body text-ink-400 uppercase tracking-wide mb-1">Custom</p>
          <Select
            variant="custom"
            label="Department"
            value={customVal}
            onChange={setCustomVal}
            options={DEPT_OPTIONS}
          />
        </div>
        <div className="w-64 flex flex-col gap-1">
          <p className="text-xs font-semibold font-body text-ink-400 uppercase tracking-wide mb-1">Native</p>
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
};

// ── With placeholder (native only) ───────────────────────

export const NativeWithPlaceholder: Story = {
  name: 'Native — with placeholder',
  args: { value: '', onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState('');
    return (
      <div className="w-72">
        <Select
          variant="native"
          label="Department"
          placeholder="Choose a department…"
          value={val}
          onChange={setVal}
          options={DEPT_OPTIONS}
        />
      </div>
    );
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
