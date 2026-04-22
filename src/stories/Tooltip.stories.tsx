import type { Meta, StoryObj } from '@storybook/react';
import { Info, Trash2, Copy, Play } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnButton: Story = {
  render: () => (
    <div className="flex justify-center pt-16">
      <Tooltip content="Run this workflow immediately" placement="top">
        <Button variant="primary"><Play className="w-4 h-4" /> Deploy</Button>
      </Tooltip>
    </div>
  ),
};

export const OnIconButton: Story = {
  render: () => (
    <div className="flex justify-center gap-4 pt-16">
      <Tooltip content="Copy workflow" placement="top">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-ink-100 dark:bg-ink-700 text-ink-500 dark:text-ink-300 hover:bg-ink-200 dark:hover:bg-ink-600 transition-colors border-0 cursor-pointer">
          <Copy className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip content="Delete permanently" placement="top">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition-colors border-0 cursor-pointer">
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  ),
};

export const AllPlacements: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-6 py-16">
      <Tooltip content="Appears on top" placement="top">
        <Badge label="Hover me (top)" variant="ai" />
      </Tooltip>
      <Tooltip content="Appears on bottom" placement="bottom">
        <Badge label="Hover me (bottom)" variant="ai" />
      </Tooltip>
      <div className="flex gap-8">
        <Tooltip content="Appears on left" placement="left">
          <Badge label="Hover me (left)" variant="ai" />
        </Tooltip>
        <Tooltip content="Appears on right" placement="right">
          <Badge label="Hover me (right)" variant="ai" />
        </Tooltip>
      </div>
    </div>
  ),
};

export const WithRichContent: Story = {
  render: () => (
    <div className="flex justify-center pt-16">
      <Tooltip
        placement="top"
        content={
          <span>
            <strong>AI-Generated</strong> — created via prompt on Apr 21, 2026
          </span>
        }
      >
        <button className="inline-flex items-center gap-1.5 text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-ink-300 transition-colors cursor-pointer bg-transparent border-0">
          <Info className="w-4 h-4" />
          <span className="text-sm font-body">About this workflow</span>
        </button>
      </Tooltip>
    </div>
  ),
};
