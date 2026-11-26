'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: AdminModalProps) {
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
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#070B16]/60 dark:bg-[#070B16]/80 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative z-10 w-full ${sizeClasses} bg-admin-surface border-admin-border shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-admin-border flex items-start justify-between gap-4 bg-admin-bg/60 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-admin-text-primary">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-admin-text-secondary dark:text-admin-text-muted mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-admin-text-muted hover:text-admin-text-primary hover:bg-admin-surface-hover transition-colors cursor-pointer shrink-0"
            aria-label="Đóng hộp thoại"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto text-xs text-admin-text-primary">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-3.5 border-t border-admin-border bg-admin-bg/60 shrink-0 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
