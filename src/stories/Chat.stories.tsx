import { expect, userEvent, within, waitFor, fireEvent } from 'storybook/test';
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Chat } from '../components/Chat';
import type { ChatMessage } from '../components/Chat';

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

// ── Playground ────────────────────────────────────────────

function PlaygroundDemo({
  typing,
  typingLabel,
  showAvatars,
}: {
  typing: boolean;
  typingLabel: string;
  showAvatars: boolean;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      side: 'received',
      content: 'Hey! Are you coming to the team lunch today? 🍕',
      sender: { name: 'Alex Morgan' },
      timestamp: t(8),
    },
    {
      id: '2',
      side: 'sent',
      content: 'Absolutely! What time does it start?',
      timestamp: t(7),
      status: 'read',
    },
    {
      id: '3',
      side: 'received',
      content: "12:30pm — we're heading to that new Italian place on 5th Ave",
      sender: { name: 'Alex Morgan' },
      timestamp: t(6),
    },
    {
      id: '4',
      side: 'sent',
      content: "Perfect, I'll be there. Should I bring anything?",
      timestamp: t(5),
      status: 'delivered',
    },
    {
      id: '5',
      side: 'received',
      content: "Just yourself! We've got it sorted 😄",
      sender: { name: 'Alex Morgan' },
      timestamp: t(4),
    },
    {
      id: '6',
      side: 'received',
      content: 'Oh, and grab a parking spot early — it gets busy around noon',
      sender: { name: 'Alex Morgan' },
      timestamp: t(4),
    },
    {
      id: '7',
      side: 'sent',
      content: 'Good tip! See you there 👋',
      timestamp: t(3),
      status: 'sent',
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
        status: 'sending',
      },
    ]);
  }

  return (
    <ChatFrame height={560}>
      <Chat
        messages={messages}
        onSend={handleSend}
        typing={typing}
        typingLabel={typingLabel}
        showAvatars={showAvatars}
        className="h-full"
      />
    </ChatFrame>
  );
}

export const Playground: Story = {
  args: {
    typing: false,
    typingLabel: 'Alex is typing…',
    showAvatars: true,
    messages: [],
  },
  render: (args) => (
    <PlaygroundDemo
      typing={args.typing ?? false}
      typingLabel={args.typingLabel ?? ''}
      showAvatars={args.showAvatars ?? true}
    />
  ),
};

// ── One-on-one ────────────────────────────────────────────

export const OneOnOne: Story = {
  name: 'One-on-one',
  args: { messages: [] },
  render: () => (
    <ChatFrame height={560}>
      <Chat
        className="h-full"
        messages={[
          {
            id: '1',
            side: 'received',
            content: 'Morning! Did you get a chance to review the PRs I sent last night?',
            sender: { name: 'Sarah Kim' },
            timestamp: t(62),
          },
          {
            id: '2',
            side: 'sent',
            content: 'Just getting to them now ☕',
            timestamp: t(60),
            status: 'read',
          },
          {
            id: '3',
            side: 'sent',
            content: 'The first one looks great — left a few minor comments',
            timestamp: t(58),
            status: 'read',
          },
          {
            id: '4',
            side: 'received',
            content: "Oh nice, I'll take a look",
            sender: { name: 'Sarah Kim' },
            timestamp: t(57),
          },
          {
            id: '5',
            side: 'received',
            content: 'What about the second PR?',
            sender: { name: 'Sarah Kim' },
            timestamp: t(57),
          },
          {
            id: '6',
            side: 'sent',
            content:
              "That one needs a bit more work — the edge cases around null state aren't handled",
            timestamp: t(55),
            status: 'read',
          },
          {
            id: '7',
            side: 'received',
            content:
              "Ah right, I knew something felt off. I'll fix that and re-request review this afternoon",
            sender: { name: 'Sarah Kim' },
            timestamp: t(53),
          },
          {
            id: '8',
            side: 'sent',
            content: 'Sounds good, no rush',
            timestamp: t(52),
            status: 'delivered',
          },
        ]}
      />
    </ChatFrame>
  ),
};

// ── Group chat ────────────────────────────────────────────

export const GroupChat: Story = {
  name: 'Group chat',
  args: { messages: [] },
  render: () => (
    <ChatFrame height={580}>
      <Chat
        className="h-full"
        messages={[
          {
            id: '1',
            side: 'received',
            content:
              "Who's up for a code review session this afternoon? I've got three PRs ready 🙏",
            sender: { name: 'Alice Chen', role: 'Engineering' },
            timestamp: t(45),
          },
          {
            id: '2',
            side: 'received',
            content: "I'm free from 3pm onwards",
            sender: { name: 'Bob Patel', role: 'Engineering' },
            timestamp: t(44),
          },
          {
            id: '3',
            side: 'received',
            content: 'Same, 3pm works!',
            sender: { name: 'Marcus Lee', role: 'Design' },
            timestamp: t(43),
          },
          {
            id: '4',
            side: 'sent',
            content: "Works for me, I'll set up the meeting link",
            timestamp: t(42),
            status: 'read',
          },
          {
            id: '5',
            side: 'received',
            content: '👍',
            sender: { name: 'Bob Patel', role: 'Engineering' },
            timestamp: t(41),
          },
          {
            id: '6',
            side: 'received',
            content: "Thanks everyone! I'll drop the PR links in the thread beforehand",
            sender: { name: 'Alice Chen', role: 'Engineering' },
            timestamp: t(40),
          },
          {
            id: '7',
            side: 'received',
            content: "Also bringing snacks to the office if anyone's around in person 🍩",
            sender: { name: 'Alice Chen', role: 'Engineering' },
            timestamp: t(40),
          },
          {
            id: '8',
            side: 'sent',
            content: "Now you're speaking my language",
            timestamp: t(38),
            status: 'delivered',
          },
          {
            id: '9',
            side: 'received',
            content: 'Haha 😂',
            sender: { name: 'Marcus Lee', role: 'Design' },
            timestamp: t(37),
          },
        ]}
      />
    </ChatFrame>
  ),
};

// ── Support team ──────────────────────────────────────────

export const SupportTeam: Story = {
  name: 'Support team',
  args: { messages: [] },
  render: () => (
    <ChatFrame height={600}>
      <Chat
        className="h-full"
        typing
        typingLabel="Maya is typing…"
        messages={[
          {
            id: '1',
            side: 'sent',
            content:
              "Hi, I'm having trouble connecting my account to the API — getting a 401 on every request",
            timestamp: t(18),
            status: 'read',
          },
          {
            id: '2',
            side: 'received',
            content: "Hi there! Thanks for reaching out. I'm happy to help you get that sorted.",
            sender: { name: 'Maya Patel', role: 'Support Agent' },
            timestamp: t(15),
          },
          {
            id: '3',
            side: 'received',
            content:
              "Could you confirm which authentication method you're using — API key or OAuth?",
            sender: { name: 'Maya Patel', role: 'Support Agent' },
            timestamp: t(15),
          },
          {
            id: '4',
            side: 'sent',
            content: 'API key — I copied it straight from the dashboard',
            timestamp: t(12),
            status: 'read',
          },
          {
            id: '5',
            side: 'received',
            content:
              'Got it. A 401 with a valid key usually means the key is scoped to a different environment. Are you hitting the production or sandbox endpoint?',
            sender: { name: 'Maya Patel', role: 'Support Agent' },
            timestamp: t(10),
          },
          {
            id: '6',
            side: 'sent',
            content: "Oh — I'm using the sandbox key against production. That's probably it!",
            timestamp: t(6),
            status: 'read',
          },
          {
            id: '7',
            side: 'received',
            content:
              "Exactly that 😄 Swap in your production key and you should be good to go. Let me know if it's still failing!",
            sender: { name: 'Maya Patel', role: 'Support Agent' },
            timestamp: t(4),
          },
        ]}
      />
    </ChatFrame>
  ),
};

// ── AI Assistant ──────────────────────────────────────────

export const AIAssistant: Story = {
  name: 'AI Assistant',
  args: { messages: [] },
  render: () => (
    <ChatFrame height={600}>
      <Chat
        className="h-full"
        messages={[
          {
            id: '1',
            side: 'sent',
            content: 'Can you summarise the key changes in our last sprint?',
            timestamp: t(10),
            status: 'read',
          },
          {
            id: '2',
            side: 'received',
            content: "Sure! Here's a summary of the main changes from the last sprint:",
            sender: { name: 'Aria', role: 'AI Assistant' },
            timestamp: t(9),
          },
          {
            id: '3',
            side: 'received',
            content:
              '1. Redesigned the onboarding flow — reduced steps from 7 to 4\n2. Migrated the data pipeline to the new queue infrastructure\n3. Fixed 12 accessibility issues flagged in the audit\n4. Shipped the dark mode toggle to 100% of users',
            sender: { name: 'Aria', role: 'AI Assistant' },
            timestamp: t(9),
          },
          {
            id: '4',
            side: 'sent',
            content: 'Great, which items are still in progress?',
            timestamp: t(7),
            status: 'read',
          },
          {
            id: '5',
            side: 'received',
            content: 'Based on the open tickets, two items are still in progress:',
            sender: { name: 'Aria', role: 'AI Assistant' },
            timestamp: t(6),
          },
          {
            id: '6',
            side: 'received',
            content:
              '• CSV export for the analytics dashboard (blocked on design sign-off)\n• Rate limiting on the public API (in code review)',
            sender: { name: 'Aria', role: 'AI Assistant' },
            timestamp: t(6),
          },
          {
            id: '7',
            side: 'sent',
            content: 'Perfect, thanks Aria!',
            timestamp: t(3),
            status: 'delivered',
          },
          {
            id: '8',
            side: 'received',
            content: 'Happy to help! Let me know if you need anything else.',
            sender: { name: 'Aria', role: 'AI Assistant' },
            timestamp: t(2),
          },
        ]}
      />
    </ChatFrame>
  ),
};

// ── Delivery status ───────────────────────────────────────

export const DeliveryStatus: Story = {
  name: 'Delivery status',
  args: { messages: [] },
  render: () => (
    <ChatFrame height={480}>
      <Chat
        className="h-full"
        messages={[
          {
            id: '1',
            side: 'sent',
            content: 'Are you free for a quick call?',
            timestamp: t(10),
            status: 'read',
          },
          {
            id: '2',
            side: 'received',
            content: 'Yes, give me 5 minutes!',
            sender: { name: 'Jordan' },
            timestamp: t(9),
          },
          {
            id: '3',
            side: 'sent',
            content: 'Great, calling you now',
            timestamp: t(4),
            status: 'delivered',
          },
          {
            id: '4',
            side: 'sent',
            content: 'No answer — will try again in a bit',
            timestamp: t(2),
            status: 'sent',
          },
          {
            id: '5',
            side: 'sent',
            content: 'Sending you the doc in the meantime',
            timestamp: t(1),
            status: 'sending',
          },
        ]}
      />
    </ChatFrame>
  ),
};

// ── Image messages ────────────────────────────────────────

export const ImageMessages: Story = {
  name: 'Image messages',
  args: { messages: [] },
  render: () => (
    <ChatFrame height={560}>
      <Chat
        className="h-full"
        messages={[
          {
            id: '1',
            side: 'received',
            content: 'Check out the view from the office today 😍',
            sender: { name: 'Priya S' },
            timestamp: t(15),
          },
          {
            id: '2',
            side: 'received',
            type: 'image',
            content: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80',
            sender: { name: 'Priya S' },
            timestamp: t(15),
          },
          {
            id: '3',
            side: 'sent',
            content: "Wow, that's stunning! Which floor are you on?",
            timestamp: t(12),
            status: 'read',
          },
          {
            id: '4',
            side: 'received',
            content: '32nd floor — the new space is incredible',
            sender: { name: 'Priya S' },
            timestamp: t(11),
          },
          {
            id: '5',
            side: 'sent',
            content: "Here's what our view looks like in comparison 😅",
            timestamp: t(8),
            status: 'read',
          },
          {
            id: '6',
            side: 'sent',
            type: 'image',
            content: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
            timestamp: t(8),
            status: 'delivered',
          },
        ]}
      />
    </ChatFrame>
  ),
};

// ── Image lightbox ────────────────────────────────────────
// Tap any image thumbnail to open the full-size lightbox.
// Close by pressing ✕, clicking the backdrop, or pressing Escape.

export const ImageLightbox: Story = {
  name: 'Image lightbox — tap to open / close',
  args: { messages: [] },
  render: () => (
    <ChatFrame height={600}>
      <Chat
        className="h-full"
        messages={[
          {
            id: '1',
            side: 'received',
            content:
              'Tap either image to open it full-screen, then close with ✕, Escape, or by clicking the backdrop 👇',
            sender: { name: 'Priya S' },
            timestamp: t(20),
          },
          {
            id: '2',
            side: 'received',
            type: 'image',
            content: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
            sender: { name: 'Priya S' },
            timestamp: t(19),
          },
          {
            id: '3',
            side: 'sent',
            content: "Love that shot — here's one from my end 📸",
            timestamp: t(10),
            status: 'read',
          },
          {
            id: '4',
            side: 'sent',
            type: 'image',
            content: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
            timestamp: t(9),
            status: 'delivered',
          },
        ]}
      />
    </ChatFrame>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const user = userEvent.setup();

    await step('click an image → lightbox dialog opens', async () => {
      const images = canvas.getAllByRole('img');
      await user.click(images[0]);
      await waitFor(() => expect(body.getByRole('dialog')).toBeVisible());
    });

    await step('click Close → lightbox closes', async () => {
      await user.click(body.getByRole('button', { name: /close image/i }));
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    });

    await step('open lightbox again → click backdrop → lightbox closes', async () => {
      const images = canvas.getAllByRole('img');
      await user.click(images[0]);
      await waitFor(() => expect(body.getByRole('dialog')).toBeVisible());
      // fireEvent dispatches directly on the backdrop element, bypassing the
      // inner stopPropagation so setViewingImage(null) fires correctly.
      fireEvent.click(body.getByRole('dialog'));
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    });
  },
};

// ── Typing indicator ──────────────────────────────────────

export const TypingIndicator: Story = {
  name: 'Typing indicator',
  args: { messages: [] },
  render: () => (
    <ChatFrame height={400}>
      <Chat
        className="h-full"
        typing
        typingLabel="Alex is typing…"
        messages={[
          {
            id: '1',
            side: 'sent',
            content: 'What do you think of the new design direction?',
            timestamp: t(2),
            status: 'read',
          },
          {
            id: '2',
            side: 'received',
            content: 'Honestly? I love it — the palette is really cohesive',
            sender: { name: 'Alex Morgan' },
            timestamp: t(1),
          },
        ]}
      />
    </ChatFrame>
  ),
};

// ── Emoji reactions ───────────────────────────────────────
// Long-press any bubble to open the quick-reaction picker.

export const EmojiReactions: Story = {
  name: 'Emoji reactions — long-press',
  args: { messages: [] },
  render: () => (
    <ChatFrame height={420}>
      <Chat
        className="h-full"
        messages={[
          {
            id: 'msg1',
            side: 'received',
            content: 'Long-press me to react!',
            // sender.avatar covers the image-avatar branch of SenderAvatar
            sender: {
              name: 'Priya',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=56&h=56&q=80&fit=crop',
            },
            timestamp: t(5),
          },
          {
            id: 'msg2',
            side: 'sent',
            content: 'Long-press me too',
            timestamp: t(4),
            status: 'sent',
          },
        ]}
      />
    </ChatFrame>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // Helper: simulate a long-press by dispatching pointerdown directly on the
    // bubble-column div (a non-interactive element) and waiting for the 500 ms timer.
    async function longPress(el: HTMLElement) {
      fireEvent.pointerDown(el, { clientX: 10, clientY: 10, pointerId: 1 });
      await new Promise((r) => setTimeout(r, 600));
    }
    function releasePress(el: HTMLElement) {
      fireEvent.pointerUp(el, { pointerId: 1 });
    }

    await step('long-press received bubble → emoji picker appears', async () => {
      // getByText returns the text-bubble div; .parentElement is the bubble column
      const bubble = canvas.getByText('Long-press me to react!').parentElement!;
      await longPress(bubble);
      releasePress(bubble);
      await waitFor(() =>
        expect(canvas.getByRole('button', { name: /react with ❤️/i })).toBeVisible(),
      );
    });

    await step('click ❤️ → reaction added below bubble, picker closes', async () => {
      await user.click(canvas.getByRole('button', { name: /react with ❤️/i }));
      await waitFor(() =>
        expect(canvas.getByRole('button', { name: /remove ❤️ reaction/i })).toBeVisible(),
      );
      expect(canvas.queryByRole('button', { name: /react with ❤️/i })).not.toBeInTheDocument();
    });

    await step('click reaction bubble again → reaction removed', async () => {
      await user.click(canvas.getByRole('button', { name: /remove ❤️ reaction/i }));
      await waitFor(() =>
        expect(
          canvas.queryByRole('button', { name: /remove ❤️ reaction/i }),
        ).not.toBeInTheDocument(),
      );
    });

    await step('long-press sent bubble → Escape closes the picker', async () => {
      const sentBubble = canvas.getByText('Long-press me too').parentElement!;
      await longPress(sentBubble);
      releasePress(sentBubble);
      await waitFor(() =>
        // Use a specific emoji so the query matches exactly one button
        expect(canvas.getByRole('button', { name: /react with ❤️/i })).toBeVisible(),
      );
      await user.keyboard('{Escape}');
      await waitFor(() =>
        expect(
          canvas.queryByRole('button', { name: /react with ❤️/i }),
        ).not.toBeInTheDocument(),
      );
    });

    await step('long-press again → mousedown outside → picker closes', async () => {
      const bubble = canvas.getByText('Long-press me to react!').parentElement!;
      await longPress(bubble);
      releasePress(bubble);
      await waitFor(() =>
        expect(canvas.getByRole('button', { name: /react with ❤️/i })).toBeVisible(),
      );
      // The outside-click effect listens for mousedown on document (capture).
      // Dispatch mousedown on the log area (outside the picker) to close it.
      fireEvent.mouseDown(canvas.getByRole('log', { name: /chat messages/i }));
      await waitFor(() =>
        expect(
          canvas.queryByRole('button', { name: /react with ❤️/i }),
        ).not.toBeInTheDocument(),
      );
    });
  },
};

// ── Controlled input ──────────────────────────────────────
// Tests the isControlled=true branches in handleChange and handleSend.

export const ControlledInput: Story = {
  name: 'Controlled input',
  args: { messages: [] },
  render: () => {
    const [value, setValue] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    return (
      <ChatFrame height={400}>
        <Chat
          className="h-full"
          messages={messages}
          value={value}
          onChange={setValue}
          onSend={(text) => {
            setValue(''); // external state clears input (controlled pattern)
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                side: 'sent',
                content: text,
                status: 'sent' as const,
              },
            ]);
          }}
          placeholder="Controlled input…"
        />
      </ChatFrame>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('type in controlled input → value controlled externally', async () => {
      const input = canvas.getByRole('textbox', { name: /message input/i });
      await user.click(input);
      await user.type(input, 'Controlled message');
      await waitFor(() => expect(input).toHaveValue('Controlled message'));
    });

    await step('click send → message appears in log, external onChange clears input', async () => {
      await user.click(canvas.getByRole('button', { name: /send message/i }));
      await waitFor(() =>
        expect(canvas.getByRole('log')).toHaveTextContent('Controlled message'),
      );
      // In controlled mode the component does NOT clear internal state — the
      // external setValue('') call (in onSend above) clears the input.
      await waitFor(() =>
        expect(canvas.getByRole('textbox', { name: /message input/i })).toHaveValue(''),
      );
    });
  },
};
