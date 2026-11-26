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
  const buttonClass = 'admin-toolbar-control min-h-8 min-w-8 px-1.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent';

  return (
    <div
      className={`flex min-w-0 flex-wrap items-center justify-between gap-3 border-t border-admin-border bg-admin-surface px-3 py-3 text-xs text-admin-text-secondary sm:px-4 ${className}`}
    >
      {/* Summary Info & Limit Selector */}
      <div className="flex min-w-0 flex-wrap items-center gap-2.5">
        <span>
          Hiển thị{' '}
          <span className="font-semibold text-admin-text-primary">
            {startItem}-{endItem}
          </span>{' '}
          / <span className="font-semibold text-admin-text-primary">{totalItems}</span>{' '}
          {itemLabel}
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-admin-text-muted text-[11px]">Mỗi trang:</span>
            <select aria-label="Số mục mỗi trang"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="admin-field min-h-8 cursor-pointer px-2 text-xs"
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
      <nav aria-label="Phân trang" className="flex min-w-0 flex-wrap items-center gap-1.5 tabular-nums">
        <span className="text-admin-text-muted text-xs mr-2">
          Trang <span className="font-semibold text-admin-text-primary">{page}</span> /{' '}
          <span className="font-semibold text-admin-text-primary">{Math.max(1, totalPages)}</span>
        </span>

        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          title="Trang đầu"
          aria-label="Trang đầu"
          className={buttonClass}
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          title="Trang trước"
          aria-label="Trang trước"
          className={buttonClass}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          title="Trang sau"
          aria-label="Trang sau"
          className={buttonClass}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          title="Trang cuối"
          aria-label="Trang cuối"
          className={buttonClass}
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </nav>
    </div>
  );
}
