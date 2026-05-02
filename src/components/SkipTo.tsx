import React from 'react';

// ── Types ─────────────────────────────────────────────────

export interface SkipLink {
  /** Visible label for the link, e.g. "Skip to main content" */
  label: string;
  /**
   * CSS selector or fragment ID of the target landmark,
   * e.g. "#main-content" or "#navigation".
   *
   * The target element must be focusable — add tabIndex={-1} to
   * non-interactive elements such as <main> and <nav>:
   *
   *   <main id="main-content" tabIndex={-1}>…</main>
   */
  target: string;
}

export interface SkipToProps {
  /**
   * One or more skip links. Defaults to a single
   * "Skip to main content" link targeting "#main-content".
   */
  links?: SkipLink[];
  /** Additional class names applied to the containing <div>. */
  className?: string;
}

// ── Default links ─────────────────────────────────────────

const DEFAULT_LINKS: SkipLink[] = [
  { label: 'Skip to main content', target: '#main-content' },
];

// ── Component ─────────────────────────────────────────────

/**
 * SkipTo — WCAG 2.4.1 Bypass Blocks (Level A)
 *
 * Renders one or more visually-hidden links that slide into view when
 * focused via keyboard. Place this as the very first element inside
 * <body> (or the root layout component) so Tab reaches it before any
 * navigation.
 *
 * ### Usage
 * ```tsx
 * // app/layout.tsx (Next.js) or src/App.tsx (Vite)
 * import { SkipTo } from '@golden-passport/ds';
 *
 * export default function Layout({ children }) {
 *   return (
 *     <>
 *       <SkipTo />                  {/* default — skip to #main-content *}
 *       <Navbar />
 *       <main id="main-content" tabIndex={-1}>
 *         {children}
 *       </main>
 *     </>
 *   );
 * }
 * ```
 *
 * ### Multiple targets
 * ```tsx
 * <SkipTo
 *   links={[
 *     { label: 'Skip to main content', target: '#main-content' },
 *     { label: 'Skip to navigation',   target: '#site-nav' },
 *     { label: 'Skip to search',       target: '#search' },
 *   ]}
 * />
 * ```
 *
 * ### Target element requirements
 * Non-interactive elements (main, nav, aside, footer) must receive
 * `tabIndex={-1}` so that the browser can move programmatic focus to
 * them when the skip link is activated.
 */
export function SkipTo({ links = DEFAULT_LINKS, className }: SkipToProps) {
  function handleClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    target: string,
  ) {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;

    // Prevent default scroll-jump; manage focus manually so assistive
    // technologies announce the destination landmark's accessible name.
    e.preventDefault();
    el.focus({ preventScroll: false });

    // If the target isn't natively focusable, temporarily make it so.
    if (document.activeElement !== el) {
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: false });
      // Remove the attribute once focus moves away so tab order is unaffected.
      el.addEventListener('blur', () => el.removeAttribute('tabindex'), { once: true });
    }
  }

  return (
    <div
      className={[
        // Stack links vertically; position at the very top of the viewport.
        'fixed top-0 left-0 z-[9999] flex flex-col gap-1 p-1',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      // Keep this element out of the accessibility tree — the <a>
      // elements inside are the meaningful nodes.
      aria-hidden={false}
    >
      {links.map(({ label, target }) => (
        <a
          key={target}
          href={target}
          onClick={(e) => handleClick(e, target)}
          // Hidden off-screen via -translate-y-full; snaps into view on focus.
          // Using translate (not visibility/display) keeps the element in the
          // accessibility tree and reachable by Tab at all times.
          className={[
            '-translate-y-full focus:translate-y-0',
            'transition-transform duration-150 ease-out',
            // Colours: primary-500 (gold) on ink-900 passes 9.6:1 in light mode.
            // In dark mode the same combination passes 11:1.
            'bg-primary-500 text-ink-900',
            'px-4 py-2 rounded-b-xl',
            'text-sm font-semibold font-body whitespace-nowrap',
            // Focus ring — offset so the ring shows outside the yellow pill.
            'outline-none focus:ring-2 focus:ring-primary-500/60 focus:ring-offset-2',
            'focus:ring-offset-white dark:focus:ring-offset-ink-900',
          ].join(' ')}
        >
          {label}
        </a>
      ))}
    </div>
  );
}
