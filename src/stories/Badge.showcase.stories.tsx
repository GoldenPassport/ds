import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
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

const SENTIMENT_VARIANTS = [
  'happy',
  'satisfied',
  'neutral',
  'confused',
  'frustrated',
  'angry',
  'sad',
  'urgent',
] as const;

const ALL_VARIANTS = [
  ...STATUS_VARIANTS,
  'happy',
  'satisfied',
  'confused',
  'frustrated',
  'angry',
  'sad',
  'urgent',
] as const;

const SENTIMENT_ICONS: Record<(typeof SENTIMENT_VARIANTS)[number], string> = {
  happy: '😊',
  satisfied: '👍',
  neutral: '😐',
  confused: '🤔',
  frustrated: '😤',
  angry: '😠',
  sad: '😔',
  urgent: '🚨',
};

// ── Sentiment variants ────────────────────────────────────

export const SentimentVariants: Story = {
  name: 'Sentiment variants',
  args: { label: '' },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          Flat · sm (chat use)
        </p>
        <div className="flex flex-wrap gap-2">
          {SENTIMENT_VARIANTS.map((v) => (
            <Badge
              key={v}
              variant={v}
              icon={SENTIMENT_ICONS[v]}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
              size="sm"
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          Flat · md
        </p>
        <div className="flex flex-wrap gap-2">
          {SENTIMENT_VARIANTS.map((v) => (
            <Badge
              key={v}
              variant={v}
              icon={SENTIMENT_ICONS[v]}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          Outlined · md
        </p>
        <div className="flex flex-wrap gap-2">
          {SENTIMENT_VARIANTS.map((v) => (
            <Badge
              key={v}
              variant={v}
              icon={SENTIMENT_ICONS[v]}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
              outlined
            />
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
        {tags.map((v) => (
          <Badge
            key={v}
            label={v.charAt(0).toUpperCase() + v.slice(1)}
            variant={v}
            onRemove={() => setTags((t) => t.filter((x) => x !== v))}
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
        {tags.map((v) => (
          <Badge
            key={v}
            label={v.charAt(0).toUpperCase() + v.slice(1)}
            variant={v}
            shape="rounded"
            outlined
            dot={false}
            onRemove={() => setTags((t) => t.filter((x) => x !== v))}
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
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          Flat · Pill
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map((v) => (
            <Badge
              key={v}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
              variant={v}
              shape="pill"
            />
          ))}
        </div>
      </div>

      {/* Flat rounded */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          Flat · Rounded
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map((v) => (
            <Badge
              key={v}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
              variant={v}
              shape="rounded"
            />
          ))}
        </div>
      </div>

      {/* Outlined pill */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          Outlined · Pill
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map((v) => (
            <Badge
              key={v}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
              variant={v}
              shape="pill"
              outlined
            />
          ))}
        </div>
      </div>

      {/* Outlined rounded */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          Outlined · Rounded
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map((v) => (
            <Badge
              key={v}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
              variant={v}
              shape="rounded"
              outlined
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          Sizes
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5 items-center">
            {ALL_VARIANTS.map((v) => (
              <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} size="lg" />
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {ALL_VARIANTS.map((v) => (
              <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} size="md" />
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {ALL_VARIANTS.map((v) => (
              <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} size="sm" />
            ))}
          </div>
        </div>
      </div>

      {/* Without dot */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          Without dot
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map((v) => (
            <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} dot={false} />
          ))}
        </div>
      </div>

      {/* Removable */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          Removable
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_VARIANTS.map((v) => (
            <Badge
              key={v}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
              variant={v}
              onRemove={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  ),
};

// ── Interactions ──────────────────────────────────────────

export const Interactions: Story = {
  name: 'Interactions — removable badge',
  args: { label: '' },
  render: () => {
    const [removed, setRemoved] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        {!removed && <Badge label="Active" variant="active" onRemove={() => setRemoved(true)} />}
        {removed && (
          <p data-testid="badge-removed" className="text-xs font-body text-ink-500">
            Badge removed
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('badge renders with remove button', async () => {
      await canvas.findByRole('button', { name: /remove/i });
      expect(canvas.getByText('Active')).toBeInTheDocument();
    });

    await step('click remove button → onRemove fires and badge is gone', async () => {
      await user.click(canvas.getByRole('button', { name: /remove/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('badge-removed')).toBeInTheDocument();
        expect(canvas.queryByText('Active')).not.toBeInTheDocument();
      });
    });
  },
};
