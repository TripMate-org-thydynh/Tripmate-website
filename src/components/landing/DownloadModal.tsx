'use client';

import { useEffect } from 'react';
import { X, QrCode, Smartphone, Sparkles, Check } from 'lucide-react';
import GooglePlayButton from '@/components/GooglePlayButton';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6 sm:p-8 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Đóng cửa sổ tải app"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80">
            Trải nghiệm ngay
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#F95738]" />
            Miễn phí 100%
          </span>
        </div>

        <h3 id="download-modal-title" className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Cài đặt TripMate lên điện thoại
        </h3>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6 font-normal leading-relaxed">
          Quét mã QR bằng camera điện thoại hoặc tải ứng dụng trực tiếp từ Google Play để bắt đầu chuyến đi cùng hội bạn.
        </p>

        {/* QR Code Card */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 mb-6">
          <div className="relative w-36 h-36 shrink-0 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white p-2.5 flex items-center justify-center shadow-xs">
            {/* Embedded Stylized QR */}
            <svg viewBox="0 0 120 120" className="w-full h-full text-zinc-950 fill-current">
              <rect x="10" y="10" width="30" height="30" rx="4" />
              <rect x="16" y="16" width="18" height="18" fill="white" rx="2" />
              <rect x="21" y="21" width="8" height="8" />
              <rect x="80" y="10" width="30" height="30" rx="4" />
              <rect x="86" y="16" width="18" height="18" fill="white" rx="2" />
              <rect x="91" y="21" width="8" height="8" />
              <rect x="10" y="80" width="30" height="30" rx="4" />
              <rect x="16" y="86" width="18" height="18" fill="white" rx="2" />
              <rect x="21" y="91" width="8" height="8" />
              {/* Data dots */}
              <circle cx="55" cy="20" r="4" />
              <circle cx="65" cy="25" r="4" />
              <circle cx="50" cy="40" r="4" />
              <circle cx="60" cy="50" r="4" />
              <circle cx="70" cy="45" r="4" />
              <circle cx="50" cy="65" r="4" />
              <circle cx="60" cy="75" r="4" />
              <circle cx="75" cy="70" r="4" />
              <circle cx="90" cy="60" r="4" />
              <circle cx="85" cy="85" r="4" />
              <circle cx="100" cy="95" r="4" />
              <circle cx="25" cy="55" r="4" />
              <circle cx="35" cy="65" r="4" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="px-1.5 py-0.5 rounded-md bg-zinc-950 text-white text-[10px] font-bold">
                TM
              </span>
            </div>
          </div>

          <div className="flex flex-col text-center sm:text-left">
            <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-[#F95738] mb-1">
              <QrCode className="w-4 h-4" />
              <span>Quét mã tải nhanh</span>
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-white mb-1">Mở camera điện thoại</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              Tương thích mọi thiết bị iOS và Android. Tự động chuyển hướng đến bản cài đặt phù hợp nhất.
            </p>
          </div>
        </div>

        {/* Direct Download Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <GooglePlayButton size="sm" className="flex-1 justify-center" />
          
          <div className="flex-1 flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 shadow-xs">
            <Smartphone className="w-4 h-4 text-zinc-500 shrink-0" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">
                App Store iOS
              </span>
              <span className="text-xs font-semibold">Đang chuẩn bị</span>
            </div>
          </div>
        </div>

        {/* Micro perks */}
        <div className="mt-6 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-normal">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" /> Không quảng cáo
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" /> Tự động sao lưu
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" /> Không cần tạo thẻ
          </span>
        </div>
      </div>
    </div>
  );
}
