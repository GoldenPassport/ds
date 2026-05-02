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

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => <StepsBar {...args} steps={STEPS_SIMPLE} />,
};

// ── Bar ───────────────────────────────────────────────────

export const BarVariant: Story = {
  name: 'Bar — top-bar indicator',
  render: (args) => <StepsBar {...args} steps={STEPS_SIMPLE} current={1} variant="bar" />,
};

export const BarWithDescriptions: Story = {
  name: 'Bar — with descriptions',
  render: (args) => <StepsBar {...args} steps={STEPS_DESC} current={1} variant="bar" />,
};

// ── Panels ────────────────────────────────────────────────

export const PanelsVariant: Story = {
  name: 'Panels — chevron breadcrumb',
  render: (args) => <StepsBar {...args} steps={STEPS_SIMPLE} current={1} variant="panels" />,
};

export const PanelsWithDescriptions: Story = {
  name: 'Panels — with descriptions',
  render: (args) => <StepsBar {...args} steps={STEPS_DESC} current={1} variant="panels" />,
};

// ── Circles ───────────────────────────────────────────────

export const CirclesVariant: Story = {
  name: 'Circles — horizontal dots',
  render: (args) => <StepsBar {...args} steps={STEPS_LONG} current={2} variant="circles" />,
};

export const CirclesNoLabels: Story = {
  name: 'Circles — no labels (icon only)',
  render: (args) => (
    <div className="max-w-xs">
      <StepsBar
        {...args}
        steps={STEPS_LONG.map((s) => ({ label: s.label }))}
        current={2}
        variant="circles"
      />
    </div>
  ),
};

// ── Vertical ──────────────────────────────────────────────

export const VerticalVariant: Story = {
  name: 'Vertical — stacked list',
  render: (args) => <StepsBar {...args} steps={STEPS_LONG} current={1} variant="vertical" />,
};

export const VerticalWithDescriptions: Story = {
  name: 'Vertical — with descriptions',
  render: (args) => <StepsBar {...args} steps={STEPS_DESC} current={1} variant="vertical" />,
};
