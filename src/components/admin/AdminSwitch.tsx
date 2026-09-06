'use client';

import React from 'react';

interface AdminSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function AdminSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
  size = 'md',
}: AdminSwitchProps) {
  const switchWidth = size === 'sm' ? 'w-8 h-4.5' : 'w-10 h-5.5';
  const thumbSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5';
  const thumbTranslate = size === 'sm' ? 'translate-x-3.5' : 'translate-x-4.5';

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span
              className={`text-xs font-medium ${
                disabled
                  ? 'text-[#94A3B8] dark:text-[#64748B]'
                  : 'text-[#0F172A] dark:text-[#F8FAFC]'
              }`}
            >
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-[#475569] dark:text-[#94A3B8] leading-tight">
              {description}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center rounded-full transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 p-0.5 ${switchWidth} ${
          checked
            ? 'bg-amber-500 dark:bg-amber-400'
            : 'bg-slate-200 dark:bg-[#1E293B]'
        }`}
      >
        <span
          className={`inline-block rounded-full bg-white shadow-xs transition-transform duration-200 ${thumbSize} ${
            checked ? thumbTranslate : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
