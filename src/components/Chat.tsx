import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, X } from 'lucide-react';
import { Badge } from './Badge';
import type { BadgeVariant } from './Badge';

// ── Types ─────────────────────────────────────────────────

export type ChatMessageSide      = 'sent' | 'received';
export type ChatMessageStatus    = 'sending' | 'sent' | 'delivered' | 'read';
export type ChatMessageSentiment =
  | 'happy'
  | 'satisfied'
  | 'neutral'
  | 'confused'
  | 'frustrated'
  | 'angry'
  | 'sad'
  | 'urgent';

export interface ChatSender {
  /** Display name shown above the first message in a group */
  name:    string;
  /** Optional avatar image URL; falls back to initials */
  avatar?: string;
  /**
   * Optional role label shown as a pill badge next to the name.
   * Useful for support queues, AI assistants, or multi-agent threads —
   * e.g. `'AI Assistant'`, `'Support Agent'`, `'Bot'`.
   */
  role?:   string;
}

export interface ChatMessage {
  id:         string;
  /**
   * For `type = 'text'` (default): the message body.
   * For `type = 'image'`: the image URL to display.
   */
  content:    string;
  /** @default 'text' */
  type?:      'text' | 'image';
  side:       ChatMessageSide;
  /**
   * Sender details shown on received messages.
   * `name` is used for grouping — consecutive messages with the same
   * `name` on the same side are collapsed into a single visual group.
   */
  sender?:    ChatSender;
  /** ISO string or Date object — used for timestamp dividers and labels */
  timestamp?: string | Date;
  /** Delivery state shown beneath the last sent message in a group */
  status?:    ChatMessageStatus;
  /**
   * Optional detected or manually assigned sentiment for this message.
   * Renders as a small colour-coded pill beneath the bubble — useful for
   * support queues, AI-analysed conversations, or CX analytics dashboards.
   */
  sentiment?: ChatMessageSentiment;
}

export interface ChatProps {
  messages:      ChatMessage[];
  /** Called when the user submits a new message via Enter or the send button */
  onSend?:       (text: string) => void;
  /** Input placeholder text. @default 'Message' */
  placeholder?:  string;
  /** Show the typing indicator at the bottom of the thread */
  typing?:       boolean;
  /** Label shown next to the typing dots, e.g. "Alex is typing…" */
  typingLabel?:  string;
  /**
   * Optional header rendered above the message list — useful on desktop
   * where a persistent contact name, avatar, and status bar is expected.
   * Receives no wrapper styling so you have full control over layout.
   */
  header?:       React.ReactNode;
  /**
   * Show avatars next to received messages. When `false` the avatar column is
   * removed entirely and the sender name / role badge still appears above the
   * first bubble in each group.
   * @default true
   */
  showAvatars?:  boolean;
  /** Controlled input value */
  value?:        string;
  onChange?:     (val: string) => void;
  className?:    string;
}

// ── Helpers ───────────────────────────────────────────────

function formatTime(ts?: string | Date): string {
  if (!ts) return '';
  const d = typeof ts === 'string' ? new Date(ts) : ts;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDivider(ts: string | Date): string {
  const d = typeof ts === 'string' ? new Date(ts) : ts;
  if (isNaN(d.getTime())) return '';
  const now  = new Date();
  const diff = now.getTime() - d.getTime();
  const oneDay = 86_400_000;
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (diff < oneDay && now.getDate() === d.getDate()) return `Today ${time}`;
  if (diff < 2 * oneDay) return `Yesterday ${time}`;
  return (
    d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) +
    ` ${time}`
  );
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map(w => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Returns true when the time gap between two consecutive messages exceeds
 * one hour — used to decide whether to insert a timestamp divider.
 */
function hasTimestampGap(a?: ChatMessage, b?: ChatMessage): boolean {
  if (!a?.timestamp || !b?.timestamp) return false;
  const ta = typeof a.timestamp === 'string' ? new Date(a.timestamp) : a.timestamp;
  const tb = typeof b.timestamp === 'string' ? new Date(b.timestamp) : b.timestamp;
  return tb.getTime() - ta.getTime() > 60 * 60_000;
}

// ── Group position ────────────────────────────────────────
//
// Consecutive messages from the same sender (side + name) are collapsed
// into a visual group with adjusted corner radii — identical to iMessage.

type GroupPos = 'single' | 'first' | 'middle' | 'last';

function senderKey(m: ChatMessage): string {
  return m.side === 'sent' ? '__sent__' : (m.sender?.name ?? '');
}

function getGroupPos(messages: ChatMessage[], index: number): GroupPos {
  const curr = messages[index];
  const prev = messages[index - 1];
  const next = messages[index + 1];
  const key  = senderKey(curr);

  const continuesPrev = !!(prev && senderKey(prev) === key);
  const continuesNext = !!(next && senderKey(next) === key);

  if (!continuesPrev && !continuesNext) return 'single';
  if (!continuesPrev &&  continuesNext) return 'first';
  if ( continuesPrev &&  continuesNext) return 'middle';
  return 'last';
}

// Corner radius per side + group position.
//
// The "connected" corners (those touching the adjacent bubble in the same
// group) are kept at rounded-sm (4 px) to create the stacked pill look.
// All other corners remain at rounded-2xl (24 px).
const radiusCls: Record<ChatMessageSide, Record<GroupPos, string>> = {
  sent: {
    single: 'rounded-2xl',
    first:  'rounded-2xl rounded-br-sm',
    middle: 'rounded-2xl rounded-r-sm',
    last:   'rounded-2xl rounded-tr-sm',
  },
  received: {
    single: 'rounded-2xl',
    first:  'rounded-2xl rounded-bl-sm',
    middle: 'rounded-2xl rounded-l-sm',
    last:   'rounded-2xl rounded-tl-sm',
  },
};

const statusLabel: Record<ChatMessageStatus, string> = {
  sending:   'Sending…',
  sent:      'Sent',
  delivered: 'Delivered',
  read:      'Read',
};

// ── Sentiment config ──────────────────────────────────────

const sentimentConfig: Record<
  ChatMessageSentiment,
  { emoji: string; label: string; variant: BadgeVariant }
> = {
  happy:      { emoji: '😊', label: 'Happy',      variant: 'happy'      },
  satisfied:  { emoji: '👍', label: 'Satisfied',  variant: 'satisfied'  },
  neutral:    { emoji: '😐', label: 'Neutral',    variant: 'neutral'    },
  confused:   { emoji: '🤔', label: 'Confused',   variant: 'confused'   },
  frustrated: { emoji: '😤', label: 'Frustrated', variant: 'frustrated' },
  angry:      { emoji: '😠', label: 'Angry',      variant: 'angry'      },
  sad:        { emoji: '😔', label: 'Sad',        variant: 'sad'        },
  urgent:     { emoji: '🚨', label: 'Urgent',     variant: 'urgent'     },
};

// ── Emoji reactions ───────────────────────────────────────

/** Emojis offered in the quick-reaction picker. */
const QUICK_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '😡'] as const;

// ── SenderAvatar ──────────────────────────────────────────

function SenderAvatar({ sender }: { sender: ChatSender }) {
  if (sender.avatar) {
    return (
      <img
        src={sender.avatar}
        alt={sender.name}
        className="w-7 h-7 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <span
      role="img"
      aria-label={sender.name}
      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold font-display text-ink-900 select-none bg-primary-500"
    >
      <span aria-hidden="true">{getInitials(sender.name)}</span>
    </span>
  );
}

// ── TypingIndicator ───────────────────────────────────────

function TypingIndicator({ label, showAvatars }: { label: string; showAvatars: boolean }) {
  return (
    <div className="flex items-end gap-2 mt-3" aria-label={label || 'Typing'} role="status">
      {showAvatars && <div className="w-7 shrink-0" aria-hidden="true" />}
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-1.5 bg-ink-100 dark:bg-ink-700 rounded-2xl rounded-tl-sm px-4 py-3">
          <span
            className="w-2 h-2 rounded-full bg-ink-400 dark:bg-ink-400 animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-ink-400 dark:bg-ink-400 animate-bounce"
            style={{ animationDelay: '160ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-ink-400 dark:bg-ink-400 animate-bounce"
            style={{ animationDelay: '320ms' }}
          />
        </div>
        {label && (
          <span className="text-[11px] font-body text-ink-500 dark:text-ink-300 px-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Chat ──────────────────────────────────────────────────

export function Chat({
  messages,
  onSend,
  placeholder   = 'Message',
  typing        = false,
  typingLabel   = '',
  header,
  showAvatars   = true,
  value:        controlledValue,
  onChange:     controlledOnChange,
  className     = '',
}: ChatProps) {
  const isControlled = controlledValue !== undefined;

  const [internalValue, setInternalValue] = useState('');
  const inputValue = isControlled ? (controlledValue ?? '') : internalValue;

  const [viewingImage,      setViewingImage]      = useState<string | null>(null);
  const [activePickerMsgId, setActivePickerMsgId] = useState<string | null>(null);
  const [reactions,         setReactions]         = useState<Record<string, string[]>>({});

  const scrollRef         = useRef<HTMLDivElement>(null);
  const inputRef          = useRef<HTMLTextAreaElement>(null);
  const pickerRef         = useRef<HTMLDivElement>(null);
  const longPressTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClick     = useRef(false);
  const pressStartPos     = useRef<{ x: number; y: number } | null>(null);

  // Close lightbox or emoji picker on Escape
  useEffect(() => {
    if (!viewingImage && !activePickerMsgId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setViewingImage(null); setActivePickerMsgId(null); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewingImage, activePickerMsgId]);

  // Close emoji picker when clicking outside it
  useEffect(() => {
    if (!activePickerMsgId) return;
    function onOutside(e: MouseEvent | TouchEvent) {
      if (pickerRef.current?.contains(e.target as Node)) return;
      setActivePickerMsgId(null);
    }
    document.addEventListener('mousedown', onOutside, true);
    document.addEventListener('touchstart', onOutside, true);
    return () => {
      document.removeEventListener('mousedown', onOutside, true);
      document.removeEventListener('touchstart', onOutside, true);
    };
  }, [activePickerMsgId]);

  // ── Long-press handlers ───────────────────────────────
  function startLongPress(msgId: string, e: React.PointerEvent) {
    suppressClick.current  = false;
    pressStartPos.current  = { x: e.clientX, y: e.clientY };
    longPressTimer.current = setTimeout(() => {
      suppressClick.current = true;
      pressStartPos.current = null;
      setActivePickerMsgId(prev => (prev === msgId ? null : msgId));
      if (typeof navigator.vibrate === 'function') navigator.vibrate(8);
    }, 500);
  }

  function cancelLongPress() {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
    pressStartPos.current = null;
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!pressStartPos.current) return;
    const dx = e.clientX - pressStartPos.current.x;
    const dy = e.clientY - pressStartPos.current.y;
    if (Math.hypot(dx, dy) > 8) cancelLongPress();
  }

  function toggleReaction(msgId: string, emoji: string) {
    setReactions(prev => {
      const cur  = prev[msgId] ?? [];
      const next = cur.includes(emoji) ? cur.filter(e => e !== emoji) : [...cur, emoji];
      return { ...prev, [msgId]: next };
    });
    setActivePickerMsgId(null);
  }

  // Auto-scroll to bottom when new messages arrive or typing indicator changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, typing]);

  // Grow/shrink the textarea to fit its content (capped at 8 rem / ~5 lines)
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [inputValue]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    if (isControlled) controlledOnChange?.(val);
    else setInternalValue(val);
  }

  function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    if (!isControlled) setInternalValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend = inputValue.trim().length > 0;

  return (
    <div
      className={[
        'flex flex-col bg-white dark:bg-ink-900 overflow-hidden',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* ── Optional header ────────────────────────────────── */}
      {header && (
        <div className="shrink-0 border-b border-ink-100 dark:border-ink-800">
          {header}
        </div>
      )}

      {/* ── Message list ──────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 md:px-6 md:py-5"
        tabIndex={0}
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {messages.map((msg, i) => {
          const pos        = getGroupPos(messages, i);
          const isFirst    = pos === 'first'  || pos === 'single';
          const isLast     = pos === 'last'   || pos === 'single';
          const prevMsg    = messages[i - 1];
          const showDivider =
            (i === 0 && !!msg.timestamp) ||
            hasTimestampGap(prevMsg, msg);

          return (
            <React.Fragment key={msg.id}>
              {/* Centered timestamp divider */}
              {showDivider && msg.timestamp && (
                <div className="flex justify-center my-4" aria-hidden="true">
                  <span className="text-[11px] font-body font-medium text-ink-500 dark:text-ink-300 bg-ink-50 dark:bg-ink-800 rounded-full px-3 py-1">
                    {formatDivider(msg.timestamp)}
                  </span>
                </div>
              )}

              {/* Message row */}
              <div
                className={[
                  'flex items-end gap-2',
                  msg.side === 'sent' ? 'flex-row-reverse' : 'flex-row',
                  isFirst ? 'mt-3' : 'mt-0.5',
                ].join(' ')}
              >
                {/* Avatar slot — reserves space so bubbles stay aligned */}
                {msg.side === 'received' && showAvatars && (
                  <div className="w-7 shrink-0 self-end mb-0.5" aria-hidden="true">
                    {isLast && msg.sender && (
                      <SenderAvatar sender={msg.sender} />
                    )}
                  </div>
                )}

                {/* Bubble column */}
                <div
                  className={[
                    // On mobile bubbles fill up to 72% of the container;
                    // on wider screens they cap at 480px so long messages
                    // don't span the full width of a desktop chat pane.
                    'flex flex-col max-w-[72%] md:max-w-[480px]',
                    msg.side === 'sent' ? 'items-end' : 'items-start',
                  ].join(' ')}
                  // Long-press to open emoji reaction picker
                  onPointerDown={(e) => startLongPress(msg.id, e)}
                  onPointerUp={cancelLongPress}
                  onPointerLeave={cancelLongPress}
                  onPointerCancel={cancelLongPress}
                  onPointerMove={handlePointerMove}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {/* Sender name + optional role badge — first bubble of each received group */}
                  {msg.side === 'received' && isFirst && msg.sender?.name && (
                    <div className="flex items-center gap-1.5 px-1 mb-1">
                      <span className="text-xs font-body font-semibold text-ink-700 dark:text-ink-200">
                        {msg.sender.name}
                      </span>
                      {msg.sender.role && (
                        <span className="text-[10px] font-body font-medium leading-none px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-700 text-ink-500 dark:text-ink-300">
                          {msg.sender.role}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Emoji reaction picker — floats above the bubble on long-press */}
                  {activePickerMsgId === msg.id && (
                    <div
                      ref={pickerRef}
                      className={[
                        'flex items-center gap-0.5 mb-1.5',
                        'bg-white dark:bg-ink-800 rounded-full shadow-lg',
                        'border border-ink-100 dark:border-ink-700',
                        'px-1.5 py-1',
                      ].join(' ')}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {QUICK_EMOJIS.map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => toggleReaction(msg.id, emoji)}
                          className={[
                            'w-8 h-8 flex items-center justify-center rounded-full text-lg',
                            'transition-transform duration-100',
                            'hover:scale-125 active:scale-95',
                            (reactions[msg.id] ?? []).includes(emoji)
                              ? 'bg-primary-100 dark:bg-primary-900/40 scale-110'
                              : 'hover:bg-ink-100 dark:hover:bg-ink-700',
                          ].join(' ')}
                          aria-label={`React with ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Bubble */}
                  {msg.type === 'image' ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (suppressClick.current) { suppressClick.current = false; return; }
                        setViewingImage(msg.content);
                      }}
                      aria-label="View full image"
                      className={[
                        'block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
                        radiusCls[msg.side][pos],
                        'overflow-hidden',
                      ].join(' ')}
                    >
                      <img
                        src={msg.content}
                        alt="Shared image"
                        className={[
                          'object-cover max-w-full cursor-zoom-in',
                          'transition-opacity hover:opacity-90',
                        ].join(' ')}
                        style={{ maxHeight: 240 }}
                      />
                    </button>
                  ) : (
                    <div
                      className={[
                        'px-3.5 py-2 text-sm font-body leading-snug select-text',
                        radiusCls[msg.side][pos],
                        msg.side === 'sent'
                          ? 'bg-primary-500 text-ink-900'
                          : 'bg-ink-100 dark:bg-ink-700 text-ink-900 dark:text-ink-50',
                      ].join(' ')}
                    >
                      {msg.content}
                    </div>
                  )}

                  {/* Emoji reactions — displayed below the bubble */}
                  {(reactions[msg.id]?.length ?? 0) > 0 && (
                    <div className={[
                      'flex flex-wrap gap-1 mt-1',
                      msg.side === 'sent' ? 'justify-end' : 'justify-start',
                    ].join(' ')}>
                      {reactions[msg.id].map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => toggleReaction(msg.id, emoji)}
                          className={[
                            'text-base leading-none px-2 py-0.5 rounded-full',
                            'bg-white dark:bg-ink-800',
                            'border border-ink-200 dark:border-ink-700',
                            'shadow-sm hover:bg-ink-50 dark:hover:bg-ink-700',
                            'transition-colors',
                          ].join(' ')}
                          aria-label={`Remove ${emoji} reaction`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Sentiment tag + timestamp + delivery status — one shared row */}
                  {(msg.sentiment || (isLast && (msg.timestamp || msg.status))) && (
                    <div
                      className={[
                        'flex items-center gap-1.5 px-1 mt-1',
                        msg.side === 'sent' ? 'flex-row-reverse' : 'flex-row',
                      ].join(' ')}
                    >
                      {/* Timestamp + status first in DOM so flex-row-reverse
                          keeps them closest to the screen edge on sent messages */}
                      {isLast && msg.timestamp && (
                        <span className="text-[11px] font-body text-ink-500 dark:text-ink-300">
                          {formatTime(msg.timestamp)}
                        </span>
                      )}
                      {isLast && msg.side === 'sent' && msg.status && (
                        <span
                          className={[
                            'text-[11px] font-body',
                            msg.status === 'read'
                              ? 'text-ink-700 dark:text-ink-300'
                              : 'text-ink-500 dark:text-ink-300',
                          ].join(' ')}
                        >
                          {statusLabel[msg.status]}
                        </span>
                      )}
                      {msg.sentiment && (
                        <Badge
                          variant={sentimentConfig[msg.sentiment].variant}
                          icon={sentimentConfig[msg.sentiment].emoji}
                          label={sentimentConfig[msg.sentiment].label}
                          size="sm"
                          aria-label={`Sentiment: ${sentimentConfig[msg.sentiment].label}`}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Typing indicator */}
        {typing && <TypingIndicator label={typingLabel} showAvatars={showAvatars} />}
      </div>

      {/* ── Input bar ─────────────────────────────────────── */}
      <div className="border-t border-ink-100 dark:border-ink-800 px-3 py-2.5 md:px-4 md:py-3 flex items-end gap-2 bg-white dark:bg-ink-900">
        <textarea
          ref={inputRef}
          rows={1}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Message input"
          className={[
            'flex-1 resize-none rounded-2xl border border-ink-200 dark:border-ink-700',
            'bg-white dark:bg-ink-800 text-sm font-body text-ink-900 dark:text-ink-50',
            'placeholder:text-ink-500 dark:placeholder:text-ink-400',
            'px-4 py-2 leading-snug overflow-y-auto',
            'focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-500 focus:border-transparent',
            'transition-shadow',
          ].join(' ')}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className={[
            'shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150',
            canSend
              ? 'bg-primary-500 text-ink-900 hover:bg-primary-600 active:scale-90 cursor-pointer'
              : 'bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-300 cursor-not-allowed',
          ].join(' ')}
        >
          <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Image lightbox ─────────────────────────────── */}
      {viewingImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={() => setViewingImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Inner container — stops click from bubbling to backdrop */}
          <div
            className="relative max-w-[92vw] max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={viewingImage}
              alt="Full-size image"
              className="max-w-full max-h-[92vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setViewingImage(null)}
              aria-label="Close image"
              className={[
                'absolute -top-3 -right-3 w-8 h-8 rounded-full shadow-lg',
                'flex items-center justify-center',
                'bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-200',
                'hover:bg-ink-100 dark:hover:bg-ink-700',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
                'transition-colors',
              ].join(' ')}
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
