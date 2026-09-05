'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { logoutAdmin } from '@/app/actions';
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
  Shield,
  TrendingUp,
  DollarSign,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { name: 'Tổng quan KPI', href: '/admin', icon: LayoutDashboard },
  { name: 'Tăng trưởng', href: '/admin/growth', icon: TrendingUp },
  { name: 'Doanh thu & Ví', href: '/admin/revenue', icon: DollarSign },
  { name: 'AI Analytics', href: '/admin/ai', icon: Sparkles },
  { name: 'Quản lý Users', href: '/admin/users', icon: Users },
  { name: 'Chuyến đi', href: '/admin/trips', icon: Compass },
  { name: 'Đặt chỗ', href: '/admin/reservations', icon: CalendarDays },
  { name: 'Nhật ký', href: '/admin/journal', icon: BookOpen },
  { name: 'Đồ đạc', href: '/admin/packing', icon: CheckSquare },
  { name: 'Cấu hình', href: '/admin/configs', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Skip layout entirely for login page
  const isLoginPage = pathname === '/admin/login';
  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#FEFADC] text-black dark:bg-[#1C1A19] dark:text-white flex flex-col md:flex-row">
      {/* MOBILE HEADER */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b-[3px] border-black dark:bg-[#252322] dark:border-white h-16 px-4 flex items-center justify-between">
        <span className="font-black text-xl lowercase text-black dark:text-white">
          trip<span className="text-primary">.</span>mate <span className="text-[8px] bg-primary text-white px-1.5 py-0.5 rounded-full uppercase ml-1">Admin</span>
        </span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-[#FFD043] border-2 border-black text-black cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
            aria-label={sidebarOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* BACKDROP */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r-[3px] border-black 
        dark:bg-[#252322] dark:border-white p-6 flex flex-col gap-5 
        transition-transform duration-300 md:static md:translate-x-0 shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between">
          <span className="font-black text-lg lowercase text-black dark:text-white">
            trip<span className="text-primary">.</span>mate
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[8px] bg-primary text-white px-1.5 py-0.5 rounded-full font-black uppercase">Admin</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg border border-black bg-secondary text-black cursor-pointer"
              aria-label="Đóng menu điều hướng"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Admin badge */}
        <div className="p-3 rounded-2xl bg-[#FFD043] border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-black text-black uppercase">Admin Panel</h4>
            <p className="text-[9px] font-bold text-black/70">Quản trị viên hệ thống</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase border-2 transition-all ${
                  active
                    ? 'bg-[#FFD043] text-black border-black shadow-[3px_3px_0px_0px_#000000] translate-y-[-1px]'
                    : 'text-black/70 border-transparent hover:bg-[#FFD043]/30 dark:text-white/80 hover:border-black dark:hover:border-white hover:shadow-[2px_2px_0px_0px_#000000] dark:hover:shadow-[2px_2px_0px_0px_#ffffff]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-primary" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex flex-col gap-3">
          <div className="hidden md:flex items-center justify-between bg-[#FEFADC] dark:bg-[#1C1A19] border border-black dark:border-white rounded-xl px-3 py-2">
            <span className="text-[9px] font-black uppercase text-black dark:text-white">Theme</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-[#1C1A19] border-2 border-black dark:border-white hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all text-xs font-black uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-y-[-1px] cursor-pointer text-black dark:text-white"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
