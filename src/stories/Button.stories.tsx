import { expect, userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { Play, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/Button';

const meta = {
  title: 'Elements/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    radius: { control: 'select', options: ['square', 'rounded', 'pill'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: 'Run Workflow',
    variant: 'primary',
    size: 'md',
    radius: 'rounded',
    loading: false,
    disabled: false,
    iconOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('button is enabled', async () => {
      expect(canvas.getByRole('button', { name: /run workflow/i })).toBeEnabled();
    });
    await step('click button → button receives focus', async () => {
      const btn = canvas.getByRole('button', { name: /run workflow/i });
      await user.click(btn);
      expect(btn).toHaveFocus();
    });
  },
};

export const WithIcon: Story = {
  name: 'With icon',
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary">
        <Play className="w-4 h-4" /> Deploy
      </Button>
      <Button variant="secondary">
        <Plus className="w-4 h-4" /> New Workflow
      </Button>
      <Button variant="danger">
        <Trash2 className="w-4 h-4" /> Delete
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { children: 'Deploying…', variant: 'primary', loading: true },
};

export const Disabled: Story = {
  args: { children: 'Unavailable', variant: 'primary', disabled: true },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('button has disabled attribute', async () => {
      expect(canvas.getByRole('button', { name: /unavailable/i })).toBeDisabled();
    });
  },
};
