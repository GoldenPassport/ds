import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from '../components/Carousel';
import type { CarouselItem } from '../components/Carousel';

const meta = {
  title: 'Lists/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant:         { control: 'select', options: ['multi-browse', 'hero', 'uncontained', 'full-screen'] },
    aspectRatio:     { control: 'select', options: ['aspect-square', 'aspect-video', 'aspect-[4/3]', 'aspect-[3/4]'] },
    showArrows:      { control: 'boolean' },
    showIndicators:  { control: 'boolean' },
    autoPlay:        { control: 'boolean' },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Fixtures ──────────────────────────────────────────────

const NATURE: CarouselItem[] = [
  { id: 1, image: 'https://picsum.photos/seed/nature1/800/600',  title: 'Mountain Vista',    subtitle: 'Swiss Alps, Switzerland',    label: 'Featured'  },
  { id: 2, image: 'https://picsum.photos/seed/nature2/800/600',  title: 'Ocean Sunset',      subtitle: 'Malibu, California',         label: 'Popular'   },
  { id: 3, image: 'https://picsum.photos/seed/nature3/800/600',  title: 'Forest Path',       subtitle: 'Black Forest, Germany',                         },
  { id: 4, image: 'https://picsum.photos/seed/nature4/800/600',  title: 'Desert Dunes',      subtitle: 'Sahara, Morocco',            label: 'New'       },
  { id: 5, image: 'https://picsum.photos/seed/nature5/800/600',  title: 'Lakeside Calm',     subtitle: 'Banff, Canada',                                 },
  { id: 6, image: 'https://picsum.photos/seed/city1/800/600',    title: 'Night Skyline',     subtitle: 'Tokyo, Japan',               label: 'Trending'  },
];

const PORTRAIT: CarouselItem[] = [
  { id: 1, image: 'https://picsum.photos/seed/port1/600/800',  title: 'Urban Style',   subtitle: 'Street photography',  label: 'New' },
  { id: 2, image: 'https://picsum.photos/seed/port2/600/800',  title: 'Golden Hour',   subtitle: 'Portrait series'               },
  { id: 3, image: 'https://picsum.photos/seed/port3/600/800',  title: 'Monochrome',    subtitle: 'Black & white edit'            },
  { id: 4, image: 'https://picsum.photos/seed/port4/600/800',  title: 'Studio Soft',   subtitle: 'Indoor lighting'    ,label: 'Popular' },
];

const MINIMAL: CarouselItem[] = [
  { id: 1, image: 'https://picsum.photos/seed/arch1/800/600' },
  { id: 2, image: 'https://picsum.photos/seed/arch2/800/600' },
  { id: 3, image: 'https://picsum.photos/seed/arch3/800/600' },
  { id: 4, image: 'https://picsum.photos/seed/arch4/800/600' },
  { id: 5, image: 'https://picsum.photos/seed/arch5/800/600' },
];

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    items:           NATURE,
    variant:         'hero',
    showArrows:      true,
    showIndicators:  true,
    autoPlay:        false,
    aspectRatio:     'aspect-[4/3]',
  },
};

// ── Hero ──────────────────────────────────────────────────

export const Hero: Story = {
  name: 'Hero',
  args: { items: NATURE },
  render: () => (
    <div className="max-w-lg mx-auto">
      <Carousel items={NATURE} variant="hero" aspectRatio="aspect-[4/3]" />
    </div>
  ),
};

// ── Multi-browse ──────────────────────────────────────────

export const MultiBrowse: Story = {
  name: 'Multi-browse',
  args: { items: NATURE },
  render: () => (
    <Carousel items={NATURE} variant="multi-browse" aspectRatio="aspect-[4/3]" showIndicators={false} />
  ),
};

// ── Uncontained ───────────────────────────────────────────

export const Uncontained: Story = {
  name: 'Uncontained',
  args: { items: NATURE },
  render: () => (
    <Carousel items={NATURE} variant="uncontained" aspectRatio="aspect-[4/3]" />
  ),
};

// ── Full-screen ───────────────────────────────────────────

export const FullScreen: Story = {
  name: 'Full-screen',
  args: { items: NATURE },
  render: () => (
    <div className="max-w-sm mx-auto">
      <Carousel items={NATURE} variant="full-screen" aspectRatio="aspect-[3/4]" />
    </div>
  ),
};

// ── Portrait (3:4) ────────────────────────────────────────

export const Portrait: Story = {
  name: 'Portrait ratio — 3:4',
  args: { items: PORTRAIT },
  render: () => (
    <div className="max-w-sm mx-auto">
      <Carousel items={PORTRAIT} variant="hero" aspectRatio="aspect-[3/4]" />
    </div>
  ),
};

// ── Square ────────────────────────────────────────────────

export const Square: Story = {
  name: 'Square ratio — 1:1',
  args: { items: NATURE },
  render: () => (
    <div className="max-w-lg mx-auto">
      <Carousel items={NATURE} variant="uncontained" aspectRatio="aspect-square" />
    </div>
  ),
};

// ── No overlay (image only) ───────────────────────────────

export const ImageOnly: Story = {
  name: 'Image only — no text overlay',
  args: { items: MINIMAL },
  render: () => (
    <Carousel items={MINIMAL} variant="multi-browse" aspectRatio="aspect-video" showIndicators={false} />
  ),
};

// ── Auto play ─────────────────────────────────────────────

export const AutoPlay: Story = {
  name: 'Auto play',
  args: { items: NATURE },
  render: () => (
    <div className="max-w-lg mx-auto">
      <Carousel items={NATURE} variant="hero" autoPlay autoPlayInterval={3000} aspectRatio="aspect-[4/3]" />
    </div>
  ),
};

// ── No controls ───────────────────────────────────────────

export const NoControls: Story = {
  name: 'No controls — swipe only',
  args: { items: NATURE },
  render: () => (
    <div className="max-w-lg mx-auto">
      <Carousel items={NATURE} variant="hero" showArrows={false} showIndicators={false} aspectRatio="aspect-[4/3]" />
    </div>
  ),
};

// ── Dark mode ─────────────────────────────────────────────

export const Dark: Story = {
  name: 'Dark mode',
  args: { items: NATURE },
  render: () => (
    <div className="dark bg-ink-900 p-4 rounded-2xl">
      <Carousel items={NATURE} variant="hero" aspectRatio="aspect-[4/3]" />
    </div>
  ),
};

// ── All variants ──────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  args: { items: NATURE },
  render: () => (
    <div className="space-y-10">
      {(['hero', 'multi-browse', 'uncontained', 'full-screen'] as const).map(v => (
        <div key={v}>
          <p className="text-xs font-semibold font-body text-ink-400 uppercase tracking-wider mb-3 px-4 capitalize">
            {v.replace('-', ' ')}
          </p>
          <Carousel
            items={NATURE}
            variant={v}
            aspectRatio={v === 'full-screen' ? 'aspect-[3/4]' : 'aspect-[4/3]'}
            showIndicators={v !== 'multi-browse'}
          />
        </div>
      ))}
    </div>
  ),
};
