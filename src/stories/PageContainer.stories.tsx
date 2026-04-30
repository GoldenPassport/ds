import type { Meta, StoryObj } from '@storybook/react';
import { Plus } from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { Button } from '../components/Button';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Card } from '../components/Card';

const meta = {
  title: 'Layout/PageContainer',
  component: PageContainer,
  tags: ['autodocs'],
  argTypes: {
    maxWidth: { control: { type: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'] } },
    paddingX: { control: { type: 'select', options: ['none', 'sm', 'md', 'lg'] } },
    paddingY: { control: { type: 'select', options: ['none', 'sm', 'md', 'lg'] } },
    align: { control: { type: 'select', options: ['left', 'center', 'right'] } },
    mobilePadding: { control: 'boolean' },
    fullHeight: { control: 'boolean' },
    children: { control: false },
    className: { control: 'text' },
  },
} satisfies Meta<typeof PageContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared placeholder ────────────────────────────────────

function Placeholder({ label, h = 'h-32' }: { label: string; h?: string }) {
  return (
    <div
      className={`${h} rounded-2xl border-2 border-dashed border-ink-200 dark:border-ink-700 flex items-center justify-center`}
    >
      <span className="text-xs font-body text-ink-500 dark:text-ink-300">{label}</span>
    </div>
  );
}

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  // fullscreen removes Storybook's canvas padding so h-dvh fills exactly the
  // visible viewport — required for the fullHeight control to show correctly.
  parameters: { layout: 'fullscreen' },
  args: {
    maxWidth: 'xl',
    paddingX: 'md',
    paddingY: 'md',
    align: 'center',
    mobilePadding: true,
    fullHeight: false,
    children: null,
  },
  render: (args) => (
    <PageContainer {...args}>
      {/* flex-1 stretches to fill the column when fullHeight=true */}
      <Placeholder label="Page content" h={args.fullHeight ? 'flex-1' : 'h-48'} />
    </PageContainer>
  ),
};

// ── Width variants ────────────────────────────────────────

export const WidthVariants: Story = {
  name: 'Width variants',
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-6 py-4">
      {(['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const).map((w) => (
        <div key={w}>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2 px-2">
            maxWidth="{w}"
          </p>
          <PageContainer maxWidth={w}>
            <div className="h-12 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-700 flex items-center justify-center">
              <span className="text-xs font-body text-ink-500 dark:text-ink-300">{w}</span>
            </div>
          </PageContainer>
        </div>
      ))}
    </div>
  ),
};

// ── Padding variants ──────────────────────────────────────

export const PaddingVariants: Story = {
  name: 'Padding variants',
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-4 px-2 font-semibold">
          Horizontal padding (paddingX)
        </p>
        <div className="flex flex-col gap-4">
          {(['none', 'sm', 'md', 'lg'] as const).map((p) => (
            <div key={p}>
              <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2 px-2">
                paddingX="{p}"
              </p>
              <div className="bg-ink-100 dark:bg-ink-900 rounded-xl">
                <PageContainer maxWidth="xl" paddingX={p}>
                  <Placeholder label={`paddingX="${p}"`} h="h-10" />
                </PageContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-4 px-2 font-semibold">
          Vertical padding (paddingY)
        </p>
        <div className="flex flex-col gap-4">
          {(['none', 'sm', 'md', 'lg'] as const).map((p) => (
            <div key={p}>
              <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2 px-2">
                paddingY="{p}"
              </p>
              <div className="bg-ink-100 dark:bg-ink-900 rounded-xl">
                <PageContainer maxWidth="xl" paddingY={p}>
                  <Placeholder label={`paddingY="${p}"`} h="h-10" />
                </PageContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ── Alignment ─────────────────────────────────────────────

export const Alignment: Story = {
  name: 'Alignment (left / center / right)',
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-4">
      {(['left', 'center', 'right'] as const).map((a) => (
        <div key={a}>
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2 px-2">align="{a}"</p>
          <div className="bg-ink-100 dark:bg-ink-900 rounded-xl">
            <PageContainer maxWidth="sm" align={a}>
              <div className="h-12 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-700 flex items-center justify-center">
                <span className="text-xs font-body text-ink-500 dark:text-ink-300">{a}</span>
              </div>
            </PageContainer>
          </div>
        </div>
      ))}
    </div>
  ),
};

// ── Mobile padding ────────────────────────────────────────

export const MobilePadding: Story = {
  name: 'Mobile padding toggle',
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2 px-2">
          mobilePadding=true (default)
        </p>
        <div className="bg-ink-100 dark:bg-ink-900 rounded-xl">
          <PageContainer maxWidth="xl" mobilePadding={true}>
            <Placeholder label="Has padding on all screen sizes" h="h-12" />
          </PageContainer>
        </div>
      </div>
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2 px-2">
          mobilePadding=false
        </p>
        <div className="bg-ink-100 dark:bg-ink-900 rounded-xl">
          <PageContainer maxWidth="xl" mobilePadding={false}>
            <Placeholder label="No padding on mobile, padded on sm+" h="h-12" />
          </PageContainer>
        </div>
      </div>
    </div>
  ),
};

// ── With page heading ─────────────────────────────────────

export const WithPageHeading: Story = {
  name: 'With page heading',
  args: { children: null },
  render: () => (
    <PageContainer maxWidth="xl">
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight">
              Projects
            </h1>
            <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-300">
              All projects in your workspace.
            </p>
          </div>
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            New project
          </Button>
        </div>
        <Placeholder label="Page content" h="h-64" />
      </div>
    </PageContainer>
  ),
};

// ── With breadcrumbs and heading ──────────────────────────

export const WithBreadcrumbs: Story = {
  name: 'With breadcrumbs and heading',
  args: { children: null },
  render: () => (
    <PageContainer maxWidth="xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Breadcrumbs
            items={[
              { label: 'Projects', href: '#' },
              { label: 'GraphQL API', href: '#' },
              { label: 'Settings' },
            ]}
            homeIcon
          />
          <div className="flex items-start justify-between gap-4 mt-1">
            <div>
              <h1 className="text-2xl font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight">
                Settings
              </h1>
              <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-300">
                Manage configuration and access for this project.
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Save changes
            </Button>
          </div>
        </div>
        <Placeholder label="Page content" h="h-64" />
      </div>
    </PageContainer>
  ),
};

// ── Full width ────────────────────────────────────────────

export const FullWidth: Story = {
  name: 'Full width — paddingX=none',
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2 px-2">
          paddingX="md" (default)
        </p>
        <PageContainer maxWidth="full">
          <Placeholder label="Content with responsive padding" h="h-20" />
        </PageContainer>
      </div>
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-2 px-2">
          paddingX="none"
        </p>
        <PageContainer maxWidth="full" paddingX="none">
          <Placeholder label="Edge-to-edge content (no padding)" h="h-20" />
        </PageContainer>
      </div>
    </div>
  ),
};

// ── Full height ───────────────────────────────────────────

export const FullHeight: Story = {
  name: 'Full height',
  parameters: { layout: 'fullscreen' },
  args: { children: null },
  render: () => (
    <PageContainer
      maxWidth="xl"
      paddingX="md"
      paddingY="md"
      fullHeight
      className="bg-ink-50 dark:bg-ink-900"
    >
      <div className="flex flex-col gap-6 flex-1">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight">
              Full-height container
            </h1>
            <p className="mt-0.5 text-sm font-body text-ink-500 dark:text-ink-300">
              Height locked to the viewport — scroll here, the page never scrolls.
            </p>
          </div>
          <Button variant="primary" size="sm" className="self-start sm:self-auto">
            <Plus className="w-3.5 h-3.5" />
            New item
          </Button>
        </div>

        {/* Cards that overflow the viewport to prove scrolling works */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i}>
              <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">
                Card {i + 1}
              </p>
              <p className="mt-1 text-xs font-body text-ink-500 dark:text-ink-300">
                Scroll to see all cards — content stays inside the container.
              </p>
            </Card>
          ))}
        </div>

        {/* Filler stretches to fill remaining space when content is short */}
        <Placeholder label="Remaining height (flex-1)" h="flex-1" />
      </div>
    </PageContainer>
  ),
};

// ── Full height — responsive ──────────────────────────────

export const FullHeightResponsive: Story = {
  name: 'Full height — responsive',
  parameters: {
    layout: 'fullscreen',
    // Cycle through these viewports in Storybook's viewport toolbar
    // to verify the container, padding, and gutter all adapt correctly.
    viewport: { defaultViewport: 'mobile1' },
  },
  args: { children: null },
  render: () => (
    <PageContainer
      maxWidth="xl"
      paddingX="md"
      paddingY="md"
      fullHeight
      className="bg-ink-50 dark:bg-ink-900"
    >
      <div className="flex flex-col gap-4 flex-1">
        {/* Responsive header row — stacks on mobile, inline on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight">
              Responsive page
            </h1>
            <p className="mt-0.5 text-sm font-body text-ink-500 dark:text-ink-300">
              Padding, gutter, and layout all adapt across breakpoints.
            </p>
          </div>
          <Button variant="primary" size="sm" className="self-start sm:self-auto">
            <Plus className="w-3.5 h-3.5" />
            New item
          </Button>
        </div>

        {/* Responsive grid — 1 col → 2 col → 3 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'px: none → md → lg',
            'py: 24px → 32px',
            'max-w: xl (80rem)',
            'grid: 1 → 2 → 3 col',
            'overscroll-contain',
            'fixed inset-0',
          ].map((label) => (
            <Card key={label}>
              <p className="text-xs font-semibold font-body text-ink-500 dark:text-ink-300">
                {label}
              </p>
            </Card>
          ))}
        </div>

        {/* Filler that stretches to fill remaining height */}
        <Placeholder label="Remaining height (flex-1)" h="flex-1" />
      </div>
    </PageContainer>
  ),
};

// ── In context — typical page ─────────────────────────────

export const InContext: Story = {
  name: 'In context — typical page layout',
  args: { children: null },
  render: () => (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900 py-8">
      <PageContainer maxWidth="xl">
        <div className="flex flex-col gap-6">
          {/* Page header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-display text-ink-900 dark:text-ink-50 tracking-tight">
                Dashboard
              </h1>
              <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-300">
                Welcome back, Leslie. Here's what's happening today.
              </p>
            </div>
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              New project
            </Button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Total projects', 'Active runs', 'Team members'].map((label) => (
              <Card key={label}>
                <p className="text-xs font-body text-ink-500 dark:text-ink-300">{label}</p>
                <p className="mt-1 text-2xl font-bold font-display text-ink-900 dark:text-ink-50">
                  {label === 'Total projects' ? '12' : label === 'Active runs' ? '4' : '8'}
                </p>
              </Card>
            ))}
          </div>

          {/* Main content area */}
          <Placeholder label="Main content" h="h-80" />
        </div>
      </PageContainer>
    </div>
  ),
};
