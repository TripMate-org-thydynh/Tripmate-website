'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface AdminStatCardProps {
  title: string;
  value: string | number;
  helper?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  color?: string; // e.g. text-amber-500 bg-amber-500/10
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number | string;
    isUp: boolean;
    label?: string;
  };
  badge?: string;
  badgeText?: string;
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';
  className?: string;
  onClick?: () => void;
  action?: React.ReactNode;
}

const VARIANT_STYLES: Record<string, string> = {
  default: 'text-admin-text-muted bg-admin-bg',
  brand: 'text-[var(--admin-accent-ink)] bg-[var(--admin-accent-bg)]',
  success: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
  warning: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40',
  danger: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
  info: 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40',
};

export function AdminStatCard({
  title,
  value,
  helper,
  description,
  icon,
  color,
  variant,
  trend,
  badge,
  badgeText,
  className = '',
  onClick,
  action,
}: AdminStatCardProps) {
  const subtitle = description ?? helper;
  const badgeLabel = badgeText ?? badge;
  const colorClass = color || VARIANT_STYLES[variant ?? 'default'];

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComp = icon as React.ComponentType<{ className?: string }>;
    return <IconComp className="w-3.5 h-3.5" />;
  };
  return (
    <div
      onClick={onClick}
      className={`flex min-w-0 max-w-full flex-col justify-between gap-2.5 bg-admin-surface px-4 py-3.5 transition-colors sm:px-5 sm:py-4 ${
        onClick ? 'cursor-pointer hover:bg-admin-surface-hover' : ''
      } ${className}`}
    >
      <div className="flex min-w-0 items-start justify-between gap-2">
        <span className="min-w-0 self-center break-words text-xs font-medium leading-relaxed text-admin-text-secondary">
          {title}
        </span>
        <div className="flex max-w-[48%] shrink-0 flex-wrap justify-end gap-1.5">
          {badgeLabel && (
            <span className="bg-admin-bg px-1.5 py-0.5 text-[11px] font-semibold text-admin-text-muted">
              {badgeLabel}
            </span>
          )}
          {icon && (
            <div className={`flex size-7 shrink-0 items-center justify-center ${colorClass}`} aria-hidden="true">
              {renderIcon()}
            </div>
          )}
        </div>
      </div>

      <div className="@container">
        <div className="break-words text-[clamp(1.05rem,14cqi,1.75rem)] font-semibold leading-tight tracking-tight tabular-nums text-admin-text-primary">
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        </div>
        
        {(subtitle || trend) && <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-xs">
          {subtitle && (
            <span className="min-w-0 break-words text-admin-text-muted">
              {subtitle}
            </span>
          )}

          {trend && (
            <div
              className={`flex min-w-0 items-center gap-1 break-words font-medium ${
                trend.isUp
                  ? 'text-emerald-600 dark:text-[#22C55E]'
                  : 'text-rose-600 dark:text-[#EF4444]'
              }`}
            >
              {trend.isUp ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {trend.value}
                {trend.label ? ` ${trend.label}` : ''}
              </span>
            </div>
          )}
        </div>}
      </div>

      {action && (
        <div className="mt-1 border-t border-admin-border pt-2">
          {action}
        </div>
      )}
    </div>
  );
}
