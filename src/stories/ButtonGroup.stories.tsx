import { expect, userEvent, within, waitFor } from 'storybook/test';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  Grid2x2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  Monitor,
  Tablet,
  Smartphone,
} from 'lucide-react';
import { ButtonGroup } from '../components/ButtonGroup';

const meta = {
  title: 'Elements/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: 'Button size' },
    variant: {
      control: 'select',
      options: ['default', 'ghost'],
      description: '"default" has a background + border; "ghost" is borderless',
    },
    showLabel: {
      control: 'boolean',
      description: 'Render button labels (set false for icon-only groups)',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow selecting multiple items (requires value/onChange)',
    },
    fullWidth: {
      control: 'select',
      options: ['never', 'always', 'mobile'],
      description:
        '"never" shrink-wraps (default), "always" fills container, "mobile" full-width on small screens',
    },
    label: { control: 'text', description: 'Label rendered above the group' },
    hint: { control: 'text', description: 'Helper text rendered below the group' },
    items: {
      control: false,
      description: 'Array of { label, value?, onClick?, icon?, disabled?, active?, ariaLabel? }',
    },
    value: { control: false, description: 'Controlled selected value (T) or values (T[])' },
    onChange: { control: false, description: 'Called with the new value or values array' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: { size: 'md', variant: 'default', showLabel: true },
  render: (args) => (
    <ButtonGroup
      {...args}
      items={[
        { label: 'Years', onClick: () => {} },
        { label: 'Months', onClick: () => {} },
        { label: 'Days', onClick: () => {} },
      ]}
    />
  ),
};

// ── Action groups (uncontrolled / onClick) ────────────────

export const ViewToggle: Story = {
  name: 'Action — view toggle',
  render: () => {
    const [view, setView] = React.useState('list');
    return (
      <ButtonGroup
        items={[
          {
            label: 'List',
            icon: <List className="w-4 h-4" />,
            active: view === 'list',
            onClick: () => setView('list'),
          },
          {
            label: 'Grid',
            icon: <Grid2x2 className="w-4 h-4" />,
            active: view === 'grid',
            onClick: () => setView('grid'),
          },
        ]}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('List is initially active', async () => {
      expect(canvas.getByRole('button', { name: /list/i })).toHaveAttribute('aria-pressed', 'true');
      expect(canvas.getByRole('button', { name: /grid/i })).toHaveAttribute('aria-pressed', 'false');
    });
    await step('click Grid → Grid becomes active, List inactive', async () => {
      await user.click(canvas.getByRole('button', { name: /grid/i }));
      await waitFor(() => {
        expect(canvas.getByRole('button', { name: /grid/i })).toHaveAttribute('aria-pressed', 'true');
        expect(canvas.getByRole('button', { name: /list/i })).toHaveAttribute('aria-pressed', 'false');
      });
    });
  },
};

export const ActionIconOnly: Story = {
  name: 'Action — icon only',
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">Pagination</p>
        <ButtonGroup
          showLabel={false}
          items={[
            {
              label: 'Previous',
              ariaLabel: 'Previous page',
              icon: <ChevronLeft className="w-4 h-4" />,
              onClick: () => {},
            },
            {
              label: 'Next',
              ariaLabel: 'Next page',
              icon: <ChevronRight className="w-4 h-4" />,
              onClick: () => {},
            },
          ]}
        />
      </div>
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2">Zoom toolbar</p>
        <ButtonGroup
          showLabel={false}
          items={[
            { label: 'Zoom in', icon: <ZoomIn className="w-4 h-4" />, onClick: () => {} },
            { label: 'Zoom out', icon: <ZoomOut className="w-4 h-4" />, onClick: () => {} },
            { label: 'Reset', icon: <RotateCcw className="w-4 h-4" />, onClick: () => {} },
          ]}
        />
      </div>
    </div>
  ),
};

export const MultiToggle: Story = {
  name: 'Action — multi-toggle (icon only)',
  render: () => {
    const [fmt, setFmt] = React.useState<string[]>(['bold']);
    const toggle = (v: string) =>
      setFmt((f) => (f.includes(v) ? f.filter((x) => x !== v) : [...f, v]));
    return (
      <ButtonGroup
        showLabel={false}
        items={[
          {
            label: 'Bold',
            icon: <Bold className="w-4 h-4" />,
            active: fmt.includes('bold'),
            onClick: () => toggle('bold'),
          },
          {
            label: 'Italic',
            icon: <Italic className="w-4 h-4" />,
            active: fmt.includes('italic'),
            onClick: () => toggle('italic'),
          },
          {
            label: 'Underline',
            icon: <Underline className="w-4 h-4" />,
            active: fmt.includes('underline'),
            onClick: () => toggle('underline'),
          },
        ]}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('Bold is initially active; Italic and Underline are not', async () => {
      expect(canvas.getByRole('button', { name: /bold/i })).toHaveAttribute('aria-pressed', 'true');
      expect(canvas.getByRole('button', { name: /italic/i })).toHaveAttribute('aria-pressed', 'false');
      expect(canvas.getByRole('button', { name: /underline/i })).toHaveAttribute('aria-pressed', 'false');
    });
    await step('click Italic → Italic becomes active, Bold stays active', async () => {
      await user.click(canvas.getByRole('button', { name: /italic/i }));
      await waitFor(() => {
        expect(canvas.getByRole('button', { name: /italic/i })).toHaveAttribute('aria-pressed', 'true');
        expect(canvas.getByRole('button', { name: /bold/i })).toHaveAttribute('aria-pressed', 'true');
      });
    });
    await step('click Bold → Bold deactivates, Italic stays active', async () => {
      await user.click(canvas.getByRole('button', { name: /bold/i }));
      await waitFor(() => {
        expect(canvas.getByRole('button', { name: /bold/i })).toHaveAttribute('aria-pressed', 'false');
        expect(canvas.getByRole('button', { name: /italic/i })).toHaveAttribute('aria-pressed', 'true');
      });
    });
  },
};

export const WithDisabled: Story = {
  name: 'Action — disabled item',
  render: () => (
    <ButtonGroup
      items={[
        { label: 'Play', icon: <Play className="w-4 h-4" />, onClick: () => {} },
        { label: 'Pause', icon: <Pause className="w-4 h-4" />, onClick: () => {}, active: true },
        {
          label: 'Skip',
          icon: <SkipForward className="w-4 h-4" />,
          onClick: () => {},
          disabled: true,
        },
      ]}
    />
  ),
};

// ── Single-select (controlled) ────────────────────────────

export const SingleSelectText: Story = {
  name: 'Single-select — text',
  render: () => {
    const [val, setVal] = React.useState('active');
    return (
      <ButtonGroup
        label="Filter by status"
        value={val}
        onChange={(v) => setVal(v as string)}
        items={[
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'draft', label: 'Draft' },
          { value: 'failed', label: 'Failed' },
        ]}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('Active is initially selected', async () => {
      expect(canvas.getByRole('radio', { name: /^active$/i })).toBeChecked();
    });
    await step('click Draft → Draft is selected, Active is deselected', async () => {
      await user.click(canvas.getByRole('radio', { name: /^draft$/i }));
      await waitFor(() => {
        expect(canvas.getByRole('radio', { name: /^draft$/i })).toBeChecked();
        expect(canvas.getByRole('radio', { name: /^active$/i })).not.toBeChecked();
      });
    });
  },
};

export const SingleSelectIconOnly: Story = {
  name: 'Single-select — icon only',
  render: () => {
    const [val, setVal] = React.useState('center');
    return (
      <ButtonGroup
        label="Alignment"
        showLabel={false}
        value={val}
        onChange={(v) => setVal(v as string)}
        items={[
          { value: 'left', label: 'Left', icon: <AlignLeft className="w-4 h-4" /> },
          { value: 'center', label: 'Center', icon: <AlignCenter className="w-4 h-4" /> },
          { value: 'right', label: 'Right', icon: <AlignRight className="w-4 h-4" /> },
        ]}
      />
    );
  },
};

export const SingleSelectIcons: Story = {
  name: 'Single-select — icons + text',
  render: () => {
    const [val, setVal] = React.useState('desktop');
    return (
      <ButtonGroup
        label="Viewport"
        value={val}
        onChange={(v) => setVal(v as string)}
        items={[
          { value: 'mobile', label: 'Mobile', icon: <Smartphone className="w-4 h-4" /> },
          { value: 'tablet', label: 'Tablet', icon: <Tablet className="w-4 h-4" /> },
          { value: 'desktop', label: 'Desktop', icon: <Monitor className="w-4 h-4" /> },
        ]}
      />
    );
  },
};
