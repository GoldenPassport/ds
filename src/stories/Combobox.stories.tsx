import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Combobox } from '../components/Combobox';

const USERS = [
  { value: 'alex', label: 'Alex Morgan' },
  { value: 'sarah', label: 'Sarah Kim' },
  { value: 'tom', label: 'Tom Richards' },
  { value: 'maya', label: 'Maya Patel' },
  { value: 'james', label: 'James Okafor' },
  { value: 'priya', label: 'Priya Nair' },
  { value: 'bot', label: 'System (Bot)', disabled: true },
];

const INTEGRATIONS = [
  { value: 'slack', label: 'Slack' },
  { value: 'jira', label: 'Jira' },
  { value: 'salesforce', label: 'Salesforce' },
  { value: 'zendesk', label: 'Zendesk' },
  { value: 'notion', label: 'Notion' },
  { value: 'github', label: 'GitHub' },
  { value: 'hubspot', label: 'HubSpot' },
];

const meta = {
  title: 'Navigation/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Label shown above the input' },
    hint: { control: 'text', description: 'Helper text shown below the input' },
    placeholder: { control: 'text', description: 'Input placeholder text' },
    disabled: { control: 'boolean', description: 'Disables the combobox' },
    options: { control: false, description: 'Array of { value, label, disabled? } options' },
    value: { control: false, description: 'Currently selected value (controlled)' },
    onChange: { control: false, description: 'Called when the selected value changes' },
    className: { control: 'text', description: 'Extra CSS class on the wrapper' },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: 'Assign approver',
    placeholder: 'Search team members…',
    hint: 'This person will be notified when the step runs',
    disabled: false,
    value: null,
    onChange: () => {},
    options: [],
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

// ── Interactions ──────────────────────────────────────────

export const Interactions: Story = {
  name: 'Interactions',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>(null);
    return (
      <div className="w-72 flex flex-col gap-3">
        <Combobox
          label="Assign approver"
          placeholder="Search team members…"
          value={val}
          onChange={setVal}
          options={USERS}
        />
        <p className="text-xs font-body text-ink-500 dark:text-ink-300" data-testid="selected-user">
          Selected: {val ?? 'none'}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('click chevron button — options list opens', async () => {
      // ComboboxInput click alone does not open in HUI v2 — use the ComboboxButton
      await user.click(canvas.getByRole('button'));
      await waitFor(() => {
        expect(canvas.getByRole('listbox')).toBeInTheDocument();
      });
    });

    await step('all options are visible initially', async () => {
      const lb = canvas.getByRole('listbox');
      expect(within(lb).getByRole('option', { name: /alex morgan/i })).toBeInTheDocument();
      expect(within(lb).getByRole('option', { name: /sarah kim/i })).toBeInTheDocument();
    });

    await step('type to filter — shows only matching options', async () => {
      const input = canvas.getByRole('combobox');
      await user.type(input, 'sarah');
      await waitFor(() => {
        const lb = canvas.getByRole('listbox');
        expect(within(lb).getByRole('option', { name: /sarah kim/i })).toBeInTheDocument();
        expect(within(lb).queryByRole('option', { name: /alex morgan/i })).not.toBeInTheDocument();
      });
    });

    await step('click filtered option — value updates and panel closes', async () => {
      const lb = canvas.getByRole('listbox');
      await user.click(within(lb).getByRole('option', { name: /sarah kim/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('selected-user')).toHaveTextContent('sarah');
      });
      await waitFor(() => {
        expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    await step('click chevron button again — re-open shows all options', async () => {
      await user.click(canvas.getByRole('button'));
      await waitFor(() => {
        const lb = canvas.getByRole('listbox');
        expect(within(lb).getByRole('option', { name: /alex morgan/i })).toBeInTheDocument();
      });
    });

    await step('press Escape — panel closes', async () => {
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  },
};
