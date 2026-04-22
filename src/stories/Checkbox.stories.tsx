import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../components/Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked:       { control: 'boolean', description: 'Checked state (controlled)' },
    indeterminate: { control: 'boolean', description: 'Indeterminate state — shown as a dash, overrides checked visually' },
    disabled:      { control: 'boolean', description: 'Disables interaction' },
    label:         { control: 'text',    description: 'Label text next to the checkbox' },
    description:   { control: 'text',    description: 'Secondary helper text below the label' },
    onChange:      { control: false,     description: 'Called with the new boolean value on change' },
    className:     { control: 'text' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { checked: false, label: 'Enable feature', description: 'This will apply to all workflows.', disabled: false },
  render: (args) => {
    const [checked, setChecked] = React.useState(args.checked);
    React.useEffect(() => { setChecked(args.checked); }, [args.checked]);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
  },
};

export const Unchecked: Story = {
  args: { checked: false, label: 'Notify on failure', onChange: () => {} },
};

export const Checked: Story = {
  args: { checked: true, label: 'Notify on failure', onChange: () => {} },
};

export const WithDescription: Story = {
  args: {
    checked:     true,
    label:       'AI Suggestions',
    description: 'Show prompt suggestions while building workflows.',
    onChange:    () => {},
  },
};

export const Indeterminate: Story = {
  args: {
    checked:       false,
    indeterminate: true,
    label:         'Select all workflows',
    description:   '3 of 8 selected',
    onChange:      () => {},
  },
};

export const Disabled: Story = {
  args: { checked: true, label: 'Enforce 2FA', description: 'Managed by your org admin.', disabled: true, onChange: () => {} },
};

export const Standalone: Story = {
  args: { checked: true, onChange: () => {} },
};

export const CheckboxGroup: Story = {
  render: () => {
    const [vals, setVals] = React.useState({
      failures: true,
      completions: false,
      digest: true,
    });
    const toggle = (key: keyof typeof vals) =>
      setVals(v => ({ ...v, [key]: !v[key] }));

    return (
      <div className="flex flex-col gap-4">
        <span className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50">
          Notify me about
        </span>
        <Checkbox checked={vals.failures}    onChange={() => toggle('failures')}    label="Workflow failures"   description="Get notified when a run fails" />
        <Checkbox checked={vals.completions} onChange={() => toggle('completions')} label="Run completions"     description="Notify on every successful run" />
        <Checkbox checked={vals.digest}      onChange={() => toggle('digest')}      label="Weekly digest"       description="Summary of activity every Monday" />
      </div>
    );
  },
};

export const SelectAllPattern: Story = {
  render: () => {
    const items = ['Invoice Approval', 'Employee Onboarding', 'PTO Request Handler', 'Vendor Onboarding'];
    const [selected, setSelected] = React.useState<string[]>([items[0]]);

    const allChecked   = selected.length === items.length;
    const someChecked  = selected.length > 0 && !allChecked;

    const toggleAll = () => setSelected(allChecked ? [] : [...items]);
    const toggle    = (item: string) =>
      setSelected(s => s.includes(item) ? s.filter(x => x !== item) : [...s, item]);

    return (
      <div className="flex flex-col gap-3">
        <Checkbox
          checked={allChecked}
          indeterminate={someChecked}
          onChange={toggleAll}
          label="Select all"
          description={`${selected.length} of ${items.length} selected`}
        />
        <div className="pl-6 flex flex-col gap-3 border-l-2 border-ink-100 dark:border-ink-700">
          {items.map(item => (
            <Checkbox
              key={item}
              checked={selected.includes(item)}
              onChange={() => toggle(item)}
              label={item}
            />
          ))}
        </div>
      </div>
    );
  },
};
