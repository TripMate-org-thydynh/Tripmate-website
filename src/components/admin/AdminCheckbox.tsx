'use client';

import React from 'react';
import { Check } from 'lucide-react';

export interface AdminCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
  error?: string;
  indeterminate?: boolean;
}

export function AdminCheckbox({
  label,
  description,
  error,
  indeterminate = false,
  className = '',
  id,
  checked,
  disabled,
  ...props
}: AdminCheckboxProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={`flex items-start gap-2.5 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative flex items-center justify-center pt-0.5">
        <input
          ref={inputRef}
          type="checkbox"
          id={inputId}
          checked={checked}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={inputId}
          className={`
            w-4 h-4 rounded border transition-colors flex items-center justify-center
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            ${
              checked || indeterminate
                ? 'bg-amber-500 border-amber-500 text-white dark:bg-amber-400 dark:border-amber-400 dark:text-slate-950'
                : 'border-slate-300 dark:border-[#1E293B] bg-white dark:bg-[#111827] hover:border-slate-400 dark:hover:border-slate-600'
            }
            peer-focus-visible:ring-2 peer-focus-visible:ring-amber-500/30 peer-focus-visible:border-amber-500
          `}
        >
          {indeterminate ? (
            <span className="w-2 h-0.5 bg-white dark:bg-slate-950 rounded-xs" />
          ) : checked ? (
            <Check className="w-3 h-3 stroke-[3]" />
          ) : null}
        </label>
      </div>

      {(label || description || error) && (
        <div className="flex flex-col text-left select-none">
          {label && (
            <label
              htmlFor={inputId}
              className={`text-xs font-medium text-slate-900 dark:text-[#F8FAFC] leading-snug ${
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-[11px] text-slate-500 dark:text-[#64748B] mt-0.5">{description}</p>
          )}
          {error && (
            <p className="text-[11px] text-rose-500 dark:text-[#EF4444] mt-0.5">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export interface AdminRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
}

export function AdminRadio({
  label,
  description,
  className = '',
  id,
  checked,
  disabled,
  ...props
}: AdminRadioProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className={`flex items-start gap-2.5 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative flex items-center justify-center pt-0.5">
        <input
          type="radio"
          id={inputId}
          checked={checked}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={inputId}
          className={`
            w-4 h-4 rounded-full border transition-colors flex items-center justify-center
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            ${
              checked
                ? 'border-amber-500 bg-white dark:bg-[#111827]'
                : 'border-slate-300 dark:border-[#1E293B] bg-white dark:bg-[#111827] hover:border-slate-400 dark:hover:border-slate-600'
            }
            peer-focus-visible:ring-2 peer-focus-visible:ring-amber-500/30 peer-focus-visible:border-amber-500
          `}
        >
          {checked && <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />}
        </label>
      </div>

      {(label || description) && (
        <div className="flex flex-col text-left select-none">
          {label && (
            <label
              htmlFor={inputId}
              className={`text-xs font-medium text-slate-900 dark:text-[#F8FAFC] leading-snug ${
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-[11px] text-slate-500 dark:text-[#64748B] mt-0.5">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
