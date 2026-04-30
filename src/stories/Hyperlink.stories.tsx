import type { Meta, StoryObj } from '@storybook/react';
import { Hyperlink } from '../components/Hyperlink';

const meta = {
  title: 'Elements/Hyperlink',
  component: Hyperlink,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'muted', 'danger'] },
    underline: { control: 'select', options: ['hover', 'always', 'none'] },
    external: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Hyperlink>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    href: '#',
    children: 'Visit documentation',
    variant: 'default',
    underline: 'hover',
    external: false,
  },
};

// ── Variants ──────────────────────────────────────────────

export const Variants: Story = {
  name: 'Variants',
  args: { href: '', children: '' },
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-body text-ink-700 dark:text-ink-200">
        Read the{' '}
        <Hyperlink href="#" variant="default">
          getting started guide
        </Hyperlink>{' '}
        before proceeding.
      </p>
      <p className="text-sm font-body text-ink-700 dark:text-ink-200">
        Published by{' '}
        <Hyperlink href="#" variant="muted">
          Alex Johnson
        </Hyperlink>{' '}
        on 12 Apr 2025.
      </p>
      <p className="text-sm font-body text-ink-700 dark:text-ink-200">
        This action cannot be undone.{' '}
        <Hyperlink href="#" variant="danger">
          Delete account
        </Hyperlink>
      </p>
    </div>
  ),
};

// ── Underline options ─────────────────────────────────────

export const Underlines: Story = {
  name: 'Underline options',
  args: { href: '', children: '' },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['hover', 'always', 'none'] as const).map((u) => (
        <div key={u} className="flex items-center gap-3">
          <span className="w-16 text-xs font-mono text-ink-500 dark:text-ink-400">{u}</span>
          <Hyperlink href="#" underline={u}>
            Example link text
          </Hyperlink>
        </div>
      ))}
    </div>
  ),
};

// ── External link ─────────────────────────────────────────

export const External: Story = {
  name: 'External link',
  args: { href: '', children: '' },
  render: () => (
    <p className="text-sm font-body text-ink-700 dark:text-ink-200">
      See the full spec on{' '}
      <Hyperlink href="https://www.w3.org/WAI/WCAG21/" external>
        WCAG 2.1
      </Hyperlink>{' '}
      for accessibility guidance.
    </p>
  ),
};

// ── Inline in body text ───────────────────────────────────

export const InBodyText: Story = {
  name: 'In body text',
  args: { href: '', children: '' },
  render: () => (
    <div className="max-w-prose flex flex-col gap-4">
      <p className="text-base font-body text-ink-700 dark:text-ink-200 leading-relaxed">
        Golden Passport helps you manage the full applicant lifecycle — from{' '}
        <Hyperlink href="#">initial submission</Hyperlink> through to{' '}
        <Hyperlink href="#">document verification</Hyperlink> and final approval. Learn more in our{' '}
        <Hyperlink href="#" external>
          knowledge base
        </Hyperlink>
        .
      </p>
      <p className="text-sm font-body text-ink-500 dark:text-ink-300 leading-relaxed">
        By continuing you agree to our{' '}
        <Hyperlink href="#" variant="muted" underline="always">
          Terms of Service
        </Hyperlink>{' '}
        and{' '}
        <Hyperlink href="#" variant="muted" underline="always">
          Privacy Policy
        </Hyperlink>
        .
      </p>
    </div>
  ),
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  args: { href: '', children: '' },
  render: () => (
    <div className="flex flex-col gap-6">
      {(['default', 'muted', 'danger'] as const).map((v) => (
        <div key={v} className="flex flex-col gap-2">
          <span className="text-xs font-mono text-ink-500 dark:text-ink-400">{v}</span>
          <div className="flex items-center gap-6 flex-wrap">
            {(['hover', 'always', 'none'] as const).map((u) => (
              <Hyperlink key={u} href="#" variant={v} underline={u}>
                {u} underline
              </Hyperlink>
            ))}
            <Hyperlink href="#" variant={v} external>
              external
            </Hyperlink>
          </div>
        </div>
      ))}

      {/* White background — override --link-primary to use raw primary-500 */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono text-ink-500 dark:text-ink-400">
          default — on white (primary-500)
        </span>
        <div
          className="flex items-center gap-6 flex-wrap bg-white rounded-xl px-4 py-3"
          style={{ '--link-primary': 'var(--color-primary-500)' } as React.CSSProperties}
        >
          {(['hover', 'always', 'none'] as const).map((u) => (
            <Hyperlink key={u} href="#" underline={u}>
              {u} underline
            </Hyperlink>
          ))}
          <Hyperlink href="#" external>
            external
          </Hyperlink>
        </div>
      </div>
    </div>
  ),
};
