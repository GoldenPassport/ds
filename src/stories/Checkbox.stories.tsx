import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from 'storybook/preview-api';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Checkbox } from '../components/Checkbox';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean', description: 'Checked state (controlled)' },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate state — shown as a dash, overrides checked visually',
    },
    disabled: { control: 'boolean', description: 'Disables interaction' },
    label: { control: 'text', description: 'Label text next to the checkbox' },
    description: { control: 'text', description: 'Secondary helper text below the label' },
    onChange: { control: false, description: 'Called with the new boolean value on change' },
    className: { control: 'text' },
  },
  // Default args satisfy required props; individual stories override as needed.
  args: {
    checked: false,
    onChange: () => {},
  },
  // Meta-level render: useArgs keeps checked in sync with the controls panel
  // so every story (including the auto-generated docs preview) is interactive.
  render: (args) => {
    const [{ checked }, updateArgs] = useArgs();
    return (
      <Checkbox
        {...args}
        checked={Boolean(checked)}
        onChange={(val) => updateArgs({ checked: val })}
      />
    );
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    checked: false,
    label: 'Enable feature',
    description: 'This will apply to all workflows.',
    disabled: false,
  },
};

export const States: Story = {
  name: 'Checked / Unchecked',
  args: { checked: false, onChange: () => {} },
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox checked={false} onChange={() => {}} label="Notify on failure" />
      <Checkbox checked={true} onChange={() => {}} label="Notify on failure" />
    </div>
  ),
};

export const WithDescription: Story = {
  args: {
    checked: true,
    label: 'AI Suggestions',
    description: 'Show prompt suggestions while building workflows.',
  },
};

export const Indeterminate: Story = {
  args: {
    checked: false,
    indeterminate: true,
    label: 'Select all workflows',
    description: '3 of 8 selected',
  },
};

export const Disabled: Story = {
  args: {
    checked: true,
    label: 'Enforce 2FA',
    description: 'Managed by your org admin.',
    disabled: true,
  },
};

export const CheckboxGroup: Story = {
  args: { checked: false, onChange: () => {} },
  render: () => {
    const [vals, setVals] = React.useState({
      failures: true,
      completions: false,
      digest: true,
    });
    const toggle = (key: keyof typeof vals) => setVals((v) => ({ ...v, [key]: !v[key] }));

    return (
      <div className="flex flex-col gap-4">
        <span className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50">
          Notify me about
        </span>
        <Checkbox
          checked={vals.failures}
          onChange={() => toggle('failures')}
          label="Workflow failures"
          description="Get notified when a run fails"
        />
        <Checkbox
          checked={vals.completions}
          onChange={() => toggle('completions')}
          label="Run completions"
          description="Notify on every successful run"
        />
        <Checkbox
          checked={vals.digest}
          onChange={() => toggle('digest')}
          label="Weekly digest"
          description="Summary of activity every Monday"
        />
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('click unchecked "Run completions" → becomes checked', async () => {
      await user.click(canvas.getByRole('checkbox', { name: /run completions/i }));
      await waitFor(() => {
        expect(canvas.getByRole('checkbox', { name: /run completions/i })).toBeChecked();
      });
    });

    await step('click checked "Workflow failures" → becomes unchecked', async () => {
      await user.click(canvas.getByRole('checkbox', { name: /workflow failures/i }));
      await waitFor(() => {
        expect(canvas.getByRole('checkbox', { name: /workflow failures/i })).not.toBeChecked();
      });
    });
  },
};

export const SelectAllPattern: Story = {
  args: { checked: false, onChange: () => {} },
  render: () => {
    const items = [
      'Invoice Approval',
      'Employee Onboarding',
      'PTO Request Handler',
      'Vendor Onboarding',
    ];
    const [selected, setSelected] = React.useState<string[]>([items[0]]);

    const allChecked = selected.length === items.length;
    const someChecked = selected.length > 0 && !allChecked;

    const toggleAll = () => setSelected(allChecked ? [] : [...items]);
    const toggle = (item: string) =>
      setSelected((s) => (s.includes(item) ? s.filter((x) => x !== item) : [...s, item]));

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
          {items.map((item) => (
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('initially 1 of 4 selected — parent is indeterminate', async () => {
      const selectAll = canvas.getByRole('checkbox', { name: /select all/i });
      expect(selectAll).toHaveAttribute('aria-checked', 'mixed');
    });

    await step('click "Select all" → all 4 items checked', async () => {
      await user.click(canvas.getByRole('checkbox', { name: /select all/i }));
      await waitFor(() => {
        canvas.getAllByRole('checkbox').forEach((cb) => expect(cb).toBeChecked());
      });
    });

    await step('click "Select all" again → all unchecked', async () => {
      await user.click(canvas.getByRole('checkbox', { name: /select all/i }));
      await waitFor(() => {
        canvas.getAllByRole('checkbox').forEach((cb) => expect(cb).not.toBeChecked());
      });
    });

    await step('click one item → parent becomes indeterminate', async () => {
      await user.click(canvas.getByRole('checkbox', { name: /invoice approval/i }));
      await waitFor(() => {
        expect(canvas.getByRole('checkbox', { name: /select all/i })).toHaveAttribute(
          'aria-checked',
          'mixed',
        );
      });
    });
  },
};

