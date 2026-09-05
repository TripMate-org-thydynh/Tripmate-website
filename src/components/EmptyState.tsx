'use client';

import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  colSpan?: number;
  /** Render as a <tr> wrapping a <td> for use inside <tbody> */
  asTableRow?: boolean;
}

export default function EmptyState({
  message = 'Chưa có dữ liệu',
  colSpan = 1,
  asTableRow = false,
}: EmptyStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 py-10 px-4">
      <div className="w-12 h-12 rounded-xl bg-muted border-2 border-black dark:border-white flex items-center justify-center shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff]">
        <Inbox className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-xs font-black uppercase text-muted-foreground text-center">
        {message}
      </p>
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
