import { expect, userEvent, within, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { ContainerList } from '../components/ContainerList';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Toggle } from '../components/Toggle';
import React from 'react';

function ControlledToggle({ defaultChecked }: { defaultChecked: boolean }) {
  const [checked, setChecked] = React.useState(defaultChecked);
  return <Toggle checked={checked} onChange={setChecked} />;
}

const meta = {
  title: 'Layout/ContainerList',
  component: ContainerList,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: { type: 'select', options: ['divided', 'bordered', 'cards', 'flush'] } },
    dividers: { control: 'boolean' },
    className: { control: 'text' },
    items: { control: false },
  },
} satisfies Meta<typeof ContainerList>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared item fixtures ──────────────────────────────────

const PEOPLE = [
  {
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    status: 'active' as const,
  },
  {
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'Co-Founder / CTO',
    status: 'active' as const,
  },
  {
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Business Relations',
    status: 'pending' as const,
  },
  {
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    role: 'Front-end Developer',
    status: 'active' as const,
  },
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    role: 'Director of Product',
    status: 'draft' as const,
  },
];

function PersonRow({ name, email, role, status }: (typeof PEOPLE)[0]) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <Avatar name={name} size={40} />
        <div className="min-w-0">
          <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 truncate">
            {name}
          </p>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 truncate">{email}</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-4 shrink-0">
        <span className="text-sm font-body text-ink-500 dark:text-ink-300">{role}</span>
        <Badge label={status.charAt(0).toUpperCase() + status.slice(1)} variant={status} />
      </div>
    </div>
  );
}

const PERSON_ITEMS = PEOPLE.map((p) => <PersonRow key={p.email} {...p} />);

const SETTING_ITEMS = [
  {
    label: 'Email notifications',
    description: 'Receive email digests for activity in your workspace.',
    defaultOn: true,
  },
  {
    label: 'Two-factor auth',
    description: 'Require a second factor when signing in.',
    defaultOn: false,
  },
  {
    label: 'Public profile',
    description: 'Allow others in the workspace to see your profile.',
    defaultOn: true,
  },
  {
    label: 'Marketing emails',
    description: 'Receive product updates, tips, and announcements.',
    defaultOn: false,
  },
].map(({ label, description, defaultOn }) => (
  <div key={label} className="flex items-center justify-between gap-6">
    <div className="min-w-0">
      <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">{label}</p>
      <p className="mt-0.5 text-xs font-body text-ink-500 dark:text-ink-300">{description}</p>
    </div>
    <ControlledToggle defaultChecked={defaultOn} />
  </div>
));

const ACTION_ITEMS = [
  {
    title: 'Export data',
    description: 'Download a CSV export of all your workspace data.',
    action: 'Export',
  },
  {
    title: 'Transfer ownership',
    description: 'Transfer ownership of this workspace to another member.',
    action: 'Transfer',
  },
  {
    title: 'Delete workspace',
    description: 'Permanently delete this workspace and all its data.',
    action: 'Delete',
    danger: true,
  },
].map(({ title, description, action, danger }) => (
  <div key={title} className="flex items-center justify-between gap-6">
    <div className="min-w-0">
      <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">{title}</p>
      <p className="mt-0.5 text-xs font-body text-ink-500 dark:text-ink-300">{description}</p>
    </div>
    <Button variant={danger ? 'danger' : 'secondary'} size="sm" className="shrink-0">
      {action}
    </Button>
  </div>
));

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'divided',
    dividers: true,
    items: PERSON_ITEMS,
  },
};

// ── Divided ───────────────────────────────────────────────

export const Divided: Story = {
  name: 'Divided — no outer border',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl">
      <ContainerList variant="divided" items={PERSON_ITEMS} />
    </div>
  ),
};

// ── Bordered ──────────────────────────────────────────────

export const Bordered: Story = {
  name: 'Bordered — single card',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl">
      <ContainerList variant="bordered" items={PERSON_ITEMS} />
    </div>
  ),
};

// ── Cards ─────────────────────────────────────────────────

export const Cards: Story = {
  name: 'Cards — individual cards',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl">
      <ContainerList variant="cards" items={PERSON_ITEMS} />
    </div>
  ),
};

// ── Flush ─────────────────────────────────────────────────

export const Flush: Story = {
  name: 'Flush — full-bleed inside card',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl">
      <ContainerList
        variant="flush"
        items={PEOPLE.map((p) => (
          <div key={p.email} className="flex items-center justify-between gap-3 px-4">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={p.name} size={32} />
              <div className="min-w-0">
                <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 truncate">
                  {p.name}
                </p>
                <p className="text-xs font-body text-ink-500 dark:text-ink-300 truncate">
                  {p.email}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <span className="text-sm font-body text-ink-500 dark:text-ink-300">{p.role}</span>
              <Badge
                label={p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                variant={p.status}
              />
            </div>
          </div>
        ))}
      />
    </div>
  ),
};

// ── No dividers ───────────────────────────────────────────

export const NoDividers: Story = {
  name: 'No dividers',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-8">
      {(['divided', 'bordered', 'flush'] as const).map((variant) => (
        <div key={variant}>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-3">
            variant="{variant}" dividers=false
          </p>
          <ContainerList variant={variant} dividers={false} items={PERSON_ITEMS.slice(0, 3)} />
        </div>
      ))}
    </div>
  ),
};

// ── Settings list ─────────────────────────────────────────

export const SettingsList: Story = {
  name: 'Settings list — toggles',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-3">divided</p>
        <ContainerList variant="divided" items={SETTING_ITEMS} />
      </div>
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-3">bordered</p>
        <ContainerList variant="bordered" items={SETTING_ITEMS} />
      </div>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    // The toggle renders without a labelled Switch.Label (label text is a plain <p>),
    // so we query all switches and use positional access. Index 0 = "Email notifications"
    // (defaultOn: true) in the first (divided) list section.
    await step('first toggle ("Email notifications") starts on', async () => {
      expect(canvas.getAllByRole('switch')[0]).toHaveAttribute('aria-checked', 'true');
    });
    await step('click it → turns off', async () => {
      await user.click(canvas.getAllByRole('switch')[0]);
      await waitFor(() =>
        expect(canvas.getAllByRole('switch')[0]).toHaveAttribute('aria-checked', 'false'),
      );
    });
    await step('click again → turns back on', async () => {
      await user.click(canvas.getAllByRole('switch')[0]);
      await waitFor(() =>
        expect(canvas.getAllByRole('switch')[0]).toHaveAttribute('aria-checked', 'true'),
      );
    });
  },
};

// ── Action rows ───────────────────────────────────────────

export const ActionRows: Story = {
  name: 'Action rows — buttons',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-3">divided</p>
        <ContainerList variant="divided" items={ACTION_ITEMS} />
      </div>
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-3">cards</p>
        <ContainerList variant="cards" items={ACTION_ITEMS} />
      </div>
    </div>
  ),
};

// ── All four variants ─────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  args: { items: [] },
  render: () => (
    <div className="max-w-2xl flex flex-col gap-10">
      {(['divided', 'bordered', 'cards', 'flush'] as const).map((variant) => (
        <div key={variant}>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-3">
            variant="{variant}"
          </p>
          <ContainerList
            variant={variant}
            items={
              variant === 'flush'
                ? PEOPLE.slice(0, 3).map((p) => (
                    <div key={p.email} className="flex items-center gap-3 px-4">
                      <Avatar name={p.name} size={32} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50 truncate">
                          {p.name}
                        </p>
                        <p className="text-xs font-body text-ink-500 dark:text-ink-300 truncate">
                          {p.role}
                        </p>
                      </div>
                    </div>
                  ))
                : PEOPLE.slice(0, 3).map((p) => <PersonRow key={p.email} {...p} />)
            }
          />
        </div>
      ))}
    </div>
  ),
};
