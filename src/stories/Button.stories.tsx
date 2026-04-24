import type { Meta, StoryObj } from '@storybook/react';
import { Play, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/Button';

const meta = {
  title: 'Elements/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    variant:  { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    loading:  { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: 'Run Workflow', variant: 'primary', size: 'md', loading: false, disabled: false },
};

export const Primary:   Story = { args: { children: 'Run Workflow', variant: 'primary',   size: 'md' } };
export const Secondary: Story = { args: { children: 'Duplicate',    variant: 'secondary', size: 'md' } };
export const Ghost:     Story = { args: { children: 'Cancel',       variant: 'ghost',     size: 'md' } };
export const Danger:    Story = { args: { children: 'Delete',       variant: 'danger',    size: 'md' } };
export const Loading:   Story = { args: { children: 'Deploying…',   variant: 'primary',   loading: true } };
export const Disabled:  Story = { args: { children: 'Unavailable',  variant: 'primary',   disabled: true } };

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary"><Play className="w-4 h-4" /> Deploy</Button>
      <Button variant="secondary"><Plus className="w-4 h-4" /> New Workflow</Button>
      <Button variant="danger"><Trash2 className="w-4 h-4" /> Delete</Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary">Run Workflow</Button>
      <Button variant="secondary">Duplicate</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="danger"><Trash2 className="w-4 h-4" /> Delete</Button>
      <Button variant="primary" loading>Deploying…</Button>
      <Button variant="primary" disabled>Disabled</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm"><Plus className="w-3.5 h-3.5" /> New Step</Button>
      <Button size="md"><Plus className="w-4 h-4" /> New Workflow</Button>
      <Button size="lg"><Play className="w-5 h-5" /> Get Started</Button>
    </div>
  ),
};
