import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { OtpInput } from '../components/OtpInput';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Forms/OtpInput',
  component: OtpInput,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    length: { control: { type: 'number', min: 3, max: 8 } },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    numeric: { control: 'boolean' },
    mask: { control: 'boolean' },
    disabled: { control: 'boolean' },
    autoFocus: { control: 'boolean' },
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    value: { control: false },
    onChange: { control: false },
  },
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const STUB = { value: '', onChange: () => {} };

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    ...STUB,
    length: 6,
    size: 'md',
    numeric: true,
    mask: false,
    disabled: false,
    label: 'Verification code',
    hint: 'Enter the 6-digit code sent to your phone',
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

// ── 6-digit verification ──────────────────────────────────

export const SixDigitCode: Story = {
  name: '6-digit verification',
  args: STUB,
  render: () => {
    const [val, setVal] = useState('');
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState('');

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
          <span className="text-sm font-body text-ink-500 dark:text-ink-300">
            Phone number confirmed
          </span>
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
        onChange={(v) => {
          setVal(v);
          setError('');
        }}
        onComplete={handleComplete}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('type wrong code → error appears', async () => {
      await user.click(canvas.getAllByRole('textbox')[0]);
      await user.keyboard('999999');
      await waitFor(() => {
        expect(canvas.getByRole('alert')).toHaveTextContent('Incorrect code');
      });
    });

    await step('type correct code 123456 → verified', async () => {
      // Inputs are cleared after error — click the first digit again
      await user.click(canvas.getAllByRole('textbox')[0]);
      await user.keyboard('123456');
      await waitFor(() => {
        expect(canvas.getByText('Phone number confirmed')).toBeInTheDocument();
      });
    });
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
        <OtpInput size="sm" length={6} label="Small" value={sm} onChange={setSm} />
        <OtpInput size="md" length={6} label="Medium" value={md} onChange={setMd} />
        <OtpInput size="lg" length={6} label="Large" value={lg} onChange={setLg} />
      </div>
    );
  },
};

// ── Masked ────────────────────────────────────────────────

export const Masked: Story = {
  name: 'Masked — PIN entry',
  args: STUB,
  render: () => {
    const [val, setVal] = useState('');
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
          onClick={() => setShow((v) => !v)}
          className="self-start text-xs font-body text-ink-700 dark:text-ink-300 hover:underline"
        >
          {show ? 'Hide' : 'Show'} digits
        </button>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('type 4 digits → bullet overlays appear, inputs stay visually empty', async () => {
      await user.click(canvas.getAllByRole('textbox')[0]);
      await user.keyboard('1234');
      await waitFor(() => {
        // Inputs are visually blank (value="") when masked
        expect(canvas.getAllByRole('textbox')[0]).toHaveValue('');
        // Bullet spans (aria-hidden) appear — one per filled cell
        const maskedBullets = Array.from(canvasElement.querySelectorAll('span[aria-hidden="true"]')).filter(
          (el) => el.textContent === '•',
        );
        expect(maskedBullets).toHaveLength(4);
      });
    });

    await step('click "Show digits" → inputs reveal actual values', async () => {
      await user.click(canvas.getByRole('button', { name: /show digits/i }));
      await waitFor(() => {
        expect(canvas.getAllByRole('textbox')[0]).toHaveValue('1');
        expect(canvas.getAllByRole('textbox')[3]).toHaveValue('4');
      });
    });

    await step('click "Hide digits" → inputs masked again', async () => {
      await user.click(canvas.getByRole('button', { name: /hide digits/i }));
      await waitFor(() => {
        expect(canvas.getAllByRole('textbox')[0]).toHaveValue('');
      });
    });
  },
};

// ── Alphanumeric ──────────────────────────────────────────

export const Alphanumeric: Story = {
  name: 'Alphanumeric code',
  args: STUB,
  render: () => {
    const [val, setVal] = useState('');
    return (
      <div className="flex flex-col gap-3">
        <OtpInput
          length={8}
          numeric={false}
          label="Licence key"
          hint="8-character activation code (letters and numbers)"
          value={val}
          onChange={(v) => setVal(v.toUpperCase())}
        />
        <span data-testid="otp-val" className="text-xs font-mono text-ink-500 dark:text-ink-300">
          {val}
        </span>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('type 8 alphanumeric characters → all cells filled', async () => {
      await user.click(canvas.getAllByRole('textbox')[0]);
      await user.keyboard('AB12CD34');
      await waitFor(() => {
        expect(canvas.getByTestId('otp-val')).toHaveTextContent('AB12CD34');
        expect(canvas.getAllByRole('textbox')[7]).toHaveValue('4');
      });
    });

    await step('numeric-only characters are accepted, letters too', async () => {
      // The last cell is filled — backspace to clear last
      await user.keyboard('{Backspace}');
      await user.keyboard('Z');
      await waitFor(() => {
        expect(canvas.getByTestId('otp-val')).toHaveTextContent('AB12CD3Z');
      });
    });
  },
};

// ── Keyboard navigation ───────────────────────────────────

export const KeyboardNav: Story = {
  name: 'Keyboard navigation',
  args: STUB,
  render: () => {
    const [val, setVal] = useState('');
    return (
      <div className="flex flex-col gap-3">
        <OtpInput length={4} label="4-digit PIN" value={val} onChange={setVal} />
        <span data-testid="val" className="text-xs font-mono text-ink-500 dark:text-ink-300">
          {val}
        </span>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    const inputs = () => canvas.getAllByRole('textbox');

    await step('type 2 digits → focus advances to cell 2', async () => {
      await user.click(inputs()[0]);
      await user.keyboard('12');
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent('12'));
      expect(document.activeElement).toBe(inputs()[2]);
    });

    await step('ArrowLeft → focus moves to cell 1', async () => {
      await user.keyboard('{ArrowLeft}');
      expect(document.activeElement).toBe(inputs()[1]);
    });

    await step('ArrowLeft → focus moves to cell 0', async () => {
      await user.keyboard('{ArrowLeft}');
      expect(document.activeElement).toBe(inputs()[0]);
    });

    await step('ArrowRight → focus moves to cell 1', async () => {
      await user.keyboard('{ArrowRight}');
      expect(document.activeElement).toBe(inputs()[1]);
    });

    await step('Backspace on occupied cell → clears it in place, focus stays', async () => {
      // Cell 1 contains "2"
      await user.keyboard('{Backspace}');
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent('1'));
      expect(document.activeElement).toBe(inputs()[1]);
    });

    await step('Backspace on empty cell → clears previous cell and moves back', async () => {
      // Cell 1 is now empty — backspace should clear cell 0 and move to cell 0
      await user.keyboard('{Backspace}');
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent(''));
      expect(document.activeElement).toBe(inputs()[0]);
    });

    await step('type 2 digits, then Delete → clears current cell without moving', async () => {
      await user.keyboard('56');
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent('56'));
      // Focus is now on cell 2 — move back to cell 0 to test Delete
      await user.keyboard('{ArrowLeft}{ArrowLeft}');
      expect(document.activeElement).toBe(inputs()[0]);
      await user.keyboard('{Delete}');
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent('6'));
      // Focus stays on cell 0
      expect(document.activeElement).toBe(inputs()[0]);
    });

    await step('paste "9999" → all 4 cells filled from clipboard', async () => {
      // Clear first
      await user.keyboard('{Backspace}{Backspace}');
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent(''));
      // Dispatch a real ClipboardEvent with DataTransfer
      const dt = new DataTransfer();
      dt.setData('text/plain', '9999');
      inputs()[0].dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
      await waitFor(() => expect(canvas.getByTestId('val')).toHaveTextContent('9999'));
    });
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
    const [val, setVal] = useState('');
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
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl">
            ✓
          </div>
          <p className="font-semibold font-display text-ink-900 dark:text-ink-50">
            Identity verified
          </p>
          <p className="text-sm font-body text-ink-500 dark:text-ink-300">You're now signed in.</p>
        </div>
      );
    }

    return (
      <div className="max-w-sm flex flex-col gap-5">
        <div>
          <p className="text-base font-bold font-display text-ink-900 dark:text-ink-50">
            Two-step verification
          </p>
          <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-300">
            Enter the 6-digit code sent to{' '}
            <span className="font-medium text-ink-700 dark:text-ink-200">+61 4•• ••• •••</span>
          </p>
        </div>

        <OtpInput
          length={6}
          autoFocus
          value={val}
          onChange={(v) => {
            setVal(v);
            if (status === 'error') setStatus('idle');
          }}
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
