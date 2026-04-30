import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
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

// ── Playground ─────────────────────────────────────────────

export const Playground: Story = {
  args: {
    count: 5,
    defaultValue: 3,
    size: 'md',
    allowHalf: false,
    readOnly: false,
    disabled: false,
  },
};

// ── Basic ──────────────────────────────────────────────────

export const Basic: Story = {
  name: 'Basic',
  args: { defaultValue: 3 },
  render: (args) => (
    <div className="p-6">
      <RatingGroup {...args} />
    </div>
  ),
};

// ── Controlled ────────────────────────────────────────────

export const Controlled: Story = {
  name: 'Controlled',
  render: () => {
    const [val, setVal] = useState(2);
    return (
      <div className="p-6 flex flex-col gap-4">
        <RatingGroup value={val} onChange={setVal} />
        <p className="text-sm font-body text-ink-500 dark:text-ink-300">
          Current value: <strong className="text-ink-900 dark:text-ink-50">{val}</strong>
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setVal(n)}
              className="px-3 py-1 rounded-lg text-sm font-body border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

// ── Half stars ────────────────────────────────────────────

export const HalfStars: Story = {
  name: 'Half stars',
  render: () => {
    const [val, setVal] = useState(2.5);
    return (
      <div className="p-6 flex flex-col gap-3">
        <RatingGroup value={val} onChange={setVal} allowHalf />
        <p className="text-sm font-body text-ink-500 dark:text-ink-300">
          Rating: <strong className="text-ink-900 dark:text-ink-50">{val}</strong>
        </p>
      </div>
    );
  },
};

// ── With label ────────────────────────────────────────────

export const WithLabel: Story = {
  name: 'With label',
  args: { defaultValue: 4, label: 'Rate your experience' },
  render: (args) => (
    <div className="p-6">
      <RatingGroup {...args} />
    </div>
  ),
};

// ── Read only ─────────────────────────────────────────────

export const ReadOnly: Story = {
  name: 'Read only',
  args: { defaultValue: 3.5, allowHalf: true, readOnly: true, label: 'Average rating' },
  render: (args) => (
    <div className="p-6">
      <RatingGroup {...args} />
    </div>
  ),
};

// ── Disabled ──────────────────────────────────────────────

export const Disabled: Story = {
  name: 'Disabled',
  args: { defaultValue: 2, disabled: true },
  render: (args) => (
    <div className="p-6">
      <RatingGroup {...args} />
    </div>
  ),
};

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

// ── Interactions ──────────────────────────────────────────

export const Interactions: Story = {
  name: 'Interactions',
  render: () => {
    const [val, setVal] = useState(0);
    return (
      <div className="p-6 flex flex-col gap-4">
        <RatingGroup value={val} onChange={setVal} />
        <p className="text-sm font-body text-ink-500 dark:text-ink-300" data-testid="rating-value">
          Value: <strong>{val}</strong>
        </p>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('click star 3 → value becomes 3', async () => {
      const star3 = canvas.getByRole('button', { name: /3 of 5 stars/i });
      await user.click(star3);
      await waitFor(() => {
        expect(canvas.getByTestId('rating-value')).toHaveTextContent('3');
      });
    });

    await step('click star 3 again → clears (returns to 0)', async () => {
      const star3 = canvas.getByRole('button', { name: /3 of 5 stars/i });
      await user.click(star3);
      await waitFor(() => {
        expect(canvas.getByTestId('rating-value')).toHaveTextContent('0');
      });
    });

    await step('keyboard ArrowRight increments value', async () => {
      const star1 = canvas.getByRole('button', { name: /1 of 5 stars/i });
      await user.click(star1);
      // wait for value = 1
      await waitFor(() => {
        expect(canvas.getByTestId('rating-value')).toHaveTextContent('1');
      });
      // Focus the group and press ArrowRight
      const group = canvasElement.querySelector('[role="group"]') as HTMLElement;
      group?.focus();
      await user.keyboard('{ArrowRight}');
      await waitFor(() => {
        expect(canvas.getByTestId('rating-value')).toHaveTextContent('2');
      });
    });

    await step('keyboard ArrowLeft decrements value', async () => {
      const group = canvasElement.querySelector('[role="group"]') as HTMLElement;
      group?.focus();
      await user.keyboard('{ArrowLeft}');
      await waitFor(() => {
        expect(canvas.getByTestId('rating-value')).toHaveTextContent('1');
      });
    });
  },
};

export const HoverInteraction: Story = {
  name: 'Hover interaction',
  render: () => {
    const [val, setVal] = useState(2);
    const [hover, setHover] = useState<number | null>(null);
    return (
      <div className="p-6 flex flex-col gap-4">
        <RatingGroup value={val} onChange={setVal} onHoverChange={setHover} />
        <p data-testid="hover-value" className="text-sm font-body text-ink-500">
          Hover: <strong>{hover ?? 'none'}</strong>
        </p>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('hover over star 4 → hover state shows 4', async () => {
      const star4 = canvas.getByRole('button', { name: /4 of 5 stars/i });
      await user.hover(star4);
      await waitFor(() => {
        expect(canvas.getByTestId('hover-value')).toHaveTextContent('4');
      });
    });

    await step('mouse leave → hover resets', async () => {
      await user.unhover(canvas.getByRole('button', { name: /4 of 5 stars/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('hover-value')).toHaveTextContent('none');
      });
    });
  },
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
