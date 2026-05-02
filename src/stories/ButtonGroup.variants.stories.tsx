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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('Light is initially selected', async () => {
      expect(canvas.getByRole('radio', { name: /light/i })).toBeChecked();
    });
    await step('click Dark → Dark becomes selected, Light deselected', async () => {
      await user.click(canvas.getByRole('radio', { name: /dark/i }));
      await waitFor(() => {
        expect(canvas.getByRole('radio', { name: /dark/i })).toBeChecked();
        expect(canvas.getByRole('radio', { name: /light/i })).not.toBeChecked();
      });
    });
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

export const MultiSelect: Story = {
  name: 'Multi-select',
  render: () => {
    const [textVals, setTextVals] = React.useState<string[]>(['finance', 'hr']);
    const [fmtVals, setFmtVals] = React.useState<string[]>(['bold', 'italic']);
    return (
      <div className="flex flex-col gap-6">
        <ButtonGroup
          label="Filter departments"
          multiple
          value={textVals}
          onChange={(v) => setTextVals(v as string[])}
          hint="Select one or more departments."
          items={[
            { value: 'finance', label: 'Finance' },
            { value: 'hr', label: 'HR' },
            { value: 'support', label: 'Support' },
            { value: 'analytics', label: 'Analytics' },
          ]}
        />
        <ButtonGroup
          label="Text formatting"
          multiple
          value={fmtVals}
          onChange={(v) => setFmtVals(v as string[])}
          items={[
            { value: 'bold', label: 'Bold', icon: <Bold className="w-4 h-4" /> },
            { value: 'italic', label: 'Italic', icon: <Italic className="w-4 h-4" /> },
            { value: 'underline', label: 'Underline', icon: <Underline className="w-4 h-4" /> },
          ]}
        />
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('Finance and HR are initially checked; Support is not', async () => {
      expect(canvas.getByRole('checkbox', { name: /^finance$/i })).toBeChecked();
      expect(canvas.getByRole('checkbox', { name: /^hr$/i })).toBeChecked();
      expect(canvas.getByRole('checkbox', { name: /^support$/i })).not.toBeChecked();
    });
    await step('click Support → Support is added to selection', async () => {
      await user.click(canvas.getByRole('checkbox', { name: /^support$/i }));
      await waitFor(() => expect(canvas.getByRole('checkbox', { name: /^support$/i })).toBeChecked());
    });
    await step('click Finance → Finance is removed from selection', async () => {
      await user.click(canvas.getByRole('checkbox', { name: /^finance$/i }));
      await waitFor(() => expect(canvas.getByRole('checkbox', { name: /^finance$/i })).not.toBeChecked());
    });
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
  name: 'All sizes',
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

export const FullWidth: Story = {
  name: 'Full width',
  render: () => {
    const [alwaysVal, setAlwaysVal] = React.useState('active');
    const [mobileVal, setMobileVal] = React.useState('all');
    return (
      <div className="flex flex-col gap-6 max-w-sm">
        <ButtonGroup
          label="Always full width"
          fullWidth="always"
          value={alwaysVal}
          onChange={(v) => setAlwaysVal(v as string)}
          hint="Fills the container with equal-width options."
          items={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'draft', label: 'Draft' },
            { value: 'failed', label: 'Failed' },
          ]}
        />
        <ButtonGroup
          label="Mobile full width"
          fullWidth="mobile"
          value={mobileVal}
          onChange={(v) => setMobileVal(v as string)}
          hint="Full width on small screens, shrink-wrapped on sm+."
          items={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'draft', label: 'Draft' },
          ]}
        />
      </div>
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
