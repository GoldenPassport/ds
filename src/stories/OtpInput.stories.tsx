import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
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
          <p className="text-xs font-body text-ink-500 dark:text-ink-300">
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
          <span className="text-sm font-body text-ink-500 dark:text-ink-300">Phone number confirmed</span>
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

// ── Interactions ──────────────────────────────────────────

export const Interactions: Story = {
  name: 'Interactions',
  args: STUB,
  render: () => {
    const [val, setVal] = useState('');
    return (
      <div className="flex flex-col gap-3">
        <OtpInput
          length={6}
          numeric
          label="Verification code"
          hint="Enter the 6-digit code"
          value={val}
          onChange={setVal}
        />
        {val && (
          <p className="text-xs font-body text-ink-500 dark:text-ink-300" data-testid="entered-value">
            Entered: <code>{val}</code>
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    // Use a small delay so focus-advance (flushSync + focus()) settles
    // before the next keystroke fires
    const user = userEvent.setup({ delay: 50 });

    await step('type digits one by one — auto-advance focus', async () => {
      await user.click(canvas.getByRole('textbox', { name: /digit 1/i }));
      // Type all six digits; each auto-advances focus to the next cell
      await user.keyboard('123456');
      await waitFor(() => {
        expect(canvas.getByTestId('entered-value')).toHaveTextContent('123456');
      });
    });

    await step('backspace deletes and moves focus back', async () => {
      const cell6 = canvas.getByRole('textbox', { name: /digit 6/i });
      await user.click(cell6);
      // First backspace: cell6 has a value → clears cell6, focus stays on cell6
      await user.keyboard('{Backspace}');
      // Second backspace: cell6 is now empty → clears cell5 and moves focus to cell5
      await user.keyboard('{Backspace}');
      await waitFor(() => {
        const cell5 = canvas.getByRole('textbox', { name: /digit 5/i });
        expect(cell5).toHaveFocus();
      });
    });

    await step('arrow left / right navigation', async () => {
      const cell5 = canvas.getByRole('textbox', { name: /digit 5/i });
      await user.click(cell5);
      await user.keyboard('{ArrowLeft}');
      await waitFor(() => {
        expect(canvas.getByRole('textbox', { name: /digit 4/i })).toHaveFocus();
      });
      await user.keyboard('{ArrowRight}');
      await waitFor(() => {
        expect(canvas.getByRole('textbox', { name: /digit 5/i })).toHaveFocus();
      });
    });
  },
};

export const PasteInteraction: Story = {
  name: 'Paste interaction',
  args: STUB,
  render: () => {
    const [val, setVal] = useState('');
    return (
      <div className="flex flex-col gap-3">
        <OtpInput
          length={6}
          numeric
          label="Paste code"
          value={val}
          onChange={setVal}
        />
        {val.length === 6 && (
          <p data-testid="paste-result" className="text-xs font-body text-ink-500">
            Code: {val}
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('paste a full 6-digit code', async () => {
      const cell1 = canvas.getByRole('textbox', { name: /digit 1/i });
      await user.click(cell1);
      await user.paste('654321');
      await waitFor(() => {
        expect(canvas.getByTestId('paste-result')).toHaveTextContent('654321');
      });
    });
  },
};

export const ErrorReset: Story = {
  name: 'Error state reset',
  args: STUB,
  render: () => {
    const [val, setVal] = useState('999999');
    const [error, setError] = useState('Invalid code. Please try again.');
    return (
      <OtpInput
        length={6}
        label="Verification code"
        error={error}
        value={val}
        onChange={(v) => { setVal(v); if (v === '') setError(''); }}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('error message is visible', async () => {
      await expect(canvas.getByRole('alert')).toBeInTheDocument();
    });

    await step('pressing Backspace while error is set clears all cells', async () => {
      const cell1 = canvas.getByRole('textbox', { name: /digit 1/i });
      await user.click(cell1);
      await user.keyboard('{Backspace}');
      await waitFor(() => {
        // After error-reset all cells should be empty
        const cells = canvas.getAllByRole('textbox');
        cells.forEach((cell: HTMLElement) => expect(cell).toHaveValue(''));
      });
    });
  },
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
