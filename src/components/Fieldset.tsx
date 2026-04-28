/**
 * Fieldset — semantic grouping for related form controls.
 *
 * Composition:
 *   <Fieldset>
 *     <Legend>Personal details</Legend>
 *     <FieldGroup>
 *       <Field>
 *         <Label>Full name</Label>
 *         <Input ... />
 *         <Description>As it appears on your passport</Description>
 *       </Field>
 *       <Field>
 *         <Label>Email</Label>
 *         <Input type="email" ... />
 *       </Field>
 *     </FieldGroup>
 *   </Fieldset>
 *
 * Setting `disabled` on <Fieldset> automatically greys out the legend,
 * labels and descriptions, and native form elements inside are disabled
 * via the HTML fieldset disabled attribute.
 */
import React from 'react';

// ── Context ───────────────────────────────────────────────

interface FieldsetCtx { disabled: boolean }
const FieldsetContext = React.createContext<FieldsetCtx>({ disabled: false });

interface FieldCtx { id: string }
const FieldContext = React.createContext<FieldCtx>({ id: '' });

/** Read the nearest Fieldset's disabled state. */
export function useFieldsetDisabled() {
  return React.useContext(FieldsetContext).disabled;
}

/** Read the nearest Field's generated id (for custom input wiring). */
export function useFieldId() {
  return React.useContext(FieldContext).id;
}

// ── Fieldset ──────────────────────────────────────────────

export interface FieldsetProps {
  /** Disables all native form controls inside and dims the UI. */
  disabled?:   boolean;
  /** Accessible label when no visible Legend is rendered. */
  'aria-label'?: string;
  className?:   string;
  children:     React.ReactNode;
}

/**
 * Top-level grouping wrapper.  Renders a `<fieldset>` so that
 * `disabled` propagates to all native form controls automatically.
 */
export function Fieldset({
  disabled = false,
  className = '',
  children,
  ...rest
}: FieldsetProps) {
  return (
    <FieldsetContext.Provider value={{ disabled }}>
      <fieldset
        disabled={disabled}
        className={[
          'min-w-0 border-none p-0 m-0',
          disabled ? 'opacity-50 pointer-events-none' : '',
          className,
        ].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </fieldset>
    </FieldsetContext.Provider>
  );
}

// ── Legend ────────────────────────────────────────────────

export interface LegendProps {
  className?: string;
  children:   React.ReactNode;
}

/**
 * Visible heading for a Fieldset group.
 * Rendered as a `<legend>` inside the `<fieldset>`.
 */
export function Legend({ className = '', children }: LegendProps) {
  return (
    <legend
      className={[
        'w-full text-base font-semibold font-display text-ink-900 dark:text-ink-50',
        className,
      ].join(' ')}
    >
      {children}
    </legend>
  );
}

// ── FieldGroup ────────────────────────────────────────────

export interface FieldGroupProps {
  /** Vertical spacing between fields. Default `'md'` (space-y-5). */
  gap?:       'sm' | 'md' | 'lg';
  className?: string;
  children:   React.ReactNode;
}

const gapCls: Record<NonNullable<FieldGroupProps['gap']>, string> = {
  sm: 'space-y-3',
  md: 'space-y-5',
  lg: 'space-y-8',
};

/**
 * Vertical stack of `<Field>` elements with consistent spacing.
 * Can be swapped for any layout div for grid/multi-column forms.
 */
export function FieldGroup({ gap = 'md', className = '', children }: FieldGroupProps) {
  return (
    <div className={[gapCls[gap], className].join(' ')}>
      {children}
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────

export interface FieldProps {
  /**
   * `'vertical'` — label above, control below (default).
   * `'horizontal'` — label left, control right (useful on wide screens).
   */
  layout?:    'vertical' | 'horizontal';
  className?: string;
  children:   React.ReactNode;
}

/**
 * Wrapper for a single label + control + description/error unit.
 * Generates a shared `id` that `<Label>` and the inner control can share.
 */
export function Field({ layout = 'vertical', className = '', children }: FieldProps) {
  const id = React.useId();
  return (
    <FieldContext.Provider value={{ id }}>
      <div
        className={[
          layout === 'horizontal'
            ? 'sm:grid sm:grid-cols-3 sm:gap-x-6 sm:items-start'
            : 'flex flex-col gap-1.5',
          className,
        ].join(' ')}
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
}

// ── Label ─────────────────────────────────────────────────

export interface LabelProps {
  /** Marks the field as required with a visual asterisk. */
  required?:  boolean;
  className?: string;
  children:   React.ReactNode;
}

/**
 * Styled `<label>` that automatically wires up to the nearest `<Field>`'s id.
 * Pass the same `id` to your input via the `id` prop if you need strict
 * `for`/`id` pairing — otherwise the visual association is still clear.
 */
export function Label({ required = false, className = '', children }: LabelProps) {
  const { id } = React.useContext(FieldContext);
  return (
    <label
      htmlFor={id || undefined}
      className={[
        'text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50',
        // horizontal: push label to top of its grid cell to align with first line of multi-line controls
        'sm:pt-2.5',
        className,
      ].join(' ')}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-red-600" aria-hidden="true">*</span>
      )}
    </label>
  );
}

// ── Description ───────────────────────────────────────────

export interface DescriptionProps {
  className?: string;
  children:   React.ReactNode;
}

/**
 * Helper / hint text rendered below a form control.
 */
export function Description({ className = '', children }: DescriptionProps) {
  return (
    <p
      className={[
        'text-xs font-body text-ink-500 dark:text-ink-300',
        className,
      ].join(' ')}
    >
      {children}
    </p>
  );
}

// ── ErrorMessage ──────────────────────────────────────────

export interface ErrorMessageProps {
  className?: string;
  children:   React.ReactNode;
}

/**
 * Inline error message rendered below a form control.
 * Uses `role="alert"` so screen readers announce it immediately.
 */
export function ErrorMessage({ className = '', children }: ErrorMessageProps) {
  return (
    <p
      role="alert"
      className={[
        'text-xs font-body text-red-600 dark:text-red-400',
        className,
      ].join(' ')}
    >
      {children}
    </p>
  );
}

// ── FieldDivider ──────────────────────────────────────────

export interface FieldDividerProps {
  className?: string;
}

/**
 * Optional thin separator between field groups or sections.
 */
export function FieldDivider({ className = '' }: FieldDividerProps) {
  return (
    <hr className={[
      'border-t border-ink-200 dark:border-ink-700',
      className,
    ].join(' ')} />
  );
}
