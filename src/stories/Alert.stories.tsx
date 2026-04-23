import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '../components/Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant:    { control: 'select', options: ['info', 'success', 'warning', 'error'],    description: 'Semantic colour' },
    appearance: { control: 'select', options: ['tinted', 'outline'],                      description: '"tinted" = coloured background (default); "outline" = neutral bg + coloured left border' },
    title:      { control: 'text',                                                        description: 'Bold heading line above the body' },
    children:   { control: false,                                                         description: 'Alert body — any React node' },
    onDismiss:  { control: false,                                                         description: 'If provided, renders a dismiss (×) button' },
    actions:    { control: false,                                                         description: 'Array of { label, onClick } rendered as text buttons below the body' },
    icon:       { control: false,                                                         description: 'Override default icon; pass null to hide' },
    className:  { control: 'text' },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant:    'info',
    appearance: 'tinted',
    title:      'Heads up',
    children:   'You can change this in the controls panel on the right.',
  },
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants — tinted',
  render: () => (
    <div className="flex flex-col gap-3 max-w-xl">
      <Alert variant="info"    title="Info">Your account is pending verification.</Alert>
      <Alert variant="success" title="Success">Changes have been saved successfully.</Alert>
      <Alert variant="warning" title="Warning">Your subscription expires in 3 days.</Alert>
      <Alert variant="error"   title="Error">Failed to process payment. Please try again.</Alert>
    </div>
  ),
};

export const AllVariantsOutline: Story = {
  name: 'All variants — outline',
  render: () => (
    <div className="flex flex-col gap-3 max-w-xl">
      <Alert variant="info"    appearance="outline" title="Info">Your account is pending verification.</Alert>
      <Alert variant="success" appearance="outline" title="Success">Changes have been saved successfully.</Alert>
      <Alert variant="warning" appearance="outline" title="Warning">Your subscription expires in 3 days.</Alert>
      <Alert variant="error"   appearance="outline" title="Error">Failed to process payment. Please try again.</Alert>
    </div>
  ),
};

// ── Message only ──────────────────────────────────────────

export const MessageOnly: Story = {
  name: 'Message only — no title',
  render: () => (
    <div className="flex flex-col gap-3 max-w-xl">
      <Alert variant="info">Your session will expire in 10 minutes.</Alert>
      <Alert variant="success">Invitation sent to alex@example.com.</Alert>
      <Alert variant="warning">Free tier limit reached — upgrade to continue.</Alert>
      <Alert variant="error">Unable to connect to the server.</Alert>
    </div>
  ),
};

// ── Dismissible ───────────────────────────────────────────

export const Dismissible: Story = {
  name: 'Dismissible',
  render: () => {
    const [visible, setVisible] = React.useState(true);
    return visible ? (
      <Alert
        variant="info"
        title="New feature available"
        onDismiss={() => setVisible(false)}
        className="max-w-xl"
      >
        You can now export reports as CSV. Go to Reports → Export.
      </Alert>
    ) : (
      <p className="text-sm text-ink-400">Alert dismissed. Refresh to reset.</p>
    );
  },
};

// ── With actions ──────────────────────────────────────────

export const WithActions: Story = {
  name: 'With actions',
  render: () => (
    <div className="flex flex-col gap-3 max-w-xl">
      <Alert
        variant="warning"
        title="Subscription expiring soon"
        actions={[
          { label: 'Upgrade now',   onClick: () => alert('Upgrade') },
          { label: 'Remind me later', onClick: () => alert('Remind') },
        ]}
      >
        Your plan expires on 30 April 2026. Renew to keep access.
      </Alert>
      <Alert
        variant="error"
        title="Payment failed"
        actions={[
          { label: 'Update billing', onClick: () => alert('Billing') },
        ]}
      >
        We couldn't charge your card ending in 4242.
      </Alert>
    </div>
  ),
};

// ── With actions + dismiss ────────────────────────────────

export const WithActionsAndDismiss: Story = {
  name: 'With actions + dismiss',
  render: () => {
    const [visible, setVisible] = React.useState(true);
    return visible ? (
      <Alert
        variant="success"
        title="Profile updated"
        onDismiss={() => setVisible(false)}
        actions={[{ label: 'View profile', onClick: () => alert('View') }]}
        className="max-w-xl"
      >
        Your changes have been saved and are now live.
      </Alert>
    ) : (
      <p className="text-sm text-ink-400">Alert dismissed. Refresh to reset.</p>
    );
  },
};

// ── No icon ───────────────────────────────────────────────

export const NoIcon: Story = {
  name: 'No icon',
  render: () => (
    <div className="flex flex-col gap-3 max-w-xl">
      <Alert variant="info"    icon={null} title="Scheduled maintenance">We'll be down from 02:00–03:00 UTC on Saturday.</Alert>
      <Alert variant="error"   icon={null}>Submission failed — please check your connection and try again.</Alert>
    </div>
  ),
};

// ── Rich body ─────────────────────────────────────────────

export const RichBody: Story = {
  name: 'Rich body — list',
  render: () => (
    <Alert variant="error" title="Your form has errors" className="max-w-xl">
      <ul className="mt-1 list-disc list-inside space-y-1">
        <li>Company name is required.</li>
        <li>Email address is not valid.</li>
        <li>Password must be at least 8 characters.</li>
      </ul>
    </Alert>
  ),
};
