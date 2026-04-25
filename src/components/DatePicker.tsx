import React, { useState, useRef } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { CalendarDays, Clock, X } from 'lucide-react';
import { Calendar } from './Calendar';
import { Input } from './Input';
import { ButtonGroup } from './ButtonGroup';

// ── Helpers ────────────────────────────────────────────────

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatDateTime(d: Date, h: number, m: number): string {
  return `${formatDate(d)}, ${formatTime(h, m)}`;
}

const PANEL_CLS = [
  'absolute z-50 mt-1 bg-white dark:bg-ink-800',
  'border border-ink-200 dark:border-ink-700',
  'rounded-2xl shadow-md dark:shadow-dark-md p-3',
  'origin-top-left focus:outline-none',
].join(' ');

const TRANSITION = {
  enter:     'transition ease-out duration-150',
  enterFrom: 'opacity-0 scale-95 translate-y-1',
  enterTo:   'opacity-100 scale-100 translate-y-0',
  leave:     'transition ease-in duration-100',
  leaveFrom: 'opacity-100 scale-100',
  leaveTo:   'opacity-0 scale-95',
};

// ── Shared clear button ────────────────────────────────────

function ClearBtn({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Clear"
      className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors p-1 rounded-xl"
    >
      <X className="w-3.5 h-3.5" />
    </button>
  );
}

// ── Time scroll columns ────────────────────────────────────

function ScrollColumn({
  values,
  selected,
  onSelect,
}: {
  values:   number[];
  selected: number;
  onSelect: (v: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Centre the selected item in the scroll container when it changes
  React.useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('[data-selected="true"]');
    el?.scrollIntoView({ block: 'center', behavior: 'auto' });
  }, [selected]);

  return (
    <div ref={ref} className="h-40 overflow-y-auto scrollbar-none flex flex-col gap-0.5 snap-y snap-mandatory pr-1">
      {/* top spacer so first items can scroll to centre */}
      <div className="shrink-0 h-16" aria-hidden="true" />
      {values.map(v => (
        <button
          key={v}
          type="button"
          data-selected={v === selected}
          onClick={() => onSelect(v)}
          className={[
            'shrink-0 w-10 h-8 rounded-xl text-sm font-body font-medium text-center snap-start transition-colors',
            v === selected
              ? 'bg-primary-400 text-ink-900 font-semibold'
              : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-700',
          ].join(' ')}
        >
          {String(v).padStart(2, '0')}
        </button>
      ))}
      {/* bottom spacer so last items can scroll to centre */}
      <div className="shrink-0 h-16" aria-hidden="true" />
    </div>
  );
}

const HOURS   = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

// ── DatePicker ─────────────────────────────────────────────

export interface DatePickerProps {
  value?:         Date | null;
  onChange?:      (d: Date | null) => void;
  label?:         string;
  placeholder?:   string;
  hint?:          string;
  error?:         string;
  disabled?:      boolean;
  name?:          string;
  wrapClassName?: string;
  className?:     string;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  hint,
  error,
  disabled,
  name,
  wrapClassName = '',
  className     = '',
}: DatePickerProps) {
  const [internal, setInternal] = useState<Date | null>(null);
  const isControlled = value !== undefined;
  const selected     = isControlled ? value : internal;

  function pick(d: Date, close: () => void) {
    if (!isControlled) setInternal(d);
    onChange?.(d);
    close();
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isControlled) setInternal(null);
    onChange?.(null);
  }

  const displayValue = selected ? formatDate(selected) : '';

  return (
    <Popover className={`relative flex flex-col gap-1.5 ${wrapClassName}`}>
      {({ close }) => (
        <>
          <Popover.Button as="div" className="focus:outline-none">
            <Input
              readOnly
              label={label}
              placeholder={placeholder}
              hint={hint}
              error={error}
              disabled={disabled}
              value={displayValue}
              icon={<CalendarDays className="w-4 h-4" />}
              rightAction={selected ? <ClearBtn onClick={clear} /> : undefined}
              className={`cursor-pointer ${className}`}
            />
          </Popover.Button>

          {name && <input type="hidden" name={name} value={selected ? selected.toISOString().split('T')[0] : ''} />}

          <Transition as={React.Fragment} {...TRANSITION}>
            <Popover.Panel className={PANEL_CLS}>
              <Calendar
                variant="mini"
                selected={selected ?? null}
                onSelect={(d) => pick(d, close)}
              />
              <div className="mt-2 flex justify-between px-1">
                <button
                  type="button"
                  onClick={() => { if (!isControlled) setInternal(null); onChange?.(null); close(); }}
                  className="text-xs font-body font-medium text-primary-600 dark:text-primary-400 hover:underline transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => pick(new Date(), close)}
                  className="text-xs font-body font-medium text-primary-600 dark:text-primary-400 hover:underline transition-colors"
                >
                  Today
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

// ── TimePicker ─────────────────────────────────────────────

export interface TimePickerProps {
  value?:         string;  // HH:mm
  onChange?:      (v: string | null) => void;
  label?:         string;
  placeholder?:   string;
  hint?:          string;
  error?:         string;
  disabled?:      boolean;
  name?:          string;
  wrapClassName?: string;
  className?:     string;
}

export function TimePicker({
  value,
  onChange,
  label,
  placeholder = 'Select time',
  hint,
  error,
  disabled,
  name,
  wrapClassName = '',
  className     = '',
}: TimePickerProps) {
  const parseTime = (v?: string) => {
    if (!v) return { h: 12, m: 0, set: false };
    const [h, m] = v.split(':').map(Number);
    return { h, m, set: true };
  };

  const isControlled = value !== undefined;
  const [internalH, setInternalH] = useState(12);
  const [internalM, setInternalM] = useState(0);
  const [internalSet, setInternalSet] = useState(false);

  const { h, m, set: hasValue } = isControlled
    ? parseTime(value)
    : { h: internalH, m: internalM, set: internalSet };

  function commit(newH: number, newM: number) {
    if (!isControlled) { setInternalH(newH); setInternalM(newM); setInternalSet(true); }
    onChange?.(formatTime(newH, newM));
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isControlled) { setInternalSet(false); }
    onChange?.(null);
  }

  const displayValue = hasValue ? formatTime(h, m) : '';

  return (
    <Popover className={`relative flex flex-col gap-1.5 ${wrapClassName}`}>
      {() => (
        <>
          <Popover.Button as="div" className="focus:outline-none">
            <Input
              readOnly
              label={label}
              placeholder={placeholder}
              hint={hint}
              error={error}
              disabled={disabled}
              value={displayValue}
              icon={<Clock className="w-4 h-4" />}
              rightAction={hasValue ? <ClearBtn onClick={clear} /> : undefined}
              className={`cursor-pointer ${className}`}
            />
          </Popover.Button>

          {name && <input type="hidden" name={name} value={displayValue} />}

          <Transition as={React.Fragment} {...TRANSITION}>
            <Popover.Panel className={`${PANEL_CLS} w-36 min-w-[9rem]`}>
              <div className="flex items-start gap-2 justify-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-body font-semibold text-ink-400 uppercase tracking-wider">HH</span>
                  <ScrollColumn values={HOURS}   selected={h} onSelect={(v) => commit(v, m)} />
                </div>
                <span className="mt-[30px] text-sm font-body font-semibold text-ink-400">:</span>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-body font-semibold text-ink-400 uppercase tracking-wider">MM</span>
                  <ScrollColumn values={MINUTES} selected={m} onSelect={(v) => commit(h, v)} />
                </div>
              </div>
              <div className="mt-2 flex justify-center">
                <button
                  type="button"
                  onClick={(e) => clear(e)}
                  className="text-xs font-body font-medium text-primary-600 dark:text-primary-400 hover:underline transition-colors"
                >
                  Clear
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

// ── DateTimePicker ─────────────────────────────────────────

export interface DateTimePickerProps {
  value?:         { date: Date; hour: number; minute: number } | null;
  onChange?:      (v: { date: Date; hour: number; minute: number } | null) => void;
  label?:         string;
  placeholder?:   string;
  hint?:          string;
  error?:         string;
  disabled?:      boolean;
  name?:          string;
  wrapClassName?: string;
  className?:     string;
}

export function DateTimePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date & time',
  hint,
  error,
  disabled,
  name,
  wrapClassName = '',
  className     = '',
}: DateTimePickerProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<{ date: Date; hour: number; minute: number } | null>(null);
  const [tab, setTab] = useState<'date' | 'time'>('date');

  const current = isControlled ? value : internal;

  function update(patch: Partial<{ date: Date; hour: number; minute: number }>) {
    const next = current
      ? { ...current, ...patch }
      : { date: patch.date ?? new Date(), hour: patch.hour ?? 0, minute: patch.minute ?? 0 };
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isControlled) setInternal(null);
    onChange?.(null);
  }

  const displayValue = current
    ? formatDateTime(current.date, current.hour, current.minute)
    : '';

  const isoValue = current
    ? `${current.date.toISOString().split('T')[0]}T${formatTime(current.hour, current.minute)}`
    : '';

  return (
    <Popover className={`relative flex flex-col gap-1.5 ${wrapClassName}`}>
      {({ close }) => (
        <>
          <Popover.Button as="div" className="focus:outline-none">
            <Input
              readOnly
              label={label}
              placeholder={placeholder}
              hint={hint}
              error={error}
              disabled={disabled}
              value={displayValue}
              icon={<CalendarDays className="w-4 h-4" />}
              rightAction={current ? <ClearBtn onClick={clear} /> : undefined}
              className={`cursor-pointer ${className}`}
            />
          </Popover.Button>

          {name && <input type="hidden" name={name} value={isoValue} />}

          <Transition as={React.Fragment} {...TRANSITION}>
            {/*
              Fixed width = w-64 calendar + p-3 panel padding on each side.
              The content area is given the same min-height as the calendar so
              switching to the Time tab doesn't shrink the panel.
            */}
            <Popover.Panel className={`${PANEL_CLS} w-[280px]`}>
              {/* Tab switcher */}
              <ButtonGroup
                fullWidth="always"
                size="sm"
                value={tab}
                onChange={(v) => setTab(v as 'date' | 'time')}
                items={[
                  { label: 'Date', value: 'date', icon: <CalendarDays className="w-3.5 h-3.5" /> },
                  { label: 'Time', value: 'time', icon: <Clock        className="w-3.5 h-3.5" /> },
                ]}
              />

              {/*
                Fixed-height content area — tall enough to hold the calendar.
                Both tabs live inside so the panel never resizes between tabs.
              */}
              <div className="mt-3 min-h-[272px] flex flex-col">
                {/* Date panel */}
                {tab === 'date' && (
                  <Calendar
                    variant="mini"
                    selected={current?.date ?? null}
                    onSelect={(d) => { update({ date: d }); setTab('time'); }}
                  />
                )}

                {/* Time panel — centred vertically in the same space */}
                {tab === 'time' && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-body font-semibold text-ink-400 uppercase tracking-wider">HH</span>
                        <ScrollColumn
                          values={HOURS}
                          selected={current?.hour ?? 12}
                          onSelect={(v) => update({ hour: v })}
                        />
                      </div>
                      <span className="mt-[30px] text-sm font-body font-semibold text-ink-400">:</span>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-body font-semibold text-ink-400 uppercase tracking-wider">MM</span>
                        <ScrollColumn
                          values={MINUTES}
                          selected={current?.minute ?? 0}
                          onSelect={(v) => update({ minute: v })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="mt-3 flex justify-between px-1">
                <button
                  type="button"
                  onClick={() => { if (!isControlled) setInternal(null); onChange?.(null); close(); }}
                  className="text-xs font-body font-medium text-primary-600 dark:text-primary-400 hover:underline transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => { const now = new Date(); update({ date: now, hour: now.getHours(), minute: now.getMinutes() }); }}
                  className="text-xs font-body font-medium text-primary-600 dark:text-primary-400 hover:underline transition-colors"
                >
                  Now
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
