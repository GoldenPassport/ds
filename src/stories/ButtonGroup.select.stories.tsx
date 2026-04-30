import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  Grid2x2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Moon,
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

// ── Single-select (controlled) ────────────────────────────

export const ThemeToggle: Story = {
  name: 'Single-select — theme toggle',
  render: () => {
    const [val, setVal] = React.useState('light');
    return (
      <ButtonGroup
        label="Theme"
        value={val}
        onChange={(v) => setVal(v as string)}
        items={[
          { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
          { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
        ]}
      />
    );
  },
};

export const SingleSelectWithDisabled: Story = {
  name: 'Single-select — disabled option',
  render: () => {
    const [val, setVal] = React.useState('list');
    return (
      <ButtonGroup
        label="View"
        value={val}
        onChange={(v) => setVal(v as string)}
        hint="Grid view coming soon"
        items={[
          { value: 'list', label: 'List', icon: <List className="w-4 h-4" /> },
          { value: 'grid', label: 'Grid', icon: <Grid2x2 className="w-4 h-4" />, disabled: true },
        ]}
      />
    );
  },
};

// ── Multi-select (controlled) ─────────────────────────────

export const MultiSelectText: Story = {
  name: 'Multi-select — text',
  render: () => {
    const [vals, setVals] = React.useState<string[]>(['finance', 'hr']);
    return (
      <ButtonGroup
        label="Filter departments"
        multiple
        value={vals}
        onChange={(v) => setVals(v as string[])}
        hint="Select one or more departments."
        items={[
          { value: 'finance', label: 'Finance' },
          { value: 'hr', label: 'HR' },
          { value: 'support', label: 'Support' },
          { value: 'analytics', label: 'Analytics' },
        ]}
      />
    );
  },
};

export const MultiSelectIcons: Story = {
  name: 'Multi-select — icons + text',
  render: () => {
    const [vals, setVals] = React.useState<string[]>(['bold', 'italic']);
    return (
      <ButtonGroup
        label="Text formatting"
        multiple
        value={vals}
        onChange={(v) => setVals(v as string[])}
        items={[
          { value: 'bold', label: 'Bold', icon: <Bold className="w-4 h-4" /> },
          { value: 'italic', label: 'Italic', icon: <Italic className="w-4 h-4" /> },
          { value: 'underline', label: 'Underline', icon: <Underline className="w-4 h-4" /> },
        ]}
      />
    );
  },
};

// ── Variants ──────────────────────────────────────────────

export const GhostVariant: Story = {
  name: 'Variant — ghost',
  render: () => {
    const [val, setVal] = React.useState('months');
    return (
      <ButtonGroup
        variant="ghost"
        value={val}
        onChange={(v) => setVal(v as string)}
        items={['Years', 'Months', 'Days'].map((p) => ({
          value: p.toLowerCase(),
          label: p,
        }))}
      />
    );
  },
};

// ── Sizes ─────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ButtonGroup
          key={size}
          size={size}
          items={[
            { label: 'Years', onClick: () => {} },
            { label: 'Months', onClick: () => {}, active: true },
            { label: 'Days', onClick: () => {} },
          ]}
        />
      ))}
    </div>
  ),
};

// ── fullWidth ─────────────────────────────────────────────

export const FullWidthAlways: Story = {
  name: 'fullWidth — always',
  render: () => {
    const [val, setVal] = React.useState('active');
    return (
      <ButtonGroup
        label="Filter by status"
        fullWidth="always"
        value={val}
        onChange={(v) => setVal(v as string)}
        hint="Fills the container with equal-width options."
        items={[
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'draft', label: 'Draft' },
          { value: 'failed', label: 'Failed' },
        ]}
      />
    );
  },
};

export const FullWidthMobile: Story = {
  name: 'fullWidth — mobile',
  render: () => {
    const [val, setVal] = React.useState('all');
    return (
      <ButtonGroup
        label="Filter by status"
        fullWidth="mobile"
        value={val}
        onChange={(v) => setVal(v as string)}
        hint="Full width on small screens, shrink-wrapped on sm+."
        items={[
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'draft', label: 'Draft' },
        ]}
      />
    );
  },
};

// ── Composition ───────────────────────────────────────────

export const ToolbarComposition: Story = {
  name: 'Composition — toolbar with gap',
  render: () => {
    const [view, setView] = React.useState('list');
    const [align, setAlign] = React.useState('left');
    return (
      <div className="flex items-center gap-2">
        <ButtonGroup
          value={view}
          onChange={(v) => setView(v as string)}
          items={[
            { value: 'list', label: 'List', icon: <List className="w-4 h-4" /> },
            { value: 'grid', label: 'Grid', icon: <Grid2x2 className="w-4 h-4" /> },
          ]}
        />
        <ButtonGroup
          showLabel={false}
          value={align}
          onChange={(v) => setAlign(v as string)}
          items={[
            { value: 'left', label: 'Left', icon: <AlignLeft className="w-4 h-4" /> },
            { value: 'center', label: 'Center', icon: <AlignCenter className="w-4 h-4" /> },
            { value: 'right', label: 'Right', icon: <AlignRight className="w-4 h-4" /> },
          ]}
        />
        <ButtonGroup
          showLabel={false}
          items={[
            { label: 'Zoom in', icon: <ZoomIn className="w-4 h-4" />, onClick: () => {} },
            { label: 'Zoom out', icon: <ZoomOut className="w-4 h-4" />, onClick: () => {} },
            { label: 'Reset', icon: <RotateCcw className="w-4 h-4" />, onClick: () => {} },
          ]}
        />
      </div>
    );
  },
};

// ── Interactions ──────────────────────────────────────────

export const Interactions: Story = {
  name: 'Interactions — single select',
  render: () => {
    const [active, setActive] = React.useState('months');
    return (
      <div className="flex flex-col gap-4 p-4">
        <ButtonGroup
          items={['Years', 'Months', 'Days'].map((p) => ({
            label: p,
            active: active === p.toLowerCase(),
            onClick: () => setActive(p.toLowerCase()),
          }))}
        />
        <p className="text-xs font-body text-ink-500 dark:text-ink-300" data-testid="active-period">
          Active: {active}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('initial state — Months is active', async () => {
      expect(canvas.getByTestId('active-period')).toHaveTextContent('months');
    });

    await step('click Years — becomes active', async () => {
      await user.click(canvas.getByRole('button', { name: /years/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('active-period')).toHaveTextContent('years');
      });
    });

    await step('click Days — becomes active', async () => {
      await user.click(canvas.getByRole('button', { name: /days/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('active-period')).toHaveTextContent('days');
      });
    });
  },
};

export const MultiSelectInteractions: Story = {
  name: 'Interactions — multi select',
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(['bold']);
    return (
      <div className="flex flex-col gap-4 p-4">
        <ButtonGroup
          multiple
          value={selected}
          onChange={(v) => setSelected(v as string[])}
          items={[
            { label: 'Bold', value: 'bold', icon: <Bold className="w-4 h-4" /> },
            { label: 'Italic', value: 'italic', icon: <Italic className="w-4 h-4" /> },
            { label: 'Underline', value: 'underline', icon: <Underline className="w-4 h-4" /> },
          ]}
        />
        <p
          className="text-xs font-body text-ink-500 dark:text-ink-300"
          data-testid="selected-formats"
        >
          Formats: {selected.join(', ') || 'none'}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('click Italic — adds to selection', async () => {
      await user.click(canvas.getByRole('checkbox', { name: /italic/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('selected-formats')).toHaveTextContent('italic');
      });
    });

    await step('click Bold again — removes it from selection', async () => {
      await user.click(canvas.getByRole('checkbox', { name: /bold/i }));
      await waitFor(() => {
        expect(canvas.getByTestId('selected-formats')).not.toHaveTextContent('bold');
      });
    });
  },
};
