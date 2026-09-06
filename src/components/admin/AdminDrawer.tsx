'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AdminDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: AdminDrawerProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md md:max-w-lg',
    lg: 'max-w-lg md:max-w-2xl',
    xl: 'max-w-2xl md:max-w-4xl',
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#070B16]/60 dark:bg-[#070B16]/80 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <div
        className={`relative z-10 w-full ${sizeClasses} h-full bg-white dark:bg-[#111827] border-l border-[#E2E8F0] dark:border-[#1E293B] shadow-2xl flex flex-col transition-transform duration-200 animate-in slide-in-from-right`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-start justify-between gap-4 bg-slate-50/60 dark:bg-[#0D1424]/60 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172238] transition-colors cursor-pointer shrink-0"
            aria-label="Đóng bảng chi tiết"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto text-xs text-[#0F172A] dark:text-[#F8FAFC]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-3.5 border-t border-[#E2E8F0] dark:border-[#1E293B] bg-slate-50/70 dark:bg-[#0D1424]/70 shrink-0 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
