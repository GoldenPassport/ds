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
  variant?:      'underline' | 'pill';
  className?:    string;
}

export function Tabs({
  tabs,
  defaultIndex = 0,
  onChange,
  variant = 'underline',
  className = '',
}: TabsProps) {
  return (
    <TabGroup defaultIndex={defaultIndex} onChange={onChange} className={className}>
      {/* Tab list */}
      <TabList
        className={[
          'flex gap-0.5',
          variant === 'underline'
            ? 'border-b border-ink-200 dark:border-ink-700'
            : 'bg-ink-100 dark:bg-ink-700 p-1 rounded-xl',
        ].join(' ')}
      >
        {tabs.map((tab, i) => (
          <Tab
            key={i}
            disabled={tab.disabled}
            className={({ selected }) => [
              'inline-flex items-center gap-2 text-sm font-medium font-body transition-all duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 rounded-md',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              variant === 'underline'
                ? [
                    'px-4 py-2.5 -mb-px border-b-2',
                    selected
                      ? 'border-gold-500 text-ink-900 dark:text-ink-50'
                      : 'border-transparent text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-ink-300',
                  ].join(' ')
                : [
                    'px-3.5 py-1.5 rounded-lg',
                    selected
                      ? 'bg-white dark:bg-ink-800 text-ink-900 dark:text-ink-50 shadow-sm'
                      : 'text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-200',
                  ].join(' '),
            ].join(' ')}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span className={[
                'inline-flex items-center justify-center text-[11px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px]',
                'bg-ink-100 dark:bg-ink-700 text-ink-500 dark:text-ink-400',
              ].join(' ')}>
                {tab.badge}
              </span>
            )}
          </Tab>
        ))}
      </TabList>

      {/* Panels */}
      <TabPanels className="mt-4">
        {tabs.map((tab, i) => (
          <TabPanel
            key={i}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 rounded-lg"
          >
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
