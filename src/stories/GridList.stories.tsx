import type { Meta, StoryObj } from '@storybook/react';
import { Users, Calendar, FolderOpen, Globe, Lock, MoreVertical, GitBranch, Clock } from 'lucide-react';
import { GridList, type GridListItem } from '../components/GridList';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Menu } from '../components/Menu';

const meta = {
  title: 'Lists/GridList',
  component: GridList,
  tags: ['autodocs'],
  argTypes: {
    columns:    { control: { type: 'select', options: [2, 3, 4] } },
    renderItem: { control: false },
    className:  { control: 'text' },
  },
} satisfies Meta<typeof GridList>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared fixtures ────────────────────────────────────────

const MENU_ITEMS = [
  { label: 'Edit',        onClick: () => {} },
  { label: 'Duplicate',   onClick: () => {} },
  { label: 'Archive',     onClick: () => {}, destructive: true, dividerAbove: true },
];

const PROJECTS: GridListItem[] = [
  {
    id: 1,
    title: 'GraphQL API',
    description: 'Main API gateway handling all client requests. Deployed on AWS Lambda with auto-scaling enabled.',
    leading: <Avatar name="GraphQL API" size={40} />,
    badge: <Badge label="Active" variant="active" />,
    meta: [
      { icon: <Users className="w-3.5 h-3.5" />, label: '12 members' },
      { icon: <GitBranch className="w-3.5 h-3.5" />, label: '3 branches' },
      { icon: <Calendar className="w-3.5 h-3.5" />, label: 'Updated 2h ago' },
    ],
    menuItems: MENU_ITEMS,
  },
  {
    id: 2,
    title: 'Marketing Site',
    description: 'Public-facing website built with Next.js. Deployed to Vercel with automatic preview environments.',
    leading: <Avatar name="Marketing Site" size={40} />,
    badge: <Badge label="Active" variant="active" />,
    meta: [
      { icon: <Users className="w-3.5 h-3.5" />, label: '5 members' },
      { icon: <GitBranch className="w-3.5 h-3.5" />, label: '1 branch' },
      { icon: <Calendar className="w-3.5 h-3.5" />, label: 'Updated yesterday' },
    ],
    menuItems: MENU_ITEMS,
  },
  {
    id: 3,
    title: 'Data Pipeline',
    description: 'ETL pipeline for syncing data between the data warehouse and application database.',
    leading: <Avatar name="Data Pipeline" size={40} />,
    badge: <Badge label="Running" variant="running" />,
    meta: [
      { icon: <Users className="w-3.5 h-3.5" />, label: '3 members' },
      { icon: <Clock className="w-3.5 h-3.5" />, label: 'Runs every 15min' },
      { icon: <Calendar className="w-3.5 h-3.5" />, label: 'Updated 3d ago' },
    ],
    menuItems: MENU_ITEMS,
  },
  {
    id: 4,
    title: 'Mobile App',
    description: 'React Native app for iOS and Android. Managed through Expo Application Services.',
    leading: <Avatar name="Mobile App" size={40} />,
    badge: <Badge label="Pending" variant="pending" />,
    meta: [
      { icon: <Users className="w-3.5 h-3.5" />, label: '8 members' },
      { icon: <GitBranch className="w-3.5 h-3.5" />, label: '4 branches' },
      { icon: <Calendar className="w-3.5 h-3.5" />, label: 'Updated last week' },
    ],
    menuItems: MENU_ITEMS,
  },
  {
    id: 5,
    title: 'Auth Service',
    description: 'Handles authentication and authorisation across all services using OAuth 2.0 and JWT.',
    leading: <Avatar name="Auth Service" size={40} />,
    badge: <Badge label="Active" variant="active" />,
    meta: [
      { icon: <Users className="w-3.5 h-3.5" />, label: '4 members' },
      { icon: <GitBranch className="w-3.5 h-3.5" />, label: '2 branches' },
      { icon: <Calendar className="w-3.5 h-3.5" />, label: 'Updated 4d ago' },
    ],
    menuItems: MENU_ITEMS,
  },
  {
    id: 6,
    title: 'Admin Dashboard',
    description: 'Internal tooling for customer support and operations. Built with React and Tailwind.',
    leading: <Avatar name="Admin Dashboard" size={40} />,
    badge: <Badge label="Draft" variant="draft" />,
    meta: [
      { icon: <Users className="w-3.5 h-3.5" />, label: '2 members' },
      { icon: <GitBranch className="w-3.5 h-3.5" />, label: '1 branch' },
      { icon: <Calendar className="w-3.5 h-3.5" />, label: 'Updated 2w ago' },
    ],
    menuItems: MENU_ITEMS,
  },
];

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    items:   PROJECTS,
    columns: 3,
  },
};

// ── With links ────────────────────────────────────────────

export const WithLinks: Story = {
  name: 'With links',
  args: { items: [] },
  render: () => (
    <GridList
      columns={3}
      items={PROJECTS.map(p => ({ ...p, href: '#' }))}
    />
  ),
};

// ── Two columns ───────────────────────────────────────────

export const TwoColumns: Story = {
  name: 'Two columns',
  args: { items: [] },
  render: () => <GridList columns={2} items={PROJECTS} />,
};

// ── Four columns ──────────────────────────────────────────

export const FourColumns: Story = {
  name: 'Four columns',
  args: { items: [] },
  render: () => (
    <GridList
      columns={4}
      items={PROJECTS.map(({ meta: _m, description: _d, ...p }) => p)}
    />
  ),
};

// ── Simple — no metadata ──────────────────────────────────

export const Simple: Story = {
  name: 'Simple — title and description only',
  args: { items: [] },
  render: () => {
    const items: GridListItem[] = [
      { id: 1, title: 'Onboarding flow',         description: 'Guides new users through account setup and first-run configuration.' },
      { id: 2, title: 'Weekly digest email',      description: 'Sends a summary of activity to all active users every Monday morning.' },
      { id: 3, title: 'Churn prediction model',   description: 'Machine learning pipeline that scores accounts by churn probability.' },
      { id: 4, title: 'Payment retry logic',      description: 'Retries failed payments on a configurable backoff schedule.' },
      { id: 5, title: 'Renewal reminder series',  description: 'Automated email sequence sent 30, 14, and 3 days before renewal.' },
      { id: 6, title: 'Usage alert webhooks',     description: 'Fires outbound webhooks when accounts approach plan limits.' },
    ];
    return <GridList items={items} />;
  },
};

// ── With photo avatars ────────────────────────────────────

export const WithPhotoAvatars: Story = {
  name: 'With photo avatars',
  args: { items: [] },
  render: () => {
    const items: GridListItem[] = [
      {
        id: 1,
        title: 'Leslie Alexander',
        description: 'Co-Founder & CEO. Leads product strategy and investor relations.',
        leading: (
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Leslie Alexander"
            className="w-10 h-10 rounded-full object-cover"
          />
        ),
        badge: <Badge label="Active" variant="active" />,
        meta: [{ icon: <Calendar className="w-3.5 h-3.5" />, label: 'Joined Jan 2020' }],
        menuItems: MENU_ITEMS,
      },
      {
        id: 2,
        title: 'Michael Foster',
        description: 'Co-Founder & CTO. Responsible for all engineering and infrastructure decisions.',
        leading: (
          <img
            src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Michael Foster"
            className="w-10 h-10 rounded-full object-cover"
          />
        ),
        badge: <Badge label="Active" variant="active" />,
        meta: [{ icon: <Calendar className="w-3.5 h-3.5" />, label: 'Joined Jan 2020' }],
        menuItems: MENU_ITEMS,
      },
      {
        id: 3,
        title: 'Dries Vincent',
        description: 'Head of Business Development. Manages partnerships and enterprise accounts.',
        leading: (
          <img
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Dries Vincent"
            className="w-10 h-10 rounded-full object-cover"
          />
        ),
        badge: <Badge label="Pending" variant="pending" />,
        meta: [{ icon: <Calendar className="w-3.5 h-3.5" />, label: 'Joined Mar 2021' }],
        menuItems: MENU_ITEMS,
      },
      {
        id: 4,
        title: 'Lindsay Walton',
        description: 'Senior Front-end Developer. Owns the design system and component library.',
        leading: (
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Lindsay Walton"
            className="w-10 h-10 rounded-full object-cover"
          />
        ),
        badge: <Badge label="Active" variant="active" />,
        meta: [{ icon: <Calendar className="w-3.5 h-3.5" />, label: 'Joined Jun 2021' }],
        menuItems: MENU_ITEMS,
      },
      {
        id: 5,
        title: 'Tom Cook',
        description: 'Director of Product. Responsible for roadmap planning and feature prioritisation.',
        leading: (
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Tom Cook"
            className="w-10 h-10 rounded-full object-cover"
          />
        ),
        badge: <Badge label="Draft" variant="draft" />,
        meta: [{ icon: <Calendar className="w-3.5 h-3.5" />, label: 'Joined Sep 2022' }],
        menuItems: MENU_ITEMS,
      },
      {
        id: 6,
        title: 'Courtney Henry',
        description: 'Lead Product Designer. Owns the visual design language and user research.',
        leading: (
          <img
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Courtney Henry"
            className="w-10 h-10 rounded-full object-cover"
          />
        ),
        badge: <Badge label="Active" variant="active" />,
        meta: [{ icon: <Calendar className="w-3.5 h-3.5" />, label: 'Joined Feb 2022' }],
        menuItems: MENU_ITEMS,
      },
    ];
    return <GridList columns={3} items={items} />;
  },
};

// ── Directories / folders ─────────────────────────────────

export const Folders: Story = {
  name: 'Folders / categories',
  args: { items: [] },
  render: () => {
    const items: GridListItem[] = [
      { id: 1, title: 'Design assets',       description: 'Logos, icons, and brand guidelines.',         leading: <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center"><FolderOpen className="w-5 h-5 text-primary-800 dark:text-primary-400" /></div>,    meta: [{ icon: <FolderOpen className="w-3.5 h-3.5" />, label: '142 files' }, { icon: <Globe className="w-3.5 h-3.5" />, label: 'Public' }],       menuItems: MENU_ITEMS },
      { id: 2, title: 'Engineering docs',    description: 'Architecture diagrams and API references.',   leading: <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>,   meta: [{ icon: <FolderOpen className="w-3.5 h-3.5" />, label: '38 files' },  { icon: <Lock className="w-3.5 h-3.5" />, label: 'Private' }],       menuItems: MENU_ITEMS },
      { id: 3, title: 'Legal',               description: 'Contracts, NDAs, and compliance documents.',  leading: <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><FolderOpen className="w-5 h-5 text-red-600 dark:text-red-400" /></div>,    meta: [{ icon: <FolderOpen className="w-3.5 h-3.5" />, label: '21 files' },  { icon: <Lock className="w-3.5 h-3.5" />, label: 'Private' }],       menuItems: MENU_ITEMS },
      { id: 4, title: 'Marketing',           description: 'Campaign briefs, copy, and media assets.',   leading: <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><FolderOpen className="w-5 h-5 text-green-600 dark:text-green-400" /></div>, meta: [{ icon: <FolderOpen className="w-3.5 h-3.5" />, label: '89 files' },  { icon: <Globe className="w-3.5 h-3.5" />, label: 'Public' }],       menuItems: MENU_ITEMS },
      { id: 5, title: 'Product roadmap',     description: 'Quarterly OKRs, PRDs, and release plans.',   leading: <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"><FolderOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" /></div>, meta: [{ icon: <FolderOpen className="w-3.5 h-3.5" />, label: '14 files' },  { icon: <Lock className="w-3.5 h-3.5" />, label: 'Private' }],      menuItems: MENU_ITEMS },
      { id: 6, title: 'Customer research',   description: 'Interview recordings, survey results, and personas.', leading: <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><FolderOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" /></div>, meta: [{ icon: <FolderOpen className="w-3.5 h-3.5" />, label: '56 files' }, { icon: <Lock className="w-3.5 h-3.5" />, label: 'Private' }],      menuItems: MENU_ITEMS },
    ];
    return <GridList columns={3} items={items} />;
  },
};

// ── Custom renderItem ─────────────────────────────────────

export const CustomRenderItem: Story = {
  name: 'Custom renderItem — compact cards',
  args: { items: [] },
  render: () => (
    <GridList
      columns={3}
      items={PROJECTS}
      renderItem={(item) => (
        <div className="rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-sm p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {item.leading}
              <p className="font-semibold text-sm text-ink-900 dark:text-ink-50 truncate">{item.title}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {item.badge}
              {item.menuItems && item.menuItems.length > 0 && (
                <Menu
                  trigger={
                    <button aria-label={`More options for ${item.title}`} className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-ink-400 dark:text-ink-300 hover:text-ink-600 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors border-0 bg-transparent cursor-pointer">
                      <MoreVertical className="w-4 h-4" aria-hidden="true" />
                    </button>
                  }
                  items={item.menuItems}
                />
              )}
            </div>
          </div>
        </div>
      )}
    />
  ),
};
