import React, { useState } from 'react';
import { Eye, EyeOff, Search as SearchIcon, Mail, User, Lock, Globe } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/Input';
import { DatePicker, TimePicker, DateTimePicker } from '../components/DatePicker';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type:     { control: 'select', options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'datetime-local', 'time', 'color'], description: 'HTML input type' },
    label:    { control: 'text' },
    hint:     { control: 'text' },
    error:    { control: 'text' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    type:        'text',
    label:       'Workflow Name',
    placeholder: 'e.g. Invoice Approval Flow',
    hint:        'Used in reports and audit logs',
  },
};

// ── With icon ─────────────────────────────────────────────

export const WithIcon: Story = {
  name: 'With icon',
  render: () => (
    <div className="flex flex-col gap-4 p-4 max-w-sm">
      <Input label="Search"   placeholder="Search…"          icon={<SearchIcon className="w-4 h-4" />} />
      <Input label="Email"    placeholder="you@example.com"  icon={<Mail   className="w-4 h-4" />} type="email" />
      <Input label="Username" placeholder="@handle"          icon={<User   className="w-4 h-4" />} />
      <Input label="Password" placeholder="••••••••"         icon={<Lock   className="w-4 h-4" />} type="password" />
      <Input label="Website"  placeholder="https://…"        icon={<Globe  className="w-4 h-4" />} type="url" />
    </div>
  ),
};

// ── Text ──────────────────────────────────────────────────

export const Text: Story = {
  name: 'Type — text',
  args: {
    type:        'text',
    label:       'Full name',
    placeholder: 'Alex Morgan',
    hint:        'As it appears on your account',
  },
};

// ── Email ─────────────────────────────────────────────────

export const Email: Story = {
  name: 'Type — email',
  args: {
    type:        'email',
    label:       'Email address',
    placeholder: 'alex@company.com',
    hint:        "We'll send notifications here",
    autoComplete: 'email',
  },
};

// ── Password ──────────────────────────────────────────────

export const Password: Story = {
  name: 'Type — password',
  args: {},
  render: () => {
    const [show, setShow] = React.useState(false);
    return (
      <div className="max-w-sm">
        <Input
          type={show ? 'text' : 'password'}
          label="Password"
          placeholder="Enter your password"
          hint="At least 8 characters"
          autoComplete="current-password"
          rightAction={
            <button
              type="button"
              onClick={() => setShow(v => !v)}
              aria-label={show ? 'Hide password' : 'Show password'}
              className="text-ink-400 hover:text-ink-600 dark:hover:text-ink-300 transition-colors p-1"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />
      </div>
    );
  },
};

// ── Number ────────────────────────────────────────────────

export const NumberInput: Story = {
  name: 'Type — number',
  args: {
    type:        'number',
    label:       'Retry attempts',
    placeholder: '3',
    min:         0,
    max:         10,
    step:        1,
    hint:        'Max retries before the step is marked as failed',
  },
};

// ── Tel ───────────────────────────────────────────────────

export const Tel: Story = {
  name: 'Type — tel',
  args: {
    type:        'tel',
    label:       'Phone number',
    placeholder: '+1 (555) 000-0000',
    autoComplete: 'tel',
    hint:        'Used for SMS alerts',
  },
};

// ── URL ───────────────────────────────────────────────────

export const Url: Story = {
  name: 'Type — url',
  args: {
    type:        'url',
    label:       'Webhook URL',
    placeholder: 'https://hooks.example.com/workflow',
    hint:        'POST requests are sent here on each run',
  },
};

// ── Search ────────────────────────────────────────────────

export const Search: Story = {
  name: 'Type — search',
  args: {
    type:        'search',
    placeholder: 'Search workflows…',
  },
};

// ── Date ──────────────────────────────────────────────────

export const DateInput: Story = {
  name: 'Type — date',
  render: () => {
    const [val, setVal] = useState<Date | null>(null);
    return (
      <div className="max-w-xs">
        <DatePicker
          label="Start date"
          placeholder="Select date"
          hint="Workflow goes live on this date"
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

// ── Datetime-local ────────────────────────────────────────

export const DatetimeLocal: Story = {
  name: 'Type — datetime-local',
  render: () => {
    const [val, setVal] = useState<{ date: Date; hour: number; minute: number } | null>(null);
    return (
      <div className="max-w-xs">
        <DateTimePicker
          label="Scheduled run"
          placeholder="Select date & time"
          hint="Runs once at this exact time"
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

// ── Time ──────────────────────────────────────────────────

export const TimeInput: Story = {
  name: 'Type — time',
  render: () => {
    const [val, setVal] = useState<string | null>(null);
    return (
      <div className="max-w-xs">
        <TimePicker
          label="Daily digest time"
          placeholder="Select time"
          hint="Summary email is sent at this time each day"
          value={val ?? undefined}
          onChange={setVal}
        />
      </div>
    );
  },
};

// ── States ────────────────────────────────────────────────

export const WithError: Story = {
  args: {
    type:        'email',
    label:       'Email address',
    defaultValue: 'not-an-email',
    error:       'Enter a valid email address',
  },
};

export const Disabled: Story = {
  args: {
    type:         'text',
    label:        'Organisation ID',
    defaultValue: 'org_gp_7f3a2b1c',
    disabled:     true,
    hint:         'Set at account creation — contact support to change',
  },
};

// ── All types ─────────────────────────────────────────────

export const AllTypes: Story = {
  name: 'All types',
  render: () => (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5 max-w-2xl">
      <Input type="text"     label="Text"     placeholder="Alex Morgan" />
      <Input type="email"    label="Email"    placeholder="alex@company.com" />
      <Input type="password" label="Password" placeholder="••••••••" />
      <Input type="number"   label="Number"   placeholder="42" min={0} />
      <Input type="tel"      label="Tel"      placeholder="+1 (555) 000-0000" />
      <Input type="url"      label="URL"      placeholder="https://example.com" />
      <Input type="search"   label="Search"   placeholder="Search…" />
      <DatePicker     label="Date"          placeholder="Select date" />
      <DateTimePicker label="Datetime"      placeholder="Select date & time" />
      <TimePicker     label="Time"          placeholder="Select time" />
    </div>
  ),
};
