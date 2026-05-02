import { expect, userEvent, within, waitFor } from 'storybook/test';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StepsBar } from '../components/StepsBar';

const meta = {
  title: 'Navigation/StepsBar',
  component: StepsBar,
  tags: ['autodocs'],
  args: {
    steps: [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }],
    current: 1,
    variant: 'bar',
    fullWidth: 'mobile',
    responsive: true,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['bar', 'panels', 'circles', 'vertical'],
      description:
        'bar = top-bar indicator · panels = chevron breadcrumb · circles = horizontal dots · vertical = stacked list',
    },
    current: {
      control: { type: 'range', min: 0, max: 4, step: 1 },
      description: '0-indexed active step',
    },
    steps: { control: false, description: 'Array of { label, description? }' },
    onStepClick: {
      control: false,
      description: 'Optional click handler — enables hover states and makes steps navigable',
    },
    panelAppearance: {
      control: 'select',
      options: ['default', 'ghost'],
      description: 'panels variant only — default = solid white · ghost = transparent',
    },
    fullWidth: {
      control: 'select',
      options: ['none', 'always', 'mobile'],
      description:
        'none = shrink to content · always = fill container · mobile = fill on small screens only',
    },
    minStepWidth: {
      control: { type: 'number', min: 0, step: 8 },
      description: 'Minimum width (px) per step column',
    },
    responsive: {
      control: 'boolean',
      description:
        'Collapse horizontal variants to a left-border vertical list below the sm breakpoint (640 px) — on by default',
    },
    className: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    a11y: {
      config: {
        rules: [
          // When responsive=true the component renders two <nav aria-label="Progress">
          // in the DOM at the same time: one for mobile (sm:hidden) and one for
          // desktop (hidden sm:block). CSS display:none ensures only one is ever
          // visible/in the accessibility tree at any viewport width, but axe-core's
          // landmark-unique rule scans all DOM nodes regardless of display:none,
          // producing a false positive. Suppressed here; the real behaviour is
          // correct — only one nav landmark is present per viewport.
          { id: 'landmark-unique', enabled: false },
        ],
      },
    },
  },
} satisfies Meta<typeof StepsBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS_SIMPLE = [{ label: 'Job details' }, { label: 'Application' }, { label: 'Preview' }];

const STEPS_DESC = [
  { label: 'Details', description: 'Name & type' },
  { label: 'Configure', description: 'Settings' },
  { label: 'Review', description: 'Check everything' },
  { label: 'Deploy', description: 'Go live' },
];

const STEPS_LONG = [
  { label: 'Create account' },
  { label: 'Profile information' },
  { label: 'Theme' },
  { label: 'Preview' },
];

// ── Clickable (hover effects) ─────────────────────────────

export const ClickableBar: Story = {
  name: 'Bar — clickable',
  render: (args) => {
    const [current, setCurrent] = React.useState(1);
    return (
      <div className="space-y-3">
        <StepsBar {...args} steps={STEPS_SIMPLE} current={current} variant="bar" onStepClick={setCurrent} />
        <span data-testid="current" className="text-xs font-mono text-ink-500 dark:text-ink-300">
          step {current}
        </span>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('Application is the current step (index 1)', async () => {
      expect(canvas.getByTestId('current')).toHaveTextContent('step 1');
    });
    await step('click Preview → current advances to step 2', async () => {
      // responsive=true renders two nav elements (mobile + desktop); use index 0
      await user.click(canvas.getAllByRole('button', { name: /preview/i })[0]);
      await waitFor(() => expect(canvas.getByTestId('current')).toHaveTextContent('step 2'));
    });
    await step('click Job details → current goes back to step 0', async () => {
      await user.click(canvas.getAllByRole('button', { name: /job details/i })[0]);
      await waitFor(() => expect(canvas.getByTestId('current')).toHaveTextContent('step 0'));
    });
  },
};

export const ClickablePanels: Story = {
  name: 'Panels — clickable (hover effects)',
  render: (args) => (
    <StepsBar {...args} steps={STEPS_SIMPLE} current={1} variant="panels" onStepClick={() => {}} />
  ),
};

export const PanelsAppearances: Story = {
  name: 'Panels — appearances',
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-mono text-ink-500 dark:text-ink-300">default</p>
        <StepsBar
          steps={STEPS_SIMPLE}
          current={1}
          variant="panels"
          panelAppearance="default"
          onStepClick={() => {}}
          aria-label="Progress (default)"
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-mono text-ink-500 dark:text-ink-300">ghost</p>
        <StepsBar
          steps={STEPS_SIMPLE}
          current={1}
          variant="panels"
          panelAppearance="ghost"
          onStepClick={() => {}}
          aria-label="Progress (ghost)"
        />
      </div>
    </div>
  ),
};

export const ClickableCircles: Story = {
  name: 'Circles — clickable (hover effects)',
  render: (args) => (
    <StepsBar {...args} steps={STEPS_LONG} current={2} variant="circles" onStepClick={() => {}} />
  ),
};

export const ClickableVertical: Story = {
  name: 'Vertical — clickable (hover effects)',
  render: (args) => (
    <StepsBar {...args} steps={STEPS_DESC} current={1} variant="vertical" onStepClick={() => {}} />
  ),
};

// ── Completed ─────────────────────────────────────────────

export const AllComplete: Story = {
  name: 'All steps complete',
  render: () => (
    <div className="space-y-8 max-w-2xl">
      {(['bar', 'panels', 'circles'] as const).map((v) => (
        <div key={v} className="space-y-1">
          <p className="text-xs font-mono text-ink-500 dark:text-ink-300">{v}</p>
          <StepsBar
            steps={STEPS_SIMPLE}
            current={STEPS_SIMPLE.length}
            variant={v}
            aria-label={`Progress (${v})`}
          />
        </div>
      ))}
    </div>
  ),
};

// ── Responsive ───────────────────────────────────────────

export const Responsive: Story = {
  name: 'Responsive — collapses to list on mobile',
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="space-y-8">
      {(['bar', 'panels', 'circles'] as const).map((v) => (
        <div key={v} className="space-y-2">
          <p className="text-xs font-mono text-ink-500 dark:text-ink-300">
            {v} (resize window below 640 px)
          </p>
          <StepsBar
            {...args}
            steps={STEPS_DESC}
            current={1}
            variant={v}
            fullWidth="always"
            responsive
            aria-label={`Progress (${v})`}
          />
        </div>
      ))}
    </div>
  ),
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants — current=1',
  render: () => (
    <div className="space-y-10 max-w-2xl">
      {(['bar', 'panels', 'circles'] as const).map((v) => (
        <div key={v} className="space-y-2">
          <p className="text-xs font-mono text-ink-500 dark:text-ink-300">{v}</p>
          <StepsBar steps={STEPS_SIMPLE} current={1} variant={v} aria-label={`Progress (${v})`} />
        </div>
      ))}
      <div className="space-y-2">
        <p className="text-xs font-mono text-ink-500 dark:text-ink-300">vertical</p>
        <StepsBar
          steps={STEPS_SIMPLE}
          current={1}
          variant="vertical"
          aria-label="Progress (vertical)"
        />
      </div>
    </div>
  ),
};
