import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    label:   { control: 'text' },
    variant: {
      control: 'select',
      options: ['active', 'running', 'pending', 'draft', 'failed', 'warning', 'ai', 'neutral'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: 'Active', variant: 'active' },
};

export const Active:  Story = { args: { label: 'Active',       variant: 'active'  } };
export const Running: Story = { args: { label: 'Running',      variant: 'running' } };
export const Pending: Story = { args: { label: 'Pending',      variant: 'pending' } };
export const Draft:   Story = { args: { label: 'Draft',        variant: 'draft'   } };
export const Failed:  Story = { args: { label: 'Failed',       variant: 'failed'  } };
export const Warning: Story = { args: { label: 'Warning',      variant: 'warning' } };
export const AI:      Story = { args: { label: 'AI-Generated', variant: 'ai'      } };
export const Neutral: Story = { args: { label: 'Neutral',      variant: 'neutral' } };

export const AllVariants: Story = {
  args: { label: 'Active', variant: 'active' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['active', 'running', 'pending', 'draft', 'failed', 'warning', 'ai', 'neutral'] as const).map(v => (
        <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} />
      ))}
    </div>
  ),
};
