import { expect, userEvent, within, waitFor } from 'storybook/test';
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Eye, EyeOff, Mail, Lock, Phone, ArrowLeft, ShieldCheck } from 'lucide-react';

import gpLogo from '../../assets/gp-logo.png';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { OtpInput } from '../components/OtpInput';
import { Badge } from '../components/Badge';
import { Hyperlink } from '../components/Hyperlink';
import { Fieldset, Legend, FieldGroup } from '../components/Fieldset';

const meta = {
  title: 'Example Pages/Login',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared shell ──────────────────────────────────────────

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    // Mobile (<768px): full-screen white, no card chrome, tight padding.
    // md+: ink-50 background with a centred floating card.
    <div className="min-h-screen flex flex-col bg-white dark:bg-ink-900 md:bg-ink-50 md:dark:bg-ink-950 md:items-center md:justify-center md:px-4 md:py-16">
      <div className="w-full md:max-w-sm bg-white dark:bg-ink-900 md:rounded-2xl md:shadow-sm md:border md:border-ink-100 md:dark:border-ink-800 overflow-hidden">
        <div className="flex items-center justify-center gap-3 px-5 py-4 md:py-5 border-b border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-800">
          <img src={gpLogo} alt="" aria-hidden="true" className="h-7 w-auto" />
          <span className="text-sm font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight">
            Golden Passport
          </span>
        </div>
        <div className="px-5 py-6 md:px-8 md:py-8">{children}</div>
      </div>
      <p className="hidden md:block mt-6 text-xs font-body text-ink-500 dark:text-ink-300 text-center">
        © {new Date().getFullYear()} Golden Passport. All rights reserved.
      </p>
    </div>
  );
}

function OrDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-ink-100 dark:border-ink-800" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white dark:bg-ink-900 px-3 text-xs font-body text-ink-500 dark:text-ink-300">
          or continue with
        </span>
      </div>
    </div>
  );
}

function GoogleButton() {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 hover:bg-ink-50 dark:hover:bg-ink-750 transition-colors text-sm font-semibold font-body text-ink-700 dark:text-ink-200"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84Z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
          fill="#EA4335"
        />
      </svg>
      Google
    </button>
  );
}

function SuccessScreen({
  title,
  body,
  onReset,
}: {
  title: string;
  body: React.ReactNode;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-4 text-center">
      <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <ShieldCheck className="w-7 h-7 text-green-600 dark:text-green-400" />
      </div>
      <h2 className="text-lg font-bold font-display text-ink-900 dark:text-ink-50">{title}</h2>
      <p className="text-sm font-body text-ink-500 dark:text-ink-300">{body}</p>
      <Button variant="secondary" size="sm" className="mt-2" onClick={onReset}>
        Sign out
      </Button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Story 1 — Standard email + password
// ═══════════════════════════════════════════════════════════

function StandardLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email && password === 'password') {
        setDone(true);
      } else {
        setError('Incorrect email or password. Try password: password');
      }
    }, 1200);
  }

  if (done) {
    return (
      <AuthShell>
        <SuccessScreen
          title="Welcome back!"
          body={
            <>
              You're now signed in as{' '}
              <strong className="text-ink-700 dark:text-ink-200">{email}</strong>
            </>
          }
          onReset={() => {
            setDone(false);
            setEmail('');
            setPassword('');
          }}
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="text-xl font-bold font-display text-ink-900 dark:text-ink-50 mb-1">Sign in</h1>
      <p className="text-sm font-body text-ink-500 dark:text-ink-300 mb-6">
        Don't have an account?{' '}
        <Hyperlink href="#" className="font-semibold">
          Sign up
        </Hyperlink>
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <Fieldset>
          <Legend className="sr-only">Sign in credentials</Legend>
          <FieldGroup gap="sm">
            <Input
              type="email"
              label="Email address"
              placeholder="alex@company.com"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              validate="onBlur"
              required
              autoComplete="email"
            />
            <Input
              type={showPw ? 'text' : 'password'}
              label="Password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              autoComplete="current-password"
              cornerHint={<Hyperlink href="#">Forgot password?</Hyperlink>}
              rightAction={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="text-ink-400 dark:text-ink-300 hover:text-ink-600 dark:hover:text-ink-200 transition-colors p-1"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={error}
            />
          </FieldGroup>

          <div className="mt-2">
            <Checkbox checked={remember} onChange={setRemember} label="Remember me for 30 days" />
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full mt-5">
            Sign in
          </Button>
        </Fieldset>
      </form>

      <OrDivider />
      <GoogleButton />
    </AuthShell>
  );
}

export const Playground: Story = {
  name: 'Standard — email + password',
  render: () => <StandardLogin />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('submit with wrong password → error appears', async () => {
      await user.type(canvas.getByLabelText(/email address/i), 'alex@example.com');
      await user.type(canvas.getByLabelText(/^password$/i), 'wrongpassword');
      await user.click(canvas.getByRole('button', { name: /^sign in$/i }));
      // Server response is simulated with a 1 200 ms setTimeout
      await waitFor(
        () => expect(canvas.getByText(/incorrect email or password/i)).toBeInTheDocument(),
        { timeout: 3000 },
      );
    });
    await step('fix password → submit → success screen', async () => {
      const pw = canvas.getByLabelText(/^password$/i);
      await user.clear(pw);
      await user.type(pw, 'password');
      await user.click(canvas.getByRole('button', { name: /^sign in$/i }));
      await waitFor(
        () => expect(canvas.getByText(/welcome back/i)).toBeInTheDocument(),
        { timeout: 3000 },
      );
    });
  },
};

// ═══════════════════════════════════════════════════════════
// Story 2 — Passwordless OTP login
// ═══════════════════════════════════════════════════════════

type OtpStep = 'request' | 'verify' | 'success';

function OtpLogin() {
  const [step, setStep] = useState<OtpStep>('request');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);

  const isPhone = /^\+?\d[\d\s\-()]{6,}$/.test(contact.trim());
  const destLabel = isPhone ? 'phone number' : 'email address';
  const masked = isPhone
    ? contact.replace(/\d(?=\d{4})/g, '•')
    : contact.replace(/(.{2}).+(@.+)/, '$1•••••$2');

  function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!contact.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
    }, 1000);
  }

  function handleVerify(code: string) {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (code === '123456') {
        setStep('success');
      } else {
        setError('Incorrect code. Try 123456 for this demo.');
        setOtp('');
      }
    }, 900);
  }

  function handleResend() {
    setResent(true);
    setOtp('');
    setError('');
    setTimeout(() => setResent(false), 3000);
  }

  if (step === 'request') {
    return (
      <AuthShell>
        <h1 className="text-xl font-bold font-display text-ink-900 dark:text-ink-50 mb-1">
          Sign in without a password
        </h1>
        <p className="text-sm font-body text-ink-500 dark:text-ink-300 mb-6">
          We'll send a one-time code to your email or phone.
        </p>

        <form onSubmit={handleRequest} noValidate>
          <Fieldset>
            <Legend className="sr-only">Passwordless sign-in</Legend>
            <FieldGroup gap="sm">
              <Input
                label="Email or phone"
                placeholder="+1 555 000 0000 or alex@example.com"
                icon={<Phone className="w-4 h-4" />}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                validate="onBlur"
                required
                autoComplete="username"
              />
            </FieldGroup>
            <Button type="submit" variant="primary" loading={loading} className="w-full mt-3">
              Send code
            </Button>
          </Fieldset>
        </form>

        <OrDivider />
        <GoogleButton />
        <p className="mt-6 text-center text-xs font-body text-ink-500 dark:text-ink-300">
          Have a password?{' '}
          <Hyperlink href="#" className="font-semibold">
            Sign in with password
          </Hyperlink>
        </p>
      </AuthShell>
    );
  }

  if (step === 'verify') {
    return (
      <AuthShell>
        <button
          type="button"
          onClick={() => {
            setStep('request');
            setOtp('');
            setError('');
          }}
          className="flex items-center gap-1.5 text-xs font-semibold font-body text-ink-500 hover:text-ink-700 dark:text-ink-300 dark:hover:text-ink-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <h1 className="text-xl font-bold font-display text-ink-900 dark:text-ink-50 mb-1">
          Check your {destLabel}
        </h1>
        <p className="text-sm font-body text-ink-500 dark:text-ink-300 mb-6">
          We sent a 6-digit code to{' '}
          <span className="font-medium text-ink-700 dark:text-ink-200">{masked}</span>. Enter it
          below to sign in.
        </p>

        <Fieldset>
          <Legend className="sr-only">Enter verification code</Legend>
          <FieldGroup gap="sm">
            <OtpInput
              length={6}
              size="sm"
              value={otp}
              onChange={(v) => {
                setOtp(v);
                setError('');
              }}
              onComplete={handleVerify}
              error={error}
              autoFocus
            />
          </FieldGroup>
          <Button
            variant="primary"
            loading={loading}
            disabled={otp.length < 6 || loading}
            className="w-full mt-3"
            onClick={() => handleVerify(otp)}
          >
            {loading ? 'Verifying…' : 'Verify code'}
          </Button>
        </Fieldset>

        <div className="flex items-center justify-between text-xs font-body mt-4">
          {resent ? (
            <span className="text-green-600 dark:text-green-400 font-semibold">Code resent!</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-ink-500 hover:text-ink-700 dark:text-ink-300 dark:hover:text-ink-200 transition-colors"
            >
              Didn't get a code?{' '}
              <span className="font-semibold text-primary-800 dark:text-primary-400">Resend</span>
            </button>
          )}
          <span className="text-ink-500 dark:text-ink-300">Try: 123456</span>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <SuccessScreen
        title="You're in!"
        body={
          <>
            Signed in as <strong className="text-ink-700 dark:text-ink-200">{masked}</strong>
          </>
        }
        onReset={() => {
          setStep('request');
          setContact('');
          setOtp('');
          setError('');
        }}
      />
    </AuthShell>
  );
}

export const OtpLoginFlow: Story = {
  name: 'OTP — passwordless login',
  render: () => <OtpLogin />,
};

// ═══════════════════════════════════════════════════════════
// Story 3 — Email + password then 2FA
// ═══════════════════════════════════════════════════════════

type TwoFaStep = 'credentials' | 'otp' | 'success';

function TwoFaLogin() {
  const [step, setStep] = useState<TwoFaStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email && password === 'password') {
        setStep('otp');
      } else {
        setError('Incorrect email or password. Try password: password');
      }
    }, 1000);
  }

  function handleOtp(code: string) {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (code === '123456') {
        setStep('success');
      } else {
        setError('Incorrect code. Try 123456 for this demo.');
        setOtp('');
      }
    }, 900);
  }

  if (step === 'credentials') {
    return (
      <AuthShell>
        <div className="flex justify-end mb-4">
          <Badge label="2FA enabled" variant="active" />
        </div>
        <h1 className="text-xl font-bold font-display text-ink-900 dark:text-ink-50 mb-1">
          Sign in
        </h1>
        <p className="text-sm font-body text-ink-500 dark:text-ink-300 mb-6">
          Two-factor authentication is enabled on your account.
        </p>

        <form onSubmit={handleSignIn} noValidate>
          <Fieldset>
            <Legend className="sr-only">Sign-in credentials</Legend>
            <FieldGroup gap="sm">
              <Input
                type="email"
                label="Email address"
                placeholder="alex@company.com"
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                validate="onBlur"
                required
                autoComplete="email"
              />
              <Input
                type={showPw ? 'text' : 'password'}
                label="Password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                autoComplete="current-password"
                error={error}
                rightAction={
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    className="text-ink-400 dark:text-ink-300 hover:text-ink-600 dark:hover:text-ink-200 transition-colors p-1"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </FieldGroup>

            <div role="group" className="flex items-center gap-1.5 mt-4" aria-label="Step 1 of 2">
              <div className="h-1 flex-1 rounded-full bg-primary-500" />
              <div className="h-1 flex-1 rounded-full bg-ink-100 dark:bg-ink-800" />
              <span className="text-[10px] font-body text-ink-500 dark:text-ink-300 ml-1">
                1 / 2
              </span>
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full mt-4">
              Continue
            </Button>
          </Fieldset>
        </form>
      </AuthShell>
    );
  }

  if (step === 'otp') {
    return (
      <AuthShell>
        <button
          type="button"
          onClick={() => {
            setStep('credentials');
            setOtp('');
            setError('');
          }}
          className="flex items-center gap-1.5 text-xs font-semibold font-body text-ink-500 hover:text-ink-700 dark:text-ink-300 dark:hover:text-ink-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <h1 className="text-xl font-bold font-display text-ink-900 dark:text-ink-50 mb-1">
          Two-factor authentication
        </h1>
        <p className="text-sm font-body text-ink-500 dark:text-ink-300 mb-6">
          Enter the 6-digit code from your authenticator app or the one we sent to{' '}
          <span className="font-medium text-ink-700 dark:text-ink-200">
            {email.replace(/(.{2}).+(@.+)/, '$1•••••$2')}
          </span>
          .
        </p>

        <Fieldset>
          <Legend className="sr-only">Two-factor authentication code</Legend>
          <FieldGroup gap="sm">
            <OtpInput
              length={6}
              size="sm"
              value={otp}
              onChange={(v) => {
                setOtp(v);
                setError('');
              }}
              onComplete={handleOtp}
              error={error}
              autoFocus
            />
          </FieldGroup>

          <div role="group" className="flex items-center gap-1.5 mt-4" aria-label="Step 2 of 2">
            <div className="h-1 flex-1 rounded-full bg-primary-500" />
            <div className="h-1 flex-1 rounded-full bg-primary-500" />
            <span className="text-[10px] font-body text-ink-500 dark:text-ink-300 ml-1">2 / 2</span>
          </div>

          <Button
            variant="primary"
            loading={loading}
            disabled={otp.length < 6 || loading}
            className="w-full mt-4"
            onClick={() => handleOtp(otp)}
          >
            {loading ? 'Verifying…' : 'Verify and sign in'}
          </Button>
        </Fieldset>

        <p className="text-center text-xs font-body text-ink-500 dark:text-ink-300 mt-4">
          Lost access to your authenticator?{' '}
          <Hyperlink href="#" className="font-semibold">
            Use a recovery code
          </Hyperlink>
        </p>
        <p className="text-center text-xs font-body text-ink-300 dark:text-ink-600 mt-1">
          Demo code: 123456
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <SuccessScreen
        title="Fully verified"
        body={
          <>
            Signed in as <strong className="text-ink-700 dark:text-ink-200">{email}</strong> with
            2FA.
          </>
        }
        onReset={() => {
          setStep('credentials');
          setEmail('');
          setPassword('');
          setOtp('');
          setError('');
        }}
      />
    </AuthShell>
  );
}

export const TwoFactor: Story = {
  name: '2FA — password + authenticator',
  render: () => <TwoFaLogin />,
};
