import type { Meta, StoryObj } from '@storybook/react';
import { Play, Plus, Trash2, Bell, Settings, Search, MoreHorizontal } from 'lucide-react';
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
};

export const Primary: Story = {
  args: { children: 'Run Workflow', variant: 'primary', size: 'md' },
};
export const Secondary: Story = {
  args: { children: 'Duplicate', variant: 'secondary', size: 'md' },
};
export const Ghost: Story = { args: { children: 'Cancel', variant: 'ghost', size: 'md' } };
export const Danger: Story = { args: { children: 'Delete', variant: 'danger', size: 'md' } };
export const Loading: Story = {
  args: { children: 'Deploying…', variant: 'primary', loading: true },
};
export const Disabled: Story = {
  args: { children: 'Unavailable', variant: 'primary', disabled: true },
};

export const WithIcon: Story = {
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

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary">Run Workflow</Button>
      <Button variant="secondary">Duplicate</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="danger">
        <Trash2 className="w-4 h-4" /> Delete
      </Button>
      <Button variant="primary" loading>
        Deploying…
      </Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">
        <Plus className="w-3.5 h-3.5" /> New Step
      </Button>
      <Button size="md">
        <Plus className="w-4 h-4" /> New Workflow
      </Button>
      <Button size="lg">
        <Play className="w-5 h-5" /> Get Started
      </Button>
    </div>
  ),
};

// ── Radius ────────────────────────────────────────────────

export const Radius: Story = {
  name: 'Border radius',
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">Rounded (default)</p>
        <div className="flex gap-3 items-center">
          <Button variant="primary" radius="rounded">
            Deploy
          </Button>
          <Button variant="secondary" radius="rounded">
            <Plus className="w-4 h-4" /> New
          </Button>
          <Button variant="ghost" iconOnly radius="rounded" aria-label="Settings">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">Pill</p>
        <div className="flex gap-3 items-center">
          <Button variant="primary" radius="pill">
            Deploy
          </Button>
          <Button variant="secondary" radius="pill">
            <Plus className="w-4 h-4" /> New
          </Button>
          <Button variant="ghost" iconOnly radius="pill" aria-label="Settings">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">Square</p>
        <div className="flex gap-3 items-center">
          <Button variant="primary" radius="square">
            Deploy
          </Button>
          <Button variant="secondary" radius="square">
            <Plus className="w-4 h-4" /> New
          </Button>
          <Button variant="ghost" iconOnly radius="square" aria-label="Settings">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  ),
};

// ── Icon-only ─────────────────────────────────────────────

export const IconOnly: Story = {
  name: 'Icon only',
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" iconOnly aria-label="Add">
        <Plus className="w-4 h-4" />
      </Button>
      <Button variant="secondary" iconOnly aria-label="Settings">
        <Settings className="w-4 h-4" />
      </Button>
      <Button variant="ghost" iconOnly aria-label="Search">
        <Search className="w-4 h-4" />
      </Button>
      <Button variant="danger" iconOnly aria-label="Delete">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  ),
};

export const IconOnlySizes: Story = {
  name: 'Icon only — sizes',
  render: () => (
    <div className="flex items-center gap-3">
      <Button variant="secondary" iconOnly size="sm" aria-label="More">
        <MoreHorizontal className="w-3.5 h-3.5" />
      </Button>
      <Button variant="secondary" iconOnly size="md" aria-label="More">
        <MoreHorizontal className="w-4 h-4" />
      </Button>
      <Button variant="secondary" iconOnly size="lg" aria-label="More">
        <MoreHorizontal className="w-5 h-5" />
      </Button>
    </div>
  ),
};

// ── All layouts ───────────────────────────────────────────

export const AllLayouts: Story = {
  name: 'All layouts',
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">Text only</p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary">Deploy</Button>
          <Button variant="secondary">Duplicate</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Delete</Button>
        </div>
      </div>
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">Icon + text</p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary">
            <Play className="w-4 h-4" /> Deploy
          </Button>
          <Button variant="secondary">
            <Plus className="w-4 h-4" /> Duplicate
          </Button>
          <Button variant="ghost">
            <Search className="w-4 h-4" /> Search
          </Button>
          <Button variant="danger">
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      </div>
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">Icon only</p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary" iconOnly aria-label="Deploy">
            <Play className="w-4 h-4" />
          </Button>
          <Button variant="secondary" iconOnly aria-label="Add">
            <Plus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" iconOnly aria-label="Notifications">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="danger" iconOnly aria-label="Delete">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  ),
};
