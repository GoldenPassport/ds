import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Chat } from '../components/Chat';
import type { ChatMessage, ChatMessageSentiment } from '../components/Chat';

const meta = {
  title: 'Lists/Chat',
  component: Chat,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    placeholder: { control: 'text' },
    typing: { control: 'boolean' },
    typingLabel: { control: 'text' },
    showAvatars: { control: 'boolean' },
    messages: { control: false },
    onSend: { control: false },
    value: { control: false },
    onChange: { control: false },
  },
} satisfies Meta<typeof Chat>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared fixtures ───────────────────────────────────────

const now = new Date();
const t = (offsetMinutes: number) => new Date(now.getTime() - offsetMinutes * 60_000).toISOString();

// ── ChatFrame ─────────────────────────────────────────────
// Mobile: edge-to-edge, no border/shadow/radius.
// sm+:    centred card with border, shadow, and rounded corners.

function ChatFrame({
  children,
  height = 560,
  fullWidth = false,
}: {
  children: React.ReactNode;
  height?: number;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={[
        'w-full overflow-hidden',
        // border — none on mobile, 1 px card border on sm+
        'border-0 sm:border sm:border-ink-200 dark:sm:border-ink-700',
        // shape — flush on mobile, pill on sm+
        'rounded-none sm:rounded-2xl',
        // shadow — none on mobile, soft on sm+
        'shadow-none sm:shadow-md',
        // centering — only when not full-width
        fullWidth ? '' : 'sm:max-w-sm sm:mx-auto',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ height }}
    >
      {children}
    </div>
  );
}

// ── Timestamp dividers ────────────────────────────────────

export const TimestampDividers: Story = {
  name: 'Timestamp dividers',
  args: { messages: [] },
  render: () => {
    const yesterday = new Date(now.getTime() - 26 * 60 * 60_000).toISOString();
    return (
      <ChatFrame height={520}>
        <Chat
          className="h-full"
          messages={[
            {
              id: '1',
              side: 'received',
              content: 'Have you pushed the branch yet?',
              sender: { name: 'Taylor' },
              timestamp: yesterday,
            },
            {
              id: '2',
              side: 'sent',
              content: 'Just pushed — check it out when you get a chance',
              timestamp: yesterday,
              status: 'read',
            },
            {
              id: '3',
              side: 'received',
              content: 'Morning! Left a few review comments on your PR',
              sender: { name: 'Taylor' },
              timestamp: t(30),
            },
            {
              id: '4',
              side: 'sent',
              content: 'Thanks, addressing them now',
              timestamp: t(25),
              status: 'read',
            },
            {
              id: '5',
              side: 'sent',
              content: 'All done — can you take another look?',
              timestamp: t(10),
              status: 'delivered',
            },
          ]}
        />
      </ChatFrame>
    );
  },
};

// ── Empty state ───────────────────────────────────────────

export const EmptyState: Story = {
  name: 'Empty — no messages',
  args: { messages: [] },
  render: () => (
    <ChatFrame height={400}>
      <Chat className="h-full" messages={[]} placeholder="Start a conversation…" />
    </ChatFrame>
  ),
};

// ── No avatars ────────────────────────────────────────────

export const NoAvatars: Story = {
  name: 'No avatars',
  args: { messages: [] },
  render: () => (
    <ChatFrame height={520}>
      <Chat
        className="h-full"
        showAvatars={false}
        messages={[
          {
            id: '1',
            side: 'received',
            content: 'Hey! Quick question about the release timeline',
            sender: { name: 'Alex Morgan' },
            timestamp: t(15),
          },
          {
            id: '2',
            side: 'received',
            content: 'Are we still targeting end of sprint, or has that shifted?',
            sender: { name: 'Alex Morgan' },
            timestamp: t(15),
          },
          {
            id: '3',
            side: 'sent',
            content: 'Still on track for Friday — the last two PRs are in review now',
            timestamp: t(12),
            status: 'read',
          },
          {
            id: '4',
            side: 'received',
            content: "Great, I'll update the stakeholder doc",
            sender: { name: 'Alex Morgan' },
            timestamp: t(10),
          },
          {
            id: '5',
            side: 'sent',
            content: 'Perfect 👍',
            timestamp: t(8),
            status: 'delivered',
          },
        ]}
      />
    </ChatFrame>
  ),
};

// ── Desktop — wide pane ───────────────────────────────────

export const Desktop: Story = {
  name: 'Desktop — wide pane',
  args: { messages: [] },
  render: () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
      {
        id: '1',
        side: 'received',
        content: 'Hey! Check out this photo 📸',
        sender: { name: 'Alex' },
        timestamp: t(5),
      },
      {
        id: '2',
        side: 'received',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80',
        sender: { name: 'Alex' },
        timestamp: t(5),
      },
    ]);

    function handleSend(text: string) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          side: 'sent',
          content: text,
          timestamp: new Date().toISOString(),
          status: 'sent',
        },
      ]);
    }

    return (
      <ChatFrame height={520}>
        <Chat
          className="h-full"
          messages={messages}
          onSend={handleSend}
          placeholder="Type a message…"
        />
      </ChatFrame>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('send button is disabled when input is empty', async () => {
      const sendBtn = await canvas.findByRole('button', { name: /send message/i });
      expect(sendBtn).toBeDisabled();
    });

    await step('type a message → send button becomes enabled', async () => {
      const input = canvas.getByRole('textbox', { name: /message input/i });
      await user.click(input);
      await user.type(input, 'Hello there!');
      await waitFor(() => {
        expect(canvas.getByRole('button', { name: /send message/i })).not.toBeDisabled();
      });
    });

    await step('click send → message appears in the chat log', async () => {
      await user.click(canvas.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(canvas.getByRole('log', { name: /chat messages/i })).toHaveTextContent(
          'Hello there!',
        );
      });
    });

    await step('send button is disabled again after sending', async () => {
      await waitFor(() => {
        expect(canvas.getByRole('button', { name: /send message/i })).toBeDisabled();
      });
    });

    await step('click image thumbnail → lightbox dialog opens', async () => {
      const imgBtn = canvas.getByRole('button', { name: /view full image/i });
      await user.click(imgBtn);
      await waitFor(() => {
        expect(
          within(document.body).getByRole('dialog', { name: /image viewer/i }),
        ).toBeInTheDocument();
      });
    });

    await step('click close button → lightbox closes', async () => {
      await user.click(within(document.body).getByRole('button', { name: /close image/i }));
      await waitFor(() => {
        expect(
          within(document.body).queryByRole('dialog', { name: /image viewer/i }),
        ).not.toBeInTheDocument();
      });
    });

    await step('open lightbox again and press Escape → lightbox closes', async () => {
      await user.click(canvas.getByRole('button', { name: /view full image/i }));
      await waitFor(() => {
        expect(
          within(document.body).getByRole('dialog', { name: /image viewer/i }),
        ).toBeInTheDocument();
      });
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(
          within(document.body).queryByRole('dialog', { name: /image viewer/i }),
        ).not.toBeInTheDocument();
      });
    });
  },
};

// ── Desktop — with conversation list ─────────────────────

type ConversationId = 'alex' | 'support' | 'ai' | 'design';

interface Conversation {
  id: ConversationId;
  name: string;
  preview: string;
  time: string;
  unread?: number;
  online?: boolean;
  messages: ChatMessage[];
}

function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getInitialsLocal(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'alex',
    name: 'Alex Morgan',
    preview: 'Sounds great 👍',
    time: formatRelativeTime(t(48)),
    online: true,
    messages: [
      {
        id: 'a1',
        side: 'received',
        content: 'Morning! Did you get a chance to look at the proposal?',
        sender: { name: 'Alex Morgan' },
        timestamp: t(62),
      },
      {
        id: 'a2',
        side: 'sent',
        content: 'Just finishing it now — really strong work.',
        timestamp: t(60),
        status: 'read',
      },
      {
        id: 'a3',
        side: 'sent',
        content: 'The pricing section needs to be split out more clearly.',
        timestamp: t(59),
        status: 'read',
      },
      {
        id: 'a4',
        side: 'received',
        content: "Good call — I'll add a comparison table",
        sender: { name: 'Alex Morgan' },
        timestamp: t(57),
      },
      { id: 'a5', side: 'sent', content: 'Sounds great 👍', timestamp: t(48), status: 'delivered' },
    ],
  },
  {
    id: 'support',
    name: 'Support Team',
    preview: 'Maya: Happy to help — let me know!',
    time: formatRelativeTime(t(120)),
    unread: 2,
    messages: [
      {
        id: 's1',
        side: 'sent',
        content: "Hi, I'm getting a 401 on every API request",
        timestamp: t(140),
        status: 'read',
      },
      {
        id: 's2',
        side: 'received',
        content: 'Hi there! Happy to help. Are you using an API key or OAuth?',
        sender: { name: 'Maya Patel', role: 'Support Agent' },
        timestamp: t(135),
      },
      {
        id: 's3',
        side: 'sent',
        content: 'API key — copied straight from the dashboard',
        timestamp: t(130),
        status: 'read',
      },
      {
        id: 's4',
        side: 'received',
        content:
          'A 401 with a valid key usually means the key is scoped to a different environment.',
        sender: { name: 'Maya Patel', role: 'Support Agent' },
        timestamp: t(125),
      },
      {
        id: 's5',
        side: 'received',
        content: 'Are you hitting the production or sandbox endpoint?',
        sender: { name: 'Maya Patel', role: 'Support Agent' },
        timestamp: t(125),
      },
      {
        id: 's6',
        side: 'received',
        content: 'Happy to help — let me know!',
        sender: { name: 'Maya Patel', role: 'Support Agent' },
        timestamp: t(120),
      },
    ],
  },
  {
    id: 'ai',
    name: 'Aria',
    preview: 'Aria: Happy to help! Let me know.',
    time: formatRelativeTime(t(3)),
    messages: [
      {
        id: 'i1',
        side: 'sent',
        content: 'Can you summarise the key changes in our last sprint?',
        timestamp: t(10),
        status: 'read',
      },
      {
        id: 'i2',
        side: 'received',
        content: "Sure! Here's a summary:",
        sender: { name: 'Aria', role: 'AI Assistant' },
        timestamp: t(9),
      },
      {
        id: 'i3',
        side: 'received',
        content:
          '1. Onboarding flow redesigned (7 → 4 steps)\n2. Data pipeline migrated to new queue\n3. 12 accessibility issues resolved\n4. Dark mode shipped to 100% of users',
        sender: { name: 'Aria', role: 'AI Assistant' },
        timestamp: t(9),
      },
      { id: 'i4', side: 'sent', content: 'Perfect, thanks Aria!', timestamp: t(3), status: 'read' },
      {
        id: 'i5',
        side: 'received',
        content: 'Happy to help! Let me know if you need anything else.',
        sender: { name: 'Aria', role: 'AI Assistant' },
        timestamp: t(2),
      },
    ],
  },
  {
    id: 'design',
    name: 'Design Team',
    preview: 'Marcus: Haha 😂',
    time: formatRelativeTime(t(37)),
    messages: [
      {
        id: 'd1',
        side: 'received',
        content: "Who's up for a code review session this afternoon?",
        sender: { name: 'Alice Chen', role: 'Engineering' },
        timestamp: t(45),
      },
      {
        id: 'd2',
        side: 'received',
        content: "I'm free from 3pm onwards",
        sender: { name: 'Bob Patel', role: 'Engineering' },
        timestamp: t(44),
      },
      {
        id: 'd3',
        side: 'sent',
        content: "Works for me, I'll set up the meeting link",
        timestamp: t(42),
        status: 'read',
      },
      {
        id: 'd4',
        side: 'received',
        content: 'Also bringing snacks to the office 🍩',
        sender: { name: 'Alice Chen', role: 'Engineering' },
        timestamp: t(40),
      },
      {
        id: 'd5',
        side: 'sent',
        content: "Now you're speaking my language",
        timestamp: t(38),
        status: 'delivered',
      },
      {
        id: 'd6',
        side: 'received',
        content: 'Haha 😂',
        sender: { name: 'Marcus Lee', role: 'Design' },
        timestamp: t(37),
      },
    ],
  },
];

function ConversationItem({
  conv,
  selected,
  onClick,
}: {
  conv: Conversation;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
        selected ? 'bg-ink-100 dark:bg-ink-700' : 'hover:bg-ink-50 dark:hover:bg-ink-800',
      ].join(' ')}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <span
          role="img"
          aria-label={conv.name}
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-display text-ink-900 select-none bg-primary-500"
        >
          <span aria-hidden="true">{getInitialsLocal(conv.name)}</span>
        </span>
        {conv.online && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-ink-900" />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className={[
              'text-sm font-body truncate',
              conv.unread
                ? 'font-semibold text-ink-900 dark:text-ink-50'
                : 'font-medium text-ink-800 dark:text-ink-100',
            ].join(' ')}
          >
            {conv.name}
          </span>
          <span className="text-[11px] font-body text-ink-500 dark:text-ink-300 shrink-0">
            {conv.time}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span className="text-xs font-body text-ink-500 dark:text-ink-300 truncate">
            {conv.preview}
          </span>
          {conv.unread ? (
            <span className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-primary-500 text-ink-900 text-[10px] font-bold font-body flex items-center justify-center px-1">
              {conv.unread}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

function DesktopLayoutDemo() {
  const [selectedId, setSelectedId] = useState<ConversationId>('alex');
  const [threads, setThreads] = useState<Record<ConversationId, ChatMessage[]>>(
    Object.fromEntries(CONVERSATIONS.map((c) => [c.id, c.messages])) as Record<
      ConversationId,
      ChatMessage[]
    >,
  );

  const conv = CONVERSATIONS.find((c) => c.id === selectedId)!;
  const messages = threads[selectedId];

  function handleSend(text: string) {
    const next: ChatMessage = {
      id: Date.now().toString(),
      side: 'sent',
      content: text,
      timestamp: new Date().toISOString(),
      status: 'sending',
    };
    setThreads((prev) => ({ ...prev, [selectedId]: [...prev[selectedId], next] }));
  }

  return (
    <div
      className="flex w-full bg-white dark:bg-ink-900 overflow-hidden border-0 sm:rounded-2xl sm:border sm:border-ink-200 dark:sm:border-ink-700 sm:shadow-md"
      style={{ height: 620 }}
    >
      {/* ── Conversation list ────────────────────────────── */}
      <div className="w-64 shrink-0 flex flex-col border-r border-ink-100 dark:border-ink-800">
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-ink-100 dark:border-ink-800">
          <h2 className="text-base font-semibold font-display text-ink-900 dark:text-ink-50">
            Messages
          </h2>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-ink-100 dark:border-ink-800">
          <div className="flex items-center gap-2 bg-ink-50 dark:bg-ink-800 rounded-xl px-3 py-1.5">
            <svg
              className="w-3.5 h-3.5 text-ink-500 dark:text-ink-300 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx={11} cy={11} r={8} />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="text-xs font-body text-ink-500 dark:text-ink-300">Search</span>
          </div>
        </div>

        {/* Conversation items */}
        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map((c) => (
            <ConversationItem
              key={c.id}
              conv={c}
              selected={c.id === selectedId}
              onClick={() => setSelectedId(c.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Active chat ──────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Chat
          key={selectedId}
          className="flex-1 min-h-0"
          messages={messages}
          onSend={handleSend}
          header={
            <div className="flex items-center gap-3 px-5 py-3.5">
              <div className="relative shrink-0">
                <span
                  role="img"
                  aria-label={conv.name}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-display text-ink-900 select-none bg-primary-500"
                >
                  <span aria-hidden="true">{getInitialsLocal(conv.name)}</span>
                </span>
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-ink-900" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 truncate">
                  {conv.name}
                </p>
                <p className="text-xs font-body text-ink-500 dark:text-ink-300">
                  {conv.online ? (
                    <span className="text-green-700 dark:text-green-400">Online</span>
                  ) : (
                    'Offline'
                  )}
                </p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

export const DesktopLayout: Story = {
  name: 'Desktop — with conversation list',
  parameters: { layout: 'padded' },
  args: { messages: [] },
  render: () => <DesktopLayoutDemo />,
};

// ── Sentiment tags ────────────────────────────────────────
//
// Each message can carry an optional `sentiment` field — useful for
// support queues, AI-analysed threads, or CX analytics dashboards.
// The tag renders as a colour-coded pill beneath the bubble.

export const SentimentTags: Story = {
  name: 'Sentiment tags',
  args: { messages: [] },
  render: () => (
    <ChatFrame height={680}>
      <Chat
        className="h-full"
        messages={[
          {
            id: 's1',
            side: 'sent',
            content:
              "Hi, I placed an order 3 days ago and it still hasn't shipped. I need this for an event tomorrow.",
            timestamp: t(30),
            status: 'read',
            sentiment: 'frustrated' as ChatMessageSentiment,
          },
          {
            id: 's2',
            side: 'received',
            content: "Hi! I'm really sorry to hear that — let me pull up your order right now.",
            sender: { name: 'Priya Nair', role: 'Support Agent' },
            timestamp: t(27),
            sentiment: 'neutral' as ChatMessageSentiment,
          },
          {
            id: 's3',
            side: 'received',
            content:
              "I can see the delay was caused by a warehouse issue on our end. I'm escalating this to our fulfilment team immediately.",
            sender: { name: 'Priya Nair', role: 'Support Agent' },
            timestamp: t(26),
          },
          {
            id: 's4',
            side: 'sent',
            content:
              'This is completely unacceptable. I paid for express shipping and I have guests arriving tomorrow!',
            timestamp: t(22),
            status: 'read',
            sentiment: 'angry' as ChatMessageSentiment,
          },
          {
            id: 's5',
            side: 'received',
            content:
              "You're absolutely right and I sincerely apologise. I've arranged a same-day courier for you — you'll receive a tracking link within the next 30 minutes.",
            sender: { name: 'Priya Nair', role: 'Support Agent' },
            timestamp: t(18),
            sentiment: 'neutral' as ChatMessageSentiment,
          },
          {
            id: 's6',
            side: 'sent',
            content: "OK, thank you. I'll wait for the tracking link.",
            timestamp: t(15),
            status: 'read',
            sentiment: 'confused' as ChatMessageSentiment,
          },
          {
            id: 's7',
            side: 'received',
            content:
              "Just sent it to your email! The courier will arrive between 2–5 pm today. And I've added a 20% discount to your account for the inconvenience.",
            sender: { name: 'Priya Nair', role: 'Support Agent' },
            timestamp: t(10),
          },
          {
            id: 's8',
            side: 'sent',
            content: "Got it — that's much appreciated, thank you!",
            timestamp: t(6),
            status: 'delivered',
            sentiment: 'satisfied' as ChatMessageSentiment,
          },
          {
            id: 's9',
            side: 'received',
            content: 'Great, glad we could sort this out for you. Enjoy the event! 🎉',
            sender: { name: 'Priya Nair', role: 'Support Agent' },
            timestamp: t(4),
            sentiment: 'happy' as ChatMessageSentiment,
          },
        ]}
      />
    </ChatFrame>
  ),
};

// ── Enter-to-send interaction ─────────────────────────────

export const EnterToSend: Story = {
  name: 'Enter to send',
  args: { messages: [] },
  render: () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const handleSend = (text: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          side: 'sent',
          content: text,
          timestamp: new Date().toISOString(),
          status: 'sent',
        },
      ]);
    };
    return (
      <ChatFrame height={400}>
        <Chat
          className="h-full"
          messages={messages}
          onSend={handleSend}
          placeholder="Type and press Enter…"
        />
      </ChatFrame>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('type a message and press Enter → message is sent', async () => {
      const input = await canvas.findByRole('textbox', { name: /message input/i });
      await user.click(input);
      await user.type(input, 'Enter key test{Enter}');
      await waitFor(() => {
        expect(canvas.getByRole('log', { name: /chat messages/i })).toHaveTextContent(
          'Enter key test',
        );
      });
    });

    await step('input is cleared after sending', async () => {
      const input = canvas.getByRole('textbox', { name: /message input/i });
      await waitFor(() => {
        expect((input as HTMLTextAreaElement).value).toBe('');
      });
    });

    await step('Shift+Enter inserts a newline instead of sending', async () => {
      const input = canvas.getByRole('textbox', { name: /message input/i });
      await user.click(input);
      await user.type(input, 'line one');
      await user.keyboard('{Shift>}{Enter}{/Shift}');
      await user.type(input, 'line two');
      // Message count should NOT have increased — no new message in log yet
      const logText = canvas.getByRole('log', { name: /chat messages/i }).textContent ?? '';
      expect(logText).not.toContain('line two');
    });
  },
};

// ── All sentiments reference ──────────────────────────────

export const AllSentiments: Story = {
  name: 'All sentiments — reference',
  args: { messages: [] },
  render: () => {
    const allSentiments: ChatMessageSentiment[] = [
      'happy',
      'satisfied',
      'neutral',
      'confused',
      'frustrated',
      'angry',
      'sad',
      'urgent',
    ];
    const messages: ChatMessage[] = allSentiments.map((s, i) => ({
      id: `sent-${i}`,
      side: (i % 2 === 0 ? 'received' : 'sent') as 'received' | 'sent',
      content: `This is a ${s} message.`,
      sender: i % 2 === 0 ? { name: 'Agent' } : undefined,
      timestamp: t(allSentiments.length - i),
      status: i % 2 !== 0 ? ('delivered' as const) : undefined,
      sentiment: s,
    }));
    return (
      <ChatFrame height={640}>
        <Chat className="h-full" messages={messages} />
      </ChatFrame>
    );
  },
};
