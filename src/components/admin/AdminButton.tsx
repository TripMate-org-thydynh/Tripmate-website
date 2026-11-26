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
    'inline-flex min-w-0 max-w-full items-center justify-center break-words text-center font-semibold leading-snug transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-primary disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    xs: 'text-xs px-2.5 py-1 gap-1.5 min-h-8',
    sm: 'text-xs px-3 py-1.5 gap-2 min-h-9',
    md: 'text-sm px-4 py-2 gap-2 min-h-10',
    lg: 'text-sm px-5 py-2.5 gap-2.5 min-h-11 font-semibold',
  }[size];

  const variantClasses = {
    primary:
      'bg-admin-primary hover:bg-admin-primary-hover text-[var(--admin-action-text)]',
    secondary:
      'bg-[var(--admin-accent-bg)] hover:bg-admin-surface-hover text-[var(--admin-accent-ink)]',
    outline:
      'bg-admin-surface hover:bg-admin-surface-hover text-admin-text-primary',
    ghost:
      'bg-transparent hover:bg-admin-surface-hover text-admin-text-secondary',
    danger:
      'bg-red-700 hover:bg-red-800 text-white',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
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
