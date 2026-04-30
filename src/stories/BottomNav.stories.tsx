import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Home,
  Compass,
  Heart,
  User,
  Search,
  Bike,
  PalmtreeIcon,
  Tv2,
  ShoppingBag,
  MessageCircle,
  BookOpen,
} from 'lucide-react';
import { BottomNav } from '../components/BottomNav';

const meta = {
  title: 'Navigation/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    appearance: { control: 'select', options: ['light', 'dark'] },
    showLabels: { control: 'boolean' },
    fixed: { control: 'boolean' },
    activeValue: { control: 'text' },
  },
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared wrapper ────────────────────────────────────────

function Demo({
  children,
  dark,
  height = 'h-[500px]',
}: {
  children: React.ReactNode;
  dark?: boolean;
  height?: string;
}) {
  return (
    <div className={dark ? 'dark' : ''}>
      <div className={`relative ${height} overflow-hidden bg-ink-50 dark:bg-ink-900 flex flex-col`}>
        {/* Fake page content */}
        <div className="flex-1 p-4 space-y-3 overflow-hidden">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-10 rounded-xl bg-ink-200 dark:bg-ink-700/60" />
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Fixtures ──────────────────────────────────────────────

const TRAVEL_ITEMS = [
  { value: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { value: 'entertainment', label: 'Entertainment', icon: <Tv2 className="w-5 h-5" /> },
  { value: 'recreation', label: 'Recreation', icon: <Bike className="w-5 h-5" /> },
  { value: 'relaxation', label: 'Relaxation', icon: <PalmtreeIcon className="w-5 h-5" /> },
];

const APP_ITEMS = [
  { value: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { value: 'explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
  { value: 'messages', label: 'Messages', icon: <MessageCircle className="w-5 h-5" />, badge: 3 },
  { value: 'saved', label: 'Saved', icon: <Heart className="w-5 h-5" /> },
  { value: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
];

const SHOP_ITEMS = [
  { value: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { value: 'search', label: 'Search', icon: <Search className="w-5 h-5" /> },
  { value: 'shop', label: 'Shop', icon: <ShoppingBag className="w-5 h-5" />, badge: '12' },
  { value: 'library', label: 'Library', icon: <BookOpen className="w-5 h-5" /> },
  { value: 'account', label: 'Account', icon: <User className="w-5 h-5" /> },
];

// ── Playground ────────────────────────────────────────────

function PlaygroundDemo(args: React.ComponentProps<typeof BottomNav>) {
  const [active, setActive] = React.useState(args.activeValue ?? 'home');
  React.useEffect(() => setActive(args.activeValue ?? 'home'), [args.activeValue]);
  return (
    <Demo>
      <BottomNav
        {...args}
        items={TRAVEL_ITEMS}
        activeValue={active}
        onChange={setActive}
        fixed={false}
      />
    </Demo>
  );
}

export const Playground: Story = {
  args: {
    items: TRAVEL_ITEMS,
    activeValue: 'home',
    onChange: () => {},
    appearance: 'light',
    showLabels: true,
    fixed: false,
  },
  render: (args) => <PlaygroundDemo {...args} />,
};

// ── Light ─────────────────────────────────────────────────

function InteractiveDemo({
  items,
  appearance,
  dark,
}: {
  items: React.ComponentProps<typeof BottomNav>['items'];
  appearance: 'light' | 'dark';
  dark?: boolean;
}) {
  const [active, setActive] = React.useState(items[0].value);
  return (
    <Demo dark={dark}>
      <BottomNav
        items={items}
        activeValue={active}
        onChange={setActive}
        appearance={appearance}
        fixed={false}
      />
    </Demo>
  );
}

export const Light: Story = {
  name: 'Light',
  args: { items: TRAVEL_ITEMS, activeValue: 'home', onChange: () => {} },
  render: () => <InteractiveDemo items={TRAVEL_ITEMS} appearance="light" />,
};

export const Dark: Story = {
  name: 'Dark',
  args: { items: TRAVEL_ITEMS, activeValue: 'home', onChange: () => {} },
  render: () => <InteractiveDemo items={TRAVEL_ITEMS} appearance="dark" dark />,
};

// ── 5 items ───────────────────────────────────────────────

export const FiveItems: Story = {
  name: '5 items',
  args: { items: APP_ITEMS, activeValue: 'home', onChange: () => {} },
  render: () => <InteractiveDemo items={APP_ITEMS} appearance="light" />,
};

// ── With badges ───────────────────────────────────────────

export const WithBadges: Story = {
  name: 'With badges',
  args: { items: SHOP_ITEMS, activeValue: 'home', onChange: () => {} },
  render: () => <InteractiveDemo items={SHOP_ITEMS} appearance="light" />,
};

// ── Icons only ────────────────────────────────────────────

function IconsOnlyDemo() {
  const [active, setActive] = React.useState('home');
  return (
    <Demo>
      <BottomNav
        items={APP_ITEMS}
        activeValue={active}
        onChange={setActive}
        showLabels={false}
        fixed={false}
      />
    </Demo>
  );
}

export const IconsOnly: Story = {
  name: 'Icons only — no labels',
  args: { items: APP_ITEMS, activeValue: 'home', onChange: () => {} },
  render: () => <IconsOnlyDemo />,
};

// ── In page context ───────────────────────────────────────

function InPageDemo() {
  const [active, setActive] = React.useState('home');
  const labels: Record<string, string> = {
    home: 'Home',
    explore: 'Explore',
    messages: 'Messages',
    saved: 'Saved',
    profile: 'Profile',
  };
  return (
    <div className="relative h-[600px] bg-ink-50 overflow-hidden flex flex-col max-w-sm mx-auto border-x border-ink-200">
      {/* Page header */}
      <div className="bg-white border-b border-ink-200 px-4 py-3">
        <h1 className="text-base font-semibold font-display text-ink-900 capitalize">
          {labels[active]}
        </h1>
      </div>
      {/* Page content */}
      <div className="flex-1 p-4 space-y-3 overflow-hidden">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="h-10 rounded-xl bg-ink-200" />
        ))}
      </div>
      {/* Bottom nav */}
      <BottomNav items={APP_ITEMS} activeValue={active} onChange={setActive} fixed={false} />
    </div>
  );
}

export const InPage: Story = {
  name: 'In page context',
  args: { items: APP_ITEMS, activeValue: 'home', onChange: () => {} },
  render: () => <InPageDemo />,
};
