import type { Meta, StoryObj } from '@storybook/react';
import { WifiOff, ShieldOff, ServerCrash, Wrench, AlertTriangle, Lock } from 'lucide-react';
import { ErrorPage } from '../components/ErrorPage';

const meta = {
  title: 'Feedback/ErrorPage',
  component: ErrorPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant: {
      control: 'select',
      options: [undefined, '404', '500', '403', '503'],
      description: 'Pre-fills code, title and description for common HTTP errors',
    },
    code: { control: 'text', description: 'Overrides the variant code (or standalone)' },
    title: { control: 'text' },
    description: { control: 'text' },
    fullScreen: { control: 'boolean', description: 'Expand to min-h-screen' },
    icon: { control: false },
    primaryAction: { control: false },
    secondaryAction: { control: false },
  },
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared actions ────────────────────────────────────────

const homeAction = { label: 'Go back home', href: '#' };
const backAction = { label: 'Go back', onClick: () => history.back() };
const supportAction = { label: 'Contact support', href: '#' };
const retryAction = { label: 'Try again', onClick: () => location.reload() };
const statusAction = { label: 'Check status', href: '#' };

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: '404',
    fullScreen: false,
  },
  render: (args) => <ErrorPage {...args} primaryAction={homeAction} secondaryAction={backAction} />,
};

// ── 404 Not Found ─────────────────────────────────────────

export const NotFound: Story = {
  name: '404 — Not found',
  render: () => <ErrorPage variant="404" primaryAction={homeAction} secondaryAction={backAction} />,
};

// ── 500 Server Error ──────────────────────────────────────

export const ServerError: Story = {
  name: '500 — Server error',
  render: () => (
    <ErrorPage variant="500" primaryAction={retryAction} secondaryAction={supportAction} />
  ),
};

// ── 403 Forbidden ─────────────────────────────────────────

export const Forbidden: Story = {
  name: '403 — Forbidden',
  render: () => (
    <ErrorPage variant="403" primaryAction={homeAction} secondaryAction={supportAction} />
  ),
};

// ── 503 Maintenance ───────────────────────────────────────

export const Maintenance: Story = {
  name: '503 — Maintenance',
  render: () => (
    <ErrorPage variant="503" primaryAction={retryAction} secondaryAction={statusAction} />
  ),
};

// ── With icon (no watermark) ──────────────────────────────

export const WithIcon: Story = {
  name: 'With icon',
  render: () => (
    <div className="flex flex-col gap-0 divide-y divide-ink-100 dark:divide-ink-800">
      <ErrorPage
        code="404"
        title="Page not found"
        description="That URL doesn't exist. Double-check the link or head back home."
        icon={<AlertTriangle className="w-8 h-8" />}
        primaryAction={homeAction}
        secondaryAction={backAction}
      />
      <ErrorPage
        code="403"
        title="Access denied"
        description="Your account doesn't have permission to view this resource."
        icon={<Lock className="w-8 h-8" />}
        primaryAction={homeAction}
        secondaryAction={supportAction}
      />
      <ErrorPage
        code="500"
        title="Something went wrong"
        description="An unexpected error occurred. Our engineers are on it."
        icon={<ServerCrash className="w-8 h-8" />}
        primaryAction={retryAction}
        secondaryAction={supportAction}
      />
      <ErrorPage
        code="503"
        title="Under maintenance"
        description="We'll be back shortly. Thanks for your patience."
        icon={<Wrench className="w-8 h-8" />}
        primaryAction={retryAction}
        secondaryAction={statusAction}
      />
    </div>
  ),
};

// ── Offline / network error ───────────────────────────────

export const Offline: Story = {
  name: 'Offline — no connection',
  render: () => (
    <ErrorPage
      icon={<WifiOff className="w-8 h-8" />}
      title="You're offline"
      description="Check your internet connection and try again. Your work has been saved locally."
      primaryAction={retryAction}
    />
  ),
};

// ── Unauthorised (session expired) ────────────────────────

export const SessionExpired: Story = {
  name: 'Session expired',
  render: () => (
    <ErrorPage
      icon={<ShieldOff className="w-8 h-8" />}
      title="Session expired"
      description="Your session timed out for security. Sign in again to continue where you left off."
      primaryAction={{ label: 'Sign in', href: '#' }}
    />
  ),
};

// ── No actions ────────────────────────────────────────────

export const Minimal: Story = {
  name: 'Minimal — no actions',
  render: () => <ErrorPage variant="500" />,
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {(['404', '500', '403', '503'] as const).map((v) => (
        <div
          key={v}
          className="rounded-2xl border border-ink-100 dark:border-ink-700 overflow-hidden"
        >
          <ErrorPage variant={v} primaryAction={homeAction} secondaryAction={backAction} />
        </div>
      ))}
    </div>
  ),
};
