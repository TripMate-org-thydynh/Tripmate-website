'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Activity, BookOpen, CalendarDays, CheckSquare, ChevronLeft, ChevronRight,
  Compass, CreditCard, DollarSign, LayoutDashboard, LogOut, Menu, Search,
  Settings, Smartphone, Sparkles, Target, TrendingUp, Users, X,
} from 'lucide-react';
import { logoutAdmin } from '@/app/actions';
import ThemeToggle from '@/components/ThemeToggle';
import { TripMateMark } from '@/components/TripMateMark';
import { AdminCommandPalette } from '@/components/admin/AdminCommandPalette';
import { AdminHealthPopover } from '@/components/admin/AdminHealthPopover';
import { AdminNotificationDropdown } from '@/components/admin/AdminNotificationDropdown';

const groups = [
  { name: 'Tổng quan', links: [
    { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { title: 'Tăng trưởng', href: '/admin/growth', icon: TrendingUp },
    { title: 'Doanh thu', href: '/admin/revenue', icon: DollarSign },
    { title: 'Phân tích AI', href: '/admin/ai', icon: Sparkles },
  ] },
  { name: 'Vận hành', links: [
    { title: 'Giám sát hệ thống', href: '/admin/observability', icon: Activity },
    { title: 'SLO & ngân sách lỗi', href: '/admin/observability/slo', icon: Target },
    { title: 'Phiên bản & bảo trì', href: '/admin/app-policy', icon: Smartphone },
  ] },
  { name: 'Thành viên & kinh doanh', links: [
    { title: 'Người dùng', href: '/admin/users', icon: Users },
    { title: 'Gói đăng ký', href: '/admin/subscriptions', icon: CreditCard },
  ] },
  { name: 'Chuyến đi & dữ liệu', links: [
    { title: 'Chuyến đi', href: '/admin/trips', icon: Compass },
    { title: 'Đặt chỗ', href: '/admin/reservations', icon: CalendarDays },
    { title: 'Nhật ký', href: '/admin/journal', icon: BookOpen },
    { title: 'Đồ đạc', href: '/admin/packing', icon: CheckSquare },
  ] },
  { name: 'Hệ thống', links: [
    { title: 'Cấu hình', href: '/admin/configs', icon: Settings },
  ] },
];

const toolbarButton = 'admin-toolbar-control text-sm';

function Brand({ collapsed = false, onClick }: { collapsed?: boolean; onClick?: () => void }) {
  return (
    <Link href="/admin" aria-label="TripMate Dashboard" onClick={onClick} className="flex w-fit items-center gap-3">
      <TripMateMark size={32} />
      {!collapsed && <span className="flex flex-col leading-tight"><span className="text-[15px] font-bold tracking-tight">TripMate</span><span className="text-[11px] font-medium text-admin-text-muted">Quản trị hệ thống</span></span>}
    </Link>
  );
}

function Navigation({ pathname, collapsed = false, onNavigate }: { pathname: string; collapsed?: boolean; onNavigate?: () => void }) {
  return (
    <nav aria-label="Điều hướng quản trị" className="flex-1 space-y-5 overflow-y-auto px-3 pb-5 pt-3">
      {groups.map((group) => (
        <section key={group.name} aria-label={group.name} className="space-y-0.5">
          {!collapsed && <h2 className="px-3 pb-1 text-[11px] font-semibold text-admin-text-muted">{group.name}</h2>}
          {group.links.map(({ title, href, icon: Icon }) => (
            <Link key={href} href={href} onClick={onNavigate}
              aria-current={pathname === href ? 'page' : undefined} aria-label={collapsed ? title : undefined} title={collapsed ? title : undefined}
              className={'admin-nav-link flex min-h-9 items-center gap-3 text-[13px] font-medium text-admin-text-secondary transition-colors hover:bg-admin-surface-hover aria-[current=page]:bg-[var(--admin-accent-bg)] aria-[current=page]:text-[var(--admin-accent-ink)] aria-[current=page]:font-semibold' + (collapsed ? ' justify-center px-1' : ' px-3')}>
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {!collapsed && <span className="truncate">{title}</span>}
            </Link>
          ))}
        </section>
      ))}
    </nav>
  );
}

export function AdminShell({ children, adminName }: { children: ReactNode; adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const drawer = useRef<HTMLDialogElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const closeDrawer = useCallback(() => drawer.current?.close(), []);
  const closeCommand = useCallback(() => setCommandOpen(false), []);

  useEffect(() => {
    setCollapsed(localStorage.getItem('admin_sidebar_collapsed') === 'true');
    const keyboard = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        closeDrawer();
        setCommandOpen((open) => !open);
      }
    };
    const desktop = matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => { if (desktop.matches) closeDrawer(); };
    window.addEventListener('keydown', keyboard);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      window.removeEventListener('keydown', keyboard);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [closeDrawer]);

  async function signOut() {
    await logoutAdmin();
    closeDrawer();
    router.replace('/admin/login');
  }

  function toggleSidebar() {
    setCollapsed(!collapsed);
    localStorage.setItem('admin_sidebar_collapsed', String(!collapsed));
  }

  const group = groups.find(({ links }) => links.some(({ href }) => href === pathname));
  const title = group?.links.find(({ href }) => href === pathname)?.title ?? 'Quản trị';
  const initials = adminName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  return (
    <div className="tripmate-admin min-h-dvh bg-admin-bg text-admin-text-primary md:flex">
      <a href="#admin-main" className="sr-only z-60 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:bg-admin-surface focus:px-4 focus:py-2">Đến nội dung chính</a>

      <aside className={'sticky top-0 hidden h-dvh shrink-0 flex-col bg-admin-sidebar md:flex ' + (collapsed ? 'w-16' : 'w-60')}>
        <div className={'flex h-18 shrink-0 items-center ' + (collapsed ? 'justify-center' : 'px-6')}>
          <Brand collapsed={collapsed} />
        </div>
        <Navigation pathname={pathname} collapsed={collapsed} />
        <div className="px-3 py-3">
          <button type="button" onClick={toggleSidebar} aria-label={collapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu'} aria-expanded={!collapsed} className={toolbarButton + ' w-full ' + (collapsed ? '' : 'justify-start')}>
            {collapsed ? <ChevronRight className="size-4" /> : <><ChevronLeft className="size-4" />Thu gọn</>}
          </button>
        </div>
      </aside>

      <dialog ref={drawer} aria-label="Menu quản trị" className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(18rem,90vw)] max-w-none bg-admin-sidebar text-admin-text-primary backdrop:bg-slate-950/60" onClick={(event) => {
        if (event.target === event.currentTarget) closeDrawer();
      }}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between px-4">
            <Brand onClick={closeDrawer} />
            <button type="button" onClick={closeDrawer} aria-label="Đóng menu" className={toolbarButton}><X className="size-4" /></button>
          </div>
          <Navigation pathname={pathname} onNavigate={closeDrawer} />
          <div className="p-3">
            <button type="button" onClick={signOut} className={toolbarButton + ' w-full justify-start'}><LogOut className="size-4" />Đăng xuất</button>
          </div>
        </div>
      </dialog>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 bg-admin-surface px-3 sm:px-6 xl:px-9">
          <div className="flex min-w-0 items-center gap-2 md:hidden">
            <button type="button" aria-label="Mở menu" aria-haspopup="dialog" onClick={() => drawer.current?.showModal()} className={toolbarButton}><Menu className="size-4" /></button>
            <Brand collapsed />
            <span className="truncate text-sm font-semibold">{title}</span>
          </div>
          <nav aria-label="Đường dẫn" className="hidden min-w-0 md:block">
            <ol className="flex items-center gap-2 text-sm">
              <li><Link href="/admin" className="text-admin-text-secondary hover:underline">Quản trị</Link></li>
              {group && <li className="hidden items-center gap-2 text-admin-text-secondary xl:flex"><ChevronRight className="size-3.5" aria-hidden="true" />{group.name}</li>}
              <li aria-current="page" className="flex min-w-0 items-center gap-2 font-semibold"><ChevronRight className="size-3.5 shrink-0" aria-hidden="true" /><span className="truncate">{title}</span></li>
            </ol>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={() => setCommandOpen(true)} aria-label="Tìm kiếm nhanh" aria-haspopup="dialog" className={toolbarButton + ' bg-admin-bg lg:min-w-38 lg:justify-start'}>
              <Search className="size-4" aria-hidden="true" /><span className="hidden lg:inline">Tìm kiếm</span><kbd className="ml-auto hidden whitespace-nowrap bg-admin-surface px-1.5 py-0.5 text-[11px] text-admin-text-muted xl:inline">Ctrl K</kbd>
            </button>
            <div className="hidden sm:block"><AdminHealthPopover /></div>
            <div className="hidden sm:block"><AdminNotificationDropdown /></div>
            <ThemeToggle />
            <details className="relative hidden md:block">
              <summary aria-label="Tài khoản quản trị viên" className="grid size-9 cursor-pointer list-none place-items-center bg-[var(--admin-accent-bg)] text-xs font-bold text-[var(--admin-accent-ink)]">{initials || 'TM'}</summary>
              <div className="absolute right-0 mt-2 w-48 space-y-2 bg-admin-surface p-3 shadow-lg">
                <p className="truncate text-sm font-semibold">{adminName}</p>
                <Link href="/admin/configs" className="block text-sm hover:underline">Cấu hình</Link>
                <button type="button" onClick={signOut} className={toolbarButton + ' w-full justify-start'}><LogOut className="size-4" />Đăng xuất</button>
              </div>
            </details>
          </div>
        </header>
        <main id="admin-main" tabIndex={-1} className="mx-auto w-full max-w-[90rem] px-4 pb-12 pt-6 sm:px-6 sm:pt-8 xl:px-9 xl:pt-9">
          {children}
        </main>
      </div>
      <AdminCommandPalette isOpen={commandOpen} onClose={closeCommand} />
    </div>
  );
}
