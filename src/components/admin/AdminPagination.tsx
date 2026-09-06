'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange?: (newLimit: number) => void;
  limitOptions?: number[];
  itemLabel?: string;
  className?: string;
}

export function AdminPagination({
  page,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 25, 50, 100],
  itemLabel = 'kết quả',
  className = '',
}: AdminPaginationProps) {
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-[#1E293B] text-xs text-slate-600 dark:text-[#94A3B8] ${className}`}
    >
      {/* Summary Info & Limit Selector */}
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
        <span>
          Hiển thị{' '}
          <span className="font-semibold text-slate-900 dark:text-[#F8FAFC]">
            {startItem}-{endItem}
          </span>{' '}
          / <span className="font-semibold text-slate-900 dark:text-[#F8FAFC]">{totalItems}</span>{' '}
          {itemLabel}
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-[#64748B] text-[11px]">Mỗi trang:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="px-2 py-1 text-xs rounded-md border border-slate-300 dark:border-[#1E293B] bg-white dark:bg-[#172238] text-slate-900 dark:text-[#F8FAFC] cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-amber-500"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <span className="text-slate-500 dark:text-[#64748B] text-xs mr-2">
          Trang <span className="font-semibold text-slate-900 dark:text-[#F8FAFC]">{page}</span> /{' '}
          <span className="font-semibold text-slate-900 dark:text-[#F8FAFC]">{Math.max(1, totalPages)}</span>
        </span>

        <button
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          title="Trang đầu"
          aria-label="Trang đầu"
          className="p-1.5 rounded-md border border-slate-200 dark:border-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#172238] text-slate-700 dark:text-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          title="Trang trước"
          aria-label="Trang trước"
          className="p-1.5 rounded-md border border-slate-200 dark:border-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#172238] text-slate-700 dark:text-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          title="Trang sau"
          aria-label="Trang sau"
          className="p-1.5 rounded-md border border-slate-200 dark:border-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#172238] text-slate-700 dark:text-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          title="Trang cuối"
          aria-label="Trang cuối"
          className="p-1.5 rounded-md border border-slate-200 dark:border-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#172238] text-slate-700 dark:text-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
