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
      className={`flex flex-wrap items-start justify-between gap-3.5 border-b border-[var(--admin-border)] pb-4 ${className}`}
    >
      <div className="min-w-0 flex-1 basis-60">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="min-w-0 text-[clamp(1.5rem,3vw,2.125rem)] font-semibold leading-tight text-[var(--admin-text-primary)] tracking-tight">
            {title}
          </h1>
          {renderedBadge && <div className="shrink-0">{renderedBadge}</div>}
        </div>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--admin-text-secondary)]">
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
