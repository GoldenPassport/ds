import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/Input';
import { DatePicker, TimePicker, DateTimePicker } from '../components/DatePicker';

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

// ── Addons ────────────────────────────────────────────────

export const Addons: Story = {
  name: 'Addons',
  render: () => {
    const [url, setUrl] = useState('');
    const [amount, setAmount] = useState('');
    const [username, setUsername] = useState('');
    const [domain, setDomain] = useState('');
    const [price, setPrice] = useState('');
    return (
      <div className="flex flex-col gap-5 max-w-sm">
        {/* Leading text */}
        <Input
          label="Website"
          placeholder="yourcompany.com"
          leadingAddon="https://"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {/* Trailing text */}
        <Input
          label="Amount"
          type="number"
          placeholder="0.00"
          trailingAddon="USD"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Leading + trailing */}
        <Input
          label="Price"
          type="number"
          placeholder="0.00"
          leadingAddon="$"
          trailingAddon="USD"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* Leading text */}
        <Input
          label="Username"
          placeholder="handle"
          leadingAddon="@"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Trailing text */}
        <Input
          label="Subdomain"
          placeholder="myapp"
          trailingAddon=".goldenpassport.app"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
      </div>
    );
  },
};

// ── Corner hint ───────────────────────────────────────────

export const CornerHints: Story = {
  name: 'Corner hints',
  render: () => {
    const MAX = 140;
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    return (
      <div className="flex flex-col gap-5 max-w-sm">
        {/* Static hint */}
        <Input
          label="Email"
          type="email"
          placeholder="alex@example.com"
          cornerHint="Optional"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Dynamic character count */}
        <Input
          label="Bio"
          placeholder="Tell us about yourself…"
          cornerHint={`${bio.length} / ${MAX}`}
          maxLength={MAX}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
    );
  },
};

// ── Addon + icon combo ────────────────────────────────────

export const AddonWithIcon: Story = {
  name: 'Addon + icon',
  render: () => {
    const [val, setVal] = useState('');
    return (
      <div className="flex flex-col gap-5 max-w-sm">
        <Input
          label="Website"
          placeholder="yourcompany.com"
          leadingAddon="https://"
          icon={<Globe className="w-4 h-4" />}
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
      </div>
    );
  },
};

// ── Addon error state ─────────────────────────────────────

export const AddonWithError: Story = {
  name: 'Addon — error state',
  render: () => (
    <div className="flex flex-col gap-5 max-w-sm">
      <Input
        label="Subdomain"
        placeholder="myapp"
        trailingAddon=".goldenpassport.app"
        defaultValue="my app"
        error="Subdomain can only contain lowercase letters, numbers and hyphens"
      />
      <Input
        label="Amount"
        type="number"
        placeholder="0.00"
        leadingAddon="$"
        trailingAddon="USD"
        defaultValue="-5"
        error="Amount must be greater than 0"
      />
    </div>
  ),
};

// ── Inline select ─────────────────────────────────────────

export const InlineSelect: Story = {
  name: 'Inline select addon',
  render: () => {
    const [currency, setCurrency] = useState('usd');
    const [amount, setAmount] = useState('');
    return (
      <div className="max-w-sm">
        <Input
          label="Transfer amount"
          type="number"
          placeholder="0.00"
          hint="Converted at today's mid-market rate"
          trailingAddon={
            <div className="relative flex items-center">
              <select
                aria-label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="appearance-none bg-transparent border-none text-sm font-body text-ink-900 dark:text-ink-50 focus:outline-none cursor-pointer pr-5"
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
                <option value="aud">AUD</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 w-3.5 h-3.5 text-ink-500 dark:text-ink-300" />
            </div>
          }
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
    );
  },
};
