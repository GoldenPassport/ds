import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Activity, Settings, FileText, GitBranch } from 'lucide-react';
import { Tabs } from '../components/Tabs';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    variant:      { control: 'select', options: ['underline', 'pill'], description: 'Visual style of the tab strip' },
    defaultIndex: { control: 'number', description: 'Index of the initially active tab (uncontrolled)' },
    onChange:     { control: false, description: 'Called with the new tab index on change' },
    tabs:         { control: false, description: 'Array of { label, content, icon?, badge?, disabled? }' },
    className:    { control: 'text', description: 'Extra CSS class on the root element' },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const tabContent = (label: string) => (
  <div className="p-4 bg-ink-50 dark:bg-ink-700 rounded-xl text-sm text-ink-600 dark:text-ink-300 font-body">
    {label} content goes here.
  </div>
);

const sampleTabs = [
  { label: 'Overview',  icon: <Activity className="w-4 h-4" />,  content: tabContent('Overview')  },
  { label: 'Run Logs',  icon: <FileText className="w-4 h-4" />,  badge: 142, content: tabContent('Run Logs')  },
  { label: 'Steps',     icon: <GitBranch className="w-4 h-4" />, content: tabContent('Steps')     },
  { label: 'Settings',  icon: <Settings className="w-4 h-4" />,  content: tabContent('Settings')  },
];

export const Playground: Story = {
  args: { variant: 'underline', defaultIndex: 0 },
  render: (args) => (
    <div className="w-full max-w-2xl">
      <Tabs {...args} tabs={sampleTabs} />
    </div>
  ),
};

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
          { label: 'Active',  badge: 24, content: <div className="pt-4"><Badge label="Active"  variant="active"  /></div> },
          { label: 'Running', badge: 3,  content: <div className="pt-4"><Badge label="Running" variant="running" /></div> },
          { label: 'Failed',  badge: 1,  content: <div className="pt-4"><Badge label="Failed"  variant="failed"  /></div> },
        ]}
      />
    </div>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Tabs
        variant="underline"
        tabs={[
          { label: 'Workflows',    content: <div className="pt-4 text-sm text-ink-600 dark:text-ink-300 font-body">Workflows list</div> },
          { label: 'Analytics',   content: <div className="pt-4" />, disabled: true },
          { label: 'Integrations',content: <div className="pt-4" />, disabled: true },
        ]}
      />
    </div>
  ),
};

export const DefaultActiveTab: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Tabs tabs={sampleTabs} variant="underline" defaultIndex={2} />
    </div>
  ),
};

export const OnChangeCallback: Story = {
  render: () => {
    const [active, setActive] = React.useState(0);
    return (
      <div className="w-full max-w-2xl space-y-4">
        <p className="text-xs text-ink-400 dark:text-ink-500 font-body">
          Active tab index: <strong className="text-ink-700 dark:text-ink-300">{active}</strong>
        </p>
        <Tabs tabs={sampleTabs} variant="underline" onChange={setActive} />
      </div>
    );
  },
};
