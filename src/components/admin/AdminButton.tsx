'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function AdminButton({
  variant = 'primary',
  size = 'sm',
  loading = false,
  icon,
  iconRight,
  children,
  className = '',
  disabled,
  ...props
}: AdminButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg cursor-pointer select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const sizeClasses = {
    xs: 'text-xs px-2.5 py-1 gap-1.5 h-7',
    sm: 'text-xs px-3 py-1.5 gap-2 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-9',
    lg: 'text-sm px-5 py-2.5 gap-2.5 h-11 font-semibold',
  }[size];

  const variantClasses = {
    primary:
      'bg-[#FFD84D] hover:bg-[#FACC15] text-[#141210] font-semibold shadow-xs border border-amber-400/60 dark:bg-[#FFD84D] dark:hover:bg-[#FACC15] dark:text-[#141210] dark:border-amber-400/40',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 dark:bg-[#172238] dark:hover:bg-[#1E293B] dark:text-[#F8FAFC] dark:border-[#1E293B] shadow-xs',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 dark:bg-[#111827] dark:hover:bg-[#172238] dark:text-[#F8FAFC] dark:border-[#1E293B] shadow-xs',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:hover:bg-[#172238] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]',
    danger:
      'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-xs border border-[#EF4444] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] dark:border-[#EF4444]',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}
