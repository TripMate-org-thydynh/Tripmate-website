'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Huỷ bỏ',
  isDestructive = false,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#070B16]/60 dark:bg-[#070B16]/80 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog Box */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl p-6 shadow-2xl flex flex-col gap-4 text-[#0F172A] dark:text-[#F8FAFC] animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isDestructive
                  ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/25'
                  : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/25'
              }`}
            >
              <AlertTriangle className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-semibold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172238] transition-colors cursor-pointer"
            aria-label="Đóng hộp thoại"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed pl-12">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-4 mt-1 border-t border-[#E2E8F0] dark:border-[#1E293B]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0D1424] text-[#475569] dark:text-[#94A3B8] text-xs font-medium hover:bg-[#F1F5F9] dark:hover:bg-[#172238] transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50 ${
              isDestructive
                ? 'bg-[#EF4444] hover:bg-red-600 text-white'
                : 'bg-[#FFD84D] hover:bg-[#FACC15] text-[#141210] font-semibold border border-amber-400/50 dark:bg-[#FFD84D] dark:hover:bg-[#FACC15] dark:text-[#141210]'
            }`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isLoading ? 'Đang xử lý...' : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
