import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { SearchSet } from '../components/SearchSet';
import type {
  SearchSetFilterDef,
  SearchSetFilterValues,
  SearchSetTag,
} from '../components/SearchSet';
import { Card } from '../components/Card';
import { Pagination } from '../components/Pagination';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Forms/SearchSet',
  component: SearchSet,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    value: { control: 'text' },
    debounce: { control: 'number' },
    loading: { control: 'boolean' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof SearchSet>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

const PLAYGROUND_FILTER_DEFS: SearchSetFilterDef[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'failed', label: 'Failed' },
    ],
  },
  {
    key: 'role',
    label: 'Role',
    type: 'multi',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'viewer', label: 'Viewer' },
    ],
  },
  {
    key: 'verified',
    label: 'Verified only',
    type: 'toggle',
  },
];

export const Playground: Story = {
  args: {
    value: '',
    onChange: () => {},
    loading: false,
    placeholder: 'Search…',
    label: '',
  },
  render: (args) => {
    const [query, setQuery] = useState(args.value);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(25);
    const [filters, setFilters] = useState<SearchSetFilterValues>({
      status: '',
      role: [],
      verified: false,
    });
    const total = 142;
    return (
      <div className="max-w-lg flex flex-col gap-3">
        <SearchSet
          {...args}
          value={query}
          onChange={setQuery}
          filterDefs={PLAYGROUND_FILTER_DEFS}
          filterValues={filters}
          onFilterChange={(f) => {
            setFilters(f);
            setPage(1);
          }}
          filterTitle="Filters"
        />
        <Pagination
          page={page}
          pageSize={size}
          total={total}
          onChange={(p, s) => {
            setPage(p);
            setSize(s);
          }}
          showSummary
        />
        {query && (
          <p className="text-xs font-body text-ink-500 dark:text-ink-300">
            Server would receive:{' '}
            <code className="text-ink-700 dark:text-ink-200">query="{query}"</code>
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('type a query → "Server would receive" output appears', async () => {
      const input = canvas.getByRole('searchbox');
      await user.click(input);
      await user.type(input, 'invoice');
      await waitFor(() => expect(canvas.getByText(/server would receive/i)).toBeVisible());
    });

    await step('click clear → query and output both gone', async () => {
      await user.click(canvas.getByRole('button', { name: /clear search/i }));
      await waitFor(() =>
        expect(canvas.queryByText(/server would receive/i)).not.toBeInTheDocument(),
      );
    });

    await step('open InfoPopover → keyboard help content appears', async () => {
      await user.click(canvas.getByRole('button', { name: /search tag help/i }));
      await waitFor(() => expect(canvas.getByText(/search tags/i)).toBeVisible());
    });

    await step('click elsewhere → InfoPopover closes', async () => {
      await user.click(canvas.getByRole('searchbox'));
      await waitFor(() => expect(canvas.queryByText(/search tags/i)).not.toBeInTheDocument());
    });
  },
};

// ── Placement ─────────────────────────────────────────────

export const Placement: Story = {
  name: 'Naked vs in Card',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [q1, setQ1] = useState('');
    const [q2, setQ2] = useState('');
    return (
      <div className="max-w-lg flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wide mb-2">
            Naked
          </p>
          <SearchSet value={q1} onChange={setQ1} placeholder="Search users…" />
        </div>
        <div>
          <p className="text-xs font-semibold font-body text-ink-500 dark:text-ink-300 uppercase tracking-wide mb-2">
            Inside a Card
          </p>
          <Card padding="md">
            <SearchSet value={q2} onChange={setQ2} placeholder="Search users…" />
          </Card>
        </div>
      </div>
    );
  },
};

// ── With results ──────────────────────────────────────────

export const WithResults: Story = {
  name: 'With results',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(25);
    return (
      <div className="max-w-lg flex flex-col gap-3">
        <SearchSet value={q} onChange={setQ} placeholder="Search deployments…" />
        <Pagination
          page={page}
          pageSize={size}
          total={284}
          onChange={(p, s) => {
            setPage(p);
            setSize(s);
          }}
          showSummary
        />
      </div>
    );
  },
};

// ── No results ────────────────────────────────────────────

export const NoResults: Story = {
  name: 'No results',
  args: { value: '', onChange: () => {} },
  render: () => (
    <div className="max-w-lg flex flex-col gap-3">
      <SearchSet value="xyzzy" onChange={() => {}} placeholder="Search…" />
      <Pagination
        page={1}
        pageSize={25}
        total={0}
        onChange={() => {}}
        pageSizeOptions={[]}
        showSummary
      />
    </div>
  ),
};

// ── Loading ───────────────────────────────────────────────

export const Loading: Story = {
  name: 'Loading',
  args: { value: '', onChange: () => {} },
  render: () => (
    <div className="max-w-lg">
      <SearchSet value="invoice" onChange={() => {}} placeholder="Search…" loading />
    </div>
  ),
};

// ── With filter chips slot ────────────────────────────────

export const WithFilters: Story = {
  name: 'With filter chips',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(25);
    const [status, setStatus] = useState<string | null>('active');

    const statusOptions = ['active', 'pending', 'failed'] as const;

    return (
      <div className="max-w-lg flex flex-col gap-3">
        <SearchSet
          value={q}
          onChange={setQ}
          placeholder="Search workflows…"
          filters={
            <>
              {statusOptions.map((s) => (
                <button key={s} type="button" onClick={() => setStatus(s === status ? null : s)}>
                  <Badge
                    label={s.charAt(0).toUpperCase() + s.slice(1)}
                    variant={s as 'active' | 'pending' | 'failed'}
                    outlined={status !== s}
                    dot={false}
                    size="sm"
                  />
                </button>
              ))}
            </>
          }
        />
        <Pagination
          page={page}
          pageSize={size}
          total={58}
          onChange={(p, s) => {
            setPage(p);
            setSize(s);
          }}
          showSummary
        />
      </div>
    );
  },
};

// ── With filter dialog ────────────────────────────────────

const FILTER_DEFS: SearchSetFilterDef[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'failed', label: 'Failed' },
      { value: 'draft', label: 'Draft' },
    ],
  },
  {
    key: 'role',
    label: 'Role',
    type: 'multi',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'viewer', label: 'Viewer' },
    ],
  },
  {
    key: 'verified',
    label: 'Verified only',
    type: 'toggle',
  },
];

const EMPTY_FILTERS: SearchSetFilterValues = {
  status: '',
  role: [],
  verified: false,
};

export const WithFilterDialog: Story = {
  name: 'With filter dialog',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(25);
    const [filters, setFilters] = useState<SearchSetFilterValues>(EMPTY_FILTERS);

    const activeChips = [
      ...(filters.status ? [{ key: 'status', label: String(filters.status) }] : []),
      ...(filters.role as string[]).map((r) => ({ key: `role:${r}`, label: r })),
      ...(filters.verified ? [{ key: 'verified', label: 'Verified' }] : []),
    ];

    return (
      <div className="max-w-lg flex flex-col gap-3">
        <SearchSet
          value={query}
          onChange={setQuery}
          placeholder="Search workflows…"
          filterDefs={FILTER_DEFS}
          filterValues={filters}
          onFilterChange={(f) => {
            setFilters(f);
            setPage(1);
          }}
          filterTitle="Filter workflows"
          filters={
            activeChips.length > 0 ? (
              <>
                {activeChips.map((c) => (
                  <Badge
                    key={c.key}
                    label={c.label}
                    variant="neutral"
                    size="sm"
                    dot={false}
                    outlined
                    onRemove={() => {
                      if (c.key === 'status') setFilters((f) => ({ ...f, status: '' }));
                      else if (c.key === 'verified') setFilters((f) => ({ ...f, verified: false }));
                      else
                        setFilters((f) => ({
                          ...f,
                          role: (f.role as string[]).filter((r) => `role:${r}` !== c.key),
                        }));
                    }}
                  />
                ))}
              </>
            ) : undefined
          }
        />
        <Pagination
          page={page}
          pageSize={size}
          total={142}
          onChange={(p, s) => {
            setPage(p);
            setSize(s);
          }}
          showSummary
        />
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const user = userEvent.setup();

    await step('open the filter dialog', async () => {
      await user.click(canvas.getByRole('button', { name: /open filters/i }));
      await waitFor(() => expect(body.getByRole('dialog')).toBeVisible());
    });

    await step('set Status to "Active" and apply', async () => {
      await user.selectOptions(body.getByRole('combobox', { name: /status/i }), 'active');
      await user.click(body.getByRole('button', { name: /apply/i }));
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    });

    await step('active-filter badge count is now visible', async () => {
      // The count badge is a sibling <span> inside the same wrapper div as the
      // button — it is NOT inside the <button> itself.  Check the parent wrapper
      // to avoid matching pagination numbers that also contain "1".
      await waitFor(() => {
        const btn = canvas.getByRole('button', { name: /open filters/i });
        expect(btn.parentElement).toHaveTextContent('1');
      });
    });

    await step('re-open, enable "Verified only" toggle → apply → badge = 2', async () => {
      await user.click(canvas.getByRole('button', { name: /open filters/i }));
      await waitFor(() => expect(body.getByRole('dialog')).toBeVisible());
      // The Toggle renders a role="switch" (HeadlessUI Switch)
      await user.click(body.getByRole('switch'));
      await user.click(body.getByRole('button', { name: /apply/i }));
      await waitFor(() => {
        const btn = canvas.getByRole('button', { name: /open filters/i });
        expect(btn.parentElement).toHaveTextContent('2');
      });
    });

    await step('re-open, check a Role checkbox → Cancel → badge stays at 2', async () => {
      await user.click(canvas.getByRole('button', { name: /open filters/i }));
      await waitFor(() => expect(body.getByRole('dialog')).toBeVisible());
      await user.click(body.getByRole('checkbox', { name: /admin/i }));
      await user.click(body.getByRole('button', { name: /cancel/i }));
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
      const btn = canvas.getByRole('button', { name: /open filters/i });
      expect(btn.parentElement).toHaveTextContent('2');
    });

    await step('re-open, click "Clear all" → apply → badge gone', async () => {
      await user.click(canvas.getByRole('button', { name: /open filters/i }));
      await waitFor(() => expect(body.getByRole('dialog')).toBeVisible());
      await user.click(body.getByRole('button', { name: /clear all/i }));
      await user.click(body.getByRole('button', { name: /apply/i }));
      await waitFor(() => {
        const btn = canvas.getByRole('button', { name: /open filters/i });
        expect(btn.parentElement).not.toHaveTextContent('1');
        expect(btn.parentElement).not.toHaveTextContent('2');
      });
    });
  },
};

// ── With search tags ──────────────────────────────────────

export const WithSearchTags: Story = {
  name: 'With search tags',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [query, setQuery] = useState('');
    const [tags, setTags] = useState<SearchSetTag[]>([]);
    return (
      <div className="max-w-lg flex flex-col gap-3">
        <SearchSet
          value={query}
          onChange={setQuery}
          tags={tags}
          onTagsChange={setTags}
          placeholder="Search (Enter = AND, Shift+Enter = OR)…"
          summary={tags.length > 0 ? `${tags.length} active tag${tags.length > 1 ? 's' : ''}` : undefined}
        />
        <p
          data-testid="tag-count"
          className="text-xs font-body text-ink-500 dark:text-ink-300"
        >
          Tags: {tags.length}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('type "invoice" + Enter → AND tag committed, input cleared', async () => {
      const input = canvas.getByRole('searchbox');
      await user.click(input);
      await user.type(input, 'invoice');
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(canvas.getByTestId('tag-count')).toHaveTextContent('Tags: 1');
        expect(canvas.getByText('invoice')).toBeVisible();
      });
      expect(input).toHaveValue('');
    });

    await step('type "receipt" + Shift+Enter → OR tag committed', async () => {
      const input = canvas.getByRole('searchbox');
      await user.type(input, 'receipt');
      await user.keyboard('{Shift>}{Enter}{/Shift}');
      await waitFor(() => {
        expect(canvas.getByTestId('tag-count')).toHaveTextContent('Tags: 2');
        expect(canvas.getByText('or', { exact: false })).toBeVisible();
        expect(canvas.getByText('receipt')).toBeVisible();
      });
    });

    await step('click remove on "invoice" tag → tag removed', async () => {
      await user.click(canvas.getByRole('button', { name: /remove "invoice"/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('tag-count')).toHaveTextContent('Tags: 1');
        expect(canvas.queryByText('invoice')).not.toBeInTheDocument();
      });
    });

    await step('duplicate term is rejected (Enter with same text)', async () => {
      const input = canvas.getByRole('searchbox');
      await user.type(input, 'receipt'); // already a tag
      await user.keyboard('{Enter}');
      await waitFor(() => {
        // Count stays at 1 — duplicate not added
        expect(canvas.getByTestId('tag-count')).toHaveTextContent('Tags: 1');
      });
    });
  },
};
