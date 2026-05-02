import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('toggle starts off — click turns it on', async () => {
      const toggle = canvas.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'false');
      await user.click(toggle);
      await waitFor(() => {
        expect(canvas.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
      });
    });

    await step('click again — turns back off', async () => {
      await user.click(canvas.getByRole('switch'));
      await waitFor(() => {
        expect(canvas.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
      });
    });
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

