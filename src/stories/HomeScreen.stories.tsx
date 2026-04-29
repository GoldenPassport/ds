import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  FolderOpen, Cpu, Activity, Globe, BarChart2, Settings,
  ChevronRight, ArrowUpCircle, ArrowDownCircle, RefreshCw,
  Bell, Plus, ArrowUpDown,
} from 'lucide-react';

import gpLogo          from '../../assets/gp-logo.png';
import { Navbar }       from '../components/Navbar';
import { SidebarNav }   from '../components/SidebarNav';
import { PageHeading }  from '../components/PageHeading';
import { BottomNav }    from '../components/BottomNav';
import { Stats }        from '../components/Stats';
import { Avatar }       from '../components/Avatar';
import { Badge }        from '../components/Badge';
import { Button }       from '../components/Button';
import { StackedList }  from '../components/StackedList';
import type { SearchSetFilterValues } from '../components/SearchSet';

const meta = {
  title: 'Example Pages/HomeScreen',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared fixtures ───────────────────────────────────────

const SIDEBAR_USER = {
  name: 'Tom Cook',
  email: 'tom@goldenpassport.com',
  menuItems: [
    { label: 'Your profile', href: '#' },
    { label: 'Settings',     href: '#' },
    { label: 'Sign out',     onClick: () => {}, dividerAbove: true },
  ],
};

const SIDEBAR_GROUPS = [
  {
    items: [
      { label: 'Projects',    href: '#', icon: <FolderOpen className="w-5 h-5" /> },
      { label: 'Deployments', href: '#', icon: <Cpu        className="w-5 h-5" />, active: true },
      { label: 'Activity',    href: '#', icon: <Activity   className="w-5 h-5" /> },
      { label: 'Domains',     href: '#', icon: <Globe      className="w-5 h-5" /> },
      { label: 'Usage',       href: '#', icon: <BarChart2  className="w-5 h-5" /> },
      { label: 'Settings',    href: '#', icon: <Settings   className="w-5 h-5" /> },
    ],
  },
];

const SIDEBAR_TEAMS_GROUP = [
  {
    label: 'Your teams',
    items: [
      { label: 'Planetaria',    href: '#', icon: <Avatar name="Planetaria"    size={20} /> },
      { label: 'Protocol',      href: '#', icon: <Avatar name="Protocol"      size={20} /> },
      { label: 'Tailwind Labs', href: '#', icon: <Avatar name="Tailwind Labs" size={20} /> },
    ],
  },
];

const BOTTOM_NAV_ITEMS = [
  { value: 'projects',    label: 'Projects',    icon: <FolderOpen className="w-5 h-5" /> },
  { value: 'deployments', label: 'Deploy',      icon: <Cpu        className="w-5 h-5" /> },
  { value: 'activity',    label: 'Activity',    icon: <Activity   className="w-5 h-5" /> },
  { value: 'domains',     label: 'Domains',     icon: <Globe      className="w-5 h-5" /> },
  { value: 'settings',    label: 'Settings',    icon: <Settings   className="w-5 h-5" /> },
];

type Deployment = {
  org:    string;
  repo:   string;
  source: string;
  time:   string;
  env:    'Production' | 'Preview';
  status: 'active' | 'pending';
};

const DEPLOYMENTS: Deployment[] = [
  { org: 'Planetaria',    repo: 'ios-app',         source: 'Deploys from GitHub', time: '1m 32s ago', env: 'Preview',    status: 'pending' },
  { org: 'Planetaria',    repo: 'mobile-api',       source: 'Deploys from GitHub', time: '3m ago',     env: 'Production', status: 'active'  },
  { org: 'Tailwind Labs', repo: 'tailwindcss.com',  source: 'Deploys from GitHub', time: '3h ago',     env: 'Preview',    status: 'pending' },
  { org: 'Tailwind Labs', repo: 'company-website',  source: 'Deploys from GitHub', time: '1d ago',     env: 'Preview',    status: 'active'  },
  { org: 'Protocol',      repo: 'relay-service',    source: 'Deploys from GitHub', time: '1d ago',     env: 'Production', status: 'active'  },
  { org: 'Planetaria',    repo: 'android-app',      source: 'Deploys from GitHub', time: '2d ago',     env: 'Preview',    status: 'pending' },
];

type ActivityItem = {
  name:   string;
  action: string;
  repo:   string;
  commit: string;
  branch: string;
  time:   string;
};

const ACTIVITY: ActivityItem[] = [
  { name: 'Michael Foster', action: 'Pushed to', repo: 'ios-app',         commit: '2d89f0c8', branch: 'main', time: '1h'  },
  { name: 'Lindsay Walton', action: 'Pushed to', repo: 'mobile-api',      commit: '249df660', branch: 'main', time: '3h'  },
  { name: 'Courtney Henry', action: 'Pushed to', repo: 'ios-app',         commit: '11464223', branch: 'main', time: '12h' },
  { name: 'Courtney Henry', action: 'Pushed to', repo: 'company-website', commit: 'dad28e95', branch: 'main', time: '2d'  },
  { name: 'Michael Foster', action: 'Pushed to', repo: 'relay-service',   commit: '624bc94c', branch: 'main', time: '5d'  },
];

// ── Filter definitions ────────────────────────────────────

const DEPLOYMENT_FILTER_DEFS = [
  {
    key:   'env',
    label: 'Environment',
    type:  'select' as const,
    options: [
      { value: 'Production', label: 'Production' },
      { value: 'Preview',    label: 'Preview'    },
    ],
  },
  {
    key:   'status',
    label: 'Status',
    type:  'select' as const,
    options: [
      { value: 'active',  label: 'Active'  },
      { value: 'pending', label: 'Pending' },
    ],
  },
];

const EMPTY_FILTER_VALUES: SearchSetFilterValues = { env: '', status: '' };

// ── Filtering helpers ─────────────────────────────────────

function matchesDeployment(d: Deployment, query: string, filters: SearchSetFilterValues): boolean {
  const q = query.toLowerCase();
  const textMatch = !q || d.repo.toLowerCase().includes(q) || d.org.toLowerCase().includes(q);
  const envMatch = !filters.env || d.env === filters.env;
  const statusMatch = !filters.status || d.status === filters.status;
  return textMatch && envMatch && statusMatch;
}

function matchesActivity(a: ActivityItem, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    a.name.toLowerCase().includes(q) ||
    a.repo.toLowerCase().includes(q) ||
    a.commit.toLowerCase().includes(q)
  );
}

// ── Sub-components ────────────────────────────────────────

function StatusDot({ status }: { status: 'active' | 'pending' }) {
  return (
    <span className={[
      'w-2.5 h-2.5 rounded-full shrink-0',
      status === 'active' ? 'bg-green-500' : 'bg-ink-400',
    ].join(' ')} />
  );
}

function DeploymentList({ rows }: { rows: Deployment[] }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-ink-200 dark:border-ink-700">
        <h2 className="text-base font-semibold font-display text-ink-900 dark:text-ink-50">
          Deployments
          {rows.length !== DEPLOYMENTS.length && (
            <span className="ml-2 text-sm font-normal text-ink-500 dark:text-ink-300">
              ({rows.length} of {DEPLOYMENTS.length})
            </span>
          )}
        </h2>
        <button type="button" className="inline-flex items-center gap-1 text-sm font-body text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-200 transition-colors">
          Sort by <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm font-body text-ink-500 dark:text-ink-300">No deployments match your search.</p>
      ) : (
        <StackedList
          items={rows.map((d, i) => ({ id: i, title: d.repo }))}
          renderItem={(_, i) => {
            const d = rows[i];
            return (
              <div className="flex items-center justify-between gap-3 py-3 -mx-2 px-2 rounded-xl hover:bg-ink-100 dark:hover:bg-ink-700/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <StatusDot status={d.status} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 truncate">
                      <span className="text-ink-500 dark:text-ink-300 font-normal">{d.org} / </span>{d.repo}
                    </p>
                    <p className="text-xs font-body text-ink-500 dark:text-ink-300 mt-0.5">{d.source} · {d.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge label={d.env} variant={d.env === 'Production' ? 'running' : 'draft'} />
                  <ChevronRight className="w-4 h-4 text-ink-500 dark:text-ink-300" />
                </div>
              </div>
            );
          }}
        />
      )}
    </div>
  );
}

function ActivityFeed({ rows }: { rows: ActivityItem[] }) {
  return (
    <div className="w-full sm:w-72 sm:shrink-0 bg-white dark:bg-ink-800 rounded-2xl border border-ink-200 dark:border-ink-700 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-ink-200 dark:border-ink-700">
        <h2 className="text-base font-semibold font-display text-ink-900 dark:text-ink-50">
          Activity feed
          {rows.length !== ACTIVITY.length && (
            <span className="ml-2 text-sm font-normal text-ink-500 dark:text-ink-300">
              ({rows.length})
            </span>
          )}
        </h2>
        <button type="button" className="text-sm font-body text-primary-800 dark:text-primary-400 hover:underline transition-colors">View all</button>
      </div>
      {rows.length === 0 ? (
        <p className="px-5 py-6 text-center text-sm font-body text-ink-500 dark:text-ink-300">No activity found.</p>
      ) : (
        <StackedList
          items={rows.map((a, i) => ({ id: i, title: a.name }))}
          renderItem={(_, i) => {
            const a = rows[i];
            return (
              <div className="flex items-start gap-3 px-5 py-3">
                <Avatar name={a.name} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 truncate">{a.name}</p>
                    <span className="text-xs font-body text-ink-500 dark:text-ink-300 shrink-0">{a.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs font-body text-ink-500 dark:text-ink-300 leading-relaxed">
                    {a.action} <span className="font-medium text-ink-700 dark:text-ink-300">{a.repo}</span>{' '}
                    (<code className="text-[11px] bg-ink-100 dark:bg-ink-700 px-1 rounded">{a.commit}</code> on <span className="font-medium">{a.branch}</span>)
                  </p>
                </div>
              </div>
            );
          }}
        />
      )}
    </div>
  );
}

// ── Story 1: Sidebar layout ───────────────────────────────

function SidebarDemo({ dark }: { dark?: boolean }) {
  const [activeNav,    setActiveNav]    = React.useState('deployments');
  const [query,        setQuery]        = React.useState('');
  const [filterValues, setFilterValues] = React.useState<SearchSetFilterValues>(EMPTY_FILTER_VALUES);

  const filteredDeployments = DEPLOYMENTS.filter(d => matchesDeployment(d, query, filterValues));
  const filteredActivity    = ACTIVITY.filter(a => matchesActivity(a, query));

  const totalFiltered = filteredDeployments.length + filteredActivity.length;
  const searchSummary = query || Object.values(filterValues).some(Boolean)
    ? `${totalFiltered} result${totalFiltered !== 1 ? 's' : ''}`
    : `${DEPLOYMENTS.length + ACTIVITY.length} items`;

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="flex h-screen bg-ink-50 dark:bg-ink-900 overflow-hidden">

        {/* Sidebar — hidden on mobile */}
        <div className="hidden sm:flex">
          <SidebarNav
            logo={
              <div className="flex items-center gap-2">
                <img src={gpLogo} alt="Golden Passport" className="h-6 w-auto" />
                <span className="text-[15px] font-extrabold font-display text-ink-900 dark:text-white tracking-tight leading-none">Golden Passport</span>
              </div>
            }
            groups={[...SIDEBAR_GROUPS, ...SIDEBAR_TEAMS_GROUP]}
            user={SIDEBAR_USER}
            appearance="light"
            className="border-r border-ink-200 dark:border-ink-700"
          />
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-ink-50 dark:bg-ink-900">
          <PageHeading
            title=""
            mobileVariant="master"
            bordered
            sticky
            searchValue={query}
            onSearchChange={setQuery}
            searchPlaceholder="Search deployments & activity…"
            searchSummary={searchSummary}
            searchFilterDefs={DEPLOYMENT_FILTER_DEFS}
            searchFilterValues={filterValues}
            onSearchFilterChange={setFilterValues}
            searchFilterTitle="Filter deployments"
            onMenuClick={() => {}}
            actions={<Avatar name="Tom Cook" size={32} />}
          />

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 px-4 sm:px-6 py-5 sm:py-6 pb-24 sm:pb-6 min-w-0">
              <DeploymentList rows={filteredDeployments} />
              <ActivityFeed rows={filteredActivity} />
            </div>
          </div>

          {/* Bottom nav — mobile only */}
          <div className="sm:hidden">
            <BottomNav
              items={BOTTOM_NAV_ITEMS}
              activeValue={activeNav}
              onChange={setActiveNav}
              fixed={false}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export const Sidebar: Story = {
  name: 'Sidebar — deployments',
  render: () => <SidebarDemo />,
};

// ── Story 2: Stacked layout ───────────────────────────────

const STATS = [
  { label: 'Revenue',              value: '$405,091.00', change: '+4.75%',  changeType: 'increase' as const },
  { label: 'Overdue invoices',     value: '$12,787.00',  change: '+54.02%', changeType: 'increase' as const },
  { label: 'Outstanding invoices', value: '$245,988.00', change: '-1.39%',  changeType: 'decrease' as const },
  { label: 'Expenses',             value: '$30,156.00',  change: '+10.18%', changeType: 'increase' as const },
];

type Transaction = {
  amount:      string;
  tax?:        string;
  badge:       string;
  badgeVariant:'active' | 'draft' | 'failed';
  client:      string;
  desc:        string;
  invoice:     string;
  direction:   'in' | 'out' | 'repeat';
};

const TRANSACTIONS: { group: string; items: Transaction[] }[] = [
  {
    group: 'Today',
    items: [
      { amount: '$7,600.00 USD',  tax: '$500.00 tax', badge: 'Paid',     badgeVariant: 'active', client: 'Reform',   desc: 'Website redesign', invoice: '#00012', direction: 'in'     },
      { amount: '$10,000.00 USD',                      badge: 'Withdraw', badgeVariant: 'draft',  client: 'Tom Cook', desc: 'Salary',           invoice: '#00011', direction: 'out'    },
      { amount: '$2,000.00 USD',  tax: '$130.00 tax', badge: 'Overdue',  badgeVariant: 'failed', client: 'Tuple',    desc: 'Logo design',      invoice: '#00009', direction: 'repeat' },
    ],
  },
  {
    group: 'Yesterday',
    items: [
      { amount: '$9,400.00 USD', tax: '$640.00 tax', badge: 'Paid', badgeVariant: 'active', client: 'SavvyCal', desc: 'App development', invoice: '#00008', direction: 'in' },
      { amount: '$5,200.00 USD',                      badge: 'Paid', badgeVariant: 'active', client: 'Loom',     desc: 'Consulting',     invoice: '#00007', direction: 'in' },
    ],
  },
];

function DirectionIcon({ d }: { d: Transaction['direction'] }) {
  if (d === 'in')  return <ArrowUpCircle   className="w-8 h-8 text-ink-500 dark:text-ink-300 shrink-0" />;
  if (d === 'out') return <ArrowDownCircle className="w-8 h-8 text-ink-500 dark:text-ink-300 shrink-0" />;
  return                  <RefreshCw       className="w-8 h-8 text-ink-500 dark:text-ink-300 shrink-0" />;
}

function TransactionRow({ t }: { t: Transaction }) {
  return (
    <div className="divide-y divide-ink-100 dark:divide-ink-800">
      {/* Mobile layout */}
      <div className="sm:hidden py-4">
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">{t.amount}</p>
          <Badge label={t.badge} variant={t.badgeVariant} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-body text-ink-700 dark:text-ink-300 truncate">{t.client}</p>
            <p className="text-xs font-body text-ink-500 dark:text-ink-300">{t.desc}{t.tax ? ` · ${t.tax}` : ''}</p>
          </div>
          <button type="button" className="text-sm font-body font-medium text-primary-800 dark:text-primary-400 shrink-0">
            View
          </button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex items-center gap-4 py-4">
        <DirectionIcon d={t.direction} />
        <div className="w-44 shrink-0">
          <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">{t.amount}</p>
          {t.tax && <p className="text-xs font-body text-ink-500 dark:text-ink-300 mt-0.5">{t.tax}</p>}
        </div>
        <Badge label={t.badge} variant={t.badgeVariant} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">{t.client}</p>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mt-0.5">{t.desc}</p>
        </div>
        <div className="text-right shrink-0">
          <button type="button" className="text-sm font-body font-medium text-primary-800 dark:text-primary-400 hover:underline">
            View transaction
          </button>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mt-0.5">Invoice {t.invoice}</p>
        </div>
      </div>
    </div>
  );
}

function TransactionTable() {
  return (
    <div>
      <h2 className="text-base font-semibold font-display text-ink-900 dark:text-ink-50 pb-3 mb-4">Recent activity</h2>
      {TRANSACTIONS.map(group => (
        <div key={group.group} className="mb-6">
          <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 py-3 border-t border-b border-ink-200 dark:border-ink-700">
            {group.group}
          </p>
          {group.items.map((t, i) => (
            <TransactionRow key={i} t={t} />
          ))}
        </div>
      ))}
    </div>
  );
}

function CashflowFilterTabs() {
  const [active, setActive] = React.useState('7d');
  const tabs = [
    { label: 'Last 7 days',  value: '7d'  },
    { label: 'Last 30 days', value: '30d' },
    { label: 'All-time',     value: 'all' },
  ];
  return (
    <div className="relative bg-white dark:bg-ink-800">
      {/* Divider — absolutely positioned so tab border-b-2 paints directly on top of it */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-ink-200 dark:bg-ink-700" aria-hidden="true" />

      {/* Mobile: title + button row, then scrollable tabs */}
      <div className="sm:hidden flex items-center justify-between px-4 pt-4 pb-0">
        <span className="text-base font-semibold font-display text-ink-900 dark:text-ink-50">Cashflow</span>
        <Button variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          New invoice
        </Button>
      </div>
      <div className="relative z-10 flex items-center overflow-x-auto px-4 sm:px-6 gap-0 scrollbar-none">
        <span className="hidden sm:block text-base font-semibold font-display text-ink-900 dark:text-ink-50 mr-6 py-4 shrink-0">Cashflow</span>
        {tabs.map(t => (
          <button
            key={t.value}
            type="button"
            onClick={() => setActive(t.value)}
            className={[
              'px-1 py-4 mr-6 text-sm font-medium font-body border-b-2 whitespace-nowrap transition-colors shrink-0',
              active === t.value
                ? 'border-primary-500 text-ink-900 dark:text-ink-50'
                : 'border-transparent text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-200 hover:border-ink-300 dark:hover:border-ink-600',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
        <div className="hidden sm:block ml-auto shrink-0 py-3">
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            New invoice
          </Button>
        </div>
      </div>
    </div>
  );
}

function StackedDemo({ dark }: { dark?: boolean }) {
  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-ink-50 dark:bg-ink-900">
        <Navbar
          logo={
            <div className="flex items-center gap-2">
              <img src={gpLogo} alt="Golden Passport" className="h-6 w-auto" />
              <span className="hidden sm:block text-[15px] font-extrabold font-display text-ink-900 dark:text-white tracking-tight leading-none">Golden Passport</span>
            </div>
          }
          items={[
            { label: 'Home',     href: '#', active: true },
            { label: 'Invoices', href: '#' },
            { label: 'Clients',  href: '#' },
            { label: 'Expenses', href: '#' },
          ]}
          actions={
            <button type="button" aria-label="Notifications" className="p-2 rounded-full text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors">
              <Bell className="w-5 h-5" aria-hidden="true" />
            </button>
          }
          user={{ avatarUrl: 'https://i.pravatar.cc/40?img=12' }}
          appearance="light"
          bordered
        />

        <CashflowFilterTabs />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
          <Stats items={STATS} variant="cards" columns={4} className="mb-6 sm:mb-8" />
          <TransactionTable />
        </div>
      </div>
    </div>
  );
}

export const Stacked: Story = {
  name: 'Stacked — cashflow',
  render: () => <StackedDemo />,
};

