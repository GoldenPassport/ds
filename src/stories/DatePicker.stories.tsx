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
    label:       { control: 'text' },
    placeholder: { control: 'text' },
    hint:        { control: 'text' },
    error:       { control: 'text' },
    disabled:    { control: 'boolean' },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── DatePicker ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'DatePicker',
  args: {
    label:       'Date',
    placeholder: 'Select a date',
    hint:        '',
    error:       '',
    disabled:    false,
  },
  render: (args) => {
    const [val, setVal] = useState<Date | null>(null);
    return (
      <div className="max-w-xs flex flex-col gap-3">
        <DatePicker {...args} value={val} onChange={setVal} />
        {val && (
          <p className="text-xs font-body text-ink-500 dark:text-ink-300">
            Selected: <strong className="text-ink-900 dark:text-ink-50">{val.toDateString()}</strong>
          </p>
        )}
      </div>
    );
  },
};

export const DateWithHint: Story = {
  name: 'DatePicker — with hint',
  args: { label: '', placeholder: '' },
  render: () => (
    <div className="max-w-xs">
      <DatePicker
        label="Passport expiry"
        placeholder="dd/mm/yyyy"
        hint="Must be valid for at least 6 months"
      />
    </div>
  ),
};

export const DateWithError: Story = {
  name: 'DatePicker — with error',
  args: { label: '', placeholder: '' },
  render: () => (
    <div className="max-w-xs">
      <DatePicker
        label="Date of birth"
        placeholder="Select date"
        error="Date is required"
      />
    </div>
  ),
};

// ── TimePicker ─────────────────────────────────────────────

export const Time_: Story = {
  name: 'TimePicker',
  args: {
    label:       'Time',
    placeholder: 'Select a time',
    hint:        '',
    error:       '',
    disabled:    false,
  },
  render: (args) => {
    const [val, setVal] = useState<string | null>(null);
    return (
      <div className="max-w-xs flex flex-col gap-3">
        <TimePicker
          label={args.label}
          placeholder={args.placeholder}
          hint={args.hint}
          error={args.error}
          disabled={args.disabled}
          value={val ?? undefined}
          onChange={setVal}
        />
        {val && (
          <p className="text-xs font-body text-ink-500 dark:text-ink-300">
            Selected: <strong className="text-ink-900 dark:text-ink-50">{val}</strong>
          </p>
        )}
      </div>
    );
  },
};

// ── DateTimePicker ─────────────────────────────────────────

export const DateTime_: Story = {
  name: 'DateTimePicker',
  args: {
    label:       'Appointment',
    placeholder: 'Select date & time',
    hint:        '',
    error:       '',
    disabled:    false,
  },
  render: (args) => {
    const [val, setVal] = useState<{ date: Date; hour: number; minute: number } | null>(null);
    return (
      <div className="max-w-xs flex flex-col gap-3">
        <DateTimePicker
          label={args.label}
          placeholder={args.placeholder}
          hint={args.hint}
          error={args.error}
          disabled={args.disabled}
          value={val}
          onChange={setVal}
        />
        {val && (
          <p className="text-xs font-body text-ink-500 dark:text-ink-300">
            Selected: <strong className="text-ink-900 dark:text-ink-50">
              {val.date.toDateString()} {String(val.hour).padStart(2,'0')}:{String(val.minute).padStart(2,'0')}
            </strong>
          </p>
        )}
      </div>
    );
  },
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  args: { label: '', placeholder: '' },
  render: () => (
    <div className="flex flex-col gap-6 max-w-xs">
      <DatePicker     label="Date"        placeholder="Select a date" />
      <TimePicker       label="Time"        placeholder="Select a time" />
      <DateTimePicker   label="Date & Time" placeholder="Select date & time" />
      <DateRangePicker  label="Date range" />
      <DatePicker       label="With hint"   placeholder="Select date" hint="Used for scheduling" />
      <DatePicker       label="With error"  placeholder="Select date" error="Required field" />
    </div>
  ),
};

// ── DateRangePicker ───────────────────────────────────────

export const RangePicker: Story = {
  name: 'Date range picker',
  args: { label: '', placeholder: '' },
  render: () => {
    const [range, setRange] = useState<DateRange>({ start: null, end: null });
    return (
      <div className="max-w-sm flex flex-col gap-3">
        <DateRangePicker
          label="Trip dates"
          startLabel="Check-in"
          endLabel="Check-out"
          startPlaceholder="Add date"
          endPlaceholder="Add date"
          value={range}
          onChange={setRange}
        />
        {(range.start || range.end) && (
          <p className="text-xs font-body text-ink-500 dark:text-ink-400">
            {range.start && <>From: <strong className="text-ink-900 dark:text-ink-50">{range.start.toDateString()}</strong></>}
            {range.start && range.end && <span className="mx-1">→</span>}
            {range.end && <>To: <strong className="text-ink-900 dark:text-ink-50">{range.end.toDateString()}</strong></>}
          </p>
        )}
      </div>
    );
  },
};

// ── Interactions ──────────────────────────────────────────

export const DatePickerInteraction: Story = {
  name: 'DatePicker — interactions',
  args: { label: '', placeholder: '' },
  render: () => {
    const [val, setVal] = useState<Date | null>(null);
    return (
      <div className="max-w-xs flex flex-col gap-3">
        <DatePicker
          label="Start date"
          placeholder="Select date"
          hint="Pick a date"
          value={val}
          onChange={setVal}
        />
        {val && (
          <p data-testid="selected-date" className="text-xs font-body text-ink-500">
            Selected: {val.toDateString()}
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('click trigger → calendar opens', async () => {
      // The main trigger is the first (and only) button before any value is set
      await user.click(canvas.getAllByRole('button')[0]);
      // Panel is inline — "Today" link in footer confirms it's open
      await waitFor(() => {
        expect(canvas.getByRole('link', { name: /today/i })).toBeInTheDocument();
      });
    });

    await step('click "Today" link → date is set and calendar closes', async () => {
      await user.click(canvas.getByRole('link', { name: /today/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('selected-date')).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(canvas.queryByRole('link', { name: /today/i })).not.toBeInTheDocument();
      });
    });

    await step('click trigger again → calendar re-opens', async () => {
      // After a value is set there are two buttons: trigger + Clear. First is trigger.
      await user.click(canvas.getAllByRole('button')[0]);
      await waitFor(() => {
        expect(canvas.getByRole('link', { name: /today/i })).toBeInTheDocument();
      });
    });

    await step('click "Clear" link → value resets', async () => {
      // Both "Clear" links are present (panel footer + aria Clear button) — use link
      await user.click(canvas.getAllByRole('link', { name: /clear/i })[0]);
      await waitFor(() => {
        expect(canvas.queryByTestId('selected-date')).not.toBeInTheDocument();
      });
    });
  },
};

export const TimePickerInteraction: Story = {
  name: 'TimePicker — interactions',
  args: { label: '', placeholder: '' },
  render: () => {
    const [val, setVal] = useState<string | null>(null);
    return (
      <div className="max-w-xs flex flex-col gap-3">
        <TimePicker
          label="Time"
          placeholder="Select time"
          value={val ?? undefined}
          onChange={setVal}
        />
        {val && (
          <p data-testid="selected-time" className="text-xs font-body text-ink-500">
            Selected: {val}
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('click trigger → time panel opens', async () => {
      await user.click(canvas.getAllByRole('button')[0]);
      // "Clear" link in the panel footer confirms it's open
      await waitFor(() => {
        expect(canvas.getByRole('link', { name: /clear/i })).toBeInTheDocument();
      });
    });

    await step('click hour "09" button → time value is set', async () => {
      // Both HH and MM columns have "09" — take the first (hours)
      const hour9 = canvas.getAllByRole('button', { name: '09' })[0];
      await user.click(hour9);
      await waitFor(() => {
        expect(canvas.getByTestId('selected-time')).toBeInTheDocument();
      });
    });

    await step('click "Clear" link → time resets', async () => {
      await user.click(canvas.getByRole('link', { name: /clear/i }));
      await waitFor(() => {
        expect(canvas.queryByTestId('selected-time')).not.toBeInTheDocument();
      });
    });
  },
};

export const RangePickerUncontrolled: Story = {
  name: 'Date range — uncontrolled',
  args: { label: '', placeholder: '' },
  render: () => (
    <div className="max-w-sm">
      <DateRangePicker label="Select period" hint="Click to pick a start then end date" />
    </div>
  ),
};
