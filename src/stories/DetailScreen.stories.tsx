import type { Meta, StoryObj } from '@storybook/react';
import gpLogo from '../../assets/gp-logo.png';
import {
  Briefcase,
  MapPin,
  DollarSign,
  CalendarDays,
  Paperclip,
  CheckCircle,
  XCircle,
  PenSquare,
  MessageCircle,
  LayoutDashboard,
  Users,
  FolderOpen,
  BarChart2,
  FileText,
  Settings,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

import { Navbar } from '../components/Navbar';
import { SidebarNav } from '../components/SidebarNav';
import { PageHeading } from '../components/PageHeading';
import { DescriptionList } from '../components/DescriptionList';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { Divider } from '../components/Divider';
import { Hyperlink } from '../components/Hyperlink';

const meta = {
  title: 'Example Pages/DetailScreen',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared fixtures ───────────────────────────────────────

const NAVBAR_USER = {
  name: 'Alex Johnson',
  email: 'alex@acme.com',
  menuItems: [
    { label: 'Your profile', href: '#' },
    { label: 'Settings', href: '#' },
    { label: 'Sign out', onClick: () => {}, dividerAbove: true },
  ],
};

const NAV_ITEMS = [
  { label: 'Jobs', href: '#', active: true },
  { label: 'Applications', href: '#' },
  { label: 'Candidates', href: '#' },
  { label: 'Reports', href: '#' },
];

const SIDEBAR_GROUPS = [
  {
    label: 'Recruiting',
    items: [
      { label: 'Dashboard', href: '#', icon: <LayoutDashboard className="w-5 h-5" /> },
      { label: 'Jobs', href: '#', icon: <Briefcase className="w-5 h-5" />, active: true },
      { label: 'Applications', href: '#', icon: <FileText className="w-5 h-5" />, badge: 12 },
      { label: 'Candidates', href: '#', icon: <Users className="w-5 h-5" /> },
    ],
  },
  {
    label: 'Company',
    items: [
      { label: 'Reports', href: '#', icon: <BarChart2 className="w-5 h-5" /> },
      { label: 'Projects', href: '#', icon: <FolderOpen className="w-5 h-5" /> },
      { label: 'Permissions', href: '#', icon: <ShieldCheck className="w-5 h-5" /> },
      { label: 'Settings', href: '#', icon: <Settings className="w-5 h-5" /> },
      { label: 'Help', href: '#', icon: <HelpCircle className="w-5 h-5" /> },
    ],
  },
];

const DESCRIPTION_ITEMS = [
  {
    label: 'Position',
    value: 'Senior Front-End Developer',
    action: { label: 'Edit', href: '#' },
  },
  {
    label: 'Department',
    value: 'Engineering',
  },
  {
    label: 'Location',
    value: (
      <span className="flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-ink-500 dark:text-ink-300" />
        Remote — EMEA
      </span>
    ),
  },
  {
    label: 'Salary range',
    value: (
      <span className="flex items-center gap-1.5">
        <DollarSign className="w-4 h-4 text-ink-500 dark:text-ink-300" />
        $120,000 – $150,000
      </span>
    ),
  },
  {
    label: 'Closes',
    value: (
      <span className="flex items-center gap-1.5">
        <CalendarDays className="w-4 h-4 text-ink-500 dark:text-ink-300" />
        30 April 2026
      </span>
    ),
  },
  {
    label: 'About',
    value:
      "We're looking for an experienced front-end engineer to join our product team. You'll work closely with design and back-end to ship fast, polished interfaces used by thousands of customers.",
  },
];

const ATTACHMENTS = [
  { name: 'job_description_final.pdf', size: '84 KB' },
  { name: 'compensation_bands_2026.pdf', size: '210 KB' },
];

const ACTIVITY = [
  {
    author: 'Priya Mehta',
    time: '3 days ago',
    comment: 'Opening approved by HR. Posting goes live today.',
  },
  {
    author: 'Tom Clarke',
    time: 'yesterday',
    comment: 'Two strong candidates identified from inbound referrals — added to pipeline.',
  },
  {
    author: 'Alex Johnson',
    time: '2 hours ago',
    comment: 'Updated salary band to reflect 2026 compensation review.',
  },
];

// ── Sub-sections ──────────────────────────────────────────

function Attachments() {
  return (
    <div>
      <h2 className="text-sm font-semibold font-body text-ink-900 dark:text-ink-100 mb-3">
        Attachments
      </h2>
      <ul className="divide-y divide-ink-100 dark:divide-ink-800 rounded-lg border border-ink-200 dark:border-ink-700 overflow-hidden">
        {ATTACHMENTS.map((a) => (
          <li
            key={a.name}
            className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-ink-900"
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <Paperclip className="w-4 h-4 shrink-0 text-ink-500 dark:text-ink-300" />
              <span className="text-sm font-body text-ink-700 dark:text-ink-300 truncate">
                {a.name}
              </span>
              <span className="text-xs font-body text-ink-500 dark:text-ink-300 shrink-0">
                {a.size}
              </span>
            </span>
            <Hyperlink href="#" className="text-xs font-semibold shrink-0">
              Download
            </Hyperlink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActivityFeed() {
  return (
    <div>
      <h2 className="text-sm font-semibold font-body text-ink-900 dark:text-ink-100 mb-4">
        Activity
      </h2>
      <ul className="flex flex-col gap-6">
        {ACTIVITY.map((a, i) => (
          <li key={i} className="flex gap-3">
            <Avatar name={a.author} size={32} className="shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-body text-ink-900 dark:text-ink-100">
                <span className="font-semibold">{a.author}</span>
                <span className="text-ink-500 dark:text-ink-300 ml-2 font-normal">{a.time}</span>
              </p>
              <p className="mt-1 text-sm font-body text-ink-600 dark:text-ink-300">{a.comment}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Comment input */}
      <div className="mt-6 flex gap-3">
        <Avatar name="Alex Johnson" size={32} className="shrink-0 mt-0.5" />
        <div className="flex-1 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 overflow-hidden focus-within:ring-2 focus-within:ring-primary-500/25 focus-within:border-primary-500">
          <textarea
            rows={3}
            placeholder="Add a comment…"
            className="block w-full px-4 pt-3 pb-2 text-sm font-body bg-white dark:bg-ink-900 text-ink-900 dark:text-ink-100 placeholder:text-ink-500 dark:placeholder:text-ink-300 outline-none resize-none"
          />
          <div className="flex justify-end px-3 pb-3">
            <Button size="sm" variant="primary">
              <MessageCircle className="w-4 h-4 mr-1.5" />
              Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailActions() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant="primary" size="sm">
        <CheckCircle className="w-4 h-4 mr-1.5" />
        Approve
      </Button>
      <Button variant="secondary" size="sm">
        <PenSquare className="w-4 h-4 mr-1.5" />
        Edit
      </Button>
      <Button variant="danger" size="sm">
        <XCircle className="w-4 h-4 mr-1.5" />
        Close
      </Button>
    </div>
  );
}

// ── 1. Stacked layout ─────────────────────────────────────

export const Stacked: Story = {
  name: 'Stacked layout',
  render: () => (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-800 flex flex-col">
      <Navbar
        logo={
          <div className="flex items-center gap-2">
            <img src={gpLogo} alt="Golden Passport" className="h-6 w-auto" />
            <span className="text-[15px] font-extrabold font-display text-ink-900 dark:text-white tracking-tight leading-none">
              Golden Passport
            </span>
          </div>
        }
        items={NAV_ITEMS}
        user={NAVBAR_USER}
        bordered
        sticky
      />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <PageHeading
          backHref="#"
          title="Senior Front-End Developer"
          sticky={false}
          meta={
            <div className="flex items-center gap-2 flex-wrap">
              <Badge label="Open" variant="active" />
              <Badge label="Full-time" variant="neutral" />
              <Badge label="Remote" variant="neutral" />
            </div>
          }
          actions={<DetailActions />}
        />

        <DescriptionList layout="side-by-side" bordered striped items={DESCRIPTION_ITEMS} />

        <Attachments />

        <Divider />

        <ActivityFeed />
      </main>
    </div>
  ),
};

// ── 3. Sidebar layout ─────────────────────────────────────

export const WithSidebar: Story = {
  name: 'Sidebar layout',
  render: () => (
    <div className="flex h-screen bg-ink-50 dark:bg-ink-900">
      <div className="w-64 shrink-0 h-full">
        <SidebarNav
          logo={
            <div className="flex items-center gap-2">
              <img src={gpLogo} alt="Golden Passport" className="h-6 w-auto" />
              <span className="text-[15px] font-extrabold font-display text-ink-900 dark:text-white tracking-tight leading-none">
                Golden Passport
              </span>
            </div>
          }
          groups={SIDEBAR_GROUPS}
          user={NAVBAR_USER}
        />
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-8 flex flex-col gap-8">
          <PageHeading
            backHref="#"
            title="Senior Front-End Developer"
            sticky={false}
            meta={
              <div className="flex items-center gap-2 flex-wrap">
                <Badge label="Open" variant="active" />
                <Badge label="Full-time" variant="neutral" />
                <Badge label="Remote" variant="neutral" />
              </div>
            }
            actions={<DetailActions />}
          />

          <DescriptionList layout="side-by-side" bordered striped items={DESCRIPTION_ITEMS} />

          <Attachments />

          <Divider />

          <ActivityFeed />
        </div>
      </main>
    </div>
  ),
};
