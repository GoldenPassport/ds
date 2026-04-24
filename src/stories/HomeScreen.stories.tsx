import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  FolderOpen, Cpu, Activity, Globe, BarChart2, Settings,
  ChevronRight, ArrowUpCircle, ArrowDownCircle, RefreshCw,
  Bell, Plus,
} from 'lucide-react';

import { Navbar }       from '../components/Navbar';
import { SidebarNav }   from '../components/SidebarNav';
import { PageHeading }  from '../components/PageHeading';
import { Stats }        from '../components/Stats';
import { Avatar }       from '../components/Avatar';
import { Badge }        from '../components/Badge';
import { Button }       from '../components/Button';

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
  email: 'tom@acme.com',
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
      { label: 'Planetaria', href: '#', icon: <Avatar name="Planetaria" size={20} /> },
      { label: 'Protocol',   href: '#', icon: <Avatar name="Protocol"   size={20} /> },
      { label: 'Tailwind Labs', href: '#', icon: <Avatar name="Tailwind Labs" size={20} /> },
    ],
  },
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
  { org: 'Planetaria',    repo: 'ios-app',          source: 'Deploys from GitHub', time: '1m 32s ago',  env: 'Preview',    status: 'pending' },
  { org: 'Planetaria',    repo: 'mobile-api',        source: 'Deploys from GitHub', time: '3m ago',      env: 'Production', status: 'active'  },
  { org: 'Tailwind Labs', repo: 'tailwindcss.com',   source: 'Deploys from GitHub', time: '3h ago',      env: 'Preview',    status: 'pending' },
  { org: 'Tailwind Labs', repo: 'company-website',   source: 'Deploys from GitHub', time: '1d ago',      env: 'Preview',    status: 'active'  },
  { org: 'Protocol',      repo: 'relay-service',     source: 'Deploys from GitHub', time: '1d ago',      env: 'Production', status: 'active'  },
  { org: 'Planetaria',    repo: 'android-app',       source: 'Deploys from GitHub', time: '2d ago',      env: 'Preview',    status: 'pending' },
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
  { name: 'Michael Foster',  action: 'Pushed to',   repo: 'ios-app',         commit: '2d89f0c8', branch: 'main', time: '1h'  },
  { name: 'Lindsay Walton',  action: 'Pushed to',   repo: 'mobile-api',      commit: '249df660', branch: 'main', time: '3h'  },
  { name: 'Courtney Henry',  action: 'Pushed to',   repo: 'ios-app',         commit: '11464223', branch: 'main', time: '12h' },
  { name: 'Courtney Henry',  action: 'Pushed to',   repo: 'company-website', commit: 'dad28e95', branch: 'main', time: '2d'  },
  { name: 'Michael Foster',  action: 'Pushed to',   repo: 'relay-service',   commit: '624bc94c', branch: 'main', time: '5d'  },
];

// ── Sub-components ────────────────────────────────────────

function StatusDot({ status }: { status: 'active' | 'pending' }) {
  return (
    <span className={[
      'w-2.5 h-2.5 rounded-full shrink-0',
      status === 'active'  ? 'bg-green-500' : 'bg-ink-400',
    ].join(' ')} />
  );
}

function DeploymentList() {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-ink-200 dark:border-ink-800">
        <h2 className="text-base font-semibold font-display text-ink-900 dark:text-ink-50">Deployments</h2>
        <button type="button" className="inline-flex items-center gap-1 text-sm font-body text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-ink-200 transition-colors">
          Sort by <span className="text-xs">⇅</span>
        </button>
      </div>
      <div className="divide-y divide-ink-100 dark:divide-ink-800 border border-ink-100 dark:border-ink-800 rounded-xl overflow-hidden">
        {DEPLOYMENTS.map((d, i) => (
          <div key={i} className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-ink-900 hover:bg-ink-50 dark:hover:bg-ink-800/60 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <StatusDot status={d.status} />
              <div className="min-w-0">
                <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 truncate">
                  <span className="text-ink-400 dark:text-ink-500 font-normal">{d.org} / </span>{d.repo}
                </p>
                <p className="text-xs font-body text-ink-400 dark:text-ink-500 mt-0.5">{d.source} · {d.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                label={d.env}
                variant={d.env === 'Production' ? 'running' : 'draft'}
              />
              <ChevronRight className="w-4 h-4 text-ink-400 dark:text-ink-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityFeed() {
  return (
    <div className="w-72 shrink-0 bg-ink-50 dark:bg-ink-950 -my-6 -mr-6 px-6 py-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-ink-200 dark:border-ink-800">
        <h2 className="text-base font-semibold font-display text-ink-900 dark:text-ink-50">Activity feed</h2>
        <button type="button" className="text-sm font-body text-primary-600 dark:text-primary-400 hover:underline transition-colors">View all</button>
      </div>
      <div className="space-y-4">
        {ACTIVITY.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <Avatar name={a.name} size={36} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 truncate">{a.name}</p>
                <span className="text-xs font-body text-ink-400 dark:text-ink-500 shrink-0">{a.time}</span>
              </div>
              <p className="mt-0.5 text-xs font-body text-ink-500 dark:text-ink-400 leading-relaxed">
                {a.action} <span className="font-medium text-ink-700 dark:text-ink-300">{a.repo}</span>{' '}
                (<code className="text-[11px] bg-ink-100 dark:bg-ink-800 px-1 rounded">{a.commit}</code> on <span className="font-medium">{a.branch}</span>)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Story 1: Sidebar layout ───────────────────────────────

function SidebarDemo({ dark }: { dark?: boolean }) {
  return (
    <div className={dark ? 'dark' : ''}>
      <div className="flex h-screen bg-ink-50 dark:bg-ink-950 overflow-hidden">
        {/* Sidebar */}
        <SidebarNav
          logo={
            <span className="text-base font-bold font-display text-ink-900 dark:text-white">Acme</span>
          }
          groups={[...SIDEBAR_GROUPS, ...SIDEBAR_TEAMS_GROUP]}
          user={SIDEBAR_USER}
          appearance="light"
          className="border-r border-ink-200 dark:border-ink-800"
        />

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-white dark:bg-ink-900">
          <PageHeading
            title=""
            mobileVariant="master"
            bordered
            sticky
            searchPlaceholder="Search…"
            actions={
              <Avatar name="Tom Cook" size={32} />
            }
          />

          {/* Content */}
          <div className="flex-1 px-6 py-6 flex gap-8 min-w-0">
            <DeploymentList />
            <ActivityFeed />
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

export const SidebarDark: Story = {
  name: 'Sidebar — deployments (dark)',
  render: () => <SidebarDemo dark />,
};

// ── Story 2: Stacked layout ───────────────────────────────

const STATS = [
  { label: 'Revenue',              value: '$405,091.00', change: '+4.75%',  changeType: 'increase' as const },
  { label: 'Overdue invoices',     value: '$12,787.00',  change: '+54.02%', changeType: 'increase' as const },
  { label: 'Outstanding invoices', value: '$245,988.00', change: '-1.39%',  changeType: 'decrease' as const },
  { label: 'Expenses',             value: '$30,156.00',  change: '+10.18%', changeType: 'increase' as const },
];

type Transaction = {
  amount:    string;
  tax?:      string;
  badge:     string;
  badgeVariant: 'active' | 'draft' | 'failed';
  client:    string;
  desc:      string;
  invoice:   string;
  direction: 'in' | 'out' | 'repeat';
};

const TRANSACTIONS: { group: string; items: Transaction[] }[] = [
  {
    group: 'Today',
    items: [
      { amount: '$7,600.00 USD',  tax: '$500.00 tax',  badge: 'Paid',     badgeVariant: 'active', client: 'Reform',    desc: 'Website redesign', invoice: '#00012', direction: 'in'     },
      { amount: '$10,000.00 USD',                       badge: 'Withdraw', badgeVariant: 'draft',  client: 'Tom Cook',  desc: 'Salary',           invoice: '#00011', direction: 'out'    },
      { amount: '$2,000.00 USD',  tax: '$130.00 tax',  badge: 'Overdue',  badgeVariant: 'failed', client: 'Tuple',     desc: 'Logo design',      invoice: '#00009', direction: 'repeat' },
    ],
  },
  {
    group: 'Yesterday',
    items: [
      { amount: '$9,400.00 USD',  tax: '$640.00 tax',  badge: 'Paid',     badgeVariant: 'active', client: 'SavvyCal', desc: 'App development',  invoice: '#00008', direction: 'in'  },
      { amount: '$5,200.00 USD',                        badge: 'Paid',     badgeVariant: 'active', client: 'Loom',     desc: 'Consulting',       invoice: '#00007', direction: 'in'  },
    ],
  },
];

function DirectionIcon({ d }: { d: Transaction['direction'] }) {
  if (d === 'in')     return <ArrowUpCircle   className="w-8 h-8 text-ink-400 dark:text-ink-500" />;
  if (d === 'out')    return <ArrowDownCircle className="w-8 h-8 text-ink-400 dark:text-ink-500" />;
  return               <RefreshCw            className="w-8 h-8 text-ink-400 dark:text-ink-500" />;
}

function TransactionTable() {
  return (
    <div>
      <h2 className="text-base font-semibold font-display text-ink-900 dark:text-ink-50 pb-3 mb-4 border-b border-ink-200 dark:border-ink-800">Recent activity</h2>
      {TRANSACTIONS.map(group => (
        <div key={group.group} className="mb-6">
          <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 py-3 border-t border-b border-ink-200 dark:border-ink-800 mb-0">
            {group.group}
          </p>
          <div className="divide-y divide-ink-100 dark:divide-ink-800">
            {group.items.map((t, i) => (
              <div key={i} className="flex items-center gap-4 py-4">
                <DirectionIcon d={t.direction} />
                <div className="w-44 shrink-0">
                  <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">{t.amount}</p>
                  {t.tax && <p className="text-xs font-body text-ink-400 dark:text-ink-500 mt-0.5">{t.tax}</p>}
                </div>
                <Badge label={t.badge} variant={t.badgeVariant} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">{t.client}</p>
                  <p className="text-xs font-body text-ink-400 dark:text-ink-500 mt-0.5">{t.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <button type="button" className="text-sm font-body font-medium text-primary-600 dark:text-primary-400 hover:underline">
                    View transaction
                  </button>
                  <p className="text-xs font-body text-ink-400 dark:text-ink-500 mt-0.5">Invoice {t.invoice}</p>
                </div>
              </div>
            ))}
          </div>
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
    <div className="border-b border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0">
          <span className="text-base font-semibold font-display text-ink-900 dark:text-ink-50 mr-6 py-4">Cashflow</span>
          {tabs.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => setActive(t.value)}
              className={[
                'px-1 py-4 mr-6 text-sm font-medium font-body border-b-2 whitespace-nowrap transition-colors',
                active === t.value
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-200',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          New invoice
        </Button>
      </div>
    </div>
  );
}

function StackedDemo({ dark }: { dark?: boolean }) {
  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-ink-900">
        <Navbar
          logo={
            <span className="text-base font-bold font-display text-ink-900 dark:text-white">Acme</span>
          }
          items={[
            { label: 'Home',     href: '#', active: true },
            { label: 'Invoices', href: '#' },
            { label: 'Clients',  href: '#' },
            { label: 'Expenses', href: '#' },
          ]}
          actions={
            <button type="button" className="p-2 rounded-full text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors">
              <Bell className="w-5 h-5" aria-hidden="true" />
            </button>
          }
          user={{ avatarUrl: 'https://i.pravatar.cc/40?img=12' }}
          appearance="light"
          bordered
        />

        <CashflowFilterTabs />

        <div className="mx-auto max-w-7xl px-6 py-8">
          <Stats items={STATS} variant="cards" columns={4} className="mb-8" />
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

export const StackedDark: Story = {
  name: 'Stacked — cashflow (dark)',
  render: () => <StackedDemo dark />,
};
