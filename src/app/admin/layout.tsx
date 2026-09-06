'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { logoutAdmin } from '@/app/actions';
import { AdminCommandPalette } from '@/components/admin/AdminCommandPalette';
import { AdminHealthPopover } from '@/components/admin/AdminHealthPopover';
import { AdminNotificationDropdown } from '@/components/admin/AdminNotificationDropdown';
import {
  Compass,
  Users,
  Settings,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  BookOpen,
  CalendarDays,
  CheckSquare,
  TrendingUp,
  DollarSign,
  CreditCard,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';

const navGroups = [
  {
    group: 'Analytics & Tổng quan',
    items: [
      { name: 'Tổng quan KPI', href: '/admin', icon: LayoutDashboard },
      { name: 'Tăng trưởng & Phễu', href: '/admin/growth', icon: TrendingUp },
      { name: 'Doanh thu & Ví', href: '/admin/revenue', icon: DollarSign },
      { name: 'AI Analytics', href: '/admin/ai', icon: Sparkles },
    ],
  },
  {
    group: 'Kinh doanh & Thành viên',
    items: [
      { name: 'Gói đăng ký', href: '/admin/subscriptions', icon: CreditCard },
      { name: 'Quản lý Users', href: '/admin/users', icon: Users },
    ],
  },
  {
    group: 'Chuyến đi & Dữ liệu',
    items: [
      { name: 'Chuyến đi', href: '/admin/trips', icon: Compass },
      { name: 'Đặt chỗ', href: '/admin/reservations', icon: CalendarDays },
      { name: 'Nhật ký', href: '/admin/journal', icon: BookOpen },
      { name: 'Đồ đạc', href: '/admin/packing', icon: CheckSquare },
    ],
  },
  {
    group: 'Hệ thống',
    items: [
      { name: 'Cấu hình', href: '/admin/configs', icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Skip layout entirely for login page
  const isLoginPage = pathname === '/admin/login';

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('admin_sidebar_collapsed');
    if (saved !== null) {
      setCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('admin_sidebar_collapsed', String(next));
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  // Determine current page title for breadcrumb
  let currentPageTitle = 'Tổng quan';
  for (const group of navGroups) {
    const found = group.items.find((i) => i.href === pathname);
    if (found) {
      currentPageTitle = found.name;
      break;
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B16] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col md:flex-row transition-colors duration-150">
      {/* MOBILE HEADER */}
      <header className="md:hidden sticky top-0 z-40 bg-white dark:bg-[#0D1424] border-b border-[#E2E8F0] dark:border-[#1E293B] h-14 px-4 flex items-center justify-between shadow-2xs">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFD84D] flex items-center justify-center text-[#141210] font-black text-sm shadow-xs border border-amber-500/20">
            TM
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              TripMate
            </span>
            <span className="text-[10px] font-semibold bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-sm border border-amber-500/20">
              Admin
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="p-2 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#111827] text-[#475569] dark:text-[#94A3B8] cursor-pointer hover:bg-[#F1F5F9] dark:hover:bg-[#172238]"
            aria-label="Tìm kiếm nhanh"
            title="Tìm kiếm nhanh (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>
          <ThemeToggle />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#111827] text-[#475569] dark:text-[#94A3B8] cursor-pointer hover:bg-[#F1F5F9] dark:hover:bg-[#172238]"
            aria-label={sidebarOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-[#070B16]/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#0D1424] border-r border-[#E2E8F0] dark:border-[#1E293B] 
          flex flex-col transition-all duration-200 ease-in-out md:static shrink-0
          ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'md:w-16' : 'md:w-60'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-14 px-4 border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between shrink-0">
          <Link
            href="/admin"
            className={`flex items-center gap-2.5 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}
          >
            <div className="w-7 h-7 rounded-lg bg-[#FFD84D] flex items-center justify-center text-[#141210] font-black text-xs shadow-xs shrink-0 border border-amber-500/20">
              TM
            </div>
            {!collapsed && (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC] tracking-tight truncate">
                  TripMate
                </span>
                <span className="text-[10px] font-semibold bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded-sm border border-amber-500/20 uppercase">
                  Admin
                </span>
              </div>
            )}
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-md text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] cursor-pointer"
            aria-label="Đóng menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links by Group */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto flex flex-col gap-5">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="flex flex-col gap-1">
              {!collapsed && (
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] dark:text-[#64748B] px-2.5 mb-1 select-none truncate">
                  {group.group}
                </span>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    title={collapsed ? item.name : undefined}
                    aria-current={active ? 'page' : undefined}
                    className={`h-8.5 rounded-lg flex items-center gap-2.5 text-xs font-medium transition-colors select-none ${
                      collapsed ? 'justify-center px-0' : 'px-2.5'
                    } ${
                      active
                        ? 'bg-amber-500/10 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 font-semibold shadow-2xs border border-amber-500/15'
                        : 'text-[#475569] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#172238] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-[#94A3B8] dark:text-[#64748B]'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex flex-col gap-2 shrink-0 bg-slate-50/50 dark:bg-[#0D1424]/80">
          {/* Collapse Toggle Button (Desktop Only) */}
          <button
            type="button"
            onClick={toggleCollapsed}
            className={`hidden md:flex items-center gap-2 w-full py-1.5 px-2 rounded-lg text-xs text-[#475569] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172238] transition-colors cursor-pointer ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title={collapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu'}
            aria-label={collapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span className="truncate">Thu gọn sidebar</span>
              </>
            )}
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 w-full py-2 px-2.5 rounded-lg text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title={collapsed ? 'Đăng xuất' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* DESKTOP HEADER */}
        <header className="hidden md:flex h-14 bg-white dark:bg-[#0D1424] border-b border-[#E2E8F0] dark:border-[#1E293B] px-6 items-center justify-between shrink-0 shadow-2xs">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#475569] dark:text-[#94A3B8]">
            <Link
              href="/admin"
              className="hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors font-medium"
            >
              Admin
            </Link>
            <span className="text-[#94A3B8] dark:text-[#64748B]">/</span>
            <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              {currentPageTitle}
            </span>
          </div>

          {/* Top Bar Actions & Status */}
          <div className="flex items-center gap-3">
            {/* Quick Search Shortcut Button */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md border border-[#E2E8F0] dark:border-[#1E293B] bg-slate-50 hover:bg-slate-100 dark:bg-[#111827] dark:hover:bg-[#172238] text-xs text-[#94A3B8] cursor-pointer transition-colors select-none"
              title="Tìm kiếm nhanh hoặc dùng phím tắt ⌘K"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Tìm kiếm nhanh...</span>
              <kbd className="text-[10px] px-1 py-0.2 rounded-sm bg-white dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B] text-[#475569] dark:text-[#94A3B8] font-mono shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* API Status Popover */}
            <AdminHealthPopover />

            {/* Notifications Dropdown */}
            <AdminNotificationDropdown />

            {/* Dark/Light Theme Toggle */}
            <ThemeToggle />

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 pl-3 border-l border-[#E2E8F0] dark:border-[#1E293B] cursor-pointer select-none"
              >
                <div className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  SA
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold leading-tight text-[#0F172A] dark:text-[#F8FAFC]">
                    Admin
                  </span>
                  <span className="text-[10px] text-[#475569] dark:text-[#94A3B8] leading-tight">
                    Super User
                  </span>
                </div>
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xl py-1 z-50 animate-in fade-in-50 zoom-in-95 duration-100"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                    <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                      Super Admin
                    </p>
                    <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] truncate">
                      admin@tripmate.vn
                    </p>
                  </div>
                  <Link
                    href="/admin/configs"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172238] transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Cấu hình hệ thống</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN SCROLLABLE CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#F8FAFC] dark:bg-[#070B16]">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>

      {/* GLOBAL COMMAND PALETTE MODAL (Cmd+K / Ctrl+K) */}
      <AdminCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
