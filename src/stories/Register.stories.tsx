import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Eye, EyeOff, Mail, Lock, User, Phone, ShieldCheck, ArrowLeft } from 'lucide-react';

import gpLogo from '../../assets/gp-logo.png';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { OtpInput } from '../components/OtpInput';
import { Hyperlink } from '../components/Hyperlink';
import { Fieldset, Legend, FieldGroup, FieldDivider } from '../components/Fieldset';

const meta = {
  title: 'Example Pages/Register',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared shell ──────────────────────────────────────────

function AuthShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    // Mobile (<768px): full-screen white, no card chrome, tight padding.
    // md+: ink-50 background with a centred floating card.
    <div className="min-h-screen flex flex-col bg-white dark:bg-ink-900 md:bg-ink-50 md:dark:bg-ink-950 md:items-center md:justify-center md:px-4 md:py-16">
      <div
        className={`w-full ${wide ? 'md:max-w-lg' : 'md:max-w-sm'} bg-white dark:bg-ink-900 md:rounded-2xl md:shadow-sm md:border md:border-ink-100 md:dark:border-ink-800 overflow-hidden`}
      >
        <div className="flex items-center justify-center gap-3 px-5 py-4 md:py-5 border-b border-ink-100 dark:border-ink-800 bg-ink-50/60 dark:bg-ink-800/40">
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
  body: string;
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
        Start over
      </Button>
    </div>
  );
}

// ── Password strength meter ───────────────────────────────

function strengthScore(pw: string): 0 | 1 | 2 | 3 | 4 {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s as 0 | 1 | 2 | 3 | 4;
}

const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLOR = ['', 'bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-green-500'];

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = strengthScore(password);
  return (
    <div className="flex flex-col gap-1.5 -mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={[
              'h-1 flex-1 rounded-full transition-colors duration-300',
              score >= i ? STRENGTH_COLOR[score] : 'bg-ink-100 dark:bg-ink-700',
            ].join(' ')}
          />
        ))}
      </div>
      <p className="text-[11px] font-body text-ink-500 dark:text-ink-300">
        Strength:{' '}
        <span className="font-semibold text-ink-600 dark:text-ink-300">
          {STRENGTH_LABEL[score] || 'Too short'}
        </span>
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Story 1 — Full registration
// ═══════════════════════════════════════════════════════════

function FullRegistrationForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [submitErr, setSubmitErr] = useState('');

  const pwMismatch = confirm.length > 0 && confirm !== password;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setSubmitErr('Passwords do not match.');
      return;
    }
    if (!terms) {
      setSubmitErr('Please accept the terms to continue.');
      return;
    }
    setSubmitErr('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1200);
  }

  function reset() {
    setDone(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirm('');
    setTerms(false);
    setSubmitErr('');
  }

  if (done) {
    return (
      <AuthShell wide>
        <SuccessScreen
          title="Account created!"
          body={`Welcome aboard, ${firstName}. Check ${email} to verify your address.`}
          onReset={reset}
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell wide>
      <h1 className="text-xl font-bold font-display text-ink-900 dark:text-ink-50 mb-1">
        Create your account
      </h1>
      <p className="text-sm font-body text-ink-500 dark:text-ink-300 mb-6">
        Already have an account?{' '}
        <Hyperlink href="#" className="font-semibold">
          Sign in
        </Hyperlink>
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <Fieldset>
          <Legend className="sr-only">Personal details</Legend>

          {/* ── Personal info ── */}
          <FieldGroup gap="sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="First name"
                placeholder="Alex"
                icon={<User className="w-4 h-4" />}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                validate="onBlur"
                required
                autoComplete="given-name"
              />
              <Input
                label="Last name"
                placeholder="Morgan"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                validate="onBlur"
                required
                autoComplete="family-name"
              />
            </div>

            <Input
              type="email"
              label="Email address"
              placeholder="alex@company.com"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              validate="onBlur"
              required
              autoComplete="email"
            />

            <Input
              type="tel"
              label="Phone number"
              placeholder="+1 555 000 0000"
              icon={<Phone className="w-4 h-4" />}
              cornerHint="Optional"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </FieldGroup>

          <FieldDivider className="my-5" />

          {/* ── Password section ── */}
          <FieldGroup gap="sm">
            <div className="flex flex-col gap-1.5">
              <Input
                type={showPw ? 'text' : 'password'}
                label="Password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setSubmitErr('');
                }}
                autoComplete="new-password"
                hint="Min 8 chars · uppercase · number · symbol"
                rightAction={
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? 'Hide' : 'Show'}
                    className="text-ink-400 dark:text-ink-300 hover:text-ink-600 dark:hover:text-ink-200 transition-colors p-1"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              <PasswordStrength password={password} />
            </div>

            <Input
              type={showCf ? 'text' : 'password'}
              label="Confirm password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setSubmitErr('');
              }}
              autoComplete="new-password"
              error={pwMismatch ? 'Passwords do not match' : ''}
              rightAction={
                <button
                  type="button"
                  onClick={() => setShowCf((v) => !v)}
                  aria-label={showCf ? 'Hide' : 'Show'}
                  className="text-ink-400 dark:text-ink-300 hover:text-ink-600 dark:hover:text-ink-200 transition-colors p-1"
                >
                  {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </FieldGroup>

          <FieldDivider className="my-5" />

          {/* ── Terms + submit ── */}
          <div className="flex flex-col gap-4">
            <Checkbox
              checked={terms}
              onChange={(v) => {
                setTerms(v);
                setSubmitErr('');
              }}
              label="I agree to the Terms of Service and Privacy Policy"
            />

            {submitErr && (
              <p className="text-xs font-body text-red-600 dark:text-red-400">{submitErr}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={!terms || pwMismatch || loading}
              className="w-full"
            >
              Create account
            </Button>
          </div>
        </Fieldset>
      </form>

      <OrDivider />
      <GoogleButton />
    </AuthShell>
  );
}

export const Playground: Story = {
  name: 'Full registration',
  render: () => <FullRegistrationForm />,
};

// ═══════════════════════════════════════════════════════════
// Story 2 — Email-only (passwordless / OTP)
// ═══════════════════════════════════════════════════════════

type EmailStep = 'capture' | 'verify' | 'success';

function EmailOnlyForm() {
  const [step, setStep] = useState<EmailStep>('capture');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);

  const masked = email.replace(/(.{2}).+(@.+)/, '$1•••••$2');

  function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
    }, 900);
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

  if (step === 'capture') {
    return (
      <AuthShell>
        <h1 className="text-xl font-bold font-display text-ink-900 dark:text-ink-50 mb-1">
          Get started
        </h1>
        <p className="text-sm font-body text-ink-500 dark:text-ink-300 mb-6">
          Enter your email and we'll send you a sign-in link — no password needed.
        </p>

        <form onSubmit={handleRequest} noValidate>
          <Fieldset>
            <Legend className="sr-only">Email registration</Legend>
            <FieldGroup gap="sm">
              <Input
                type="email"
                label="Email address"
                placeholder="alex@company.com"
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                validate="onBlur"
                required
                autoComplete="email"
              />
            </FieldGroup>
            <Button type="submit" variant="primary" loading={loading} className="w-full mt-3">
              Send sign-in code
            </Button>
          </Fieldset>
        </form>

        <OrDivider />
        <GoogleButton />

        <p className="mt-6 text-center text-xs font-body text-ink-500 dark:text-ink-300">
          Already have an account?{' '}
          <Hyperlink href="#" className="font-semibold">
            Sign in
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
            setStep('capture');
            setOtp('');
            setError('');
          }}
          className="flex items-center gap-1.5 text-xs font-semibold font-body text-ink-500 hover:text-ink-700 dark:text-ink-300 dark:hover:text-ink-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <h1 className="text-xl font-bold font-display text-ink-900 dark:text-ink-50 mb-1">
          Check your inbox
        </h1>
        <p className="text-sm font-body text-ink-500 dark:text-ink-300 mb-6">
          We sent a 6-digit code to{' '}
          <span className="font-medium text-ink-700 dark:text-ink-200">{masked}</span>. Enter it
          below to verify your email and create your account.
        </p>

        <Fieldset>
          <Legend className="sr-only">Email verification code</Legend>
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
            {loading ? 'Verifying…' : 'Verify email'}
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
              Didn't get it?{' '}
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
        title="You're all set!"
        body={`Your account for ${masked} has been created and verified.`}
        onReset={() => {
          setStep('capture');
          setEmail('');
          setOtp('');
          setError('');
        }}
      />
    </AuthShell>
  );
}

export const EmailOnly: Story = {
  name: 'Email only — passwordless',
  render: () => <EmailOnlyForm />,
};
