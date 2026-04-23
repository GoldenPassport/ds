// Golden Passport — Settings (Tailwind v4)

function Toggle({ on }) {
  const [active, setActive] = React.useState(on);
  return (
    <button
      onClick={() => setActive(!active)}
      className={`relative w-10 h-[22px] rounded-full cursor-pointer border-0 transition-colors duration-200 shrink-0 ${active ? 'bg-primary-500' : 'bg-ink-200 dark:bg-ink-600'}`}
    >
      <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${active ? 'left-[21px]' : 'left-[3px]'}`} />
    </button>
  );
}

function SettingsRow({ label, desc, control }) {
  return (
    <div className="flex items-center justify-between px-6 py-3.5 border-b border-ink-100 dark:border-ink-700 last:border-0">
      <div>
        <div className="text-sm font-medium text-ink-900 dark:text-ink-50 font-body">{label}</div>
        {desc && <div className="text-xs text-ink-400 dark:text-ink-500 font-body mt-0.5">{desc}</div>}
      </div>
      <div className="ml-6 shrink-0">{control}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl overflow-hidden mb-5 shadow-sm">
      <div className="px-6 py-3.5 border-b border-ink-100 dark:border-ink-700 bg-ink-50 dark:bg-ink-700/50 text-[13px] font-bold font-display text-ink-900 dark:text-ink-50">
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

const inputCls = "bg-ink-50 dark:bg-ink-700 border border-ink-200 dark:border-ink-600 rounded-lg px-3 py-1.5 text-[13px] font-body text-ink-900 dark:text-ink-50 outline-none w-52 focus:border-primary-500 transition-colors";
const selectCls = "bg-ink-50 dark:bg-ink-700 border border-ink-200 dark:border-ink-600 rounded-lg px-3 py-1.5 text-[13px] font-body text-ink-900 dark:text-ink-50 outline-none focus:border-primary-500 transition-colors";

function Settings({ onBack }) {
  return (
    <div className="flex-1 flex flex-col bg-ink-50 dark:bg-ink-900 overflow-hidden">
      {/* Topbar */}
      <div className="px-7 py-4 flex items-center gap-4 border-b border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shrink-0">
        <button onClick={onBack} className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 text-lg bg-transparent border-0 cursor-pointer transition-colors">←</button>
        <div className="text-xl font-extrabold font-display text-ink-900 dark:text-ink-50 tracking-tight">Settings</div>
      </div>

      <div className="flex-1 overflow-auto p-7">
        <div className="max-w-2xl">
          <Section title="Profile">
            <SettingsRow label="Full Name" desc="Used in audit logs and notifications"
              control={<input defaultValue="Alex Morgan" className={inputCls} />} />
            <SettingsRow label="Email" desc="Login and notification email"
              control={<input defaultValue="alex@goldenpassport.ai" className={inputCls} />} />
            <SettingsRow label="Role" desc={null}
              control={<Badge label="Admin" variant="ai" />} />
          </Section>

          <Section title="Notifications">
            <SettingsRow label="Workflow failures"  desc="Get notified when a run fails"               control={<Toggle on={true}  />} />
            <SettingsRow label="Run completions"    desc="Notify on every successful run"              control={<Toggle on={false} />} />
            <SettingsRow label="Weekly digest"      desc="Summary of workflow activity every Monday"   control={<Toggle on={true}  />} />
          </Section>

          <Section title="AI & Automation">
            <SettingsRow label="AI Suggestions"    desc="Show prompt suggestions in the builder"            control={<Toggle on={true}  />} />
            <SettingsRow label="Auto-validate steps" desc="Validate each step against connected systems"    control={<Toggle on={true}  />} />
            <SettingsRow label="AI Model" desc="Language model used for workflow generation"
              control={
                <select className={selectCls}>
                  <option>Claude 3.5 Sonnet</option>
                  <option>GPT-4o</option>
                  <option>Gemini 1.5 Pro</option>
                </select>
              }
            />
          </Section>

          <Section title="Danger Zone">
            <SettingsRow label="Delete Organisation" desc="Permanently delete all workflows and data"
              control={<Btn variant="danger" size="sm">Delete</Btn>} />
          </Section>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Settings });
