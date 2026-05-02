import type { Meta, StoryObj } from '@storybook/react';
import { Users, CreditCard, Activity, TrendingUp } from 'lucide-react';
import { Stats } from '../components/Stats';

const meta = {
  title: 'Data Display/Stats',
  component: Stats,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: { type: 'select', options: ['cards', 'bordered', 'simple'] } },
    columns: { control: { type: 'select', options: [2, 3, 4] } },
    items: { control: false },
  },
} satisfies Meta<typeof Stats>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Fixtures ──────────────────────────────────────────────

const BASIC = [
  {
    label: 'Total revenue',
    value: '$405,091',
    change: '+4.75%',
    changeType: 'increase' as const,
    description: 'vs last month',
  },
  {
    label: 'Subscriptions',
    value: '2,350',
    change: '+54.02%',
    changeType: 'increase' as const,
    description: 'vs last month',
  },
  {
    label: 'Avg open rate',
    value: '24.57%',
    change: '−1.39%',
    changeType: 'decrease' as const,
    description: 'vs last month',
  },
  {
    label: 'Avg click rate',
    value: '3.20%',
    change: '+0.12%',
    changeType: 'neutral' as const,
    description: 'vs last month',
  },
];

const WITH_ICONS = [
  {
    label: 'Total users',
    value: '12,345',
    change: '+12%',
    changeType: 'increase' as const,
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: 'Monthly revenue',
    value: '$48,295',
    change: '+8.3%',
    changeType: 'increase' as const,
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    label: 'Active runs',
    value: '1,429',
    change: '−3.1%',
    changeType: 'decrease' as const,
    icon: <Activity className="w-5 h-5" />,
  },
  {
    label: 'Conversion rate',
    value: '3.62%',
    change: '+0.5%',
    changeType: 'increase' as const,
    icon: <TrendingUp className="w-5 h-5" />,
  },
];

const THREE_COL = [
  {
    label: 'Active workflows',
    value: '73',
    change: '+12',
    changeType: 'increase' as const,
    description: 'since last week',
  },
  {
    label: 'API calls today',
    value: '1.2M',
    change: '+18%',
    changeType: 'increase' as const,
    description: 'vs yesterday',
  },
  {
    label: 'Error rate',
    value: '0.08%',
    change: '−0.02%',
    changeType: 'increase' as const,
    description: 'lower is better',
  },
];

const NO_CHANGE = [
  { label: 'Workspaces', value: '14', description: 'Across all regions' },
  { label: 'Team members', value: '38', description: '6 pending invites' },
  { label: 'Deployments', value: '261', description: 'This quarter' },
  { label: 'Uptime', value: '99.98%', description: 'Last 90 days' },
];

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'cards',
    columns: 4,
    items: BASIC,
  },
};

// ── Cards ─────────────────────────────────────────────────

export const Cards: Story = {
  name: 'Cards — default',
  args: { items: [] },
  render: () => <Stats variant="cards" items={BASIC} />,
};

// ── Cards with icons ──────────────────────────────────────

export const CardsWithIcons: Story = {
  name: 'Cards — with icons',
  args: { items: [] },
  render: () => <Stats variant="cards" items={WITH_ICONS} />,
};

// ── Bordered ──────────────────────────────────────────────

export const Bordered: Story = {
  name: 'Bordered — shared container',
  args: { items: [] },
  render: () => <Stats variant="bordered" items={BASIC} />,
};

// ── Simple ────────────────────────────────────────────────

export const Simple: Story = {
  name: 'Simple — no chrome',
  args: { items: [] },
  render: () => <Stats variant="simple" items={BASIC} />,
};

// ── 3 columns ─────────────────────────────────────────────

export const ThreeColumns: Story = {
  name: '3 columns',
  args: { items: [] },
  render: () => (
    <div className="flex flex-col gap-8">
      <Stats variant="cards" columns={3} items={THREE_COL} />
      <Stats variant="bordered" columns={3} items={THREE_COL} />
    </div>
  ),
};

// ── No change indicator ───────────────────────────────────

export const NoChange: Story = {
  name: 'No change indicator',
  args: { items: [] },
  render: () => (
    <div className="flex flex-col gap-8">
      <Stats variant="cards" items={NO_CHANGE} />
      <Stats variant="bordered" items={NO_CHANGE} />
    </div>
  ),
};

// ── Clickable cards ───────────────────────────────────────

export const Clickable: Story = {
  name: 'Clickable cards — with href',
  args: { items: [] },
  render: () => (
    <Stats variant="cards" items={WITH_ICONS.map((item) => ({ ...item, href: '#' }))} />
  ),
};

// ── All variants ──────────────────────────────────────────

// ── In context ────────────────────────────────────────────

export const InContext: Story = {
  name: 'In context — dashboard page',
  args: { items: [] },
  render: () => (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900 py-8">
      <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight">
              Dashboard
            </h1>
            <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-300">
              Welcome back. Here's what's happening this month.
            </p>
          </div>
        </div>
        <Stats variant="cards" items={WITH_ICONS} />
        <Stats
          variant="bordered"
          items={[
            {
              label: 'Active workflows',
              value: '73',
              change: '+12',
              changeType: 'increase',
              description: 'since last week',
            },
            {
              label: 'API calls today',
              value: '1.2M',
              change: '+18%',
              changeType: 'increase',
              description: 'vs yesterday',
            },
            {
              label: 'Error rate',
              value: '0.08%',
              change: '−0.02%',
              changeType: 'increase',
              description: 'lower is better',
            },
            { label: 'Uptime', value: '99.98%', description: 'Last 90 days' },
          ]}
        />
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  name: 'All variants',
  args: { items: [] },
  render: () => (
    <div className="flex flex-col gap-10">
      {(['cards', 'bordered', 'simple'] as const).map((v) => (
        <div key={v}>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-3">variant="{v}"</p>
          <Stats variant={v} items={BASIC} />
        </div>
      ))}
    </div>
  ),
};
