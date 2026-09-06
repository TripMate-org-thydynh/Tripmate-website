'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss?: (id: string) => void;
  onClose?: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss, onClose }: ToastProps) {
  const handleDismiss = onDismiss || onClose || (() => {});
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = {
    success: {
      bg: 'bg-white dark:bg-[#111827] border-[#22C55E]/40',
      text: 'text-[#0F172A] dark:text-[#F8FAFC]',
      icon: CheckCircle2,
      iconColor: 'text-[#22C55E]',
    },
    error: {
      bg: 'bg-white dark:bg-[#111827] border-[#EF4444]/40',
      text: 'text-[#0F172A] dark:text-[#F8FAFC]',
      icon: AlertCircle,
      iconColor: 'text-[#EF4444]',
    },
    info: {
      bg: 'bg-white dark:bg-[#111827] border-amber-500/40',
      text: 'text-[#0F172A] dark:text-[#F8FAFC]',
      icon: Info,
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
  }[toast.type];

  const Icon = config.icon;

  return (
    <div
      className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 ${config.bg} ${config.text}`}
      role="status"
    >
      <div className="flex items-center gap-2.5">
        <Icon className={`w-4 h-4 shrink-0 ${config.iconColor}`} />
        <span className="text-xs font-medium">{toast.message}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Đóng thông báo"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
