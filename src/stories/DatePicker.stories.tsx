import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { DatePicker, TimePicker, DateTimePicker, DateRangePicker } from '../components/DatePicker';
import type { DateRange } from '../components/DatePicker';

const meta = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── DatePicker ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: {
    label: 'Date',
    placeholder: 'Select a date',
    hint: '',
    error: '',
    disabled: false,
  },
  render: (args) => {
    const [val, setVal] = useState<Date | null>(null);
    return (
      <div className="max-w-xs flex flex-col gap-3">
        {/*
          Render auxiliary \"Selected\" output *above* the picker — not beneath it.
          A closed PopoverPanel still occupies its layout box (`opacity:0` + translation)
          overlapping pixels below the trigger; axe interprets overlapping elements as
          indeterminate background colour for nested text underneath.
        */}
        {val && (
          <p
            data-testid="selected-date"
            className="relative z-10 text-xs font-body text-ink-500 dark:text-ink-300"
          >
            Selected:{' '}
            <strong className="text-ink-900 dark:text-ink-50">{val.toDateString()}</strong>
          </p>
        )}
        <div className="isolate">
          <DatePicker {...args} value={val} onChange={setVal} />
        </div>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const user = userEvent.setup();

    await step('open the date picker', async () => {
      await user.click(canvas.getByRole('button', { name: /date/i }));
      await waitFor(() => expect(body.getByText('Today')).toBeVisible());
    });

    await step('navigate to next month → previous month button appears', async () => {
      await user.click(body.getByRole('button', { name: /next month/i }));
      // Previous month button was always there but now navigating confirms the calendar rendered
      await waitFor(() =>
        expect(body.getByRole('button', { name: /previous month/i })).toBeVisible(),
      );
    });

    await step('pick a day → date is selected and picker closes', async () => {
      const days = body
        .getAllByRole('button')
        .filter((b) => /^\d{1,2}$/.test(b.textContent?.trim() ?? ''));
      await user.click(days[9]); // ~10th of the month
      await waitFor(() => expect(canvas.getByTestId('selected-date')).toBeInTheDocument());
    });

    await step('clear button appears — click it → date cleared', async () => {
      await user.click(canvas.getByRole('button', { name: /clear/i }));
      await waitFor(() =>
        expect(canvas.queryByTestId('selected-date')).not.toBeInTheDocument(),
      );
    });

    await step('open again → click "Today" shortcut → today is selected', async () => {
      await user.click(canvas.getByRole('button', { name: /date/i }));
      await waitFor(() => expect(body.getByText('Today')).toBeVisible());
      await user.click(body.getByText('Today'));
      await waitFor(() => expect(canvas.getByTestId('selected-date')).toBeInTheDocument());
    });
  },
};

// ── TimePicker ─────────────────────────────────────────────

export const Time_: Story = {
  name: 'TimePicker',
  args: {
    label: 'Time',
    placeholder: 'Select a time',
    hint: '',
    error: '',
    disabled: false,
  },
  render: (args) => {
    const [val, setVal] = useState<string | null>(null);
    return (
      <div className="max-w-xs flex flex-col gap-3">
        {val && (
          <p
            data-testid="selected-time"
            className="relative z-10 text-xs font-body text-ink-500 dark:text-ink-300"
          >
            Selected: <strong className="text-ink-900 dark:text-ink-50">{val}</strong>
          </p>
        )}
        <div className="isolate">
          <TimePicker
            label={args.label}
            placeholder={args.placeholder}
            hint={args.hint}
            error={args.error}
            disabled={args.disabled}
            value={val ?? undefined}
            onChange={setVal}
          />
        </div>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const user = userEvent.setup();

    await step('open the time picker', async () => {
      await user.click(canvas.getByRole('button', { name: /time/i }));
      await waitFor(() => expect(body.getByText('HH')).toBeVisible());
    });

    await step('select hour 09 → value appears', async () => {
      const [hourBtn] = body.getAllByRole('button', { name: '09' });
      await user.click(hourBtn);
      await waitFor(() =>
        expect(canvas.getByTestId('selected-time')).toHaveTextContent('09:00'),
      );
    });

    await step('select minute 30 → value updates to 09:30', async () => {
      // Panel stays open after hour selection — '30' only exists in MM column (hours stop at 23)
      const [minBtn] = body.getAllByRole('button', { name: '30' });
      await user.click(minBtn);
      await waitFor(() =>
        expect(canvas.getByTestId('selected-time')).toHaveTextContent('09:30'),
      );
    });

    await step('click Clear → value disappears', async () => {
      await user.click(body.getByText('Clear'));
      await waitFor(() =>
        expect(canvas.queryByTestId('selected-time')).not.toBeInTheDocument(),
      );
    });
  },
};

// ── DateTimePicker ─────────────────────────────────────────

export const DateTime_: Story = {
  name: 'DateTimePicker',
  args: {
    label: 'Appointment',
    placeholder: 'Select date & time',
    hint: '',
    error: '',
    disabled: false,
  },
  render: (args) => {
    const [val, setVal] = useState<{ date: Date; hour: number; minute: number } | null>(null);
    return (
      <div className="max-w-xs flex flex-col gap-3">
        {val && (
          <p
            data-testid="datetime-value"
            className="relative z-10 text-xs font-body text-ink-500 dark:text-ink-300"
          >
            Selected:{' '}
            <strong className="text-ink-900 dark:text-ink-50">
              {val.date.toDateString()} {String(val.hour).padStart(2, '0')}:
              {String(val.minute).padStart(2, '0')}
            </strong>
          </p>
        )}
        <div className="isolate">
          <DateTimePicker
            label={args.label}
            placeholder={args.placeholder}
            hint={args.hint}
            error={args.error}
            disabled={args.disabled}
            value={val}
            onChange={setVal}
          />
        </div>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const user = userEvent.setup();

    await step('open the datetime picker', async () => {
      await user.click(canvas.getByRole('button', { name: /appointment/i }));
      await waitFor(() => expect(body.getByRole('radio', { name: /time/i })).toBeVisible());
    });

    await step('switch to Time tab', async () => {
      await user.click(body.getByRole('radio', { name: /time/i }));
      await waitFor(() => expect(body.getByText('HH')).toBeVisible());
    });

    await step('select hour 10 → value appears', async () => {
      const [hourBtn] = body.getAllByRole('button', { name: '10' });
      await user.click(hourBtn);
      await waitFor(() =>
        expect(canvas.getByTestId('datetime-value')).toHaveTextContent('10:00'),
      );
    });

    await step('select minute 30 → value shows :30', async () => {
      // Panel stays open — '30' only exists in MM column
      const [minBtn] = body.getAllByRole('button', { name: '30' });
      await user.click(minBtn);
      await waitFor(() =>
        expect(canvas.getByTestId('datetime-value')).toHaveTextContent(':30'),
      );
    });

    await step('switch to Date tab → pick a day → auto-switches back to Time', async () => {
      await user.click(body.getByRole('radio', { name: /date/i }));
      const days = body
        .getAllByRole('button')
        .filter((b) => /^\d{1,2}$/.test(b.textContent?.trim() ?? ''));
      await user.click(days[4]);
      // onSelect calls setTab('time') automatically
      await waitFor(() => expect(body.getByText('HH')).toBeVisible());
    });

    await step('click Now → value refreshed to current time', async () => {
      await user.click(body.getByText('Now'));
      await waitFor(() =>
        expect(canvas.getByTestId('datetime-value')).toBeInTheDocument(),
      );
    });

    await step('click Clear → value disappears and panel closes', async () => {
      await user.click(body.getByText('Clear'));
      await waitFor(() =>
        expect(canvas.queryByTestId('datetime-value')).not.toBeInTheDocument(),
      );
    });
  },
};

// ── DateRangePicker ───────────────────────────────────────

export const RangePicker: Story = {
  name: 'Date range picker',
  args: { label: '', placeholder: '' },
  render: () => {
    const [range, setRange] = useState<DateRange>({ start: null, end: null });
    return (
      <div className="max-w-sm flex flex-col gap-3">
        {(range.start || range.end) && (
          <p
            data-testid="range-value"
            className="relative z-10 text-xs font-body text-ink-500 dark:text-ink-300"
          >
            {range.start && (
              <>
                From:{' '}
                <strong className="text-ink-900 dark:text-ink-50">
                  {range.start.toDateString()}
                </strong>
              </>
            )}
            {range.start && range.end && <span className="mx-1" aria-hidden="true">→</span>}
            {range.end && (
              <>
                To:{' '}
                <strong className="text-ink-900 dark:text-ink-50">{range.end.toDateString()}</strong>
              </>
            )}
          </p>
        )}
        <div className="isolate">
          <DateRangePicker
            label="Trip dates"
            startLabel="Check-in"
            endLabel="Check-out"
            startPlaceholder="Add date"
            endPlaceholder="Add date"
            value={range}
            onChange={setRange}
          />
        </div>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const user = userEvent.setup();

    await step('open the range picker', async () => {
      await user.click(canvas.getByRole('button'));
      await waitFor(() => expect(body.getByText('Select start date')).toBeVisible());
    });

    await step('pick a start date', async () => {
      // Calendar day buttons have numeric text content
      const days = body
        .getAllByRole('button')
        .filter((b) => /^\d{1,2}$/.test(b.textContent?.trim() ?? ''));
      await user.click(days[14]); // ~15th of the current month
      await waitFor(() => expect(canvas.getByTestId('range-value')).toBeInTheDocument());
    });

    await step('panel advances to end-date phase', async () => {
      await waitFor(() => expect(body.getByText('Select end date')).toBeVisible());
    });

    await step('pick an end date', async () => {
      const days = body
        .getAllByRole('button')
        .filter((b) => /^\d{1,2}$/.test(b.textContent?.trim() ?? ''));
      await user.click(days[19]); // ~20th of the current month
      await waitFor(() =>
        expect(canvas.getByTestId('range-value')).toHaveTextContent('→'),
      );
    });

    await step('Done button → closes the panel', async () => {
      // Both dates are set so the Done link is now visible
      await user.click(body.getByText('Done'));
      await waitFor(() =>
        expect(body.queryByText('Select start date')).not.toBeInTheDocument(),
      );
    });

    await step('reopen → pick start → pick earlier end → swap branch fires', async () => {
      await user.click(canvas.getByRole('button'));
      await waitFor(() => expect(body.getByText('Select start date')).toBeVisible());
      const days1 = body
        .getAllByRole('button')
        .filter((b) => /^\d{1,2}$/.test(b.textContent?.trim() ?? ''));
      await user.click(days1[9]); // ~10th as new start
      await waitFor(() => expect(body.getByText('Select end date')).toBeVisible());
      const days2 = body
        .getAllByRole('button')
        .filter((b) => /^\d{1,2}$/.test(b.textContent?.trim() ?? ''));
      await user.click(days2[4]); // ~5th < 10th → swap: commit(5th, 10th)
      await waitFor(() =>
        expect(canvas.getByTestId('range-value')).toHaveTextContent('→'),
      );
    });

    await step('Clear in panel → range cleared', async () => {
      // Panel is still open (handleDayClick does not close on phase=end pick)
      await user.click(body.getByText('Clear'));
      await waitFor(() =>
        expect(canvas.queryByTestId('range-value')).not.toBeInTheDocument(),
      );
    });
  },
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  args: { label: '', placeholder: '' },
  render: () => (
    <div className="flex flex-col gap-6 max-w-xs">
      <DatePicker label="Date" placeholder="Select a date" />
      <TimePicker label="Time" placeholder="Select a time" />
      <DateTimePicker label="Date & Time" placeholder="Select date & time" />
      <DateRangePicker label="Date range" />
      <DatePicker label="With hint" placeholder="Select date" hint="Used for scheduling" />
      <DatePicker label="With error" placeholder="Select date" error="Required field" />
    </div>
  ),
};

// ── With name prop (hidden inputs) ────────────────────────

export const WithNameProp: Story = {
  name: 'With name prop (hidden inputs)',
  args: { label: '', placeholder: '' },
  render: () => (
    <div className="flex flex-col gap-6 max-w-xs">
      <DatePicker label="Date" name="appt-date" placeholder="Select date" />
      <TimePicker label="Time" name="appt-time" placeholder="Select time" />
      <DateTimePicker label="Date & time" name="appt-dt" placeholder="Select date & time" />
    </div>
  ),
};

// ── Uncontrolled interactions ─────────────────────────────

export const UncontrolledInteractions: Story = {
  name: 'Uncontrolled interactions',
  args: { label: '', placeholder: '' },
  render: () => (
    <div className="flex flex-col gap-6 max-w-xs">
      <DatePicker label="Date" />
      <TimePicker label="Time" />
      <DateTimePicker label="DateTime" />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const user = userEvent.setup();

    await step('uncontrolled DatePicker: Today → internal state → clear via X button', async () => {
      // aria-labelledby gives the button the accessible name "Date" — use that directly
      // so stale calendar nav buttons left over from a previous transition never match
      await user.click(canvas.getByRole('button', { name: /^date$/i }));
      await waitFor(() => expect(body.getByText('Today')).toBeVisible());
      await user.click(body.getByText('Today'));
      // close() is called → panel starts leave transition (100 ms in real Chromium)
      // Wait until the panel is fully unmounted so its calendar buttons are gone
      await waitFor(() => expect(body.queryByText('Today')).not.toBeInTheDocument());
      // Internal state now holds the date → X clear button appears
      await waitFor(() =>
        expect(canvas.getByRole('button', { name: /clear/i })).toBeInTheDocument(),
      );
      await user.click(canvas.getByRole('button', { name: /clear/i }));
    });

    await step('uncontrolled TimePicker: hour 08 → minute 45 → clear from panel', async () => {
      // Use the accessible name ("Time") rather than an array index — robust even if a
      // previous panel's buttons are still leaving the DOM during a CSS transition
      await user.click(canvas.getByRole('button', { name: /^time$/i }));
      await waitFor(() => expect(body.getByText('HH')).toBeVisible());
      const [hourBtn] = body.getAllByRole('button', { name: '08' });
      await user.click(hourBtn);
      // '45' only exists in MM column (hours stop at 23)
      const [minBtn] = body.getAllByRole('button', { name: '45' });
      await user.click(minBtn);
      await user.click(body.getByText('Clear'));
      // TimePicker's Clear link does not call close() — press Escape to close
      await user.keyboard('{Escape}');
      // Wait for panel to fully unmount so its 'HH' label is gone
      await waitFor(() => expect(body.queryByText('HH')).not.toBeInTheDocument());
    });

    await step('uncontrolled DateTimePicker: Time tab → hour 09 → minute 45 → Date tab → day → Clear', async () => {
      // By now the TimePicker panel has fully left; 'HH' is absent from the DOM
      await user.click(canvas.getByRole('button', { name: /^datetime$/i }));
      await waitFor(() => expect(body.getByRole('radio', { name: /time/i })).toBeVisible());
      await user.click(body.getByRole('radio', { name: /time/i }));
      await waitFor(() => expect(body.getByText('HH')).toBeVisible());
      const [hourBtn] = body.getAllByRole('button', { name: '09' });
      await user.click(hourBtn);
      // '45' only exists in MM column
      const [minBtn] = body.getAllByRole('button', { name: '45' });
      await user.click(minBtn);
      // Switch to Date tab and pick a day → onSelect calls setTab('time') automatically
      await user.click(body.getByRole('radio', { name: /date/i }));
      const days = body
        .getAllByRole('button')
        .filter((b) => /^\d{1,2}$/.test(b.textContent?.trim() ?? ''));
      await user.click(days[4]);
      // Auto-switched back to Time tab
      await waitFor(() => expect(body.getByText('HH')).toBeVisible());
      // DateTimePicker's Clear calls close() so panel exits
      await user.click(body.getByText('Clear'));
      await waitFor(() =>
        expect(body.queryByText('HH')).not.toBeInTheDocument(),
      );
    });
  },
};

