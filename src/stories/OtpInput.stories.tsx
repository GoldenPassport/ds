import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OtpInput } from '../components/OtpInput';
import { Button }   from '../components/Button';
import { Badge }    from '../components/Badge';

const meta = {
  title: 'Forms/OtpInput',
  component: OtpInput,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    length:    { control: { type: 'number', min: 3, max: 8 } },
    size:      { control: 'radio', options: ['sm', 'md', 'lg'] },
    numeric:   { control: 'boolean' },
    mask:      { control: 'boolean' },
    disabled:  { control: 'boolean' },
    autoFocus: { control: 'boolean' },
    label:     { control: 'text' },
    hint:      { control: 'text' },
    error:     { control: 'text' },
    value:     { control: false },
    onChange:  { control: false },
  },
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const STUB = { value: '', onChange: () => {} };

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    ...STUB,
    length:   6,
    size:     'md',
    numeric:  true,
    mask:     false,
    disabled: false,
    label:    'Verification code',
    hint:     'Enter the 6-digit code sent to your phone',
  },
  render: (args) => {
    const [val, setVal] = useState('');
    return (
      <div className="flex flex-col gap-3">
        <OtpInput {...args} value={val} onChange={setVal} />
        {val.length === (args.length ?? 6) && (
          <p className="text-xs font-body text-ink-500">
            Entered: <code className="text-ink-900 dark:text-ink-50 font-bold">{val}</code>
          </p>
        )}
      </div>
    );
  },
};

// ── 4-digit PIN ───────────────────────────────────────────

export const FourDigitPin: Story = {
  name: '4-digit PIN',
  args: STUB,
  render: () => {
    const [val, setVal] = useState('');
    return (
      <OtpInput
        length={4}
        label="Enter PIN"
        hint="Your 4-digit account PIN"
        value={val}
        onChange={setVal}
      />
    );
  },
};

// ── 6-digit verification ──────────────────────────────────

export const SixDigitCode: Story = {
  name: '6-digit verification',
  args: STUB,
  render: () => {
    const [val,      setVal]      = useState('');
    const [verified, setVerified] = useState(false);
    const [error,    setError]    = useState('');

    function handleComplete(code: string) {
      if (code === '123456') {
        setVerified(true);
        setError('');
      } else {
        setError('Incorrect code — try 123456');
        setVal('');
      }
    }

    if (verified) {
      return (
        <div className="flex items-center gap-2">
          <Badge label="Verified" variant="active" />
          <span className="text-sm font-body text-ink-500">Phone number confirmed</span>
        </div>
      );
    }

    return (
      <OtpInput
        length={6}
        label="Verification code"
        hint="Sent to +61 4•• ••• ••• (try 123456)"
        error={error}
        value={val}
        onChange={v => { setVal(v); setError(''); }}
        onComplete={handleComplete}
      />
    );
  },
};

// ── Sizes ─────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Sizes',
  args: STUB,
  render: () => {
    const [sm, setSm] = useState('');
    const [md, setMd] = useState('');
    const [lg, setLg] = useState('');
    return (
      <div className="flex flex-col gap-8">
        <OtpInput size="sm" length={6} label="Small"  value={sm} onChange={setSm} />
        <OtpInput size="md" length={6} label="Medium" value={md} onChange={setMd} />
        <OtpInput size="lg" length={6} label="Large"  value={lg} onChange={setLg} />
      </div>
    );
  },
};

// ── Masked ────────────────────────────────────────────────

export const Masked: Story = {
  name: 'Masked — PIN entry',
  args: STUB,
  render: () => {
    const [val,  setVal]  = useState('');
    const [show, setShow] = useState(false);
    return (
      <div className="flex flex-col gap-3">
        <OtpInput
          length={4}
          label="Account PIN"
          hint="Your PIN is never stored in plain text"
          mask={!show}
          value={val}
          onChange={setVal}
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="self-start text-xs font-body text-ink-700 dark:text-ink-300 hover:underline"
        >
          {show ? 'Hide' : 'Show'} digits
        </button>
      </div>
    );
  },
};

// ── Alphanumeric ──────────────────────────────────────────

export const Alphanumeric: Story = {
  name: 'Alphanumeric code',
  args: STUB,
  render: () => {
    const [val, setVal] = useState('');
    return (
      <OtpInput
        length={8}
        numeric={false}
        label="Licence key"
        hint="8-character activation code (letters and numbers)"
        value={val}
        onChange={v => setVal(v.toUpperCase())}
      />
    );
  },
};

// ── Error state ───────────────────────────────────────────

export const WithError: Story = {
  name: 'Error state',
  args: STUB,
  render: () => {
    const [val, setVal] = useState('999999');
    return (
      <OtpInput
        length={6}
        label="Verification code"
        error="Invalid code. Please check and try again."
        value={val}
        onChange={setVal}
      />
    );
  },
};

// ── Disabled ──────────────────────────────────────────────

export const Disabled: Story = {
  name: 'Disabled',
  args: STUB,
  render: () => (
    <OtpInput
      length={6}
      label="Verification code"
      hint="Code has expired — request a new one"
      disabled
      value="847291"
      onChange={() => {}}
    />
  ),
};

// ── Full auth flow ────────────────────────────────────────

export const AuthFlow: Story = {
  name: 'Full auth flow',
  args: STUB,
  render: () => {
    const [val,    setVal]    = useState('');
    const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');

    function handleComplete(code: string) {
      setStatus('verifying');
      setTimeout(() => {
        setStatus(code === '123456' ? 'success' : 'error');
        if (code !== '123456') setVal('');
      }, 900);
    }

    function resend() {
      setVal('');
      setStatus('idle');
    }

    if (status === 'success') {
      return (
        <div className="max-w-sm text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl">✓</div>
          <p className="font-semibold font-display text-ink-900 dark:text-ink-50">Identity verified</p>
          <p className="text-sm font-body text-ink-500 dark:text-ink-300">You're now signed in.</p>
        </div>
      );
    }

    return (
      <div className="max-w-sm flex flex-col gap-5">
        <div>
          <p className="text-base font-bold font-display text-ink-900 dark:text-ink-50">Two-step verification</p>
          <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-300">
            Enter the 6-digit code sent to{' '}
            <span className="font-medium text-ink-700 dark:text-ink-200">+61 4•• ••• •••</span>
          </p>
        </div>

        <OtpInput
          length={6}
          autoFocus
          value={val}
          onChange={v => { setVal(v); if (status === 'error') setStatus('idle'); }}
          onComplete={handleComplete}
          error={status === 'error' ? 'Incorrect code. Try 123456 for this demo.' : ''}
        />

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={resend}
            className="text-sm font-body font-semibold text-primary-800 dark:text-primary-400 hover:underline"
          >
            Resend code
          </button>
          <Button
            variant="primary"
            disabled={val.length < 6 || status === 'verifying'}
            onClick={() => handleComplete(val)}
          >
            {status === 'verifying' ? 'Verifying…' : 'Verify'}
          </Button>
        </div>
      </div>
    );
  },
};
