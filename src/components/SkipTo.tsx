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

  /** True when an element is invisible to the user (display:none or hidden ancestor). */
  function isVisible(el: HTMLElement): boolean {
    return getComputedStyle(el).display !== 'none';
  }

  const seen = new Set<HTMLElement>();
  return Array.from(root.querySelectorAll<HTMLElement>(selector))
    .filter((el) => {
      if (seen.has(el)) return false;
      seen.add(el);
      return isVisible(el);  // skip display:none landmarks (e.g. Tailwind `hidden`)
    })
    .map((el) => ({ kind: 'landmark' as const, label: landmarkDisplayLabel(el), el }));
}

/** Scans for headings at the specified levels, scoped to the first <main>. */
function scanHeadings(root: HTMLElement, levels: number[]): HeadingItem[] {
  const mainEl = root.querySelector<HTMLElement>('main, [role="main"]') ?? root;
  const selector = levels.map((l) => `h${l}`).join(', ');
  return Array.from(mainEl.querySelectorAll<HTMLElement>(selector))
    .filter((el) => getComputedStyle(el).display !== 'none')
    .map((el) => ({
      kind:  'heading' as const,
      level: parseInt(el.tagName[1], 10),
      text:  el.textContent?.trim() ?? '',
      el,
    }));
}

// ── Focus helper ───────────────────────────────────────────

/** Elements the browser can focus natively — no tabindex manipulation needed. */
const NATIVELY_FOCUSABLE = /^(a|button|input|select|textarea)$/i;

function moveFocusTo(el: HTMLElement) {
  // Inputs, buttons, links etc. are already in the tab order — just focus them.
  // Non-interactive targets (headings, landmarks) need a temporary tabindex so
  // the browser will accept the programmatic focus call.
  const nativelyFocusable =
    NATIVELY_FOCUSABLE.test(el.tagName) || el.hasAttribute('href');
  const hadTabIndex = el.hasAttribute('tabindex');

  if (!nativelyFocusable && !hadTabIndex) {
    el.setAttribute('tabindex', '-1');
    el.addEventListener('blur', () => el.removeAttribute('tabindex'), { once: true });
  }

  el.focus({ preventScroll: false });
}

// ── Shortcut display ──────────────────────────────────────

/** Formats one variant of a shortcut with a given platform flag. */
function formatShortcutVariant(parts: string[], mac: boolean): string {
  return parts
    .map((p) => {
      if (p === 'alt')   return mac ? 'Option' : 'Alt';
      if (p === 'ctrl')  return mac ? 'Control' : 'Ctrl';
      if (p === 'meta')  return mac ? '⌘' : 'Win';
      if (p === 'shift') return 'Shift';
      return p.toUpperCase();
    })
    .join('+');
}

/**
 * Returns the shortcut label(s) for the trigger button.
 * When the shortcut contains the Alt modifier, BOTH platform variants are
 * always shown so every user recognises their key — e.g. "Option+0 / Alt+0".
 * For other modifiers, only the single platform-appropriate form is shown.
 */
function formatButtonShortcut(str: string): string {
  if (!str) return '';
  const parts = str.toLowerCase().split('+');
  if (parts.includes('alt')) {
    // Always show both so Mac and non-Mac users both see their name.
    return `${formatShortcutVariant(parts, true)} / ${formatShortcutVariant(parts, false)}`;
  }
  return formatShortcutVariant(parts, false);
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
  // On macOS, Option+<digit/letter> produces a dead or composed character in
  // e.key (e.g. Option+0 → 'º') rather than the bare key. e.code always
  // reflects the physical key position, so we accept either.
  const codeKey = e.code
    .replace(/^Digit/, '')  // 'Digit0' → '0'
    .replace(/^Key/, '')    // 'KeyA'   → 'A'
    .toLowerCase();
  return (
    (e.key.toLowerCase() === sc.key || codeKey === sc.key) &&
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

  const buttonRef       = useRef<HTMLButtonElement>(null);
  const menuRef         = useRef<HTMLDivElement>(null);
  const itemsRef        = useRef<HTMLElement[]>([]);
  // Mirrors [...landmarks, ...headings] — updated on every render so that
  // keyboard handlers can map a list index back to the target page element.
  const allMenuItemsRef = useRef<MenuItem[]>([]);
  // Tracks whichever page element currently has the preview outline, so we
  // can remove it before moving to the next one or closing the menu.
  const highlightedEl   = useRef<HTMLElement | null>(null);

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

  // ── Preview highlight ──────────────────────────────────
  // Applies a temporary outline ring to the target page element while the
  // user arrow-keys through the menu, and removes it on the next call or
  // when the menu closes. Uses inline style so no global CSS is needed.

  const clearPreview = useCallback(() => {
    if (highlightedEl.current) {
      highlightedEl.current.style.outline = '';
      highlightedEl.current.style.outlineOffset = '';
      highlightedEl.current = null;
    }
  }, []);

  const previewPageElement = useCallback((idx: number) => {
    clearPreview();
    const item = allMenuItemsRef.current[idx];
    if (!item) return;
    const el = item.el;
    el.style.outline = '3px solid var(--color-primary-500, #f5c518)';
    el.style.outlineOffset = '3px';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    highlightedEl.current = el;
  }, [clearPreview]);

  const closeMenu = useCallback((returnFocus = true) => {
    setOpen(false);
    // Remove any preview outline from the page element.
    if (highlightedEl.current) {
      highlightedEl.current.style.outline = '';
      highlightedEl.current.style.outlineOffset = '';
      highlightedEl.current = null;
    }
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

  // ── Global listeners when menu is open ────────────────
  // • Tab (from anywhere)         → close menu, let Tab propagate
  // • ↑/↓ (from outside widget)  → move focus back into submenu
  // • Escape (from outside)       → close menu, return focus to button
  // • mousedown (outside widget)  → close menu

  useEffect(() => {
    if (!open) return;

    function keyHandler(e: globalThis.KeyboardEvent) {
      const inWidget = menuRef.current?.contains(document.activeElement);

      if (e.key === 'Tab') {
        // Close menu but let Tab propagate so the browser moves focus normally.
        closeMenu(false);
        return;
      }

      // ArrowDown/Up/Escape while focus is inside the widget are already
      // handled by handleMenuKeyDown — don't double-handle them here.
      if (inWidget) return;

      // Focus is on a page element outside the widget.
      const target = e.target as HTMLElement;
      const isFormControl =
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
        target.isContentEditable;
      if (isFormControl) return;

      const items = itemsRef.current.filter(Boolean);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[0]?.focus();
        previewPageElement(0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const last = items.length - 1;
        items[last]?.focus();
        previewPageElement(last);
      } else if (e.key === 'Escape') {
        closeMenu(true);
      }
    }

    function mouseHandler(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) closeMenu(false);
    }

    document.addEventListener('keydown', keyHandler);
    document.addEventListener('mousedown', mouseHandler);
    return () => {
      document.removeEventListener('keydown', keyHandler);
      document.removeEventListener('mousedown', mouseHandler);
    };
  }, [open, closeMenu, previewPageElement]);

  // ── Arrow-key navigation inside menu ──────────────────
  // Focus stays on the trigger button when the menu first opens.
  // ArrowDown/Up moves focus into the item list (idx === -1 when button
  // is focused, so ArrowDown lands on items[0] and ArrowUp on the last).
  // Tab is only intercepted when a menu item already has focus; if the
  // button itself is focused, Tab propagates naturally so the user can
  // leave without interacting with the menu.

  function handleMenuKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const items  = itemsRef.current.filter(Boolean);
    const active = document.activeElement;
    const idx = items.findIndex((el) => el === active);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (idx + 1) % items.length;
      items[next]?.focus();
      previewPageElement(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (idx - 1 + items.length) % items.length;
      items[prev]?.focus();
      previewPageElement(prev);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
    } else if (e.key === 'Tab') {
      // Tab always propagates so the browser moves focus to the next element.
      // Close the menu without stealing focus — onBlur handles cleanup too.
      if (open) closeMenu(false);
    }
  }

  // ── Activate an item ───────────────────────────────────
  // Closes the menu and moves focus to the target page element.
  // • Inputs/buttons/links: natively focusable — user can type/interact immediately.
  // • Search landmarks: focus the first enabled input/textarea inside them so the
  //   user can start typing straight away rather than landing on the div container.
  // • Other headings/landmarks: receive a temporary tabindex="-1" so focus lands on
  //   them; once the menu is closed the global ↑/↓ listener is gone, so those keys
  //   revert to their default browser behaviour (page scroll, etc.).

  function activate(e: React.MouseEvent | React.KeyboardEvent, item: MenuItem) {
    e.preventDefault();
    clearPreview();   // remove preview outline before transferring focus
    closeMenu(false); // close menu; don't return focus to the trigger button

    // For search landmarks, dive inside to the first typeable field so the user
    // can start typing immediately (focusing the <div role="search"> container
    // itself shows a focus ring but isn't typeable).
    let target = item.el;
    if (item.kind === 'landmark' && getRole(item.el) === 'search') {
      const input = item.el.querySelector<HTMLElement>(
        'input:not([disabled]):not([type="hidden"]), textarea:not([disabled])'
      );
      if (input) target = input;
    }

    moveFocusTo(target);
  }

  // ── Render ─────────────────────────────────────────────

  // Keep the ref in sync with current state so keyboard handlers (including
  // those in useEffect closures) can map a list index → target page element.
  allMenuItemsRef.current = [...landmarks, ...headings];

  // Footer hint e.g. "ALT + 0" (always uppercase, spaced)
  const shortcutHint = shortcut ? shortcut.replace(/\+/g, ' + ').toUpperCase() : '';
  // Button inline hint e.g. "Option+0" or "Alt+0"
  const buttonShortcutHint = formatButtonShortcut(shortcut ?? '');

  return (
    <div
      ref={menuRef}
      className={['fixed top-0 left-0 z-[9999]', className].filter(Boolean).join(' ')}
      onKeyDown={handleMenuKeyDown}
      onBlur={(e) => {
        // Close when focus leaves the entire widget (not just moves between children).
        if (!menuRef.current?.contains(e.relatedTarget as Node)) {
          closeMenu(false);
        }
      }}
    >
      {/* ── Trigger button ── */}
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : openMenu())}
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
        {buttonShortcutHint && (
          <span className="ml-1.5 font-normal opacity-80">
            ({buttonShortcutHint})
          </span>
        )}
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        // Outer wrapper is a plain div — not role="menu" — so it can hold
        // the section headers (aria-hidden visual labels) and the footer
        // button without triggering aria-required-children violations.
        // The actual menu semantics live on the inner div.
        <div
          className={[
            'mt-0.5 w-72',
            'bg-white dark:bg-ink-800',
            'border border-ink-200 dark:border-ink-700',
            'rounded-xl shadow-lg',
            'overflow-hidden',
            'text-sm font-body',
          ].join(' ')}
        >
          {/* role="menu" owns only role="group" and role="menuitem" children — ARIA-valid */}
          <div role="menu" aria-label="Skip to">

            {/* Landmark Regions ── role="group" is a permitted child of role="menu" */}
            {landmarks.length > 0 && (
              <div role="group" aria-label={`Landmark Regions, ${landmarks.length} items`}>
                {/* Visual heading: aria-hidden because the group's aria-label already
                    announces "Landmark Regions, N items" to screen readers. */}
                <div
                  aria-hidden="true"
                  className="px-3 py-1.5 text-xs font-semibold font-display text-ink-900 dark:text-ink-50 bg-ink-100 dark:bg-ink-700/60 border-b border-ink-200 dark:border-ink-700"
                >
                  Landmark Regions ({landmarks.length})
                </div>
                {landmarks.map((item, i) => (
                  <div
                    key={i}
                    ref={(el) => { if (el) itemsRef.current[i] = el; }}
                    role="menuitem"
                    tabIndex={-1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') activate(e, item);
                    }}
                    className={[
                      'block px-3 py-1.5 cursor-default',
                      'text-ink-700 dark:text-ink-300',
                      'hover:bg-primary-500/10 dark:hover:bg-primary-500/15',
                      'focus:bg-primary-500 focus:text-ink-900',
                      'outline-none transition-colors duration-75',
                    ].join(' ')}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}

            {/* Headings ── role="group" is a permitted child of role="menu" */}
            {headings.length > 0 && (
              <div role="group" aria-label={`Headings in Main Region, ${headings.length} items`}>
                <div
                  aria-hidden="true"
                  className="px-3 py-1.5 text-xs font-semibold font-display text-ink-900 dark:text-ink-50 bg-ink-100 dark:bg-ink-700/60 border-t border-ink-200 dark:border-ink-700"
                >
                  Headings in Main Region ({headings.length})
                </div>
                {headings.map((item, i) => {
                  const refIdx = landmarks.length + i;
                  const indent = (item.level - 1) * 12;
                  return (
                    <div
                      key={i}
                      ref={(el) => { if (el) itemsRef.current[refIdx] = el; }}
                      role="menuitem"
                      tabIndex={-1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') activate(e, item);
                      }}
                      style={{ paddingLeft: `${12 + indent}px` }}
                      className={[
                        'block py-1.5 pr-3 cursor-default',
                        'text-ink-700 dark:text-ink-300',
                        'hover:bg-primary-500/10 dark:hover:bg-primary-500/15',
                        'focus:bg-primary-500 focus:text-ink-900',
                        'outline-none transition-colors duration-75',
                      ].join(' ')}
                    >
                      <span
                        aria-hidden="true"
                        className="text-ink-500 dark:text-ink-300 mr-1.5 font-mono text-xs"
                      >
                        {item.level})
                      </span>
                      {item.text}
                    </div>
                  );
                })}
              </div>
            )}

            {/* No content fallback — role="menuitem" so it's a valid menu child */}
            {landmarks.length === 0 && headings.length === 0 && (
              <div
                role="menuitem"
                tabIndex={-1}
                className="block px-3 py-3 text-ink-500 dark:text-ink-300 text-xs italic outline-none cursor-default"
                aria-disabled="true"
              >
                No landmarks or headings found on this page.
              </div>
            )}

          </div>{/* end role="menu" */}

          {/* Footer lives OUTSIDE role="menu" so <button> doesn't violate
              aria-required-children. A plain div has no owned-element rules. */}
          <div className="border-t border-ink-200 dark:border-ink-700 px-3 py-2 flex items-center justify-between">
            {shortcutHint && (
              <span className="text-xs text-ink-500 dark:text-ink-300">
                Shortcut:{' '}
                <kbd className="font-mono text-ink-600 dark:text-ink-300">{shortcutHint}</kbd>
              </span>
            )}
            <button
              type="button"
              onClick={() => closeMenu()}
              className="ml-auto text-xs text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-300 outline-none focus:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
