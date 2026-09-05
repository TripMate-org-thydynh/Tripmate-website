import { Bell } from 'lucide-react';

/**
 * Nút tải app từ Google Play.
 *
 * URL đọc từ `NEXT_PUBLIC_PLAY_STORE_URL`. Khi app **chưa** được phát hành,
 * biến này để trống và nút tự chuyển sang trạng thái "sắp có" — cố tình
 * không dựng URL giả, vì link Play hỏng còn tệ hơn là nói thẳng chưa phát hành.
 */
export const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? '';

/** Logo Google Play chính thức (tam giác 4 màu), vẽ inline để không phụ thuộc asset. */
function PlayGlyph({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path fill="#00D4FF" d="M47 20 316 256 47 492c-9-7-15-19-15-34V54c0-15 6-27 15-34z" />
      <path fill="#00F076" d="M47 20c8-6 19-7 30-1l278 158-59 79L47 20z" />
      <path fill="#FFCE00" d="M355 177l72 41c22 13 22 45 0 58l-72 41-59-79 59-61z" />
      <path fill="#FF3A44" d="M355 317L77 475c-11 6-22 5-30-1l249-236 59 79z" />
    </svg>
  );
}

export default function GooglePlayButton({
  size = 'lg',
  className = '',
}: {
  size?: 'sm' | 'lg';
  className?: string;
}) {
  const pad = size === 'lg' ? 'px-6 py-3.5' : 'px-4 py-2.5';
  const base =
    `inline-flex items-center gap-3 rounded-2xl border-[3px] border-black ` +
    `shadow-[4px_4px_0px_0px_#000000] transition-all ${pad} ${className}`;

  if (!PLAY_STORE_URL) {
    return (
      <div
        className={`${base} bg-white text-black cursor-default select-none`}
        role="status"
      >
        <Bell className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
        <span className="flex flex-col items-start leading-tight text-left">
          <span className="text-[9px] font-bold uppercase tracking-wide opacity-70">
            Android
          </span>
          <span className="text-sm font-black uppercase">Sắp có trên Google Play</span>
        </span>
      </div>
    );
  }

  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-black text-white hover:translate-y-[-1px] active:translate-y-[1px]`}
    >
      <PlayGlyph className={size === 'lg' ? 'w-7 h-7 shrink-0' : 'w-5 h-5 shrink-0'} />
      <span className="flex flex-col items-start leading-tight text-left">
        <span className="text-[9px] font-bold uppercase tracking-wide opacity-70">
          Tải về trên
        </span>
        <span className="text-sm font-black uppercase">Google Play</span>
      </span>
    </a>
  );
}
