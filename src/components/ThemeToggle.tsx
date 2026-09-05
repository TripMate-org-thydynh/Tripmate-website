'use client';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDark(true);
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="p-2 rounded-xl bg-secondary text-foreground border border-border flex items-center justify-center opacity-0 pointer-events-none"
        aria-label="Đổi giao diện"
        suppressHydrationWarning
      >
        <span className="h-5 w-5 block" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 border border-border flex items-center justify-center cursor-pointer"
      aria-label="Đổi giao diện"
      suppressHydrationWarning
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
