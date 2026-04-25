import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker, TimePicker, DateTimePicker } from '../components/DatePicker';

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
          <p className="text-xs font-body text-ink-500 dark:text-ink-400">
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
          <p className="text-xs font-body text-ink-500 dark:text-ink-400">
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
          <p className="text-xs font-body text-ink-500 dark:text-ink-400">
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
      <TimePicker     label="Time"        placeholder="Select a time" />
      <DateTimePicker label="Date & Time" placeholder="Select date & time" />
      <DatePicker     label="With hint"   placeholder="Select date" hint="Used for scheduling" />
      <DatePicker     label="With error"  placeholder="Select date" error="Required field" />
    </div>
  ),
};
