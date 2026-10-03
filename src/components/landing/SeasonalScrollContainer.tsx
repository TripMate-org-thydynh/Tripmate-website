'use client';

import { useState, useEffect } from 'react';
import SeasonSpringChapter from './SeasonSpringChapter';
import SeasonSummerChapter from './SeasonSummerChapter';
import SeasonAutumnChapter from './SeasonAutumnChapter';
import SeasonWinterChapter from './SeasonWinterChapter';
import { Flower2, Sun, Wind, Snowflake } from 'lucide-react';

interface SeasonalScrollContainerProps {
  onOpenDownload: () => void;
}

const seasons = [
  {
    id: 'season-spring',
    label: 'Xuân',
    fullName: 'Mùa Xuân',
    icon: Flower2,
    color: 'text-rose-500',
    activeBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
  },
  {
    id: 'season-summer',
    label: 'Hạ',
    fullName: 'Mùa Hạ',
    icon: Sun,
    color: 'text-amber-500',
    activeBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  {
    id: 'season-autumn',
    label: 'Thu',
    fullName: 'Mùa Thu',
    icon: Wind,
    color: 'text-orange-500',
    activeBg: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
  },
  {
    id: 'season-winter',
    label: 'Đông',
    fullName: 'Mùa Đông',
    icon: Snowflake,
    color: 'text-sky-500',
    activeBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
  },
];

export default function SeasonalScrollContainer({ onOpenDownload }: SeasonalScrollContainerProps) {
  const [activeSeasonId, setActiveSeasonId] = useState<string>('season-spring');
  const [isSeasonalAreaVisible, setIsSeasonalAreaVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      const springEl = document.getElementById('season-spring');
      const summerEl = document.getElementById('season-summer');
      const autumnEl = document.getElementById('season-autumn');
      const winterEl = document.getElementById('season-winter');

      if (!springEl || !winterEl) return;

      const springTop = springEl.offsetTop;
      const winterBottom = winterEl.offsetTop + winterEl.offsetHeight;

      // Check if user is inside the 4-seasons narrative
      const inRange = window.scrollY >= springTop - 300 && window.scrollY <= winterBottom;
      setIsSeasonalAreaVisible(inRange);

      if (winterEl && scrollPos >= winterEl.offsetTop) {
        setActiveSeasonId('season-winter');
      } else if (autumnEl && scrollPos >= autumnEl.offsetTop) {
        setActiveSeasonId('season-autumn');
      } else if (summerEl && scrollPos >= summerEl.offsetTop) {
        setActiveSeasonId('season-summer');
      } else if (springEl && scrollPos >= springEl.offsetTop) {
        setActiveSeasonId('season-spring');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSeason = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full">
      {/* Floating Seasonal Compass HUD (Tracks scroll position through the 4 seasons) */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 pointer-events-none ${
          isSeasonalAreaVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 shadow-xl shadow-zinc-900/10 dark:shadow-black/60">
          <div className="hidden sm:flex items-center gap-1.5 pl-3 pr-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 border-r border-zinc-200 dark:border-zinc-800 mr-0.5">
            <span>4 MÙA</span>
          </div>

          {seasons.map((s) => {
            const isActive = activeSeasonId === s.id;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToSeason(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? `${s.activeBg} shadow-xs scale-105 border`
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                <span className="hidden xs:inline sm:inline">{s.label}</span>
                <span className="inline xs:hidden sm:hidden">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chapter 1: Mùa Xuân (Spring) */}
      <SeasonSpringChapter />

      {/* Chapter 2: Mùa Hạ (Summer) */}
      <SeasonSummerChapter />

      {/* Chapter 3: Mùa Thu (Autumn) */}
      <SeasonAutumnChapter />

      {/* Chapter 4: Mùa Đông (Winter) */}
      <SeasonWinterChapter onOpenDownload={onOpenDownload} />
    </div>
  );
}
