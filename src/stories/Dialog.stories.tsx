import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Trash2 } from 'lucide-react';
import { Dialog } from '../components/Dialog';
import { Button } from '../components/Button';

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    title:     { control: 'text',   description: 'Dialog heading' },
    size:      { control: 'select', options: ['sm', 'md', 'lg'], description: 'Max-width of the dialog panel' },
    open:      { control: false,    description: 'Controlled open state' },
    onClose:   { control: false,    description: 'Called when the dialog requests to close' },
    children:  { control: false,    description: 'Dialog body content' },
    className: { control: 'text',   description: 'Extra CSS class on the panel' },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function DialogDemo({
  title,
  size,
  children,
}: {
  title: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onClose={setOpen} title={title} size={size}>
        {children}
      </Dialog>
    </>
  );
}

export const Playground: Story = {
  args: { title: 'Dialog Title', size: 'md', open: false, onClose: () => {}, children: null },
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog {...args} open={open} onClose={setOpen}>
          <p className="text-ink-600 dark:text-ink-300">
            This is the dialog body. Use the controls panel to change the title and size.
          </p>
          <Dialog.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
          </Dialog.Footer>
        </Dialog>
      </>
    );
  },
};

export const Confirmation: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => (
    <DialogDemo title="Delete Workflow" size="sm">
      <p className="text-ink-600 dark:text-ink-300">
        This will permanently delete{' '}
        <strong className="text-ink-900 dark:text-ink-50">Invoice Approval</strong> and all its run
        history. This action cannot be undone.
      </p>
      <Dialog.Footer>
        <Button variant="ghost">Cancel</Button>
        <Button variant="danger"><Trash2 className="w-4 h-4" /> Delete</Button>
      </Dialog.Footer>
    </DialogDemo>
  ),
};

export const FormDialog: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => (
    <DialogDemo title="New Workflow" size="md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50">
            Workflow Name
          </label>
          <input
            className="w-full px-3 py-2.5 rounded-lg border border-ink-200 dark:border-ink-600 bg-white dark:bg-ink-700 text-sm font-body text-ink-900 dark:text-ink-50 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25 transition-all"
            placeholder="e.g. Invoice Approval Flow"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-ink-200 dark:border-ink-600 bg-white dark:bg-ink-700 text-sm font-body text-ink-900 dark:text-ink-50 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25 transition-all resize-none"
            placeholder="Optional description…"
          />
        </div>
      </div>
      <Dialog.Footer>
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Create Workflow</Button>
      </Dialog.Footer>
    </DialogDemo>
  ),
};

export const InfoDialog: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => (
    <DialogDemo title="Run Complete" size="sm">
      <p className="text-ink-600 dark:text-ink-300">
        <strong className="text-ink-900 dark:text-ink-50">Employee Onboarding</strong> completed
        successfully in 2m 14s across 8 steps.
      </p>
      <Dialog.Footer>
        <Button variant="primary">View Run Log</Button>
      </Dialog.Footer>
    </DialogDemo>
  ),
};

// ── Interactions ──────────────────────────────────────────

export const Interactions: Story = {
  name: 'Interactions',
  args: { open: false, onClose: () => {}, children: null },
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog open={open} onClose={setOpen} title="Confirm Action" size="sm">
          <p className="text-ink-600 dark:text-ink-300">Are you sure you want to proceed?</p>
          <Dialog.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
          </Dialog.Footer>
        </Dialog>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user   = userEvent.setup();

    await step('click trigger — dialog opens', async () => {
      await user.click(canvas.getByRole('button', { name: /open dialog/i }));
      await waitFor(() => {
        expect(within(document.body).getByRole('dialog')).toBeInTheDocument();
      });
    });

    await step('dialog title and body are visible', async () => {
      const dialog = within(document.body).getByRole('dialog');
      expect(within(dialog).getByText('Confirm Action')).toBeVisible();
      expect(within(dialog).getByText(/are you sure/i)).toBeVisible();
    });

    await step('click Cancel — dialog closes', async () => {
      const dialog = within(document.body).getByRole('dialog');
      await user.click(within(dialog).getByRole('button', { name: /cancel/i }));
      await waitFor(() => {
        expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    await step('re-open and close via X button', async () => {
      await user.click(canvas.getByRole('button', { name: /open dialog/i }));
      await waitFor(() => {
        expect(within(document.body).getByRole('dialog')).toBeInTheDocument();
      });
      const dialog = within(document.body).getByRole('dialog');
      await user.click(within(dialog).getByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    await step('re-open and close with Escape key', async () => {
      await user.click(canvas.getByRole('button', { name: /open dialog/i }));
      await waitFor(() => {
        expect(within(document.body).getByRole('dialog')).toBeInTheDocument();
      });
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  },
};

export const LargeDialog: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => (
    <DialogDemo title="Workflow Settings" size="lg">
      <div className="space-y-4 text-ink-600 dark:text-ink-300 text-sm">
        <p>Configure advanced settings for this workflow. Changes take effect on the next run.</p>
        <div className="bg-ink-50 dark:bg-ink-700 rounded-lg p-4 font-mono text-xs text-ink-500 dark:text-ink-300">
          trigger.on("form_submit")<br />
          .filter(data =&gt; data.amount &gt; 1000)<br />
          .route("approval_queue")
        </div>
      </div>
      <Dialog.Footer>
        <Button variant="ghost">Discard</Button>
        <Button variant="secondary">Save as Draft</Button>
        <Button variant="primary">Save &amp; Deploy</Button>
      </Dialog.Footer>
    </DialogDemo>
  ),
};
