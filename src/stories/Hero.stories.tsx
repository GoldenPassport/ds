import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, Globe, Shield, CheckCircle, ChevronRight, Sparkles, Play } from 'lucide-react';
import gpLogo from '../../assets/gp-logo.png';
import { Button } from '../components/Button';

const meta = {
  title: 'Example Sections/Hero',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared subcomponents ──────────────────────────────────

/** Minimal top nav — uses Tailwind dark: classes, no JS prop */
function Nav() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 md:px-10 border-b border-ink-100 dark:border-ink-700/60">
      <div className="flex items-center gap-2.5">
        <img src={gpLogo} alt="" aria-hidden="true" className="h-7 w-auto" />
        <span className="text-sm font-bold font-display tracking-tight text-ink-900 dark:text-ink-50">
          Golden Passport
        </span>
      </div>

      <div className="hidden md:flex items-center gap-7">
        {['Programs', 'How it works', 'Pricing', 'About'].map((item) => (
          <a
            key={item}
            href="#"
            className="text-sm font-body font-medium transition-colors text-ink-600 dark:text-ink-200 hover:text-ink-900 dark:hover:text-ink-50"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <a
          href="#"
          className="hidden md:block text-sm font-semibold font-body transition-colors text-ink-600 dark:text-ink-200 hover:text-ink-900 dark:hover:text-ink-50"
        >
          Sign in
        </a>
        <Button variant="primary" size="sm" radius="pill">
          Get started
        </Button>
      </div>
    </nav>
  );
}

/** Announcement pill — uses Tailwind dark: classes, no JS prop */
function Announcement({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 mb-6">
      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold font-body ring-1 bg-primary-500/10 text-primary-800 dark:text-primary-300 ring-primary-500/20 dark:ring-primary-500/30">
        <Sparkles className="w-3 h-3" />
        New
      </span>
      <span className="text-sm font-body text-ink-500 dark:text-ink-300">
        {children}
      </span>
      <ChevronRight className="w-4 h-4 text-ink-400 dark:text-ink-500" />
    </div>
  );
}

/** Social proof / trust badges — uses Tailwind dark: classes, no JS prop */
function TrustRow() {
  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <p className="text-xs font-body uppercase tracking-widest text-ink-500 dark:text-ink-400">
        Trusted by applicants from 90+ countries
      </p>
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4 text-primary-600 dark:text-primary-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1.5 text-sm font-semibold font-body text-ink-700 dark:text-ink-200">
          4.9
        </span>
        <span className="ml-1 text-sm font-body text-ink-500 dark:text-ink-300">
          (2,400+ reviews)
        </span>
      </div>
    </div>
  );
}

/** Browser-framed app dashboard mockup — uses Tailwind dark: classes */
function AppMockup() {
  const rows = [
    {
      country: '🇵🇹 Portugal D7',
      status: 'Approved',
      cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      country: '🇲🇹 Malta IIP',
      status: 'In Review',
      cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    },
    {
      country: '🇬🇷 Greece GV',
      status: 'Draft',
      cls: 'bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-300',
    },
  ];

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900">
      {/* Chrome bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 bg-ink-50 dark:bg-ink-800 border-b border-ink-200 dark:border-ink-700">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <div className="ml-3 h-5 flex-1 max-w-[180px] rounded-md bg-ink-200 dark:bg-ink-700" />
      </div>

      {/* Dashboard content */}
      <div className="p-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Applications', value: '12', color: 'text-primary-700 dark:text-primary-400' },
            { label: 'In Progress', value: '4', color: 'text-slate-600 dark:text-slate-400' },
            { label: 'Approved', value: '8', color: 'text-green-600 dark:text-green-400' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-ink-50 dark:bg-ink-800 p-3 text-center">
              <p className={`text-xl font-bold font-display ${s.color}`}>{s.value}</p>
              <p className="text-[11px] font-body text-ink-500 dark:text-ink-300 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Application rows */}
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.country}
              className="flex items-center justify-between rounded-lg bg-ink-50 dark:bg-ink-800 px-3 py-2"
            >
              <span className="text-sm font-body font-medium text-ink-700 dark:text-ink-200">
                {row.country}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.cls}`}>
                {row.status}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs font-body font-medium text-ink-700 dark:text-ink-200">
              Portugal D7 — Document collection
            </span>
            <span className="text-xs font-body text-ink-500 dark:text-ink-300">68%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-ink-100 dark:bg-ink-700">
            <div className="h-full w-[68%] rounded-full bg-primary-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Dark-framed code block */
function CodeBlock() {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-ink-700">
      {/* Chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 bg-ink-800">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-3 text-xs font-mono text-ink-400">apply.ts</span>
      </div>
      {/* Code */}
      <pre className="p-5 text-sm leading-relaxed bg-ink-900 text-ink-100 overflow-auto font-mono whitespace-pre">
        <span className="text-slate-400">import</span>
        {' { '}
        <span className="text-primary-400">GoldenPassport</span>
        {' } '}
        <span className="text-slate-400">from</span>
        {' '}
        <span className="text-green-400">'@gp/sdk'</span>
        {';'}
        {'\n\n'}
        <span className="text-slate-400">const</span>
        {' gp = '}
        <span className="text-slate-400">new</span>
        {' '}
        <span className="text-primary-400">GoldenPassport</span>
        {'({'}
        {'\n  '}
        <span className="text-slate-300">apiKey</span>
        {': process.env.'}
        <span className="text-primary-300">GP_API_KEY</span>
        {',\n});'}
        {'\n\n'}
        <span className="text-slate-400">const</span>
        {' application = '}
        <span className="text-slate-400">await</span>
        {' gp.'}
        <span className="text-primary-400">apply</span>
        {'({'}
        {'\n  '}
        <span className="text-slate-300">program</span>
        {': '}
        <span className="text-green-400">'portugal-d7'</span>
        {','}
        {'\n  '}
        <span className="text-slate-300">applicant</span>
        {': {'}
        {'\n    '}
        <span className="text-slate-300">name</span>
        {': '}
        <span className="text-green-400">'Alex Morgan'</span>
        {','}
        {'\n    '}
        <span className="text-slate-300">nationality</span>
        {': '}
        <span className="text-green-400">'US'</span>
        {','}
        {'\n  },'}
        {'\n});'}
        {'\n\n'}
        <span className="text-ink-500">{'// → { id: \'app_xyz\', status: \'submitted\' }'}</span>
      </pre>
    </div>
  );
}

/** Decorative feature pills — uses Tailwind dark: classes, no JS prop */
function FeaturePills() {
  const features = [
    { icon: Globe, label: '190+ countries' },
    { icon: Shield, label: 'Bank-grade security' },
    { icon: CheckCircle, label: 'Lawyer-reviewed' },
  ];
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      {features.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-body font-medium ring-1 bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-200 ring-ink-200 dark:ring-ink-700 shadow-sm dark:shadow-none"
        >
          <Icon className="w-4 h-4 text-primary-700 dark:text-primary-400" />
          {label}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 1 — Simple centered (light)
// ═══════════════════════════════════════════════════════════

export const SimpleCentered: Story = {
  name: 'Simple centered',
  render: () => (
    <div className="min-h-screen bg-white dark:bg-ink-900">
      <Nav />
      <div className="flex flex-col items-center text-center px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <Announcement>Citizenship by Investment programs now available</Announcement>

        <h1 className="text-4xl md:text-6xl font-bold font-display text-ink-900 dark:text-ink-50 leading-tight tracking-tight max-w-3xl">
          Your path to a{' '}
          <span className="text-primary-700 dark:text-primary-400">second passport</span>
          {', '}simplified.
        </h1>

        <p className="mt-6 text-lg md:text-xl font-body text-ink-500 dark:text-ink-300 max-w-xl leading-relaxed">
          Navigate global residency and citizenship programs with expert legal guidance,
          real-time application tracking, and a dedicated case manager — all in one place.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Button variant="primary" size="lg" radius="pill">
            Start your application
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="lg" radius="pill">
            <Play className="w-4 h-4" />
            Watch how it works
          </Button>
        </div>

        <FeaturePills />
        <TrustRow />
      </div>
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════
// 2 — Simple centered (dark)
// ═══════════════════════════════════════════════════════════

export const SimpleCenteredDark: Story = {
  name: 'Simple centered — dark',
  render: () => (
    // Wrap in .dark so Tailwind dark: classes activate regardless of Storybook theme
    <div className="dark">
      <div className="relative min-h-screen bg-ink-900">
        {/* Radial glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -10%, rgb(245 194 0 / 0.12) 0%, transparent 70%)',
          }}
        />

        <div className="relative">
          <Nav />
          <div className="flex flex-col items-center text-center px-6 pt-20 pb-24 md:pt-28 md:pb-32">
            <Announcement>
              Citizenship by Investment programs now available
            </Announcement>

            <h1 className="text-4xl md:text-6xl font-bold font-display text-ink-50 leading-tight tracking-tight max-w-3xl">
              Your path to a{' '}
              <span className="text-primary-400">second passport</span>
              {', '}simplified.
            </h1>

            <p className="mt-6 text-lg md:text-xl font-body text-ink-300 max-w-xl leading-relaxed">
              Navigate global residency and citizenship programs with expert legal guidance,
              real-time application tracking, and a dedicated case manager — all in one place.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <Button variant="primary" size="lg" radius="pill">
                Start your application
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="lg" radius="pill">
                <Play className="w-4 h-4" />
                Watch how it works
              </Button>
            </div>

            <FeaturePills />
            <TrustRow />
          </div>
        </div>
      </div>
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════
// 3 — Split with screenshot
// ═══════════════════════════════════════════════════════════

export const SplitWithScreenshot: Story = {
  name: 'Split with screenshot',
  render: () => (
    <div className="min-h-screen bg-white dark:bg-ink-900">
      <Nav />
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left — copy */}
        <div>
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold font-body
              bg-primary-500/10 text-primary-800 dark:text-primary-300 ring-1 ring-primary-500/20 mb-6"
          >
            <Sparkles className="w-3 h-3" />
            Now in beta — join 12,000+ applicants
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-display text-ink-900 dark:text-ink-50 leading-tight tracking-tight">
            Manage every application in one{' '}
            <span className="text-primary-700 dark:text-primary-400">dashboard</span>
          </h1>

          <p className="mt-5 text-lg font-body text-ink-500 dark:text-ink-300 leading-relaxed">
            From document collection to final approval, Golden Passport keeps your
            entire portfolio of residency and citizenship applications organised,
            on-track, and transparent.
          </p>

          <ul className="mt-7 space-y-3">
            {[
              'Real-time status updates from immigration authorities',
              'Secure document vault with e-signature support',
              'Dedicated licensed lawyer for every application',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-700 dark:text-primary-400 shrink-0 mt-0.5" />
                <span className="text-sm font-body text-ink-600 dark:text-ink-300">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="primary" size="lg" radius="pill">
              Start your application
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="lg" radius="pill">
              View demo
            </Button>
          </div>
        </div>

        {/* Right — app mockup */}
        <div className="relative">
          {/* Decorative glow */}
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-3xl opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #F5C200 0%, transparent 70%)' }}
          />
          <AppMockup />
        </div>
      </div>
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════
// 4 — Split with code example
// ═══════════════════════════════════════════════════════════

export const SplitWithCode: Story = {
  name: 'Split with code example',
  render: () => (
    // Wrap in .dark so Tailwind dark: classes activate regardless of Storybook theme
    <div className="dark">
      <div className="relative min-h-screen bg-ink-900">
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 0% 50%, rgb(245 194 0 / 0.08) 0%, transparent 60%)',
        }}
      />
      <div className="relative">
        <Nav />
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <div>
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold font-body
                bg-primary-500/10 text-primary-300 ring-1 ring-primary-500/30 mb-6"
            >
              <Sparkles className="w-3 h-3" />
              Developer API — now generally available
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-display text-ink-50 leading-tight tracking-tight">
              Build on the{' '}
              <span className="text-primary-400">Golden Passport</span>{' '}
              platform
            </h1>

            <p className="mt-5 text-lg font-body text-ink-300 leading-relaxed">
              A fully-typed TypeScript SDK, webhooks, and REST APIs give your team
              programmatic access to every residency and citizenship program we support.
            </p>

            <ul className="mt-7 space-y-3">
              {[
                'Submit and track applications via REST or GraphQL',
                'Webhook events for every status transition',
                'SOC 2 Type II certified — enterprise-ready',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-700 dark:text-primary-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-body text-ink-300">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button variant="primary" size="lg" radius="pill">
                Read the docs
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="lg" radius="pill">
                View on GitHub
              </Button>
            </div>
          </div>

          {/* Right — code block */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-3xl opacity-10 blur-3xl"
              style={{ background: 'radial-gradient(circle, #F5C200 0%, transparent 70%)' }}
            />
            <CodeBlock />
          </div>
        </div>
      </div>
      </div>
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════
// 5 — With app screenshot (centered + full-width mockup)
// ═══════════════════════════════════════════════════════════

export const WithAppScreenshot: Story = {
  name: 'With app screenshot',
  render: () => (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900">
      <Nav />

      {/* Hero text — centered */}
      <div className="flex flex-col items-center text-center px-6 pt-16 pb-12 md:pt-20 md:pb-16">
        <Announcement>Citizenship by Investment programs now available</Announcement>

        <h1 className="text-4xl md:text-6xl font-bold font-display text-ink-900 dark:text-ink-50 leading-tight tracking-tight max-w-3xl">
          The smarter way to{' '}
          <span className="text-primary-700 dark:text-primary-400">relocate globally</span>
        </h1>

        <p className="mt-5 text-lg md:text-xl font-body text-ink-500 dark:text-ink-300 max-w-xl leading-relaxed">
          Expert lawyers, AI-powered document review, and a single dashboard for every
          residency and citizenship application you'll ever need.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Button variant="primary" size="lg" radius="pill">
            Start free today
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="lg" radius="pill">
            Book a consultation
          </Button>
        </div>
      </div>

      {/* Full-width mockup */}
      <div className="mx-auto max-w-6xl px-6 md:px-10 pb-20">
        <div className="relative">
          {/* Glow underneath */}
          <div
            aria-hidden="true"
            className="absolute -inset-2 rounded-3xl opacity-30 blur-2xl -z-10"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, #F5C200 0%, transparent 70%)' }}
          />
          <AppMockup />
        </div>
      </div>
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════
// 6 — With bordered app screenshot
// ═══════════════════════════════════════════════════════════

export const WithBorderedAppScreenshot: Story = {
  name: 'With bordered app screenshot',
  render: () => (
    <div className="min-h-screen bg-white dark:bg-ink-900">
      <Nav />

      {/* Hero text */}
      <div className="flex flex-col items-center text-center px-6 pt-16 pb-12 md:pt-20 md:pb-16">
        <h1 className="text-4xl md:text-6xl font-bold font-display text-ink-900 dark:text-ink-50 leading-tight tracking-tight max-w-3xl">
          One platform.{' '}
          <span className="text-primary-700 dark:text-primary-400">Every passport.</span>
        </h1>

        <p className="mt-5 text-lg font-body text-ink-500 dark:text-ink-300 max-w-lg leading-relaxed">
          Track applications across 40+ residency and citizenship programs from a single,
          beautifully designed workspace.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Button variant="primary" size="lg" radius="pill">
            Get started free
          </Button>
          <Button variant="ghost" size="lg" radius="pill">
            See all programs
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bordered mockup with ring + shadow treatment */}
      <div className="mx-auto max-w-6xl px-6 md:px-10 pb-20">
        <div
          className="rounded-2xl ring-1 ring-ink-200 dark:ring-ink-700 shadow-2xl overflow-hidden"
          style={{ boxShadow: '0 32px 80px -12px rgb(14 13 11 / 0.18), 0 0 0 1px rgb(14 13 11 / 0.05)' }}
        >
          <AppMockup />
        </div>

        {/* Feature grid below screenshot */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: Globe,
              title: '40+ programs',
              desc: 'Portugal, Malta, Greece, UAE and dozens more — all in one place.',
            },
            {
              icon: Shield,
              title: 'Lawyer-vetted',
              desc: 'Every application reviewed by a licensed immigration attorney.',
            },
            {
              icon: CheckCircle,
              title: '98% approval rate',
              desc: "We only submit applications we're confident will be approved.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary-700 dark:text-primary-400" />
              </div>
              <h3 className="text-sm font-bold font-display text-ink-900 dark:text-ink-50">
                {title}
              </h3>
              <p className="text-sm font-body text-ink-500 dark:text-ink-300 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
