import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export type CalendarEventColor = 'primary' | 'slate' | 'green' | 'red' | 'amber';
export type CalendarVariant = 'month' | 'mini';

export interface CalendarEvent {
  id: string | number;
  /** ISO date string: 'YYYY-MM-DD' */
  date: string;
  title: string;
  color?: CalendarEventColor;
  href?: string;
  onClick?: () => void;
}

export interface CalendarProps {
  /** Uncontrolled initial month (defaults to current month) */
  defaultMonth?: Date;
  /** Controlled selected date (single-select mode) */
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  events?: CalendarEvent[];
  /** 'month' = full grid with events, 'mini' = compact picker */
  variant?: CalendarVariant;
  /** Mini only: draw borders between every cell. Default: false */
  bordered?: boolean;
  /** Shade Saturday and Sunday columns slightly darker. Default: false */
  shadeWeekends?: boolean;
  // ── Range props (mini only) ──────────────────────────────
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  /** Date the cursor is currently hovering — drives the live preview strip */
  rangeHover?: Date | null;
  onRangeHover?: (date: Date | null) => void;
  className?: string;
}

// ── Utilities ─────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Returns the 42-cell grid (6 weeks × 7 days) for a given month */
function buildGrid(year: number, month: number): { date: Date; current: boolean }[] {
  const first = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { date: Date; current: boolean }[] = [];

  for (let i = first - 1; i >= 0; i--)
    cells.push({ date: new Date(year, month - 1, daysInPrev - i), current: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ date: new Date(year, month, d), current: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++)
    cells.push({ date: new Date(year, month + 1, d), current: false });
  return cells;
}

// ── Event colour map ──────────────────────────────────────

const eventColours: Record<CalendarEventColor, { bg: string; text: string; dot: string }> = {
  primary: {
    bg: 'bg-primary-100 dark:bg-primary-900/40',
    text: 'text-primary-800 dark:text-primary-200',
    dot: 'bg-primary-500',
  },
  slate: {
    bg: 'bg-slate-100   dark:bg-slate-900/40',
    text: 'text-slate-800   dark:text-slate-200',
    dot: 'bg-slate-500',
  },
  green: {
    bg: 'bg-green-100   dark:bg-green-900/40',
    text: 'text-green-800   dark:text-green-200',
    dot: 'bg-green-500',
  },
  red: {
    bg: 'bg-red-100     dark:bg-red-900/40',
    text: 'text-red-800     dark:text-red-200',
    dot: 'bg-red-500',
  },
  amber: {
    bg: 'bg-amber-100   dark:bg-amber-900/40',
    text: 'text-amber-800   dark:text-amber-200',
    dot: 'bg-amber-500',
  },
};

// ── Sub-components ────────────────────────────────────────

function NavButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex items-center justify-center w-8 h-8 rounded-xl text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors"
    >
      {children}
    </button>
  );
}

// ── Month variant ─────────────────────────────────────────

function MonthCell({
  date,
  current,
  today,
  selected,
  events,
  shadeWeekends,
  onSelect,
}: {
  date: Date;
  current: boolean;
  today: boolean;
  selected: boolean;
  events: CalendarEvent[];
  shadeWeekends: boolean;
  onSelect: (d: Date) => void;
}) {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const MAX_VISIBLE = 3;
  const overflow = events.length - MAX_VISIBLE;

  return (
    <div
      className={[
        'relative flex flex-col min-h-28 p-2 border-b border-r border-ink-100 dark:border-ink-700',
        !current
          ? 'bg-ink-50/50 dark:bg-ink-900/30'
          : shadeWeekends && isWeekend
            ? 'bg-ink-100/60 dark:bg-ink-900/40'
            : '',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => onSelect(date)}
        aria-label={date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        aria-pressed={selected}
        className={[
          'self-start mb-1 w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium font-body transition-colors',
          selected
            ? 'bg-primary-500 text-ink-900 font-bold'
            : today
              ? 'ring-2 ring-primary-500 text-ink-900 dark:text-ink-50 font-bold hover:bg-ink-100 dark:hover:bg-ink-700'
              : current
                ? 'text-ink-900 dark:text-ink-50 hover:bg-ink-100 dark:hover:bg-ink-700'
                : 'text-ink-500 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-700',
        ].join(' ')}
      >
        {date.getDate()}
      </button>

      <div className="flex flex-col gap-0.5">
        {events.slice(0, MAX_VISIBLE).map((ev) => {
          const c = eventColours[ev.color ?? 'slate'];
          const inner = (
            <span
              className={`block truncate text-xs font-medium font-body px-1.5 py-0.5 rounded ${c.bg} ${c.text}`}
            >
              {ev.title}
            </span>
          );
          return ev.href ? (
            <a key={ev.id} href={ev.href}>
              {inner}
            </a>
          ) : (
            <button
              key={ev.id}
              type="button"
              aria-label={ev.title}
              onClick={ev.onClick}
              className="text-left w-full"
            >
              {inner}
            </button>
          );
        })}
        {overflow > 0 && (
          <span className="text-xs font-body text-ink-500 dark:text-ink-300 px-1.5">
            +{overflow} more
          </span>
        )}
      </div>
    </div>
  );
}

// ── Mini variant ──────────────────────────────────────────

function MiniCell({
  date,
  current,
  today,
  selected,
  hasEvents,
  bordered,
  shadeWeekends,
  onSelect,
  isRangeStart,
  isRangeEnd,
  inRange,
  onMouseEnter,
}: {
  date: Date;
  current: boolean;
  today: boolean;
  selected: boolean;
  hasEvents: boolean;
  bordered: boolean;
  shadeWeekends: boolean;
  onSelect: (d: Date) => void;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  inRange?: boolean;
  onMouseEnter?: () => void;
}) {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isEndpoint = isRangeStart || isRangeEnd;

  // Strip background behind the circle (connects start → end)
  const stripCls = (() => {
    const bg = 'bg-primary-100 dark:bg-primary-900/40';
    if (isRangeStart && isRangeEnd) return ''; // single-day range — no strip
    if (isRangeStart) return `${bg} rounded-l-full ml-1`;
    if (isRangeEnd) return `${bg} rounded-r-full mr-1`;
    if (inRange) return bg;
    return '';
  })();

  return (
    <div
      className={[
        'relative flex flex-col items-center gap-0.5',
        bordered ? 'border-r border-b border-ink-100 dark:border-ink-700 py-1' : '',
        shadeWeekends && isWeekend && !inRange && !isEndpoint
          ? 'bg-ink-100/60 dark:bg-ink-900/40 rounded'
          : '',
      ].join(' ')}
      onMouseEnter={onMouseEnter}
    >
      {/* Range strip */}
      {stripCls && (
        <div className={`absolute inset-x-0 top-0 h-8 ${stripCls}`} aria-hidden="true" />
      )}

      <button
        type="button"
        onClick={() => onSelect(date)}
        aria-label={date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        aria-pressed={selected || isEndpoint}
        className={[
          'relative w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium font-body transition-colors z-10',
          isEndpoint
            ? 'bg-primary-500 text-ink-900 font-bold'
            : inRange
              ? 'text-ink-900 dark:text-ink-50 hover:bg-primary-200 dark:hover:bg-primary-800/50'
              : selected
                ? 'bg-primary-500 text-ink-900 font-bold'
                : today
                  ? 'ring-2 ring-primary-500 text-ink-900 dark:text-ink-50 font-bold hover:bg-ink-100 dark:hover:bg-ink-700'
                  : current
                    ? 'text-ink-900 dark:text-ink-50 hover:bg-ink-100 dark:hover:bg-ink-700'
                    : 'text-ink-500 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-700',
        ].join(' ')}
      >
        {date.getDate()}
      </button>

      <div className={`w-1 h-1 rounded-full ${hasEvents ? 'bg-primary-500' : 'bg-transparent'}`} />
    </div>
  );
}

// ── Calendar ──────────────────────────────────────────────

export function Calendar({
  defaultMonth,
  selected,
  onSelect,
  events = [],
  variant = 'month',
  bordered = false,
  shadeWeekends = false,
  rangeStart,
  rangeEnd,
  rangeHover,
  onRangeHover,
  className = '',
}: CalendarProps) {
  const today = new Date();

  const [viewDate, setViewDate] = useState<Date>(() => {
    // Default to the month of rangeStart or selected if provided
    const anchor = rangeStart ?? selected ?? defaultMonth ?? new Date();
    return new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = buildGrid(year, month);

  const eventMap = React.useMemo(() => {
    const m: Record<string, CalendarEvent[]> = {};
    for (const ev of events) {
      if (!m[ev.date]) m[ev.date] = [];
      m[ev.date].push(ev);
    }
    return m;
  }, [events]);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));

  // ── Range helpers ──────────────────────────────────────────
  // Compute effective lo/hi — use hover date as provisional end when end not set
  const rangeInfo = React.useMemo(() => {
    const start = rangeStart ? stripTime(rangeStart) : null;
    const end = rangeEnd ? stripTime(rangeEnd) : rangeHover ? stripTime(rangeHover) : null;
    if (!start || !end) return { lo: start, hi: null };
    return start <= end ? { lo: start, hi: end } : { lo: end, hi: start };
  }, [rangeStart, rangeEnd, rangeHover]);

  const isInRange = (d: Date) => {
    const { lo, hi } = rangeInfo;
    if (!lo || !hi) return false;
    const t = stripTime(d);
    return t > lo && t < hi;
  };

  const isRangeEdge = (d: Date, edge: 'start' | 'end') => {
    const ref = edge === 'start' ? rangeInfo.lo : rangeInfo.hi;
    return !!ref && isSameDay(d, ref);
  };

  const handleSelect = (date: Date) => onSelect?.(date);

  // ── Mini ────────────────────────────────────────────────
  if (variant === 'mini') {
    const borderWrap = bordered
      ? 'border border-ink-200 dark:border-ink-700 rounded-2xl overflow-hidden p-3'
      : '';
    const isRangeMode = rangeStart !== undefined || rangeEnd !== undefined;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [view, setView] = useState<'days' | 'monthYear'>('days');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [pickerYear, setPickerYear] = useState(year);

    const openMonthYear = () => {
      setPickerYear(year);
      setView('monthYear');
    };
    const pickMonth = (m: number) => {
      setViewDate(new Date(pickerYear, m, 1));
      setView('days');
    };

    return (
      <div
        className={['w-64 select-none', borderWrap, className].filter(Boolean).join(' ')}
        onMouseLeave={isRangeMode ? () => onRangeHover?.(null) : undefined}
      >
        {/* ── Month/year quick-picker ── */}
        {view === 'monthYear' ? (
          <>
            {/* Year navigation header */}
            <div className="flex items-center justify-between mb-3">
              <NavButton onClick={() => setPickerYear((y) => y - 1)} label="Previous year">
                <ChevronLeft className="w-4 h-4" />
              </NavButton>
              <button
                type="button"
                onClick={() => setView('days')}
                className="text-sm font-semibold font-display text-ink-900 dark:text-ink-50 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
              >
                {pickerYear}
                <ChevronDown className="w-3 h-3 rotate-180" aria-hidden="true" />
              </button>
              <NavButton onClick={() => setPickerYear((y) => y + 1)} label="Next year">
                <ChevronRight className="w-4 h-4" />
              </NavButton>
            </div>

            {/* 3×4 month grid */}
            <div className="grid grid-cols-3 gap-1">
              {MONTHS.map((name, idx) => {
                const isActive = pickerYear === year && idx === month;
                const isTodayMonth = pickerYear === today.getFullYear() && idx === today.getMonth();
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => pickMonth(idx)}
                    className={[
                      'py-2 rounded-xl text-sm font-body font-medium transition-colors',
                      isActive
                        ? 'bg-primary-500 text-ink-900 font-bold'
                        : isTodayMonth
                          ? 'ring-2 ring-primary-500 text-ink-900 dark:text-ink-50'
                          : 'text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-700',
                    ].join(' ')}
                  >
                    {name.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* ── Day calendar header ── */}
            <div className="flex items-center justify-between mb-3">
              <NavButton onClick={prevMonth} label="Previous month">
                <ChevronLeft className="w-4 h-4" />
              </NavButton>
              <button
                type="button"
                onClick={openMonthYear}
                className="text-sm font-semibold font-display text-ink-900 dark:text-ink-50 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                aria-label={`${MONTHS[month]} ${year} — click to change month or year`}
              >
                {MONTHS[month]} {year}
                <ChevronDown
                  className="w-3 h-3 text-ink-400 dark:text-ink-300"
                  aria-hidden="true"
                />
              </button>
              <NavButton onClick={nextMonth} label="Next month">
                <ChevronRight className="w-4 h-4" />
              </NavButton>
            </div>

            {/* Day headers */}
            <div
              className={[
                'grid grid-cols-7',
                bordered ? 'border-t border-l border-ink-100 dark:border-ink-700' : 'gap-y-1 mb-1',
              ].join(' ')}
            >
              {DAYS.map((d) => (
                <div
                  key={d}
                  className={[
                    'flex items-center justify-center py-1',
                    bordered ? 'border-r border-b border-ink-100 dark:border-ink-700' : '',
                  ].join(' ')}
                >
                  <span className="text-xs font-medium font-body text-ink-500 dark:text-ink-300 w-8 text-center">
                    {d[0]}
                  </span>
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div
              className={[
                'grid grid-cols-7',
                bordered ? 'border-l border-ink-100 dark:border-ink-700' : 'gap-y-1',
              ].join(' ')}
            >
              {cells.map(({ date, current }, i) => (
                <MiniCell
                  key={i}
                  date={date}
                  current={current}
                  today={isSameDay(date, today)}
                  selected={!!selected && isSameDay(date, selected)}
                  hasEvents={!!eventMap[toISO(date)]?.length}
                  bordered={bordered}
                  shadeWeekends={shadeWeekends}
                  onSelect={handleSelect}
                  isRangeStart={isRangeMode ? isRangeEdge(date, 'start') : undefined}
                  isRangeEnd={isRangeMode ? isRangeEdge(date, 'end') : undefined}
                  inRange={isRangeMode ? isInRange(date) : undefined}
                  onMouseEnter={isRangeMode ? () => onRangeHover?.(date) : undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Month ───────────────────────────────────────────────
  return (
    <div className={['flex flex-col select-none', className].filter(Boolean).join(' ')}>
      <div className="flex items-center justify-between px-1 mb-4">
        <h2 className="text-base font-bold font-display text-ink-900 dark:text-ink-50">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <NavButton onClick={prevMonth} label="Previous month">
            <ChevronLeft className="w-4 h-4" />
          </NavButton>
          <button
            type="button"
            onClick={goToday}
            className="px-3 h-8 text-xs font-medium font-body rounded-xl border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors"
          >
            Today
          </button>
          <NavButton onClick={nextMonth} label="Next month">
            <ChevronRight className="w-4 h-4" />
          </NavButton>
        </div>
      </div>

      <div className="grid grid-cols-7 border-t border-l border-ink-100 dark:border-ink-700">
        {DAYS.map((d) => (
          <div
            key={d}
            className="border-b border-r border-ink-100 dark:border-ink-700 py-2 text-center"
          >
            <span className="text-xs font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wide">
              {d}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-l border-ink-100 dark:border-ink-700">
        {cells.map(({ date, current }, i) => (
          <MonthCell
            key={i}
            date={date}
            current={current}
            today={isSameDay(date, today)}
            selected={!!selected && isSameDay(date, selected)}
            events={eventMap[toISO(date)] ?? []}
            shadeWeekends={shadeWeekends}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
