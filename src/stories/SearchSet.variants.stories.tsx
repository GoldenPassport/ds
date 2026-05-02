import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchSet } from '../components/SearchSet';
import type { SearchSetTag, SearchSetFilterDef, SearchSetFilterValues } from '../components/SearchSet';
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

// ── Shared fixtures ───────────────────────────────────────

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

export const WithDataTable: Story = {
  name: 'Paired with DataTable',
  args: { value: '', onChange: () => {} },
  render: () => {
    const [query, setQuery] = useState('');
    const [tags, setTags] = useState<SearchSetTag[]>([]);
    const [filters, setFilters] = useState<SearchSetFilterValues>(TABLE_EMPTY_FILTERS);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);

    function matchesTags(u: (typeof TABLE_DATA)[0]): boolean {
      const hit = (term: string) =>
        u.name.toLowerCase().includes(term.toLowerCase()) ||
        u.email.toLowerCase().includes(term.toLowerCase()) ||
        u.role.toLowerCase().includes(term.toLowerCase());

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
