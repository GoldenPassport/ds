import type { Meta, StoryObj } from '@storybook/react';
import { Blockquote } from '../components/Blockquote';

const meta = {
  title: 'Layout/Blockquote',
  component: Blockquote,
  parameters: { layout: 'padded' },
  args: {
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Variants ──────────────────────────────────────────────

export const Default: Story = {
  name: 'Default',
  args: {
    author: 'Jane Smith',
    source: 'Lorem Quarterly',
  },
};

export const Bordered: Story = {
  name: 'Bordered',
  args: {
    variant: 'bordered',
    author: 'Jane Smith',
    source: 'Lorem Quarterly',
  },
};

export const Card: Story = {
  name: 'Card',
  args: {
    variant: 'card',
    author: 'Jane Smith',
    source: 'Lorem Quarterly',
  },
};

// ── Sizes ─────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col gap-10 max-w-2xl">
      <Blockquote size="sm" variant="bordered" author="Jane Smith" source="Lorem Quarterly">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Blockquote>
      <Blockquote size="md" variant="bordered" author="Jane Smith" source="Lorem Quarterly">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
      </Blockquote>
      <Blockquote size="lg" variant="bordered" author="Jane Smith" source="Lorem Quarterly">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
      </Blockquote>
    </div>
  ),
};

// ── Attribution combinations ───────────────────────────────

export const AuthorOnly: Story = {
  name: 'Author only',
  args: {
    variant: 'bordered',
    author: 'Jane Smith',
  },
};

export const SourceOnly: Story = {
  name: 'Source only',
  args: {
    variant: 'bordered',
    source: 'Lorem Quarterly, Issue 42',
  },
};

export const WithSourceLink: Story = {
  name: 'With source link',
  args: {
    variant: 'card',
    author: 'Jane Smith',
    source: 'Lorem Quarterly',
    sourceUrl: 'https://example.com',
  },
};

export const NoAttribution: Story = {
  name: 'No attribution',
  args: {
    variant: 'bordered',
  },
};

// ── All variants side by side ──────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div className="flex flex-col gap-10 max-w-2xl">
      <Blockquote
        variant="default"
        author="Jane Smith"
        source="Lorem Quarterly"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Blockquote>

      <Blockquote
        variant="bordered"
        author="Jane Smith"
        source="Lorem Quarterly"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Blockquote>

      <Blockquote
        variant="card"
        author="Jane Smith"
        source="Lorem Quarterly"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Blockquote>
    </div>
  ),
};
