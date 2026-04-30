import type { Meta } from '@storybook/react';
import { Hyperlink } from '../components/Hyperlink';

const meta: Meta = {
  title: 'Styling/Typography',
  parameters: { controls: { hideNoControlsWarning: true } },
};
export default meta;

// ── Helpers ───────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-6 py-4 border-b border-ink-100 dark:border-ink-700 last:border-0">
      <div className="w-36 shrink-0">
        <p className="text-xs font-mono text-ink-500 dark:text-ink-300">{label}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-1 text-xs font-semibold font-body uppercase tracking-widest text-ink-600 dark:text-ink-300">
        {title}
      </h2>
      <div className="rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-sm overflow-hidden px-6">
        {children}
      </div>
    </div>
  );
}

// ── Story ─────────────────────────────────────────────────

export const Typefaces = {
  name: 'Typography',
  render: () => (
    <div className="max-w-3xl flex flex-col gap-10">
      {/* Font families */}
      <Section title="Font Families">
        <Row label="font-display">
          <p className="text-2xl font-display font-bold text-ink-900 dark:text-ink-50">
            Plus Jakarta Sans
          </p>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mt-0.5">
            Headings, titles, display text
          </p>
        </Row>
        <Row label="font-body">
          <p className="text-2xl font-body font-normal text-ink-900 dark:text-ink-50">DM Sans</p>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mt-0.5">
            Body copy, labels, UI text
          </p>
        </Row>
        <Row label="font-mono">
          <p className="text-2xl font-mono font-normal text-ink-900 dark:text-ink-50">
            JetBrains Mono
          </p>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mt-0.5">
            Code, tokens, technical values
          </p>
        </Row>
      </Section>

      {/* Type scale */}
      <Section title="Type Scale">
        {[
          { cls: 'text-4xl', label: 'text-4xl  · 2.25rem · 36px', sample: 'Display heading' },
          { cls: 'text-3xl', label: 'text-3xl  · 1.875rem · 30px', sample: 'Hero heading' },
          { cls: 'text-2xl', label: 'text-2xl  · 1.5rem · 24px', sample: 'Page heading' },
          { cls: 'text-xl', label: 'text-xl   · 1.25rem · 20px', sample: 'Section heading' },
          { cls: 'text-lg', label: 'text-lg   · 1.125rem · 18px', sample: 'Card heading' },
          { cls: 'text-base', label: 'text-base · 1rem · 16px', sample: 'Body text' },
          {
            cls: 'text-sm',
            label: 'text-sm   · 0.875rem · 14px',
            sample: 'Secondary text, labels',
          },
          { cls: 'text-xs', label: 'text-xs   · 0.75rem · 12px', sample: 'Captions, metadata' },
        ].map(({ cls, label, sample }) => (
          <Row key={cls} label={label}>
            <p
              className={`${cls} font-body font-medium text-ink-900 dark:text-ink-50 leading-tight`}
            >
              {sample}
            </p>
          </Row>
        ))}
      </Section>

      {/* Font weights */}
      <Section title="Font Weights">
        {[
          {
            weight: 'font-normal',
            label: 'font-normal  · 400',
            sample: 'The quick brown fox jumps over the lazy dog',
          },
          {
            weight: 'font-medium',
            label: 'font-medium  · 500',
            sample: 'The quick brown fox jumps over the lazy dog',
          },
          {
            weight: 'font-semibold',
            label: 'font-semibold· 600',
            sample: 'The quick brown fox jumps over the lazy dog',
          },
          {
            weight: 'font-bold',
            label: 'font-bold    · 700',
            sample: 'The quick brown fox jumps over the lazy dog',
          },
          {
            weight: 'font-extrabold',
            label: 'font-extrabold· 800',
            sample: 'The quick brown fox jumps over the lazy dog',
          },
        ].map(({ weight, label, sample }) => (
          <Row key={weight} label={label}>
            <p className={`text-base font-body ${weight} text-ink-900 dark:text-ink-50`}>
              {sample}
            </p>
          </Row>
        ))}
      </Section>

      {/* DS text styles */}
      <Section title="Design System Text Styles">
        <Row label="Page title">
          <h1 className="text-2xl font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight">
            Dashboard
          </h1>
        </Row>
        <Row label="Section title">
          <h2 className="text-base font-semibold font-display text-ink-900 dark:text-ink-50 tracking-tight">
            Team members
          </h2>
        </Row>
        <Row label="Card title">
          <h3 className="text-sm font-semibold font-display text-ink-900 dark:text-ink-50">
            GraphQL API
          </h3>
        </Row>
        <Row label="Body">
          <p className="text-sm font-body text-ink-700 dark:text-ink-200 leading-relaxed">
            Manage your workspace settings, members, and billing from one place.
          </p>
        </Row>
        <Row label="Secondary">
          <p className="text-sm font-body text-ink-500 dark:text-ink-300">
            Last updated 2 hours ago · 4 active members
          </p>
        </Row>
        <Row label="Label / caption">
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 uppercase tracking-wide">
            Active workspaces
          </p>
        </Row>
        <Row label="Code / mono">
          <p className="text-sm font-mono text-ink-700 dark:text-ink-200 bg-ink-100 dark:bg-ink-700 px-2 py-0.5 rounded">
            GP.colors.primary500
          </p>
        </Row>
        <Row label="Link">
          <Hyperlink href="#" className="text-sm font-medium">
            View all projects →
          </Hyperlink>
        </Row>
      </Section>
    </div>
  ),
};
