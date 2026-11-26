'use client';

import React from 'react';

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function AdminCard({
  children,
  className = '',
  noPadding = false,
  ...props
}: AdminCardProps) {
  return (
    <div
      className={`min-w-0 max-w-full bg-admin-surface ${
        noPadding ? '' : 'p-4 sm:p-6'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AdminCardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminCardTitle({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`flex items-center gap-2 text-base font-semibold tracking-tight text-admin-text-primary ${className}`}
    >
      {children}
    </h3>
  );
}

export function AdminCardDescription({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`mt-1 text-sm leading-relaxed text-admin-text-muted ${className}`}
    >
      {children}
    </p>
  );
}

export function AdminCardContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`text-admin-text-primary ${className}`}>{children}</div>;
}

export function AdminCardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-4 flex items-center justify-between gap-3 border-t border-admin-border pt-3.5 text-xs text-admin-text-muted ${className}`}
    >
      {children}
    </div>
  );
}
