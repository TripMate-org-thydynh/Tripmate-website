'use client';

import Image from 'next/image';
import { useGsapEffect, gsap } from '@/hooks/useGsap';
import EnvironmentalEffects from '@/components/effects/EnvironmentalEffects';
import { 
  Sparkles, 
  QrCode, 
  Check 
} from 'lucide-react';
import GooglePlayButton from '@/components/GooglePlayButton';

interface FinalCtaSectionProps {
  onOpenDownload: () => void;
}

export default function FinalCtaSection({ onOpenDownload }: FinalCtaSectionProps) {
  const containerRef = useGsapEffect<HTMLElement>((target, _ctx, isReduced) => {
    if (isReduced) return;

    gsap.from('.cta-card-anim', {
      scrollTrigger: {
        trigger: target,
        start: 'top 80%',
      },
      scale: 0.96,
      y: 25,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-20 md:py-32 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cta-card-anim relative overflow-hidden rounded-[2.5rem] bg-zinc-950 text-white p-8 sm:p-14 lg:p-16 shadow-2xl shadow-zinc-900/20 border border-zinc-800">
          {/* Real Campfire Atmosphere Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/destinations/camping_night.jpg"
              alt="Đêm cắm trại ấm cúng cùng bạn bè"
              fill
              sizes="100vw"
              className="object-cover opacity-35 filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50" />
          </div>

          {/* Bioluminescent Fireflies Ambient Layer */}
          <EnvironmentalEffects effect="fireflies" intensity="subtle" className="z-10" />

          <div className="relative z-20 flex flex-col items-center text-center max-w-2xl mx-auto">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-700 bg-black/60 backdrop-blur-md text-zinc-200 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#F95738]" />
              <span>BẮT ĐẦU CHUYẾN ĐI HOÀN TOÀN MIỄN PHÍ</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] mb-4 text-white">
              Sẵn sàng cho chuyến du lịch cùng hội bạn thân?
            </h2>

            {/* Supporting copy */}
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed mb-8 font-normal">
              Tải TripMate ngay hôm nay. Lên lịch trình, tính tiền sòng phẳng và lưu lại từng kỷ niệm vô giá của tuổi thanh xuân.
            </p>

            {/* Dual CTAs: Download & QR modal */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenDownload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold bg-white text-zinc-950 hover:bg-zinc-100 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Quét mã tải app ngay</span>
              </button>

              <GooglePlayButton size="lg" className="w-full sm:w-auto justify-center" />
            </div>

            {/* Micro perks */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-medium text-zinc-300 pt-6 border-t border-zinc-800/80 w-full">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" /> Miễn phí 100%
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" /> Không quảng cáo
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" /> Hoạt động ngoại tuyến
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" /> Bảo mật ngân hàng VietQR
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
