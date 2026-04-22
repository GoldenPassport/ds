import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../components/Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    size: { control: 'number', min: 24, max: 96, step: 4 },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'Alex Morgan', size: 40 },
};

export const Small: Story = {
  args: { name: 'Sarah Kim', size: 28 },
};

export const Large: Story = {
  args: { name: 'Tom Richards', size: 64 },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {[24, 32, 40, 56, 80].map(s => (
        <Avatar key={s} name="Alex Morgan" size={s} />
      ))}
    </div>
  ),
};

export const MultipleUsers: Story = {
  render: () => (
    <div className="flex -space-x-2">
      {['Alex Morgan', 'Sarah Kim', 'Tom Richards', 'Maya Patel'].map(n => (
        <div key={n} className="ring-2 ring-white dark:ring-ink-900 rounded-full">
          <Avatar name={n} size={36} />
        </div>
      ))}
    </div>
  ),
};
