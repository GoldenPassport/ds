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

// ── Sentiment variants ────────────────────────────────────

export const Happy: Story = { args: { label: 'Happy', variant: 'happy', icon: '😊' } };
export const Satisfied: Story = { args: { label: 'Satisfied', variant: 'satisfied', icon: '👍' } };
export const Confused: Story = { args: { label: 'Confused', variant: 'confused', icon: '🤔' } };
export const Frustrated: Story = {
  args: { label: 'Frustrated', variant: 'frustrated', icon: '😤' },
};
export const Angry: Story = { args: { label: 'Angry', variant: 'angry', icon: '😠' } };
export const Sad: Story = { args: { label: 'Sad', variant: 'sad', icon: '😔' } };
export const Urgent: Story = { args: { label: 'Urgent', variant: 'urgent', icon: '🚨' } };
