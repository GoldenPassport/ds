import React from 'react';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export type AlertVariant    = 'info' | 'success' | 'warning' | 'error';
export type AlertAppearance = 'tinted' | 'outline';

export interface AlertAction {
  label:   string;
  onClick: () => void;
}

export interface AlertProps {
  variant?:    AlertVariant;
  /** 'tinted' = coloured background (default); 'outline' = neutral bg + coloured left border */
  appearance?: AlertAppearance;
  title?:      string;
  children?:   React.ReactNode;
  onDismiss?:  () => void;
  actions?:    AlertAction[];
  /** Override the default icon. Pass null to hide the icon entirely. */
  icon?:       React.ReactNode | null;
  className?:  string;
}

// ── Variant config ────────────────────────────────────────

interface VariantConfig {
  tinted:       string;
  outline:      string;
  accentBorder: string;
  icon:         string;
  title:        string;
  body:         string;
  dismiss:      string;
  actionBtn:    string;
  DefaultIcon:  React.ElementType;
}

const variants: Record<AlertVariant, VariantConfig> = {
  info: {
    tinted:       'bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700',
    outline:      'bg-white border border-ink-200 border-l-4 border-l-slate-500 dark:bg-ink-800 dark:border-ink-600 dark:border-l-slate-400',
    accentBorder: 'border-l-slate-500 dark:border-l-slate-400',
    icon:         'text-slate-500 dark:text-slate-400',
    title:        'text-slate-800 dark:text-slate-100',
    body:         'text-slate-700 dark:text-slate-300',
    dismiss:      'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300',
    actionBtn:    'text-slate-700 font-semibold hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100',
    DefaultIcon:  Info,
  },
  success: {
    tinted:       'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800',
    outline:      'bg-white border border-ink-200 border-l-4 border-l-green-500 dark:bg-ink-800 dark:border-ink-600 dark:border-l-green-400',
    accentBorder: 'border-l-green-500 dark:border-l-green-400',
    icon:         'text-green-500 dark:text-green-400',
    title:        'text-green-800 dark:text-green-100',
    body:         'text-green-700 dark:text-green-300',
    dismiss:      'text-green-400 hover:text-green-600 dark:text-green-600 dark:hover:text-green-400',
    actionBtn:    'text-green-700 font-semibold hover:text-green-900 dark:text-green-300 dark:hover:text-green-100',
    DefaultIcon:  CheckCircle2,
  },
  warning: {
    tinted:       'bg-gold-50 border border-gold-200 dark:bg-gold-900/20 dark:border-gold-800',
    outline:      'bg-white border border-ink-200 border-l-4 border-l-gold-500 dark:bg-ink-800 dark:border-ink-600 dark:border-l-gold-400',
    accentBorder: 'border-l-gold-500 dark:border-l-gold-400',
    icon:         'text-gold-600 dark:text-gold-400',
    title:        'text-gold-900 dark:text-gold-100',
    body:         'text-gold-800 dark:text-gold-300',
    dismiss:      'text-gold-500 hover:text-gold-700 dark:text-gold-600 dark:hover:text-gold-400',
    actionBtn:    'text-gold-800 font-semibold hover:text-gold-900 dark:text-gold-300 dark:hover:text-gold-100',
    DefaultIcon:  AlertTriangle,
  },
  error: {
    tinted:       'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800',
    outline:      'bg-white border border-ink-200 border-l-4 border-l-red-500 dark:bg-ink-800 dark:border-ink-600 dark:border-l-red-400',
    accentBorder: 'border-l-red-500 dark:border-l-red-400',
    icon:         'text-red-500 dark:text-red-400',
    title:        'text-red-800 dark:text-red-100',
    body:         'text-red-700 dark:text-red-300',
    dismiss:      'text-red-400 hover:text-red-600 dark:text-red-600 dark:hover:text-red-400',
    actionBtn:    'text-red-700 font-semibold hover:text-red-900 dark:text-red-300 dark:hover:text-red-100',
    DefaultIcon:  XCircle,
  },
};

// ── Component ─────────────────────────────────────────────

export function Alert({
  variant    = 'info',
  appearance = 'tinted',
  title,
  children,
  onDismiss,
  actions,
  icon,
  className  = '',
}: AlertProps) {
  const cfg = variants[variant];
  const { DefaultIcon } = cfg;

  const wrapperClass = appearance === 'outline' ? cfg.outline : cfg.tinted;

  const resolvedIcon =
    icon === null ? null : icon ?? <DefaultIcon className="w-5 h-5 shrink-0" aria-hidden />;

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={[
        'rounded-lg p-4',
        wrapperClass,
        className,
      ].join(' ')}
    >
      <div className="flex gap-3">
        {/* Icon */}
        {resolvedIcon && (
          <span className={['mt-0.5', cfg.icon].join(' ')}>
            {resolvedIcon}
          </span>
        )}

        {/* Body */}
        <div className="flex-1 min-w-0">
          {title && (
            <p className={['text-sm font-semibold font-body mb-1', cfg.title].join(' ')}>
              {title}
            </p>
          )}
          {children && (
            <div className={['text-sm font-body leading-relaxed', cfg.body].join(' ')}>
              {children}
            </div>
          )}
          {actions && actions.length > 0 && (
            <div className="mt-3 flex gap-4">
              {actions.map((action, i) => (
                <button
                  key={i}
                  onClick={action.onClick}
                  className={[
                    'text-sm font-body transition-colors duration-150',
                    cfg.actionBtn,
                  ].join(' ')}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dismiss */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss"
            className={[
              'shrink-0 mt-0.5 rounded transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40',
              cfg.dismiss,
            ].join(' ')}
          >
            <X className="w-4 h-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
