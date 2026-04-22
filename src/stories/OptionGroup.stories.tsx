import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Monitor, Tablet, Smartphone, AlignLeft, AlignCenter, AlignRight, Sun, Moon, Grid2x2, List } from 'lucide-react';
import { OptionGroup } from '../components/OptionGroup';

const meta = {
  title: 'Components/OptionGroup',
  component: OptionGroup,
  tags: ['autodocs'],
  argTypes: {
    multiple:  { control: 'boolean',                               description: 'Allow selecting multiple options simultaneously' },
    size:      { control: 'select', options: ['sm', 'md', 'lg'],  description: 'Button size' },
    label:     { control: 'text',                                  description: 'Label above the group' },
    hint:      { control: 'text',                                  description: 'Helper text below the group' },
    options:   { control: false,                                   description: 'Array of { value, label, icon?, disabled? }' },
    value:     { control: false,                                   description: 'Selected value (T) or values (T[]) — controlled' },
    onChange:  { control: false,                                   description: 'Called with the new value or values array' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof OptionGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Single-select ─────────────────────────────────────────

export const Playground: Story = {
  args: { size: 'md', multiple: false, label: 'Viewport' },
  render: (args) => {
    const [val, setVal] = React.useState('desktop');
    return (
      <OptionGroup
        {...args}
        value={val}
        onChange={v => setVal(v as string)}
        options={[
          { value: 'mobile',  label: '375px' },
          { value: 'tablet',  label: '768px' },
          { value: 'desktop', label: 'Full'  },
        ]}
      />
    );
  },
};

export const TextOptions: Story = {
  name: 'Single-select — text',
  render: () => {
    const [val, setVal] = React.useState('active');
    return (
      <OptionGroup
        label="Filter by status"
        value={val}
        onChange={v => setVal(v as string)}
        options={[
          { value: 'all',     label: 'All'     },
          { value: 'active',  label: 'Active'  },
          { value: 'draft',   label: 'Draft'   },
          { value: 'failed',  label: 'Failed'  },
        ]}
      />
    );
  },
};

export const WithIcons: Story = {
  name: 'Single-select — icons + text',
  render: () => {
    const [val, setVal] = React.useState('desktop');
    return (
      <OptionGroup
        label="Viewport"
        value={val}
        onChange={v => setVal(v as string)}
        options={[
          { value: 'mobile',  label: 'Mobile',  icon: <Smartphone className="w-4 h-4" /> },
          { value: 'tablet',  label: 'Tablet',  icon: <Tablet     className="w-4 h-4" /> },
          { value: 'desktop', label: 'Desktop', icon: <Monitor    className="w-4 h-4" /> },
        ]}
      />
    );
  },
};

export const IconsOnly: Story = {
  name: 'Single-select — icons only',
  render: () => {
    const [val, setVal] = React.useState('center');
    return (
      <OptionGroup
        label="Alignment"
        value={val}
        onChange={v => setVal(v as string)}
        options={[
          { value: 'left',   label: 'Left',   icon: <AlignLeft   className="w-4 h-4" /> },
          { value: 'center', label: 'Center', icon: <AlignCenter className="w-4 h-4" /> },
          { value: 'right',  label: 'Right',  icon: <AlignRight  className="w-4 h-4" /> },
        ]}
      />
    );
  },
};

export const ThemeToggle: Story = {
  name: 'Single-select — theme toggle',
  render: () => {
    const [val, setVal] = React.useState('light');
    return (
      <OptionGroup
        label="Theme"
        value={val}
        onChange={v => setVal(v as string)}
        options={[
          { value: 'light', label: 'Light', icon: <Sun  className="w-4 h-4" /> },
          { value: 'dark',  label: 'Dark',  icon: <Moon className="w-4 h-4" /> },
        ]}
      />
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const opts = [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
      { value: 'c', label: 'Option C' },
    ];
    const [sm, setSm] = React.useState('a');
    const [md, setMd] = React.useState('b');
    const [lg, setLg] = React.useState('c');
    return (
      <div className="flex flex-col gap-6">
        <OptionGroup label="Small"  size="sm" value={sm} onChange={v => setSm(v as string)} options={opts} />
        <OptionGroup label="Medium" size="md" value={md} onChange={v => setMd(v as string)} options={opts} />
        <OptionGroup label="Large"  size="lg" value={lg} onChange={v => setLg(v as string)} options={opts} />
      </div>
    );
  },
};

export const WithDisabledOption: Story = {
  name: 'Single-select — disabled option',
  render: () => {
    const [val, setVal] = React.useState('list');
    return (
      <OptionGroup
        label="View"
        value={val}
        onChange={v => setVal(v as string)}
        options={[
          { value: 'list', label: 'List', icon: <List      className="w-4 h-4" /> },
          { value: 'grid', label: 'Grid', icon: <Grid2x2   className="w-4 h-4" />, disabled: true },
        ]}
        hint="Grid view coming soon"
      />
    );
  },
};

// ── Multi-select ──────────────────────────────────────────

export const MultiSelect: Story = {
  name: 'Multi-select — departments',
  render: () => {
    const [vals, setVals] = React.useState<string[]>(['finance', 'hr']);
    return (
      <OptionGroup
        label="Filter departments"
        multiple
        value={vals}
        onChange={v => setVals(v as string[])}
        options={[
          { value: 'finance',     label: 'Finance'     },
          { value: 'hr',          label: 'HR'          },
          { value: 'support',     label: 'Support'     },
          { value: 'analytics',   label: 'Analytics'   },
        ]}
        hint="Select one or more departments to filter workflows."
      />
    );
  },
};

export const MultiSelectIcons: Story = {
  name: 'Multi-select — icons',
  render: () => {
    const [vals, setVals] = React.useState<string[]>(['left', 'center']);
    return (
      <OptionGroup
        label="Text decorations"
        multiple
        value={vals}
        onChange={v => setVals(v as string[])}
        options={[
          { value: 'left',   label: 'Left',   icon: <AlignLeft   className="w-4 h-4" /> },
          { value: 'center', label: 'Center', icon: <AlignCenter className="w-4 h-4" /> },
          { value: 'right',  label: 'Right',  icon: <AlignRight  className="w-4 h-4" /> },
        ]}
      />
    );
  },
};
