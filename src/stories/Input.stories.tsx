import React, { useState } from 'react';
import { Eye, EyeOff, Search as SearchIcon, Mail, User, Lock, Globe, ChevronDown } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
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
    validate: {
      control: 'radio',
      options: [undefined, 'onBlur', 'onSubmit', 'both'],
      description: 'When to trigger HTML5 constraint validation. Requires native HTML attributes like `required`, `pattern`, `type="email"` etc.',
    },
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

// ── Addons ────────────────────────────────────────────────

export const Addons: Story = {
  name: 'Addons',
  render: () => {
    const [url,      setUrl]      = useState('');
    const [amount,   setAmount]   = useState('');
    const [username, setUsername] = useState('');
    const [domain,   setDomain]   = useState('');
    const [price,    setPrice]    = useState('');
    return (
      <div className="flex flex-col gap-5 max-w-sm">
        {/* Leading text */}
        <Input
          label="Website"
          placeholder="yourcompany.com"
          leadingAddon="https://"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />

        {/* Trailing text */}
        <Input
          label="Amount"
          type="number"
          placeholder="0.00"
          trailingAddon="USD"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        {/* Leading + trailing */}
        <Input
          label="Price"
          type="number"
          placeholder="0.00"
          leadingAddon="$"
          trailingAddon="USD"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        {/* Leading text */}
        <Input
          label="Username"
          placeholder="handle"
          leadingAddon="@"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        {/* Trailing text */}
        <Input
          label="Subdomain"
          placeholder="myapp"
          trailingAddon=".goldenpassport.app"
          value={domain}
          onChange={e => setDomain(e.target.value)}
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
    const [bio,   setBio]   = useState('');
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
          onChange={e => setEmail(e.target.value)}
        />

        {/* Dynamic character count */}
        <Input
          label="Bio"
          placeholder="Tell us about yourself…"
          cornerHint={`${bio.length} / ${MAX}`}
          maxLength={MAX}
          value={bio}
          onChange={e => setBio(e.target.value)}
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
          onChange={e => setVal(e.target.value)}
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
    const [amount,   setAmount]   = useState('');
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
                onChange={e => setCurrency(e.target.value)}
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
          onChange={e => setAmount(e.target.value)}
        />
      </div>
    );
  },
};

// ── Validation modes ──────────────────────────────────────

export const ValidationModes: Story = {
  name: 'Validation modes',
  render: () => {
    // Each mini-form tracks its own submit state so we can show a success banner
    const [submitOnBlur,   setSubmitOnBlur]   = React.useState(false);
    const [submitOnSubmit, setSubmitOnSubmit] = React.useState(false);
    const [submitBoth,     setSubmitBoth]     = React.useState(false);

    function prevent(e: React.FormEvent) {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      if (form.checkValidity()) {
        // identify which form submitted
        const id = form.dataset.id;
        if (id === 'blur')   setSubmitOnBlur(true);
        if (id === 'submit') setSubmitOnSubmit(true);
        if (id === 'both')   setSubmitBoth(true);
      }
    }

    const successBanner = (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-xs font-semibold font-body text-green-700 dark:text-green-400">
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
        </svg>
        Submitted successfully
      </div>
    );

    const submitBtn = (label = 'Submit') => (
      <button
        type="submit"
        className="mt-1 w-full py-2 px-4 rounded-xl text-sm font-semibold font-body bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-ink-900 transition-colors"
      >
        {label}
      </button>
    );

    const sectionTitle = (title: string, description: string) => (
      <div className="mb-4">
        <p className="text-sm font-bold font-display text-ink-900 dark:text-ink-50">{title}</p>
        <p className="mt-0.5 text-xs font-body text-ink-500 dark:text-ink-300">{description}</p>
      </div>
    );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">

        {/* ── onBlur ── */}
        <form
          data-id="blur"
          noValidate
          onSubmit={prevent}
          className="flex flex-col gap-3 p-5 rounded-2xl border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800"
        >
          {sectionTitle(
            'onBlur',
            'Errors appear as soon as you leave a field and clear while you type.',
          )}
          {submitOnBlur ? successBanner : (
            <>
              <Input
                validate="onBlur"
                label="Full name"
                placeholder="Alex Morgan"
                required
                hint="Required"
              />
              <Input
                validate="onBlur"
                label="Email"
                type="email"
                placeholder="you@example.com"
                required
                hint="Required · must be a valid address"
              />
              <Input
                validate="onBlur"
                label="Min-length username"
                placeholder="at least 4 chars"
                required
                minLength={4}
                hint="Required · min 4 characters"
              />
              {submitBtn()}
            </>
          )}
        </form>

        {/* ── onSubmit ── */}
        <form
          data-id="submit"
          noValidate
          onSubmit={prevent}
          className="flex flex-col gap-3 p-5 rounded-2xl border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800"
        >
          {sectionTitle(
            'onSubmit',
            'No errors while typing. All errors surface together when Submit is pressed.',
          )}
          {submitOnSubmit ? successBanner : (
            <>
              <Input
                validate="onSubmit"
                label="Full name"
                placeholder="Alex Morgan"
                required
                hint="Required"
              />
              <Input
                validate="onSubmit"
                label="Email"
                type="email"
                placeholder="you@example.com"
                required
                hint="Required · must be a valid address"
              />
              <Input
                validate="onSubmit"
                label="Min-length username"
                placeholder="at least 4 chars"
                required
                minLength={4}
                hint="Required · min 4 characters"
              />
              {submitBtn()}
            </>
          )}
        </form>

        {/* ── both ── */}
        <form
          data-id="both"
          noValidate
          onSubmit={prevent}
          className="flex flex-col gap-3 p-5 rounded-2xl border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800"
        >
          {sectionTitle(
            'both',
            'Validates on blur as you work through the form, and on submit for anything missed.',
          )}
          {submitBoth ? successBanner : (
            <>
              <Input
                validate="both"
                label="Full name"
                placeholder="Alex Morgan"
                required
                hint="Required"
              />
              <Input
                validate="both"
                label="Email"
                type="email"
                placeholder="you@example.com"
                required
                hint="Required · must be a valid address"
              />
              <Input
                validate="both"
                label="Min-length username"
                placeholder="at least 4 chars"
                required
                minLength={4}
                hint="Required · min 4 characters"
              />
              {submitBtn()}
            </>
          )}
        </form>

      </div>
    );
  },
};

// ── Interactions: validate="onBlur" ──────────────────────

export const ValidateOnBlurInteraction: Story = {
  name: 'Interaction — validate onBlur',
  render: () => {
    const [val, setVal] = React.useState('');
    return (
      <form noValidate className="flex flex-col gap-3 max-w-xs p-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          validate="onBlur"
          required
          value={val}
          onChange={e => setVal(e.target.value)}
          hint="Required"
        />
      </form>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('tab away from empty required field → shows validation error', async () => {
      const input = canvas.getByRole('textbox', { name: /email/i });
      await user.click(input);
      await user.tab();
      await waitFor(() => {
        // The error paragraph with role="alert" should appear
        expect(canvas.getByRole('alert')).toBeInTheDocument();
      });
    });

    await step('type a valid email → error clears', async () => {
      const input = canvas.getByRole('textbox', { name: /email/i });
      await user.click(input);
      await user.type(input, 'user@example.com');
      await waitFor(() => {
        expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  },
};

// ── Interactions: validate="onSubmit" ────────────────────

export const ValidateOnSubmitInteraction: Story = {
  name: 'Interaction — validate onSubmit',
  render: () => {
    const [submitted, setSubmitted] = React.useState(false);
    return (
      <form
        noValidate
        className="flex flex-col gap-3 max-w-xs p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if ((e.currentTarget as HTMLFormElement).checkValidity()) setSubmitted(true);
        }}
      >
        <Input
          label="Full name"
          placeholder="Alex Morgan"
          validate="onSubmit"
          required
          hint="Required"
        />
        <button type="submit" className="px-4 py-2 rounded-xl bg-primary-600 text-ink-900 text-sm font-semibold">
          Submit
        </button>
        {submitted && <p data-testid="success">Submitted!</p>}
      </form>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('submit without filling required field → error appears', async () => {
      const submitBtn = canvas.getByRole('button', { name: /submit/i });
      await user.click(submitBtn);
      await waitFor(() => {
        expect(canvas.getByRole('alert')).toBeInTheDocument();
      });
    });

    await step('fill the field → error clears', async () => {
      const input = canvas.getByRole('textbox', { name: /full name/i });
      await user.type(input, 'Alex Morgan');
      await waitFor(() => {
        expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  },
};

// ── Interactions: addons and cornerHint ──────────────────

export const AddonsInteraction: Story = {
  name: 'Interaction — addons render',
  render: () => {
    const [val, setVal] = React.useState('');
    return (
      <div className="flex flex-col gap-4 max-w-sm p-4">
        <Input
          label="Website"
          placeholder="yourcompany.com"
          leadingAddon="https://"
          value={val}
          onChange={e => setVal(e.target.value)}
          cornerHint="Optional"
        />
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('leading addon and cornerHint are rendered', async () => {
      expect(canvas.getByText('https://')).toBeInTheDocument();
      expect(canvas.getByText('Optional')).toBeInTheDocument();
    });

    await step('typing into input with leading addon works', async () => {
      const input = canvas.getByRole('textbox', { name: /website/i });
      await user.click(input);
      await user.type(input, 'example.com');
      await waitFor(() => {
        expect(input).toHaveValue('example.com');
      });
    });
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
  render: () => {
    const [showPw, setShowPw] = React.useState(false);
    const [bio, setBio] = React.useState('');
    const MAX = 200;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 max-w-2xl">

        <Input
          type="text"
          label="Full name"
          placeholder="Alex Morgan"
          icon={<User className="w-4 h-4" />}
          hint="As it appears on your account"
        />

        <Input
          type="email"
          label="Email address"
          placeholder="alex@company.com"
          icon={<Mail className="w-4 h-4" />}
          cornerHint="Optional"
          hint="Used for login and notifications"
        />

        <Input
          type={showPw ? 'text' : 'password'}
          label="Password"
          placeholder="••••••••"
          icon={<Lock className="w-4 h-4" />}
          hint="At least 8 characters"
          rightAction={
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              className="text-ink-500 dark:text-ink-300 hover:text-ink-600 dark:hover:text-ink-200 transition-colors p-1"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <Input
          type="number"
          label="Retry attempts"
          placeholder="3"
          min={0}
          max={10}
          trailingAddon="retries"
          hint="Max before the step is marked failed"
        />

        <Input
          type="tel"
          label="Phone number"
          placeholder="+1 (555) 000-0000"
          leadingAddon="+1"
          hint="Used for SMS alerts"
        />

        <Input
          type="url"
          label="Webhook URL"
          placeholder="yoursite.com/hook"
          leadingAddon="https://"
          icon={<Globe className="w-4 h-4" />}
          hint="POST requests sent on each run"
        />

        <Input
          type="search"
          label="Search"
          placeholder="Search workflows…"
          icon={<SearchIcon className="w-4 h-4" />}
        />

        <Input
          type="text"
          label="Bio"
          placeholder="Tell us about yourself…"
          cornerHint={`${bio.length} / ${MAX}`}
          maxLength={MAX}
          value={bio}
          onChange={e => setBio(e.target.value)}
        />

        <DatePicker     label="Start date"    placeholder="Select date"       hint="Workflow goes live on this date" />
        <DateTimePicker label="Scheduled run" placeholder="Select date & time" hint="Runs once at this exact time"    />
        <TimePicker     label="Daily digest"  placeholder="Select time"        hint="Summary email sent at this time" />

      </div>
    );
  },
};
