import React from 'react';
import {
  Eye,
  EyeOff,
  Search as SearchIcon,
  Mail,
  User,
  Lock,
  Globe,
} from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/Input';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: [
        'text',
        'email',
        'password',
        'number',
        'tel',
        'url',
        'search',
        'date',
        'datetime-local',
        'time',
        'color',
      ],
      description: 'HTML input type',
    },
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    validate: {
      control: 'radio',
      options: [undefined, 'onBlur', 'onSubmit', 'both'],
      description:
        'When to trigger HTML5 constraint validation. Requires native HTML attributes like `required`, `pattern`, `type="email"` etc.',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    type: 'text',
    label: 'Workflow Name',
    placeholder: 'e.g. Invoice Approval Flow',
    hint: 'Used in reports and audit logs',
  },
};

// ── With icon ─────────────────────────────────────────────

export const WithIcon: Story = {
  name: 'With icon',
  render: () => (
    <div className="flex flex-col gap-4 p-4 max-w-sm">
      <Input label="Search" placeholder="Search…" icon={<SearchIcon className="w-4 h-4" />} />
      <Input
        label="Email"
        placeholder="you@example.com"
        icon={<Mail className="w-4 h-4" />}
        type="email"
      />
      <Input label="Username" placeholder="@handle" icon={<User className="w-4 h-4" />} />
      <Input
        label="Password"
        placeholder="••••••••"
        icon={<Lock className="w-4 h-4" />}
        type="password"
      />
      <Input
        label="Website"
        placeholder="https://…"
        icon={<Globe className="w-4 h-4" />}
        type="url"
      />
    </div>
  ),
};

// ── Text ──────────────────────────────────────────────────

export const Text: Story = {
  name: 'Type — text',
  args: {
    type: 'text',
    label: 'Full name',
    placeholder: 'Alex Morgan',
    hint: 'As it appears on your account',
  },
};

// ── Email ─────────────────────────────────────────────────

export const Email: Story = {
  name: 'Type — email',
  args: {
    type: 'email',
    label: 'Email address',
    placeholder: 'alex@company.com',
    hint: "We'll send notifications here",
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
              onClick={() => setShow((v) => !v)}
              aria-label={show ? 'Hide password' : 'Show password'}
              className="text-ink-500 dark:text-ink-300 hover:text-ink-600 dark:hover:text-ink-200 transition-colors p-1"
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
    type: 'number',
    label: 'Retry attempts',
    placeholder: '3',
    min: 0,
    max: 10,
    step: 1,
    hint: 'Max retries before the step is marked as failed',
  },
};

// ── Tel ───────────────────────────────────────────────────

export const Tel: Story = {
  name: 'Type — tel',
  args: {
    type: 'tel',
    label: 'Phone number',
    placeholder: '+1 (555) 000-0000',
    autoComplete: 'tel',
    hint: 'Used for SMS alerts',
  },
};

// ── URL ───────────────────────────────────────────────────

export const Url: Story = {
  name: 'Type — url',
  args: {
    type: 'url',
    label: 'Webhook URL',
    placeholder: 'https://hooks.example.com/workflow',
    hint: 'POST requests are sent here on each run',
  },
};

// ── Search ────────────────────────────────────────────────

export const Search: Story = {
  name: 'Type — search',
  args: {
    type: 'search',
    placeholder: 'Search workflows…',
  },
};
