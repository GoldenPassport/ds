import { expect, userEvent, within, waitFor } from 'storybook/test';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Plus, FolderOpen, Users, FileText, Search, Inbox, GitBranch } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false },
    primaryAction: { control: false },
    secondaryAction: { control: false },
    bordered: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    icon: <FolderOpen className="w-12 h-12" />,
    title: 'No projects',
    description: 'Get started by creating your first project.',
    primaryAction: {
      label: 'New project',
      onClick: () => {},
      icon: <Plus className="w-3.5 h-3.5" />,
    },
    secondaryAction: { label: 'Learn more', onClick: () => {} },
    bordered: false,
  },
  render: () => {
    const [clicked, setClicked] = React.useState<string | null>(null);
    return (
      <div className="flex flex-col items-start gap-3">
        <EmptyState
          icon={<FolderOpen className="w-12 h-12" />}
          title="No projects"
          description="Get started by creating your first project."
          primaryAction={{
            label: 'New project',
            onClick: () => setClicked('primary'),
            icon: <Plus className="w-3.5 h-3.5" />,
          }}
          secondaryAction={{ label: 'Learn more', onClick: () => setClicked('secondary') }}
        />
        {clicked && <span data-testid="clicked" className="text-xs font-body text-ink-500 dark:text-ink-300">{clicked}</span>}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('click primary action → callback fires', async () => {
      await user.click(canvas.getByRole('button', { name: /new project/i }));
      await waitFor(() => expect(canvas.getByTestId('clicked')).toHaveTextContent('primary'));
    });
    await step('click secondary action → callback fires', async () => {
      await user.click(canvas.getByRole('button', { name: /learn more/i }));
      await waitFor(() => expect(canvas.getByTestId('clicked')).toHaveTextContent('secondary'));
    });
  },
};

// ── Simple ────────────────────────────────────────────────

export const Simple: Story = {
  name: 'Simple — title and action only',
  args: { title: '' },
  render: () => (
    <div className="flex flex-col gap-8 max-w-lg">
      <EmptyState
        title="No projects yet"
        primaryAction={{
          label: 'New project',
          onClick: () => {},
          icon: <Plus className="w-3.5 h-3.5" />,
        }}
      />
      <EmptyState
        title="No team members"
        primaryAction={{
          label: 'Invite member',
          onClick: () => {},
          icon: <Plus className="w-3.5 h-3.5" />,
        }}
      />
    </div>
  ),
};

// ── With icon ─────────────────────────────────────────────

export const WithIcon: Story = {
  name: 'With icon',
  args: { title: '' },
  render: () => (
    <div className="flex flex-col gap-4 max-w-lg">
      <EmptyState
        icon={<FolderOpen className="w-12 h-12" />}
        title="No projects"
        description="Get started by creating your first project."
        primaryAction={{
          label: 'New project',
          onClick: () => {},
          icon: <Plus className="w-3.5 h-3.5" />,
        }}
      />
      <EmptyState
        icon={<Users className="w-12 h-12" />}
        title="No team members"
        description="Invite colleagues to collaborate on this workspace."
        primaryAction={{
          label: 'Invite member',
          onClick: () => {},
          icon: <Plus className="w-3.5 h-3.5" />,
        }}
        secondaryAction={{ label: 'Learn about roles', onClick: () => {} }}
      />
      <EmptyState
        icon={<FileText className="w-12 h-12" />}
        title="No documents"
        description="Create or upload a document to get started."
        primaryAction={{
          label: 'New document',
          onClick: () => {},
          icon: <Plus className="w-3.5 h-3.5" />,
        }}
        secondaryAction={{ label: 'Upload file', onClick: () => {} }}
      />
    </div>
  ),
};

// ── Bordered ──────────────────────────────────────────────

export const Bordered: Story = {
  name: 'Bordered — dashed outline',
  args: { title: '' },
  render: () => (
    <div className="flex flex-col gap-6 max-w-2xl">
      <EmptyState
        icon={<FolderOpen className="w-12 h-12" />}
        title="No projects"
        description="Get started by creating your first project."
        primaryAction={{
          label: 'New project',
          onClick: () => {},
          icon: <Plus className="w-3.5 h-3.5" />,
        }}
        bordered
      />
      <EmptyState
        icon={<GitBranch className="w-12 h-12" />}
        title="No branches"
        description="Push a branch or create one from the dashboard."
        bordered
      />
    </div>
  ),
};

// ── No icon ───────────────────────────────────────────────

export const NoIcon: Story = {
  name: 'No icon — text only',
  args: { title: '' },
  render: () => (
    <div className="max-w-lg">
      <EmptyState
        title="No results found"
        description="Try adjusting your search or filters to find what you're looking for."
        primaryAction={{ label: 'Clear filters', onClick: () => {} }}
        secondaryAction={{ label: 'Browse all', onClick: () => {} }}
        bordered
      />
    </div>
  ),
};

// ── Search empty state ────────────────────────────────────

export const SearchEmpty: Story = {
  name: 'Search — no results',
  args: { title: '' },
  render: () => (
    <div className="max-w-lg">
      <EmptyState
        icon={<Search className="w-12 h-12" />}
        title={'No results for \u201conboarding\u201d'}
        description="We couldn't find anything matching your search. Try different keywords or check for typos."
        secondaryAction={{ label: 'Clear search', onClick: () => {} }}
        bordered
      />
    </div>
  ),
};

// ── Inbox empty state ─────────────────────────────────────

export const InboxEmpty: Story = {
  name: 'Inbox — all caught up',
  args: { title: '' },
  render: () => (
    <div className="max-w-lg">
      <EmptyState
        icon={<Inbox className="w-12 h-12" />}
        title="You're all caught up"
        description="No new notifications right now. We'll let you know when something needs your attention."
      />
    </div>
  ),
};

// ── In context — inside a ListCard ───────────────────────

export const InContext: Story = {
  name: 'In context — inside a card',
  args: { title: '' },
  render: () => (
    <div className="max-w-2xl rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-ink-100 dark:border-ink-700">
        <h2 className="text-base font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight">
          Projects
        </h2>
        <p className="mt-0.5 text-sm font-body text-ink-500 dark:text-ink-300">
          All projects in your workspace.
        </p>
      </div>
      <EmptyState
        icon={<FolderOpen className="w-12 h-12" />}
        title="No projects yet"
        description="Create your first project to start collaborating with your team."
        primaryAction={{
          label: 'New project',
          onClick: () => {},
          icon: <Plus className="w-3.5 h-3.5" />,
        }}
      />
    </div>
  ),
};
