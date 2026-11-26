'use client';

import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';

export interface ActionItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface AdminRowActionsProps {
  actions: ActionItem[];
  quickAction?: ActionItem;
  className?: string;
}

export function AdminRowActions({ actions, quickAction, className = '' }: AdminRowActionsProps) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ width: 176, left: 0, top: 0 });
  const buttonClass = 'admin-toolbar-control min-h-8 min-w-8 px-1.5 disabled:cursor-not-allowed disabled:opacity-40';

  function positionPanel(event: MouseEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const width = Math.min(176, viewportWidth - 16);
    const height = Math.min(8 + actions.length * 36, viewportHeight - 16);
    const below = bounds.bottom + 4;
    const above = bounds.top - height - 4;

    setPosition({
      width,
      left: Math.max(8, Math.min(bounds.right - width, viewportWidth - width - 8)),
      top: below + height <= viewportHeight - 8 ? below : Math.max(8, above),
    });
  }

  useEffect(() => {
    if (!open) return;
    const closeOnMove = (event: Event) => {
      const current = panel.current;
      if (current?.matches(':popover-open') && !(event.target instanceof Node && current.contains(event.target))) {
        current.hidePopover();
      }
    };
    window.addEventListener('scroll', closeOnMove, true);
    window.addEventListener('resize', closeOnMove);
    return () => {
      window.removeEventListener('scroll', closeOnMove, true);
      window.removeEventListener('resize', closeOnMove);
    };
  }, [open]);

  return (
    <div className={`inline-flex items-center justify-end gap-1 ${className}`}>
      {quickAction && (
        <button type="button" disabled={quickAction.disabled} onClick={quickAction.onClick}
          className={buttonClass} title={quickAction.label} aria-label={quickAction.label}>
          {quickAction.icon}
        </button>
      )}
      {actions.length > 0 && (
        <>
          <button type="button" onClick={positionPanel} popoverTarget={id}
            className={buttonClass} aria-label="Tùy chọn thao tác" aria-expanded={open}>
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </button>
          <div ref={panel} id={id} popover="auto" role="group" aria-label="Thao tác của dòng" style={position}
            onToggle={(event) => setOpen(event.currentTarget.matches(':popover-open'))}
            className="fixed inset-auto m-0 max-h-[calc(100dvh-1rem)] max-w-none overflow-y-auto bg-admin-surface py-1 text-xs font-medium text-admin-text-primary shadow-xl">
            {actions.map((action, index) => (
              <button key={index} type="button" disabled={action.disabled}
                onClick={() => {
                  panel.current?.hidePopover();
                  action.onClick();
                }}
                className={`flex min-h-9 w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left transition-colors focus-visible:-outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
                  action.variant === 'danger'
                    ? 'text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/40'
                    : 'text-admin-text-secondary hover:bg-admin-surface-hover hover:text-admin-text-primary'
                }`}>
                {action.icon && <span className="flex size-4 shrink-0 items-center justify-center" aria-hidden="true">{action.icon}</span>}
                <span className="truncate">{action.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
