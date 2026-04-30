import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Calendar } from '../components/Calendar';
import type { CalendarEvent } from '../components/Calendar';

const meta = {
  title: 'Data Display/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: { type: 'select', options: ['month', 'mini'] } },
    events: { control: false },
    selected: { control: false },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared fixtures ───────────────────────────────────────

function thisMonth(day: number) {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const EVENTS: CalendarEvent[] = [
  { id: 1, date: thisMonth(3), title: 'Design review', color: 'slate' },
  { id: 2, date: thisMonth(5), title: 'Sprint planning', color: 'primary' },
  { id: 3, date: thisMonth(5), title: 'Lunch with team', color: 'green' },
  { id: 4, date: thisMonth(8), title: 'Investor call', color: 'red' },
  { id: 5, date: thisMonth(10), title: 'Product demo', color: 'primary' },
  { id: 6, date: thisMonth(12), title: 'Board meeting', color: 'amber' },
  { id: 7, date: thisMonth(12), title: 'Quarterly review', color: 'slate' },
  { id: 8, date: thisMonth(12), title: 'Team retrospective', color: 'green' },
  { id: 9, date: thisMonth(12), title: 'Engineering sync', color: 'primary' },
  { id: 10, date: thisMonth(15), title: 'User interviews', color: 'green' },
  { id: 11, date: thisMonth(18), title: 'Release v2.4', color: 'red' },
  { id: 12, date: thisMonth(20), title: 'Onboarding: Alex', color: 'slate' },
  { id: 13, date: thisMonth(22), title: 'Pricing strategy', color: 'amber' },
  { id: 14, date: thisMonth(25), title: 'API launch', color: 'primary' },
  { id: 15, date: thisMonth(28), title: 'Sprint demo', color: 'slate' },
];

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'month',
    events: EVENTS,
  },
};

// ── Month view ────────────────────────────────────────────

function MonthDemo() {
  const [selected, setSelected] = useState<Date | null>(null);
  return (
    <div className="max-w-4xl">
      <Calendar variant="month" events={EVENTS} selected={selected} onSelect={setSelected} />
      {selected && (
        <p className="mt-3 text-sm font-body text-ink-500 dark:text-ink-300">
          Selected:{' '}
          <span className="font-semibold text-ink-900 dark:text-ink-50">
            {selected.toDateString()}
          </span>
        </p>
      )}
    </div>
  );
}

export const MonthView: Story = {
  name: 'Month view',
  args: { events: [] },
  render: () => <MonthDemo />,
};

// ── Month view — no events ────────────────────────────────

export const MonthNoEvents: Story = {
  name: 'Month view — no events',
  args: { events: [] },
  render: () => (
    <div className="max-w-4xl">
      <Calendar variant="month" />
    </div>
  ),
};

// ── Mini ──────────────────────────────────────────────────

function MiniDemo() {
  const [selected, setSelected] = useState<Date | null>(new Date());
  return (
    <div className="flex flex-col gap-3 items-start">
      <Calendar variant="mini" events={EVENTS} selected={selected} onSelect={setSelected} />
      {selected && (
        <p className="text-sm font-body text-ink-500 dark:text-ink-300">
          Selected:{' '}
          <span className="font-semibold text-ink-900 dark:text-ink-50">
            {selected.toDateString()}
          </span>
        </p>
      )}
    </div>
  );
}

export const Mini: Story = {
  name: 'Mini — compact picker',
  args: { events: [] },
  render: () => <MiniDemo />,
};

// ── Mini bordered ─────────────────────────────────────────

function MiniBorderedDemo() {
  const [selected, setSelected] = useState<Date | null>(new Date());
  return (
    <div className="flex gap-8 items-start flex-wrap">
      <div className="flex flex-col gap-2 items-start">
        <p className="text-xs font-body text-ink-400 dark:text-ink-300">bordered=false (default)</p>
        <Calendar variant="mini" events={EVENTS} selected={selected} onSelect={setSelected} />
      </div>
      <div className="flex flex-col gap-2 items-start">
        <p className="text-xs font-body text-ink-400 dark:text-ink-300">bordered=true</p>
        <Calendar
          variant="mini"
          bordered
          events={EVENTS}
          selected={selected}
          onSelect={setSelected}
        />
      </div>
    </div>
  );
}

export const MiniBordered: Story = {
  name: 'Mini — bordered grid',
  args: { events: [] },
  render: () => <MiniBorderedDemo />,
};

// ── Shade weekends ────────────────────────────────────────

export const ShadeWeekends: Story = {
  name: 'Shade weekends',
  args: { events: [] },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-body text-ink-400 dark:text-ink-300 mb-3">
          Month — shadeWeekends
        </p>
        <div className="max-w-4xl">
          <Calendar variant="month" events={EVENTS} shadeWeekends />
        </div>
      </div>
      <div className="flex gap-8 flex-wrap">
        <div>
          <p className="text-xs font-body text-ink-400 dark:text-ink-300 mb-3">
            Mini — shadeWeekends
          </p>
          <Calendar variant="mini" events={EVENTS} shadeWeekends />
        </div>
        <div>
          <p className="text-xs font-body text-ink-400 dark:text-ink-300 mb-3">
            Mini — bordered + shadeWeekends
          </p>
          <Calendar variant="mini" bordered events={EVENTS} shadeWeekends />
        </div>
      </div>
    </div>
  ),
};

// ── Event colours ─────────────────────────────────────────

export const EventColors: Story = {
  name: 'Event colour variants',
  args: { events: [] },
  render: () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const colored: CalendarEvent[] = [
      { id: 1, date: `${y}-${m}-04`, title: 'Primary event', color: 'primary' },
      { id: 2, date: `${y}-${m}-04`, title: 'Slate event', color: 'slate' },
      { id: 3, date: `${y}-${m}-11`, title: 'Green event', color: 'green' },
      { id: 4, date: `${y}-${m}-11`, title: 'Red event', color: 'red' },
      { id: 5, date: `${y}-${m}-18`, title: 'Amber event', color: 'amber' },
    ];
    return (
      <div className="max-w-4xl">
        <Calendar variant="month" events={colored} />
      </div>
    );
  },
};

// ── In context — with side panel ──────────────────────────

function WithSidePanelDemo() {
  const [selected, setSelected] = useState<Date | null>(new Date());

  const selectedISO = selected
    ? `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}`
    : null;

  const dayEvents = EVENTS.filter((e) => e.date === selectedISO);

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900 py-8">
      <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Mini calendar sidebar */}
          <div className="hidden lg:flex flex-col gap-6">
            <div className="rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-sm p-4">
              <Calendar variant="mini" events={EVENTS} selected={selected} onSelect={setSelected} />
            </div>

            {/* Event list for selected day */}
            <div className="rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-sm p-4">
              <p className="text-xs font-semibold font-body uppercase tracking-wider text-ink-400 dark:text-ink-300 mb-3">
                {selected
                  ? selected.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Select a day'}
              </p>
              {dayEvents.length === 0 ? (
                <p className="text-sm font-body text-ink-400 dark:text-ink-300">No events</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {dayEvents.map((ev) => {
                    const colours = {
                      primary: 'bg-primary-500',
                      slate: 'bg-slate-500',
                      green: 'bg-green-500',
                      red: 'bg-red-500',
                      amber: 'bg-amber-500',
                    };
                    return (
                      <div key={ev.id} className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${colours[ev.color ?? 'slate']}`}
                        />
                        <p className="text-sm font-body text-ink-700 dark:text-ink-200">
                          {ev.title}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Full month calendar */}
          <div className="flex-1 rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-sm p-6">
            <Calendar variant="month" events={EVENTS} selected={selected} onSelect={setSelected} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const WithSidePanel: Story = {
  name: 'In context — with side panel',
  args: { events: [] },
  render: () => <WithSidePanelDemo />,
};

// ── Interactions ──────────────────────────────────────────

export const Interactions: Story = {
  name: 'Interactions — date selection & month navigation',
  args: { events: [] },
  render: () => {
    const [selected, setSelected] = useState<Date | null>(null);
    return (
      <div className="max-w-3xl flex flex-col gap-3">
        {/* No events — keeps day-cell buttons clean (text = day number only) */}
        <Calendar variant="month" selected={selected} onSelect={setSelected} />
        {selected && (
          <p
            className="text-xs font-body text-ink-500 dark:text-ink-300"
            data-testid="cal-selected"
          >
            Selected: {selected.toDateString()}
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('navigation buttons are present', async () => {
      await canvas.findByRole('button', { name: /next month/i });
      expect(canvas.getByRole('button', { name: /^today$/i })).toBeInTheDocument();
    });

    await step('click a day — onSelect fires and selection is shown', async () => {
      // Day-cell buttons in the month variant have aria-labels like
      // "Thursday, April 10, 2025" (weekday prefix). Pick the first one.
      const allBtns = canvas.getAllByRole('button');
      const dayBtn = allBtns.find((b: HTMLElement) =>
        /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),/.test(
          b.getAttribute('aria-label') ?? '',
        ),
      ) as HTMLElement;
      await user.click(dayBtn);
      await waitFor(() => {
        expect(canvas.getByTestId('cal-selected')).toBeInTheDocument();
      });
    });

    await step('click "Next month" — heading advances by one month', async () => {
      const headingBefore = canvas.getByRole('heading').textContent ?? '';
      await user.click(canvas.getByRole('button', { name: /next month/i }));
      await waitFor(() => {
        expect(canvas.getByRole('heading').textContent).not.toBe(headingBefore);
      });
    });

    await step('click "Previous month" — heading reverts to previous month', async () => {
      const headingBefore = canvas.getByRole('heading').textContent ?? '';
      await user.click(canvas.getByRole('button', { name: /previous month/i }));
      await waitFor(() => {
        expect(canvas.getByRole('heading').textContent).not.toBe(headingBefore);
      });
    });

    await step(
      'click "Today" after advancing two months — heading returns to current',
      async () => {
        // Advance two months ahead so "Today" has meaningful work to do
        await user.click(canvas.getByRole('button', { name: /next month/i }));
        await user.click(canvas.getByRole('button', { name: /next month/i }));
        const headingFuture = canvas.getByRole('heading').textContent ?? '';
        await user.click(canvas.getByRole('button', { name: /^today$/i }));
        await waitFor(() => {
          expect(canvas.getByRole('heading').textContent).not.toBe(headingFuture);
        });
      },
    );
  },
};

export const MiniInteractions: Story = {
  name: 'Interactions — mini variant month/year picker',
  args: { events: [] },
  render: () => {
    const [selected, setSelected] = useState<Date | null>(null);
    return (
      <div className="max-w-xs flex flex-col gap-3">
        <Calendar variant="mini" bordered selected={selected} onSelect={setSelected} />
        {selected && (
          <p
            className="text-xs font-body text-ink-500 dark:text-ink-300"
            data-testid="mini-selected"
          >
            Selected: {selected.toDateString()}
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('click a day — selection is set', async () => {
      await canvas.findByRole('button', { name: /next month/i });
      // Mini day buttons have full-date aria-labels — find the first weekday one
      const allBtns = canvas.getAllByRole('button');
      const dayBtn = allBtns.find((b: HTMLElement) =>
        /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),/.test(
          b.getAttribute('aria-label') ?? '',
        ),
      ) as HTMLElement;
      await user.click(dayBtn);
      await waitFor(() => {
        expect(canvas.getByTestId('mini-selected')).toBeInTheDocument();
      });
    });

    await step('click month/year header — opens month picker grid', async () => {
      await user.click(canvas.getByRole('button', { name: /click to change month or year/i }));
      await waitFor(() => {
        expect(canvas.getByRole('button', { name: /^jan$/i })).toBeInTheDocument();
      });
    });

    await step('click a month in the picker — navigates and returns to days view', async () => {
      await user.click(canvas.getByRole('button', { name: /^mar$/i }));
      await waitFor(() => {
        expect(
          canvas.getByRole('button', { name: /click to change month or year/i }),
        ).toBeInTheDocument();
        expect(canvas.queryByRole('button', { name: /^jan$/i })).not.toBeInTheDocument();
      });
    });
  },
};
