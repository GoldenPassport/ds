import { expect, userEvent, within, waitFor } from 'storybook/test';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Activity, Settings, FileText, GitBranch } from 'lucide-react';
import { Tabs } from '../components/Tabs';

const tabContent = (label: string) => (
  <div className="p-4 bg-ink-50 dark:bg-ink-700 rounded-xl text-sm text-ink-600 dark:text-ink-300 font-body">
    {label} content goes here.
  </div>
);

const sampleTabs = [
  { label: 'Overview', icon: <Activity className="w-4 h-4" />, content: tabContent('Overview') },
  {
    label: 'Run Logs',
    icon: <FileText className="w-4 h-4" />,
    badge: 142,
    content: tabContent('Run Logs'),
  },
  { label: 'Steps', icon: <GitBranch className="w-4 h-4" />, content: tabContent('Steps') },
  { label: 'Settings', icon: <Settings className="w-4 h-4" />, content: tabContent('Settings') },
];

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    variant: 'underline' as const,
    defaultIndex: 0,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['underline', 'pills', 'pill', 'bar'],
      description: 'Visual style of the tab strip',
    },
    defaultIndex: {
      control: 'number',
      description: 'Index of the initially active tab (uncontrolled)',
    },
    onChange: { control: false, description: 'Called with the new tab index on change' },
    tabs: { control: false, description: 'Array of { label, content, icon?, badge?, disabled? }' },
    className: { control: 'text', description: 'Extra CSS class on the root element' },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: { tabs: [] },
  render: (args) => (
    <div className="w-full max-w-2xl">
      <Tabs {...args} tabs={sampleTabs} />
    </div>
  ),
};

// ── Pills without icons ───────────────────────────────────

export const PillsTextOnly: Story = {
  name: 'Pills — text only',
  args: { variant: 'pills', tabs: [] },
  render: (args) => (
    <div className="w-full max-w-xl">
      <Tabs
        {...args}
        tabs={[
          { label: 'All', content: tabContent('All') },
          { label: 'Active', content: tabContent('Active') },
          { label: 'Draft', content: tabContent('Draft') },
          { label: 'Archived', content: tabContent('Archived') },
        ]}
      />
    </div>
  ),
};

// ── Pills with badges ─────────────────────────────────────

export const PillsWithBadges: Story = {
  name: 'Pills — with badges',
  args: { variant: 'pills', tabs: [] },
  render: (args) => (
    <div className="w-full max-w-xl">
      <Tabs
        {...args}
        tabs={[
          { label: 'Active', badge: 24, content: tabContent('Active') },
          { label: 'Running', badge: 3, content: tabContent('Running') },
          { label: 'Failed', badge: 1, content: tabContent('Failed') },
        ]}
      />
    </div>
  ),
};

// ── With badges (underline) ───────────────────────────────

export const WithBadges: Story = {
  name: 'Underline — with badges',
  args: { variant: 'underline', tabs: [] },
  render: (args) => (
    <div className="w-full max-w-xl">
      <Tabs
        {...args}
        tabs={[
          { label: 'Active', badge: 24, content: tabContent('Active') },
          { label: 'Running', badge: 3, content: tabContent('Running') },
          { label: 'Failed', badge: 1, content: tabContent('Failed') },
        ]}
      />
    </div>
  ),
};

// ── With disabled tab ─────────────────────────────────────

export const WithDisabledTab: Story = {
  name: 'With disabled tab',
  args: { tabs: [] },
  render: (args) => (
    <div className="w-full max-w-xl">
      <Tabs
        {...args}
        tabs={[
          {
            label: 'Workflows',
            content: (
              <div className="pt-4 text-sm text-ink-600 dark:text-ink-300 font-body">
                Workflows list
              </div>
            ),
          },
          { label: 'Analytics', content: <div className="pt-4" />, disabled: true },
          { label: 'Integrations', content: <div className="pt-4" />, disabled: true },
        ]}
      />
    </div>
  ),
};

// ── onChange callback ─────────────────────────────────────

export const OnChangeCallback: Story = {
  name: 'onChange callback',
  args: { tabs: [] },
  parameters: {
    docs: {
      disable: true,
    },
  },
  render: (args) => {
    const [active, setActive] = React.useState(0);
    return (
      <div className="w-full max-w-2xl space-y-4">
        <p className="text-xs text-ink-500 dark:text-ink-300 font-body">
          Active index:{' '}
          <strong data-testid="active-index" className="text-ink-700 dark:text-ink-300">
            {active}
          </strong>
        </p>
        <Tabs {...args} tabs={sampleTabs} onChange={setActive} />
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('Overview tab is initially selected (index 0)', async () => {
      expect(canvas.getByRole('tab', { name: /overview/i })).toHaveAttribute('aria-selected', 'true');
    });
    await step('click Run Logs → active index becomes 1', async () => {
      await user.click(canvas.getByRole('tab', { name: /run logs/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('active-index')).toHaveTextContent('1');
        expect(canvas.getByRole('tab', { name: /run logs/i })).toHaveAttribute('aria-selected', 'true');
      });
    });
    await step('click Steps → active index becomes 2', async () => {
      await user.click(canvas.getByRole('tab', { name: /^steps$/i }));
      await waitFor(() => expect(canvas.getByTestId('active-index')).toHaveTextContent('2'));
    });
  },
};

// ── All variants side-by-side ─────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  args: { tabs: [] },
  render: () => {
    const simple = [
      { label: 'Active', content: tabContent('Active') },
      { label: 'Archived', content: tabContent('Archived') },
      { label: 'Draft', content: tabContent('Draft') },
    ];
    return (
      <div className="space-y-10 max-w-lg">
        {(['underline', 'pills', 'pill', 'bar'] as const).map((v) => (
          <div key={v} className="space-y-1">
            <p className="text-xs font-mono text-ink-500 dark:text-ink-300">{v}</p>
            <Tabs tabs={simple} variant={v} />
          </div>
        ))}
      </div>
    );
  },
};
