import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Heart, Flame, ThumbsUp } from 'lucide-react';
import { RatingGroup } from '../components/RatingGroup';

const meta = {
  title: 'Forms/RatingGroup',
  component: RatingGroup,
  tags: ['autodocs'],
  argTypes: {
    count: { control: { type: 'number', min: 1, max: 10 } },
    defaultValue: { control: { type: 'number', min: 0, max: 10, step: 0.5 } },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    allowHalf: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    dir: { control: { type: 'select' }, options: ['ltr', 'rtl'] },
    label: { control: 'text' },
  },
} satisfies Meta<typeof RatingGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Sizes ─────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div className="p-6 flex flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-6 text-xs font-body text-ink-500 dark:text-ink-300 uppercase tracking-wider">
            {size}
          </span>
          <RatingGroup defaultValue={3} size={size} />
        </div>
      ))}
    </div>
  ),
};

// ── Custom icons ──────────────────────────────────────────

export const CustomIcons: Story = {
  name: 'Custom icons',
  render: () => (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-body font-medium text-ink-500 dark:text-ink-300 uppercase tracking-wider">
          Hearts
        </p>
        <RatingGroup
          defaultValue={3}
          iconEmpty={<Heart className="w-full h-full" strokeWidth={1.5} />}
          iconFull={<Heart className="w-full h-full fill-current" strokeWidth={1.5} />}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-body font-medium text-ink-500 dark:text-ink-300 uppercase tracking-wider">
          Flames
        </p>
        <RatingGroup
          defaultValue={4}
          iconEmpty={<Flame className="w-full h-full" strokeWidth={1.5} />}
          iconFull={<Flame className="w-full h-full fill-current" strokeWidth={1.5} />}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-body font-medium text-ink-500 dark:text-ink-300 uppercase tracking-wider">
          Thumbs
        </p>
        <RatingGroup
          defaultValue={2}
          count={3}
          iconEmpty={<ThumbsUp className="w-full h-full" strokeWidth={1.5} />}
          iconFull={<ThumbsUp className="w-full h-full fill-current" strokeWidth={1.5} />}
        />
      </div>
    </div>
  ),
};

// ── RTL ───────────────────────────────────────────────────

export const RTL: Story = {
  name: 'RTL',
  render: () => (
    <div className="p-6 flex flex-col gap-4">
      <RatingGroup defaultValue={3} dir="rtl" label="تقييم" allowHalf />
    </div>
  ),
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div className="p-6 flex flex-col gap-6">
      <Row label="Default">
        <RatingGroup defaultValue={3} />
      </Row>
      <Row label="Half stars">
        <RatingGroup defaultValue={3.5} allowHalf />
      </Row>
      <Row label="With label">
        <RatingGroup defaultValue={4} label="Rate us:" />
      </Row>
      <Row label="Read only">
        <RatingGroup defaultValue={3.5} allowHalf readOnly />
      </Row>
      <Row label="Disabled">
        <RatingGroup defaultValue={2} disabled />
      </Row>
      <Row label="sm">
        <RatingGroup defaultValue={3} size="sm" />
      </Row>
      <Row label="lg">
        <RatingGroup defaultValue={3} size="lg" />
      </Row>
      <Row label="Custom (♥)">
        <RatingGroup
          defaultValue={3}
          iconEmpty={<Heart className="w-full h-full" strokeWidth={1.5} />}
          iconFull={<Heart className="w-full h-full fill-current" strokeWidth={1.5} />}
        />
      </Row>
    </div>
  ),
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-32 shrink-0 text-xs font-body text-ink-500 dark:text-ink-300">
        {label}
      </span>
      {children}
    </div>
  );
}
