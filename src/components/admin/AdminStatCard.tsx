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
  default: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
  brand: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/50',
  success: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-800/50',
  warning: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-800/50',
  danger: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-800/50',
  info: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-800/50',
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
  const colorClass = color || (variant ? VARIANT_STYLES[variant] : VARIANT_STYLES.brand);

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComp = icon as React.ComponentType<{ className?: string }>;
    return <IconComp className="w-3.5 h-3.5" />;
  };
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] shadow-xs flex flex-col justify-between gap-3 transition-colors duration-150 ${
        onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-slate-500 dark:text-[#94A3B8] truncate">
          {title}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {badgeLabel && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-[#172238] text-slate-600 dark:text-slate-300">
              {badgeLabel}
            </span>
          )}
          {icon && (
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${colorClass}`}>
              {renderIcon()}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-[#F8FAFC]">
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        </div>
        
        <div className="flex items-center justify-between mt-1 text-[11px]">
          {subtitle && (
            <span className="text-slate-400 dark:text-[#64748B] truncate">
              {subtitle}
            </span>
          )}

          {trend && (
            <div
              className={`flex items-center gap-1 shrink-0 font-medium ${
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
        </div>
      </div>

      {action && (
        <div className="pt-2 mt-1 border-t border-slate-100 dark:border-[#1E293B]">
          {action}
        </div>
      )}
    </div>
  );
}
