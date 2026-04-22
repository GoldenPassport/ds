import type { Meta, StoryObj } from '@storybook/react';
import { Activity, Settings, FileText, GitBranch } from 'lucide-react';
import { Tabs } from '../components/Tabs';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['underline', 'pill'] },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTabs = [
  {
    label: 'Overview',
    icon: <Activity className="w-4 h-4" />,
    content: (
      <div className="p-4 bg-ink-50 dark:bg-ink-700 rounded-xl text-sm text-ink-600 dark:text-ink-300 font-body">
        Workflow overview content — stats, recent runs, description.
      </div>
    ),
  },
  {
    label: 'Run Logs',
    badge: 142,
    icon: <FileText className="w-4 h-4" />,
    content: (
      <div className="p-4 bg-ink-50 dark:bg-ink-700 rounded-xl text-sm text-ink-600 dark:text-ink-300 font-body">
        Run history table goes here.
      </div>
    ),
  },
  {
    label: 'Steps',
    icon: <GitBranch className="w-4 h-4" />,
    content: (
      <div className="p-4 bg-ink-50 dark:bg-ink-700 rounded-xl text-sm text-ink-600 dark:text-ink-300 font-body">
        Workflow step configuration panel.
      </div>
    ),
  },
  {
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
    content: (
      <div className="p-4 bg-ink-50 dark:bg-ink-700 rounded-xl text-sm text-ink-600 dark:text-ink-300 font-body">
        Workflow-level settings and triggers.
      </div>
    ),
  },
];

export const Underline: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Tabs tabs={sampleTabs} variant="underline" />
    </div>
  ),
};

export const Pill: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Tabs tabs={sampleTabs} variant="pill" />
    </div>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Tabs
        variant="underline"
        tabs={[
          { label: 'Active', badge: 24, content: <div className="pt-4"><Badge label="Active" variant="active" /></div> },
          { label: 'Running', badge: 3, content: <div className="pt-4"><Badge label="Running" variant="running" /></div> },
          { label: 'Failed', badge: 1, content: <div className="pt-4"><Badge label="Failed" variant="failed" /></div> },
        ]}
      />
    </div>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Tabs
        variant="underline"
        tabs={[
          { label: 'Workflows', content: <div className="pt-4 text-sm text-ink-600 dark:text-ink-300 font-body">Workflows list</div> },
          { label: 'Analytics', content: <div className="pt-4" />, disabled: true },
          { label: 'Integrations', content: <div className="pt-4" />, disabled: true },
        ]}
      />
    </div>
  ),
};
