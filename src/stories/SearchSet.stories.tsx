import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchSet } from '../components/SearchSet';
import { Badge } from '../components/Badge';
import { StackedList } from '../components/StackedList';
import { DataTable } from '../components/DataTable';

const meta = {
  title: 'Forms/SearchSet',
  component: SearchSet,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    value:       { control: 'text' },
    total:       { control: 'number' },
    page:        { control: 'number' },
    pageSize:    { control: 'number' },
    debounce:    { control: 'number' },
    loading:     { control: 'boolean' },
    placeholder: { control: 'text' },
    label:       { control: 'text' },
  },
} satisfies Meta<typeof SearchSet>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    value:       '',
    onChange:    () => {},
    total:       142,
    page:        1,
    pageSize:    25,
    loading:     false,
    placeholder: 'Search…',
    label:       '',
  },
  render: (args) => {
    const [query, setQuery] = useState(args.value);
    const [size,  setSize]  = useState(args.pageSize ?? 25);
    return (
      <div className="max-w-lg">
        <SearchSet
          {...args}
          value={query}
          onChange={setQuery}
          pageSize={size}
          onPageSizeChange={setSize}
        />
        {query && (
          <p className="mt-2 text-xs font-body text-ink-400">
            Server would receive: <code className="text-ink-700 dark:text-ink-200">query="{query}"</code>
          </p>
        )}
      </div>
    );
  },
};

// ── Search only (no results yet) ──────────────────────────

export const SearchOnly: Story = {
  name: 'Search only',
  args: { value: '', onChange: () => {}, total: undefined },
  render: () => {
    const [q, setQ] = useState('');
    return (
      <div className="max-w-lg">
        <SearchSet value={q} onChange={setQ} placeholder="Search users…" />
      </div>
    );
  },
};

// ── With results ──────────────────────────────────────────

export const WithResults: Story = {
  name: 'With results',
  args: { value: '', onChange: () => {}, total: 0 },
  render: () => {
    const [q,    setQ]    = useState('');
    const [size, setSize] = useState(25);
    return (
      <div className="max-w-lg">
        <SearchSet
          value={q}
          onChange={setQ}
          placeholder="Search deployments…"
          total={284}
          page={1}
          pageSize={size}
          onPageSizeChange={setSize}
        />
      </div>
    );
  },
};

// ── No results ────────────────────────────────────────────

export const NoResults: Story = {
  name: 'No results',
  args: { value: '', onChange: () => {}, total: 0 },
  render: () => (
    <div className="max-w-lg">
      <SearchSet
        value="xyzzy"
        onChange={() => {}}
        placeholder="Search…"
        total={0}
        page={1}
        pageSize={25}
        onPageSizeChange={() => {}}
      />
    </div>
  ),
};

// ── Loading ───────────────────────────────────────────────

export const Loading: Story = {
  name: 'Loading',
  args: { value: '', onChange: () => {}, total: undefined },
  render: () => (
    <div className="max-w-lg">
      <SearchSet
        value="invoice"
        onChange={() => {}}
        placeholder="Search…"
        loading
      />
    </div>
  ),
};

// ── With filter chips ─────────────────────────────────────

export const WithFilters: Story = {
  name: 'With filter chips',
  args: { value: '', onChange: () => {}, total: 0 },
  render: () => {
    const [q,      setQ]      = useState('');
    const [size,   setSize]   = useState(25);
    const [status, setStatus] = useState<string | null>('active');

    const statusOptions = ['active', 'pending', 'failed'] as const;

    return (
      <div className="max-w-lg flex flex-col gap-4">
        <SearchSet
          value={q}
          onChange={setQ}
          placeholder="Search workflows…"
          total={58}
          page={1}
          pageSize={size}
          onPageSizeChange={setSize}
          filters={
            <>
              {statusOptions.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s === status ? null : s)}
                >
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
      </div>
    );
  },
};

// ── With label ────────────────────────────────────────────

export const WithLabel: Story = {
  name: 'With label',
  args: { value: '', onChange: () => {}, total: 0 },
  render: () => {
    const [q, setQ] = useState('');
    return (
      <div className="max-w-lg">
        <SearchSet
          value={q}
          onChange={setQ}
          label="Find a team member"
          placeholder="Name or email…"
          total={47}
          page={1}
          pageSize={10}
          onPageSizeChange={() => {}}
          pageSizeOptions={[10, 20, 50]}
        />
      </div>
    );
  },
};

// ── Paired with StackedList ───────────────────────────────

const ALL_USERS = [
  { id: 1,  name: 'Alice Chen',    email: 'alice@example.com',   role: 'Admin'  },
  { id: 2,  name: 'Bob Torres',    email: 'bob@example.com',     role: 'Editor' },
  { id: 3,  name: 'Carol Bains',   email: 'carol@example.com',   role: 'Viewer' },
  { id: 4,  name: 'David Park',    email: 'david@example.com',   role: 'Editor' },
  { id: 5,  name: 'Eva Müller',    email: 'eva@example.com',     role: 'Admin'  },
  { id: 6,  name: 'Frank Li',      email: 'frank@example.com',   role: 'Viewer' },
  { id: 7,  name: 'Grace Osei',    email: 'grace@example.com',   role: 'Editor' },
  { id: 8,  name: 'Hiro Tanaka',   email: 'hiro@example.com',    role: 'Viewer' },
  { id: 9,  name: 'Isla Kovacs',   email: 'isla@example.com',    role: 'Admin'  },
  { id: 10, name: 'James Wilson',  email: 'james@example.com',   role: 'Editor' },
  { id: 11, name: 'Karen Ndiaye',  email: 'karen@example.com',   role: 'Viewer' },
  { id: 12, name: 'Leo Rossi',     email: 'leo@example.com',     role: 'Admin'  },
];

export const WithStackedList: Story = {
  name: 'Paired with StackedList',
  args: { value: '', onChange: () => {}, total: 0 },
  render: () => {
    const [query,   setQuery]   = useState('');
    const [page,    setPage]    = useState(1);
    const [size,    setSize]    = useState(5);

    // Simulated server-side search (client filter standing in for a real API)
    const filtered = ALL_USERS.filter(u =>
      !query || u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
    );
    const total    = filtered.length;
    const pageRows = filtered.slice((page - 1) * size, page * size);

    // Reset to page 1 when query changes
    React.useEffect(() => setPage(1), [query]);

    return (
      <div className="max-w-lg flex flex-col gap-3">
        <SearchSet
          value={query}
          onChange={setQuery}
          placeholder="Search by name or email…"
          total={total}
          page={page}
          pageSize={size}
          onPageSizeChange={(s) => { setSize(s); setPage(1); }}
          pageSizeOptions={[5, 10, 20]}
        />
        <StackedList
          bordered
          items={pageRows.map(u => ({
            id:       u.id,
            title:    u.name,
            subtitle: u.email,
            trailing: <Badge label={u.role} variant={u.role === 'Admin' ? 'active' : u.role === 'Editor' ? 'running' : 'neutral'} size="sm" dot={false} />,
          }))}
        />
        {/* Simple prev/next when there's more than one page */}
        {total > size && (
          <div className="flex items-center justify-between text-xs font-body text-ink-400">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-xl border border-ink-200 dark:border-ink-600 disabled:opacity-40 hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors"
            >
              ← Prev
            </button>
            <span>Page {page} of {Math.ceil(total / size)}</span>
            <button
              disabled={page >= Math.ceil(total / size)}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-xl border border-ink-200 dark:border-ink-600 disabled:opacity-40 hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    );
  },
};

// ── Paired with DataTable ─────────────────────────────────

const TABLE_DATA = ALL_USERS.map(u => ({ ...u, status: u.id % 3 === 0 ? 'Inactive' : 'Active' }));

export const WithDataTable: Story = {
  name: 'Paired with DataTable',
  args: { value: '', onChange: () => {}, total: 0 },
  render: () => {
    const [query, setQuery] = useState('');
    const [page,  setPage]  = useState(1);
    const [size,  setSize]  = useState(5);

    const filtered = TABLE_DATA.filter(u =>
      !query || u.name.toLowerCase().includes(query.toLowerCase())
    );
    const total    = filtered.length;
    const pageRows = filtered.slice((page - 1) * size, page * size);

    React.useEffect(() => setPage(1), [query]);

    return (
      <div className="flex flex-col gap-3">
        <SearchSet
          value={query}
          onChange={setQuery}
          placeholder="Search team…"
          total={total}
          page={page}
          pageSize={size}
          onPageSizeChange={(s) => { setSize(s); setPage(1); }}
          pageSizeOptions={[5, 10, 20]}
        />
        <DataTable
          columns={[
            { key: 'name',   header: 'Name',   sortable: true  },
            { key: 'email',  header: 'Email',  sortable: true  },
            { key: 'role',   header: 'Role'                    },
            { key: 'status', header: 'Status', render: (row) => (
              <Badge label={row.status} variant={row.status === 'Active' ? 'active' : 'draft'} size="sm" dot={false} />
            )},
          ]}
          data={pageRows}
        />
      </div>
    );
  },
};
