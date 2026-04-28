import React from 'react';

// ── Types ─────────────────────────────────────────────────

/**
 * sm   → 48rem  / 768px
 * md   → 64rem  / 1024px
 * lg   → 72rem  / 1152px
 * xl   → 80rem  / 1280px — default
 * 2xl  → 96rem  / 1536px
 * full → no max-width
 */
export type PageContainerWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export type PageContainerPadding = 'none' | 'sm' | 'md' | 'lg';

export type PageContainerAlign = 'left' | 'center' | 'right';

export interface PageContainerProps {
  children:       React.ReactNode;
  /** Maximum content width. Default: 'xl' */
  maxWidth?:      PageContainerWidth;
  /** Horizontal padding. Default: 'md' */
  paddingX?:      PageContainerPadding;
  /** Vertical padding. Default: 'none' */
  paddingY?:      PageContainerPadding;
  /** Alignment when maxWidth is not 'full'. Default: 'center' */
  align?:         PageContainerAlign;
  /** Include horizontal padding at mobile breakpoint. Default: true */
  mobilePadding?: boolean;
  /**
   * Locks the container to the full visible viewport height using
   * `position: fixed; inset: 0`. This is the only approach that works
   * reliably inside iframes (Storybook, embedded apps) because it anchors
   * directly to the viewport — no ancestor height or body-overflow setup needed.
   * Content that overflows scrolls inside the container; the page never scrolls.
   * `paddingY` is applied to the inner column, not the scroll shell, so it never
   * creates a phantom scroll on mobile.
   * Direct children can use `flex-1` to fill remaining height.
   *
   * In `fullHeight` mode, `className` is applied to the outer scroll shell
   * (the `fixed inset-0` element), not to the inner content column. This lets
   * you offset a fixed navbar by passing e.g. `className="top-16"` — the
   * `inset-0` default sets all four edges to 0, so a `top-*` utility on the
   * same element overrides only the top edge, leaving right/bottom/left at 0.
   *
   * Default: false
   */
  fullHeight?:    boolean;
  className?:     string;
}

// ── Maps ──────────────────────────────────────────────────

const widthCls: Record<PageContainerWidth, string> = {
  sm:   'max-w-[48rem]',
  md:   'max-w-[64rem]',
  lg:   'max-w-[72rem]',
  xl:   'max-w-[80rem]',
  '2xl':'max-w-[96rem]',
  full: '',
};

const alignCls: Record<PageContainerAlign, string> = {
  left:   'mr-auto',
  center: 'mx-auto',
  right:  'ml-auto',
};

// paddingX with/without mobile
const paddingXCls: Record<PageContainerPadding, { withMobile: string; noMobile: string }> = {
  none: { withMobile: '',                          noMobile: '' },
  sm:   { withMobile: 'px-3 sm:px-4 lg:px-6',     noMobile: 'sm:px-4 lg:px-6' },
  md:   { withMobile: 'px-4 sm:px-6 lg:px-8',     noMobile: 'sm:px-6 lg:px-8' },
  lg:   { withMobile: 'px-6 sm:px-8 lg:px-12',    noMobile: 'sm:px-8 lg:px-12' },
};

const paddingYCls: Record<PageContainerPadding, string> = {
  none: '',
  sm:   'py-4 sm:py-6',
  md:   'py-6 sm:py-8',
  lg:   'py-8 sm:py-12',
};

// Split top/bottom for fullHeight mode. Both live on the inner column (not the
// outer shell). The old approach put pb on the outer scroll shell to work
// around a padding-bottom-clipping bug in overflow:auto containers, but that
// made the scrollable area 1×pb taller than the viewport — causing a phantom
// scroll on mobile. The clipping bug has been fixed in all evergreen browsers
// and is not a concern for a 2024+ design system.
const paddingTopCls: Record<PageContainerPadding, string> = {
  none: '',
  sm:   'pt-4 sm:pt-6',
  md:   'pt-6 sm:pt-8',
  lg:   'pt-8 sm:pt-12',
};

const paddingBottomCls: Record<PageContainerPadding, string> = {
  none: '',
  sm:   'pb-4 sm:pb-6',
  md:   'pb-6 sm:pb-8',
  lg:   'pb-8 sm:pb-12',
};

// ── PageContainer ─────────────────────────────────────────

export function PageContainer({
  children,
  maxWidth      = 'xl',
  paddingX      = 'md',
  paddingY      = 'none',
  align         = 'center',
  mobilePadding = true,
  fullHeight    = false,
  className     = '',
}: PageContainerProps) {
  const px = paddingXCls[paddingX][mobilePadding ? 'withMobile' : 'noMobile'];

  if (fullHeight) {
    const pt = paddingTopCls[paddingY];
    const pb = paddingBottomCls[paddingY];

    return (
      <div className={[
        // fixed inset-0: anchors directly to the viewport — immune to parent
        // padding, body-height quirks, and iframe sizing differences.
        // This is the only approach that reliably fills the visible area
        // in all contexts (Storybook, embedded iframes, real apps).
        // overscroll-contain stops scroll-chaining on mobile (bounce/bleed-through).
        // No padding here — padding on the outer scroll shell adds to the
        // scrollable height, which pushes the total content past the viewport
        // and creates a phantom scroll on mobile.
        'fixed inset-0 overflow-y-auto overscroll-contain',
        className,
      ].filter(Boolean).join(' ')}>
        <div className={[
          // min-h-full: fills the viewport when content is short.
          // flex flex-col: lets direct children use flex-1 to fill remaining height.
          // pt + pb both live here — padding on a child of overflow:auto is
          // correctly rendered in all evergreen browsers.
          'w-full min-h-full flex flex-col',
          widthCls[maxWidth],
          alignCls[align],
          px,
          pt,
          pb,
        ].filter(Boolean).join(' ')}>
          {children}
        </div>
      </div>
    );
  }

  // Normal mode: single element, paddingY and className on the column itself.
  const py = paddingYCls[paddingY];

  return (
    <div className={[
      'w-full',
      widthCls[maxWidth],
      alignCls[align],
      px,
      py,
      className,
    ].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
