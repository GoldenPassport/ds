import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export type NotificationVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

export type NotificationPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface NotificationAction {
  label:   string;
  onClick: () => void;
}

export interface NotificationItem {
  id:        string;
  title?:    string;
  body?:     string;
  variant?:  NotificationVariant;
  /** Override the default icon. Pass null to hide it entirely. */
  icon?:     React.ReactNode | null;
  /** Show a user avatar instead of a variant icon */
  avatar?:   { src?: string; name: string };
  actions?:  NotificationAction[];
  /** Auto-dismiss after ms. Default 5000. Pass 0 for persistent. */
  duration?: number;
}

export interface NotificationStackProps {
  notifications: NotificationItem[];
  onDismiss:     (id: string) => void;
  position?:     NotificationPosition;
  /** Render into a document.body portal. Default true — set false in tests / Storybook. */
  portal?:       boolean;
}

// ── Variant config ────────────────────────────────────────

const variantIcon: Record<NotificationVariant, React.ElementType | null> = {
  default: null,
  info:    Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error:   XCircle,
};

const variantIconColor: Record<NotificationVariant, string> = {
  default: '',
  info:    'text-slate-500 dark:text-slate-400',
  success: 'text-green-500 dark:text-green-400',
  warning: 'text-gold-500 dark:text-gold-400',
  error:   'text-red-500 dark:text-red-400',
};

// ── Position config ───────────────────────────────────────

const positionClass: Record<NotificationPosition, string> = {
  'top-left':      'top-4 left-4 items-start',
  'top-center':    'top-4 left-1/2 -translate-x-1/2 items-center',
  'top-right':     'top-4 right-4 items-end',
  'bottom-left':   'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right':  'bottom-4 right-4 items-end',
};

// ── NotificationCard ──────────────────────────────────────

export interface NotificationCardProps {
  item:      NotificationItem;
  onDismiss: (id: string) => void;
}

export function NotificationCard({ item, onDismiss }: NotificationCardProps) {
  const { id, title, body, variant = 'default', icon, avatar, actions } = item;

  const IconEl = variantIcon[variant];

  const resolvedIcon =
    icon === null      ? null :
    icon !== undefined ? icon :
    IconEl             ? <IconEl className={`w-5 h-5 shrink-0 ${variantIconColor[variant]}`} aria-hidden /> :
                         null;

  const initials = avatar?.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const hasLeading = resolvedIcon !== null || !!avatar;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={[
        'w-80 max-w-[calc(100vw-2rem)] pointer-events-auto',
        'bg-white dark:bg-ink-800',
        'rounded-lg shadow-md dark:shadow-dark-md',
        'border border-ink-100 dark:border-ink-700',
        'p-4 animate-gp-slide-up',
      ].join(' ')}
    >
      <div className="flex gap-3">

        {/* Leading: avatar or variant icon */}
        {hasLeading && (
          <div className="shrink-0 mt-0.5">
            {avatar ? (
              avatar.src ? (
                <img
                  src={avatar.src}
                  alt={avatar.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="inline-flex w-8 h-8 rounded-full bg-ink-200 dark:bg-ink-600 items-center justify-center text-xs font-semibold font-body text-ink-700 dark:text-ink-200">
                  {initials}
                </span>
              )
            ) : resolvedIcon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 leading-snug">
              {title}
            </p>
          )}
          {body && (
            <p className={[
              'text-sm font-body text-ink-500 dark:text-ink-400 leading-relaxed',
              title ? 'mt-0.5' : '',
            ].join(' ')}>
              {body}
            </p>
          )}
          {actions && actions.length > 0 && (
            <div className="mt-3 flex gap-3">
              {actions.map((action, i) => (
                <button
                  key={i}
                  onClick={action.onClick}
                  className={[
                    'text-sm font-semibold font-body transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 rounded',
                    i === 0
                      ? 'text-gold-600 hover:text-gold-700 dark:text-gold-400 dark:hover:text-gold-300'
                      : 'text-ink-400 hover:text-ink-600 dark:text-ink-500 dark:hover:text-ink-300',
                  ].join(' ')}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(id)}
          aria-label="Dismiss notification"
          className={[
            'shrink-0 -mr-1 -mt-1 p-1 rounded',
            'text-ink-300 hover:text-ink-500 dark:text-ink-600 dark:hover:text-ink-400',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40',
          ].join(' ')}
        >
          <X className="w-4 h-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

// ── NotificationStack ─────────────────────────────────────

export function NotificationStack({
  notifications,
  onDismiss,
  position = 'top-right',
  portal   = true,
}: NotificationStackProps) {
  const content = (
    <div
      role="region"
      aria-label="Notifications"
      className={[
        'fixed z-50 flex flex-col gap-3 pointer-events-none',
        positionClass[position],
      ].join(' ')}
    >
      {notifications.map(item => (
        <NotificationCard key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  );

  if (portal && typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }
  return content;
}

// ── useNotifications ──────────────────────────────────────

let _counter = 0;

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const t = timers.current.get(id);
    if (t) { clearTimeout(t); timers.current.delete(id); }
  }, []);

  const add = useCallback((item: Omit<NotificationItem, 'id'>) => {
    const id = `notif-${++_counter}`;
    const duration = item.duration ?? 5000;
    setNotifications(prev => [...prev, { ...item, id }]);
    if (duration > 0) {
      timers.current.set(id, setTimeout(() => dismiss(id), duration));
    }
    return id;
  }, [dismiss]);

  const dismissAll = useCallback(() => {
    timers.current.forEach(t => clearTimeout(t));
    timers.current.clear();
    setNotifications([]);
  }, []);

  useEffect(() => () => { timers.current.forEach(t => clearTimeout(t)); }, []);

  return { notifications, add, dismiss, dismissAll };
}
