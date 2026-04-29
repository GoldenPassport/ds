import React, { useEffect, useRef, useState } from 'react';
import { Search, X, Loader2, SlidersHorizontal, Info } from 'lucide-react';
import { Input } from './Input';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { Toggle } from './Toggle';
import { Checkbox } from './Checkbox';
import { Select } from './Select';

// ── Filter types ──────────────────────────────────────────

export interface SearchSetFilterOption {
  label: string;
  value: string;
}

export interface SearchSetFilterDef {
  key:      string;
  label:    string;
  /**
   * - `select`  — single-value dropdown
   * - `multi`   — multi-select checkboxes
   * - `toggle`  — boolean on/off
   */
  type:     'select' | 'multi' | 'toggle';
  /** Required for `select` and `multi` types */
  options?: SearchSetFilterOption[];
}

export type SearchSetFilterValues = Record<string, string | string[] | boolean>;

// ── Search tag type ───────────────────────────────────────

export interface SearchSetTag {
  term: string;
  /** How this tag joins with the previous tag. Default `'and'` (Enter). Shift+Enter adds `'or'`. */
  op:   'and' | 'or';
}

// ── SearchSet props ───────────────────────────────────────

export interface SearchSetProps {
  /** Controlled search query (the live, uncommitted text) */
  value:             string;
  /** Called with the (debounced) query string — fire your server request here */
  onChange:          (query: string) => void;
  /**
   * Committed search tags.
   * - Enter          → AND tag  (must match)
   * - Shift+Enter    → OR tag   (may match)
   */
  tags?:             SearchSetTag[];
  /** Called when the tags array changes (tag added or removed) */
  onTagsChange?:     (tags: SearchSetTag[]) => void;
  /** Debounce delay in ms before onChange fires. Default 350 */
  debounce?:         number;
  /** Show a spinner inside the search icon while the server is fetching */
  loading?:          boolean;
  placeholder?:      string;
  /** Optional label rendered above the input */
  label?:            string;
  /**
   * Short summary rendered below the input on the left
   * e.g. "12 results" or "Showing 4 of 12"
   */
  summary?:          React.ReactNode;
  /** Slot for active filter chips displayed below the search row */
  filters?:          React.ReactNode;
  /** Filter field definitions — renders a filter button that opens a dialog */
  filterDefs?:       SearchSetFilterDef[];
  /** Controlled filter values */
  filterValues?:     SearchSetFilterValues;
  /** Called when the user clicks Apply in the filter dialog */
  onFilterChange?:   (values: SearchSetFilterValues) => void;
  /** Dialog title. Default "Filters" */
  filterTitle?:      string;
  className?:        string;
  /** Extra classes applied only to the search-input row (not the tags/summary row below) */
  searchClassName?:  string;
}

// ── InfoPopover ───────────────────────────────────────────
// Click-toggle popover that flips above/below and left/right
// based on available viewport space — no floating-ui needed.

const POPOVER_W  = 256; // w-64
const POPOVER_H  = 140; // approximate rendered height (with padding)

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-ink-200 dark:border-ink-600 bg-white dark:bg-ink-700 text-ink-600 dark:text-ink-300 font-sans text-[10px] leading-none shadow-[0_1px_0] shadow-ink-200 dark:shadow-ink-600">
      {children}
    </kbd>
  );
}

function InfoPopover() {
  const [open,        setOpen]        = useState(false);
  const [above,       setAbove]       = useState(false);
  const [panelStyle,  setPanelStyle]  = useState<React.CSSProperties>({ left: 0 });
  const [arrowStyle,  setArrowStyle]  = useState<React.CSSProperties>({ left: '12px' });
  const containerRef = useRef<HTMLDivElement>(null);

  function handleToggle() {
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const h    = window.innerHeight;
      const w    = window.innerWidth;

      // Prefer opening below; only go above if no room below but room above
      const hasRoomBelow = h - rect.bottom >= POPOVER_H + 12;
      const hasRoomAbove = rect.top        >= POPOVER_H + 12;
      setAbove(!hasRoomBelow && hasRoomAbove);

      // Ideal panel left edge (viewport-relative): prefer right-aligned under button,
      // then nudge right by 12 px so the panel clears the search box's rounded corner.
      const PANEL_NUDGE = 12;
      const idealLeft = rect.right - POPOVER_W + PANEL_NUDGE;
      // Clamp so panel stays 8 px inside viewport on both sides
      const clampedLeft = Math.max(8, Math.min(idealLeft, w - POPOVER_W - 8));
      // Convert to offset relative to the container's left edge
      const panelOffsetLeft = clampedLeft - rect.left;
      setPanelStyle({ left: `${panelOffsetLeft}px` });

      // Centre the caret over the middle of the info button
      const ARROW_W       = 10; // w-2.5 = 10 px
      const btnCentreX    = rect.left + rect.width / 2;
      const arrowFromLeft = Math.round(btnCentreX - clampedLeft - ARROW_W / 2);
      setArrowStyle({ left: `${arrowFromLeft}px` });
    }
    setOpen(o => !o);
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const verticalCls = above ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]';

  // Arrow sits on whichever edge faces the button, centred over the info icon
  const arrowCls = [
    'absolute w-2.5 h-2.5 rotate-45',
    'border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800',
    above
      ? '-bottom-[5px] border-r border-b'
      : '-top-[5px] border-l border-t',
  ].join(' ');

  return (
    <div ref={containerRef} className="relative inline-flex items-center" style={{ isolation: 'isolate' }}>
      <button
        type="button"
        aria-label="Search tag help"
        aria-expanded={open}
        onClick={handleToggle}
        className={[
          'p-1 rounded-xl transition-colors',
          open
            ? 'text-primary-500 dark:text-primary-400'
            : 'text-ink-400 hover:text-ink-600 dark:text-ink-300 dark:hover:text-ink-200',
        ].join(' ')}
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div
          className={[
            'absolute z-200',
            verticalCls,
            'w-64 p-3 flex flex-col gap-2.5',
            'rounded-xl border border-ink-200 dark:border-ink-700',
            'bg-white dark:bg-ink-800 shadow-lg',
          ].join(' ')}
          style={panelStyle}
        >
          <p className="text-xs font-semibold font-body text-ink-900 dark:text-ink-50">
            Search tags
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Kbd>Enter</Kbd>
              <span className="text-xs font-body text-ink-500 dark:text-ink-300">
                AND — results must match
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 shrink-0">
                <Kbd>Shift</Kbd>
                <span className="text-[10px] text-ink-500 dark:text-ink-300">+</span>
                <Kbd>Enter</Kbd>
              </span>
              <span className="text-xs font-body text-ink-500 dark:text-ink-300">
                OR — results may match
              </span>
            </div>
          </div>
          <div className={arrowCls} style={arrowStyle} />
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────

function countActiveFilters(values: SearchSetFilterValues): number {
  return Object.values(values).filter(v => {
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'boolean') return v;
    return v !== '' && v !== null && v !== undefined;
  }).length;
}

// ── Filter dialog body ────────────────────────────────────

function FilterDialogBody({
  defs,
  draft,
  onChange,
}: {
  defs:     SearchSetFilterDef[];
  draft:    SearchSetFilterValues;
  onChange: (key: string, val: string | string[] | boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {defs.map(def => {
        if (def.type === 'toggle') {
          return (
            <div key={def.key} className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium font-body text-ink-700 dark:text-ink-200">
                {def.label}
              </span>
              <Toggle
                checked={Boolean(draft[def.key])}
                onChange={v => onChange(def.key, v)}
              />
            </div>
          );
        }

        if (def.type === 'select') {
          const selectOptions = [
            { value: '', label: 'Any' },
            ...(def.options ?? []),
          ];
          return (
            <Select
              key={def.key}
              variant="native"
              label={def.label}
              value={String(draft[def.key] ?? '')}
              onChange={v => onChange(def.key, v)}
              options={selectOptions}
            />
          );
        }

        if (def.type === 'multi') {
          const selected = (draft[def.key] as string[] | undefined) ?? [];
          return (
            <div key={def.key} className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50">
                {def.label}
              </span>
              <div className="flex flex-col gap-2 pl-0.5">
                {def.options?.map(o => (
                  <Checkbox
                    key={o.value}
                    label={o.label}
                    checked={selected.includes(o.value)}
                    onChange={checked => {
                      const next = checked
                        ? [...selected, o.value]
                        : selected.filter(v => v !== o.value);
                      onChange(def.key, next);
                    }}
                  />
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

// ── SearchSet ─────────────────────────────────────────────

// Stable empty object used as the default for `filterValues`.
// A literal `{}` in a default parameter is recreated on every render,
// which would make the `useEffect([filterValues])` loop infinitely.
const EMPTY_FILTER_VALUES: SearchSetFilterValues = {};

export function SearchSet({
  value,
  onChange,
  tags,
  onTagsChange,
  debounce         = 350,
  loading          = false,
  placeholder      = 'Search…',
  label,
  summary,
  filters,
  filterDefs,
  filterValues     = EMPTY_FILTER_VALUES,
  onFilterChange,
  filterTitle      = 'Filters',
  className        = '',
  searchClassName  = '',
}: SearchSetProps) {
  const [draft,       setDraft]       = useState(value);
  const [dialogOpen,  setDialogOpen]  = useState(false);
  const [filterDraft, setFilterDraft] = useState<SearchSetFilterValues>(filterValues);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { setFilterDraft(filterValues); }, [filterValues]);
  useEffect(() => () => clearTimeout(timer.current), []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setDraft(q);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(q), debounce);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && onTagsChange) {
      const term = draft.trim();
      if (term && !tags?.some(t => t.term === term)) {
        const op: 'and' | 'or' = e.shiftKey ? 'or' : 'and';
        onTagsChange([...(tags ?? []), { term, op }]);
      }
      setDraft('');
      clearTimeout(timer.current);
      onChange('');
      e.preventDefault();
    }
  }

  function handleClear() {
    setDraft('');
    clearTimeout(timer.current);
    onChange('');
  }

  function removeTag(term: string) {
    onTagsChange?.((tags ?? []).filter(t => t.term !== term));
  }

  function openFilters() {
    setFilterDraft({ ...filterValues });
    setDialogOpen(true);
  }

  function applyFilters() {
    onFilterChange?.(filterDraft);
    setDialogOpen(false);
  }

  function clearFilters() {
    const cleared: SearchSetFilterValues = {};
    filterDefs?.forEach(d => {
      cleared[d.key] = d.type === 'multi' ? [] : d.type === 'toggle' ? false : '';
    });
    setFilterDraft(cleared);
  }

  const activeCount  = filterDefs ? countActiveFilters(filterValues) : 0;
  const showFilters  = !!filterDefs?.length && !!onFilterChange;
  const hasTags      = onTagsChange !== undefined;
  const activeTags   = tags ?? [];
  const showTags     = hasTags && activeTags.length > 0;

  // Derive dismissible chips from active filterValues
  const filterChips: { id: string; label: string; remove: () => void }[] =
    (filterDefs && filterValues && onFilterChange)
      ? filterDefs.flatMap(def => {
          const val = filterValues[def.key];
          if (def.type === 'toggle') {
            if (!val) return [];
            return [{ id: def.key, label: def.label, remove: () => onFilterChange({ ...filterValues, [def.key]: false }) }];
          }
          if (def.type === 'select') {
            if (!val) return [];
            const opt = def.options?.find(o => o.value === val);
            return [{ id: def.key, label: `${def.label}: ${opt?.label ?? val}`, remove: () => onFilterChange({ ...filterValues, [def.key]: '' }) }];
          }
          if (def.type === 'multi') {
            const arr = Array.isArray(val) ? val as string[] : [];
            return arr.map(v => {
              const opt = def.options?.find(o => o.value === v);
              return {
                id:     `${def.key}:${v}`,
                label:  `${def.label}: ${opt?.label ?? v}`,
                remove: () => onFilterChange({ ...filterValues, [def.key]: arr.filter(x => x !== v) }),
              };
            });
          }
          return [];
        })
      : [];

  const showBottom   = !!summary || hasTags || !!filters || filterChips.length > 0;

  return (
    <>
      <div className={['flex flex-col gap-2', className].join(' ')}>
        {/* ── Search row ──────────────────────────────────── */}
        <div className={['flex items-end gap-2', searchClassName].filter(Boolean).join(' ')}>
          <div className="flex-1 min-w-0">
            <Input
              type="search"
              value={draft}
              onChange={handleChange}
              onKeyDown={hasTags ? handleKeyDown : undefined}
              wrapClassName="[&>p]:hidden"
              placeholder={placeholder}
              label={label}
              icon={
                loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Search  className="w-4 h-4" />
              }
              rightAction={
                draft ? (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={handleClear}
                    className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors p-1 rounded-xl"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <InfoPopover />
                )
              }
            />
          </div>

          {/* Filter button */}
          {showFilters && (
            <div className="relative shrink-0">
              <button
                type="button"
                aria-label="Open filters"
                onClick={openFilters}
                className={[
                  'flex items-center justify-center w-[42px] h-[42px] rounded-xl border transition-colors',
                  activeCount > 0
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-400 text-primary-800 dark:text-primary-400'
                    : 'bg-white dark:bg-ink-700 border-ink-200 dark:border-ink-600 text-ink-400 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-200 hover:border-ink-300 dark:hover:border-ink-500',
                ].join(' ')}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              {activeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[1.1rem] h-[1.1rem] flex items-center justify-center rounded-full bg-primary-500 text-ink-900 text-[10px] font-bold font-body px-1 leading-none pointer-events-none">
                  {activeCount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Summary + tags row ──────────────────────────── */}
        {showBottom && (
          <div className="min-h-[24px] flex items-center gap-3">
            {/* Left: summary text */}
            {summary && (
              <span className="shrink-0 text-xs font-body text-ink-500 dark:text-ink-300 whitespace-nowrap">
                {summary}
              </span>
            )}

            {/* Right: AND/OR tags + external filter chips */}
            {(showTags || !!filters || filterChips.length > 0) && (
              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                {showTags && activeTags.map((tag, i) => (
                  <React.Fragment key={tag.term}>
                    {i > 0 && (
                      <span className={[
                        'text-[10px] font-bold font-body uppercase tracking-wider select-none px-0.5',
                        tag.op === 'or'
                          ? 'text-primary-500 dark:text-primary-400'
                          : 'text-ink-500 dark:text-ink-300',
                      ].join(' ')}>
                        {tag.op}
                      </span>
                    )}
                    <span className={[
                      'inline-flex items-center gap-1 pl-2 pr-1.5 py-0.5',
                      'rounded-full text-[11px] font-semibold font-body',
                      'border transition-colors',
                      tag.op === 'or'
                        ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                        : 'bg-ink-100 dark:bg-ink-700 border-ink-200 dark:border-ink-600 text-ink-700 dark:text-ink-200',
                    ].join(' ')}>
                      <Search className="w-2.5 h-2.5 opacity-50 shrink-0" aria-hidden="true" />
                      {tag.term}
                      <button
                        type="button"
                        aria-label={`Remove "${tag.term}"`}
                        onClick={() => removeTag(tag.term)}
                        className="shrink-0 opacity-40 hover:opacity-80 transition-opacity ml-0.5 leading-none text-[1.2em] font-normal"
                      >
                        ×
                      </button>
                    </span>
                  </React.Fragment>
                ))}
                {filterChips.map(chip => (
                  <span
                    key={chip.id}
                    className="inline-flex items-center gap-1 pl-2 pr-1.5 py-0.5 rounded-full text-[11px] font-semibold font-body border transition-colors bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700 text-primary-800 dark:text-primary-300"
                  >
                    <SlidersHorizontal className="w-2.5 h-2.5 opacity-60 shrink-0" aria-hidden="true" />
                    {chip.label}
                    <button
                      type="button"
                      aria-label={`Remove filter "${chip.label}"`}
                      onClick={chip.remove}
                      className="shrink-0 opacity-40 hover:opacity-80 transition-opacity ml-0.5 leading-none text-[1.2em] font-normal"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Filter dialog ────────────────────────────────── */}
      {showFilters && (
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={filterTitle}
          size="sm"
        >
          <FilterDialogBody
            defs={filterDefs!}
            draft={filterDraft}
            onChange={(key, val) => setFilterDraft(prev => ({ ...prev, [key]: val }))}
          />

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={applyFilters}>
                Apply
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
