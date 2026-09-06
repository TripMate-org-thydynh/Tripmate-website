'use client';

import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface ThemeToggleProps {
  className?: string;
  variant?: 'admin' | 'consumer' | 'auto';
}

export default function ThemeToggle({ className = '', variant = 'auto' }: ThemeToggleProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  const isAdmin = variant === 'admin' || (variant === 'auto' && pathname?.startsWith('/admin'));

  useEffect(() => {
    setMounted(true);
    const updateTheme = () => {
      setDark(document.documentElement.classList.contains('dark'));
    };
    updateTheme();

    window.addEventListener('theme-change', updateTheme);
    window.addEventListener('storage', updateTheme);
    return () => {
      window.removeEventListener('theme-change', updateTheme);
      window.removeEventListener('storage', updateTheme);
    };
  }, []);

  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    if (isCurrentlyDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDark(true);
    }
    window.dispatchEvent(new Event('theme-change'));
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={
          isAdmin
            ? `w-8 h-8 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#111827] opacity-0 pointer-events-none ${className}`
            : `p-2 rounded-xl bg-secondary text-foreground border border-border opacity-0 pointer-events-none ${className}`
        }
        aria-label="Đổi giao diện"
        suppressHydrationWarning
      >
        <span className="w-4 h-4 block" />
      </button>
    );
  }

  if (isAdmin) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-8 h-8 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#111827] text-[#475569] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172238] transition-all duration-150 flex items-center justify-center cursor-pointer shadow-2xs select-none ${className}`}
        aria-label={dark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
        title={dark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
        suppressHydrationWarning
      >
        {dark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-slate-600 transition-transform duration-200 rotate-0 hover:-rotate-12" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 border border-border flex items-center justify-center cursor-pointer ${className}`}
      aria-label="Đổi giao diện"
      suppressHydrationWarning
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
