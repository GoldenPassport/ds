import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline,
  List, Grid2x2,
  ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, RotateCcw,
  Play, Pause, SkipForward,
} from 'lucide-react';
import { ButtonGroup } from '../components/ButtonGroup';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    size:      { control: 'select', options: ['sm', 'md', 'lg'],          description: 'Button size' },
    variant:   { control: 'select', options: ['default', 'ghost'],         description: '"default" has a background + border; "ghost" is borderless' },
    showLabel: { control: 'boolean',                                        description: 'Render button labels (set false for icon-only groups)' },
    items:     { control: false,                                            description: 'Array of { label, onClick, icon?, disabled?, active?, ariaLabel? }' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Basic ─────────────────────────────────────────────────

export const Playground: Story = {
  args: { size: 'md', variant: 'default', showLabel: true },
  render: (args) => (
    <ButtonGroup
      {...args}
      items={[
        { label: 'Years',  onClick: () => {} },
        { label: 'Months', onClick: () => {} },
        { label: 'Days',   onClick: () => {} },
      ]}
    />
  ),
};

export const TextOnly: Story = {
  name: 'Text — time period',
  render: () => {
    const [active, setActive] = React.useState('months');
    const periods = ['Years', 'Months', 'Days'] as const;
    return (
      <ButtonGroup
        items={periods.map(p => ({
          label:  p,
          active: active === p.toLowerCase(),
          onClick: () => setActive(p.toLowerCase()),
        }))}
      />
    );
  },
};

export const WithActiveState: Story = {
  name: 'Text — active item highlighted',
  render: () => {
    const [active, setActive] = React.useState('all');
    const filters = [
      { value: 'all',     label: 'All'     },
      { value: 'active',  label: 'Active'  },
      { value: 'draft',   label: 'Draft'   },
      { value: 'failed',  label: 'Failed'  },
    ];
    return (
      <ButtonGroup
        items={filters.map(f => ({
          label:  f.label,
          active: active === f.value,
          onClick: () => setActive(f.value),
        }))}
      />
    );
  },
};

// ── Icons + text ──────────────────────────────────────────

export const AlignmentGroup: Story = {
  name: 'Icons + text — alignment',
  render: () => {
    const [align, setAlign] = React.useState('left');
    const opts = [
      { value: 'left',   label: 'Left',   icon: <AlignLeft   className="w-4 h-4" /> },
      { value: 'center', label: 'Center', icon: <AlignCenter className="w-4 h-4" /> },
      { value: 'right',  label: 'Right',  icon: <AlignRight  className="w-4 h-4" /> },
    ];
    return (
      <ButtonGroup
        items={opts.map(o => ({
          label:  o.label,
          icon:   o.icon,
          active: align === o.value,
          onClick: () => setAlign(o.value),
        }))}
      />
    );
  },
};

export const ViewToggle: Story = {
  name: 'Icons + text — view toggle',
  render: () => {
    const [view, setView] = React.useState('list');
    return (
      <ButtonGroup
        items={[
          { label: 'List', icon: <List    className="w-4 h-4" />, active: view === 'list', onClick: () => setView('list') },
          { label: 'Grid', icon: <Grid2x2 className="w-4 h-4" />, active: view === 'grid', onClick: () => setView('grid') },
        ]}
      />
    );
  },
};

// ── Icon-only ─────────────────────────────────────────────

export const IconOnlyAlignment: Story = {
  name: 'Icon only — alignment toolbar',
  render: () => {
    const [align, setAlign] = React.useState('left');
    return (
      <ButtonGroup
        showLabel={false}
        items={[
          { label: 'Left',   ariaLabel: 'Align left',   icon: <AlignLeft   className="w-4 h-4" />, active: align === 'left',   onClick: () => setAlign('left')   },
          { label: 'Center', ariaLabel: 'Align center', icon: <AlignCenter className="w-4 h-4" />, active: align === 'center', onClick: () => setAlign('center') },
          { label: 'Right',  ariaLabel: 'Align right',  icon: <AlignRight  className="w-4 h-4" />, active: align === 'right',  onClick: () => setAlign('right')  },
        ]}
      />
    );
  },
};

export const IconOnlyFormatting: Story = {
  name: 'Icon only — text formatting',
  render: () => {
    const [fmt, setFmt] = React.useState<string[]>(['bold']);
    const toggle = (v: string) => setFmt(f => f.includes(v) ? f.filter(x => x !== v) : [...f, v]);
    return (
      <ButtonGroup
        showLabel={false}
        items={[
          { label: 'Bold',      icon: <Bold      className="w-4 h-4" />, active: fmt.includes('bold'),      onClick: () => toggle('bold')      },
          { label: 'Italic',    icon: <Italic    className="w-4 h-4" />, active: fmt.includes('italic'),    onClick: () => toggle('italic')    },
          { label: 'Underline', icon: <Underline className="w-4 h-4" />, active: fmt.includes('underline'), onClick: () => toggle('underline') },
        ]}
      />
    );
  },
};

export const Pagination: Story = {
  name: 'Icon only — pagination',
  render: () => (
    <ButtonGroup
      showLabel={false}
      items={[
        { label: 'Previous', ariaLabel: 'Previous page', icon: <ChevronLeft  className="w-4 h-4" />, onClick: () => {} },
        { label: 'Next',     ariaLabel: 'Next page',     icon: <ChevronRight className="w-4 h-4" />, onClick: () => {} },
      ]}
    />
  ),
};

export const ZoomControls: Story = {
  name: 'Icon only — zoom toolbar',
  render: () => (
    <ButtonGroup
      showLabel={false}
      items={[
        { label: 'Zoom in',  icon: <ZoomIn    className="w-4 h-4" />, onClick: () => {} },
        { label: 'Zoom out', icon: <ZoomOut   className="w-4 h-4" />, onClick: () => {} },
        { label: 'Reset',    icon: <RotateCcw className="w-4 h-4" />, onClick: () => {} },
      ]}
    />
  ),
};

// ── Variants ──────────────────────────────────────────────

export const GhostVariant: Story = {
  name: 'Variant — ghost',
  render: () => {
    const [active, setActive] = React.useState('months');
    return (
      <ButtonGroup
        variant="ghost"
        items={['Years', 'Months', 'Days'].map(p => ({
          label:  p,
          active: active === p.toLowerCase(),
          onClick: () => setActive(p.toLowerCase()),
        }))}
      />
    );
  },
};

// ── Sizes ─────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <ButtonGroup
          key={size}
          size={size}
          items={[
            { label: 'Years',  onClick: () => {} },
            { label: 'Months', onClick: () => {}, active: true },
            { label: 'Days',   onClick: () => {} },
          ]}
        />
      ))}
    </div>
  ),
};

// ── With disabled ─────────────────────────────────────────

export const WithDisabled: Story = {
  render: () => (
    <ButtonGroup
      items={[
        { label: 'Play',  icon: <Play        className="w-4 h-4" />, onClick: () => {} },
        { label: 'Pause', icon: <Pause       className="w-4 h-4" />, onClick: () => {}, active: true },
        { label: 'Skip',  icon: <SkipForward className="w-4 h-4" />, onClick: () => {}, disabled: true },
      ]}
    />
  ),
};

// ── Toolbar composition ───────────────────────────────────

export const ToolbarComposition: Story = {
  name: 'Composition — toolbar with gap',
  render: () => {
    const [view, setView]   = React.useState('list');
    const [align, setAlign] = React.useState('left');
    return (
      <div className="flex items-center gap-2">
        <ButtonGroup
          items={[
            { label: 'List', icon: <List    className="w-4 h-4" />, active: view === 'list', onClick: () => setView('list') },
            { label: 'Grid', icon: <Grid2x2 className="w-4 h-4" />, active: view === 'grid', onClick: () => setView('grid') },
          ]}
        />
        <ButtonGroup
          showLabel={false}
          items={[
            { label: 'Left',   icon: <AlignLeft   className="w-4 h-4" />, active: align === 'left',   onClick: () => setAlign('left')   },
            { label: 'Center', icon: <AlignCenter className="w-4 h-4" />, active: align === 'center', onClick: () => setAlign('center') },
            { label: 'Right',  icon: <AlignRight  className="w-4 h-4" />, active: align === 'right',  onClick: () => setAlign('right')  },
          ]}
        />
        <ButtonGroup
          showLabel={false}
          items={[
            { label: 'Zoom in',  icon: <ZoomIn    className="w-4 h-4" />, onClick: () => {} },
            { label: 'Zoom out', icon: <ZoomOut   className="w-4 h-4" />, onClick: () => {} },
            { label: 'Reset',    icon: <RotateCcw className="w-4 h-4" />, onClick: () => {} },
          ]}
        />
      </div>
    );
  },
};
