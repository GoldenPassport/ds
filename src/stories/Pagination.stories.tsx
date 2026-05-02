import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Pagination } from '../components/Pagination';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    page: { control: { type: 'number', min: 1 }, description: 'Current page (1-indexed)' },
    pageSize: { control: { type: 'number', min: 1 }, description: 'Rows shown per page' },
    total: {
      control: { type: 'number', min: 0 },
      description: 'Total number of items across all pages',
    },
    showSummary: { control: 'boolean', description: 'Show "X–Y of Z" label' },
    pageSizeOptions: {
      control: false,
      description: 'Options for the rows-per-page selector. Pass [] to hide.',
    },
    onChange: { control: false, description: 'Called with (page, pageSize) on any change' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { page: 1, pageSize: 10, total: 200, showSummary: true, onChange: () => {} },
  render: (args) => {
    const [page, setPage] = React.useState(args.page);
    const [pageSize, setPageSize] = React.useState(args.pageSize);
    React.useEffect(() => {
      setPage(args.page);
    }, [args.page]);
    React.useEffect(() => {
      setPageSize(args.pageSize);
    }, [args.pageSize]);
    return (
      <div className="w-full max-w-2xl flex flex-col gap-3">
        <Pagination
          {...args}
          page={page}
          pageSize={pageSize}
          onChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
        />
        <p className="text-xs font-body text-ink-500 dark:text-ink-300" data-testid="page-info">
          Page {page}, size {pageSize}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('initial state — page 1 is active', async () => {
      expect(canvas.getByRole('button', { name: /^page 1$/i })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });
    await step('click next — advances to page 2', async () => {
      await user.click(canvas.getByRole('button', { name: /next/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('page-info')).toHaveTextContent('Page 2');
      });
    });
    await step('click page 3 directly', async () => {
      await user.click(canvas.getByRole('button', { name: /^page 3$/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('page-info')).toHaveTextContent('Page 3');
      });
    });
    await step('click previous — goes to page 2', async () => {
      await user.click(canvas.getByRole('button', { name: /previous/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('page-info')).toHaveTextContent('Page 2');
      });
    });
    await step('change page size — resets to page 1', async () => {
      const select = canvas.getByRole('combobox');
      const options = Array.from(select.querySelectorAll('option')).map((o) => o.value);
      const nextOption = options.find((o) => o !== '10') ?? options[0];
      await user.selectOptions(select, nextOption);
      await waitFor(() => {
        expect(canvas.getByTestId('page-info')).toHaveTextContent(`size ${nextOption}`);
      });
    });
  },
};

export const FewPages: Story = {
  args: { page: 1, pageSize: 10, total: 0, onChange: () => {} },
  render: () => {
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    return (
      <div className="w-full max-w-2xl">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={42}
          onChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
        />
      </div>
    );
  },
};

export const ManyPages: Story = {
  args: { page: 1, pageSize: 10, total: 0, onChange: () => {} },
  render: () => {
    const [page, setPage] = React.useState(5);
    const [pageSize, setPageSize] = React.useState(10);
    return (
      <div className="w-full max-w-2xl">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={500}
          onChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
        />
      </div>
    );
  },
};

export const PageWindow: Story = {
  name: 'Page window — near start and near end',
  args: { page: 1, pageSize: 10, total: 0, onChange: () => {} },
  render: () => {
    const [pageA, setPageA] = React.useState(2);
    const [pageSizeA, setPageSizeA] = React.useState(10);
    const [pageB, setPageB] = React.useState(29);
    const [pageSizeB, setPageSizeB] = React.useState(10);
    return (
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono text-ink-500 dark:text-ink-300">Near start (page 2 of 30)</p>
          <Pagination
            page={pageA}
            pageSize={pageSizeA}
            total={300}
            onChange={(p, ps) => {
              setPageA(p);
              setPageSizeA(ps);
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono text-ink-500 dark:text-ink-300">Near end (page 29 of 30)</p>
          <Pagination
            page={pageB}
            pageSize={pageSizeB}
            total={300}
            onChange={(p, ps) => {
              setPageB(p);
              setPageSizeB(ps);
            }}
          />
        </div>
      </div>
    );
  },
};

export const NoPageSizeSelector: Story = {
  args: { page: 1, pageSize: 10, total: 0, onChange: () => {} },
  render: () => {
    const [page, setPage] = React.useState(1);
    return (
      <div className="w-full max-w-2xl">
        <Pagination
          page={page}
          pageSize={25}
          total={200}
          pageSizeOptions={[]}
          onChange={(p) => setPage(p)}
        />
      </div>
    );
  },
};

export const NoSummary: Story = {
  args: { page: 1, pageSize: 10, total: 0, onChange: () => {} },
  render: () => {
    const [page, setPage] = React.useState(3);
    const [pageSize, setPageSize] = React.useState(10);
    return (
      <div className="w-full max-w-2xl">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={150}
          showSummary={false}
          onChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
        />
      </div>
    );
  },
};

export const SinglePage: Story = {
  args: { page: 1, pageSize: 10, total: 0, onChange: () => {} },
  render: () => (
    <div className="w-full max-w-2xl">
      <Pagination page={1} pageSize={25} total={8} onChange={() => {}} />
    </div>
  ),
};

