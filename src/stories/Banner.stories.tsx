import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Banner } from '../components/Banner';

const meta = {
  title: 'Marketing/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant:   { control: 'select', options: ['dark', 'primary', 'light'] },
    title:     { control: 'text' },
    message:   { control: 'text' },
    action:    { control: false },
    onDismiss: { control: false },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared fixtures ───────────────────────────────────────

const registerAction = { label: 'Register now', href: '#' };
const learnAction    = { label: 'Learn more',   href: '#' };
const updateAction   = { label: 'View changes', href: '#' };

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'dark',
    title:   'GeneriCon 2025',
    message: 'Join us in Denver from June 7–9 to see what\'s coming next.',
  },
  render: (args) => (
    <Banner {...args} action={registerAction} />
  ),
};

// ── Dark (default) ────────────────────────────────────────

export const Dark: Story = {
  name: 'Dark',
  render: () => (
    <Banner
      variant="dark"
      title="GeneriCon 2025"
      message="Join us in Denver from June 7–9 to see what's coming next."
      action={registerAction}
    />
  ),
};

// ── Primary ───────────────────────────────────────────────

export const Primary: Story = {
  name: 'Primary',
  render: () => (
    <Banner
      variant="primary"
      title="New feature"
      message="Bulk export is now available for all plans."
      action={learnAction}
    />
  ),
};

// ── Light ─────────────────────────────────────────────────

export const Light: Story = {
  name: 'Light',
  render: () => (
    <div className="bg-white">
      <Banner
        variant="light"
        title="Version 3.0 released"
        message="Improved performance, new components, and a refreshed theme."
        action={updateAction}
      />
    </div>
  ),
};

// ── Dismissible ───────────────────────────────────────────

function DismissibleDemo() {
  const [visible, setVisible] = useState(true);
  return (
    <div>
      {visible ? (
        <Banner
          variant="dark"
          title="Golden Passport v3"
          message="New design tokens, better dark mode, and a full icon refresh."
          action={learnAction}
          onDismiss={() => setVisible(false)}
        />
      ) : (
        <div className="flex items-center justify-center h-12 bg-ink-50 dark:bg-ink-950">
          <button
            type="button"
            onClick={() => setVisible(true)}
            className="text-xs font-body text-primary-800 dark:text-primary-400 hover:underline"
          >
            Restore banner
          </button>
        </div>
      )}
    </div>
  );
}

export const Dismissible: Story = {
  name: 'Dismissible',
  render: () => <DismissibleDemo />,
};

// ── No action ─────────────────────────────────────────────

export const NoAction: Story = {
  name: 'No action',
  render: () => (
    <Banner
      variant="primary"
      message="Scheduled maintenance on Saturday 3–5 AM UTC. Expect brief downtime."
    />
  ),
};

// ── No title ──────────────────────────────────────────────

export const NoTitle: Story = {
  name: 'No title',
  render: () => (
    <Banner
      variant="dark"
      message="Free shipping on all orders over $75 this weekend only."
      action={{ label: 'Shop now', href: '#' }}
    />
  ),
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div className="flex flex-col bg-white">
      <Banner
        variant="dark"
        title="Dark"
        message="Ink-900 background with golden gradient blobs."
        action={learnAction}
      />
      <Banner
        variant="primary"
        title="Primary"
        message="Primary-500 background — high visibility announcements."
        action={learnAction}
      />
      <Banner
        variant="light"
        title="Light"
        message="Ink-50 background with a bottom border, sits on white pages."
        action={learnAction}
      />
    </div>
  ),
};
