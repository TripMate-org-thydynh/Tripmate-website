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
      className={`bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] rounded-xl shadow-xs transition-colors duration-150 ${
        noPadding ? '' : 'p-5'
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
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-[#1E293B] ${className}`}
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
      className={`text-sm font-semibold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2 ${className}`}
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
      className={`text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5 leading-normal ${className}`}
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
  return <div className={`text-slate-800 dark:text-[#F8FAFC] ${className}`}>{children}</div>;
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
      className={`pt-3.5 mt-4 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between text-xs text-slate-500 dark:text-[#94A3B8] ${className}`}
    >
      {children}
    </div>
  );
}
