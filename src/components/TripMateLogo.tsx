'use client';

import Image from 'next/image';

interface TripMateLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  withText?: boolean;
  variant?: 'symbol' | 'badge';
  className?: string;
  textClassName?: string;
  showDot?: boolean;
}

const sizeMap = {
  xs: { icon: 20, text: 'text-sm' },
  sm: { icon: 28, text: 'text-lg' },
  md: { icon: 36, text: 'text-xl' },
  lg: { icon: 48, text: 'text-2xl' },
  xl: { icon: 64, text: 'text-3xl' },
};

export default function TripMateLogo({
  size = 'md',
  withText = false,
  variant = 'symbol',
  className = '',
  textClassName = '',
  showDot = true,
}: TripMateLogoProps) {
  const iconSize = typeof size === 'number' ? size : sizeMap[size]?.icon ?? 36;
  const textSizeClass = typeof size === 'string' ? sizeMap[size]?.text : 'text-xl';

  if (variant === 'badge') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {/* App Icon Badge with Dark/Light adaptation */}
        <div
          className="relative overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-center bg-[#FFFDF5] dark:bg-[#141210] transition-transform group-hover:scale-105"
          style={{ width: iconSize, height: iconSize }}
        >
          {/* Light mode symbol */}
          <div className="relative w-full h-full p-1 block dark:hidden">
            <Image
              src="/symbol_light.png"
              alt="TripMate Logo"
              fill
              sizes={`${iconSize}px`}
              className="object-contain"
              priority
            />
          </div>
          {/* Dark mode symbol */}
          <div className="relative w-full h-full p-1 hidden dark:block">
            <Image
              src="/symbol_dark.png"
              alt="TripMate Logo Dark"
              fill
              sizes={`${iconSize}px`}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {withText && (
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight text-zinc-900 dark:text-white ${textSizeClass} ${textClassName}`}>
              TripMate
            </span>
            {showDot && <span className="w-1.5 h-1.5 rounded-full bg-[#FFD84D]" />}
          </div>
        )}
      </div>
    );
  }

  // Pure symbol variant
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: iconSize, height: iconSize }}
      >
        {/* Light mode symbol */}
        <div className="relative w-full h-full block dark:hidden">
          <Image
            src="/symbol_light.png"
            alt="TripMate Logo"
            fill
            sizes={`${iconSize}px`}
            className="object-contain"
            priority
          />
        </div>
        {/* Dark mode symbol */}
        <div className="relative w-full h-full hidden dark:block">
          <Image
            src="/symbol_dark.png"
            alt="TripMate Logo Dark"
            fill
            sizes={`${iconSize}px`}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {withText && (
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-zinc-900 dark:text-white ${textSizeClass} ${textClassName}`}>
            TripMate
          </span>
          {showDot && <span className="w-1.5 h-1.5 rounded-full bg-[#FFD84D]" />}
        </div>
      )}
    </div>
  );
}
