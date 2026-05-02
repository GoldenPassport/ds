import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, CheckCircle, Globe, Shield, Clock, Star, Users, TrendingUp } from 'lucide-react';
import { Button } from '../components/Button';

const meta = {
  title: 'Page Sections/Content',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared primitives ─────────────────────────────────────

/** Eyebrow label above a section heading */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold font-body tracking-widest uppercase text-primary-800 dark:text-primary-400 mb-3">
      {children}
    </p>
  );
}

/** Standard section heading */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl md:text-4xl font-bold font-display text-ink-900 dark:text-ink-50 leading-tight tracking-tight">
      {children}
    </h2>
  );
}

/** Abstract image placeholder — GP gold/ink palette */
function ImagePlaceholder({
  className = '',
  accent = 'gold',
}: {
  className?: string;
  accent?: 'gold' | 'slate' | 'green';
}) {
  const configs = {
    gold:  { bg: 'from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20', c1: '#F5C200', c2: '#A37C00' },
    slate: { bg: 'from-slate-100 to-slate-200 dark:from-slate-900/40 dark:to-slate-800/30',         c1: '#3460A0', c2: '#1A3564' },
    green: { bg: 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20',     c1: '#10B981', c2: '#059669' },
  };
  const cfg = configs[accent];
  return (
    <div
      className={`bg-gradient-to-br ${cfg.bg} rounded-2xl overflow-hidden flex items-center justify-center ${className}`}
    >
      <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
        {/* Layered circles */}
        <circle cx="240" cy="180" r="140" fill={cfg.c1} fillOpacity="0.12" />
        <circle cx="240" cy="180" r="90"  fill={cfg.c1} fillOpacity="0.16" />
        <circle cx="240" cy="180" r="48"  fill={cfg.c1} fillOpacity="0.30" />
        {/* Accent ring */}
        <circle cx="240" cy="180" r="48" fill="none" stroke={cfg.c2} strokeWidth="2" strokeOpacity="0.5" />
        {/* Globe grid lines */}
        <ellipse cx="240" cy="180" rx="90" ry="48" fill="none" stroke={cfg.c2} strokeWidth="1.5" strokeOpacity="0.3" />
        <line x1="240" y1="90" x2="240" y2="270" stroke={cfg.c2} strokeWidth="1.5" strokeOpacity="0.3" />
        {/* Decorative dots */}
        {[[120, 100], [360, 100], [360, 260], [120, 260], [240, 60], [240, 300]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill={cfg.c1} fillOpacity="0.5" />
        ))}
      </svg>
    </div>
  );
}

/** Mini browser-framed app mockup */
function MiniAppMockup() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900">
      {/* Chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 bg-ink-50 dark:bg-ink-800 border-b border-ink-200 dark:border-ink-700">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <div className="ml-3 h-5 flex-1 max-w-[200px] rounded-md bg-ink-200 dark:bg-ink-700" />
      </div>
      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Applications', value: '12', color: 'text-primary-800 dark:text-primary-400' },
            { label: 'In Progress', value: '4',  color: 'text-slate-600 dark:text-slate-400' },
            { label: 'Approved',    value: '8',  color: 'text-green-600 dark:text-green-400' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-ink-50 dark:bg-ink-800 p-3 text-center">
              <p className={`text-xl font-bold font-display ${s.color}`}>{s.value}</p>
              <p className="text-[11px] font-body text-ink-500 dark:text-ink-300 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[
            { country: '🇵🇹 Portugal D7', status: 'Approved',  cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
            { country: '🇲🇹 Malta IIP',   status: 'In Review', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
            { country: '🇬🇷 Greece GV',   status: 'Draft',     cls: 'bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-300' },
          ].map((row) => (
            <div key={row.country} className="flex items-center justify-between rounded-lg bg-ink-50 dark:bg-ink-800 px-3 py-2">
              <span className="text-sm font-body font-medium text-ink-700 dark:text-ink-200">{row.country}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.cls}`}>{row.status}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs font-body font-medium text-ink-700 dark:text-ink-200">Portugal D7 — Documents</span>
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

/** Testimonial block */
function Testimonial({
  quote,
  name,
  title,
  initials,
}: {
  quote: string;
  name: string;
  title: string;
  initials: string;
}) {
  return (
    <figure className="relative">
      {/* Opening quote mark */}
      <svg
        aria-hidden="true"
        className="absolute -top-4 -left-2 w-10 h-10 text-primary-200 dark:text-primary-900"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179Zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179Z" />
      </svg>
      <blockquote className="relative pl-6 text-lg md:text-xl font-body italic text-ink-600 dark:text-ink-300 leading-relaxed">
        {quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-4">
        <div className="flex-shrink-0 w-11 h-11 rounded-full bg-primary-500/15 dark:bg-primary-500/20 flex items-center justify-center">
          <span className="text-sm font-bold font-display text-primary-800 dark:text-primary-400">
            {initials}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">{name}</p>
          <p className="text-sm font-body text-ink-500 dark:text-ink-300">{title}</p>
        </div>
      </figcaption>
    </figure>
  );
}

// ═══════════════════════════════════════════════════════════
// 1 — Centered
// ═══════════════════════════════════════════════════════════

export const Centered: Story = {
  name: 'Centered',
  render: () => (
    <section className="bg-white dark:bg-ink-900 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <Eyebrow>Our mission</Eyebrow>
        <SectionHeading>
          Making global mobility accessible to everyone
        </SectionHeading>

        <div className="mt-8 space-y-6 text-base md:text-lg font-body text-ink-600 dark:text-ink-300 leading-relaxed">
          <p>
            Golden Passport was founded on a simple belief: the ability to live, work, and raise
            a family wherever you choose should not be limited to the ultra-wealthy. Second
            citizenship and residency programs have historically been the preserve of those with
            expensive lawyers and insider connections — we are changing that.
          </p>
          <p>
            Our platform combines deep legal expertise with purpose-built technology to give every
            applicant the same quality of guidance that was once available only to the world's
            most privileged. From the moment you create an account to the day your new passport
            arrives, we manage every detail on your behalf.
          </p>
        </div>

        <div className="my-10 border-l-4 border-primary-400 dark:border-primary-600 pl-6">
          <p className="text-xl font-body italic text-ink-700 dark:text-ink-200 leading-relaxed">
            "We believe in a world where borders are a choice, not a constraint — and where
            every family can build the life they envision, wherever that may be."
          </p>
          <p className="mt-3 text-sm font-semibold font-body text-ink-500 dark:text-ink-400">
            — James Harrington, Co-Founder & CEO
          </p>
        </div>

        <div className="space-y-6 text-base md:text-lg font-body text-ink-600 dark:text-ink-300 leading-relaxed">
          <p>
            Today, Golden Passport works with applicants from 90+ countries, across more than
            40 residency and citizenship programs. Our team of licensed immigration lawyers,
            document specialists, and client advisors has a combined track record of over 12,000
            successful applications — with a 98% first-submission approval rate.
          </p>
          <p>
            Whether you are seeking an EU residency through Portugal's D7 visa, exploring
            Malta's citizenship-by-investment scheme, or planning a longer-term move to the UAE,
            our advisors will identify the programs that best match your timeline, budget, and
            long-term goals.
          </p>
        </div>

        <div className="mt-10">
          <Button variant="primary" size="lg">
            Start your journey
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  ),
};

// ═══════════════════════════════════════════════════════════
// 2 — Two columns with screenshot
// ═══════════════════════════════════════════════════════════

const features = [
  {
    icon: Globe,
    title: '40+ programs worldwide',
    desc: 'Portugal, Malta, Greece, UAE, Caribbean and more — all compared side-by-side so you can pick the right fit for your family.',
  },
  {
    icon: Shield,
    title: 'Lawyer-reviewed, every step',
    desc: 'Every application is prepared and reviewed by a licensed immigration attorney before it reaches the immigration authority.',
  },
  {
    icon: Clock,
    title: 'Real-time status tracking',
    desc: 'Know exactly where your application stands at every stage, with plain-English status updates pushed directly to your inbox.',
  },
  {
    icon: CheckCircle,
    title: '98% first-submission approval',
    desc: 'We only submit applications we are confident will be approved. Our track record across 12,000+ cases speaks for itself.',
  },
];

export const TwoColumnsWithScreenshot: Story = {
  name: 'Two columns with screenshot',
  render: () => (
    <section className="bg-ink-50 dark:bg-ink-900 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <Eyebrow>Everything you need</Eyebrow>
          <SectionHeading>
            One platform. Every step of your citizenship journey.
          </SectionHeading>
          <p className="mt-5 text-lg font-body text-ink-500 dark:text-ink-300 leading-relaxed">
            From selecting the right program to celebrating your new passport,
            Golden Passport handles every detail — so you can focus on what comes next.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — feature list */}
          <div className="space-y-10">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-5">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-500/10 dark:bg-primary-500/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-800 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-ink-900 dark:text-ink-50 mb-1">
                    {title}
                  </h3>
                  <p className="text-sm font-body text-ink-500 dark:text-ink-300 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="primary" size="lg">
              See all features
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Right — app screenshot */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-3xl opacity-20 blur-3xl -z-10"
              style={{ background: 'radial-gradient(circle, #F5C200 0%, transparent 70%)' }}
            />
            <MiniAppMockup />
          </div>
        </div>
      </div>
    </section>
  ),
};

// ═══════════════════════════════════════════════════════════
// 3 — Split with image
// ═══════════════════════════════════════════════════════════

const steps = [
  {
    eyebrow: 'Step 1',
    heading: 'Discover your options',
    body: 'Complete a short eligibility questionnaire and our platform instantly compares every program you qualify for — ranked by cost, timeline, and lifestyle fit. No sales call required.',
    accent: 'gold' as const,
  },
  {
    eyebrow: 'Step 2',
    heading: 'Prepare your application',
    body: 'Your dedicated case manager and assigned immigration lawyer collect, translate, and notarise every document. Our AI-powered checklist ensures nothing slips through the cracks.',
    accent: 'slate' as const,
  },
  {
    eyebrow: 'Step 3',
    heading: 'Receive your approval',
    body: 'We submit your completed application directly to the immigration authority and monitor it in real time. You will receive plain-English updates at every milestone until your approval lands.',
    accent: 'green' as const,
  },
];

export const SplitWithImage: Story = {
  name: 'Split with image',
  render: () => (
    <section className="bg-white dark:bg-ink-900 py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl mb-16">
          <Eyebrow>How it works</Eyebrow>
          <SectionHeading>
            From first question to new passport in three steps
          </SectionHeading>
        </div>

        <div className="space-y-24">
          {steps.map((step, i) => (
            <div
              key={step.eyebrow}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? 'lg:[&>*:first-child]:order-last' : ''
              }`}
            >
              {/* Text */}
              <div>
                <p className="text-sm font-semibold font-body tracking-widest uppercase text-primary-800 dark:text-primary-400 mb-3">
                  {step.eyebrow}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold font-display text-ink-900 dark:text-ink-50 leading-tight mb-5">
                  {step.heading}
                </h3>
                <p className="text-base md:text-lg font-body text-ink-500 dark:text-ink-300 leading-relaxed">
                  {step.body}
                </p>
              </div>

              {/* Image */}
              <ImagePlaceholder accent={step.accent} className="aspect-[4/3] w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
};

// ═══════════════════════════════════════════════════════════
// 4 — With testimonial
// ═══════════════════════════════════════════════════════════

export const WithTestimonial: Story = {
  name: 'With testimonial',
  render: () => (
    <section className="bg-ink-50 dark:bg-ink-900 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <Eyebrow>Why clients choose us</Eyebrow>
        <SectionHeading>
          More than an application — a lifetime of possibilities
        </SectionHeading>

        <div className="mt-8 space-y-6 text-base md:text-lg font-body text-ink-600 dark:text-ink-300 leading-relaxed">
          <p>
            A second citizenship is one of the most consequential decisions a family can make.
            It affects where your children go to school, where you can work without a visa,
            and where you can take shelter if political or economic circumstances change at home.
          </p>
          <p>
            That is why we treat every application as a long-term relationship, not a transaction.
            Our advisors take the time to understand your full situation before recommending a
            program — and our lawyers remain available to you long after your passport arrives.
          </p>
        </div>

        {/* Embedded testimonial */}
        <div className="my-12 rounded-2xl bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 p-8 shadow-sm">
          <Testimonial
            quote="The Golden Passport team turned what felt like an impossible maze of paperwork into a smooth, well-managed process. Six months later my family and I have Portuguese residency — and a clear path to citizenship. I cannot recommend them highly enough."
            name="Priya Sharma"
            title="Tech entrepreneur, Mumbai → Lisbon"
            initials="PS"
          />
        </div>

        <div className="space-y-6 text-base md:text-lg font-body text-ink-600 dark:text-ink-300 leading-relaxed">
          <p>
            Stories like Priya's are why we built Golden Passport. The same outcome — a warm,
            stable European base for a young family — had previously required a specialist law
            firm charging €20,000 in legal fees. Our platform delivers the same result for a
            fraction of the cost, without sacrificing an ounce of quality or care.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Button variant="primary" size="lg">
            Read more stories
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="lg">
            Book a free consultation
          </Button>
        </div>
      </div>
    </section>
  ),
};

// ═══════════════════════════════════════════════════════════
// 5 — With testimonial and stats
// ═══════════════════════════════════════════════════════════

const stats = [
  { label: 'Countries covered', value: '90+', icon: Globe },
  { label: 'Applications submitted', value: '12,000+', icon: Users },
  { label: 'Approval rate', value: '98%', icon: TrendingUp },
  { label: 'Average timeline', value: '6 months', icon: Clock },
];

export const WithTestimonialAndStats: Story = {
  name: 'With testimonial and stats',
  render: () => (
    <section className="bg-white dark:bg-ink-900 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — heading + body */}
          <div>
            <Eyebrow>Our track record</Eyebrow>
            <SectionHeading>
              Proven results across 90 countries and 40+ programs
            </SectionHeading>
            <p className="mt-5 text-lg font-body text-ink-500 dark:text-ink-300 leading-relaxed">
              Since 2018, Golden Passport has helped thousands of families secure their
              second citizenship and residency. Our numbers reflect a simple commitment:
              we only take cases we know we can win.
            </p>

            {/* Stats grid */}
            <div className="mt-10 grid grid-cols-2 gap-6">
              {stats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-700 p-5"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary-500/10 dark:bg-primary-500/15 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4 text-primary-800 dark:text-primary-400" />
                  </div>
                  <p className="text-2xl font-bold font-display text-ink-900 dark:text-ink-50">
                    {value}
                  </p>
                  <p className="text-sm font-body text-ink-500 dark:text-ink-300 mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button variant="primary" size="lg">
                Start your application
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right — testimonial */}
          <div className="rounded-2xl bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-700 p-10">
            {/* Stars */}
            <div className="flex gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-primary-600 dark:text-primary-400"
                  fill="currentColor"
                />
              ))}
            </div>

            <Testimonial
              quote="I had looked at other immigration law firms and been quoted fees that made the whole idea feel out of reach. Golden Passport changed that. Professional, transparent, and genuinely invested in our outcome — they delivered exactly what they promised."
              name="Daniel & Sofia Krause"
              title="Business owners, Berlin → Malta"
              initials="DK"
            />

            {/* Second shorter quote */}
            <div className="mt-10 pt-10 border-t border-ink-200 dark:border-ink-700">
              <Testimonial
                quote="My UAE Golden Visa arrived in under five months. The dashboard made it easy to see exactly what was needed at every stage — no chasing emails, no surprises."
                name="Aisha Al-Rashid"
                title="Consultant, London → Dubai"
                initials="AA"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  ),
};

// ═══════════════════════════════════════════════════════════
// 6 — With image titles
// ═══════════════════════════════════════════════════════════

const paths = [
  {
    accent: 'gold' as const,
    eyebrow: 'Investment pathway',
    title: 'Citizenship by investment',
    desc: 'Make a qualifying investment — real estate, government bonds, or a national development fund contribution — and receive full citizenship, often within 12–18 months.',
    programs: ['Malta IIP', 'St Kitts & Nevis', 'Vanuatu'],
  },
  {
    accent: 'slate' as const,
    eyebrow: 'Residency first',
    title: 'Residency leading to citizenship',
    desc: 'Establish legal residency through income-based or investment visas, live in the country for the required period, and naturalise as a citizen — often the most cost-effective route.',
    programs: ['Portugal D7', 'Greece GV', 'Spain NLV'],
  },
  {
    accent: 'green' as const,
    eyebrow: 'Work & lifestyle',
    title: 'Digital nomad & work visas',
    desc: 'Relocate as a remote worker or entrepreneur with a dedicated visa designed for location-independent professionals. No minimum investment required.',
    programs: ['Portugal NHR', 'UAE Freelance', 'Costa Rica Rentista'],
  },
];

export const WithImageTitles: Story = {
  name: 'With image titles',
  render: () => (
    <section className="bg-ink-50 dark:bg-ink-900 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl mb-14">
          <Eyebrow>Three paths to global mobility</Eyebrow>
          <SectionHeading>
            Find the route that fits your life
          </SectionHeading>
          <p className="mt-5 text-lg font-body text-ink-500 dark:text-ink-300 leading-relaxed">
            There is no single best path to a second passport. The right program depends on your
            timeline, budget, lifestyle preferences, and where you ultimately want to settle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {paths.map((path) => (
            <div
              key={path.title}
              className="bg-white dark:bg-ink-800 rounded-2xl border border-ink-100 dark:border-ink-700 overflow-hidden shadow-sm"
            >
              {/* Image / illustration header */}
              <ImagePlaceholder accent={path.accent} className="aspect-[16/9]" />

              {/* Content */}
              <div className="p-7">
                <p className="text-xs font-semibold font-body tracking-widest uppercase text-primary-800 dark:text-primary-400 mb-2">
                  {path.eyebrow}
                </p>
                <h3 className="text-lg font-bold font-display text-ink-900 dark:text-ink-50 mb-3">
                  {path.title}
                </h3>
                <p className="text-sm font-body text-ink-500 dark:text-ink-300 leading-relaxed mb-5">
                  {path.desc}
                </p>

                {/* Example programs */}
                <div className="flex flex-wrap gap-2">
                  {path.programs.map((prog) => (
                    <span
                      key={prog}
                      className="text-xs font-semibold font-body px-3 py-1 rounded-full bg-ink-100 dark:bg-ink-700 text-ink-600 dark:text-ink-300"
                    >
                      {prog}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
};

// ═══════════════════════════════════════════════════════════
// 7 — With sticky product screenshot
// ═══════════════════════════════════════════════════════════

const scrollSections = [
  {
    eyebrow: 'Eligibility check',
    heading: 'Know your options in minutes',
    body: 'Answer a short questionnaire about your nationality, income sources, and investment budget. Our algorithm instantly compares every program you qualify for and ranks them by fit — no waiting for a callback.',
    items: ['Instant eligibility check', 'Side-by-side program comparison', 'Timeline and cost estimates'],
  },
  {
    eyebrow: 'Document preparation',
    heading: 'We handle every document',
    body: 'Your case manager creates a personalised checklist and guides you through uploading each document. We coordinate translations, apostilles, and notarisations on your behalf.',
    items: ['AI-powered document checklist', 'In-house translation service', 'Secure encrypted vault'],
  },
  {
    eyebrow: 'Submission & tracking',
    heading: 'Submit with confidence',
    body: 'Your assigned immigration lawyer reviews the complete application before submission. Once filed, you track every government milestone in real time — no email chasing required.',
    items: ['Lawyer sign-off before submission', 'Real-time government tracking', 'Plain-English status updates'],
  },
  {
    eyebrow: 'Approval & beyond',
    heading: 'Your new passport — and what comes next',
    body: 'When your approval arrives we guide you through the oath of allegiance, biometric appointments, and passport collection. Our team remains available for future applications and renewals.',
    items: ['Ceremony and appointment scheduling', 'Passport collection guidance', 'Ongoing support for renewals'],
  },
];

export const WithStickyScreenshot: Story = {
  name: 'With sticky screenshot',
  render: () => (
    <section className="bg-white dark:bg-ink-900 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl mb-16">
          <Eyebrow>Platform walkthrough</Eyebrow>
          <SectionHeading>
            See exactly how Golden Passport works
          </SectionHeading>
          <p className="mt-5 text-lg font-body text-ink-500 dark:text-ink-300 leading-relaxed">
            Every step of your journey lives inside a single, beautifully designed workspace.
            Here's what you'll see from day one to passport day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — scrollable text sections */}
          <div className="space-y-20">
            {scrollSections.map((section) => (
              <div key={section.eyebrow}>
                <p className="text-xs font-semibold font-body tracking-widest uppercase text-primary-800 dark:text-primary-400 mb-3">
                  {section.eyebrow}
                </p>
                <h3 className="text-xl md:text-2xl font-bold font-display text-ink-900 dark:text-ink-50 leading-tight mb-4">
                  {section.heading}
                </h3>
                <p className="text-base font-body text-ink-500 dark:text-ink-300 leading-relaxed mb-5">
                  {section.body}
                </p>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-primary-800 dark:text-primary-400 shrink-0" />
                      <span className="text-sm font-body text-ink-600 dark:text-ink-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right — sticky screenshot */}
          <div className="hidden lg:block">
            <div className="sticky top-12">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-3xl opacity-20 blur-3xl -z-10"
                  style={{ background: 'radial-gradient(circle, #F5C200 0%, transparent 70%)' }}
                />
                <MiniAppMockup />
              </div>
            </div>
          </div>

          {/* Mobile — static screenshot below content */}
          <div className="lg:hidden">
            <MiniAppMockup />
          </div>
        </div>
      </div>
    </section>
  ),
};
