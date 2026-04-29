import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Styling/General',
  parameters: { controls: { hideNoControlsWarning: true } },
};
export default meta;

// ── Helpers ───────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold font-body uppercase tracking-widest text-primary-800 dark:text-primary-400">
        {title}
      </h2>
      {children}
    </div>
  );
}

function TokenRow({ token, value, description }: { token: string; value: string; description?: string }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-ink-100 dark:border-ink-700 last:border-0">
      <code className="w-40 shrink-0 text-xs font-mono text-primary-800 dark:text-primary-400">{token}</code>
      <code className="w-28 shrink-0 text-xs font-mono text-ink-500 dark:text-ink-300">{value}</code>
      {description && <p className="text-xs font-body text-ink-400 dark:text-ink-300">{description}</p>}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-sm overflow-hidden px-6">
      {children}
    </div>
  );
}

// ── Story ─────────────────────────────────────────────────

export const Tokens = {
  name: 'General Tokens',
  render: () => (
    <div className="max-w-3xl flex flex-col gap-10">

      {/* Breakpoints */}
      <Section title="Breakpoints">
        <div className="flex flex-col gap-3">
          {[
            { bp: 'sm',  px: '640px',  rem: '40rem',  desc: 'Small devices, landscape phones' },
            { bp: 'md',  px: '768px',  rem: '48rem',  desc: 'Tablets' },
            { bp: 'lg',  px: '1024px', rem: '64rem',  desc: 'Laptops, desktops' },
            { bp: 'xl',  px: '1280px', rem: '80rem',  desc: 'Large desktops (default PageContainer max)' },
            { bp: '2xl', px: '1536px', rem: '96rem',  desc: 'Extra-large screens' },
          ].map(({ bp, px, rem, desc }) => (
            <div key={bp} className="flex items-center gap-4">
              <code className="w-10 shrink-0 text-sm font-mono font-semibold text-ink-900 dark:text-ink-50">{bp}</code>
              <code className="w-16 shrink-0 text-xs font-mono text-primary-800 dark:text-primary-400">{px}</code>
              <code className="w-16 shrink-0 text-xs font-mono text-ink-400 dark:text-ink-300">{rem}</code>
              <div
                className="h-5 rounded bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800"
                style={{ width: `${(parseInt(px) / 1536) * 100}%` }}
              />
              <p className="text-xs font-body text-ink-400 dark:text-ink-300 hidden lg:block">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Border radius */}
      <Section title="Border Radius">
        <div className="flex flex-wrap gap-6 items-end">
          {[
            { name: 'rounded-sm',   value: '4px',    cls: 'rounded-sm' },
            { name: 'rounded-md',   value: '8px',    cls: 'rounded-md' },
            { name: 'rounded-lg',   value: '12px',   cls: 'rounded-lg' },
            { name: 'rounded-xl',   value: '16px',   cls: 'rounded-xl' },
            { name: 'rounded-2xl',  value: '24px',   cls: 'rounded-2xl' },
            { name: 'rounded-full', value: '9999px', cls: 'rounded-full' },
          ].map(({ name, value, cls }) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 bg-primary-200 dark:bg-primary-800/50 border-2 border-primary-300 dark:border-primary-700 ${cls}`} />
              <div className="text-center">
                <p className="text-xs font-mono font-medium text-ink-700 dark:text-ink-200">{name}</p>
                <p className="text-xs font-mono text-ink-400 dark:text-ink-300">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Shadows */}
      <Section title="Shadows">
        <div className="flex flex-wrap gap-8 items-end">
          {[
            { name: 'shadow-sm',      cls: 'shadow-sm' },
            { name: 'shadow-md',      cls: 'shadow-md' },
            { name: 'shadow-lg',      cls: 'shadow-lg' },
            { name: 'shadow-primary', cls: 'shadow-primary' },
          ].map(({ name, cls }) => (
            <div key={name} className="flex flex-col items-center gap-3">
              <div className={`w-20 h-20 rounded-2xl bg-white dark:bg-ink-700 ${cls}`} />
              <p className="text-xs font-mono text-ink-500 dark:text-ink-300">{name}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Spacing scale */}
      <Section title="Spacing Scale (key steps)">
        <Card>
          {[
            { token: '1',  value: '4px',   rem: '0.25rem' },
            { token: '2',  value: '8px',   rem: '0.5rem'  },
            { token: '3',  value: '12px',  rem: '0.75rem' },
            { token: '4',  value: '16px',  rem: '1rem'    },
            { token: '5',  value: '20px',  rem: '1.25rem' },
            { token: '6',  value: '24px',  rem: '1.5rem'  },
            { token: '8',  value: '32px',  rem: '2rem'    },
            { token: '10', value: '40px',  rem: '2.5rem'  },
            { token: '12', value: '48px',  rem: '3rem'    },
            { token: '16', value: '64px',  rem: '4rem'    },
          ].map(({ token, value, rem }) => (
            <div key={token} className="flex items-center gap-4 py-2.5 border-b border-ink-100 dark:border-ink-700 last:border-0">
              <code className="w-8 shrink-0 text-xs font-mono font-semibold text-ink-700 dark:text-ink-200">{token}</code>
              <code className="w-16 shrink-0 text-xs font-mono text-primary-800 dark:text-primary-400">{value}</code>
              <code className="w-16 shrink-0 text-xs font-mono text-ink-400 dark:text-ink-300">{rem}</code>
              <div
                className="h-3 rounded bg-slate-200 dark:bg-slate-700"
                style={{ width: `${parseInt(value) * 2}px` }}
              />
            </div>
          ))}
        </Card>
      </Section>

      {/* PageContainer widths */}
      <Section title="PageContainer Max Widths">
        <Card>
          {[
            { size: 'sm',   value: '48rem', px: '768px',   desc: 'Forms, single-column layouts' },
            { size: 'md',   value: '64rem', px: '1024px',  desc: 'Articles, readable content' },
            { size: 'lg',   value: '72rem', px: '1152px',  desc: 'Standard app pages' },
            { size: 'xl',   value: '80rem', px: '1280px',  desc: 'Default — dashboards, wide pages' },
            { size: '2xl',  value: '96rem', px: '1536px',  desc: 'Full-width data-heavy views' },
            { size: 'full', value: '—',     px: 'none',    desc: 'No constraint — edge-to-edge' },
          ].map(({ size, value, px, desc }) => (
            <TokenRow key={size} token={`maxWidth="${size}"`} value={value} description={`${px} — ${desc}`} />
          ))}
        </Card>
      </Section>

      {/* Z-index */}
      <Section title="Z-Index Scale">
        <Card>
          {[
            { token: 'z-0',    value: '0',    desc: 'Default stacking context' },
            { token: 'z-10',   value: '10',   desc: 'Slightly raised elements' },
            { token: 'z-20',   value: '20',   desc: 'Sticky headers, table headers' },
            { token: 'z-30',   value: '30',   desc: 'Dropdowns, menus' },
            { token: 'z-40',   value: '40',   desc: 'Overlays, drawers' },
            { token: 'z-50',   value: '50',   desc: 'Modals, dialogs' },
            { token: 'z-[60]', value: '60',   desc: 'Toasts, notifications' },
          ].map(({ token, value, desc }) => (
            <TokenRow key={token} token={token} value={value} description={desc} />
          ))}
        </Card>
      </Section>

      {/* Animations */}
      <Section title="Animations">
        <div className="flex flex-wrap gap-6">
          {[
            { name: 'gp-fade-in',  cls: 'animate-gp-fade-in',  desc: '0.2s ease-out' },
            { name: 'gp-slide-up', cls: 'animate-gp-slide-up', desc: '0.25s cubic-bezier(0.16,1,0.3,1)' },
            { name: 'gp-pulse',    cls: 'animate-gp-pulse',    desc: '2s ease-in-out infinite' },
          ].map(({ name, cls, desc }) => (
            <div key={name} className="flex flex-col items-center gap-3">
              <div className={`w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 flex items-center justify-center ${cls}`}>
                <div className="w-6 h-6 rounded-lg bg-primary-400 dark:bg-primary-500" />
              </div>
              <div className="text-center">
                <p className="text-xs font-mono font-medium text-ink-700 dark:text-ink-200">{name}</p>
                <p className="text-xs font-body text-ink-400 dark:text-ink-300">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

    </div>
  ),
};
