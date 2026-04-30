import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────

export type StepsBarVariant = 'bar' | 'panels' | 'circles' | 'vertical';
export type StepsBarPanelAppearance = 'default' | 'ghost';
export type StepsBarFullWidth = 'none' | 'always' | 'mobile';

export interface StepsBarStep {
  label: string;
  description?: string;
}

export interface StepsBarProps {
  steps: StepsBarStep[];
  /** 0-indexed active step. All steps before it are considered complete. */
  current: number;
  /**
   * bar      — full-width colour bar above each step label (default)
   * panels   — chevron-separated horizontal panels
   * circles  — circles connected by a horizontal line
   * vertical — vertically stacked circles with a connecting line
   */
  variant?: StepsBarVariant;
  /** Called with the 0-indexed step when a step is clicked. */
  onStepClick?: (index: number) => void;
  /**
   * panels variant only.
   * default — uniform white/solid background across all panels (default)
   * ghost   — transparent background, border + chevrons only
   */
  panelAppearance?: StepsBarPanelAppearance;
  /**
   * Controls how wide (horizontal variants) or tall (vertical) the component stretches.
   * none   — shrinks to content (default)
   * always — always fills the container
   * mobile — fills the container on mobile, shrinks on larger screens
   */
  fullWidth?: StepsBarFullWidth;
  /** Minimum width (px) for each step column. Useful for preventing labels from wrapping on narrow containers. */
  minStepWidth?: number;
  /**
   * When true, horizontal variants (bar, panels, circles) automatically collapse to a
   * compact left-border vertical list below the `sm` breakpoint (≤ 640 px).
   */
  responsive?: boolean;
  /** Accessible label for the nav landmark. Defaults to "Progress". Override when multiple StepsBars appear on the same page. */
  'aria-label'?: string;
  className?: string;
}

// ── Shared helpers ────────────────────────────────────────

function stepState(i: number, current: number) {
  return { isComplete: i < current, isCurrent: i === current, isUpcoming: i > current };
}

function fullWidthClass(fw: StepsBarFullWidth): string {
  if (fw === 'always') return 'w-full';
  if (fw === 'mobile') return 'w-full sm:w-fit'; // full on mobile, shrink on sm+
  return 'w-fit'; // none — always shrink to content
}

// ─────────────────────────────────────────────────────────
// Variant: bar
// ─────────────────────────────────────────────────────────

function BarVariant({
  steps,
  current,
  onStepClick,
  minStepWidth,
  navAriaLabel = 'Progress',
}: {
  steps: StepsBarStep[];
  current: number;
  onStepClick?: (index: number) => void;
  minStepWidth?: number;
  navAriaLabel?: string;
}) {
  return (
    <nav aria-label={navAriaLabel}>
      <ol className="flex gap-px">
        {steps.map((step, i) => {
          const { isComplete, isCurrent, isUpcoming } = stepState(i, current);
          const active = isComplete || isCurrent;

          return (
            <li
              key={i}
              style={minStepWidth ? { minWidth: minStepWidth } : undefined}
              className={[
                'group flex-1 flex flex-col min-w-0',
                onStepClick ? 'cursor-pointer' : '',
              ].join(' ')}
            >
              {onStepClick ? (
                <button
                  type="button"
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Step ${i + 1} of ${steps.length}: ${step.label}, ${isComplete ? 'completed' : isCurrent ? 'current' : 'upcoming'}`}
                  onClick={() => onStepClick(i)}
                  className="group flex flex-col min-w-0 w-full flex-1 text-left rounded-sm select-none cursor-pointer"
                >
                  <StepBarInner
                    step={step}
                    i={i}
                    active={active}
                    isComplete={isComplete}
                    isCurrent={isCurrent}
                    isUpcoming={isUpcoming}
                  />
                </button>
              ) : (
                <div className="group flex flex-col min-w-0 w-full flex-1">
                  <StepBarInner
                    step={step}
                    i={i}
                    active={active}
                    isComplete={isComplete}
                    isCurrent={isCurrent}
                    isUpcoming={isUpcoming}
                    ariaCurrent={isCurrent ? 'step' : undefined}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepBarInner({
  step,
  i,
  active,
  isComplete,
  isCurrent,
  isUpcoming,
  ariaCurrent,
}: {
  step: StepsBarStep;
  i: number;
  active: boolean;
  isComplete: boolean;
  isCurrent: boolean;
  isUpcoming: boolean;
  ariaCurrent?: 'step';
}) {
  return (
    <>
      {/* Top bar */}
      <div
        className={[
          'h-1 w-full rounded-sm transition-colors duration-150',
          active
            ? 'bg-primary-500 group-hover:bg-primary-600'
            : isUpcoming
              ? 'bg-ink-200 dark:bg-ink-700 group-hover:bg-ink-300 dark:group-hover:bg-ink-600'
              : 'bg-ink-200 dark:bg-ink-700',
        ].join(' ')}
      />
      {/* Labels */}
      <div className="mt-3 space-y-0.5 pr-4">
        <p
          aria-current={ariaCurrent}
          className={[
            'text-sm font-semibold font-body truncate transition-colors duration-150',
            active
              ? 'text-ink-700 dark:text-ink-200 group-hover:text-ink-900 dark:group-hover:text-ink-50'
              : 'text-ink-500 dark:text-ink-300 group-hover:text-ink-600 dark:group-hover:text-ink-300',
          ].join(' ')}
        >
          Step {i + 1}
        </p>
        <p
          className={[
            'text-sm font-body truncate transition-colors duration-150',
            isCurrent
              ? 'text-ink-900 dark:text-ink-50 group-hover:text-ink-700 dark:group-hover:text-ink-200'
              : isComplete
                ? 'text-ink-600 dark:text-ink-300 group-hover:text-ink-900 dark:group-hover:text-ink-50'
                : 'text-ink-500 dark:text-ink-300 group-hover:text-ink-600 dark:group-hover:text-ink-300',
          ].join(' ')}
        >
          {step.label}
        </p>
        {step.description && (
          <p className="text-xs text-ink-500 dark:text-ink-300 font-body truncate">
            {step.description}
          </p>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// Variant: panels
// ─────────────────────────────────────────────────────────

function PanelsVariant({
  steps,
  current,
  onStepClick,
  panelAppearance = 'default',
  minStepWidth,
  navAriaLabel = 'Progress',
}: {
  steps: StepsBarStep[];
  current: number;
  onStepClick?: (index: number) => void;
  panelAppearance?: StepsBarPanelAppearance;
  minStepWidth?: number;
  navAriaLabel?: string;
}) {
  return (
    <nav aria-label={navAriaLabel}>
      <ol className="flex overflow-hidden rounded-lg border border-ink-200 dark:border-ink-700">
        {steps.map((step, i) => {
          const { isComplete, isCurrent } = stepState(i, current);
          const isLast = i === steps.length - 1;

          const bgClass =
            panelAppearance === 'ghost' ? 'bg-transparent' : 'bg-white dark:bg-ink-800';

          const content = (
            <>
              {/* Circle indicator */}
              <span
                className={[
                  'shrink-0 flex items-center justify-center w-9 h-9 rounded-full',
                  'text-sm font-semibold font-body transition-all duration-150',
                  isComplete
                    ? 'bg-primary-500 text-ink-900 group-hover:bg-primary-600'
                    : isCurrent
                      ? 'border-2 border-primary-500 text-ink-900 dark:text-ink-50 group-hover:border-primary-600 group-hover:text-ink-900 dark:group-hover:text-ink-50'
                      : 'border-2 border-ink-300 dark:border-ink-600 text-ink-500 dark:text-ink-300 group-hover:border-ink-400 dark:group-hover:border-ink-500 group-hover:text-ink-600 dark:group-hover:text-ink-300',
                ].join(' ')}
              >
                {isComplete ? (
                  <Check className="w-5 h-5 stroke-[2.5]" aria-hidden />
                ) : (
                  String(i + 1).padStart(2, '0')
                )}
              </span>

              {/* Label */}
              <span
                className={[
                  'text-sm font-semibold font-body leading-snug truncate transition-colors duration-150',
                  isCurrent
                    ? 'text-ink-900 dark:text-ink-50 group-hover:text-ink-900 dark:group-hover:text-ink-50'
                    : isComplete
                      ? 'text-ink-700 dark:text-ink-200 group-hover:text-ink-900 dark:group-hover:text-ink-50'
                      : 'text-ink-500 dark:text-ink-300 group-hover:text-ink-600 dark:group-hover:text-ink-300',
                ].join(' ')}
              >
                {step.label}
                {step.description && (
                  <span className="block text-xs font-normal text-ink-500 dark:text-ink-300 truncate">
                    {step.description}
                  </span>
                )}
              </span>
            </>
          );

          return (
            <li
              key={i}
              style={minStepWidth ? { minWidth: minStepWidth } : undefined}
              className={[
                'group relative flex flex-1 min-w-0',
                onStepClick ? 'cursor-pointer' : '',
              ].join(' ')}
            >
              {onStepClick ? (
                <button
                  type="button"
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Step ${i + 1} of ${steps.length}: ${step.label}, ${isComplete ? 'completed' : isCurrent ? 'current' : 'upcoming'}`}
                  onClick={() => onStepClick(i)}
                  className={[
                    'flex items-center gap-3 px-5 py-4 w-full select-none cursor-pointer',
                    bgClass,
                  ].join(' ')}
                >
                  {content}
                </button>
              ) : (
                <div
                  aria-current={isCurrent ? 'step' : undefined}
                  className={['flex items-center gap-3 px-5 py-4 w-full', bgClass].join(' ')}
                >
                  {content}
                </div>
              )}

              {/* Chevron divider */}
              {!isLast && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-0 w-5 z-10"
                >
                  <svg
                    className="h-full w-full text-ink-200 dark:text-ink-700"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentColor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────
// Variant: circles
// ─────────────────────────────────────────────────────────

function CircleIndicator({ isComplete, isCurrent }: { isComplete: boolean; isCurrent: boolean }) {
  if (isComplete) {
    return (
      <span className="flex w-8 h-8 rounded-full bg-primary-500 items-center justify-center shrink-0 transition-colors duration-150 group-hover:bg-primary-600">
        <Check className="w-4 h-4 text-ink-900 stroke-[2.5]" aria-hidden />
      </span>
    );
  }
  if (isCurrent) {
    return (
      <span className="flex w-8 h-8 rounded-full border-2 border-primary-500 items-center justify-center shrink-0 transition-colors duration-150 group-hover:border-primary-600">
        <span className="w-3 h-3 rounded-full bg-primary-500 transition-colors duration-150 group-hover:bg-primary-600" />
      </span>
    );
  }
  return (
    <span className="flex w-8 h-8 rounded-full border-2 border-ink-300 dark:border-ink-600 items-center justify-center shrink-0" />
  );
}

function CirclesVariant({
  steps,
  current,
  onStepClick,
  minStepWidth,
  navAriaLabel = 'Progress',
}: {
  steps: StepsBarStep[];
  current: number;
  onStepClick?: (index: number) => void;
  minStepWidth?: number;
  navAriaLabel?: string;
}) {
  return (
    <nav aria-label={navAriaLabel}>
      {/* Every li is flex-1 so columns are always equal width.
          Width is driven by the outer StepsBar wrapper via fullWidth prop. */}
      <ol className="flex items-start">
        {steps.map((step, i) => {
          const { isComplete, isCurrent } = stepState(i, current);
          const isFirst = i === 0;
          const isLast = i === steps.length - 1;
          const prevComplete = i > 0 && i - 1 < current;

          const circleAndLabel = (
            <>
              {/*
                Circle row uses plain flex — NO absolute positioning.
                The circle sits between two flex-1 line segments so it stays
                centred in its column without any z-index tricks.
                Invisible flex-1 spacers replace lines at the first/last step.
              */}
              <div className="flex items-center w-full">
                {/* Left half — spacer for first step, coloured line otherwise */}
                {isFirst ? (
                  <div className="flex-1" aria-hidden />
                ) : (
                  <div
                    className={[
                      'flex-1 h-0.5 transition-colors duration-300',
                      prevComplete ? 'bg-primary-500' : 'bg-ink-200 dark:bg-ink-700',
                    ].join(' ')}
                  />
                )}

                {/* Circle — natural flow, always on top of the line segments */}
                <CircleIndicator isComplete={isComplete} isCurrent={isCurrent} />

                {/* Right half — coloured line, or spacer for last step */}
                {isLast ? (
                  <div className="flex-1" aria-hidden />
                ) : (
                  <div
                    className={[
                      'flex-1 h-0.5 transition-colors duration-300',
                      isComplete ? 'bg-primary-500' : 'bg-ink-200 dark:bg-ink-700',
                    ].join(' ')}
                  />
                )}
              </div>

              {/* Label */}
              {(step.label || step.description) && (
                <div className="text-center mt-2">
                  <p
                    className={[
                      'text-xs font-semibold font-body transition-colors duration-150',
                      isCurrent
                        ? 'text-ink-900 dark:text-ink-50 group-hover:text-ink-900 dark:group-hover:text-ink-50'
                        : isComplete
                          ? 'text-ink-700 dark:text-ink-200 group-hover:text-ink-900 dark:group-hover:text-ink-50'
                          : 'text-ink-500 dark:text-ink-300',
                    ].join(' ')}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-[11px] text-ink-500 dark:text-ink-300 font-body">
                      {step.description}
                    </p>
                  )}
                </div>
              )}
            </>
          );

          return (
            <li
              key={i}
              style={minStepWidth ? { minWidth: minStepWidth } : undefined}
              className={[
                'flex-1 flex flex-col items-center',
                onStepClick ? 'cursor-pointer' : '',
              ].join(' ')}
            >
              {onStepClick ? (
                <button
                  type="button"
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Step ${i + 1} of ${steps.length}: ${step.label}, ${isComplete ? 'completed' : isCurrent ? 'current' : 'upcoming'}`}
                  onClick={() => onStepClick(i)}
                  className="group flex flex-col items-center w-full cursor-pointer"
                >
                  {circleAndLabel}
                </button>
              ) : (
                <div
                  aria-current={isCurrent ? 'step' : undefined}
                  className="group flex flex-col items-center w-full"
                >
                  {circleAndLabel}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────
// Variant: vertical
// ─────────────────────────────────────────────────────────

function VerticalVariant({
  steps,
  current,
  onStepClick,
  minStepWidth,
  navAriaLabel = 'Progress',
}: {
  steps: StepsBarStep[];
  current: number;
  onStepClick?: (index: number) => void;
  minStepWidth?: number;
  navAriaLabel?: string;
}) {
  return (
    <nav aria-label={navAriaLabel}>
      <ol className="flex flex-col">
        {steps.map((step, i) => {
          const { isComplete, isCurrent } = stepState(i, current);
          const isLast = i === steps.length - 1;

          const circleNode = isComplete ? (
            <span className="flex w-8 h-8 rounded-full bg-primary-500 items-center justify-center shrink-0 transition-colors duration-150 group-hover:bg-primary-600">
              <Check className="w-4 h-4 text-ink-900 stroke-[2.5]" aria-hidden />
            </span>
          ) : isCurrent ? (
            <span className="flex w-8 h-8 rounded-full border-2 border-primary-500 items-center justify-center shrink-0 transition-colors duration-150 group-hover:border-primary-600">
              <span className="w-3 h-3 rounded-full bg-primary-500 transition-colors duration-150 group-hover:bg-primary-600" />
            </span>
          ) : (
            <span className="flex w-8 h-8 items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-ink-300 dark:bg-ink-600 transition-colors duration-150 group-hover:bg-ink-400 dark:group-hover:bg-ink-500" />
            </span>
          );

          const rowContent = (
            <>
              {/* Circle */}
              <div className="shrink-0">{circleNode}</div>
              {/* Label */}
              <StepVerticalLabel step={step} isComplete={isComplete} isCurrent={isCurrent} />
            </>
          );

          return (
            <li
              key={i}
              style={minStepWidth ? { minWidth: minStepWidth } : undefined}
              className={['group flex flex-col', onStepClick ? 'cursor-pointer' : ''].join(' ')}
            >
              {/* Clickable row: circle + label together */}
              {onStepClick ? (
                <button
                  type="button"
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Step ${i + 1} of ${steps.length}: ${step.label}, ${isComplete ? 'completed' : isCurrent ? 'current' : 'upcoming'}`}
                  onClick={() => onStepClick(i)}
                  className="flex items-start gap-4 w-full text-left cursor-pointer"
                >
                  {rowContent}
                </button>
              ) : (
                <div
                  aria-current={isCurrent ? 'step' : undefined}
                  className="flex items-start gap-4 w-full"
                >
                  {rowContent}
                </div>
              )}

              {/* Vertical connector — lives outside the button, aligned under the circle */}
              {!isLast && (
                <div className="flex gap-4" aria-hidden>
                  <div className="w-8 flex justify-center shrink-0">
                    <div
                      className={[
                        'w-0.5 min-h-[1.5rem] my-1 transition-colors duration-300',
                        isComplete ? 'bg-primary-500' : 'bg-ink-200 dark:bg-ink-700',
                      ].join(' ')}
                    />
                  </div>
                  {/* Spacer that mirrors the label column so connector stays left-aligned */}
                  <div className="flex-1 min-h-[1.5rem]" />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepVerticalLabel({
  step,
  isComplete,
  isCurrent,
}: {
  step: StepsBarStep;
  isComplete: boolean;
  isCurrent: boolean;
}) {
  return (
    <div className="flex flex-col justify-center min-w-0">
      <p
        className={[
          'text-sm font-semibold font-body leading-snug transition-colors duration-150',
          isCurrent
            ? 'text-ink-900 dark:text-ink-50 group-hover:text-ink-900 dark:group-hover:text-ink-50'
            : isComplete
              ? 'text-ink-700 dark:text-ink-200 group-hover:text-ink-900 dark:group-hover:text-ink-50'
              : 'text-ink-500 dark:text-ink-300 group-hover:text-ink-600 dark:group-hover:text-ink-300',
        ].join(' ')}
      >
        {step.label}
      </p>
      {step.description && (
        <p className="text-xs text-ink-500 dark:text-ink-300 group-hover:text-ink-600 dark:group-hover:text-ink-300 font-body transition-colors duration-150 mt-0.5">
          {step.description}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────
// Mobile panels list — panels-style card with chevron dividers
// Shown for the panels variant on small screens when responsive=true
// ─────────────────────────────────────────────────────────

function MobilePanelsList({
  steps,
  current,
  onStepClick,
  panelAppearance = 'default',
  navAriaLabel = 'Progress',
}: {
  steps: StepsBarStep[];
  current: number;
  onStepClick?: (index: number) => void;
  panelAppearance?: StepsBarPanelAppearance;
  navAriaLabel?: string;
}) {
  const bgClass = panelAppearance === 'ghost' ? 'bg-transparent' : 'bg-white dark:bg-ink-800';

  return (
    <nav aria-label={navAriaLabel}>
      <ol
        className={[
          'rounded-lg border border-ink-200 dark:border-ink-700 overflow-hidden',
          bgClass,
        ].join(' ')}
      >
        {steps.map((step, i) => {
          const { isComplete, isCurrent } = stepState(i, current);
          const isLast = i === steps.length - 1;

          const rowInner = (
            <div
              className={[
                'flex items-center gap-3 px-4 py-3 w-full',
                onStepClick ? 'cursor-pointer' : '',
              ].join(' ')}
            >
              <span
                className={[
                  'shrink-0 flex items-center justify-center w-9 h-9 rounded-full',
                  'text-sm font-semibold font-body transition-all duration-150',
                  isComplete
                    ? 'bg-primary-500 text-ink-900 group-hover:bg-primary-600'
                    : isCurrent
                      ? 'border-2 border-primary-500 text-ink-900 dark:text-ink-50 group-hover:border-primary-600 group-hover:text-ink-900 dark:group-hover:text-ink-50'
                      : 'border-2 border-ink-300 dark:border-ink-600 text-ink-500 dark:text-ink-300 group-hover:border-ink-400 dark:group-hover:border-ink-500 group-hover:text-ink-600 dark:group-hover:text-ink-300',
                ].join(' ')}
              >
                {isComplete ? (
                  <Check className="w-5 h-5 stroke-[2.5]" aria-hidden />
                ) : (
                  String(i + 1).padStart(2, '0')
                )}
              </span>

              <span
                className={[
                  'text-sm font-semibold font-body leading-snug transition-colors duration-150',
                  isCurrent
                    ? 'text-ink-900 dark:text-ink-50 group-hover:text-ink-900 dark:group-hover:text-ink-50'
                    : isComplete
                      ? 'text-ink-700 dark:text-ink-200 group-hover:text-ink-900 dark:group-hover:text-ink-50'
                      : 'text-ink-500 dark:text-ink-300 group-hover:text-ink-600 dark:group-hover:text-ink-300',
                ].join(' ')}
              >
                {step.label}
                {step.description && (
                  <span className="block text-xs font-normal text-ink-500 dark:text-ink-300 group-hover:text-ink-600 dark:group-hover:text-ink-300 transition-colors duration-150">
                    {step.description}
                  </span>
                )}
              </span>
            </div>
          );

          return (
            <li key={i} className="group">
              {onStepClick ? (
                <button
                  type="button"
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Step ${i + 1} of ${steps.length}: ${step.label}, ${isComplete ? 'completed' : isCurrent ? 'current' : 'upcoming'}`}
                  onClick={() => onStepClick(i)}
                  className="w-full text-left cursor-pointer"
                >
                  {rowInner}
                </button>
              ) : (
                <div aria-current={isCurrent ? 'step' : undefined}>{rowInner}</div>
              )}

              {/* Downward chevron divider */}
              {!isLast && (
                <div aria-hidden className="w-full" style={{ height: 15 }}>
                  <svg
                    className="w-full h-full text-ink-200 dark:text-ink-700"
                    viewBox="0 0 200 15"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      points="0,0 100,14 200,0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────
// Mobile collapse — compact left-border vertical list
// Shown instead of horizontal variants on small screens when responsive=true
// ─────────────────────────────────────────────────────────

function MobileList({
  steps,
  current,
  onStepClick,
  navAriaLabel = 'Progress',
}: {
  steps: StepsBarStep[];
  current: number;
  onStepClick?: (index: number) => void;
  navAriaLabel?: string;
}) {
  return (
    <nav aria-label={navAriaLabel}>
      <ol className="space-y-1">
        {steps.map((step, i) => {
          const { isComplete, isCurrent } = stepState(i, current);
          const active = isComplete || isCurrent;

          const inner = (
            <div className="py-2 pl-4">
              <p
                aria-current={isCurrent ? 'step' : undefined}
                className={[
                  'text-sm font-semibold font-body leading-snug transition-colors duration-150',
                  active
                    ? 'text-ink-700 dark:text-ink-200 group-hover:text-ink-900 dark:group-hover:text-ink-50'
                    : 'text-ink-500 dark:text-ink-300 group-hover:text-ink-600 dark:group-hover:text-ink-300',
                ].join(' ')}
              >
                Step {i + 1}
              </p>
              <p
                className={[
                  'text-sm font-body leading-snug transition-colors duration-150',
                  isCurrent
                    ? 'text-ink-900 dark:text-ink-50 group-hover:text-ink-700 dark:group-hover:text-ink-200'
                    : isComplete
                      ? 'text-ink-600 dark:text-ink-300 group-hover:text-ink-900 dark:group-hover:text-ink-50'
                      : 'text-ink-500 dark:text-ink-300 group-hover:text-ink-600 dark:group-hover:text-ink-300',
                ].join(' ')}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-ink-500 dark:text-ink-300 group-hover:text-ink-600 dark:group-hover:text-ink-300 font-body mt-0.5 transition-colors duration-150">
                  {step.description}
                </p>
              )}
            </div>
          );

          return (
            <li
              key={i}
              className={[
                'group border-l-4 rounded-r-md transition-colors duration-150',
                onStepClick ? 'cursor-pointer' : '',
                active
                  ? 'border-primary-500 hover:border-primary-600'
                  : 'border-ink-200 dark:border-ink-700 hover:border-ink-300 dark:hover:border-ink-500',
              ].join(' ')}
            >
              {onStepClick ? (
                <button
                  type="button"
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Step ${i + 1} of ${steps.length}: ${step.label}, ${isComplete ? 'completed' : isCurrent ? 'current' : 'upcoming'}`}
                  onClick={() => onStepClick(i)}
                  className="w-full text-left cursor-pointer"
                >
                  {inner}
                </button>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────
// StepsBar — root component
// ─────────────────────────────────────────────────────────

export function StepsBar({
  steps,
  current,
  variant = 'bar',
  onStepClick,
  panelAppearance = 'default',
  fullWidth = 'mobile',
  minStepWidth = 50,
  responsive = true,
  'aria-label': navAriaLabel = 'Progress',
  className = '',
}: StepsBarProps) {
  const isHorizontal = variant !== 'vertical';

  // Internal current state — clicking a step makes everything up to and including
  // it active (steps 0..i complete/current, steps i+1.. upcoming).
  // Syncs when the external `current` prop changes (e.g. parent controls progress).
  const [activeCurrent, setActiveCurrent] = useState(current);
  useEffect(() => {
    setActiveCurrent(current);
  }, [current]);

  const handleStepClick = onStepClick
    ? (i: number) => {
        setActiveCurrent(i);
        onStepClick(i);
      }
    : undefined;

  return (
    <div className={[fullWidthClass(fullWidth), className].filter(Boolean).join(' ')}>
      {/* Mobile collapse — only for horizontal variants when responsive=true */}
      {responsive && isHorizontal && (
        <div className="sm:hidden">
          {variant === 'panels' ? (
            <MobilePanelsList
              steps={steps}
              current={activeCurrent}
              onStepClick={handleStepClick}
              panelAppearance={panelAppearance}
              navAriaLabel={navAriaLabel}
            />
          ) : (
            <MobileList
              steps={steps}
              current={activeCurrent}
              onStepClick={handleStepClick}
              navAriaLabel={navAriaLabel}
            />
          )}
        </div>
      )}

      {/* Normal variant — hidden on mobile when responsive=true + horizontal */}
      <div className={responsive && isHorizontal ? 'hidden sm:block' : undefined}>
        {variant === 'bar' && (
          <BarVariant
            steps={steps}
            current={activeCurrent}
            onStepClick={handleStepClick}
            minStepWidth={minStepWidth}
            navAriaLabel={navAriaLabel}
          />
        )}
        {variant === 'panels' && (
          <PanelsVariant
            steps={steps}
            current={activeCurrent}
            onStepClick={handleStepClick}
            panelAppearance={panelAppearance}
            minStepWidth={minStepWidth}
            navAriaLabel={navAriaLabel}
          />
        )}
        {variant === 'circles' && (
          <CirclesVariant
            steps={steps}
            current={activeCurrent}
            onStepClick={handleStepClick}
            minStepWidth={minStepWidth}
            navAriaLabel={navAriaLabel}
          />
        )}
        {variant === 'vertical' && (
          <VerticalVariant
            steps={steps}
            current={activeCurrent}
            onStepClick={handleStepClick}
            minStepWidth={minStepWidth}
            navAriaLabel={navAriaLabel}
          />
        )}
      </div>
    </div>
  );
}
