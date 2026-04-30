/**
 * ErrorPage — full-page error state for HTTP and application errors.
 *
 * Use the `variant` shorthand to get sensible defaults for the most common
 * HTTP error codes, then override individual props as needed:
 *
 *   <ErrorPage variant="404" primaryAction={{ label: 'Go home', href: '/' }} />
 *
 * Or build a fully custom error page from scratch:
 *
 *   <ErrorPage
 *     code="503"
 *     title="Under maintenance"
 *     description="Back in a few minutes."
 *     icon={<WrenchIcon />}
 *   />
 */
import React from 'react';
import { Button } from './Button';

// ── Types ─────────────────────────────────────────────────

export type ErrorPageVariant = '404' | '500' | '403' | '503';

export interface ErrorPageAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ErrorPageProps {
  /**
   * Convenience shorthand. When set, pre-fills `code`, `title`, and
   * `description` with sensible defaults for that HTTP status — all of
   * which can still be overridden by explicit props.
   */
  variant?: ErrorPageVariant;
  /**
   * Status code displayed as a large in-flow number above the title.
   * Accepts any string so you can use custom codes like `"E_NETWORK"`.
   */
  code?: string | number;
  title?: string;
  description?: string;
  /**
   * Optional icon rendered above the title. When provided, the large code
   * number is hidden and the icon is shown instead. Pass a Lucide icon or
   * any ReactNode sized at ~32 px.
   */
  icon?: React.ReactNode;
  primaryAction?: ErrorPageAction;
  secondaryAction?: ErrorPageAction;
  /**
   * When `true` the component fills the full viewport height (`min-h-screen`).
   * When `false` (default) it uses a comfortable fixed minimum height so it
   * can be embedded inside a layout or Storybook canvas.
   */
  fullScreen?: boolean;
  className?: string;
}

// ── Presets ────────────────────────────────────────────────

const PRESETS: Record<ErrorPageVariant, { code: string; title: string; description: string }> = {
  '404': {
    code: '404',
    title: 'Page not found',
    description:
      "Sorry, we couldn't find the page you're looking for. It may have been moved, deleted, or never existed.",
  },
  '500': {
    code: '500',
    title: 'Something went wrong',
    description:
      'We hit an unexpected error on our end. Our team has been notified and is working on a fix.',
  },
  '403': {
    code: '403',
    title: 'Access denied',
    description:
      "You don't have permission to view this page. Contact your administrator if you think this is a mistake.",
  },
  '503': {
    code: '503',
    title: 'Under maintenance',
    description:
      "We're performing scheduled maintenance to improve the platform. We'll be back online shortly.",
  },
};

// ── Action helper ──────────────────────────────────────────

function ActionBtn({ action, variant }: { action: ErrorPageAction; variant: 'primary' | 'ghost' }) {
  const el = (
    <Button variant={variant} size="lg" onClick={action.onClick}>
      {action.label}
    </Button>
  );
  return action.href ? <a href={action.href}>{el}</a> : el;
}

// ── Component ──────────────────────────────────────────────

export function ErrorPage({
  variant,
  code: codeProp,
  title: titleProp,
  description: descProp,
  icon,
  primaryAction,
  secondaryAction,
  fullScreen = false,
  className = '',
}: ErrorPageProps) {
  const preset = variant ? PRESETS[variant] : undefined;
  const code = codeProp ?? preset?.code;
  const title = titleProp ?? preset?.title ?? 'An error occurred';
  const description = descProp ?? preset?.description;

  return (
    <div
      className={[
        fullScreen ? 'min-h-screen' : 'min-h-[480px]',
        'flex flex-col items-center justify-center',
        'bg-white dark:bg-ink-900',
        'px-6 py-16 text-center',
        className,
      ].join(' ')}
    >
      <div className="flex flex-col items-center max-w-md w-full">
        {/* Icon */}
        {icon && (
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-200">
            {icon}
          </div>
        )}

        {/* Large in-flow code number — only shown when no icon */}
        {code && !icon && (
          <p
            aria-hidden="true"
            className="text-8xl sm:text-9xl font-black font-display leading-none tracking-tight text-primary-700 dark:text-primary-500 select-none mb-2"
          >
            {code}
          </p>
        )}

        {/* Status label */}
        {code && (
          <p className="text-xs font-semibold font-body uppercase tracking-[0.15em] text-primary-800 dark:text-primary-400 mb-3">
            Error&nbsp;{code}
          </p>
        )}

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black font-display leading-tight text-ink-900 dark:text-ink-50">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="mt-3 text-base font-body text-ink-500 dark:text-ink-300 leading-relaxed">
            {description}
          </p>
        )}

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {primaryAction && <ActionBtn action={primaryAction} variant="primary" />}
            {secondaryAction && <ActionBtn action={secondaryAction} variant="ghost" />}
          </div>
        )}
      </div>
    </div>
  );
}
