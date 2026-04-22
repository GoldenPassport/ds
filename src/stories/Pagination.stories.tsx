import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '../components/Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    page:             { control: { type: 'number', min: 1 },             description: 'Current page (1-indexed)' },
    pageSize:         { control: { type: 'number', min: 1 },             description: 'Rows shown per page' },
    total:            { control: { type: 'number', min: 0 },             description: 'Total number of items across all pages' },
    showSummary:      { control: 'boolean',                              description: 'Show "X–Y of Z" label' },
    pageSizeOptions:  { control: false,                                  description: 'Options for the rows-per-page selector. Pass [] to hide.' },
    onChange:         { control: false,                                  description: 'Called with (page, pageSize) on any change' },
    className:        { control: 'text' },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { page: 1, pageSize: 10, total: 200, showSummary: true },
  render: (args) => {
    const [page, setPage]         = React.useState(args.page);
    const [pageSize, setPageSize] = React.useState(args.pageSize);
    React.useEffect(() => { setPage(args.page); },     [args.page]);
    React.useEffect(() => { setPageSize(args.pageSize); }, [args.pageSize]);
    return (
      <div className="w-full max-w-2xl">
        <Pagination
          {...args}
          page={page}
          pageSize={pageSize}
          onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
        />
      </div>
    );
  },
};

export const FewPages: Story = {
  render: () => {
    const [page, setPage]         = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    return (
      <div className="w-full max-w-2xl">
        <Pagination page={page} pageSize={pageSize} total={42}
          onChange={(p, ps) => { setPage(p); setPageSize(ps); }} />
      </div>
    );
  },
};

export const ManyPages: Story = {
  render: () => {
    const [page, setPage]         = React.useState(5);
    const [pageSize, setPageSize] = React.useState(10);
    return (
      <div className="w-full max-w-2xl">
        <Pagination page={page} pageSize={pageSize} total={500}
          onChange={(p, ps) => { setPage(p); setPageSize(ps); }} />
      </div>
    );
  },
};

export const NearStart: Story = {
  render: () => {
    const [page, setPage]         = React.useState(2);
    const [pageSize, setPageSize] = React.useState(10);
    return (
      <div className="w-full max-w-2xl">
        <Pagination page={page} pageSize={pageSize} total={300}
          onChange={(p, ps) => { setPage(p); setPageSize(ps); }} />
      </div>
    );
  },
};

export const NearEnd: Story = {
  render: () => {
    const [page, setPage]         = React.useState(29);
    const [pageSize, setPageSize] = React.useState(10);
    return (
      <div className="w-full max-w-2xl">
        <Pagination page={page} pageSize={pageSize} total={300}
          onChange={(p, ps) => { setPage(p); setPageSize(ps); }} />
      </div>
    );
  },
};

export const NoPageSizeSelector: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);
    return (
      <div className="w-full max-w-2xl">
        <Pagination page={page} pageSize={25} total={200} pageSizeOptions={[]}
          onChange={(p) => setPage(p)} />
      </div>
    );
  },
};

export const NoSummary: Story = {
  render: () => {
    const [page, setPage]         = React.useState(3);
    const [pageSize, setPageSize] = React.useState(10);
    return (
      <div className="w-full max-w-2xl">
        <Pagination page={page} pageSize={pageSize} total={150} showSummary={false}
          onChange={(p, ps) => { setPage(p); setPageSize(ps); }} />
      </div>
    );
  },
};

export const SinglePage: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Pagination page={1} pageSize={25} total={8} onChange={() => {}} />
    </div>
  ),
};
