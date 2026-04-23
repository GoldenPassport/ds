import type { Meta, StoryObj } from '@storybook/react';
import { StepsBar } from '../components/StepsBar';

const meta = {
  title: 'Navigation/Steps Bars',
  component: StepsBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    steps:      [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }],
    current:    1,
    variant:    'bar',
    fullWidth:  'mobile',
    responsive: true,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['bar', 'panels', 'circles', 'vertical'],
      description: 'bar = top-bar indicator · panels = chevron breadcrumb · circles = horizontal dots · vertical = stacked list',
    },
    current:     { control: { type: 'range', min: 0, max: 4, step: 1 }, description: '0-indexed active step' },
    steps:       { control: false, description: 'Array of { label, description? }' },
    onStepClick:      { control: false, description: 'Optional click handler — enables hover states and makes steps navigable' },
    panelAppearance:  { control: 'select', options: ['default', 'ghost'], description: 'panels variant only — default = solid white · ghost = transparent' },
    fullWidth:        { control: 'select', options: ['none', 'always', 'mobile'], description: 'none = shrink to content · always = fill container · mobile = fill on small screens only' },
    minStepWidth:     { control: { type: 'number', min: 0, step: 8 }, description: 'Minimum width (px) per step column' },
    responsive:       { control: 'boolean', description: 'Collapse horizontal variants to a left-border vertical list below the sm breakpoint (640 px) — on by default' },
    className:        { control: 'text' },
  },
} satisfies Meta<typeof StepsBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS_SIMPLE = [
  { label: 'Job details'  },
  { label: 'Application' },
  { label: 'Preview'     },
];

const STEPS_DESC = [
  { label: 'Details',    description: 'Name & type'      },
  { label: 'Configure',  description: 'Settings'         },
  { label: 'Review',     description: 'Check everything' },
  { label: 'Deploy',     description: 'Go live'          },
];

const STEPS_LONG = [
  { label: 'Create account'       },
  { label: 'Profile information'  },
  { label: 'Theme'                },
  { label: 'Preview'              },
];

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <StepsBar {...args} steps={STEPS_SIMPLE} />
  ),
};

// ── Bar ───────────────────────────────────────────────────

export const BarVariant: Story = {
  name: 'Bar — top-bar indicator',
  render: (args) => (
    <StepsBar {...args} steps={STEPS_SIMPLE} current={1} variant="bar" />
  ),
};

export const BarWithDescriptions: Story = {
  name: 'Bar — with descriptions',
  render: (args) => (
    <StepsBar {...args} steps={STEPS_DESC} current={1} variant="bar" />
  ),
};

// ── Panels ────────────────────────────────────────────────

export const PanelsVariant: Story = {
  name: 'Panels — chevron breadcrumb',
  render: (args) => (
    <StepsBar {...args} steps={STEPS_SIMPLE} current={1} variant="panels" />
  ),
};

export const PanelsWithDescriptions: Story = {
  name: 'Panels — with descriptions',
  render: (args) => (
    <StepsBar {...args} steps={STEPS_DESC} current={1} variant="panels" />
  ),
};

// ── Circles ───────────────────────────────────────────────

export const CirclesVariant: Story = {
  name: 'Circles — horizontal dots',
  render: (args) => (
    <StepsBar {...args} steps={STEPS_LONG} current={2} variant="circles" />
  ),
};

export const CirclesNoLabels: Story = {
  name: 'Circles — no labels (icon only)',
  render: (args) => (
    <div className="max-w-xs">
      <StepsBar {...args} steps={STEPS_LONG.map(s => ({ label: s.label }))} current={2} variant="circles" />
    </div>
  ),
};

// ── Vertical ──────────────────────────────────────────────

export const VerticalVariant: Story = {
  name: 'Vertical — stacked list',
  render: (args) => (
    <StepsBar {...args} steps={STEPS_LONG} current={1} variant="vertical" />
  ),
};

export const VerticalWithDescriptions: Story = {
  name: 'Vertical — with descriptions',
  render: (args) => (
    <StepsBar {...args} steps={STEPS_DESC} current={1} variant="vertical" />
  ),
};

// ── Clickable (hover effects) ─────────────────────────────

export const ClickableBar: Story = {
  name: 'Bar — clickable (hover effects)',
  render: (args) => (
    <StepsBar {...args} steps={STEPS_SIMPLE} current={1} variant="bar" onStepClick={() => {}} />
  ),
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
        <p className="text-xs font-mono text-ink-400">default</p>
        <StepsBar steps={STEPS_SIMPLE} current={1} variant="panels" panelAppearance="default" onStepClick={() => {}} />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-mono text-ink-400">ghost</p>
        <StepsBar steps={STEPS_SIMPLE} current={1} variant="panels" panelAppearance="ghost" onStepClick={() => {}} />
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

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants — current=1',
  render: () => (
    <div className="space-y-10 max-w-2xl">
      {(['bar', 'panels', 'circles'] as const).map(v => (
        <div key={v} className="space-y-2">
          <p className="text-xs font-mono text-ink-400">{v}</p>
          <StepsBar steps={STEPS_SIMPLE} current={1} variant={v} />
        </div>
      ))}
      <div className="space-y-2">
        <p className="text-xs font-mono text-ink-400">vertical</p>
        <StepsBar steps={STEPS_SIMPLE} current={1} variant="vertical" />
      </div>
    </div>
  ),
};

// ── Completed ─────────────────────────────────────────────

export const AllComplete: Story = {
  name: 'All steps complete',
  render: () => (
    <div className="space-y-8 max-w-2xl">
      {(['bar', 'panels', 'circles'] as const).map(v => (
        <div key={v} className="space-y-1">
          <p className="text-xs font-mono text-ink-400">{v}</p>
          <StepsBar steps={STEPS_SIMPLE} current={STEPS_SIMPLE.length} variant={v} />
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
      {(['bar', 'panels', 'circles'] as const).map(v => (
        <div key={v} className="space-y-2">
          <p className="text-xs font-mono text-ink-400">{v} (resize window below 640 px)</p>
          <StepsBar
            {...args}
            steps={STEPS_DESC}
            current={1}
            variant={v}
            fullWidth="always"
            responsive
          />
        </div>
      ))}
    </div>
  ),
};
