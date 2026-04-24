import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '../components/Toggle';

const meta = {
  title: 'Forms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    checked:     { control: 'boolean' },
    disabled:    { control: 'boolean' },
    label:       { control: 'text' },
    description: { control: 'text' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const On: Story = {
  args: { checked: true, onChange: () => {}, label: 'AI Suggestions', description: 'Show prompt suggestions in the builder' },
};

export const Off: Story = {
  args: { checked: false, onChange: () => {}, label: 'Run completions', description: 'Notify on every successful run' },
};

export const Disabled: Story = {
  args: { checked: true, onChange: () => {}, label: 'Auto-deploy', description: 'Managed by your org admin', disabled: true },
};

export const Standalone: Story = {
  args: { checked: true, onChange: () => {} },
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
        {([
          ['suggestions', 'AI Suggestions',   'Show prompt suggestions in the builder'],
          ['completions', 'Run completions',   'Notify on every successful run'],
          ['digest',      'Weekly digest',     'Summary of activity every Monday'],
          ['validate',    'Auto-validate steps','Validate each step against connected systems'],
        ] as const).map(([key, label, desc]) => (
          <div key={key} className="px-5 py-4">
            <Toggle
              checked={vals[key]}
              onChange={v => setVals(prev => ({ ...prev, [key]: v }))}
              label={label}
              description={desc}
            />
          </div>
        ))}
      </div>
    );
  },
};
