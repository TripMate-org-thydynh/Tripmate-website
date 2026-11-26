'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

const labelClass = 'flex select-none items-center justify-between text-[13px] font-medium text-admin-text-secondary';
const fieldClass = 'admin-field w-full min-w-0 text-sm disabled:cursor-not-allowed disabled:opacity-55';
const iconClass = 'pointer-events-none absolute flex items-center justify-center text-admin-text-muted';

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
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={labelClass}
          >
            <span>{label}</span>
            {props.required && <span className="text-[#EF4444] text-[11px]">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
              <div className={`left-3 ${iconClass}`}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || hint ? `${inputId}-help` : undefined}
            className={`${fieldClass} h-10 py-2 ${
              leftIcon ? 'pl-9' : 'pl-3'
            } ${rightIcon ? 'pr-9' : 'pr-3'} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className={`right-3 ${iconClass}`}>
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-help`} className="text-xs font-medium text-admin-danger">{error}</p>
        ) : hint ? (
          <p id={`${inputId}-help`} className="text-xs text-admin-text-muted">{hint}</p>
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
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className={labelClass}
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
            aria-invalid={error ? true : undefined}
            aria-describedby={error || hint ? `${selectId}-help` : undefined}
            className={`${fieldClass} h-10 cursor-pointer appearance-none py-2 pl-3 pr-8 ${className}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className={`right-2.5 size-4 ${iconClass}`} aria-hidden="true" />
        </div>
        {error ? (
          <p id={`${selectId}-help`} className="text-xs font-medium text-admin-danger">{error}</p>
        ) : hint ? (
          <p id={`${selectId}-help`} className="text-xs text-admin-text-muted">{hint}</p>
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
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className={labelClass}
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
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${textareaId}-help` : undefined}
          className={`${fieldClass} resize-y p-3 ${className}`}
          {...props}
        />
        {error ? (
          <p id={`${textareaId}-help`} className="text-xs font-medium text-admin-danger">{error}</p>
        ) : hint ? (
          <p id={`${textareaId}-help`} className="text-xs text-admin-text-muted">{hint}</p>
        ) : null}
      </div>
    );
  }
);
AdminTextarea.displayName = 'AdminTextarea';
