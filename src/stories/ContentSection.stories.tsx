import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, CheckCircle, Globe, Users, TrendingUp, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { Blockquote } from '../components/Blockquote';
import { Stats } from '../components/Stats';

const meta = {
  title: 'Example Sections/Content',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared style tokens ───────────────────────────────────

const eyebrowCls =
  'text-sm font-semibold font-body tracking-widest uppercase text-primary-800 dark:text-primary-400 mb-3';

const h2Cls =
  'text-3xl md:text-4xl font-bold font-display text-ink-900 dark:text-ink-50 leading-tight tracking-tight';

const h3Cls =
  'text-2xl font-bold font-display text-ink-900 dark:text-ink-50 leading-tight';

const bodyCls = 'font-body text-base leading-relaxed text-ink-600 dark:text-ink-300';

// ── 1. Centered ───────────────────────────────────────────

export const Centered: Story = {
  render: () => (
    <section className="bg-white dark:bg-ink-900 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className={eyebrowCls}>Lorem ipsum</p>
          <h2 className={`${h2Cls} mb-6`}>
            Dolor sit amet consectetur adipiscing
          </h2>

          <p className={`${bodyCls} mb-5`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <p className={`${bodyCls} mb-5`}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum. Pellentesque habitant morbi tristique
            senectus et netus et malesuada fames.
          </p>

          <p className={`${bodyCls} mb-8`}>
            Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis
            molestie pretium placerat, arcu purus aliquam quam, vitae scelerisque purus arcu at
            risus. Sed vel lectus quis lorem vestibulum bibendum in sit amet nunc.
          </p>

          <div className="mb-10 text-left">
            <Blockquote variant="bordered">
              Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
              egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet,
              ante.
            </Blockquote>
          </div>

          <Button variant="primary" size="md" radius="rounded">
            Learn more <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  ),
};

// ── 2. TwoColumns ─────────────────────────────────────────

const checkItems = [
  'Ut enim ad minim veniam, quis nostrud exercitation',
  'Duis aute irure dolor in reprehenderit in voluptate',
  'Excepteur sint occaecat cupidatat non proident',
  'Nulla gravida orci a odio nullam varius turpis',
];

export const TwoColumns: Story = {
  render: () => (
    <section className="bg-ink-50 dark:bg-ink-900 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <p className={eyebrowCls}>Lorem ipsum</p>
            <h2 className={`${h2Cls} mb-5`}>
              Adipiscing elit sed do eiusmod tempor
            </h2>
            <p className={`${bodyCls} mb-8`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <ul className="space-y-4 mb-10" role="list">
              {checkItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-5 h-5 mt-0.5 shrink-0 text-primary-700 dark:text-primary-400"
                    aria-hidden="true"
                  />
                  <span className={bodyCls}>{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="primary" size="md" radius="rounded">
              Get started <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>

          {/* Right: decorative placeholder */}
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20" />
        </div>
      </div>
    </section>
  ),
};

// ── 3. WithTestimonial ────────────────────────────────────

export const WithTestimonial: Story = {
  render: () => (
    <section className="bg-white dark:bg-ink-900 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className={eyebrowCls}>Dolor sit amet</p>
          <h2 className={`${h2Cls} mb-5`}>
            Consectetur adipiscing elit ut aliquam
          </h2>
          <p className={`${bodyCls} mb-10`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
          <Blockquote
            variant="card"
            author="Jane Placeholder"
            source="Lorem Ipsum Review"
          >
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
            egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet ante.
            Donec eu libero sit amet quam egestas semper.
          </Blockquote>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <p className={`${bodyCls} mb-8`}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="md" radius="rounded">
              Get started <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="md" radius="rounded">
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </section>
  ),
};

// ── 4. WithStats ──────────────────────────────────────────

export const WithStats: Story = {
  render: () => (
    <section className="bg-ink-50 dark:bg-ink-900 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className={eyebrowCls}>Incididunt ut labore</p>
          <h2 className={`${h2Cls} mb-5`}>
            Dolore magna aliqua enim ad minim veniam
          </h2>
          <p className={`${bodyCls}`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud
            exercitation.
          </p>
        </div>

        <Stats
          variant="cards"
          columns={4}
          items={[
            {
              label: 'Lorem ipsum users',
              value: '10k+',
              icon: <Globe className="w-5 h-5" aria-hidden="true" />,
              description: 'Across dolor sit amet',
            },
            {
              label: 'Satisfaction rate',
              value: '98%',
              icon: <Users className="w-5 h-5" aria-hidden="true" />,
              description: 'Consectetur adipiscing',
            },
            {
              label: 'Average rating',
              value: '4.9★',
              icon: <TrendingUp className="w-5 h-5" aria-hidden="true" />,
              description: 'Sed do eiusmod tempor',
            },
            {
              label: 'Support response',
              value: '24h',
              icon: <Clock className="w-5 h-5" aria-hidden="true" />,
              description: 'Incididunt ut labore',
            },
          ]}
        />
      </div>
    </section>
  ),
};

// ── 5. SplitWithImage ─────────────────────────────────────

interface SplitRowProps {
  step: string;
  heading: string;
  body: string;
  gradient: string;
  flip?: boolean;
}

function SplitRow({ step, heading, body, gradient, flip = false }: SplitRowProps) {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center${
        flip ? ' lg:[&>*:first-child]:order-last' : ''
      }`}
    >
      {/* Text side */}
      <div>
        <p className={eyebrowCls}>{step}</p>
        <h3 className={`${h3Cls} mb-4`}>{heading}</h3>
        <p className={bodyCls}>{body}</p>
      </div>

      {/* Image placeholder */}
      <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${gradient}`} />
    </div>
  );
}

const splitRows: SplitRowProps[] = [
  {
    step: 'Step one',
    heading: 'Lorem ipsum dolor sit amet consectetur',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    gradient:
      'from-sky-100 to-sky-200 dark:from-sky-900/30 dark:to-sky-800/20',
    flip: false,
  },
  {
    step: 'Step two',
    heading: 'Adipiscing elit sed do eiusmod tempor',
    body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    gradient:
      'from-violet-100 to-violet-200 dark:from-violet-900/30 dark:to-violet-800/20',
    flip: true,
  },
  {
    step: 'Step three',
    heading: 'Incididunt ut labore et dolore magna',
    body: 'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis molestie pretium placerat, arcu purus aliquam quam, vitae scelerisque purus arcu at risus. Sed vel lectus quis lorem vestibulum bibendum.',
    gradient:
      'from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/20',
    flip: false,
  },
];

export const SplitWithImage: Story = {
  render: () => (
    <section className="bg-white dark:bg-ink-900 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-20 lg:gap-28">
        {splitRows.map((row) => (
          <SplitRow key={row.step} {...row} />
        ))}
      </div>
    </section>
  ),
};
