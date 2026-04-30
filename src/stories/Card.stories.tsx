import type { Meta, StoryObj } from '@storybook/react';
import { Plus, Download } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { Divider } from '../components/Divider';

const meta = {
  title: 'Layout/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    header: { control: false },
    footer: { control: false },
    padding: { control: { type: 'select', options: ['none', 'sm', 'md', 'lg'] } },
    headerMuted: { control: 'boolean' },
    bodyMuted: { control: 'boolean' },
    footerMuted: { control: 'boolean' },
    children: { control: false },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    padding: 'md',
    headerMuted: false,
    bodyMuted: false,
    footerMuted: false,
    header: (
      <h3 className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">Card header</h3>
    ),
    footer: (
      <div className="flex justify-end gap-3">
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Save
        </Button>
      </div>
    ),
    children: (
      <p className="text-sm font-body text-ink-500 dark:text-ink-300">
        This is the card body. Toggle the muted props above to grey out each section independently.
      </p>
    ),
  },
};

// ── Simple card ───────────────────────────────────────────

export const Simple: Story = {
  name: 'Simple',
  args: { children: null },
  render: () => (
    <div className="max-w-lg flex flex-col gap-6">
      <Card>
        <p className="text-sm font-body text-ink-600 dark:text-ink-300">
          A basic card with default padding. Use this as a general-purpose surface for any content.
        </p>
      </Card>

      <Card padding="sm">
        <p className="text-sm font-body text-ink-600 dark:text-ink-300">
          Small padding variant — useful for compact UIs or nested cards.
        </p>
      </Card>

      <Card padding="lg">
        <p className="text-sm font-body text-ink-600 dark:text-ink-300">
          Large padding variant — spacious layout for focus areas or onboarding prompts.
        </p>
      </Card>
    </div>
  ),
};

// ── With header ───────────────────────────────────────────

export const WithHeader: Story = {
  name: 'With header',
  args: { children: null },
  render: () => (
    <div className="max-w-lg flex flex-col gap-6">
      <Card
        header={
          <h3 className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">
            Account details
          </h3>
        }
      >
        <p className="text-sm font-body text-ink-500 dark:text-ink-300">
          Your account is on the Pro plan. Billing renews on 1 May 2026.
        </p>
      </Card>

      <Card
        header={
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">
                API keys
              </h3>
              <p className="mt-0.5 text-xs font-body text-ink-500 dark:text-ink-300">
                Manage keys used to authenticate API requests.
              </p>
            </div>
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              New key
            </Button>
          </div>
        }
      >
        <p className="text-sm font-body text-ink-500 dark:text-ink-300">
          You have 2 active API keys. Keys are shown once at creation.
        </p>
      </Card>
    </div>
  ),
};

// ── With footer ───────────────────────────────────────────

export const WithFooter: Story = {
  name: 'With footer',
  args: { children: null },
  render: () => (
    <div className="max-w-lg flex flex-col gap-6">
      <Card
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="sm">
              Cancel
            </Button>
            <Button variant="primary" size="sm">
              Save changes
            </Button>
          </div>
        }
      >
        <p className="text-sm font-body text-ink-500 dark:text-ink-300">
          Update your display name and email address. Changes take effect immediately.
        </p>
      </Card>

      <Card
        footer={
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-body text-ink-500 dark:text-ink-300">
              Last updated 2 hours ago
            </p>
            <Button variant="ghost" size="sm">
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              Export
            </Button>
          </div>
        }
      >
        <p className="text-sm font-body text-ink-500 dark:text-ink-300">
          Monthly usage report for April 2026. 14,302 API calls across 3 projects.
        </p>
      </Card>
    </div>
  ),
};

// ── With header and footer ────────────────────────────────

export const WithHeaderAndFooter: Story = {
  name: 'With header and footer',
  args: { children: null },
  render: () => (
    <div className="max-w-lg flex flex-col gap-6">
      <Card
        header={
          <h3 className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">
            Billing information
          </h3>
        }
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="sm">
              Cancel
            </Button>
            <Button variant="primary" size="sm">
              Update billing
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3 text-sm font-body">
          <div className="flex justify-between">
            <span className="text-ink-500 dark:text-ink-300">Plan</span>
            <span className="font-medium text-ink-900 dark:text-ink-50">Pro</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-500 dark:text-ink-300">Billing cycle</span>
            <span className="font-medium text-ink-900 dark:text-ink-50">Monthly</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-500 dark:text-ink-300">Next invoice</span>
            <span className="font-medium text-ink-900 dark:text-ink-50">1 May 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-500 dark:text-ink-300">Amount</span>
            <span className="font-medium text-ink-900 dark:text-ink-50">$49 / month</span>
          </div>
        </div>
      </Card>
    </div>
  ),
};

// ── Muted sections ────────────────────────────────────────

export const MutedSections: Story = {
  name: 'Muted sections',
  args: { children: null },
  render: () => {
    const header = (
      <h3 className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">
        Section title
      </h3>
    );
    const body = (
      <p className="text-sm font-body text-ink-500 dark:text-ink-300">
        Body content sits here. Toggle which sections are muted to establish visual hierarchy.
      </p>
    );
    const footer = (
      <div className="flex justify-end gap-3">
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Confirm
        </Button>
      </div>
    );
    return (
      <div className="max-w-lg flex flex-col gap-6">
        <div>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">headerMuted</p>
          <Card header={header} footer={footer} headerMuted>
            {body}
          </Card>
        </div>
        <div>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">bodyMuted</p>
          <Card header={header} footer={footer} bodyMuted>
            {body}
          </Card>
        </div>
        <div>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">footerMuted</p>
          <Card header={header} footer={footer} footerMuted>
            {body}
          </Card>
        </div>
        <div>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">
            headerMuted + footerMuted
          </p>
          <Card header={header} footer={footer} headerMuted footerMuted>
            {body}
          </Card>
        </div>
        <div>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">all muted</p>
          <Card header={header} footer={footer} headerMuted bodyMuted footerMuted>
            {body}
          </Card>
        </div>
      </div>
    );
  },
};

// ── Body muted — code / env vars ──────────────────────────

export const BodyMuted: Story = {
  name: 'bodyMuted — inset body',
  args: { children: null },
  render: () => (
    <div className="max-w-lg flex flex-col gap-6">
      <Card
        header={
          <h3 className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">
            Webhook payload
          </h3>
        }
        bodyMuted
      >
        <pre className="text-xs font-mono text-ink-600 dark:text-ink-300 overflow-x-auto leading-relaxed">{`{
  "event": "user.created",
  "timestamp": "2026-04-23T09:41:00Z",
  "data": {
    "id": "usr_01HXYZ",
    "email": "leslie@example.com"
  }
}`}</pre>
      </Card>

      <Card
        header={
          <h3 className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">
            Environment variables
          </h3>
        }
        footer={
          <Button variant="secondary" size="sm">
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Add variable
          </Button>
        }
        bodyMuted
      >
        <div className="flex flex-col gap-2 text-xs font-mono text-ink-600 dark:text-ink-300">
          <div className="flex gap-4">
            <span className="text-ink-400 dark:text-ink-300 select-none">01</span>{' '}
            DATABASE_URL=postgres://...
          </div>
          <div className="flex gap-4">
            <span className="text-ink-400 dark:text-ink-300 select-none">02</span>{' '}
            REDIS_URL=redis://...
          </div>
          <div className="flex gap-4">
            <span className="text-ink-400 dark:text-ink-300 select-none">03</span>{' '}
            SECRET_KEY=••••••••••••
          </div>
        </div>
      </Card>
    </div>
  ),
};

// ── With dividers ─────────────────────────────────────────

export const WithDividers: Story = {
  name: 'With dividers — multi-section body',
  args: { children: null },
  render: () => (
    <div className="max-w-lg">
      <Card
        header={
          <h3 className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">
            Team members
          </h3>
        }
        headerMuted
        padding="none"
      >
        {[
          { name: 'Leslie Alexander', role: 'Co-Founder / CEO', status: 'active' as const },
          { name: 'Michael Foster', role: 'Co-Founder / CTO', status: 'active' as const },
          { name: 'Dries Vincent', role: 'Business Relations', status: 'pending' as const },
          { name: 'Lindsay Walton', role: 'Front-end Developer', status: 'active' as const },
        ].map((person, i, arr) => (
          <div key={i}>
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={person.name} size={36} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 truncate">
                    {person.name}
                  </p>
                  <p className="text-xs font-body text-ink-500 dark:text-ink-300 truncate">
                    {person.role}
                  </p>
                </div>
              </div>
              <Badge
                label={person.status.charAt(0).toUpperCase() + person.status.slice(1)}
                variant={person.status}
              />
            </div>
            {i < arr.length - 1 && <Divider />}
          </div>
        ))}
      </Card>
    </div>
  ),
};

// ── Padding sizes ─────────────────────────────────────────

export const PaddingSizes: Story = {
  name: 'Padding sizes',
  args: { children: null },
  render: () => (
    <div className="max-w-lg flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Card key={size} padding={size}>
          <p className="text-sm font-body text-ink-500 dark:text-ink-300">
            <span className="font-semibold text-ink-900 dark:text-ink-50">padding="{size}"</span> —
            body content with this padding applied.
          </p>
        </Card>
      ))}
    </div>
  ),
};
