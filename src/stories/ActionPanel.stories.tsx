import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ActionPanel } from '../components/ActionPanel';
import { Button } from '../components/Button';
import { Toggle } from '../components/Toggle';
import { Input } from '../components/Input';

const meta = {
  title: 'Forms/ActionPanel',
  component: ActionPanel,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'danger'],
      description: '"danger" applies red border + red title',
    },
    layout: {
      control: 'select',
      options: ['stacked', 'inline'],
      description:
        '"stacked" places children below the description; "inline" places them to the right',
    },
    title: { control: 'text' },
    description: { control: 'text' },
    children: { control: false },
    className: { control: 'text' },
  },
} satisfies Meta<typeof ActionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'default',
    layout: 'stacked',
    title: 'Need more bandwidth?',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus praesentium tenetur pariatur.',
  },
  render: (args) => (
    <div className="max-w-2xl">
      <ActionPanel {...args}>
        <Button variant="ghost">Contact sales</Button>
      </ActionPanel>
    </div>
  ),
};

// ── With button (stacked) ─────────────────────────────────

export const WithButton: Story = {
  name: 'With button — stacked',
  args: { title: '' },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-5">
      <ActionPanel
        title="Need more bandwidth?"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus praesentium tenetur pariatur."
      >
        <Button variant="ghost">Contact sales</Button>
      </ActionPanel>

      <ActionPanel
        title="Export account data"
        description="Download a copy of all the data associated with your account including workflows, runs, and audit logs."
      >
        <Button variant="secondary" size="sm">
          Request export
        </Button>
      </ActionPanel>
    </div>
  ),
};

// ── With input (stacked) ──────────────────────────────────

export const WithInput: Story = {
  name: 'With input — stacked',
  args: { title: '' },
  render: () => {
    const [email, setEmail] = React.useState('');
    return (
      <div className="max-w-2xl">
        <ActionPanel
          title="Update your email"
          description="Change the email address you want associated with your account."
        >
          <div className="flex items-start gap-3">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-xs"
            />
            <Button variant="primary">Save</Button>
          </div>
        </ActionPanel>
      </div>
    );
  },
};

// ── With toggle (inline) ──────────────────────────────────

export const WithToggle: Story = {
  name: 'With toggle — inline',
  args: { title: '' },
  render: () => {
    const [on, setOn] = React.useState(false);
    return (
      <div className="max-w-2xl">
        <ActionPanel
          layout="inline"
          title="Renew subscription automatically"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo totam non cumque deserunt officiis ex maiores nostrum."
        >
          <Toggle checked={on} onChange={setOn} />
        </ActionPanel>
      </div>
    );
  },
};

// ── With button (inline) ──────────────────────────────────

export const WithButtonInline: Story = {
  name: 'With button — inline',
  args: { title: '' },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-5">
      <ActionPanel
        layout="inline"
        title="Enable two-factor authentication"
        description="Add an extra layer of security by requiring a verification code alongside your password."
      >
        <Button variant="primary" size="sm">
          Enable 2FA
        </Button>
      </ActionPanel>

      <ActionPanel
        layout="inline"
        title="Manage team members"
        description="Invite colleagues and control what they can access in your workspace."
      >
        <Button variant="secondary" size="sm">
          Manage team
        </Button>
      </ActionPanel>
    </div>
  ),
};

// ── Danger ────────────────────────────────────────────────

export const Danger: Story = {
  name: 'Danger — destructive actions',
  args: { title: '' },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-5">
      <ActionPanel
        variant="danger"
        title="Delete this workflow"
        description="Once you delete this workflow all run history will be permanently removed. There is no going back."
      >
        <Button variant="danger" size="sm">
          Delete workflow
        </Button>
      </ActionPanel>

      <ActionPanel
        variant="danger"
        layout="inline"
        title="Revoke API key"
        description="Any integrations using this key will immediately stop working."
      >
        <Button variant="danger" size="sm">
          Revoke key
        </Button>
      </ActionPanel>
    </div>
  ),
};

// ── All layouts ───────────────────────────────────────────

export const AllLayouts: Story = {
  name: 'All layouts',
  args: { title: '' },
  render: () => {
    const [autoRenew, setAutoRenew] = React.useState(true);
    const [notifications, setNotifications] = React.useState(false);
    return (
      <div className="max-w-2xl flex flex-col gap-5">
        <ActionPanel
          title="Need more bandwidth?"
          description="Talk to our sales team about custom limits and enterprise pricing."
        >
          <Button variant="ghost">Contact sales</Button>
        </ActionPanel>

        <ActionPanel
          title="Update your email"
          description="Change the email address you want associated with your account."
        >
          <div className="flex items-start gap-3">
            <Input type="email" placeholder="you@example.com" className="max-w-xs" />
            <Button variant="primary">Save</Button>
          </div>
        </ActionPanel>

        <ActionPanel
          layout="inline"
          title="Renew subscription automatically"
          description="We will automatically charge your payment method on file when your subscription is due for renewal."
        >
          <Toggle checked={autoRenew} onChange={setAutoRenew} />
        </ActionPanel>

        <ActionPanel
          layout="inline"
          title="Email notifications"
          description="Receive a weekly digest of workflow runs and errors directly to your inbox."
        >
          <Toggle checked={notifications} onChange={setNotifications} />
        </ActionPanel>

        <ActionPanel
          variant="danger"
          title="Delete account"
          description="Once you delete your account all your data will be permanently removed. There is no going back."
        >
          <Button variant="danger" size="sm">
            Delete my account
          </Button>
        </ActionPanel>
      </div>
    );
  },
};
