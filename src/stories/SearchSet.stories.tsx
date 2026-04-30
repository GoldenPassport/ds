import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { SearchSet } from '../components/SearchSet';
import type {
  SearchSetTag,
  SearchSetFilterDef,
  SearchSetFilterValues,
} from '../components/SearchSet';
import { Card } from '../components/Card';
import { Pagination } from '../components/Pagination';
import { Badge } from '../components/Badge';
import { StackedList } from '../components/StackedList';
import { DataTable } from '../components/DataTable';

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
};

// ── Naked (no card) ───────────────────────────────────────

export const SearchOnly: Story = {
  name: 'Naked — no card',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [q, setQ] = useState('');
    return (
      <div className="max-w-lg">
        <SearchSet value={q} onChange={setQ} placeholder="Search users…" />
      </div>
    );
  },
};

// ── Inside a Card ─────────────────────────────────────────

export const InCard: Story = {
  name: 'Inside a Card',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [q, setQ] = useState('');
    return (
      <div className="max-w-lg">
        <Card padding="md">
          <SearchSet value={q} onChange={setQ} placeholder="Search users…" />
        </Card>
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
};

// ── Interactions ──────────────────────────────────────────

export const Interactions: Story = {
  name: 'Interactions',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [query, setQuery] = useState('');
    return (
      <div className="max-w-lg flex flex-col gap-3">
        <SearchSet
          value={query}
          onChange={setQuery}
          placeholder="Search users…"
          summary={query ? `Searching for "${query}"` : ''}
        />
        {query && (
          <p data-testid="search-output" className="text-xs font-body text-ink-500">
            Query: {query}
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('type into search input → query updates', async () => {
      const input = canvas.getByRole('searchbox');
      await user.click(input);
      await user.type(input, 'alice');
      await waitFor(() => {
        expect(canvas.getByTestId('search-output')).toHaveTextContent('alice');
      });
    });

    await step('clear button appears and clears the search', async () => {
      // The clear button has aria-label="Clear search" in SearchSet
      const clearBtn = await canvas.findByRole('button', { name: /clear search/i });
      await user.click(clearBtn);
      await waitFor(() => {
        expect(canvas.queryByTestId('search-output')).not.toBeInTheDocument();
      });
    });
  },
};

export const FilterDialogInteraction: Story = {
  name: 'Interactions — filter dialog',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<SearchSetFilterValues>(EMPTY_FILTERS);
    return (
      <div className="max-w-lg flex flex-col gap-3">
        <SearchSet
          value={query}
          onChange={setQuery}
          placeholder="Search workflows…"
          filterDefs={FILTER_DEFS}
          filterValues={filters}
          onFilterChange={setFilters}
          filterTitle="Filter workflows"
        />
        <p data-testid="filter-status" className="text-xs font-body text-ink-500">
          Status: {String(filters.status) || 'none'}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('click filter button → filter dialog opens', async () => {
      // Use the exact aria-label to avoid matching chip-dismiss buttons
      // that also contain the word "filter" (e.g. "Remove filter …")
      const filterBtn = canvas.getByRole('button', { name: /^open filters$/i });
      await user.click(filterBtn);
      // findByRole has built-in retry — waits for the portal dialog to appear
      await within(document.body).findByRole('dialog');
    });

    await step('select a status option and apply', async () => {
      const dialog = within(document.body).getByRole('dialog');
      const dialogEl = within(dialog);

      await user.selectOptions(dialogEl.getByRole('combobox', { name: /status/i }), 'active');

      await user.click(dialogEl.getByRole('button', { name: /^apply$/i }));

      // Dialog should close and the status output should reflect the new value
      await waitFor(() => {
        expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
      });
      await waitFor(() => {
        expect(canvas.getByTestId('filter-status')).toHaveTextContent('active');
      });
    });
  },
};

// ── Tag interaction ───────────────────────────────────────

export const TagInteraction: Story = {
  name: 'Interactions — search tags',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [query, setQuery] = useState('');
    const [tags, setTags] = useState<SearchSetTag[]>([]);
    return (
      <div className="max-w-lg flex flex-col gap-3">
        <SearchSet
          value={query}
          onChange={setQuery}
          placeholder="Type and press Enter to add a tag…"
          tags={tags}
          onTagsChange={setTags}
        />
        <p data-testid="tag-count" className="text-xs font-body text-ink-500">
          Tags: {tags.length}
        </p>
        {tags.map((t) => (
          <p key={t.term} data-testid={`tag-${t.term}`} className="text-xs font-body text-ink-500">
            {t.term} ({t.op})
          </p>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('type "alpha" and press Enter → AND tag is added', async () => {
      const input = canvas.getByRole('searchbox');
      await user.click(input);
      await user.type(input, 'alpha');
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(canvas.getByTestId('tag-alpha')).toBeInTheDocument();
        expect(canvas.getByTestId('tag-alpha')).toHaveTextContent('and');
      });
    });

    await step('type "beta" and press Shift+Enter → OR tag is added', async () => {
      const input = canvas.getByRole('searchbox');
      await user.click(input);
      await user.type(input, 'beta');
      await user.keyboard('{Shift>}{Enter}{/Shift}');
      await waitFor(() => {
        expect(canvas.getByTestId('tag-beta')).toBeInTheDocument();
        expect(canvas.getByTestId('tag-beta')).toHaveTextContent('or');
      });
    });

    await step('two tags are present', async () => {
      await waitFor(() => {
        expect(canvas.getByTestId('tag-count')).toHaveTextContent('Tags: 2');
      });
    });

    await step('click remove button on "alpha" tag → tag is removed', async () => {
      await user.click(canvas.getByRole('button', { name: /remove "alpha"/i }));
      await waitFor(() => {
        expect(canvas.queryByTestId('tag-alpha')).not.toBeInTheDocument();
        expect(canvas.getByTestId('tag-count')).toHaveTextContent('Tags: 1');
      });
    });
  },
};

// ── With label ────────────────────────────────────────────

export const WithLabel: Story = {
  name: 'With label',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    return (
      <div className="max-w-lg flex flex-col gap-3">
        <SearchSet
          value={q}
          onChange={setQ}
          label="Find a team member"
          placeholder="Name or email…"
        />
        <Pagination
          page={page}
          pageSize={size}
          total={47}
          onChange={(p, s) => {
            setPage(p);
            setSize(s);
          }}
          pageSizeOptions={[10, 20, 50]}
          showSummary
        />
      </div>
    );
  },
};

// ── Paired with StackedList ───────────────────────────────

const ALL_USERS = [
  { id: 1, name: 'Alice Chen', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Torres', email: 'bob@example.com', role: 'Editor' },
  { id: 3, name: 'Carol Bains', email: 'carol@example.com', role: 'Viewer' },
  { id: 4, name: 'David Park', email: 'david@example.com', role: 'Editor' },
  { id: 5, name: 'Eva Müller', email: 'eva@example.com', role: 'Admin' },
  { id: 6, name: 'Frank Li', email: 'frank@example.com', role: 'Viewer' },
  { id: 7, name: 'Grace Osei', email: 'grace@example.com', role: 'Editor' },
  { id: 8, name: 'Hiro Tanaka', email: 'hiro@example.com', role: 'Viewer' },
  { id: 9, name: 'Isla Kovacs', email: 'isla@example.com', role: 'Admin' },
  { id: 10, name: 'James Wilson', email: 'james@example.com', role: 'Editor' },
  { id: 11, name: 'Karen Ndiaye', email: 'karen@example.com', role: 'Viewer' },
  { id: 12, name: 'Leo Rossi', email: 'leo@example.com', role: 'Admin' },
];

export const WithStackedList: Story = {
  name: 'Paired with StackedList',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);

    const filtered = ALL_USERS.filter(
      (u) =>
        !query ||
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase()),
    );
    const total = filtered.length;
    const pageRows = filtered.slice((page - 1) * size, page * size);

    React.useEffect(() => setPage(1), [query]);

    return (
      <div className="max-w-lg flex flex-col gap-3">
        <SearchSet value={query} onChange={setQuery} placeholder="Search by name or email…" />
        <StackedList
          bordered
          items={pageRows.map((u) => ({
            id: u.id,
            title: u.name,
            subtitle: u.email,
            trailing: (
              <Badge
                label={u.role}
                variant={
                  u.role === 'Admin' ? 'active' : u.role === 'Editor' ? 'running' : 'neutral'
                }
                size="sm"
                dot={false}
              />
            ),
          }))}
        />
        <Pagination
          page={page}
          pageSize={size}
          total={total}
          onChange={(p, s) => {
            setPage(p);
            setSize(s);
          }}
          pageSizeOptions={[5, 10, 20]}
          showSummary
        />
      </div>
    );
  },
};

// ── Paired with DataTable ─────────────────────────────────

const TABLE_DATA = ALL_USERS.map((u) => ({
  ...u,
  status: u.id % 3 === 0 ? 'Inactive' : 'Active',
}));

const TABLE_FILTER_DEFS: SearchSetFilterDef[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
    ],
  },
  {
    key: 'role',
    label: 'Role',
    type: 'multi',
    options: [
      { value: 'Admin', label: 'Admin' },
      { value: 'Editor', label: 'Editor' },
      { value: 'Viewer', label: 'Viewer' },
      { value: 'Billing', label: 'Billing' },
    ],
  },
];

const TABLE_EMPTY_FILTERS: SearchSetFilterValues = { status: '', role: [] };

export const WithDataTable: Story = {
  name: 'Paired with DataTable',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [query, setQuery] = useState('');
    const [tags, setTags] = useState<SearchSetTag[]>([]);
    const [filters, setFilters] = useState<SearchSetFilterValues>(TABLE_EMPTY_FILTERS);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);

    // Boolean filter: AND tags narrow the set, OR tags widen it.
    // Live query is always AND-ed on top of committed tags.
    function matchesTags(u: (typeof TABLE_DATA)[0]): boolean {
      const hit = (term: string) =>
        u.name.toLowerCase().includes(term.toLowerCase()) ||
        u.email.toLowerCase().includes(term.toLowerCase()) ||
        u.role.toLowerCase().includes(term.toLowerCase());

      // Evaluate left-to-right: accumulate a running boolean
      let result = true;
      for (let i = 0; i < tags.length; i++) {
        const { term, op } = tags[i];
        if (i === 0) {
          result = hit(term);
        } else if (op === 'and') {
          result = result && hit(term);
        } else {
          result = result || hit(term);
        }
      }
      // Apply live query as a final AND
      if (query) result = result && hit(query);
      return result;
    }

    function matchesFilters(u: (typeof TABLE_DATA)[0]): boolean {
      const status = filters.status as string;
      const roles = filters.role as string[];
      if (status && u.status !== status) return false;
      if (roles.length > 0 && !roles.includes(u.role)) return false;
      return true;
    }

    const filtered = TABLE_DATA.filter((u) => matchesTags(u) && matchesFilters(u));
    const total = filtered.length;
    const pageRows = filtered.slice((page - 1) * size, page * size);

    React.useEffect(() => setPage(1), [query, tags, filters]);

    const summaryText =
      total === TABLE_DATA.length ? `${total} members` : `${total} of ${TABLE_DATA.length} members`;

    return (
      <div className="flex flex-col gap-3">
        <SearchSet
          value={query}
          onChange={setQuery}
          tags={tags}
          onTagsChange={setTags}
          filterDefs={TABLE_FILTER_DEFS}
          filterValues={filters}
          onFilterChange={(f) => {
            setFilters(f);
            setPage(1);
          }}
          filterTitle="Filter members"
          placeholder="Search team…"
          summary={summaryText}
          searchClassName="max-w-sm"
        />
        <DataTable
          columns={[
            { key: 'name', header: 'Name', sortable: true },
            { key: 'email', header: 'Email', sortable: true },
            { key: 'role', header: 'Role' },
            {
              key: 'status',
              header: 'Status',
              render: (row) => (
                <Badge
                  label={row.status}
                  variant={row.status === 'Active' ? 'active' : 'draft'}
                  size="sm"
                  dot={false}
                />
              ),
            },
          ]}
          data={pageRows}
          pagination={{
            page,
            pageSize: size,
            total,
            pageSizeOptions: [5, 10, 20],
            onPageChange: (p, s) => {
              setPage(p);
              setSize(s);
            },
          }}
        />
      </div>
    );
  },
};

// ── Clear all interaction ─────────────────────────────────

export const ClearAllInteraction: Story = {
  name: 'Interactions — filter dialog clear all',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<SearchSetFilterValues>(EMPTY_FILTERS);
    return (
      <div className="max-w-lg flex flex-col gap-3">
        <SearchSet
          value={query}
          onChange={setQuery}
          placeholder="Search workflows…"
          filterDefs={FILTER_DEFS}
          filterValues={filters}
          onFilterChange={setFilters}
          filterTitle="Filter workflows"
        />
        <p data-testid="filter-role" className="text-xs font-body text-ink-500">
          Role: {(filters.role as string[]).join(',') || 'none'}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('open filter dialog and set a role filter', async () => {
      await user.click(canvas.getByRole('button', { name: /^open filters$/i }));
      await within(document.body).findByRole('dialog');

      const dialog = within(document.body).getByRole('dialog');
      const dialogEl = within(dialog);

      // Check a role checkbox
      const adminCheck = dialogEl.getByRole('checkbox', { name: /admin/i });
      await user.click(adminCheck);

      await user.click(dialogEl.getByRole('button', { name: /^apply$/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('filter-role')).toHaveTextContent('admin');
      });
    });

    await step('open dialog again and click "Clear all" → filters reset', async () => {
      await user.click(canvas.getByRole('button', { name: /^open filters$/i }));
      await within(document.body).findByRole('dialog');

      const dialog = within(document.body).getByRole('dialog');
      await user.click(within(dialog).getByRole('button', { name: /clear all/i }));

      await user.click(within(document.body).getByRole('button', { name: /^apply$/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('filter-role')).toHaveTextContent('none');
      });
    });
  },
};
