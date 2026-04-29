import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Copy, Pencil, Play, Trash2, Download, Share2, MoreHorizontal } from 'lucide-react';
import { Menu } from '../components/Menu';
import { Button } from '../components/Button';

const meta = {
  title: 'Elements/Menu',
  component: Menu,
  tags: ['autodocs'],
  argTypes: {
    align:    { control: 'select', options: ['left', 'right'], description: 'Which edge of the trigger the panel aligns to' },
    trigger:  { control: false, description: 'ReactNode used as the menu trigger button' },
    items:    { control: false, description: 'Array of { label, onClick, icon?, destructive?, dividerAbove?, disabled? }' },
    className: { control: 'text', description: 'Extra CSS class on the panel' },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

const workflowItems = [
  { label: 'Edit',      icon: <Pencil className="w-4 h-4" />,   onClick: () => {} },
  { label: 'Duplicate', icon: <Copy className="w-4 h-4" />,     onClick: () => {} },
  { label: 'Run now',   icon: <Play className="w-4 h-4" />,     onClick: () => {} },
  { label: 'Export',    icon: <Download className="w-4 h-4" />, onClick: () => {}, dividerAbove: true },
  { label: 'Share',     icon: <Share2 className="w-4 h-4" />,   onClick: () => {} },
  { label: 'Delete',    icon: <Trash2 className="w-4 h-4" />,   onClick: () => {}, destructive: true, dividerAbove: true },
];

export const Playground: Story = {
  args: { align: 'right', trigger: null, items: [] },
  render: (args) => (
    <div className="flex justify-center pt-20">
      <Menu
        {...args}
        trigger={<Button variant="secondary" size="sm">⋯ Actions</Button>}
        items={workflowItems}
      />
    </div>
  ),
};

export const WorkflowActions: Story = {
  args: { trigger: null, items: [] },
  render: () => (
    <div className="flex justify-center pt-20">
      <Menu
        trigger={<Button variant="secondary" size="sm">⋯ Actions</Button>}
        items={workflowItems}
        align="right"
      />
    </div>
  ),
};

export const AlignLeft: Story = {
  args: { trigger: null, items: [] },
  render: () => (
    <div className="flex justify-center pt-20">
      <Menu
        trigger={<Button variant="ghost" size="sm">Options</Button>}
        items={[
          { label: 'Rename',  onClick: () => {} },
          { label: 'Archive', onClick: () => {} },
          { label: 'Delete',  onClick: () => {}, destructive: true, dividerAbove: true },
        ]}
        align="left"
      />
    </div>
  ),
};

export const Interactions: Story = {
  name: 'Interactions',
  args: { trigger: null, items: [] },
  render: () => {
    const [clicked, setClicked] = React.useState('');
    return (
      <div className="flex justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Menu
            trigger={<Button variant="secondary" size="sm">⋯ Actions</Button>}
            items={[
              { label: 'Edit',   icon: <Pencil className="w-4 h-4" />, onClick: () => setClicked('Edit')   },
              { label: 'Share',  icon: <Share2 className="w-4 h-4" />, onClick: () => setClicked('Share')  },
              { label: 'Delete', icon: <Trash2 className="w-4 h-4" />, onClick: () => setClicked('Delete'), destructive: true, dividerAbove: true },
            ]}
          />
          {clicked && (
            <p className="text-sm font-body text-ink-500 dark:text-ink-300" data-testid="clicked-item">
              Clicked: <strong>{clicked}</strong>
            </p>
          )}
        </div>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user   = userEvent.setup();

    await step('click trigger — menu opens', async () => {
      await user.click(canvas.getByRole('button', { name: /actions/i }));
      await waitFor(() => {
        expect(within(document.body).getByRole('menuitem', { name: /edit/i })).toBeVisible();
      });
    });

    await step('menu shows destructive item', async () => {
      expect(within(document.body).getByRole('menuitem', { name: /delete/i })).toBeInTheDocument();
    });

    await step('click menu item — fires handler and closes menu', async () => {
      await user.click(within(document.body).getByRole('menuitem', { name: /edit/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('clicked-item')).toHaveTextContent('Edit');
      });
      await waitFor(() => {
        expect(within(document.body).queryByRole('menuitem', { name: /edit/i })).not.toBeInTheDocument();
      });
    });

    await step('re-open and close with Escape', async () => {
      await user.click(canvas.getByRole('button', { name: /actions/i }));
      await waitFor(() => {
        expect(within(document.body).getByRole('menuitem', { name: /edit/i })).toBeVisible();
      });
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(within(document.body).queryByRole('menuitem', { name: /edit/i })).not.toBeInTheDocument();
      });
    });
  },
};

export const IconTrigger: Story = {
  args: { trigger: null, items: [] },
  render: () => (
    <div className="flex justify-center pt-20">
      <Menu
        trigger={
          <button aria-label="Actions" className="w-8 h-8 flex items-center justify-center rounded-lg bg-ink-100 dark:bg-ink-700 text-ink-500 dark:text-ink-300 hover:bg-ink-200 dark:hover:bg-ink-600 transition-colors border-0 cursor-pointer">
            <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
          </button>
        }
        items={workflowItems}
        align="right"
      />
    </div>
  ),
};
