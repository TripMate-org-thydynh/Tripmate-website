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
            ? `admin-toolbar-control opacity-0 pointer-events-none ${className}`
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
        className={`admin-toolbar-control ${className}`}
        aria-label={dark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
        title={dark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
        suppressHydrationWarning
      >
        {dark ? (
          <Sun className="size-4" aria-hidden="true" />
        ) : (
          <Moon className="size-4" aria-hidden="true" />
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
