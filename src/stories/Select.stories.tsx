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
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    label:    { control: 'text',    description: 'Label shown above the select' },
    hint:     { control: 'text',    description: 'Helper text shown below the select' },
    disabled: { control: 'boolean', description: 'Disables the select' },
    options:  { control: false,     description: 'Array of { value, label, disabled? } options' },
    value:    { control: false,     description: 'Currently selected value (controlled)' },
    onChange: { control: false,     description: 'Called when the selected value changes' },
    className: { control: 'text',  description: 'Extra CSS class on the wrapper' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label:    'AI Model',
    hint:     'Used for workflow generation',
    disabled: false,
  },
  render: (args) => {
    const [val, setVal] = React.useState('claude-35-sonnet');
    React.useEffect(() => { setVal('claude-35-sonnet'); }, []);
    return (
      <div className="w-72">
        <Select {...args} value={val} onChange={setVal} options={MODEL_OPTIONS} />
      </div>
    );
  },
};

export const Default: Story = {
  render: () => {
    const [val, setVal] = React.useState('claude-35-sonnet');
    return (
      <div className="w-72">
        <Select label="AI Model" hint="Used for workflow generation" value={val} onChange={setVal} options={MODEL_OPTIONS} />
      </div>
    );
  },
};

export const WithDisabledOption: Story = {
  render: () => {
    const [val, setVal] = React.useState('claude-35-sonnet');
    return (
      <div className="w-72">
        <Select label="AI Model" value={val} onChange={setVal} options={MODEL_OPTIONS} />
      </div>
    );
  },
};

export const DepartmentPicker: Story = {
  render: () => {
    const [val, setVal] = React.useState('finance');
    return (
      <div className="w-64">
        <Select label="Department" value={val} onChange={setVal} options={DEPT_OPTIONS} />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-72">
      <Select
        label="Region"
        value="us-east"
        onChange={() => {}}
        disabled
        options={[{ value: 'us-east', label: 'US East (Virginia)' }]}
        hint="Region is locked after deployment"
      />
    </div>
  ),
};
