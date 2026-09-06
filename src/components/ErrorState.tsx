'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

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
      className={`flex flex-col items-center justify-center gap-3 py-12 px-6 max-w-md mx-auto text-center ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-1">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
          aria-label="Thử tải lại dữ liệu"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Thử lại
        </button>
      )}
    </div>
  );
}
