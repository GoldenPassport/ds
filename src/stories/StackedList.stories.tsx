import type { Meta, StoryObj } from '@storybook/react';
import { ChevronRight, MoreVertical } from 'lucide-react';
import { StackedList, type StackedListItem } from '../components/StackedList';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Menu } from '../components/Menu';

const meta = {
  title: 'Lists/Stacked Lists',
  component: StackedList,
  tags: ['autodocs'],
  argTypes: {
    divided:     { control: 'boolean', description: 'Horizontal divider lines between rows' },
    bordered:    { control: 'boolean', description: 'Wraps the list in a bordered card' },
    showLeading: { control: 'boolean', description: 'Show or hide the leading avatar/icon slot' },
    renderItem:  { control: false },
    className:   { control: 'text' },
  },
} satisfies Meta<typeof StackedList>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared data ───────────────────────────────────────────

const PEOPLE: StackedListItem[] = [
  {
    id: 1,
    title: 'Leslie Alexander',
    subtitle: 'leslie.alexander@example.com',
    leading: (
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt="Leslie Alexander"
        className="w-10 h-10 rounded-full object-cover"
      />
    ),
    trailing: 'Co-Founder / CEO',
    trailingMeta: (
      <span>Last seen <time dateTime="2023-01-23T13:23Z">3h ago</time></span>
    ),
  },
  {
    id: 2,
    title: 'Michael Foster',
    subtitle: 'michael.foster@example.com',
    leading: (
      <img
        src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt="Michael Foster"
        className="w-10 h-10 rounded-full object-cover"
      />
    ),
    trailing: 'Co-Founder / CTO',
    trailingMeta: (
      <span>Last seen <time dateTime="2023-01-23T13:23Z">3h ago</time></span>
    ),
  },
  {
    id: 3,
    title: 'Dries Vincent',
    subtitle: 'dries.vincent@example.com',
    leading: (
      <img
        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt="Dries Vincent"
        className="w-10 h-10 rounded-full object-cover"
      />
    ),
    trailing: 'Business Relations',
    trailingMeta: (
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Online
      </span>
    ),
  },
  {
    id: 4,
    title: 'Lindsay Walton',
    subtitle: 'lindsay.walton@example.com',
    leading: (
      <img
        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt="Lindsay Walton"
        className="w-10 h-10 rounded-full object-cover"
      />
    ),
    trailing: 'Front-end Developer',
    trailingMeta: (
      <span>Last seen <time dateTime="2023-01-23T13:23Z">3h ago</time></span>
    ),
  },
  {
    id: 5,
    title: 'Tom Cook',
    subtitle: 'tom.cook@example.com',
    leading: (
      <img
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt="Tom Cook"
        className="w-10 h-10 rounded-full object-cover"
      />
    ),
    trailing: 'Director of Product',
    trailingMeta: (
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Online
      </span>
    ),
  },
];

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    items:       PEOPLE,
    divided:     true,
    bordered:    false,
    showLeading: true,
  },
};

// ── Simple with avatars ───────────────────────────────────

export const WithAvatars: Story = {
  name: 'With avatars',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl">
      <StackedList items={PEOPLE} />
    </div>
  ),
};

// ── Bordered card ─────────────────────────────────────────

export const Bordered: Story = {
  name: 'Bordered card',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl">
      <StackedList items={PEOPLE} bordered />
    </div>
  ),
};

// ── Initials avatars ──────────────────────────────────────

export const InitialsAvatars: Story = {
  name: 'Initials avatars',
  args: { items: [] },
  render: () => {
    const items: StackedListItem[] = [
      { id: 1, title: 'Leslie Alexander',  subtitle: 'leslie.alexander@example.com',  leading: <Avatar name="Leslie Alexander" size={40} />,  trailing: 'Co-Founder / CEO',     trailingMeta: 'Last seen 3h ago' },
      { id: 2, title: 'Michael Foster',    subtitle: 'michael.foster@example.com',    leading: <Avatar name="Michael Foster" size={40} />,    trailing: 'Co-Founder / CTO',     trailingMeta: 'Last seen 3h ago' },
      { id: 3, title: 'Dries Vincent',     subtitle: 'dries.vincent@example.com',     leading: <Avatar name="Dries Vincent" size={40} />,     trailing: 'Business Relations',   trailingMeta: 'Last seen 1d ago' },
      { id: 4, title: 'Lindsay Walton',    subtitle: 'lindsay.walton@example.com',    leading: <Avatar name="Lindsay Walton" size={40} />,    trailing: 'Front-end Developer',  trailingMeta: 'Last seen 2h ago' },
      { id: 5, title: 'Tom Cook',          subtitle: 'tom.cook@example.com',          leading: <Avatar name="Tom Cook" size={40} />,          trailing: 'Director of Product',  trailingMeta: 'Last seen 5h ago' },
    ];
    return <div className="max-w-2xl"><StackedList items={items} bordered /></div>;
  },
};

// ── With badges ───────────────────────────────────────────

export const WithBadges: Story = {
  name: 'With badges',
  args: { items: [] },
  render: () => {
    const items: StackedListItem[] = [
      { id: 1, title: 'Onboarding flow',        subtitle: 'Updated 2 hours ago',     leading: <Avatar name="Leslie Alexander" size={36} />, trailing: <Badge label="Active"  variant="active"  />, trailingMeta: '3,421 runs' },
      { id: 2, title: 'Weekly digest email',     subtitle: 'Updated yesterday',       leading: <Avatar name="Michael Foster" size={36} />,   trailing: <Badge label="Running" variant="running" />, trailingMeta: '1,204 runs' },
      { id: 3, title: 'Churn prediction model',  subtitle: 'Updated 3 days ago',      leading: <Avatar name="Dries Vincent" size={36} />,    trailing: <Badge label="Draft"   variant="draft"   />, trailingMeta: '0 runs'     },
      { id: 4, title: 'Payment retry logic',     subtitle: 'Updated last week',       leading: <Avatar name="Lindsay Walton" size={36} />,   trailing: <Badge label="Failed"  variant="failed"  />, trailingMeta: '892 runs'   },
      { id: 5, title: 'Renewal reminder series', subtitle: 'Updated 2 weeks ago',     leading: <Avatar name="Tom Cook" size={36} />,         trailing: <Badge label="Pending" variant="pending" />, trailingMeta: '45 runs'    },
    ];
    return <div className="max-w-2xl"><StackedList items={items} bordered /></div>;
  },
};

// ── Clickable rows ────────────────────────────────────────

export const Clickable: Story = {
  name: 'Clickable rows',
  args: { items: [] },
  render: () => {
    const items: StackedListItem[] = PEOPLE.map(p => ({
      ...p,
      onClick: () => alert(`Clicked: ${p.title}`),
    }));
    return (
      <div className="max-w-2xl">
        <StackedList items={items} bordered />
      </div>
    );
  },
};

// ── With chevron links ────────────────────────────────────

export const WithChevronLinks: Story = {
  name: 'With chevron links',
  args: { items: [] },
  render: () => {
    const items: StackedListItem[] = [
      { id: 1, title: 'Profile settings',        subtitle: 'Update your name, photo, and personal details',     leading: <Avatar name="Profile Settings" size={36} />,      href: '#', trailingMeta: <ChevronRight className="w-4 h-4 text-ink-300 dark:text-ink-600" /> },
      { id: 2, title: 'Notifications',            subtitle: 'Choose what you are notified about',                leading: <Avatar name="Notifications" size={36} />,          href: '#', trailingMeta: <ChevronRight className="w-4 h-4 text-ink-300 dark:text-ink-600" /> },
      { id: 3, title: 'Security',                 subtitle: 'Manage your password and two-factor authentication', leading: <Avatar name="Security Settings" size={36} />,      href: '#', trailingMeta: <ChevronRight className="w-4 h-4 text-ink-300 dark:text-ink-600" /> },
      { id: 4, title: 'Billing',                  subtitle: 'Manage your plan and payment methods',               leading: <Avatar name="Billing Settings" size={36} />,       href: '#', trailingMeta: <ChevronRight className="w-4 h-4 text-ink-300 dark:text-ink-600" /> },
    ];
    return (
      <div className="max-w-2xl">
        <StackedList items={items} bordered />
      </div>
    );
  },
};

// ── Custom renderItem ─────────────────────────────────────

export const CustomRenderItem: Story = {
  name: 'Custom renderItem — with action menu',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl">
      <StackedList
        items={PEOPLE}
        bordered
        renderItem={(item) => (
          <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4 min-w-0">
              {item.leading}
              <div className="min-w-0">
                <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 truncate">{item.title}</p>
                <p className="mt-0.5 text-xs font-body text-ink-500 dark:text-ink-400 truncate">{item.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:block text-sm font-body text-ink-500 dark:text-ink-400">{item.trailing}</span>
              <Menu
                trigger={
                  <button className="p-1 rounded text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                }
                items={[
                  { label: 'View profile',   onClick: () => {} },
                  { label: 'Send message',   onClick: () => {} },
                  { label: 'Remove member',  onClick: () => {}, destructive: true, dividerAbove: true },
                ]}
              />
            </div>
          </div>
        )}
      />
    </div>
  ),
};

// ── Simple — no avatars ───────────────────────────────────

export const Simple: Story = {
  name: 'Simple — no leading',
  args: { items: [] },
  render: () => {
    const items: StackedListItem[] = [
      { id: 1, title: 'GraphQL API',           subtitle: 'Last deployed 2 hours ago',   trailing: <Badge label="Active"  variant="active"  /> },
      { id: 2, title: 'REST API v2',            subtitle: 'Last deployed yesterday',     trailing: <Badge label="Active"  variant="active"  /> },
      { id: 3, title: 'Webhook receiver',       subtitle: 'Last deployed 3 days ago',   trailing: <Badge label="Running" variant="running" /> },
      { id: 4, title: 'Background job worker',  subtitle: 'Last deployed last week',    trailing: <Badge label="Failed"  variant="failed"  /> },
      { id: 5, title: 'Scheduled report mailer',subtitle: 'Never deployed',             trailing: <Badge label="Draft"   variant="draft"   /> },
    ];
    return (
      <div className="max-w-2xl">
        <StackedList items={items} bordered />
      </div>
    );
  },
};

// ── Undivided ─────────────────────────────────────────────

export const Undivided: Story = {
  name: 'Undivided',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl">
      <StackedList items={PEOPLE} divided={false} />
    </div>
  ),
};
