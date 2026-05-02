import { expect, userEvent, within, waitFor } from 'storybook/test';
import { useState } from 'react';
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

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    label: 'Active',
    variant: 'active',
    size: 'md',
    shape: 'pill',
    outlined: false,
    dot: true,
  },
};

// ── Status variants ───────────────────────────────────────

export const StatusVariants: Story = {
  name: 'Status variants',
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUS_VARIANTS.map((v) => (
        <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} />
      ))}
    </div>
  ),
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

// ── Shapes ────────────────────────────────────────────────

export const Shapes: Story = {
  name: 'Shapes',
  args: { label: '' },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          Pill (default)
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_VARIANTS.map((v) => (
            <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} shape="pill" />
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          Rounded
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_VARIANTS.map((v) => (
            <Badge
              key={v}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
              variant={v}
              shape="rounded"
            />
          ))}
        </div>
      </div>
    </div>
  ),
};

// ── Sizes ─────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Sizes',
  args: { label: '' },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['lg', 'md', 'sm'] as const).map((size) => (
        <div key={size} className="flex flex-wrap gap-2 items-center">
          {STATUS_VARIANTS.map((v) => (
            <Badge key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} size={size} />
          ))}
        </div>
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
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
            {size}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="active" icon="✅" label="Verified" size={size} />
            <Badge variant="failed" icon="⚠️" label="At risk" size={size} />
            <Badge variant="pending" icon="🔄" label="Syncing" size={size} />
            <Badge variant="ai" icon="✨" label="Generated" size={size} />
          </div>
        </div>
      ))}
    </div>
  ),
};

// ── Removable ─────────────────────────────────────────────

export const Removable: Story = {
  name: 'Removable',
  args: { label: '' },
  render: () => {
    const [pillTags, setPillTags] = useState([...STATUS_VARIANTS]);
    const [roundedTags, setRoundedTags] = useState([...STATUS_VARIANTS]);
    const reset = () => {
      setPillTags([...STATUS_VARIANTS]);
      setRoundedTags([...STATUS_VARIANTS]);
    };
    return (
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
            Pill
          </p>
          <div className="flex flex-wrap gap-2">
            {pillTags.map((v) => (
              <Badge
                key={v}
                label={v.charAt(0).toUpperCase() + v.slice(1)}
                variant={v}
                onRemove={() => setPillTags((t) => t.filter((x) => x !== v))}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
            Rounded
          </p>
          <div className="flex flex-wrap gap-2">
            {roundedTags.map((v) => (
              <Badge
                key={v}
                label={v.charAt(0).toUpperCase() + v.slice(1)}
                variant={v}
                shape="rounded"
                outlined
                dot={false}
                onRemove={() => setRoundedTags((t) => t.filter((x) => x !== v))}
              />
            ))}
          </div>
        </div>
        {pillTags.length === 0 && roundedTags.length === 0 && (
          <button
            className="text-xs text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-200 underline font-body self-start"
            onClick={reset}
          >
            Reset
          </button>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('remove buttons are present', async () => {
      expect(canvas.getAllByRole('button', { name: 'Remove' }).length).toBeGreaterThan(0);
    });
    await step('click first remove → badge count decreases', async () => {
      const before = canvas.getAllByRole('button', { name: 'Remove' }).length;
      await user.click(canvas.getAllByRole('button', { name: 'Remove' })[0]);
      await waitFor(() => {
        expect(canvas.getAllByRole('button', { name: 'Remove' }).length).toBe(before - 1);
      });
    });
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
          {(['lg', 'md', 'sm'] as const).map((size) => (
            <div key={size} className="flex flex-wrap gap-1.5 items-center">
              {ALL_VARIANTS.map((v) => (
                <Badge
                  key={v}
                  label={v.charAt(0).toUpperCase() + v.slice(1)}
                  variant={v}
                  size={size}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Without dot */}
      <div>
        <p className="text-[11px] font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider mb-2">
          Without dot
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_VARIANTS.map((v) => (
            <Badge
              key={v}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
              variant={v}
              dot={false}
            />
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
