import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from 'storybook/preview-api';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Toggle } from '../components/Toggle';

const meta = {
  title: 'Forms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    checked: true,
    onChange: () => {},
    disabled: false,
    label: 'AI Suggestions',
    description: 'Show prompt suggestions in the builder',
  },
  render: (args) => {
    const [{ checked }, updateArgs] = useArgs();
    return (
      <Toggle
        {...args}
        checked={Boolean(checked)}
        onChange={(val) => updateArgs({ checked: val })}
      />
    );
  },
};

export const States: Story = {
  name: 'On / Off',
  args: { checked: false, onChange: () => {} },
  render: () => (
    <div className="flex flex-col gap-4">
      <Toggle
        checked={true}
        onChange={() => {}}
        label="AI Suggestions"
        description="Show prompt suggestions in the builder"
      />
      <Toggle
        checked={false}
        onChange={() => {}}
        label="Run completions"
        description="Notify on every successful run"
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    checked: true,
    onChange: () => {},
    label: 'Auto-deploy',
    description: 'Managed by your org admin',
    disabled: true,
  },
};

export const SettingsList: Story = {
  args: { checked: false, onChange: () => {} },
  render: () => {
    const [vals, setVals] = React.useState({
      suggestions: true,
      completions: false,
      digest: true,
      validate: true,
    });
    return (
      <div className="w-96 bg-white dark:bg-ink-800 rounded-xl border border-ink-200 dark:border-ink-700 divide-y divide-ink-100 dark:divide-ink-700 overflow-hidden">
        {(
          [
            ['suggestions', 'AI Suggestions', 'Show prompt suggestions in the builder'],
            ['completions', 'Run completions', 'Notify on every successful run'],
            ['digest', 'Weekly digest', 'Summary of activity every Monday'],
            ['validate', 'Auto-validate steps', 'Validate each step against connected systems'],
          ] as const
        ).map(([key, label, desc]) => (
          <div key={key} className="px-5 py-4">
            <Toggle
              checked={vals[key]}
              onChange={(v) => setVals((prev) => ({ ...prev, [key]: v }))}
              label={label}
              description={desc}
            />
          </div>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('"Run completions" starts off — click turns it on', async () => {
      const sw = canvas.getByRole('switch', { name: /run completions/i });
      expect(sw).toHaveAttribute('aria-checked', 'false');
      await user.click(sw);
      await waitFor(() => {
        expect(canvas.getByRole('switch', { name: /run completions/i })).toHaveAttribute(
          'aria-checked',
          'true',
        );
      });
    });

    await step('"AI Suggestions" starts on — click turns it off', async () => {
      const sw = canvas.getByRole('switch', { name: /ai suggestions/i });
      expect(sw).toHaveAttribute('aria-checked', 'true');
      await user.click(sw);
      await waitFor(() => {
        expect(canvas.getByRole('switch', { name: /ai suggestions/i })).toHaveAttribute(
          'aria-checked',
          'false',
        );
      });
    });
  },
};
