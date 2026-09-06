'use client';

import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  description?: string;
  colSpan?: number;
  /** Render as a <tr> wrapping a <td> for use inside <tbody> */
  asTableRow?: boolean;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({
  title,
  message = 'Chưa có dữ liệu',
  description,
  colSpan = 1,
  asTableRow = false,
  icon,
  action,
}: EmptyStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-2.5 py-12 px-4 max-w-sm mx-auto text-center">
      <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-1 border border-slate-200/60 dark:border-slate-700/60">
        {icon || <Inbox className="w-5 h-5" />}
      </div>
      {title && (
        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </h4>
      )}
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        {description || message}
      </p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );

  if (asTableRow) {
    return (
      <tr>
        <td colSpan={colSpan}>{content}</td>
      </tr>
    );
  }

  return content;
}
