import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Elements/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: 'select',
      options: [
        'active',
        'running',
        'pending',
        'draft',
        'failed',
        'warning',
        'ai',
        'neutral',
        'happy',
        'satisfied',
        'confused',
        'frustrated',
        'angry',
        'sad',
        'urgent',
      ],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['pill', 'rounded'] },
    outlined: { control: 'boolean' },
    dot: { control: 'boolean' },
    icon: { control: false },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    label: 'Active',
    variant: 'active',
    size: 'md',
    shape: 'pill',
    outlined: false,
    dot: true,
  },
};

// ── Status variants ───────────────────────────────────────

export const Active: Story = { args: { label: 'Active', variant: 'active' } };
export const Running: Story = { args: { label: 'Running', variant: 'running' } };
export const Pending: Story = { args: { label: 'Pending', variant: 'pending' } };
export const Draft: Story = { args: { label: 'Draft', variant: 'draft' } };
export const Failed: Story = { args: { label: 'Failed', variant: 'failed' } };
export const Warning: Story = { args: { label: 'Warning', variant: 'warning' } };
export const AI: Story = { args: { label: 'AI-Generated', variant: 'ai' } };
export const Neutral: Story = { args: { label: 'Neutral', variant: 'neutral' } };
