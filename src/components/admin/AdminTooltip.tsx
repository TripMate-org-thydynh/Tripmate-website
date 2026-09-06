'use client';

import React, { useState } from 'react';

export interface AdminTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function AdminTooltip({
  content,
  children,
  position = 'top',
  className = '',
}: AdminTooltipProps) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          role="tooltip"
          className={`
            absolute z-50 pointer-events-none whitespace-nowrap
            px-2 py-1 rounded text-[11px] font-medium leading-normal
            bg-slate-900 text-slate-100 dark:bg-[#1E293B] dark:text-[#F8FAFC]
            border border-slate-800 dark:border-[#334155] shadow-md
            animate-in fade-in-50 zoom-in-95 duration-100
            ${positionClasses[position]}
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
}
