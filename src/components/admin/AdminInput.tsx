'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      className = '',
      containerClassName = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-slate-700 dark:text-[#F8FAFC] select-none flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-[#EF4444] text-[11px]">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 dark:text-[#64748B] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full rounded-lg text-xs bg-white dark:bg-[#111827] border transition-all duration-150 py-2 h-9 text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-[#64748B] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500/30 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-9' : 'pl-3'
            } ${rightIcon ? 'pr-9' : 'pr-3'} ${
              error
                ? 'border-[#EF4444] focus-visible:border-[#EF4444]'
                : 'border-slate-300 dark:border-[#1E293B] hover:border-slate-400 dark:hover:border-slate-600 focus-visible:border-amber-500'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-slate-400 dark:text-[#64748B] pointer-events-none flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-[11px] text-[#EF4444] font-medium leading-tight">{error}</p>
        ) : hint ? (
          <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] leading-tight">{hint}</p>
        ) : null}
      </div>
    );
  }
);
AdminInput.displayName = 'AdminInput';

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

export const AdminSelect = React.forwardRef<HTMLSelectElement, AdminSelectProps>(
  (
    {
      label,
      error,
      hint,
      className = '',
      containerClassName = '',
      id,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium text-slate-700 dark:text-[#F8FAFC] select-none flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-[#EF4444] text-[11px]">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`w-full appearance-none rounded-lg text-xs bg-white dark:bg-[#111827] border transition-all duration-150 py-2 h-9 pl-3 pr-8 text-slate-900 dark:text-[#F8FAFC] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500/30 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed cursor-pointer ${
              error
                ? 'border-[#EF4444] focus-visible:border-[#EF4444]'
                : 'border-slate-300 dark:border-[#1E293B] hover:border-slate-400 dark:hover:border-slate-600 focus-visible:border-amber-500'
            } ${className}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-[#64748B] absolute right-2.5 pointer-events-none" />
        </div>
        {error ? (
          <p className="text-[11px] text-[#EF4444] font-medium leading-tight">{error}</p>
        ) : hint ? (
          <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] leading-tight">{hint}</p>
        ) : null}
      </div>
    );
  }
);
AdminSelect.displayName = 'AdminSelect';

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
  containerClassName?: string;
}

export const AdminTextarea = React.forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  (
    {
      label,
      error,
      hint,
      className = '',
      containerClassName = '',
      id,
      disabled,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-medium text-slate-700 dark:text-[#F8FAFC] select-none flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-[#EF4444] text-[11px]">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          className={`w-full rounded-lg text-xs bg-white dark:bg-[#111827] border transition-all duration-150 p-3 text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-[#64748B] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500/30 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed ${
            error
              ? 'border-[#EF4444] focus-visible:border-[#EF4444]'
              : 'border-slate-300 dark:border-[#1E293B] hover:border-slate-400 dark:hover:border-slate-600 focus-visible:border-amber-500'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-[11px] text-[#EF4444] font-medium leading-tight">{error}</p>
        ) : hint ? (
          <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] leading-tight">{hint}</p>
        ) : null}
      </div>
    );
  }
);
AdminTextarea.displayName = 'AdminTextarea';
