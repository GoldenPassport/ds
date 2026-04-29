import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Bell, Star, Upload, MessageSquare } from 'lucide-react';
import {
  NotificationCard,
  NotificationStack,
  useNotifications,
  type NotificationVariant,
  type NotificationPosition,
} from '../components/Notification';

// ── Flat-props wrapper used as the meta component ─────────
// Gives Storybook individual controls for every meaningful prop.

interface NotificationDemoProps {
  variant:     NotificationVariant;
  title:       string;
  body:        string;
  position:    NotificationPosition;
  /** Auto-dismiss delay in ms. 0 = persistent. */
  duration:    number;
  showActions: boolean;
  showDismiss: boolean;
}

function NotificationDemo({
  variant,
  title,
  body,
  position,
  duration,
  showActions,
  showDismiss,
}: NotificationDemoProps) {
  const { notifications, add, dismiss } = useNotifications();
  const fired = React.useRef(false);

  // Fire once on mount so the Playground shows a card immediately
  React.useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    add({
      variant,
      title,
      body,
      duration,
      actions: showActions
        ? [
            { label: 'Confirm', onClick: () => {} },
            { label: 'Dismiss', onClick: () => {} },
          ]
        : undefined,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-36">
      <p className="text-sm text-ink-500 dark:text-ink-300 font-body mb-3">
        Use the controls panel to adjust the notification, then click the button to re-fire it.
      </p>
      <button
        onClick={() =>
          add({
            variant,
            title,
            body,
            duration,
            actions: showActions
              ? [
                  { label: 'Confirm', onClick: () => {} },
                  { label: 'Dismiss', onClick: () => {} },
                ]
              : undefined,
          })
        }
        className="px-4 py-2 rounded-lg bg-primary-500 text-ink-900 text-sm font-semibold font-body hover:bg-primary-600 transition-colors"
      >
        Show notification
      </button>

      <NotificationStack
        notifications={notifications}
        onDismiss={id => { if (showDismiss) dismiss(id); else dismiss(id); }}
        position={position}
        portal={false}
      />
    </div>
  );
}

// ── Meta ──────────────────────────────────────────────────

const meta = {
  title:     'Overlays/Notifications',
  component: NotificationDemo,
  tags:      ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    variant:     'success',
    title:       'Changes saved',
    body:        'Your workflow was updated successfully.',
    position:    'top-right',
    duration:    5000,
    showActions: false,
    showDismiss: true,
  },
  argTypes: {
    variant:     { control: 'select',  options: ['default', 'info', 'success', 'warning', 'error'],                                          description: 'Semantic colour and default icon' },
    title:       { control: 'text',                                                                                                           description: 'Bold heading line' },
    body:        { control: 'text',                                                                                                           description: 'Supporting body text' },
    position:    { control: 'select',  options: ['top-left','top-center','top-right','bottom-left','bottom-center','bottom-right'],           description: 'Corner / edge the stack anchors to' },
    duration:    { control: 'number',                                                                                                         description: 'Auto-dismiss after ms. Set 0 for persistent.' },
    showActions: { control: 'boolean',                                                                                                        description: 'Append Confirm / Dismiss action buttons' },
    showDismiss: { control: 'boolean',                                                                                                        description: 'Show the × dismiss button' },
  },
} satisfies Meta<typeof NotificationDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {};

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div className="flex flex-col gap-3">
      <NotificationCard onDismiss={noop} item={{ id: '1', variant: 'default', title: 'Default',  body: 'A general-purpose notification with no semantic colour.' }} />
      <NotificationCard onDismiss={noop} item={{ id: '2', variant: 'info',    title: 'Info',     body: 'Your account is pending email verification.' }} />
      <NotificationCard onDismiss={noop} item={{ id: '3', variant: 'success', title: 'Success',  body: 'Payment of $120.00 was processed successfully.' }} />
      <NotificationCard onDismiss={noop} item={{ id: '4', variant: 'warning', title: 'Warning',  body: 'Your subscription expires in 3 days.' }} />
      <NotificationCard onDismiss={noop} item={{ id: '5', variant: 'error',   title: 'Error',    body: 'Failed to send the report. Please try again.' }} />
    </div>
  ),
};

// ── Title / body only ─────────────────────────────────────

export const TitleOnly: Story = {
  name: 'Title only',
  render: () => (
    <div className="flex flex-col gap-3">
      <NotificationCard onDismiss={noop} item={{ id: '1', variant: 'success', title: 'Workflow published' }} />
      <NotificationCard onDismiss={noop} item={{ id: '2', variant: 'error',   title: 'Deployment failed'  }} />
    </div>
  ),
};

export const BodyOnly: Story = {
  name: 'Body only — no title',
  render: () => (
    <div className="flex flex-col gap-3">
      <NotificationCard onDismiss={noop} item={{ id: '1', variant: 'info',    body: 'A new version of the app is available.' }} />
      <NotificationCard onDismiss={noop} item={{ id: '2', variant: 'warning', body: 'You are running low on storage space.'  }} />
    </div>
  ),
};

// ── With avatar ───────────────────────────────────────────

export const WithAvatar: Story = {
  name: 'With avatar',
  render: () => (
    <div className="flex flex-col gap-3">
      <NotificationCard
        onDismiss={noop}
        item={{
          id:     '1',
          avatar: { name: 'Sarah Chen' },
          title:  'Sarah Chen commented',
          body:   'Looks great — ready to merge when you are.',
        }}
      />
      <NotificationCard
        onDismiss={noop}
        item={{
          id:     '2',
          avatar: { src: 'https://i.pravatar.cc/64?img=47', name: 'James Okafor' },
          title:  'James Okafor mentioned you',
          body:   'Hey @you — can you review PR #142?',
        }}
      />
    </div>
  ),
};

// ── With actions ──────────────────────────────────────────

export const WithActions: Story = {
  name: 'With actions',
  render: () => (
    <div className="flex flex-col gap-3">
      <NotificationCard
        onDismiss={noop}
        item={{
          id:      '1',
          variant: 'warning',
          title:   'Subscription expiring',
          body:    'Your Pro plan expires in 3 days.',
          actions: [
            { label: 'Renew now', onClick: () => alert('Renew')   },
            { label: 'Dismiss',   onClick: () => alert('Dismiss') },
          ],
        }}
      />
      <NotificationCard
        onDismiss={noop}
        item={{
          id:      '2',
          avatar:  { name: 'Alex Rivera' },
          title:   'Alex Rivera invited you',
          body:    'Join the "Product Analytics" workspace.',
          actions: [
            { label: 'Accept',  onClick: () => alert('Accepted') },
            { label: 'Decline', onClick: () => alert('Declined') },
          ],
        }}
      />
    </div>
  ),
};

// ── Custom icon ───────────────────────────────────────────

export const CustomIcon: Story = {
  name: 'Custom icon',
  render: () => (
    <div className="flex flex-col gap-3">
      <NotificationCard
        onDismiss={noop}
        item={{
          id:    '1',
          icon:  <Bell className="w-5 h-5 text-primary-500 shrink-0" />,
          title: 'Reminder',
          body:  'Your scheduled report runs in 15 minutes.',
        }}
      />
      <NotificationCard
        onDismiss={noop}
        item={{
          id:    '2',
          icon:  <Upload className="w-5 h-5 text-slate-500 shrink-0" />,
          title: 'Upload complete',
          body:  'report-q1-2026.pdf was uploaded successfully.',
        }}
      />
      <NotificationCard
        onDismiss={noop}
        item={{
          id:    '3',
          icon:  <Star className="w-5 h-5 text-primary-500 shrink-0" />,
          title: 'Milestone reached',
          body:  'Your workflow has processed 10,000 records.',
        }}
      />
    </div>
  ),
};

// ── No icon ───────────────────────────────────────────────

export const NoIcon: Story = {
  name: 'No icon',
  render: () => (
    <div className="flex flex-col gap-3">
      <NotificationCard
        onDismiss={noop}
        item={{ id: '1', icon: null, title: 'Scheduled maintenance', body: 'Offline from 02:00–03:00 UTC on Saturday.' }}
      />
      <NotificationCard
        onDismiss={noop}
        item={{
          id:      '2',
          icon:    null,
          title:   'Review requested',
          body:    'PR #207 is ready for your review.',
          actions: [{ label: 'Open PR', onClick: () => alert('Open') }],
        }}
      />
    </div>
  ),
};

// ── Interactive live stack ────────────────────────────────

const EXAMPLES: Array<Omit<import('../components/Notification').NotificationItem, 'id'>> = [
  { variant: 'success', title: 'Changes saved',       body: 'Your workflow was updated and deployed.' },
  { variant: 'error',   title: 'Deployment failed',   body: 'Build #408 encountered an error. Check the logs.' },
  { variant: 'warning', title: 'Nearing rate limit',  body: 'You have used 90% of your monthly API quota.' },
  { variant: 'info',    title: 'New teammate joined',  body: 'Maya Patel has joined your workspace.' },
  {
    avatar:  { src: 'https://i.pravatar.cc/64?img=12', name: 'Jordan Lee' },
    title:   'Jordan Lee replied',
    body:    'Agreed — ship it.',
    actions: [{ label: 'View thread', onClick: () => alert('View') }],
  },
  {
    icon:    <MessageSquare className="w-5 h-5 text-slate-500 shrink-0" />,
    title:   'New comment',
    body:    'Someone commented on your dashboard.',
    actions: [
      { label: 'Reply',   onClick: () => alert('Reply')   },
      { label: 'Dismiss', onClick: () => alert('Dismiss') },
    ],
  },
];

function LiveDemoWrapper() {
  const { notifications, add, dismiss, dismissAll } = useNotifications();
  const counter = React.useRef(0);

  return (
    <div className="relative min-h-48 space-y-4">
      <p className="text-sm text-ink-500 dark:text-ink-300 font-body">
        Notifications auto-dismiss after 5 s. Click multiple times to stack them.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            add({ ...EXAMPLES[counter.current % EXAMPLES.length], duration: 5000 });
            counter.current++;
          }}
          className="px-4 py-2 rounded-lg bg-primary-500 text-ink-900 text-sm font-semibold font-body hover:bg-primary-600 transition-colors"
        >
          Show next notification
        </button>
        <button
          onClick={dismissAll}
          className="px-4 py-2 rounded-lg border border-ink-200 dark:border-ink-600 text-ink-600 dark:text-ink-300 text-sm font-semibold font-body hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors"
        >
          Dismiss all
        </button>
      </div>
      <NotificationStack
        notifications={notifications}
        onDismiss={dismiss}
        position="top-right"
        portal={false}
      />
    </div>
  );
}

export const Interactive: Story = {
  name: 'Interactive — live stack',
  render: () => <LiveDemoWrapper />,
};

// ── All positions ─────────────────────────────────────────

const ALL_POSITIONS: NotificationPosition[] = [
  'top-left', 'top-center', 'top-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];

export const Positions: Story = {
  name: 'Positions — static preview',
  render: () => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {ALL_POSITIONS.map(pos => (
        <div key={pos} className="space-y-1">
          <p className="text-xs text-ink-500 dark:text-ink-300 font-mono">{pos}</p>
          <NotificationCard
            onDismiss={noop}
            item={{ id: pos, variant: 'info', title: 'Notification', body: `Position: "${pos}".` }}
          />
        </div>
      ))}
    </div>
  ),
};
