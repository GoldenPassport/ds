import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
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

// ── Controlled ────────────────────────────────────────────

export const Controlled: Story = {
  name: 'Controlled',
  render: () => {
    const [val, setVal] = useState(2);
    return (
      <div className="p-6 flex flex-col gap-4">
        <RatingGroup value={val} onChange={setVal} />
        <p className="text-sm font-body text-ink-500 dark:text-ink-300">
          Current value:{' '}
          <strong data-testid="rating-value" className="text-ink-900 dark:text-ink-50">
            {val}
          </strong>
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('click star "4 of 5 stars" → value becomes 4', async () => {
      await user.click(canvas.getByRole('button', { name: '4 of 5 stars' }));
      await waitFor(() => {
        expect(canvas.getByTestId('rating-value')).toHaveTextContent('4');
      });
    });

    await step('click number button "2" → value becomes 2', async () => {
      await user.click(canvas.getByRole('button', { name: '2' }));
      await waitFor(() => {
        expect(canvas.getByTestId('rating-value')).toHaveTextContent('2');
      });
    });
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

// ── Interactions ───────────────────────────────────────────
// Covers: handleMouseEnter, handleMouseMove body, handleMouseLeave,
//         onHoverChange, handleKeyDown (all arrow keys + boundary early-return),
//         click-to-clear (same star + star-1 clears when val>0)

export const Interactions: Story = {
  name: 'Interactions (hover · keyboard · clear)',
  render: () => {
    const [val, setVal] = useState(0);
    const [hover, setHover] = useState<number | null>(null);
    return (
      <div className="flex flex-col gap-3 p-6">
        <RatingGroup
          value={val}
          onChange={setVal}
          onHoverChange={setHover}
          label="Rate this"
        />
        <span data-testid="val" className="text-xs font-mono text-ink-500 dark:text-ink-300">
          {val}
        </span>
        <span data-testid="hover" className="text-xs font-mono text-ink-500 dark:text-ink-300">
          {hover ?? 'none'}
        </span>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('hover star 3 → onHoverChange(3) via handleMouseEnter', async () => {
      await user.hover(canvas.getByRole('button', { name: '3 of 5 stars' }));
      await waitFor(() => expect(canvas.getByTestId('hover')).toHaveTextContent('3'));
    });

    await step('hover star 4 → handleMouseMove body runs (v=4 ≠ hoverValue=3)', async () => {
      // mousemove fires before React re-renders so hoverValue is still 3 in the
      // closure → the guard does NOT early-return → setHover(4) + onHoverChange(4)
      await user.hover(canvas.getByRole('button', { name: '4 of 5 stars' }));
      await waitFor(() => expect(canvas.getByTestId('hover')).toHaveTextContent('4'));
    });

    await step('unhover → handleMouseLeave + onHoverChange(null)', async () => {
      await user.unhover(canvas.getByRole('button', { name: '4 of 5 stars' }));
      await waitFor(() => expect(canvas.getByTestId('hover')).toHaveTextContent('none'));
    });

    await step('click star 3 → val=3 (focus on star 3 for keyboard nav)', async () => {
      await user.click(canvas.getByRole('button', { name: '3 of 5 stars' }));
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent('3'));
    });

    await step('ArrowRight → val=4', async () => {
      await user.keyboard('{ArrowRight}');
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent('4'));
    });

    await step('ArrowUp → val=5', async () => {
      await user.keyboard('{ArrowUp}');
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent('5'));
    });

    await step('ArrowLeft → val=4', async () => {
      await user.keyboard('{ArrowLeft}');
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent('4'));
    });

    await step('ArrowDown → val=3', async () => {
      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent('3'));
    });

    await step('click same star (star 3, val=3) → clears to 0 (v === committedValue)', async () => {
      await user.click(canvas.getByRole('button', { name: '3 of 5 stars' }));
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent('0'));
    });

    await step('click star 3 → val=3, then click star 1 → clears (index===1 && val>0)', async () => {
      await user.click(canvas.getByRole('button', { name: '3 of 5 stars' }));
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent('3'));
      await user.click(canvas.getByRole('button', { name: '1 of 5 stars' }));
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent('0'));
    });

    await step('click star 5, ArrowRight at max → early return (next === committedValue)', async () => {
      await user.click(canvas.getByRole('button', { name: '5 of 5 stars' }));
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent('5'));
      // next = min(5, 5+1) = 5 = committedValue → handleKeyDown returns without onChange
      await user.keyboard('{ArrowRight}');
      expect(canvas.getByTestId('val')).toHaveTextContent('5');
    });
  },
};

// ── Uncontrolled ───────────────────────────────────────────
// Covers: !isControlled setInternal in handleClick + handleKeyDown, name prop

export const Uncontrolled: Story = {
  name: 'Uncontrolled (internal state + name prop)',
  render: () => (
    <div className="p-6">
      <RatingGroup defaultValue={0} label="Your rating" name="user-rating" />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('click star 4 → hidden input value=4 (setInternal via handleClick)', async () => {
      await user.click(canvas.getByRole('button', { name: '4 of 5 stars' }));
      const hidden = canvasElement.querySelector('input[name="user-rating"]') as HTMLInputElement;
      await waitFor(() => expect(hidden.value).toBe('4'));
    });

    await step('ArrowLeft → hidden input value=3 (setInternal via handleKeyDown)', async () => {
      await user.keyboard('{ArrowLeft}');
      const hidden = canvasElement.querySelector('input[name="user-rating"]') as HTMLInputElement;
      await waitFor(() => expect(hidden.value).toBe('3'));
    });

    await step('click star 1 with val=3 → clears to 0 (index===1 && committedValue>0)', async () => {
      await user.click(canvas.getByRole('button', { name: '1 of 5 stars' }));
      const hidden = canvasElement.querySelector('input[name="user-rating"]') as HTMLInputElement;
      await waitFor(() => expect(hidden.value).toBe('0'));
    });
  },
};

// ── Half-star interactive ──────────────────────────────────
// Covers: handleMouseEnter early return (allowHalf=true),
//         resolveValue allowHalf branch, handleKeyDown step=0.5,
//         label with index−0.5 for half-state stars

export const HalfInteractive: Story = {
  name: 'Half-star interactive',
  render: () => {
    const [val, setVal] = useState(2);
    return (
      <div className="flex flex-col gap-3 p-6">
        <RatingGroup value={val} onChange={setVal} allowHalf label="Half-step rating" />
        <span data-testid="half-val" className="text-xs font-mono text-ink-500 dark:text-ink-300">
          {val}
        </span>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('hover then unhover star 3 → handleMouseEnter early-return + resolveValue allowHalf path', async () => {
      // Capture the element reference BEFORE hovering — with allowHalf=true, userEvent
      // places the pointer in the left half of the button (relX < width/2), so
      // resolveValue returns index−0.5 = 2.5 and the button's aria-label changes to
      // "2.5 of 5 stars". We hold the reference so we can unhover it even after the
      // label has changed, then let handleMouseLeave reset hoverValue back to null.
      const star3 = canvas.getAllByRole('button')[2]; // 3rd star (0-based index)
      await user.hover(star3);
      // hoverValue is now 2.5 or 3 depending on exact pointer coords — either way
      // handleMouseEnter's `if (allowHalf) return` and resolveValue's allowHalf branch
      // have both been executed.
      await user.unhover(star3); // fires handleMouseLeave → hoverValue = null
      // Labels are now based on committedValue (2) again: star 3 → "3 of 5 stars"
      await waitFor(() =>
        expect(canvas.getByRole('button', { name: '3 of 5 stars' })).toBeInTheDocument(),
      );
    });

    await step('click star 3 → val=2.5 (resolveValue allowHalf branch executed)', async () => {
      await user.click(canvas.getByRole('button', { name: '3 of 5 stars' }));
      // Chromium's fractional bounding-rect values (e.g. width=23.5) mean the centred
      // pointer lands at relX=11.5 < width/2=11.75 → resolveValue returns index−0.5=2.5.
      // The important thing is that the allowHalf branch in resolveValue was executed.
      await waitFor(() => expect(canvas.getByTestId('half-val')).toHaveTextContent('2.5'));
    });

    await step('ArrowRight → val=3.0 (step=0.5 from allowHalf)', async () => {
      await user.keyboard('{ArrowRight}');
      await waitFor(() => expect(canvas.getByTestId('half-val')).toHaveTextContent('3'));
    });

    await step('ArrowRight → val=3.5 (step=0.5 confirms allowHalf keyboard path)', async () => {
      await user.keyboard('{ArrowRight}');
      await waitFor(() => expect(canvas.getByTestId('half-val')).toHaveTextContent('3.5'));
    });

    await step('ArrowLeft → val=3.0 (step=0.5)', async () => {
      await user.keyboard('{ArrowLeft}');
      await waitFor(() => expect(canvas.getByTestId('half-val')).toHaveTextContent('3'));
    });
  },
};

// ── Custom half icon ───────────────────────────────────────
// Covers: StarIcon iconHalf branch (state='half' with iconHalf provided)

export const CustomHalfIcon: Story = {
  name: 'Custom half icon',
  render: () => (
    <div className="p-6">
      <RatingGroup
        defaultValue={2.5}
        allowHalf
        readOnly
        iconHalf={
          <span
            className="flex w-full h-full items-center justify-center text-primary-400 text-base leading-none select-none"
            aria-hidden="true"
          >
            ½
          </span>
        }
      />
    </div>
  ),
};
