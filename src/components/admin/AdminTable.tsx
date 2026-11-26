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
    <div className={`w-full min-w-0 max-w-full bg-admin-surface ${className}`}>
      <div className="w-full overflow-x-auto focus-visible:-outline-offset-2" role="region" aria-label="Dữ liệu bảng" tabIndex={0}>
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
      className={`border-b border-admin-border bg-admin-sidebar text-xs font-semibold text-admin-text-secondary ${
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
      className={`border-b border-admin-border/70 transition-colors duration-100 last:border-0 ${
        selected
          ? 'bg-[var(--admin-accent-bg)]'
          : 'hover:bg-admin-bg'
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
      scope="col"
      aria-sort={sortable && sortDirection ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
      className={`px-4 py-3 text-xs font-semibold text-admin-text-secondary ${alignClass} ${className}`}
    >
      {sortable ? (
        <button type="button" onClick={onSort} className="inline-flex cursor-pointer items-center gap-1.5 hover:text-admin-text-primary">
          {children}
          {sortDirection === 'asc' ? <ArrowUp className="size-3.5 text-admin-primary" aria-hidden="true" />
            : sortDirection === 'desc' ? <ArrowDown className="size-3.5 text-admin-primary" aria-hidden="true" />
              : <ArrowUpDown className="size-3.5 text-admin-text-muted" aria-hidden="true" />}
        </button>
      ) : children}
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
      className={`px-4 py-3 text-[13px] text-admin-text-primary align-middle ${
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
          className="border-b border-admin-border/70 last:border-0"
        >
          {Array.from({ length: columns }).map((_, cIdx) => (
            <td key={cIdx} className="px-4 py-3">
              <div
                className="h-4 bg-admin-surface-hover motion-safe:animate-pulse"
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
            <div className="mb-1 grid size-10 place-items-center bg-admin-bg text-admin-text-muted">
              <Inbox className="size-5" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-admin-text-secondary">
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

