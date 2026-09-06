'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Sparkles,
  CreditCard,
  Users,
  Compass,
  CalendarDays,
  BookOpen,
  CheckSquare,
  Settings,
  X,
  ArrowRight,
  Sun,
  Moon,
  PlusCircle,
} from 'lucide-react';

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Trang Điều Hướng' | 'Hành Động Nhanh';
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  action?: () => void;
  keywords?: string[];
}

interface AdminCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminCommandPalette({ isOpen, onClose }: AdminCommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, [isOpen]);

  const toggleTheme = () => {
    if (typeof document === 'undefined') return;
    const nextDark = !document.documentElement.classList.contains('dark');
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    setIsDark(nextDark);
    window.dispatchEvent(new Event('theme-change'));
  };

  const items: PaletteItem[] = [
    // Navigation pages
    {
      id: 'nav-dashboard',
      title: 'Tổng quan KPI Dashboard',
      subtitle: 'Xem số liệu North Star, người dùng và chuyến đi',
      category: 'Trang Điều Hướng',
      icon: LayoutDashboard,
      href: '/admin',
      keywords: ['dashboard', 'overview', 'kpi', 'thong ke', 'tong quan'],
    },
    {
      id: 'nav-growth',
      title: 'Tăng trưởng & Phễu Chuyển Đổi',
      subtitle: 'Phễu người dùng, nguồn truy cập và xu hướng điểm đến',
      category: 'Trang Điều Hướng',
      icon: TrendingUp,
      href: '/admin/growth',
      keywords: ['growth', 'funnel', 'tang truong', 'chuyen doi', 'xu huong'],
    },
    {
      id: 'nav-revenue',
      title: 'Doanh Thu & Ví Tài Chính',
      subtitle: 'MRR, ARR, tỷ lệ PLUS/SQUAD và cổng thanh toán',
      category: 'Trang Điều Hướng',
      icon: DollarSign,
      href: '/admin/revenue',
      keywords: ['revenue', 'mrr', 'arr', 'doanh thu', 'tai chinh', 'tien'],
    },
    {
      id: 'nav-ai',
      title: 'AI Assistant & Gemini Analytics',
      subtitle: 'Giám sát prompt, mô hình Gemini và telemetry',
      category: 'Trang Điều Hướng',
      icon: Sparkles,
      href: '/admin/ai',
      keywords: ['ai', 'gemini', 'prompt', 'tri tue nhan tao', 'chat'],
    },
    {
      id: 'nav-subs',
      title: 'Gói Đăng Ký Hội Viên',
      subtitle: 'Quản lý PLUS, SQUAD Pass, ghế nhóm và gia hạn',
      category: 'Trang Điều Hướng',
      icon: CreditCard,
      href: '/admin/subscriptions',
      keywords: ['subscription', 'sub', 'hoi vien', 'plus', 'squad', 'goi'],
    },
    {
      id: 'nav-users',
      title: 'Quản Lý Người Dùng',
      subtitle: 'Tìm kiếm, phân quyền, khóa và xóa tài khoản',
      category: 'Trang Điều Hướng',
      icon: Users,
      href: '/admin/users',
      keywords: ['users', 'nguoi dung', 'tai khoan', 'thanh vien', 'role'],
    },
    {
      id: 'nav-trips',
      title: 'Quản Lý Chuyến Đi',
      subtitle: 'Danh sách hành trình, lịch trình và ngân sách',
      category: 'Trang Điều Hướng',
      icon: Compass,
      href: '/admin/trips',
      keywords: ['trips', 'chuyen di', 'hanh trinh', 'diem den'],
    },
    {
      id: 'nav-reservations',
      title: 'Quản Lý Đặt Chỗ (Reservations)',
      subtitle: 'Vé máy bay, khách sạn, tour du lịch và dịch vụ',
      category: 'Trang Điều Hướng',
      icon: CalendarDays,
      href: '/admin/reservations',
      keywords: ['reservations', 'booking', 'dat cho', 've', 'khach san'],
    },
    {
      id: 'nav-journal',
      title: 'Nhật Ký Hành Trình',
      subtitle: 'Kỷ niệm, câu chuyện chuyến đi và tâm trạng',
      category: 'Trang Điều Hướng',
      icon: BookOpen,
      href: '/admin/journal',
      keywords: ['journal', 'nhat ky', 'bai viet', 'tam trang', 'story'],
    },
    {
      id: 'nav-packing',
      title: 'Đồ Đạc Chuẩn Bị',
      subtitle: 'Checklist hành lý, danh mục vật dụng và người phụ trách',
      category: 'Trang Điều Hướng',
      icon: CheckSquare,
      href: '/admin/packing',
      keywords: ['packing', 'do dac', 'hanh ly', 'checklist', 'chuan bi'],
    },
    {
      id: 'nav-configs',
      title: 'Cấu Hình Hệ Thống',
      subtitle: 'Feature flags, API keys và cổng thanh toán MoMo/ZaloPay',
      category: 'Trang Điều Hướng',
      icon: Settings,
      href: '/admin/configs',
      keywords: ['configs', 'cau hinh', 'settings', 'flags', 'api', 'keys'],
    },

    // Quick Actions
    {
      id: 'act-new-trip',
      title: 'Tạo chuyến đi mới',
      subtitle: 'Khởi tạo hành trình mới trên hệ thống',
      category: 'Hành Động Nhanh',
      icon: PlusCircle,
      href: '/admin/trips',
      keywords: ['tao moi', 'them chuyen di', 'new trip'],
    },
    {
      id: 'act-new-journal',
      title: 'Viết bài nhật ký mới',
      subtitle: 'Thêm bài viết kỷ niệm hoặc ghi chép chuyến đi',
      category: 'Hành Động Nhanh',
      icon: BookOpen,
      href: '/admin/journal',
      keywords: ['viet nhat ky', 'bai viet moi', 'new journal'],
    },
    {
      id: 'act-toggle-theme',
      title: 'Đổi giao diện Sáng / Tối',
      subtitle: 'Chuyển đổi tức thời giữa Dark Mode và Light Mode',
      category: 'Hành Động Nhanh',
      icon: isDark ? Sun : Moon,
      action: () => toggleTheme(),
      keywords: ['theme', 'dark', 'light', 'sang', 'toi', 'giao dien'],
    },
  ];

  const filteredItems = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q)))
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: PaletteItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#070B16]/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Palette Modal */}
      <div
        className="relative w-full max-w-xl rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-[#1E293B]">
          <Search className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm trang, thao tác nhanh, module quản trị..."
            className="flex-1 text-xs bg-transparent text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-[#64748B] focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-[#0D1424] border border-slate-200 dark:border-[#1E293B] text-slate-500 font-mono select-none">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-[#1E293B]/40">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
              <Search className="w-7 h-7 mb-2 opacity-30" />
              <p>Không tìm thấy kết quả phù hợp với &quot;{query}&quot;</p>
              <span className="text-[11px] text-slate-500 mt-0.5">
                Thử gõ &quot;users&quot;, &quot;doanh thu&quot;, &quot;ai&quot;, &quot;chuyen di&quot;...
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 dark:bg-amber-500/20 text-[#0F172A] dark:text-[#F8FAFC]'
                        : 'hover:bg-slate-50 dark:hover:bg-[#172238] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 dark:bg-amber-400 text-white dark:text-slate-950 shadow-xs'
                            : 'bg-slate-100 dark:bg-[#0D1424] text-slate-500 dark:text-[#94A3B8]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold truncate text-slate-900 dark:text-[#F8FAFC]">
                            {item.title}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-slate-100 dark:bg-[#0D1424] text-slate-400 dark:text-[#64748B] font-medium uppercase shrink-0">
                            {item.category}
                          </span>
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-slate-400 dark:text-[#94A3B8] truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      {isSelected && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                          <span>Mở</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-[#0D1424] border-t border-slate-200 dark:border-[#1E293B] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded-sm bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] font-mono text-[10px]">
                ↑↓
              </kbd>
              <span>di chuyển</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded-sm bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] font-mono text-[10px]">
                ↵
              </kbd>
              <span>chọn</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-500">TripMate Admin Command Center</span>
        </div>
      </div>
    </div>
  );
}
