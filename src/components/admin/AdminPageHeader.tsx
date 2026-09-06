'use client';

import React from 'react';
import { AdminBadge, AdminBadgeVariant } from './AdminBadge';

export interface AdminPageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  badgeText?: string;
  badgeVariant?: AdminBadgeVariant;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  badge,
  badgeText,
  badgeVariant = 'neutral',
  actions,
  children,
  className = '',
}: AdminPageHeaderProps) {
  const renderedBadge = badge ?? (badgeText ? (
    <AdminBadge variant={badgeVariant} size="xs">
      {badgeText}
    </AdminBadge>
  ) : null);

  const renderedActions = actions ?? children;

  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 pb-1 ${className}`}
    >
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
            {title}
          </h1>
          {renderedBadge && <div className="shrink-0">{renderedBadge}</div>}
        </div>
        {description && (
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {renderedActions && (
        <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end flex-wrap">
          {renderedActions}
        </div>
      )}
    </div>
  );
}
