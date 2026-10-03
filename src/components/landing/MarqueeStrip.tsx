'use client';

export default function MarqueeStrip() {
  const items = [
    'Chia tiền tức thì',
    'Lịch trình theo giờ',
    'Kho ảnh chất lượng gốc 4K',
    'Trợ lý du lịch AI',
    'Quét VietQR không ví trung gian',
  ];

  return (
    <div className="w-full overflow-hidden border-y border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30 py-3.5 select-none transition-colors duration-200">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {/* Loop twice for continuous seamless marquee */}
        {[...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 px-6 shrink-0">
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
              {item}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
