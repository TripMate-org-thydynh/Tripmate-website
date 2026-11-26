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
      className={`flex min-w-0 max-w-full flex-wrap items-center justify-between gap-3 bg-admin-surface px-4 py-3 ${className}`}
    >
      {tabs ? (
        <div className="min-w-0 max-w-full basis-48 flex-1 overflow-x-auto py-0.5">
          {tabs}
        </div>
      ) : null}

      <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2.5 max-sm:w-full">
        {onSearchChange !== undefined && (
          <form
            onSubmit={onSearchSubmit ? onSearchSubmit : (e) => e.preventDefault()}
            className="w-full max-w-full sm:w-64"
          >
            <AdminInput
              value={search ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              leftIcon={<Search className="size-4" aria-hidden="true" />}
            />
          </form>
        )}

        {(customFilters || children) && (
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
            {customFilters || children}
          </div>
        )}
      </div>
    </div>
  );
}
