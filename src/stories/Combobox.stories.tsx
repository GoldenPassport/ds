import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from '../components/Combobox';

const USERS = [
  { value: 'alex',  label: 'Alex Morgan'             },
  { value: 'sarah', label: 'Sarah Kim'               },
  { value: 'tom',   label: 'Tom Richards'            },
  { value: 'maya',  label: 'Maya Patel'              },
  { value: 'james', label: 'James Okafor'            },
  { value: 'priya', label: 'Priya Nair'              },
  { value: 'bot',   label: 'System (Bot)', disabled: true },
];

const INTEGRATIONS = [
  { value: 'slack',      label: 'Slack'      },
  { value: 'jira',       label: 'Jira'       },
  { value: 'salesforce', label: 'Salesforce' },
  { value: 'zendesk',    label: 'Zendesk'    },
  { value: 'notion',     label: 'Notion'     },
  { value: 'github',     label: 'GitHub'     },
  { value: 'hubspot',    label: 'HubSpot'    },
];

const meta = {
  title: 'Navigation/Command Palettes',
  component: Combobox,
  tags: ['autodocs'],
  argTypes: {
    label:       { control: 'text',    description: 'Label shown above the input' },
    hint:        { control: 'text',    description: 'Helper text shown below the input' },
    placeholder: { control: 'text',   description: 'Input placeholder text' },
    disabled:    { control: 'boolean', description: 'Disables the combobox' },
    options:     { control: false,     description: 'Array of { value, label, disabled? } options' },
    value:       { control: false,     description: 'Currently selected value (controlled)' },
    onChange:    { control: false,     description: 'Called when the selected value changes' },
    className:   { control: 'text',   description: 'Extra CSS class on the wrapper' },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label:       'Assign approver',
    placeholder: 'Search team members…',
    hint:        'This person will be notified when the step runs',
    disabled:    false,
    value:       null,
    onChange:    () => {},
    options:     [],
  },
  render: (args) => {
    const [val, setVal] = React.useState<string | null>(null);
    return (
      <div className="w-72">
        <Combobox {...args} value={val} onChange={setVal} options={USERS} />
      </div>
    );
  },
};

export const AssignUser: Story = {
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>(null);
    return (
      <div className="w-72">
        <Combobox
          label="Assign approver"
          placeholder="Search team members…"
          value={val}
          onChange={setVal}
          options={USERS}
          hint="This person will be notified when the step runs"
        />
      </div>
    );
  },
};

export const SelectIntegration: Story = {
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('slack');
    return (
      <div className="w-72">
        <Combobox
          label="Trigger integration"
          placeholder="Search integrations…"
          value={val}
          onChange={setVal}
          options={INTEGRATIONS}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { value: null, onChange: () => {}, options: [] },
  render: () => (
    <div className="w-72">
      <Combobox
        label="Department"
        value="finance"
        onChange={() => {}}
        options={[{ value: 'finance', label: 'Finance' }]}
        disabled
        hint="Contact your admin to change department"
      />
    </div>
  ),
};
