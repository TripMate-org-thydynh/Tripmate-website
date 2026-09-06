'use client';

import React from 'react';

export type AdminBadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'primary'
  | 'brand';

interface AdminBadgeProps {
  variant?: AdminBadgeVariant;
  size?: 'xs' | 'sm';
  dot?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function AdminBadge({
  variant = 'neutral',
  size = 'xs',
  dot = false,
  pulse = false,
  children,
  className = '',
  icon,
}: AdminBadgeProps) {
  const sizeClasses = {
    xs: 'text-[11px] px-2 py-0.5 gap-1.5 font-medium',
    sm: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  }[size];

  const variantClasses: Record<AdminBadgeVariant, { bg: string; dot: string }> = {
    success: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-[#22C55E] dark:border-emerald-800/60',
      dot: 'bg-[#22C55E]',
    },
    warning: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-[#F59E0B] dark:border-amber-800/60',
      dot: 'bg-[#F59E0B]',
    },
    danger: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-[#EF4444] dark:border-rose-800/60',
      dot: 'bg-[#EF4444]',
    },
    info: {
      bg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-[#38BDF8] dark:border-sky-800/60',
      dot: 'bg-[#38BDF8]',
    },
    neutral: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#172238] dark:text-[#94A3B8] dark:border-[#1E293B]',
      dot: 'bg-[#64748B]',
    },
    primary: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
      dot: 'bg-amber-500 dark:bg-amber-400',
    },
    brand: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
      dot: 'bg-amber-500 dark:bg-amber-400',
    },
  };

  const style = variantClasses[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full border leading-none transition-colors select-none ${style.bg} ${sizeClasses} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot} ${
            pulse ? 'animate-pulse' : ''
          }`}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
