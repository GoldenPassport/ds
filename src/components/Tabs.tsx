/**
 * Tabs — wraps Headless UI TabGroup
 * Accessible tab navigation with GP styling.
 *
 * Usage:
 *   <Tabs tabs={[
 *     { label: 'Overview', content: <Overview /> },
 *     { label: 'Run Logs', content: <RunLogs />, badge: '12' },
 *   ]} />
 */
import React from 'react';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/react';

export interface TabItem {
  label:    string;
  content:  React.ReactNode;
  badge?:   string | number;
  disabled?: boolean;
  icon?:    React.ReactNode;
}

export interface TabsProps {
  tabs:          TabItem[];
  defaultIndex?: number;
  onChange?:     (index: number) => void;
  /**
   * underline  — gold bottom-border indicator (default)
   * pills      — each tab is an independent pill button
   * pill       — segmented control in a rounded container
   * bar        — full-width tabs with underline indicator
   */
  variant?:      'underline' | 'pills' | 'pill' | 'bar';
  className?:    string;
}

// ── Per-variant TabList wrapper classes ───────────────────

const listClass: Record<NonNullable<TabsProps['variant']>, string> = {
  underline: 'flex gap-0 border-b border-ink-200 dark:border-ink-700',
  pills:     'flex gap-2 flex-wrap',
  pill:      'flex gap-0.5 bg-ink-100 dark:bg-ink-700 p-1 rounded-xl',
  bar:       'flex border-b border-ink-200 dark:border-ink-700',
};

// ── Per-variant Tab button classes ────────────────────────
// Uses Headless UI v2 data-[selected] attributes — no render-prop className needed.

const BASE_TAB = [
  'group inline-flex items-center gap-2 text-sm font-medium font-body',
  'transition-all duration-150 cursor-pointer',
  'focus:outline-none',
  'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
].join(' ');

const tabClass: Record<NonNullable<TabsProps['variant']>, string> = {
  underline: [
    BASE_TAB,
    'px-4 py-2.5 -mb-px border-b-2 border-transparent',
    'text-ink-400 dark:text-ink-500',
    'hover:text-ink-700 dark:hover:text-ink-300',
    'data-[selected]:border-primary-500 data-[selected]:text-ink-900 dark:data-[selected]:text-ink-50',
  ].join(' '),

  pills: [
    BASE_TAB,
    'px-4 py-1.5 rounded-full',
    'text-ink-500 dark:text-ink-400',
    'hover:bg-ink-100 dark:hover:bg-ink-700 hover:text-ink-700 dark:hover:text-ink-200',
    'data-[selected]:bg-primary-500 data-[selected]:text-ink-900',
  ].join(' '),

  pill: [
    BASE_TAB,
    'px-3.5 py-1.5 rounded-lg',
    'text-ink-500 dark:text-ink-400',
    'hover:text-ink-700 dark:hover:text-ink-200',
    'data-[selected]:bg-white dark:data-[selected]:bg-ink-800 data-[selected]:text-ink-900 dark:data-[selected]:text-ink-50 data-[selected]:shadow-sm',
  ].join(' '),

  bar: [
    BASE_TAB,
    'flex-1 justify-center px-4 py-3 -mb-px border-b-2 border-transparent',
    'text-ink-400 dark:text-ink-500',
    'hover:text-ink-700 dark:hover:text-ink-300',
    'data-[selected]:border-primary-500 data-[selected]:text-ink-900 dark:data-[selected]:text-ink-50',
  ].join(' '),
};

// ── Badge classes ─────────────────────────────────────────
// group-data-[selected]: targets the badge when the parent Tab button is selected.
// The Tab gets a `group` class via tabClass so Tailwind can apply these modifiers.

const BADGE_BASE = [
  'inline-flex items-center justify-center text-[11px] font-semibold',
  'px-1.5 py-0.5 rounded-full min-w-[20px]',
  'bg-ink-100 dark:bg-ink-700 text-ink-500 dark:text-ink-400',
].join(' ');

// ── Component ─────────────────────────────────────────────

export function Tabs({
  tabs,
  defaultIndex = 0,
  onChange,
  variant = 'underline',
  className = '',
}: TabsProps) {
  return (
    <TabGroup defaultIndex={defaultIndex} onChange={onChange} className={className}>
      <TabList className={listClass[variant]}>
        {tabs.map((tab, i) => (
          <Tab
            key={i}
            disabled={tab.disabled}
            className={tabClass[variant]}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span className={BADGE_BASE}>
                {tab.badge}
              </span>
            )}
          </Tab>
        ))}
      </TabList>

      <TabPanels className="mt-4">
        {tabs.map((tab, i) => (
          <TabPanel
            key={i}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 rounded-lg"
          >
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
