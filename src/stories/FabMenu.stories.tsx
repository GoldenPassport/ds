import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import {
  Plus,
  Pencil,
  Share2,
  Trash2,
  Download,
  Upload,
  Camera,
  Image,
  FileText,
  Link,
  Mail,
  Phone,
} from 'lucide-react';
import { FabMenu } from '../components/FabMenu';

const meta = {
  title: 'Navigation/FabMenu',
  component: FabMenu,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant: { control: 'select', options: ['small', 'regular', 'large'] },
    color: { control: 'select', options: ['primary', 'secondary', 'surface'] },
    position: { control: 'select', options: ['bottom-right', 'bottom-left', 'bottom-center'] },
    fixed: { control: 'boolean' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof FabMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared wrapper (relative container for Storybook) ─────

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[480px] bg-ink-50 dark:bg-ink-900 overflow-hidden rounded-2xl border border-ink-200 dark:border-ink-800">
      {/* Placeholder content */}
      <div className="p-6 space-y-3">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-10 rounded-xl bg-ink-200 dark:bg-ink-700/60" />
        ))}
      </div>
      {children}
    </div>
  );
}

const EDIT_ITEMS = [
  { label: 'Share', icon: <Share2 className="w-4 h-4" />, onClick: () => {} },
  { label: 'Edit', icon: <Pencil className="w-4 h-4" />, onClick: () => {} },
  { label: 'Delete', icon: <Trash2 className="w-4 h-4" />, onClick: () => {} },
];

const CREATE_ITEMS = [
  { label: 'Upload file', icon: <Upload className="w-4 h-4" />, onClick: () => {} },
  { label: 'Take photo', icon: <Camera className="w-4 h-4" />, onClick: () => {} },
  { label: 'Add image', icon: <Image className="w-4 h-4" />, onClick: () => {} },
  { label: 'New document', icon: <FileText className="w-4 h-4" />, onClick: () => {} },
];

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    icon: <Plus className="w-5 h-5" />,
    items: EDIT_ITEMS,
    variant: 'regular',
    color: 'primary',
    position: 'bottom-right',
    fixed: false,
  },
  render: () => {
    const [lastClicked, setLastClicked] = React.useState('');
    return (
      <div className="relative h-64 bg-ink-50 dark:bg-ink-900 rounded-2xl overflow-hidden border border-ink-200 dark:border-ink-800">
        <FabMenu
          icon={<Plus className="w-5 h-5" />}
          items={[
            {
              label: 'Share',
              icon: <Share2 className="w-4 h-4" />,
              onClick: () => setLastClicked('Share'),
            },
            {
              label: 'Edit',
              icon: <Pencil className="w-4 h-4" />,
              onClick: () => setLastClicked('Edit'),
            },
            {
              label: 'Delete',
              icon: <Trash2 className="w-4 h-4" />,
              onClick: () => setLastClicked('Delete'),
            },
          ]}
          position="bottom-right"
          fixed={false}
        />
        {lastClicked && (
          <p
            className="absolute top-4 left-4 text-sm font-body text-ink-700 dark:text-ink-300"
            data-testid="fab-clicked"
          >
            Clicked: {lastClicked}
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // findByRole retries until the element appears — handles the race between
    // the runner firing play() and the first React render committing.
    const trigger = await canvas.findByRole('button', { name: /open menu/i });

    await step('open — click FAB trigger, aria-expanded becomes true', async () => {
      await user.click(trigger);
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
      // All three action items are now in the document
      expect(canvas.getByRole('button', { name: /share/i })).toBeInTheDocument();
      expect(canvas.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(canvas.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    await step('item click — fires handler and closes menu', async () => {
      await user.click(canvas.getByRole('button', { name: /edit/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('fab-clicked')).toHaveTextContent('Edit');
      });
      // Menu collapses after item selection
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
    });

    await step('re-open then close with FAB — aria-expanded toggles', async () => {
      // Re-open
      await user.click(trigger);
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));

      // Close via the same trigger (label flips to "Close menu" when open)
      const closeBtn = canvas.getByRole('button', { name: /close menu/i });
      await user.click(closeBtn);
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    });
  },
};

// ── All sizes ─────────────────────────────────────────────

const STUB_ARGS = { icon: <Plus className="w-5 h-5" />, items: EDIT_ITEMS };

export const AllSizes: Story = {
  name: 'All sizes',
  args: STUB_ARGS,
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {(
        [
          { label: 'Small (40dp)', variant: 'small', iconSize: 'w-4 h-4' },
          { label: 'Regular (56dp)', variant: 'regular', iconSize: 'w-5 h-5' },
          { label: 'Large (96dp)', variant: 'large', iconSize: 'w-7 h-7' },
        ] as const
      ).map(({ label, variant, iconSize }) => (
        <div key={variant} className="flex flex-col gap-2">
          <p className="text-xs font-body text-ink-500 dark:text-ink-300">{label}</p>
          <div className="relative h-64 bg-ink-100 dark:bg-ink-800 rounded-2xl overflow-hidden">
            <FabMenu
              icon={<Plus className={iconSize} />}
              items={EDIT_ITEMS}
              variant={variant}
              position="bottom-right"
              fixed={false}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Extended: Story = {
  name: 'Extended (with label)',
  args: STUB_ARGS,
  render: () => (
    <Demo>
      <FabMenu
        icon={<Plus className="w-5 h-5" />}
        label="Create"
        items={CREATE_ITEMS}
        position="bottom-right"
        fixed={false}
      />
    </Demo>
  ),
};

// ── Colors ────────────────────────────────────────────────

export const Colors: Story = {
  name: 'Colors',
  args: STUB_ARGS,
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {(['primary', 'secondary', 'surface'] as const).map((color) => (
        <div
          key={color}
          className="relative h-64 bg-ink-100 dark:bg-ink-800 rounded-2xl overflow-hidden p-3"
        >
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 capitalize">{color}</p>
          <FabMenu
            icon={<Plus className="w-5 h-5" />}
            items={EDIT_ITEMS}
            color={color}
            position="bottom-right"
            fixed={false}
          />
        </div>
      ))}
    </div>
  ),
};

// ── Positions ─────────────────────────────────────────────

export const Positions: Story = {
  name: 'Positions',
  args: STUB_ARGS,
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {(['bottom-left', 'bottom-center', 'bottom-right'] as const).map((position) => (
        <div
          key={position}
          className="relative h-64 bg-ink-100 dark:bg-ink-800 rounded-2xl overflow-hidden p-3"
        >
          <p className="text-xs font-body text-ink-500 dark:text-ink-300">{position}</p>
          <FabMenu
            icon={<Plus className="w-5 h-5" />}
            items={EDIT_ITEMS}
            position={position}
            fixed={false}
          />
        </div>
      ))}
    </div>
  ),
};

// ── Many items ────────────────────────────────────────────

export const ManyItems: Story = {
  name: 'Many items (6)',
  args: STUB_ARGS,
  render: () => (
    <Demo>
      <FabMenu
        icon={<Plus className="w-5 h-5" />}
        items={[
          { label: 'Upload', icon: <Upload className="w-4 h-4" />, onClick: () => {} },
          { label: 'Download', icon: <Download className="w-4 h-4" />, onClick: () => {} },
          { label: 'Share', icon: <Share2 className="w-4 h-4" />, onClick: () => {} },
          { label: 'Link', icon: <Link className="w-4 h-4" />, onClick: () => {} },
          { label: 'Mail', icon: <Mail className="w-4 h-4" />, onClick: () => {} },
          { label: 'Call', icon: <Phone className="w-4 h-4" />, onClick: () => {} },
        ]}
        position="bottom-right"
        fixed={false}
      />
    </Demo>
  ),
};

// ── Dark mode ─────────────────────────────────────────────

export const Dark: Story = {
  name: 'Dark mode',
  args: STUB_ARGS,
  render: () => (
    <div className="dark">
      <Demo>
        <FabMenu
          icon={<Plus className="w-5 h-5" />}
          items={CREATE_ITEMS}
          position="bottom-right"
          fixed={false}
        />
      </Demo>
    </div>
  ),
};

