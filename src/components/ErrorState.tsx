'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 border-[3px] border-destructive flex items-center justify-center shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_rgba(254,250,220,0.3)]">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center max-w-md">
        <h3 className="text-sm font-black uppercase text-black dark:text-white">
          Lỗi tải dữ liệu
        </h3>
        <p className="text-xs font-bold text-muted-foreground">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#252322] border-[3px] border-black dark:border-white text-black dark:text-white text-xs font-black uppercase flex items-center gap-2 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#ffffff] hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer"
          aria-label="Thử tải lại dữ liệu"
        >
          <RefreshCw className="w-4 h-4" />
          Thử lại
        </button>
      )}
    </div>
  );
}
