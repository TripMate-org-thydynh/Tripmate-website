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
      className={`flex flex-wrap items-end justify-between gap-4 ${className}`}
    >
      <div className="min-w-0 flex-1 basis-60">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="min-w-0 text-[clamp(1.65rem,3vw,2.25rem)] font-bold leading-[1.15] tracking-[-0.04em] text-admin-text-primary">
            {title}
          </h1>
          {renderedBadge && <div className="shrink-0">{renderedBadge}</div>}
        </div>
        {description && (
          <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-admin-text-secondary">
            {description}
          </p>
        )}
      </div>

      {renderedActions && (
        <div className="flex min-w-0 max-w-full flex-wrap items-center justify-end gap-2 self-start">
          {renderedActions}
        </div>
      )}
    </div>
  );
}
