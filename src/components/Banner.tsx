import React from 'react';
import { X, ArrowRight } from 'lucide-react';

export type BannerVariant = 'dark' | 'primary' | 'light';

export interface BannerAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BannerProps {
  /** Bold label shown before the separator dot and message */
  title?: string;
  /** Main announcement text or element */
  message?: React.ReactNode;
  /** Optional call-to-action link or button */
  action?: BannerAction;
  /** Show a dismiss (×) button and call this when clicked */
  onDismiss?: () => void;
  /**
   * Visual style.
   * - `'dark'`    — ink-900 background with GP primary gradient blobs (default)
   * - `'primary'` — primary-500 background with subtle gradient blobs
   * - `'light'`   — ink-50 background with a bottom border; works on white page backgrounds
   */
  variant?: BannerVariant;
  className?: string;
}

// ── Variant token maps ─────────────────────────────────────

const containerMap: Record<BannerVariant, string> = {
  dark:    'bg-ink-900 border-b border-white/10',
  primary: 'bg-primary-500 border-b border-ink-900/10',
  light:   'bg-ink-50 dark:bg-ink-800 border-b border-ink-200 dark:border-ink-700',
};

const textMap: Record<BannerVariant, string> = {
  dark:    'text-ink-100',
  primary: 'text-ink-900',
  light:   'text-ink-600 dark:text-ink-300',
};

const titleMap: Record<BannerVariant, string> = {
  dark:    'text-white',
  primary: 'text-ink-900',
  light:   'text-ink-900 dark:text-ink-50',
};

const actionMap: Record<BannerVariant, string> = {
  dark:    'bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/20',
  primary: 'bg-ink-900/10 text-ink-900 ring-1 ring-inset ring-ink-900/20 hover:bg-ink-900/20',
  light:   'bg-primary-500 text-ink-900 hover:bg-primary-600',
};

const dismissMap: Record<BannerVariant, string> = {
  dark:    'text-ink-300 hover:text-white',
  primary: 'text-ink-700 hover:text-ink-900',
  light:   'text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-100',
};

// Polygon clip-path shared by both decorative blobs
const BLOB_CLIP =
  'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)';

export function Banner({
  title,
  message,
  action,
  onDismiss,
  variant = 'dark',
  className = '',
}: BannerProps) {
  const blobCls =
    variant === 'dark'
      ? 'bg-gradient-to-r from-primary-500 to-primary-300 opacity-20'
      : 'bg-gradient-to-r from-white to-primary-200 opacity-30';

  const actionEl = action ? (
    action.href ? (
      <a
        href={action.href}
        className={[
          'flex-none rounded-full px-3.5 py-1 text-sm font-semibold font-body transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
          actionMap[variant],
        ].join(' ')}
      >
        {action.label} <ArrowRight className="inline w-3.5 h-3.5 ml-1" aria-hidden="true" />
      </a>
    ) : (
      <button
        type="button"
        onClick={action.onClick}
        className={[
          'flex-none rounded-full px-3.5 py-1 text-sm font-semibold font-body transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
          actionMap[variant],
        ].join(' ')}
      >
        {action.label} <ArrowRight className="inline w-3.5 h-3.5 ml-1" aria-hidden="true" />
      </button>
    )
  ) : null;

  return (
    <div
      className={[
        'relative isolate flex items-center gap-x-6 overflow-hidden px-6 py-2.5',
        'sm:px-3.5',
        // When a dismiss button is present, sm:before:flex-1 creates an equal
        // invisible spacer before the content so it stays visually centred.
        // Without dismiss, just centre with justify-center.
        onDismiss ? 'sm:before:flex-1' : 'sm:justify-center',
        containerMap[variant],
        className,
      ].join(' ')}
    >
      {/* Decorative gradient blobs — dark & primary variants only */}
      {variant !== 'light' && (
        <>
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
          >
            <div
              style={{ clipPath: BLOB_CLIP }}
              className={`aspect-577/310 w-xl ${blobCls}`}
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
          >
            <div
              style={{ clipPath: BLOB_CLIP }}
              className={`aspect-577/310 w-xl ${blobCls}`}
            />
          </div>
        </>
      )}

      {/* Content */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className={`text-sm/6 ${textMap[variant]}`}>
          {title && (
            <>
              <strong className={`font-semibold font-display ${titleMap[variant]}`}>
                {title}
              </strong>
              {/* Separator dot */}
              <svg
                viewBox="0 0 2 2"
                aria-hidden="true"
                className="mx-2 inline size-0.5 fill-current"
              >
                <circle r={1} cx={1} cy={1} />
              </svg>
            </>
          )}
          {message}
        </p>
        {actionEl}
      </div>

      {/* Dismiss button */}
      {onDismiss && (
        <div className="flex flex-1 justify-end">
          <button
            type="button"
            onClick={onDismiss}
            className={[
              '-m-3 p-3 transition-colors focus-visible:-outline-offset-4',
              dismissMap[variant],
            ].join(' ')}
          >
            <span className="sr-only">Dismiss</span>
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
