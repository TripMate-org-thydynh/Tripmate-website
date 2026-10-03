'use client';

import Image from 'next/image';
import { useGsapEffect, gsap } from '@/hooks/useGsap';
import EnvironmentalEffects from '@/components/effects/EnvironmentalEffects';
import { 
  ArrowDownToLine, 
  Compass, 
  ChevronDown,
  Plane,
  Camera,
  QrCode,
  Calendar
} from 'lucide-react';

interface HeroSectionProps {
  onOpenDownload: () => void;
}

export default function HeroSection({ onOpenDownload }: HeroSectionProps) {
  const containerRef = useGsapEffect<HTMLElement>((_target, _ctx, isReduced) => {
    if (isReduced) {
      gsap.set('.hero-reveal', { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Cinematic sequence: reveal title and elements
    tl.fromTo(
      '.hero-badge',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6 }
    )
      .fromTo(
        '.hero-title-line',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
        '-=0.3'
      )
      .fromTo(
        '.hero-desc',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        '.hero-cta-group',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        '.hero-metrics',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      )
      .fromTo(
        '.hero-visual-frame',
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power2.out' },
        '-=0.7'
      )
      .fromTo(
        '.hero-float-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.6 },
        '-=0.4'
      );

    // Continuous floating animation
    gsap.to('.hero-float-1', {
      y: -10,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.hero-float-2', {
      y: 10,
      duration: 4.0,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.3,
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-zinc-100 dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200"
    >
      {/* Full-bleed Hero Photography (Cách A) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/destinations/travel_squad_hero.jpg"
          alt="Hội bạn thân chinh phục đỉnh núi ngắm bình minh cùng TripMate"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Directional gradient overlay: dark on text side for contrast, subtle on visual side to showcase the scenery */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/20 lg:bg-gradient-to-r lg:from-white/95 lg:via-white/70 lg:to-white/15 dark:from-black/85 dark:via-black/55 dark:to-black/20" />
      </div>

      {/* Cinematic Golden Hour Particles */}
      <EnvironmentalEffects effect="sun" intensity="subtle" className="z-10" />

      {/* Ambient lighting behind */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-[#F95738]/10 to-transparent blur-3xl pointer-events-none z-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Cinematic Story */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Eyebrow badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-300/80 dark:border-white/15 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-800 dark:text-zinc-200 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#F95738] animate-pulse" />
              <span>HÀNH TRÌNH DU LỊCH NHÓM DÀNH RIÊNG CHO GEN Z</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12] text-zinc-950 dark:text-white mb-6">
              <span className="hero-title-line block">Đi chơi cùng hội bạn.</span>
              <span className="hero-title-line block text-zinc-900 dark:text-zinc-100">
                Lên lịch chill,{' '}
                <span className="text-[#F95738]">
                  chia tiền sòng phẳng.
                </span>
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="hero-desc text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed max-w-xl mb-8">
              Tạm biệt 10 file Excel lộn xộn, những lần ngượng ngùng nhắc nợ và ảnh chụp chung trôi mất trong nhóm chat. TripMate gom trọn kế hoạch, chi phí và kỷ niệm của cả nhóm vào một hành trình đồng bộ duy nhất.
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta-group flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenDownload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold bg-[#F95738] text-white hover:bg-[#e04526] shadow-md shadow-[#F95738]/20 hover:shadow-lg hover:shadow-[#F95738]/30 transition-all duration-200 cursor-pointer"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>Tải app miễn phí</span>
              </button>

              <a
                href="#seasons"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm sm:text-base font-semibold border border-zinc-300 dark:border-white/20 text-zinc-800 dark:text-zinc-200 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
              >
                <Compass className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <span>Khám phá 4 mùa du lịch</span>
              </a>
            </div>

            {/* Core Product Highlights */}
            <div className="hero-metrics w-full pt-6 border-t border-zinc-200/80 dark:border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-xl">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#F95738]/10 text-[#F95738] flex items-center justify-center shrink-0 mt-0.5">
                  <QrCode className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-[13px] text-zinc-800 dark:text-zinc-200 font-medium leading-snug">
                  Chia tiền tự động, quét VietQR thẳng tới ngân hàng
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#F95738]/10 text-[#F95738] flex items-center justify-center shrink-0 mt-0.5">
                  <Camera className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-[13px] text-zinc-800 dark:text-zinc-200 font-medium leading-snug">
                  Ảnh lưu chất lượng gốc, không bị nén
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#F95738]/10 text-[#F95738] flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-[13px] text-zinc-800 dark:text-zinc-200 font-medium leading-snug">
                  Lịch trình chung cho cả nhóm, cập nhật tức thì
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Trip Interactive Canvas Floating Over Scenic Background Photo */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[340px] lg:min-h-[440px] mt-8 lg:mt-0">
            {/* Main Trip Status Glass Card */}
            <div className="hero-visual-frame relative w-full max-w-[380px] p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/80 dark:border-white/15 shadow-2xl z-10 text-zinc-900 dark:text-white">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F95738] animate-pulse" />
                  <span className="text-sm font-bold text-zinc-950 dark:text-white">Hành Trình Tây Bắc</span>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#F95738]/10 text-[#F95738] font-bold">
                  4N3Đ
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 font-normal mb-4">
                6 thành viên • Khám phá Sa Pa & Đèo Ô Quy Hồ
              </p>

              {/* Progress Bar / Trip Status indicator */}
              <div className="w-full bg-zinc-200/80 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#F95738] h-full rounded-full w-2/3" />
              </div>
            </div>

            {/* Floating Boarding Pass Card (Top Left) */}
            <div className="hero-float-card hero-float-1 absolute -top-5 -left-2 sm:-left-6 z-20 p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/85 backdrop-blur-md border border-zinc-200/80 dark:border-white/15 shadow-xl max-w-[210px]">
              <div className="flex items-center justify-between gap-2 border-b border-zinc-200/60 dark:border-zinc-800 pb-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Boarding Pass</span>
                <Plane className="w-3.5 h-3.5 text-[#F95738]" />
              </div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-bold text-xs text-zinc-950 dark:text-white">HAN → DLI</span>
                <span className="text-[11px] font-mono text-[#F95738] font-semibold">Bay 1h50m</span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                Chuyến bay nội địa • 6 Ghế liền kề
              </p>
            </div>

            {/* Floating Moments Card (Bottom Right) */}
            <div className="hero-float-card hero-float-2 absolute -bottom-5 -right-2 sm:-right-6 z-20 p-3.5 rounded-2xl bg-white/90 dark:bg-zinc-900/85 backdrop-blur-md border border-zinc-200/80 dark:border-white/15 shadow-xl max-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-[#F95738]/10 text-[#F95738] flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-zinc-950 dark:text-zinc-100">Khoảnh khắc mới</span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                Đỉnh Ô Quy Hồ • 05:45 AM (4K)
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Prompt Indicator */}
        <div className="mt-14 flex flex-col items-center justify-center text-center">
          <a
            href="#seasons"
            className="group inline-flex flex-col items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <span>Cuộn để khám phá hành trình 4 mùa</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
}
