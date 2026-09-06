'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { AdminInput } from './AdminInput';

export interface AdminFilterBarProps {
  search?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  onSearchSubmit?: (e: React.FormEvent) => void;
  tabs?: React.ReactNode;
  customFilters?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function AdminFilterBar({
  search,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm dữ liệu...',
  onSearchSubmit,
  tabs,
  customFilters,
  children,
  className = '',
}: AdminFilterBarProps) {
  return (
    <div
      className={`p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${className}`}
    >
      {tabs ? (
        <div className="flex-1 overflow-x-auto min-w-0">
          {tabs}
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 ml-auto w-full md:w-auto">
        {onSearchChange !== undefined && (
          <form
            onSubmit={onSearchSubmit ? onSearchSubmit : (e) => e.preventDefault()}
            className="w-full sm:w-64"
          >
            <AdminInput
              value={search ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
            />
          </form>
        )}

        {(customFilters || children) && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {customFilters || children}
          </div>
        )}
      </div>
    </div>
  );
}
