'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useGsapEffect, gsap, ScrollTrigger } from '@/hooks/useGsap';
import { animateCount } from '@/animations/counters';
import EnvironmentalEffects from '@/components/effects/EnvironmentalEffects';
import { 
  Sun, 
  Receipt, 
  QrCode, 
  CheckCircle2, 
  Zap, 
  X, 
  TrendingDown
} from 'lucide-react';

export default function SeasonSummerChapter() {
  const [activeBillTab, setActiveBillTab] = useState<'equal' | 'custom'>('equal');
  const [showQrModal, setShowQrModal] = useState(false);
  const totalAmountRef = useRef<HTMLSpanElement | null>(null);
  const perPersonAmountRef = useRef<HTMLSpanElement | null>(null);

  const containerRef = useGsapEffect<HTMLElement>((target, _ctx, isReduced) => {
    if (isReduced) {
      if (totalAmountRef.current) totalAmountRef.current.innerText = '₫6.400.000';
      if (perPersonAmountRef.current) perPersonAmountRef.current.innerText = '₫1.600.000';
      return;
    }

    // ScrollTrigger to animate numbers counting up
    ScrollTrigger.create({
      trigger: target,
      start: 'top 75%',
      onEnter: () => {
        animateCount(totalAmountRef.current, 6400000, {
          duration: 2.0,
          prefix: '₫',
          formatVND: true,
        });
        animateCount(perPersonAmountRef.current, 1600000, {
          duration: 1.8,
          prefix: '₫',
          formatVND: true,
        });
      },
    });

    gsap.from('.summer-reveal', {
      scrollTrigger: {
        trigger: target,
        start: 'top 75%',
      },
      y: 35,
      opacity: 0,
      stagger: 0.12,
      duration: 0.75,
      ease: 'power2.out',
    });
  }, []);

  return (
    <section
      id="season-summer"
      ref={containerRef}
      className="relative py-20 md:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 overflow-hidden"
    >
      {/* Summer Golden Sunrays Canvas Layer */}
      <EnvironmentalEffects effect="summer" intensity="medium" className="z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seasonal Chapter Master Banner */}
        <div className="summer-reveal relative rounded-[2.5rem] overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 text-white p-8 sm:p-12 mb-16 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <Image
              src="/destinations/season_summer.jpg"
              alt="Mùa hạ biển ngọc Phú Quốc nắng vàng rực"
              fill
              priority
              sizes="100vw"
              className="object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-400/30 text-xs font-semibold mb-4">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>CHẶNG 02: MÙA HẠ • BIỂN XANH NẮNG RỰC & CHIA TIỀN SÒNG PHẲNG</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-[1.15]">
              Hạ Vàng Nắng Rực. Tiền Nong Sòng Phẳng, Chơi Hết Mình.
            </h2>
            <p className="text-base sm:text-lg text-zinc-200 font-normal leading-relaxed mb-6">
              Mùa của những chuyến cano rẽ sóng lặn ngắm san hô, tiệc nướng hải sản đêm bên bờ biển và cocktail hoàng hôn Bãi Sao. Đi chơi càng đông vui thì tiền nong càng phải rõ ràng — TripMate tính toán và chia bill tự động từng ngàn lẻ, không để ai phải ngại ngùng vì chuyện tiền bạc.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white">
                📍 Phú Quốc - Nha Trang - Vịnh Hạ Long
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-amber-300 font-mono">
                ☀️ 29°C · Biển ngọc nắng vàng
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-emerald-300">
                ✓ Quét VietQR thanh toán 1-chạm
              </span>
            </div>
          </div>
        </div>

        {/* Live Bill Split Flow Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Bill Split Simulator */}
          <div className="lg:col-span-7 summer-reveal flex flex-col gap-6">
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 p-6 sm:p-8 shadow-sm">
              {/* Header Bill Info with Animated Total */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-lg shadow-sm">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                      Tổng chi phí Tour Đảo Phú Quốc
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Đã gộp: Resort Bãi Dài + Tour cano 3 đảo + BBQ hải sản + Thuê xe máy
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Tổng hóa đơn</span>
                  <span
                    ref={totalAmountRef}
                    className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 dark:text-white tracking-tight"
                  >
                    ₫0
                  </span>
                </div>
              </div>

              {/* Bill Splitting Mode Selector */}
              <div className="py-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Cách thức chia tiền:
                  </span>
                  <div className="flex items-center gap-1.5 p-1 rounded-full bg-zinc-200/60 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80">
                    <button
                      type="button"
                      onClick={() => setActiveBillTab('equal')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        activeBillTab === 'equal'
                          ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      Chia đều (4 người)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveBillTab('custom')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        activeBillTab === 'custom'
                          ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      Chia theo món
                    </button>
                  </div>
                </div>

                {/* Per-person amount display banner */}
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-normal">
                      Mỗi người cần chuyển:
                    </span>
                    <span
                      ref={perPersonAmountRef}
                      className="text-xl sm:text-2xl font-bold font-mono text-[#F95738]"
                    >
                      ₫0
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Tạo mã VietQR</span>
                  </button>
                </div>
              </div>

              {/* Debt Minimization Flow Visualization */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-500" />
                    <h4 className="text-xs sm:text-sm font-semibold text-zinc-950 dark:text-white">
                      Thuật toán tối ưu hóa đường nợ (Debt Simplification)
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-medium">
                    Giảm từ 12 giao dịch → 3 giao dịch
                  </span>
                </div>

                {/* Step cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 block mb-1">GIAO DỊCH 1</span>
                      <p className="text-xs font-semibold text-zinc-950 dark:text-white">
                        Minh béo → Mai Linh
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#F95738] mt-2">
                      ₫1.600.000
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 block mb-1">GIAO DỊCH 2</span>
                      <p className="text-xs font-semibold text-zinc-950 dark:text-white">
                        Hoàng Nam → Mai Linh
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#F95738] mt-2">
                      ₫1.600.000
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 block mb-1">GIAO DỊCH 3</span>
                      <p className="text-xs font-semibold text-zinc-950 dark:text-white">
                        Thanh Trúc → Mai Linh
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#F95738] mt-2">
                      ₫1.600.000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Aesthetic Travel Ledger & Receipt Visual */}
          <div className="lg:col-span-5 summer-reveal flex flex-col gap-4">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 shadow-2xl">
              {/* Real Travel Ledger Background Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/destinations/travel_ledger.jpg"
                  alt="Sổ tay chi tiêu và kỷ niệm du lịch TripMate"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <span className="text-[10px] font-mono text-white/80 block">HOÁ ĐƠN ĐÃ ĐỐI SOÁT</span>
                    <h4 className="text-sm sm:text-base font-bold text-white">Resort Sunset Sanato Phú Quốc</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-white text-xs font-bold shadow-xs">
                    ✓ Đã thanh toán
                  </span>
                </div>
              </div>

              {/* Receipt Breakdown Card */}
              <div className="p-5 sm:p-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <span>Hạng mục</span>
                  <span>Chi phí</span>
                </div>
                
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
                    <span>1. Tour cano 3 đảo Hòn Móng Tay (4 vé)</span>
                    <span className="font-mono font-medium">₫2.400.000</span>
                  </div>
                  <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
                    <span>2. BBQ hải sản & Ghẹ Hàm Ninh</span>
                    <span className="font-mono font-medium">₫2.200.000</span>
                  </div>
                  <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
                    <span>3. Thuê 2 xe máy vi vu bãi Sao</span>
                    <span className="font-mono font-medium">₫600.000</span>
                  </div>
                  <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
                    <span>4. Cocktail ngắm hoàng hôn Sanato</span>
                    <span className="font-mono font-medium">₫1.200.000</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between font-semibold text-xs sm:text-sm text-zinc-950 dark:text-white">
                  <span>Mỗi thành viên (4 người)</span>
                  <span className="font-mono text-[#F95738]">₫1.600.000</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Quét mã VietQR chuyển khoản</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VietQR Quick Payment Modal */}
      {showQrModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#F95738] mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>VIETQR TỰ ĐỘNG ĐIỀN NỘI DUNG</span>
            </div>
            <h4 className="text-lg font-bold text-zinc-950 dark:text-white mb-4">
              Thanh toán tiền Tour Đảo
            </h4>

            {/* Mock VietQR Frame */}
            <div className="relative aspect-square w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 flex flex-col items-center justify-center p-6 mb-4">
              <QrCode className="w-36 h-36 text-zinc-900 dark:text-zinc-100" />
              <div className="text-center mt-2">
                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 block">
                  VietinBank • 103874928192
                </span>
                <span className="text-sm font-bold font-mono text-zinc-900 dark:text-white block mt-0.5">
                  ₫1.600.000
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-1">
                  ND: &quot;Minh beo chuyen tien tour dao Tripmate&quot;
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Không cần nhập lại số tài khoản hay nội dung chuyển tiền.</span>
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"
            >
              Đã hiểu & Đóng
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
