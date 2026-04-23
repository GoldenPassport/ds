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

// ── PageContainer ─────────────────────────────────────────

export function PageContainer({
  children,
  maxWidth      = 'xl',
  paddingX      = 'md',
  paddingY      = 'none',
  align         = 'center',
  mobilePadding = true,
  className     = '',
}: PageContainerProps) {
  const px = paddingXCls[paddingX][mobilePadding ? 'withMobile' : 'noMobile'];
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
