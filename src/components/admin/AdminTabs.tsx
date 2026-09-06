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
      <div className={`flex items-center gap-6 border-b border-[#E2E8F0] dark:border-[#1E293B] overflow-x-auto ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`pb-3 pt-1 text-xs font-medium relative whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'text-amber-800 dark:text-amber-300 font-semibold'
                  : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
              }`}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-800 dark:bg-amber-500/25 dark:text-amber-300'
                      : 'bg-slate-100 text-[#475569] dark:bg-[#1E293B] dark:text-[#94A3B8]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 dark:bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-1 bg-slate-100 dark:bg-[#0D1424] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] overflow-x-auto max-w-full ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 flex items-center gap-2 whitespace-nowrap cursor-pointer select-none ${
              isActive
                ? 'bg-white dark:bg-[#111827] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs font-semibold'
                : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-800 dark:bg-amber-500/25 dark:text-amber-300'
                    : 'bg-slate-200/70 text-[#475569] dark:bg-[#1E293B] dark:text-[#94A3B8]'
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
