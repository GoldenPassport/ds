import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Elements/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    label:    { control: 'text' },
    variant:  { control: 'select', options: [
      'active', 'running', 'pending', 'draft', 'failed', 'warning', 'ai', 'neutral',
      'happy', 'satisfied', 'confused', 'frustrated', 'angry', 'sad', 'urgent',
    ]},
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    shape:    { control: 'select', options: ['pill', 'rounded'] },
    outlined: { control: 'boolean' },
    dot:      { control: 'boolean' },
    icon:     { control: false },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATUS_VARIANTS    = ['active', 'running', 'pending', 'draft', 'failed', 'warning', 'ai', 'neutral'] as const;
const SENTIMENT_VARIANTS = ['happy', 'satisfied', 'neutral', 'confused', 'frustrated', 'angry', 'sad', 'urgent'] as const;
const ALL_VARIANTS       = [...STATUS_VARIANTS, 'happy', 'satisfied', 'confused', 'frustrated', 'angry', 'sad', 'urgent'] as const;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: { label: 'Active', variant: 'active', size: 'md', shape: 'pill', outlined: false, dot: true },
};

// ── Status variants ───────────────────────────────────────

export const Active:     Story = { args: { label: 'Active',       variant: 'active'     } };
export const Running:    Story = { args: { label: 'Running',      variant: 'running'    } };
export const Pending:    Story = { args: { label: 'Pending',      variant: 'pending'    } };
export const Draft:      Story = { args: { label: 'Draft',        variant: 'draft'      } };
export const Failed:     Story = { args: { label: 'Failed',       variant: 'failed'     } };
export const Warning:    Story = { args: { label: 'Warning',      variant: 'warning'    } };
export const AI:         Story = { args: { label: 'AI-Generated', variant: 'ai'         } };
export const Neutral:    Story = { args: { label: 'Neutral',      variant: 'neutral'    } };

// ── Sentiment variants ────────────────────────────────────

export const Happy:      Story = { args: { label: 'Happy',      variant: 'happy',      icon: '😊' } };
export const Satisfied:  Story = { args: { label: 'Satisfied',  variant: 'satisfied',  icon: '👍' } };
export const Confused:   Story = { args: { label: 'Confused',   variant: 'confused',   icon: '🤔' } };
export const Frustrated: Story = { args: { label: 'Frustrated', variant: 'frustrated', icon: '😤' } };
export const Angry:      Story = { args: { label: 'Angry',      variant: 'angry',      icon: '😠' } };
export const Sad:        Story = { args: { label: 'Sad',        variant: 'sad',        icon: '😔' } };
export const Urgent:     Story = { args: { label: 'Urgent',     variant: 'urgent',     icon: '🚨' } };

// ── Shapes ────────────────────────────────────────────────

export const Pill: Story = {
  name: 'Shape — pill',
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUS_VARIANTS.map(v => (
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
      {STATUS_VARIANTS.map(v => (
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
      {STATUS_VARIANTS.map(v => (
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
      {STATUS_VARIANTS.map(v => (
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
      {STATUS_VARIANTS.map(v => (
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
      {STATUS_VARIANTS.map(v => (
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
      {STATUS_VARIANTS.map(v => (
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
      {STATUS_VARIANTS.map(v => (
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
      {STATUS_VARIANTS.map(v => (
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
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">sm</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="active"  icon="✅" label="Verified"  size="sm" />
          <Badge variant="failed"  icon="⚠️" label="At risk"   size="sm" />
          <Badge variant="pending" icon="🔄" label="Syncing"   size="sm" />
          <Badge variant="ai"      icon="✨" label="Generated" size="sm" />
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">md</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="active"  icon="✅" label="Verified"  />
          <Badge variant="failed"  icon="⚠️" label="At risk"   />
          <Badge variant="pending" icon="🔄" label="Syncing"   />
          <Badge variant="ai"      icon="✨" label="Generated" />
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">lg</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="active"  icon="✅" label="Verified"  size="lg" />
          <Badge variant="failed"  icon="⚠️" label="At risk"   size="lg" />
          <Badge variant="pending" icon="🔄" label="Syncing"   size="lg" />
          <Badge variant="ai"      icon="✨" label="Generated" size="lg" />
        </div>
      </div>
    </div>
  ),
};

// ── Sentiment variants ────────────────────────────────────

const SENTIMENT_ICONS: Record<typeof SENTIMENT_VARIANTS[number], string> = {
  happy: '😊', satisfied: '👍', neutral: '😐', confused: '🤔',
  frustrated: '😤', angry: '😠', sad: '😔', urgent: '🚨',
};

export const SentimentVariants: Story = {
  name: 'Sentiment variants',
  args: { label: '' },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">Flat · sm (chat use)</p>
        <div className="flex flex-wrap gap-2">
          {SENTIMENT_VARIANTS.map(v => (
            <Badge key={v} variant={v} icon={SENTIMENT_ICONS[v]} label={v.charAt(0).toUpperCase() + v.slice(1)} size="sm" />
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">Flat · md</p>
        <div className="flex flex-wrap gap-2">
          {SENTIMENT_VARIANTS.map(v => (
            <Badge key={v} variant={v} icon={SENTIMENT_ICONS[v]} label={v.charAt(0).toUpperCase() + v.slice(1)} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">Outlined · md</p>
        <div className="flex flex-wrap gap-2">
          {SENTIMENT_VARIANTS.map(v => (
            <Badge key={v} variant={v} icon={SENTIMENT_ICONS[v]} label={v.charAt(0).toUpperCase() + v.slice(1)} outlined />
          ))}
        </div>
      </div>
    </div>
  ),
};

// ── Removable ─────────────────────────────────────────────

export const Removable: Story = {
  name: 'Removable',
  args: { label: '' },
  render: () => {
    const [tags, setTags] = useState([...STATUS_VARIANTS]);
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
            className="text-xs text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-200 underline font-body"
            onClick={() => setTags([...STATUS_VARIANTS])}
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
    const [tags, setTags] = useState([...STATUS_VARIANTS]);
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
            className="text-xs text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-200 underline font-body"
            onClick={() => setTags([...STATUS_VARIANTS])}
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
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">Flat · Pill</p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map(v => <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} shape="pill" />)}
        </div>
      </div>

      {/* Flat rounded */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">Flat · Rounded</p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map(v => <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} shape="rounded" />)}
        </div>
      </div>

      {/* Outlined pill */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">Outlined · Pill</p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map(v => <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} shape="pill" outlined />)}
        </div>
      </div>

      {/* Outlined rounded */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">Outlined · Rounded</p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map(v => <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} shape="rounded" outlined />)}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">Sizes</p>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5 items-center">
            {ALL_VARIANTS.map(v => <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} size="lg" />)}
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {ALL_VARIANTS.map(v => <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} size="md" />)}
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {ALL_VARIANTS.map(v => <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} size="sm" />)}
          </div>
        </div>
      </div>

      {/* Without dot */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">Without dot</p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map(v => <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} dot={false} />)}
        </div>
      </div>

      {/* Removable */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">Removable</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_VARIANTS.map(v => (
            <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} onRemove={() => {}} />
          ))}
        </div>
      </div>
    </div>
  ),
};
