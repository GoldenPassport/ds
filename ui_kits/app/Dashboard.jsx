// Golden Passport — Dashboard (Tailwind v4)

const WORKFLOWS = [
  { id: 1, name: 'Invoice Approval',          dept: 'Finance',    steps: 8,  status: 'active',  runs: 142,  lastRun: '2h ago',  aiGen: true  },
  { id: 2, name: 'Employee Onboarding',        dept: 'HR',         steps: 14, status: 'running', runs: 38,   lastRun: '5m ago',  aiGen: true  },
  { id: 3, name: 'Customer Support Routing',   dept: 'Support',    steps: 6,  status: 'active',  runs: 892,  lastRun: '1m ago',  aiGen: false },
  { id: 4, name: 'Monthly Report Pipeline',    dept: 'Analytics',  steps: 11, status: 'draft',   runs: 0,    lastRun: 'Never',   aiGen: true  },
  { id: 5, name: 'Vendor Onboarding',          dept: 'Procurement',steps: 9,  status: 'pending', runs: 12,   lastRun: '1d ago',  aiGen: false },
  { id: 6, name: 'PTO Request Handler',        dept: 'HR',         steps: 5,  status: 'failed',  runs: 67,   lastRun: '3h ago',  aiGen: false },
];

const STATS = [
  { label: 'Active Workflows', value: '24',    delta: '+3 this week' },
  { label: 'Runs Today',       value: '1,284', delta: '+12% vs yesterday' },
  { label: 'Avg Completion',   value: '94.2%', delta: '+1.1pp' },
  { label: 'Time Saved',       value: '182h',  delta: 'this month' },
];

function StatCard({ label, value, delta }) {
  return (
    <div className="flex-1 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl px-5 py-4 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500 font-body mb-2">{label}</div>
      <div className="text-3xl font-extrabold font-display text-ink-900 dark:text-ink-50 tracking-tight leading-none">{value}</div>
      <div className="text-xs text-primary-600 dark:text-primary-400 font-body mt-1.5 font-medium">{delta}</div>
    </div>
  );
}

function WorkflowRow({ wf, onOpen }) {
  const statusMap = { active: 'active', running: 'running', pending: 'pending', draft: 'draft', failed: 'failed' };
  return (
    <div
      onClick={() => onOpen(wf)}
      className="flex items-center gap-4 px-5 py-3.5 border-b border-ink-100 dark:border-ink-700 cursor-pointer hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors duration-100 last:border-0"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink-900 dark:text-ink-50 font-body truncate">{wf.name}</span>
          {wf.aiGen && <Badge label="AI" variant="ai" />}
        </div>
        <div className="text-xs text-ink-400 dark:text-ink-500 font-body mt-0.5">{wf.dept} · {wf.steps} steps</div>
      </div>
      <Badge label={wf.status.charAt(0).toUpperCase() + wf.status.slice(1)} variant={statusMap[wf.status]} />
      <div className="w-20 text-right text-[13px] text-ink-500 dark:text-ink-400 font-body tabular-nums">{wf.runs}</div>
      <div className="w-24 text-right text-xs text-ink-400 dark:text-ink-500 font-body">{wf.lastRun}</div>
    </div>
  );
}

function Dashboard({ onOpenBuilder, onOpenWorkflow }) {
  return (
    <div className="flex-1 overflow-auto bg-ink-50 dark:bg-ink-900 flex flex-col">
      {/* Topbar */}
      <div className="px-7 py-4 flex items-center justify-between border-b border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shrink-0">
        <div>
          <div className="text-xl font-extrabold font-display text-ink-900 dark:text-ink-50 tracking-tight">Dashboard</div>
          <div className="text-[13px] text-ink-400 dark:text-ink-500 font-body mt-0.5">Monday, April 21, 2026</div>
        </div>
        <Btn onClick={onOpenBuilder}>✦ New Workflow</Btn>
      </div>

      <div className="p-7 flex-1">
        {/* Stats */}
        <div className="flex gap-3.5 mb-7">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-4 px-5 py-3 border-b border-ink-100 dark:border-ink-700 bg-ink-50 dark:bg-ink-700/50">
            <div className="flex-1 text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500 font-body">Workflow</div>
            <div className="w-20 text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500 font-body">Status</div>
            <div className="w-20 text-right text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500 font-body">Runs</div>
            <div className="w-24 text-right text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500 font-body">Last Run</div>
          </div>
          {WORKFLOWS.map(wf => <WorkflowRow key={wf.id} wf={wf} onOpen={onOpenWorkflow} />)}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
