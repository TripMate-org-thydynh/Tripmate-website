'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import TripMateLogo from '@/components/TripMateLogo';
import { Menu, X, ArrowDownToLine } from 'lucide-react';

interface NavbarProps {
  onOpenDownload: () => void;
}

const navLinks = [
  { href: '#season-spring', label: '🌸 Mùa Xuân' },
  { href: '#season-summer', label: '☀️ Mùa Hạ' },
  { href: '#season-autumn', label: '🍂 Mùa Thu' },
  { href: '#season-winter', label: '❄️ Mùa Đông' },
  { href: '#faq', label: 'Hỏi đáp' },
];

export default function Navbar({ onOpenDownload }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 dark:bg-[#09090B]/85 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 py-2.5 shadow-xs'
          : 'bg-transparent border-b border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 select-none"
        >
          <TripMateLogo size="sm" withText variant="badge" />
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Right Action Bar */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={onOpenDownload}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Tải ứng dụng</span>
          </button>
        </div>

        {/* Mobile Hamburger & Theme Button */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-md px-4 py-5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg font-medium text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDownload();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full text-sm font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm cursor-pointer"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Tải ứng dụng miễn phí</span>
          </button>
        </div>
      )}
    </header>
  );
}
