import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export interface CarouselItem {
  id:        string | number;
  image?:    string;
  title?:    string;
  subtitle?: string;
  label?:    string;
  content?:  React.ReactNode;
}

/**
 * M3 Carousel layout variants:
 * - multi-browse  : varying item widths — large leading item, smaller trailing items visible
 * - hero          : one dominant item per view, small peek of next (default)
 * - uncontained   : uniform items scroll edge-to-edge
 * - full-screen   : each item fills the full container width
 */
export type CarouselVariant = 'multi-browse' | 'hero' | 'uncontained' | 'full-screen';

export interface CarouselProps {
  items:              CarouselItem[];
  variant?:           CarouselVariant;
  /** Show previous/next arrow buttons */
  showArrows?:        boolean;
  /** Show dot indicators */
  showIndicators?:    boolean;
  autoPlay?:          boolean;
  autoPlayInterval?:  number;
  /** Aspect ratio of each item — Tailwind aspect class e.g. 'aspect-video' */
  aspectRatio?:       string;
  /** Accessible label for the carousel region. Override when multiple carousels appear on the same page. */
  'aria-label'?:      string;
  className?:         string;
}

// ── Item sizes per variant ─────────────────────────────────

const variantItemCls: Record<CarouselVariant, string> = {
  'multi-browse': 'snap-start shrink-0',
  'hero':         'snap-center shrink-0 w-[85%]',
  'uncontained':  'snap-start shrink-0 w-[78%]',
  'full-screen':  'snap-start shrink-0 w-full',
};

const containerPadding: Record<CarouselVariant, string> = {
  'multi-browse': 'px-4',
  'hero':         'px-[7.5%]',
  'uncontained':  'px-4',
  'full-screen':  'px-0',
};

const itemGap: Record<CarouselVariant, string> = {
  'multi-browse': 'gap-3',
  'hero':         'gap-3',
  'uncontained':  'gap-3',
  'full-screen':  'gap-0',
};

const itemRadius: Record<CarouselVariant, string> = {
  'multi-browse': 'rounded-3xl',
  'hero':         'rounded-[28px]',
  'uncontained':  'rounded-3xl',
  'full-screen':  'rounded-none',
};

// ── Multi-browse item widths (first=large, rest=smaller) ──

function multiBrowseWidth(index: number, total: number): string {
  if (index === 0) return 'w-[58%]';
  if (index === total - 1) return 'w-[22%]';
  return 'w-[38%]';
}

// ── Carousel item card ─────────────────────────────────────

function CarouselCard({
  item,
  radius,
  aspect,
}: {
  item:   CarouselItem;
  radius: string;
  aspect: string;
}) {
  // Compose a full accessible description from all text fields for the img alt
  const altText = [item.label, item.title, item.subtitle].filter(Boolean).join(' — ') || '';

  return (
    <div className={`relative overflow-hidden bg-ink-200 dark:bg-ink-700 ${radius} ${aspect} h-full`}>
      {item.image && (
        <img
          src={item.image}
          alt={altText}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      )}
      {/* Caption strip — solid bg so axe can compute contrast; aria-hidden since img alt carries the info */}
      {(item.title || item.subtitle || item.label || item.content) && (
        <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 bg-ink-900 px-4 py-3">
          {item.label && (
            <span className="inline-block mb-1 px-2 py-0.5 rounded-full bg-ink-700 text-ink-50 text-xs font-medium font-body">
              {item.label}
            </span>
          )}
          {item.title && (
            <p className="text-ink-50 font-semibold font-display text-base leading-snug line-clamp-2">
              {item.title}
            </p>
          )}
          {item.subtitle && (
            <p className="mt-0.5 text-ink-300 text-xs font-body line-clamp-1">
              {item.subtitle}
            </p>
          )}
          {item.content}
        </div>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────

export function Carousel({
  items,
  variant           = 'hero',
  showArrows        = true,
  showIndicators    = true,
  autoPlay          = false,
  autoPlayInterval  = 4000,
  aspectRatio       = 'aspect-[4/3]',
  'aria-label':     trackAriaLabel = 'Carousel items',
  className         = '',
}: CarouselProps) {
  const trackRef    = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  // ── Track active item via IntersectionObserver ────────────
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const children = Array.from(track.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = children.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { root: track, threshold: 0.5 }
    );
    children.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, [items]);

  // ── Auto play ─────────────────────────────────────────────
  React.useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => scrollTo((active + 1) % items.length), autoPlayInterval);
    return () => clearInterval(id);
  }, [autoPlay, autoPlayInterval, active, items.length]);

  // ── Scroll helpers ────────────────────────────────────────
  const scrollTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[index] as HTMLElement;
    if (!child) return;
    child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: variant === 'hero' ? 'center' : 'start' });
    setActive(index);
  };

  const prev = () => scrollTo(Math.max(0, active - 1));
  const next = () => scrollTo(Math.min(items.length - 1, active + 1));

  const radius = itemRadius[variant];

  return (
    <div className={`relative w-full select-none ${className}`}>

      {/* ── Track ── */}
      <div
        ref={trackRef}
        role="region"
        tabIndex={0}
        aria-label={trackAriaLabel}
        className={[
          'flex overflow-x-auto scroll-smooth',
          'scrollbar-hide',
          'scroll-snap-type-x-mandatory',   // handled inline below
          containerPadding[variant],
          itemGap[variant],
          'py-2',
        ].join(' ')}
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {items.map((item, i) => {
          const widthCls = variant === 'multi-browse'
            ? multiBrowseWidth(i, items.length)
            : variantItemCls[variant].split(' ').find(c => c.startsWith('w-')) ?? '';

          const snapCls = variant === 'hero' ? 'snap-center' : 'snap-start';

          return (
            <div
              key={item.id}
              className={`${snapCls} shrink-0 ${widthCls}`}
              style={{ scrollSnapAlign: variant === 'hero' ? 'center' : 'start' }}
            >
              <CarouselCard item={item} radius={radius} aspect={aspectRatio} />
            </div>
          );
        })}
      </div>

      {/* ── Arrows ── */}
      {showArrows && items.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            disabled={active === 0}
            aria-label="Previous"
            className={[
              'absolute left-2 top-1/2 -translate-y-1/2 z-10',
              'w-10 h-10 rounded-full flex items-center justify-center',
              'bg-white/90 dark:bg-ink-800/90 shadow-md backdrop-blur-sm',
              'text-ink-700 dark:text-ink-200 transition-all duration-150',
              'hover:bg-white dark:hover:bg-ink-700',
              'disabled:opacity-0 disabled:pointer-events-none',
            ].join(' ')}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={active === items.length - 1}
            aria-label="Next"
            className={[
              'absolute right-2 top-1/2 -translate-y-1/2 z-10',
              'w-10 h-10 rounded-full flex items-center justify-center',
              'bg-white/90 dark:bg-ink-800/90 shadow-md backdrop-blur-sm',
              'text-ink-700 dark:text-ink-200 transition-all duration-150',
              'hover:bg-white dark:hover:bg-ink-700',
              'disabled:opacity-0 disabled:pointer-events-none',
            ].join(' ')}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* ── Indicators ── */}
      {showIndicators && items.length > 1 && (
        <div className="mt-3 flex justify-center items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={[
                'rounded-full transition-all duration-300',
                i === active
                  ? 'w-6 h-2 bg-primary-500'
                  : 'w-2 h-2 bg-ink-300 dark:bg-ink-600 hover:bg-ink-400 dark:hover:bg-ink-500',
              ].join(' ')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
