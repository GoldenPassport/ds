/**
 * Toggle — wraps Headless UI Switch
 * Provides accessible on/off toggle with GP gold styling.
 *
 * Usage:
 *   <Toggle checked={enabled} onChange={setEnabled} label="Email notifications" />
 */
import { Switch } from '@headlessui/react';

export interface ToggleProps {
  checked:   boolean;
  onChange:  (checked: boolean) => void;
  label?:    string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
}: ToggleProps) {
  return (
    <Switch.Group as="div" className={`flex items-center justify-between gap-4 ${className}`}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <Switch.Label className="text-sm font-medium font-body text-ink-900 dark:text-ink-50 cursor-pointer">
              {label}
            </Switch.Label>
          )}
          {description && (
            <Switch.Description className="text-xs text-ink-500 dark:text-ink-300 font-body mt-0.5">
              {description}
            </Switch.Description>
          )}
        </div>
      )}

      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={[
          'relative inline-flex h-[22px] w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 focus-visible:ring-offset-2',
          'dark:focus-visible:ring-offset-ink-900',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          checked
            ? 'bg-primary-500'
            : 'bg-ink-200 dark:bg-ink-600',
        ].join(' ')}
      >
        <span className="sr-only">{label ?? 'Toggle'}</span>
        <span
          aria-hidden="true"
          className={[
            'pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow',
            'transform transition-transform duration-200 ease-in-out',
            checked ? 'translate-x-[18px]' : 'translate-x-0',
          ].join(' ')}
        />
      </Switch>
    </Switch.Group>
  );
}
