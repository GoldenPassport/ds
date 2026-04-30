import type { Meta, StoryObj } from '@storybook/react';
import { Plus, Download, Settings } from 'lucide-react';
import { ListCard } from '../components/ListCard';
import { DataTable } from '../components/DataTable';
import { StackedList, type StackedListItem } from '../components/StackedList';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Layout/ListCard',
  component: ListCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    primaryAction: { control: false },
    menuItems: { control: false },
    list: { control: false, description: 'ReactNode rendered on mobile (below sm)' },
    table: {
      control: false,
      description:
        'ReactNode rendered on desktop (sm+). Pass <DataTable flat /> to skip its own card.',
    },
    className: { control: 'text' },
  },
} satisfies Meta<typeof ListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared fixtures ────────────────────────────────────────

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'draft';
};

const USERS: User[] = [
  {
    id: 1,
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    status: 'active',
  },
  {
    id: 2,
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'Co-Founder / CTO',
    status: 'active',
  },
  {
    id: 3,
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Business Relations',
    status: 'pending',
  },
  {
    id: 4,
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    role: 'Front-end Developer',
    status: 'active',
  },
  {
    id: 5,
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    role: 'Designer',
    status: 'active',
  },
  {
    id: 6,
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    role: 'Director of Product',
    status: 'draft',
  },
];

const TABLE_COLUMNS = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    render: (row: User) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.name} size={32} />
        <div>
          <div className="font-semibold text-ink-900 dark:text-ink-50 text-sm">{row.name}</div>
          <div className="text-xs text-ink-500 dark:text-ink-300 mt-0.5">{row.email}</div>
        </div>
      </div>
    ),
  },
  { key: 'role', header: 'Role', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (row: User) => (
      <Badge
        label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        variant={row.status as 'active' | 'pending' | 'draft'}
      />
    ),
  },
];

const LIST_ITEMS: StackedListItem[] = USERS.map((u) => ({
  id: u.id,
  title: u.name,
  subtitle: u.email,
  leading: <Avatar name={u.name} size={36} />,
  trailing: (
    <Badge
      label={u.status.charAt(0).toUpperCase() + u.status.slice(1)}
      variant={u.status as 'active' | 'pending' | 'draft'}
    />
  ),
  trailingMeta: u.role,
}));

const MENU_ITEMS = [
  { label: 'Export CSV', onClick: () => {} },
  { label: 'Import users', onClick: () => {} },
  { label: 'Delete all', onClick: () => {}, destructive: true, dividerAbove: true },
];

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    title: 'Users',
    subtitle:
      'A list of all the users in your account including their name, title, email and role.',
    primaryAction: { label: 'Add user', onClick: () => {}, icon: <Plus className="w-3.5 h-3.5" /> },
  },
  render: (args) => (
    <ListCard
      {...args}
      table={<DataTable flat columns={TABLE_COLUMNS} data={USERS} />}
      list={<StackedList items={LIST_ITEMS} />}
    />
  ),
};

// ── Responsive — primary + menu ───────────────────────────

export const Responsive: Story = {
  name: 'Responsive — resize below 640px to see list',
  args: { title: '' },
  render: () => (
    <ListCard
      title="Users"
      subtitle="A list of all the users in your account including their name, title, email and role."
      primaryAction={{
        label: 'Add user',
        onClick: () => {},
        icon: <Plus className="w-3.5 h-3.5" />,
      }}
      menuItems={MENU_ITEMS}
      table={<DataTable flat columns={TABLE_COLUMNS} data={USERS} />}
      list={<StackedList items={LIST_ITEMS} />}
    />
  ),
};

// ── Menu only header ──────────────────────────────────────

export const MenuOnly: Story = {
  name: 'Menu only header',
  args: { title: '' },
  render: () => (
    <ListCard
      title="Team members"
      subtitle="People with access to this workspace."
      menuItems={MENU_ITEMS}
      table={<DataTable flat columns={TABLE_COLUMNS} data={USERS} />}
      list={<StackedList items={LIST_ITEMS} />}
    />
  ),
};

// ── No header ─────────────────────────────────────────────

export const NoHeader: Story = {
  name: 'No header',
  args: { title: '' },
  render: () => (
    <ListCard
      table={<DataTable flat columns={TABLE_COLUMNS} data={USERS} />}
      list={<StackedList items={LIST_ITEMS} />}
    />
  ),
};

// ── Table only ────────────────────────────────────────────

export const TableOnly: Story = {
  name: 'Table only (no list slot)',
  args: { title: '' },
  render: () => (
    <ListCard
      title="Workflows"
      subtitle="All automation workflows in your workspace."
      primaryAction={{
        label: 'New workflow',
        onClick: () => {},
        icon: <Plus className="w-3.5 h-3.5" />,
      }}
      menuItems={[
        { label: 'Export', onClick: () => {}, icon: <Download className="w-4 h-4" /> },
        { label: 'Settings', onClick: () => {}, icon: <Settings className="w-4 h-4" /> },
      ]}
      table={<DataTable flat columns={TABLE_COLUMNS} data={USERS} />}
    />
  ),
};

// ── With pagination ───────────────────────────────────────

export const WithPagination: Story = {
  name: 'With pagination',
  args: { title: '' },
  render: () => (
    <ListCard
      title="Users"
      subtitle="A list of all the users in your account."
      primaryAction={{ label: 'Add user', onClick: () => {} }}
      table={<DataTable flat columns={TABLE_COLUMNS} data={USERS} pagination={{ pageSize: 4 }} />}
      list={<StackedList items={LIST_ITEMS} />}
    />
  ),
};
