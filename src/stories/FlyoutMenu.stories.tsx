import type { Meta, StoryObj } from '@storybook/react';
import {
  BarChart2, Cpu, Globe, Shield, Zap, Users, BookOpen,
  LifeBuoy, Settings, Layers, Bell, Lock,
  FileText, Headphones, Play, Star,
} from 'lucide-react';

import { FlyoutMenu, FlyoutTrigger } from '../components/FlyoutMenu';
import type { FlyoutMenuItem, FlyoutMenuAction } from '../components/FlyoutMenu';

const meta = {
  title: 'Navigation/FlyoutMenu',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared fixtures ───────────────────────────────────────

const SIMPLE_ITEMS: FlyoutMenuItem[] = [
  { label: 'Blog',          href: '#' },
  { label: 'Case studies',  href: '#' },
  { label: 'Changelog',     href: '#', badge: 'New' },
  { label: 'Documentation', href: '#' },
  { label: 'Status',        href: '#' },
];

const DESC_ITEMS: FlyoutMenuItem[] = [
  { label: 'Analytics',    href: '#', description: 'Get a better understanding of your traffic' },
  { label: 'Integrations', href: '#', description: 'Connect with third-party tools and services' },
  { label: 'Automations',  href: '#', description: 'Build workflows that run without you', badge: 'Beta' },
  { label: 'Reports',      href: '#', description: 'Keep track of metrics and KPIs' },
];

const ICON_ITEMS: FlyoutMenuItem[] = [
  { label: 'Analytics',    href: '#', description: 'Real-time dashboards and custom reports',         icon: <BarChart2 className="w-5 h-5" /> },
  { label: 'Automations',  href: '#', description: 'Trigger workflows based on any event',            icon: <Zap       className="w-5 h-5" />, badge: 'New' },
  { label: 'Integrations', href: '#', description: 'Connect 200+ tools in a single click',            icon: <Layers    className="w-5 h-5" /> },
  { label: 'Security',     href: '#', description: 'SSO, audit logs and role-based access',           icon: <Shield    className="w-5 h-5" /> },
  { label: 'Deployments',  href: '#', description: 'Zero-downtime deploys across every environment',  icon: <Cpu       className="w-5 h-5" /> },
  { label: 'Team',         href: '#', description: 'Collaborate, comment and assign across projects', icon: <Users     className="w-5 h-5" /> },
];

const FOOTER_ACTIONS: FlyoutMenuAction[] = [
  { label: 'View all features', href: '#' },
  { label: 'Start free trial',  href: '#' },
];

const FOOTER_LINKS: FlyoutMenuAction[] = [
  { label: 'Documentation', href: '#', icon: <BookOpen   className="w-3.5 h-3.5" /> },
  { label: 'Help centre',   href: '#', icon: <LifeBuoy   className="w-3.5 h-3.5" /> },
  { label: 'Status',        href: '#', icon: <Globe      className="w-3.5 h-3.5" /> },
  { label: 'Changelog',     href: '#', icon: <FileText   className="w-3.5 h-3.5" /> },
];

// ── 1. Simple ─────────────────────────────────────────────

export const Simple: Story = {
  name: 'Simple',
  render: () => (
    <div className="p-8">
      <FlyoutMenu
        trigger={<FlyoutTrigger label="Resources" />}
        variant="simple"
        items={SIMPLE_ITEMS}
      />
    </div>
  ),
};

// ── 2. With descriptions ──────────────────────────────────

export const WithDescriptions: Story = {
  name: 'With descriptions',
  render: () => (
    <div className="p-8">
      <FlyoutMenu
        trigger={<FlyoutTrigger label="Product" />}
        variant="descriptions"
        items={DESC_ITEMS}
      />
    </div>
  ),
};

// ── 3. With icons ─────────────────────────────────────────

export const WithIcons: Story = {
  name: 'With icons',
  render: () => (
    <div className="p-8">
      <FlyoutMenu
        trigger={<FlyoutTrigger label="Solutions" />}
        variant="icons"
        items={ICON_ITEMS}
      />
    </div>
  ),
};

// ── 4. Two-column grid ────────────────────────────────────

export const TwoColumn: Story = {
  name: 'Two-column grid',
  render: () => (
    <div className="p-8">
      <FlyoutMenu
        trigger={<FlyoutTrigger label="Platform" />}
        variant="two-column"
        items={ICON_ITEMS}
      />
    </div>
  ),
};

// ── 5. With footer actions ────────────────────────────────

export const WithFooterActions: Story = {
  name: 'With footer actions',
  render: () => (
    <div className="p-8">
      <FlyoutMenu
        trigger={<FlyoutTrigger label="Solutions" />}
        variant="icons"
        items={ICON_ITEMS.slice(0, 4)}
        footerActions={FOOTER_ACTIONS}
      />
    </div>
  ),
};

// ── 6. With footer links ──────────────────────────────────

export const WithFooterLinks: Story = {
  name: 'With footer links',
  render: () => (
    <div className="p-8">
      <FlyoutMenu
        trigger={<FlyoutTrigger label="Product" />}
        variant="descriptions"
        items={DESC_ITEMS}
        footerLinks={FOOTER_LINKS}
      />
    </div>
  ),
};

// ── 7. Two-column + footer ────────────────────────────────

export const TwoColumnWithFooter: Story = {
  name: 'Two-column + footer',
  render: () => (
    <div className="p-8">
      <FlyoutMenu
        trigger={<FlyoutTrigger label="Platform" />}
        variant="two-column"
        items={ICON_ITEMS}
        footerActions={FOOTER_ACTIONS}
        footerLinks={FOOTER_LINKS}
      />
    </div>
  ),
};

// ── 8. Right-aligned ──────────────────────────────────────

export const RightAligned: Story = {
  name: 'Right-aligned panel',
  render: () => (
    <div className="p-8 flex justify-end">
      <FlyoutMenu
        trigger={<FlyoutTrigger label="Help" />}
        variant="icons"
        align="right"
        items={[
          { label: 'Documentation', href: '#', description: 'Guides, API reference and tutorials',    icon: <BookOpen    className="w-5 h-5" /> },
          { label: 'Support',       href: '#', description: 'Open a ticket or chat with the team',   icon: <Headphones  className="w-5 h-5" /> },
          { label: 'Status',        href: '#', description: 'Live uptime and incident history',       icon: <Globe       className="w-5 h-5" /> },
          { label: 'Changelog',     href: '#', description: "What's new in each release",            icon: <Star        className="w-5 h-5" />, badge: 'New' },
        ]}
        footerLinks={[
          { label: 'Community forum', href: '#', icon: <Users    className="w-3.5 h-3.5" /> },
          { label: 'Video tutorials', href: '#', icon: <Play     className="w-3.5 h-3.5" /> },
          { label: 'Settings',        href: '#', icon: <Settings className="w-3.5 h-3.5" /> },
        ]}
      />
    </div>
  ),
};

// ── 9. Navbar example ─────────────────────────────────────

export const NavbarExample: Story = {
  name: 'Navbar — multiple flyouts',
  render: () => (
    <nav className="flex items-center gap-6 px-6 py-4 bg-white dark:bg-ink-800 border-b border-ink-200 dark:border-ink-700 rounded-xl">
      <span className="text-sm font-extrabold font-display text-ink-900 dark:text-ink-50 mr-2">
        Acme
      </span>

      <FlyoutMenu
        trigger={<FlyoutTrigger label="Product" />}
        variant="icons"
        items={[
          { label: 'Analytics',   href: '#', description: 'Real-time dashboards',             icon: <BarChart2 className="w-5 h-5" /> },
          { label: 'Automations', href: '#', description: 'No-code workflow builder',          icon: <Zap       className="w-5 h-5" />, badge: 'New' },
          { label: 'Security',    href: '#', description: 'SSO, RBAC and audit trails',       icon: <Lock      className="w-5 h-5" /> },
          { label: 'Notifications', href: '#', description: 'Webhooks, emails and Slack alerts', icon: <Bell  className="w-5 h-5" /> },
        ]}
        footerActions={[
          { label: 'See all features', href: '#' },
          { label: 'Get started',      href: '#' },
        ]}
      />

      <FlyoutMenu
        trigger={<FlyoutTrigger label="Solutions" />}
        variant="two-column"
        items={ICON_ITEMS}
        footerLinks={FOOTER_LINKS}
      />

      <FlyoutMenu
        trigger={<FlyoutTrigger label="Resources" />}
        variant="simple"
        items={SIMPLE_ITEMS}
      />

      <a href="#" className="ml-auto text-sm font-semibold font-body text-ink-500 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 transition-colors">
        Sign in
      </a>
    </nav>
  ),
};
