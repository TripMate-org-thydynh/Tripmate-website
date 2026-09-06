'use client';

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Inbox } from 'lucide-react';

interface AdminTableProps {
  children: React.ReactNode;
  className?: string;
  density?: 'compact' | 'comfortable';
}

export function AdminTable({ children, className = '', density = 'compact' }: AdminTableProps) {
  return (
    <div className={`w-full overflow-hidden border border-slate-200 dark:border-[#1E293B] rounded-xl bg-white dark:bg-[#111827] shadow-xs ${className}`}>
      <div className="w-full overflow-x-auto">
        <table className={`w-full text-left text-[13px] border-collapse ${density === 'comfortable' ? 'table-comfortable' : 'table-compact'}`}>
          {children}
        </table>
      </div>
    </div>
  );
}

export function AdminTableHeader({
  children,
  className = '',
  sticky = false,
}: {
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
}) {
  return (
    <thead
      className={`bg-slate-50/90 dark:bg-[#0D1424] border-b border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-[#94A3B8] font-semibold uppercase tracking-wider text-[11px] ${
        sticky ? 'sticky top-0 z-10 backdrop-blur-xs' : ''
      } ${className}`}
    >
      {children}
    </thead>
  );
}

export function AdminTableRow({
  children,
  className = '',
  selected = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-slate-100 dark:border-[#1E293B] last:border-0 transition-colors duration-100 ${
        selected
          ? 'bg-amber-500/10 dark:bg-amber-500/15'
          : 'hover:bg-slate-50/70 dark:hover:bg-[#172238]'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
}

interface AdminTableHeadProps {
  children?: React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export function AdminTableHead({
  children,
  className = '',
  sortable = false,
  sortDirection = null,
  onSort,
  align = 'left',
  width,
}: AdminTableHeadProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <th
      style={width ? { width } : undefined}
      className={`py-2.5 px-3.5 text-[11px] font-semibold text-slate-600 dark:text-[#94A3B8] select-none ${alignClass} ${
        sortable ? 'cursor-pointer hover:text-slate-900 dark:hover:text-[#F8FAFC]' : ''
      } ${className}`}
      onClick={sortable ? onSort : undefined}
    >
      <div
        className={`inline-flex items-center gap-1.5 ${
          align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'
        }`}
      >
        <span>{children}</span>
        {sortable && (
          <span className="text-slate-400 dark:text-[#64748B]">
            {sortDirection === 'asc' ? (
              <ArrowUp className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            ) : sortDirection === 'desc' ? (
              <ArrowDown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            ) : (
              <ArrowUpDown className="w-3 h-3 opacity-60" />
            )}
          </span>
        )}
      </div>
    </th>
  );
}

interface AdminTableCellProps {
  children?: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  colSpan?: number;
  mono?: boolean;
}

export function AdminTableCell({
  children,
  className = '',
  align = 'left',
  colSpan,
  mono = false,
}: AdminTableCellProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <td
      colSpan={colSpan}
      className={`py-2.5 px-3.5 text-[13px] text-slate-800 dark:text-[#F8FAFC] align-middle ${
        mono ? 'font-mono tabular-nums' : ''
      } ${alignClass} ${className}`}
    >
      {children}
    </td>
  );
}

export function AdminTableSkeleton({
  columns = 5,
  rows = 5,
}: {
  columns?: number;
  rows?: number;
}) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr
          key={rIdx}
          className="border-b border-slate-100 dark:border-[#1E293B] last:border-0"
        >
          {Array.from({ length: columns }).map((_, cIdx) => (
            <td key={cIdx} className="py-2.5 px-3.5">
              <div
                className="h-4 rounded-md bg-slate-200 dark:bg-[#172238] animate-pulse"
                style={{
                  width: `${60 + ((rIdx + cIdx) % 4) * 10}%`,
                  maxWidth: '140px',
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function AdminTableEmpty({
  colSpan,
  message = 'Không có dữ liệu phù hợp với điều kiện tìm kiếm',
  action,
}: {
  colSpan: number;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <tbody>
      <tr>
        <td colSpan={colSpan} className="py-12 px-4 text-center">
          <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#172238] flex items-center justify-center text-slate-400 dark:text-[#64748B] mb-1">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-[#94A3B8]">
              {message}
            </p>
            {action && <div className="mt-2">{action}</div>}
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export function AdminTableBody({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <tbody className={className}>{children}</tbody>;
}

