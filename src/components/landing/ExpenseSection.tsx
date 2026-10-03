'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useGsapEffect, gsap, ScrollTrigger } from '@/hooks/useGsap';
import { animateCount } from '@/animations/counters';
import { 
  Receipt, 
  QrCode, 
  CheckCircle2, 
  Zap,
  X,
  TrendingDown,
  CreditCard
} from 'lucide-react';

export default function ExpenseSection() {
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

    gsap.from('.expense-card-anim', {
      scrollTrigger: {
        trigger: target,
        start: 'top 75%',
      },
      y: 35,
      opacity: 0,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power2.out',
    });
  }, []);

  return (
    <section
      id="expenses"
      ref={containerRef}
      className="py-20 md:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 mb-3.5">
            <Receipt className="w-3.5 h-3.5 text-[#F95738]" />
            <span>02. CHIA TIỀN TỰ ĐỘNG & TỐI ƯU HÓA GIAO DỊCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4">
            Chia tiền sòng phẳng. Giữ trọn tình bạn sau chuyến đi.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
            Không ai phải ngồi cộng sổ tay lúc nửa đêm. Nhập hóa đơn ăn uống, thuê xe, phòng nghỉ — TripMate tự tính số tiền từng người, tối ưu số lượt chuyển và xuất mã VietQR thanh toán tức thì.
          </p>
        </div>

        {/* Live Bill Split Flow Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Fintech-Grade Bill Split Simulator */}
          <div className="lg:col-span-7 expense-card-anim flex flex-col gap-6">
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30 p-6 sm:p-8 shadow-sm">
              {/* Header Bill Info with Animated Total */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-lg shadow-sm">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                      Tổng chi phí Chuyến đi Đà Lạt
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Đã gộp: Homestay + Thuê xe + Lẩu gà lá é + Cà phê
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block">
                    Tổng chi tiêu nhóm
                  </span>
                  <span
                    ref={totalAmountRef}
                    className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white font-mono tracking-tight"
                  >
                    ₫6.400.000
                  </span>
                </div>
              </div>

              {/* Split Mode Selector (Pill style) */}
              <div className="my-5 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex p-1 rounded-full bg-zinc-200/60 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80">
                  <button
                    type="button"
                    onClick={() => setActiveBillTab('equal')}
                    className={`py-1.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      activeBillTab === 'equal'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    Chia đều 4 bạn
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveBillTab('custom')}
                    className={`py-1.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      activeBillTab === 'custom'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    Chia theo món cá nhân
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                  <span>Mỗi người:</span>
                  <span
                    ref={perPersonAmountRef}
                    className="font-mono font-bold text-sm text-[#F95738]"
                  >
                    ₫1.600.000
                  </span>
                </div>
              </div>

              {/* Debt Optimization Visualizer */}
              <div className="mb-6 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F95738]">
                    <Zap className="w-3.5 h-3.5" />
                    Thuật toán tinh giản giao dịch nợ (Debt Minimization)
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Giảm 12 lượt lẻ → còn 3 lượt
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/60 dark:bg-zinc-800/40 text-xs font-medium">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center justify-center text-[10px] font-bold">
                        ML
                      </span>
                      <span className="text-zinc-800 dark:text-zinc-200">Mai Linh chuyển cho Hoàng Nam</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">₫1.600.000</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                        Đã chuyển ✓
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/60 dark:bg-zinc-800/40 text-xs font-medium">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center justify-center text-[10px] font-bold">
                        TT
                      </span>
                      <span className="text-zinc-800 dark:text-zinc-200">Thanh Trúc chuyển cho Hoàng Nam</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {activeBillTab === 'equal' ? '₫1.600.000' : '₫1.420.000'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowQrModal(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-medium hover:opacity-90 transition-all cursor-pointer shadow-xs"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>Quét VietQR</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/60 dark:bg-zinc-800/40 text-xs font-medium">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center justify-center text-[10px] font-bold">
                        AT
                      </span>
                      <span className="text-zinc-800 dark:text-zinc-200">Anh Tuấn chuyển cho Hoàng Nam</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {activeBillTab === 'equal' ? '₫1.600.000' : '₫1.780.000'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[11px] font-medium">
                        Chờ thanh toán
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Three Value Props */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Tiền về thẳng ngân hàng</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Tự điền nội dung & số tiền</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Không mất phí trung gian</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Aesthetic Travel Ledger & Receipt Visual (No Phone Mockup) */}
          <div className="lg:col-span-5 expense-card-anim flex flex-col items-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-2xl bg-zinc-950">
              <Image
                src="/destinations/travel_ledger.jpg"
                alt="Sổ tay hành trình và hóa đơn du lịch nhóm"
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

              {/* Real Travel Receipt Overlay Card */}
              <div className="absolute bottom-5 inset-x-5 p-5 rounded-3xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#F95738]" />
                    <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                      Hóa đơn thanh toán tức thì
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    VietQR NAPAS
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 mb-4">
                  <div className="flex justify-between">
                    <span>Homestay Rừng Thông (2 đêm)</span>
                    <span className="font-mono font-medium text-zinc-900 dark:text-white">₫3.200.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuê 3 xe máy + Xăng</span>
                    <span className="font-mono font-medium text-zinc-900 dark:text-white">₫1.400.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lẩu gà lá é & Ăn uống</span>
                    <span className="font-mono font-medium text-zinc-900 dark:text-white">₫1.800.000</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">Đã quyết toán sòng phẳng:</span>
                  <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">100% HOÀN TẤT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sleek VietQR Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 mx-auto rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center mb-3">
              <QrCode className="w-5 h-5 text-[#F95738]" />
            </div>

            <h4 className="text-lg font-semibold text-zinc-950 dark:text-white mb-1">Mã VietQR Quyết Toán</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
              Mở app ngân hàng bất kỳ để quét mã chuyển tiền cho Hoàng Nam
            </p>

            <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 mb-5">
              <div className="w-44 h-44 mx-auto bg-white p-2.5 rounded-xl border border-zinc-200 shadow-xs flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-zinc-950">
                  <rect x="5" y="5" width="28" height="28" rx="3" />
                  <rect x="10" y="10" width="18" height="18" fill="white" rx="2" />
                  <rect x="14" y="14" width="10" height="10" />
                  <rect x="67" y="5" width="28" height="28" rx="3" />
                  <rect x="72" y="10" width="18" height="18" fill="white" rx="2" />
                  <rect x="76" y="14" width="10" height="10" />
                  <rect x="5" y="67" width="28" height="28" rx="3" />
                  <rect x="10" y="72" width="18" height="18" fill="white" rx="2" />
                  <rect x="14" y="76" width="10" height="10" />
                  <circle cx="45" cy="20" r="3" />
                  <circle cx="55" cy="30" r="3" />
                  <circle cx="40" cy="50" r="4" />
                  <circle cx="60" cy="55" r="3" />
                  <circle cx="50" cy="70" r="4" />
                  <circle cx="75" cy="65" r="3" />
                  <circle cx="85" cy="80" r="4" />
                </svg>
              </div>
              <div className="mt-3 text-xs font-semibold text-zinc-900 dark:text-white">
                Số tiền: <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">₫1.600.000 VNĐ</span>
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Nội dung: <span className="font-mono text-zinc-700 dark:text-zinc-300">TM DALAT HOANG NAM</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
