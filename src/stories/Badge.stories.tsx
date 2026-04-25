import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Elements/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    label:    { control: 'text' },
    variant:  { control: 'select', options: ['active', 'running', 'pending', 'draft', 'failed', 'warning', 'ai', 'neutral'] },
    size:     { control: 'select', options: ['sm', 'md'] },
    shape:    { control: 'select', options: ['pill', 'rounded'] },
    outlined: { control: 'boolean' },
    dot:      { control: 'boolean' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const ALL_VARIANTS = ['active', 'running', 'pending', 'draft', 'failed', 'warning', 'ai', 'neutral'] as const;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: { label: 'Active', variant: 'active' },
};

// ── Variants ──────────────────────────────────────────────

export const Active:  Story = { args: { label: 'Active',       variant: 'active'  } };
export const Running: Story = { args: { label: 'Running',      variant: 'running' } };
export const Pending: Story = { args: { label: 'Pending',      variant: 'pending' } };
export const Draft:   Story = { args: { label: 'Draft',        variant: 'draft'   } };
export const Failed:  Story = { args: { label: 'Failed',       variant: 'failed'  } };
export const Warning: Story = { args: { label: 'Warning',      variant: 'warning' } };
export const AI:      Story = { args: { label: 'AI-Generated', variant: 'ai'      } };
export const Neutral: Story = { args: { label: 'Neutral',      variant: 'neutral' } };

// ── Shapes ────────────────────────────────────────────────

export const Pill: Story = {
  name: 'Shape — pill',
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {ALL_VARIANTS.map(v => (
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
      {ALL_VARIANTS.map(v => (
        <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} shape="rounded" />
      ))}
    </div>
  ),
};

// ── Sizes ─────────────────────────────────────────────────

export const SizeMd: Story = {
  name: 'Size — md',
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {ALL_VARIANTS.map(v => (
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
      {ALL_VARIANTS.map(v => (
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
      {ALL_VARIANTS.map(v => (
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
      {ALL_VARIANTS.map(v => (
        <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} outlined shape="rounded" />
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
      {ALL_VARIANTS.map(v => (
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
      {ALL_VARIANTS.map(v => (
        <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} dot={false} />
      ))}
    </div>
  ),
};

// ── Removable ─────────────────────────────────────────────

export const Removable: Story = {
  name: 'Removable',
  args: { label: '' },
  render: () => {
    const [tags, setTags] = useState([...ALL_VARIANTS]);
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map(v => (
          <Badge
            key={v}
            label={v.charAt(0).toUpperCase() + v.slice(1)}
            variant={v}
            onRemove={() => setTags(t => t.filter(x => x !== v))}
          />
        ))}
        {tags.length === 0 && (
          <button
            className="text-xs text-ink-400 hover:text-ink-600 underline font-body"
            onClick={() => setTags([...ALL_VARIANTS])}
          >
            Reset
          </button>
        )}
      </div>
    );
  },
};

export const RemovableRounded: Story = {
  name: 'Removable — rounded',
  args: { label: '' },
  render: () => {
    const [tags, setTags] = useState([...ALL_VARIANTS]);
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map(v => (
          <Badge
            key={v}
            label={v.charAt(0).toUpperCase() + v.slice(1)}
            variant={v}
            shape="rounded"
            outlined
            dot={false}
            onRemove={() => setTags(t => t.filter(x => x !== v))}
          />
        ))}
        {tags.length === 0 && (
          <button
            className="text-xs text-ink-400 hover:text-ink-600 underline font-body"
            onClick={() => setTags([...ALL_VARIANTS])}
          >
            Reset
          </button>
        )}
      </div>
    );
  },
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  args: { label: '' },
  render: () => (
    <div className="flex flex-col gap-6">
      {/* Flat pill */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-400 uppercase tracking-wider mb-2">Flat · Pill</p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map(v => <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} shape="pill" />)}
        </div>
      </div>

      {/* Flat rounded */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-400 uppercase tracking-wider mb-2">Flat · Rounded</p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map(v => <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} shape="rounded" />)}
        </div>
      </div>

      {/* Outlined pill */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-400 uppercase tracking-wider mb-2">Outlined · Pill</p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map(v => <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} shape="pill" outlined />)}
        </div>
      </div>

      {/* Outlined rounded */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-400 uppercase tracking-wider mb-2">Outlined · Rounded</p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map(v => <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} shape="rounded" outlined />)}
        </div>
      </div>

      {/* Small */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-400 uppercase tracking-wider mb-2">Small</p>
        <div className="flex flex-wrap gap-1.5 items-center">
          {ALL_VARIANTS.map(v => <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} size="sm" />)}
          {ALL_VARIANTS.map(v => <Badge key={`${v}-r`} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} size="sm" shape="rounded" outlined />)}
        </div>
      </div>

      {/* Without dot */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-400 uppercase tracking-wider mb-2">Without dot</p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map(v => <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} dot={false} />)}
        </div>
      </div>

      {/* Removable */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-400 uppercase tracking-wider mb-2">Removable</p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map(v => (
            <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} onRemove={() => {}} />
          ))}
        </div>
      </div>
    </div>
  ),
};
