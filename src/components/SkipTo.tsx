'use client';
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from 'react';

// ── Types ─────────────────────────────────────────────────

export interface SkipToProps {
  /**
   * Button label shown when the component receives focus.
   * @default 'Skip To...'
   */
  label?: string;

  /**
   * Keyboard shortcut that opens the menu from anywhere on the page.
   * Format: optional modifier(s) joined by '+', e.g. 'alt+0', 'alt+1'.
   * Set to '' to disable.
   * @default 'alt+0'
   */
  shortcut?: string;

  /**
   * Which heading levels to include in the Headings section.
   * @default [1, 2, 3]
   */
  headingLevels?: number[];

  /**
   * DOM element used as the scan root. Defaults to `document.body`.
   * Override in tests/Storybook to scope scanning to a specific container.
   */
  root?: HTMLElement | null;

  /** Additional class names on the outermost wrapper. */
  className?: string;
}

// ── Internal item types ────────────────────────────────────

interface LandmarkItem {
  kind: 'landmark';
  label: string;
  el: HTMLElement;
}

interface HeadingItem {
  kind: 'heading';
  level: number;
  text: string;
  el: HTMLElement;
}

type MenuItem = LandmarkItem | HeadingItem;

// ── DOM scanning helpers ───────────────────────────────────

/** Maps element tag / role to a human-readable region label. */
const ROLE_LABEL: Record<string, string> = {
  main:            'Main',
  navigation:      'Navigation',
  search:          'Search',
  banner:          'Banner',
  contentinfo:     'Footer',
  complementary:   'Complementary',
  form:            'Form',
  region:          'Region',
};

/** Returns the explicit ARIA role or the implicit role for common elements. */
function getRole(el: HTMLElement): string {
  const explicit = el.getAttribute('role');
  if (explicit) return explicit;
  const tag = el.tagName.toLowerCase();
  const implicit: Record<string, string> = {
    main:    'main',
    nav:     'navigation',
    search:  'search',
    header:  'banner',
    footer:  'contentinfo',
    aside:   'complementary',
    form:    'form',
  };
  return implicit[tag] ?? '';
}

/** Returns the accessible name from aria-label, aria-labelledby, or title. */
function getAccessibleName(el: HTMLElement): string {
  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel.trim();

  const labelledBy = el.getAttribute('aria-labelledby');
  if (labelledBy) {
    const text = labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent ?? '')
      .join(' ')
      .trim();
    if (text) return text;
  }

  return el.getAttribute('title')?.trim() ?? '';
}

/** Returns a display string for a landmark, e.g. "Navigation: Main Menu". */
function landmarkDisplayLabel(el: HTMLElement): string {
  const role  = getRole(el);
  const base  = ROLE_LABEL[role] ?? role;
  const name  = getAccessibleName(el);
  return name ? `${base}: ${name}` : base;
}

/** Scans the root for landmark regions in document order. */
function scanLandmarks(root: HTMLElement): LandmarkItem[] {
  const selector = [
    'main, [role="main"]',
    'nav, [role="navigation"]',
    'search, [role="search"]',
    'header:not([role]), [role="banner"]',
    'footer:not([role]), [role="contentinfo"]',
    'aside, [role="complementary"]',
    '[role="form"]',
    '[role="region"][aria-label], [role="region"][aria-labelledby]',
  ].join(', ');

  const seen = new Set<HTMLElement>();
  return Array.from(root.querySelectorAll<HTMLElement>(selector))
    .filter((el) => {
      if (seen.has(el)) return false;
      seen.add(el);
      return true;
    })
    .map((el) => ({ kind: 'landmark' as const, label: landmarkDisplayLabel(el), el }));
}

/** Scans for headings at the specified levels, scoped to the first <main>. */
function scanHeadings(root: HTMLElement, levels: number[]): HeadingItem[] {
  const mainEl = root.querySelector<HTMLElement>('main, [role="main"]') ?? root;
  const selector = levels.map((l) => `h${l}`).join(', ');
  return Array.from(mainEl.querySelectorAll<HTMLElement>(selector)).map((el) => ({
    kind:  'heading' as const,
    level: parseInt(el.tagName[1], 10),
    text:  el.textContent?.trim() ?? '',
    el,
  }));
}

// ── Focus helper ───────────────────────────────────────────

function moveFocusTo(el: HTMLElement) {
  const hadTabIndex = el.hasAttribute('tabindex');
  if (!hadTabIndex) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: false });
  if (!hadTabIndex) {
    el.addEventListener('blur', () => el.removeAttribute('tabindex'), { once: true });
  }
}

// ── Shortcut parsing ───────────────────────────────────────

interface Shortcut {
  key: string;
  alt: boolean;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
}

function parseShortcut(str: string): Shortcut | null {
  if (!str) return null;
  const parts = str.toLowerCase().split('+');
  const key   = parts[parts.length - 1] ?? '';
  return {
    key,
    alt:   parts.includes('alt'),
    ctrl:  parts.includes('ctrl'),
    meta:  parts.includes('meta'),
    shift: parts.includes('shift'),
  };
}

function matchesShortcut(e: globalThis.KeyboardEvent, sc: Shortcut): boolean {
  return (
    e.key.toLowerCase() === sc.key &&
    e.altKey   === sc.alt   &&
    e.ctrlKey  === sc.ctrl  &&
    e.metaKey  === sc.meta  &&
    e.shiftKey === sc.shift
  );
}

// ── Component ─────────────────────────────────────────────

/**
 * SkipTo — WCAG 2.4.1 Bypass Blocks (Level A)
 *
 * A visually-hidden button that reveals a navigation menu on focus or
 * keyboard shortcut. The menu lists all ARIA landmark regions and headings
 * found in the page, letting keyboard users jump directly to any section.
 *
 * Place as the **very first element** inside `<body>` (or root layout):
 *
 * ```tsx
 * <>
 *   <SkipTo />
 *   <Navbar />
 *   <main id="main-content">…</main>
 * </>
 * ```
 *
 * Press **Alt+0** (default) or **Tab** from the top of the page to open.
 */
export function SkipTo({
  label         = 'Skip To…',
  shortcut      = 'alt+0',
  headingLevels = [1, 2, 3],
  root,
  className,
}: SkipToProps) {
  const [open,      setOpen]      = useState(false);
  const [landmarks, setLandmarks] = useState<LandmarkItem[]>([]);
  const [headings,  setHeadings]  = useState<HeadingItem[]>([]);

  const buttonRef  = useRef<HTMLButtonElement>(null);
  const menuRef    = useRef<HTMLDivElement>(null);
  const itemsRef   = useRef<HTMLAnchorElement[]>([]);

  // ── Scan page when menu opens ──────────────────────────

  const scan = useCallback(() => {
    const r = root ?? document.body;
    setLandmarks(scanLandmarks(r));
    setHeadings(scanHeadings(r, headingLevels));
  }, [root, headingLevels]);

  const openMenu = useCallback(() => {
    scan();
    setOpen(true);
  }, [scan]);

  const closeMenu = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  // ── Global keyboard shortcut ───────────────────────────

  useEffect(() => {
    const sc = parseShortcut(shortcut);
    if (!sc) return;
    function handler(e: globalThis.KeyboardEvent) {
      if (matchesShortcut(e, sc!)) {
        e.preventDefault();
        buttonRef.current?.focus();
        openMenu();
      }
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [shortcut, openMenu]);

  // ── Close on outside click ─────────────────────────────

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) closeMenu(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, closeMenu]);

  // ── Focus first item when menu opens ──────────────────

  useEffect(() => {
    if (open) {
      // Tick so items are rendered
      requestAnimationFrame(() => {
        itemsRef.current[0]?.focus();
      });
    }
  }, [open]);

  // ── Arrow-key navigation inside menu ──────────────────

  function handleMenuKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const items  = itemsRef.current.filter(Boolean);
    const active = document.activeElement;
    const idx    = items.findIndex((el) => el === active);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      closeMenu();
    }
  }

  // ── Activate an item ───────────────────────────────────

  function activate(e: React.MouseEvent | React.KeyboardEvent, item: MenuItem) {
    e.preventDefault();
    closeMenu(false);
    moveFocusTo(item.el);
  }

  // ── Render ─────────────────────────────────────────────

  const shortcutHint = shortcut ? shortcut.replace(/\+/g, ' + ').toUpperCase() : '';

  return (
    <div
      ref={menuRef}
      className={['fixed top-0 left-0 z-[9999]', className].filter(Boolean).join(' ')}
      onKeyDown={handleMenuKeyDown}
    >
      {/* ── Trigger button ── */}
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : openMenu())}
        onFocus={() => { if (!open) openMenu(); }}
        className={[
          // Off-screen until focused
          '-translate-y-full focus:translate-y-0',
          open && 'translate-y-0',
          'transition-transform duration-150 ease-out',
          'bg-primary-500 text-ink-900',
          'px-4 py-2 rounded-b-xl',
          'text-sm font-semibold font-body whitespace-nowrap',
          'outline-none focus:ring-2 focus:ring-primary-500/60 focus:ring-offset-2',
          'focus:ring-offset-white dark:focus:ring-offset-ink-900',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {label}
      </button>

      {/* ── Dropdown menu ── */}
      {open && (
        <div
          role="menu"
          aria-label="Skip to"
          className={[
            'mt-0.5 w-72',
            'bg-white dark:bg-ink-800',
            'border border-ink-200 dark:border-ink-700',
            'rounded-xl shadow-lg',
            'overflow-hidden',
            'text-sm font-body',
          ].join(' ')}
        >
          {/* Landmark Regions */}
          {landmarks.length > 0 && (
            <section aria-label="Landmark regions">
              <p className="px-3 py-1.5 text-xs font-semibold font-display text-ink-900 dark:text-ink-50 bg-ink-100 dark:bg-ink-700/60 border-b border-ink-200 dark:border-ink-700">
                Landmark Regions ({landmarks.length})
              </p>
              <ul role="none">
                {landmarks.map((item, i) => (
                  <li key={i} role="none">
                    <a
                      ref={(el) => { if (el) itemsRef.current[i] = el; }}
                      role="menuitem"
                      href="#"
                      onClick={(e) => activate(e, item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') activate(e, item);
                      }}
                      className={[
                        'block px-3 py-1.5',
                        'text-ink-700 dark:text-ink-300',
                        'hover:bg-primary-500/10 dark:hover:bg-primary-500/15',
                        'focus:bg-primary-500 focus:text-ink-900',
                        'outline-none',
                        'transition-colors duration-75',
                        'underline underline-offset-2',
                      ].join(' ')}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Headings */}
          {headings.length > 0 && (
            <section aria-label="Headings in main region">
              <p className="px-3 py-1.5 text-xs font-semibold font-display text-ink-900 dark:text-ink-50 bg-ink-100 dark:bg-ink-700/60 border-y border-ink-200 dark:border-ink-700">
                Headings in Main Region ({headings.length})
              </p>
              <ul role="none">
                {headings.map((item, i) => {
                  const refIdx = landmarks.length + i;
                  // Indent h2+ proportionally
                  const indent = (item.level - 1) * 12;
                  return (
                    <li key={i} role="none">
                      <a
                        ref={(el) => { if (el) itemsRef.current[refIdx] = el; }}
                        role="menuitem"
                        href="#"
                        onClick={(e) => activate(e, item)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') activate(e, item);
                        }}
                        style={{ paddingLeft: `${12 + indent}px` }}
                        className={[
                          'block py-1.5 pr-3',
                          'text-ink-700 dark:text-ink-300',
                          'hover:bg-primary-500/10 dark:hover:bg-primary-500/15',
                          'focus:bg-primary-500 focus:text-ink-900',
                          'outline-none',
                          'transition-colors duration-75',
                          'underline underline-offset-2',
                        ].join(' ')}
                      >
                        <span className="text-ink-400 dark:text-ink-500 mr-1.5 font-mono text-xs not-underline">
                          {item.level})
                        </span>
                        {item.text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* No content fallback */}
          {landmarks.length === 0 && headings.length === 0 && (
            <p className="px-3 py-3 text-ink-500 dark:text-ink-400 text-xs italic">
              No landmarks or headings found on this page.
            </p>
          )}

          {/* Footer */}
          <div className="border-t border-ink-200 dark:border-ink-700 px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-ink-400 dark:text-ink-500">
              Shortcut:{' '}
              <kbd className="font-mono text-ink-600 dark:text-ink-300">{shortcutHint}</kbd>
            </span>
            <button
              type="button"
              onClick={() => closeMenu()}
              className="text-xs text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-ink-300 outline-none focus:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
