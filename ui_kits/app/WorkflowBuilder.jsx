// Golden Passport — Workflow Builder (Tailwind v4)

const SAMPLE_NODES = [
  { id: 'trigger',   type: 'trigger',   label: 'Form Submitted',      sublabel: 'New hire form',        x: 40,  y: 60  },
  { id: 'email',     type: 'action',    label: 'Send Welcome Email',   sublabel: 'Via SendGrid',         x: 240, y: 16  },
  { id: 'provision', type: 'action',    label: 'Provision Tools',      sublabel: 'Okta + Slack + Jira',  x: 240, y: 116 },
  { id: 'check',     type: 'condition', label: 'Manager Assigned?',    sublabel: 'Check HRIS',           x: 440, y: 60  },
  { id: 'schedule',  type: 'action',    label: 'Schedule 1:1s',        sublabel: 'Calendar API',         x: 630, y: 16  },
  { id: 'assign',    type: 'action',    label: 'Assign Buddy',         sublabel: 'Random from dept',     x: 630, y: 116 },
  { id: 'done',      type: 'end',       label: 'Onboarding Complete',  sublabel: 'Notify HR',            x: 820, y: 60  },
];

const EDGES = [
  ['trigger','email'],['trigger','provision'],
  ['email','check'],['provision','check'],
  ['check','schedule'],['check','assign'],
  ['schedule','done'],['assign','done'],
];

const NODE_CFG = {
  trigger:   { border: '#F5C200', dot: '#F5C200', lightBg: '#FEF3C7', darkBg: '#27241F', lightText: '#725600' },
  action:    { border: '#5A82B4', dot: '#5A82B4', lightBg: '#E1E8F2', darkBg: '#27241F', lightText: '#1A3564' },
  condition: { border: '#B0ADA6', dot: '#7E7A72', lightBg: '#F8F7F4', darkBg: '#27241F', lightText: '#3A3733' },
  end:       { border: '#22C55E', dot: '#22C55E', lightBg: '#DCFCE7', darkBg: '#27241F', lightText: '#15803D' },
};

const SUGGESTIONS = [
  'Invoice approval with escalation',
  'Customer support ticket routing',
  'Monthly report generation',
  'Employee offboarding checklist',
];

function WorkflowCanvas({ theme }) {
  const dark = theme === 'dark';
  const edgeColor = dark ? '#3A3733' : '#D6D4CF';
  const W = 980, H = 220;

  return (
    <div style={{ position: 'relative', width: '100%', height: H, overflow: 'hidden' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox={`0 0 ${W} ${H}`}>
        {EDGES.map(([from, to]) => {
          const a = SAMPLE_NODES.find(n => n.id === from);
          const b = SAMPLE_NODES.find(n => n.id === to);
          const ax = a.x + 148, ay = a.y + 30, bx = b.x, by = b.y + 30;
          const mx = (ax + bx) / 2;
          return (
            <path key={`${from}-${to}`}
              d={`M${ax},${ay} C${mx},${ay} ${mx},${by} ${bx},${by}`}
              fill="none" stroke={edgeColor} strokeWidth="1.5" />
          );
        })}
      </svg>
      {SAMPLE_NODES.map(node => {
        const cfg = NODE_CFG[node.type];
        return (
          <div key={node.id} style={{
            position: 'absolute', left: node.x, top: node.y, width: 148,
            background: dark ? cfg.darkBg : cfg.lightBg,
            border: `1.5px solid ${cfg.border}`,
            borderRadius: 12, padding: '8px 12px',
            boxShadow: dark ? '0 2px 8px rgb(0 0 0/.4)' : '0 1px 4px rgb(14 13 11/.06)',
            cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: GP.fonts.body, color: dark ? '#F8F7F4' : cfg.lightText }}>{node.label}</span>
            </div>
            <div style={{ fontSize: 11, fontFamily: GP.fonts.body, color: dark ? '#7E7A72' : '#7E7A72', paddingLeft: 14 }}>{node.sublabel}</div>
          </div>
        );
      })}
    </div>
  );
}

function WorkflowBuilder({ onBack }) {
  const theme = useTheme();
  const [prompt, setPrompt] = React.useState('When a new hire joins, send welcome email, provision tools, and schedule 1:1s');
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="flex-1 flex flex-col bg-ink-50 dark:bg-ink-900 overflow-hidden">
      {/* Topbar */}
      <div className="px-6 py-3.5 flex items-center gap-4 border-b border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shrink-0">
        <button onClick={onBack} className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 text-lg bg-transparent border-0 cursor-pointer transition-colors">←</button>
        <div className="flex-1">
          <div className="text-[15px] font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight">Employee Onboarding</div>
          <div className="flex items-center gap-2 text-xs text-ink-400 dark:text-ink-500 font-body mt-0.5">
            HR · 14 steps · <Badge label="Running" variant="running" />
          </div>
        </div>
        <Btn variant="secondary" size="sm">Save Draft</Btn>
        <Btn size="sm">▷ Deploy</Btn>
      </div>

      {/* AI Prompt */}
      <div className="px-6 py-4 border-b border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-gp-pulse inline-block" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500 font-body">AI Workflow Builder</span>
        </div>
        <div className="relative">
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full pr-12 pl-4 py-3 bg-ink-50 dark:bg-ink-700 border border-ink-200 dark:border-ink-600 rounded-xl text-sm font-body text-ink-900 dark:text-ink-50 placeholder-ink-400 dark:placeholder-ink-500 outline-none transition-all duration-200"
            style={{ boxShadow: focused ? GP.shadow.gold : 'none', borderColor: focused ? '#F5C200' : undefined }}
            placeholder="Describe your workflow in plain language…"
          />
          <button className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-gold-500 hover:bg-gold-600 border-0 rounded-lg w-8 h-8 flex items-center justify-center text-ink-900 cursor-pointer transition-colors text-sm font-bold">
            →
          </button>
        </div>
        <div className="flex gap-2 mt-2.5 flex-wrap">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => setPrompt(s)}
              className="bg-ink-50 dark:bg-ink-700 border border-ink-200 dark:border-ink-600 rounded-lg px-3 py-1.5 text-xs text-ink-500 dark:text-ink-400 cursor-pointer font-body transition-all duration-150 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl p-6 shadow-sm min-h-64">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-300 dark:text-ink-600 font-body mb-5">Canvas</div>
          <WorkflowCanvas theme={theme} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WorkflowBuilder });
