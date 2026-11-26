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
    'inline-flex min-w-0 max-w-full items-center justify-center break-words rounded-lg text-center font-medium leading-snug transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--admin-primary)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const sizeClasses = {
    xs: 'text-xs px-2.5 py-1 gap-1.5 min-h-7',
    sm: 'text-xs px-3 py-1.5 gap-2 min-h-8',
    md: 'text-sm px-4 py-2 gap-2 min-h-9',
    lg: 'text-sm px-5 py-2.5 gap-2.5 min-h-11 font-semibold',
  }[size];

  const variantClasses = {
    primary:
      'bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-[var(--admin-action-text)] font-semibold border border-transparent',
    secondary:
      'bg-[var(--admin-accent-bg)] hover:bg-[var(--admin-surface-hover)] text-[var(--admin-accent-ink)] border border-[var(--admin-border)]',
    outline:
      'bg-[var(--admin-surface)] hover:bg-[var(--admin-surface-hover)] text-[var(--admin-text-primary)] border border-[var(--admin-border)]',
    ghost:
      'bg-transparent hover:bg-[var(--admin-surface-hover)] text-[var(--admin-text-secondary)]',
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
