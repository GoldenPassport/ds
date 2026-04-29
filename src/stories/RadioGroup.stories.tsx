import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from '../components/RadioGroup';

const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant:           { control: 'select', options: ['list', 'cards', 'grid', 'minicards', 'stacked'], description: 'Visual layout' },
    indicatorPosition: { control: 'select', options: ['left', 'right'], description: 'Side the radio/check indicator sits on (list defaults left, stacked defaults right)' },
    dividers:          { control: 'boolean', description: 'Show a divider line between items (list and cards variants)' },
    label:    { control: 'text',    description: 'Group label (renders as <legend>)' },
    hint:     { control: 'text',    description: 'Helper text below the group' },
    disabled: { control: 'boolean', description: 'Disables all options' },
    options:  { control: false,     description: 'Array of { value, label, description?, trailing?, footer?, disabled? }' },
    value:    { control: false,     description: 'Currently selected value (controlled)' },
    onChange: { control: false,     description: 'Called when selection changes' },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared fixtures ────────────────────────────────────────

function Price({ amount, period = '/mo' }: { amount: string; period?: string }) {
  return (
    <span className="flex flex-col items-end">
      <span className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">{amount}</span>
      <span className="text-xs text-ink-500 dark:text-ink-300 font-body">{period}</span>
    </span>
  );
}

const PLAN_OPTIONS = [
  { value: 'hobby',      label: 'Hobby',      description: '8GB / 4 CPUs  ·  160 GB SSD disk',    trailing: <Price amount="$40" />  },
  { value: 'startup',    label: 'Startup',    description: '12GB / 6 CPUs  ·  256 GB SSD disk',   trailing: <Price amount="$80" />  },
  { value: 'business',   label: 'Business',   description: '16GB / 8 CPUs  ·  512 GB SSD disk',   trailing: <Price amount="$160" /> },
  { value: 'enterprise', label: 'Enterprise', description: '32GB / 12 CPUs  ·  1024 GB SSD disk', trailing: <Price amount="$240" /> },
];

const NOTIFY_OPTIONS = [
  { value: 'all',      label: 'All activity',  description: 'Every run, step, and status change' },
  { value: 'failures', label: 'Failures only', description: 'Only when a run fails or errors'    },
  { value: 'none',     label: 'None',          description: 'No email notifications'             },
];

const REGION_OPTIONS = [
  { value: 'us-east',    label: 'US East (Virginia)'     },
  { value: 'us-west',    label: 'US West (Oregon)'       },
  { value: 'eu-central', label: 'EU Central (Frankfurt)' },
  { value: 'ap-south',   label: 'AP South (Singapore)'   },
];

const DEPLOY_OPTIONS = [
  { value: 'automatic', label: 'Automatic', description: 'Deploy on every push to main'    },
  { value: 'manual',    label: 'Manual',    description: 'Trigger deploys yourself'        },
  { value: 'scheduled', label: 'Scheduled', description: 'Deploy on a cron schedule', disabled: true },
];

const MAILING_OPTIONS = [
  { value: 'newsletter', label: 'Newsletter',         description: 'Last message sent an hour ago', footer: '621 users'  },
  { value: 'customers',  label: 'Existing customers', description: 'Last message sent 2 weeks ago', footer: '1200 users' },
  { value: 'trial',      label: 'Trial users',        description: 'Last message sent 4 days ago',  footer: '2740 users' },
];

const RAM_OPTIONS = [
  { value: '4',   label: '4 GB'   },
  { value: '8',   label: '8 GB'   },
  { value: '16',  label: '16 GB'  },
  { value: '32',  label: '32 GB'  },
  { value: '64',  label: '64 GB'  },
  { value: '128', label: '128 GB', disabled: true },
];

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: { value: null, onChange: () => {}, options: [], variant: 'cards', label: 'Server size' },
  render: (args) => {
    const [val, setVal] = React.useState<string | null>('hobby');
    return (
      <div className="max-w-lg">
        <RadioGroup {...args} value={val} onChange={setVal} options={PLAN_OPTIONS} label="Server size" />
      </div>
    );
  },
};

// ── List ──────────────────────────────────────────────────

export const List: Story = {
  name: 'Variant — list',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('failures');
    return (
      <div className="max-w-sm">
        <RadioGroup
          variant="list"
          label="Email notifications"
          hint="You can change this at any time in your account settings."
          options={NOTIFY_OPTIONS}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

export const ListNoDescription: Story = {
  name: 'List — no descriptions',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('us-east');
    return (
      <div className="max-w-xs">
        <RadioGroup
          variant="list"
          label="Deployment region"
          options={REGION_OPTIONS}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

// ── Cards ─────────────────────────────────────────────────

export const Cards: Story = {
  name: 'Variant — cards',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('hobby');
    return (
      <div className="max-w-lg">
        <RadioGroup
          variant="cards"
          label="Server size"
          options={PLAN_OPTIONS}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

export const CardsNoTrailing: Story = {
  name: 'Cards — no trailing',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('us-east');
    return (
      <div className="max-w-sm">
        <RadioGroup
          variant="cards"
          label="Deployment region"
          options={REGION_OPTIONS}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

// ── Grid ──────────────────────────────────────────────────

export const Grid: Story = {
  name: 'Variant — grid',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('newsletter');
    return (
      <RadioGroup
        variant="grid"
        label="Select a mailing list"
        options={MAILING_OPTIONS}
        value={val}
        onChange={setVal}
      />
    );
  },
};

export const GridNarrow: Story = {
  name: 'Grid — narrow (2-up)',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('automatic');
    const opts = [
      { value: 'automatic', label: 'Automatic',   description: 'Deploy on every push to main',   footer: 'Recommended' },
      { value: 'manual',    label: 'Manual',       description: 'Trigger deploys yourself',       footer: 'Full control' },
      { value: 'scheduled', label: 'Scheduled',    description: 'Deploy on a cron schedule',      footer: 'Cron-based', disabled: true },
    ];
    return (
      <div className="max-w-2xl">
        <RadioGroup variant="grid" label="Deployment trigger" options={opts} value={val} onChange={setVal} />
      </div>
    );
  },
};

// ── Minicards ─────────────────────────────────────────────

export const Minicards: Story = {
  name: 'Variant — minicards',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('16');
    return (
      <div className="max-w-xl">
        <RadioGroup
          variant="minicards"
          label="RAM"
          options={RAM_OPTIONS}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

export const MinicardsRegion: Story = {
  name: 'Minicards — regions',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('us-east');
    return (
      <div className="max-w-lg">
        <RadioGroup
          variant="minicards"
          label="Deployment region"
          options={REGION_OPTIONS}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

// ── Stacked ───────────────────────────────────────────────

export const Stacked: Story = {
  name: 'Variant — stacked',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('automatic');
    return (
      <div className="max-w-sm">
        <RadioGroup
          variant="stacked"
          label="Deployment trigger"
          options={DEPLOY_OPTIONS}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

export const StackedNoDescription: Story = {
  name: 'Stacked — no descriptions',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('us-west');
    return (
      <div className="max-w-xs">
        <RadioGroup
          variant="stacked"
          label="Region"
          options={REGION_OPTIONS}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

// ── Dividers ──────────────────────────────────────────────

export const ListWithDividers: Story = {
  name: 'List — with dividers',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('none');
    return (
      <div className="max-w-sm">
        <RadioGroup
          variant="list"
          indicatorPosition="right"
          dividers
          label="Select a side"
          options={[
            { value: 'none',     label: 'None'            },
            { value: 'beans',    label: 'Baked beans'     },
            { value: 'coleslaw', label: 'Coleslaw'        },
            { value: 'fries',    label: 'French fries'    },
            { value: 'salad',    label: 'Garden salad'    },
            { value: 'mash',     label: 'Mashed potatoes' },
          ]}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

export const CardsWithDividers: Story = {
  name: 'Cards — with dividers',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('hobby');
    return (
      <div className="max-w-lg">
        <RadioGroup
          variant="cards"
          dividers
          label="Server size"
          options={PLAN_OPTIONS}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

// ── Indicator position ────────────────────────────────────

export const ListIndicatorRight: Story = {
  name: 'List — indicator right',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('eu-central');
    return (
      <div className="max-w-xs">
        <RadioGroup
          variant="list"
          indicatorPosition="right"
          label="Deployment region"
          options={REGION_OPTIONS}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

export const StackedIndicatorLeft: Story = {
  name: 'Stacked — indicator left',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('automatic');
    return (
      <div className="max-w-sm">
        <RadioGroup
          variant="stacked"
          indicatorPosition="left"
          label="Deployment trigger"
          options={DEPLOY_OPTIONS}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

// ── States ────────────────────────────────────────────────

export const WithDisabledOption: Story = {
  name: 'With disabled option',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [val, setVal] = React.useState<string | null>('automatic');
    return (
      <div className="max-w-sm">
        <RadioGroup
          variant="list"
          label="Deployment trigger"
          options={DEPLOY_OPTIONS}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

export const FullyDisabled: Story = {
  name: 'Fully disabled',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => (
    <div className="max-w-sm">
      <RadioGroup
        variant="stacked"
        label="Billing plan"
        hint="Contact your admin to change this."
        options={DEPLOY_OPTIONS}
        value="enterprise"
        onChange={() => {}}
        disabled
      />
    </div>
  ),
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  args: { value: null, onChange: () => {}, options: [] },
  render: () => {
    const [list,      setList]      = React.useState<string | null>('failures');
    const [cards,     setCards]     = React.useState<string | null>('hobby');
    const [grid,      setGrid]      = React.useState<string | null>('newsletter');
    const [minicards, setMinicards] = React.useState<string | null>('16');
    const [stacked,   setStacked]   = React.useState<string | null>('automatic');
    return (
      <div className="flex flex-col gap-10 max-w-2xl">
        <div>
          <p className="text-xs font-mono text-ink-500 dark:text-ink-300 mb-4">list</p>
          <RadioGroup variant="list" label="Notifications" options={NOTIFY_OPTIONS} value={list} onChange={setList} />
        </div>
        <div>
          <p className="text-xs font-mono text-ink-500 dark:text-ink-300 mb-4">cards</p>
          <div className="max-w-lg">
            <RadioGroup variant="cards" label="Server size" options={PLAN_OPTIONS} value={cards} onChange={setCards} />
          </div>
        </div>
        <div>
          <p className="text-xs font-mono text-ink-500 dark:text-ink-300 mb-4">grid</p>
          <RadioGroup variant="grid" label="Mailing list" options={MAILING_OPTIONS} value={grid} onChange={setGrid} />
        </div>
        <div>
          <p className="text-xs font-mono text-ink-500 dark:text-ink-300 mb-4">minicards</p>
          <RadioGroup variant="minicards" label="RAM" options={RAM_OPTIONS} value={minicards} onChange={setMinicards} />
        </div>
        <div>
          <p className="text-xs font-mono text-ink-500 dark:text-ink-300 mb-4">stacked</p>
          <div className="max-w-sm">
            <RadioGroup variant="stacked" label="Deploy trigger" options={DEPLOY_OPTIONS} value={stacked} onChange={setStacked} />
          </div>
        </div>
      </div>
    );
  },
};
