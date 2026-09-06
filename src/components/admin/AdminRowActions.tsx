'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';

export interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface AdminRowActionsProps {
  actions: ActionItem[];
  quickAction?: ActionItem;
  className?: string;
}

export function AdminRowActions({
  actions,
  quickAction,
  className = '',
}: AdminRowActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className={`relative inline-flex items-center justify-end gap-1.5 ${className}`} ref={menuRef}>
      {quickAction && (
        <button
          type="button"
          disabled={quickAction.disabled}
          onClick={quickAction.onClick}
          className="p-1.5 rounded-md text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-[#172238] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title={quickAction.label}
          aria-label={quickAction.label}
        >
          {quickAction.icon}
        </button>
      )}

      {actions.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-[#172238] transition-colors cursor-pointer ${
              open ? 'bg-slate-100 dark:bg-[#172238] text-slate-900 dark:text-[#F8FAFC]' : ''
            }`}
            aria-label="Tùy chọn thao tác"
            aria-expanded={open}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {open && (
            <div
              className="absolute right-0 top-full mt-1 w-44 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] shadow-lg py-1 z-30 animate-in fade-in-50 zoom-in-95 duration-100 text-xs font-medium"
              role="menu"
            >
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={action.disabled}
                  onClick={() => {
                    setOpen(false);
                    action.onClick();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    action.variant === 'danger'
                      ? 'text-rose-600 dark:text-[#EF4444] hover:bg-rose-50 dark:hover:bg-rose-950/40'
                      : 'text-slate-700 dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#172238]'
                  }`}
                  role="menuitem"
                >
                  {action.icon && <span className="w-4 h-4 shrink-0 flex items-center justify-center">{action.icon}</span>}
                  <span className="truncate">{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
