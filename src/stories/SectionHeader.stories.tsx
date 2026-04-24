import type { Meta, StoryObj } from '@storybook/react';
import { Plus, Download, Settings } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { StackedList } from '../components/StackedList';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Headings/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
  argTypes: {
    title:         { control: 'text' },
    subtitle:      { control: 'text' },
    primaryAction: { control: false, description: '{ label, onClick, icon?, variant? }' },
    menuItems:     { control: false, description: 'MenuItem[] — renders a ⋮ menu button' },
    className:     { control: 'text' },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const MENU_ITEMS = [
  { label: 'Export CSV',    onClick: () => {} },
  { label: 'Import',        onClick: () => {} },
  { label: 'Delete all',    onClick: () => {}, destructive: true, dividerAbove: true },
];

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    title:    'Users',
    subtitle: 'A list of all the users in your account including their name, title, email and role.',
    primaryAction: { label: 'Add user', onClick: () => {} },
  },
};

// ── Single action ─────────────────────────────────────────

export const SingleAction: Story = {
  name: 'Single action',
  args: { title: '' },
  render: () => (
    <div className="max-w-3xl flex flex-col gap-6">
      <SectionHeader
        title="Users"
        subtitle="A list of all the users in your account including their name, title, email and role."
        primaryAction={{ label: 'Add user', onClick: () => {}, icon: <Plus className="w-3.5 h-3.5" /> }}
      />
      <SectionHeader
        title="Workflows"
        subtitle="All automation workflows in your workspace."
        primaryAction={{ label: 'New workflow', onClick: () => {}, icon: <Plus className="w-3.5 h-3.5" /> }}
      />
      <SectionHeader
        title="Reports"
        primaryAction={{ label: 'Download', onClick: () => {}, icon: <Download className="w-3.5 h-3.5" />, variant: 'secondary' }}
      />
    </div>
  ),
};

// ── Menu only ─────────────────────────────────────────────

export const MenuOnly: Story = {
  name: 'Menu only',
  args: { title: '' },
  render: () => (
    <div className="max-w-3xl flex flex-col gap-6">
      <SectionHeader
        title="Billing history"
        subtitle="Download your past invoices and receipts."
        menuItems={MENU_ITEMS}
      />
      <SectionHeader
        title="API keys"
        subtitle="Manage the API keys used to access your account."
        menuItems={[
          { label: 'Refresh',     onClick: () => {} },
          { label: 'Revoke all',  onClick: () => {}, destructive: true, dividerAbove: true },
        ]}
      />
    </div>
  ),
};

// ── Primary action + menu ─────────────────────────────────

export const PrimaryAndMenu: Story = {
  name: 'Primary action + ⋮ menu',
  args: { title: '' },
  render: () => (
    <div className="max-w-3xl flex flex-col gap-6">
      <SectionHeader
        title="Users"
        subtitle="A list of all the users in your account including their name, title, email and role."
        primaryAction={{ label: 'Add user', onClick: () => {}, icon: <Plus className="w-3.5 h-3.5" /> }}
        menuItems={MENU_ITEMS}
      />
      <SectionHeader
        title="Workflows"
        primaryAction={{ label: 'New workflow', onClick: () => {}, icon: <Plus className="w-3.5 h-3.5" /> }}
        menuItems={[
          { label: 'Import',   onClick: () => {} },
          { label: 'Settings', onClick: () => {}, icon: <Settings className="w-4 h-4" /> },
        ]}
      />
    </div>
  ),
};

// ── Title only ────────────────────────────────────────────

export const TitleOnly: Story = {
  name: 'Title only',
  args: { title: '' },
  render: () => (
    <div className="max-w-3xl flex flex-col gap-6">
      <SectionHeader title="Recent activity" />
      <SectionHeader title="Team members" subtitle="People with access to this workspace." />
    </div>
  ),
};

// ── In context ────────────────────────────────────────────

export const InContext: Story = {
  name: 'In context — above a list',
  args: { title: '' },
  render: () => {
    const items = [
      { id: 1, title: 'Leslie Alexander',  subtitle: 'leslie.alexander@example.com',  leading: <Avatar name="Leslie Alexander" size={36} />,  trailing: <Badge label="Active"  variant="active"  /> },
      { id: 2, title: 'Michael Foster',    subtitle: 'michael.foster@example.com',    leading: <Avatar name="Michael Foster" size={36} />,    trailing: <Badge label="Active"  variant="active"  /> },
      { id: 3, title: 'Dries Vincent',     subtitle: 'dries.vincent@example.com',     leading: <Avatar name="Dries Vincent" size={36} />,     trailing: <Badge label="Pending" variant="pending" /> },
      { id: 4, title: 'Lindsay Walton',    subtitle: 'lindsay.walton@example.com',    leading: <Avatar name="Lindsay Walton" size={36} />,    trailing: <Badge label="Active"  variant="active"  /> },
    ];
    return (
      <div className="max-w-2xl flex flex-col gap-4">
        <SectionHeader
          title="Team members"
          subtitle="Manage who has access to this workspace."
          primaryAction={{ label: 'Invite member', onClick: () => {}, icon: <Plus className="w-3.5 h-3.5" /> }}
          menuItems={MENU_ITEMS}
        />
        <StackedList items={items} bordered />
      </div>
    );
  },
};
