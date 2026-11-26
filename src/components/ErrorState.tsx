'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { AdminButton } from './admin/AdminButton';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = 'Lỗi tải dữ liệu',
  message,
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-start gap-3 bg-admin-surface px-5 py-8 sm:px-7 ${className}`}
    >
      <div className="grid size-9 place-items-center bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
        <AlertCircle className="size-5" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-admin-text-primary">
          {title}
        </h2>
        <p className="max-w-prose text-sm leading-relaxed text-admin-text-secondary">
          {message}
        </p>
      </div>
      {onRetry && (
        <AdminButton
          type="button"
          onClick={onRetry}
          variant="secondary"
          icon={<RefreshCw className="size-3.5" aria-hidden="true" />}
        >
          Thử lại
        </AdminButton>
      )}
    </div>
  );
}
