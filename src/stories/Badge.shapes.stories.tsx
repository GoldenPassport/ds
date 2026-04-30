import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Elements/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: 'select',
      options: [
        'active',
        'running',
        'pending',
        'draft',
        'failed',
        'warning',
        'ai',
        'neutral',
        'happy',
        'satisfied',
        'confused',
        'frustrated',
        'angry',
        'sad',
        'urgent',
      ],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['pill', 'rounded'] },
    outlined: { control: 'boolean' },
    dot: { control: 'boolean' },
    icon: { control: false },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATUS_VARIANTS = [
  'active',
  'running',
  'pending',
  'draft',
  'failed',
  'warning',
  'ai',
  'neutral',
] as const;

// ── Shapes ────────────────────────────────────────────────

export const Pill: Story = {
  name: 'Shape — pill',
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUS_VARIANTS.map((v) => (
        <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} shape="pill" />
      ))}
    </div>
  ),
};

export const Rounded: Story = {
  name: 'Shape — rounded',
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUS_VARIANTS.map((v) => (
        <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} shape="rounded" />
      ))}
    </div>
  ),
};

// ── Sizes ─────────────────────────────────────────────────

export const SizeLg: Story = {
  name: 'Size — lg',
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUS_VARIANTS.map((v) => (
        <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} size="lg" />
      ))}
    </div>
  ),
};

export const SizeMd: Story = {
  name: 'Size — md',
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUS_VARIANTS.map((v) => (
        <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} size="md" />
      ))}
    </div>
  ),
};

export const SizeSm: Story = {
  name: 'Size — sm',
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUS_VARIANTS.map((v) => (
        <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} size="sm" />
      ))}
    </div>
  ),
};

// ── Outlined ──────────────────────────────────────────────

export const OutlinedPill: Story = {
  name: 'Outlined — pill',
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUS_VARIANTS.map((v) => (
        <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} outlined />
      ))}
    </div>
  ),
};

export const OutlinedRounded: Story = {
  name: 'Outlined — rounded',
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUS_VARIANTS.map((v) => (
        <Badge
          key={v}
          label={v.charAt(0).toUpperCase() + v.slice(1)}
          variant={v}
          outlined
          shape="rounded"
        />
      ))}
    </div>
  ),
};

// ── With / without dot ────────────────────────────────────

export const WithDot: Story = {
  name: 'With dot',
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUS_VARIANTS.map((v) => (
        <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} dot />
      ))}
    </div>
  ),
};

export const WithoutDot: Story = {
  name: 'Without dot',
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUS_VARIANTS.map((v) => (
        <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} dot={false} />
      ))}
    </div>
  ),
};

// ── With icon ─────────────────────────────────────────────

export const WithIcon: Story = {
  name: 'With icon',
  args: { label: '' },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          sm
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="active" icon="✅" label="Verified" size="sm" />
          <Badge variant="failed" icon="⚠️" label="At risk" size="sm" />
          <Badge variant="pending" icon="🔄" label="Syncing" size="sm" />
          <Badge variant="ai" icon="✨" label="Generated" size="sm" />
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          md
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="active" icon="✅" label="Verified" />
          <Badge variant="failed" icon="⚠️" label="At risk" />
          <Badge variant="pending" icon="🔄" label="Syncing" />
          <Badge variant="ai" icon="✨" label="Generated" />
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          lg
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="active" icon="✅" label="Verified" size="lg" />
          <Badge variant="failed" icon="⚠️" label="At risk" size="lg" />
          <Badge variant="pending" icon="🔄" label="Syncing" size="lg" />
          <Badge variant="ai" icon="✨" label="Generated" size="lg" />
        </div>
      </div>
    </div>
  ),
};
