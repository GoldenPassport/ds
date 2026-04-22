// Golden Passport — Run Logs (Tailwind v4)

const RUN_DATA = [
  { id: 'run-001', workflow: 'Invoice Approval',          status: 'completed', duration: '2m 14s', steps: 8,  started: '2:34 PM', trigger: 'Form submitted',   user: 'Sarah K.' },
  { id: 'run-002', workflow: 'Employee Onboarding',        status: 'running',   duration: '5m 02s', steps: 6,  started: '2:30 PM', trigger: 'HRIS event',       user: 'System' },
  { id: 'run-003', workflow: 'Customer Support Routing',   status: 'completed', duration: '0m 08s', steps: 6,  started: '2:28 PM', trigger: 'Zendesk webhook',  user: 'System' },
  { id: 'run-004', workflow: 'Invoice Approval',           status: 'failed',    duration: '1m 45s', steps: 4,  started: '2:15 PM', trigger: 'Form submitted',   user: 'Tom R.' },
  { id: 'run-005', workflow: 'PTO Request Handler',        status: 'completed', duration: '0m 22s', steps: 5,  started: '1:58 PM', trigger: 'Slack command',    user: 'Maya L.' },
  { id: 'run-006', workflow: 'Monthly Report Pipeline',    status: 'completed', duration: '8m 30s', steps: 11, started: '1:00 PM', trigger: 'Scheduled',        user: 'System' },
];

const statusVariant = { completed: 'active', running: 'running', failed: 'failed' };
const statusLabel   = { completed: 'Completed', running: 'Running', failed: 'Failed' };

function RunLogs({ onBack }) {
  const [selected, setSelected] = React.useState(null);

  return (
    <div className="flex-1 flex flex-col bg-ink-50 dark:bg-ink-900 overflow-hidden">
      {/* Topbar */}
      <div className="px-7 py-4 flex items-center gap-4 border-b border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shrink-0">
        <button onClick={onBack} className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 text-lg bg-transparent border-0 cursor-pointer transition-colors">←</button>
        <div className="flex-1 text-xl font-extrabold font-display text-ink-900 dark:text-ink-50 tracking-tight">Run Logs</div>
        <div className="text-[13px] text-ink-400 dark:text-ink-500 font-body">Today · 1,284 runs</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Table */}
        <div className="flex-1 overflow-auto p-7">
          <div className="bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid px-5 py-3 border-b border-ink-100 dark:border-ink-700 bg-ink-50 dark:bg-ink-700/50 text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500 font-body"
              style={{ gridTemplateColumns: '1fr 110px 70px 90px 80px' }}>
              <div>Workflow / Trigger</div>
              <div>Status</div>
              <div>Steps</div>
              <div>Duration</div>
              <div>Started</div>
            </div>
            {RUN_DATA.map(run => (
              <div key={run.id}
                onClick={() => setSelected(selected?.id === run.id ? null : run)}
                className={`grid px-5 py-3.5 border-b border-ink-100 dark:border-ink-700 last:border-0 cursor-pointer transition-colors duration-100 ${selected?.id === run.id ? 'bg-ink-50 dark:bg-ink-700' : 'hover:bg-ink-50 dark:hover:bg-ink-700/50'}`}
                style={{ gridTemplateColumns: '1fr 110px 70px 90px 80px' }}
              >
                <div>
                  <div className="text-sm font-semibold text-ink-900 dark:text-ink-50 font-body">{run.workflow}</div>
                  <div className="text-xs text-ink-400 dark:text-ink-500 font-body mt-0.5">{run.trigger} · {run.user}</div>
                </div>
                <div className="flex items-center"><Badge label={statusLabel[run.status]} variant={statusVariant[run.status]} /></div>
                <div className="flex items-center text-[13px] text-ink-500 dark:text-ink-400 font-body">{run.steps}/{run.steps}</div>
                <div className="flex items-center text-[13px] text-ink-500 dark:text-ink-400 font-body tabular-nums">{run.duration}</div>
                <div className="flex items-center text-xs text-ink-400 dark:text-ink-500 font-body">{run.started}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-72 border-l border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 p-6 flex flex-col gap-4 animate-gp-fade shrink-0">
            <div className="flex items-start justify-between">
              <div className="text-[15px] font-bold font-display text-ink-900 dark:text-ink-50">{selected.workflow}</div>
              <button onClick={() => setSelected(null)} className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 bg-transparent border-0 cursor-pointer text-base transition-colors">✕</button>
            </div>
            <Badge label={statusLabel[selected.status]} variant={statusVariant[selected.status]} />
            {[
              ['Run ID', selected.id],
              ['Trigger', selected.trigger],
              ['Initiated by', selected.user],
              ['Started', selected.started],
              ['Duration', selected.duration],
              ['Steps completed', `${selected.steps}/${selected.steps}`],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500 font-body mb-1">{k}</div>
                <div className="text-[13px] text-ink-900 dark:text-ink-50 font-body">{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { RunLogs });
