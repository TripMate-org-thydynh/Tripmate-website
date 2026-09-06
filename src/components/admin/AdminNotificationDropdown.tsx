'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCheck,
  CreditCard,
  Compass,
  Sparkles,
  ShieldAlert,
  DollarSign,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'subscription' | 'trip' | 'ai' | 'security' | 'payment';
  href?: string;
}

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'Gói Hội Viên SQUAD Mới',
    message: 'Nhóm du lịch "Hà Nội Phượt" vừa kích hoạt thành công gói SQUAD Pass 12 tháng.',
    time: '5 phút trước',
    isRead: false,
    type: 'subscription',
    href: '/admin/subscriptions',
  },
  {
    id: 'notif-2',
    title: 'Giao Dịch MoMo Hoàn Tất',
    message: 'Webhook MoMo IPN đã ghi nhận thành công giao dịch 199.000 VNĐ.',
    time: '25 phút trước',
    isRead: false,
    type: 'payment',
    href: '/admin/revenue',
  },
  {
    id: 'notif-3',
    title: 'Cột Mốc Prompt AI Gemini',
    message: 'Đã hoàn thành 100+ prompt tạo lịch trình và OCR hóa đơn không có lỗi phát sinh.',
    time: '1 giờ trước',
    isRead: false,
    type: 'ai',
    href: '/admin/ai',
  },
  {
    id: 'notif-4',
    title: 'Chuyến Đi Mới Khởi Tạo',
    message: 'Chuyến đi "Trekking Fansipan & Sapa Mùa Lúa" đã được tạo với 8 thành viên.',
    time: '2 giờ trước',
    isRead: true,
    type: 'trip',
    href: '/admin/trips',
  },
  {
    id: 'notif-5',
    title: 'Cảnh Báo Kiểm Toán Hệ Thống',
    message: 'Hệ thống đã tự động sao lưu cấu hình bảo mật và danh sách feature flags.',
    time: 'Hôm qua',
    isRead: true,
    type: 'security',
    href: '/admin/configs',
  },
];

const NOTIF_ICONS = {
  subscription: { icon: CreditCard, color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' },
  payment: { icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  ai: { icon: Sparkles, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' },
  trip: { icon: Compass, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  security: { icon: ShieldAlert, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
};

export function AdminNotificationDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_notifications_state');
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, []);

  const saveNotifications = (newNotifs: AdminNotification[]) => {
    setNotifications(newNotifs);
    try {
      localStorage.setItem('admin_notifications_state', JSON.stringify(newNotifs));
    } catch {
      // ignore
    }
  };

  // Outside click listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    saveNotifications(updated);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveNotifications(updated);
  };

  const handleItemClick = (notif: AdminNotification) => {
    markAsRead(notif.id);
    setOpen(false);
    if (notif.href) {
      router.push(notif.href);
    }
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-[#475569] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172238] transition-colors cursor-pointer relative"
        aria-label="Xem thông báo hệ thống"
        title="Xem thông báo hệ thống"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 ring-2 ring-white dark:ring-[#0D1424]" />
        )}
      </button>

      {/* Dropdown Card */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] shadow-2xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100 flex flex-col">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 dark:border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                Thông Báo Hệ Thống
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Đã đọc hết</span>
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 dark:bg-[#0D1424] border-b border-slate-100 dark:border-[#1E293B]">
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-[#F8FAFC] shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Tất cả ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-[#F8FAFC] shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Chưa đọc ({unreadCount})
              </button>
            </div>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-[11px] text-slate-400 hover:text-rose-500 flex items-center gap-1 cursor-pointer transition-colors"
                title="Xóa tất cả thông báo"
              >
                <Trash2 className="w-3 h-3" />
                <span>Xóa hết</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#1E293B]/60">
            {filtered.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
                <Bell className="w-7 h-7 mb-2 opacity-30" />
                <p>Không có thông báo nào {filter === 'unread' ? 'chưa đọc' : ''}</p>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Các sự kiện hoạt động mới sẽ hiển thị tại đây
                </span>
              </div>
            ) : (
              filtered.map((n) => {
                const config = NOTIF_ICONS[n.type] || NOTIF_ICONS.security;
                const Icon = config.icon;

                return (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer relative group ${
                      !n.isRead
                        ? 'bg-amber-500/5 dark:bg-amber-500/10 hover:bg-amber-500/10 dark:hover:bg-amber-500/15'
                        : 'hover:bg-slate-50 dark:hover:bg-[#172238]'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${config.color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-[#F8FAFC] truncate">
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>

                    {/* Unread indicator / Link arrow */}
                    <div className="shrink-0 flex items-center self-center">
                      {!n.isRead ? (
                        <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
                      ) : (
                        <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Link */}
          <div className="p-2.5 bg-slate-50 dark:bg-[#0D1424] border-t border-slate-100 dark:border-[#1E293B] text-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              TripMate Live Telemetry & Event Streams
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
