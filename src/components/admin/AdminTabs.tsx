'use client';

import React from 'react';

export interface TabItem<T = string> {
  id: T;
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
}

interface AdminTabsProps<T = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
  variant?: 'pills' | 'underline';
}

export function AdminTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'pills',
}: AdminTabsProps<T>) {
  if (variant === 'underline') {
    return (
      <div className={`flex items-center gap-6 border-b border-admin-border overflow-x-auto ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(tab.id)}
              className={`pb-3 pt-1 text-xs font-medium relative whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'font-semibold text-[var(--admin-accent-ink)]'
                  : 'text-admin-text-secondary dark:text-admin-text-muted hover:text-admin-text-primary'
              }`}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[11px] tabular-nums ${
                    isActive
                      ? 'bg-[var(--admin-accent-bg)] text-[var(--admin-accent-ink)]'
                      : 'bg-admin-surface-hover text-admin-text-secondary dark:bg-admin-surface-hover dark:text-admin-text-muted'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-admin-primary" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex max-w-full items-center gap-0.5 overflow-x-auto bg-admin-bg p-1 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex min-h-8 cursor-pointer select-none items-center gap-2 whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-colors focus-visible:-outline-offset-2 ${
              isActive
                ? 'bg-[var(--admin-accent-bg)] font-semibold text-[var(--admin-accent-ink)]'
                : 'text-admin-text-secondary dark:text-admin-text-muted hover:text-admin-text-primary'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.5 text-[11px] font-medium tabular-nums ${
                  isActive
                    ? 'text-[var(--admin-accent-ink)]'
                    : 'bg-admin-surface-hover/70 text-admin-text-secondary dark:bg-admin-surface-hover dark:text-admin-text-muted'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
