'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGsapEffect, gsap } from '@/hooks/useGsap';
import EnvironmentalEffects, { WeatherEffectType } from '@/components/effects/EnvironmentalEffects';
import { 
  MapPin, 
  CloudFog, 
  Sun, 
  Wind, 
  Compass, 
  Calendar,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  tagline: string;
  region: string;
  distance: string;
  duration: string;
  temp: string;
  weatherCondition: string;
  weatherEffect: WeatherEffectType;
  image: string;
  vibe: string;
  topSpots: string[];
  color: string;
}

const destinations: Destination[] = [
  {
    id: 'sapa',
    name: 'Sa Pa',
    tagline: 'Săn biển mây thung lũng Mường Hoa & Ruộng bậc thang',
    region: 'Tây Bắc',
    distance: '315 km',
    duration: '5h xe bus',
    temp: '14°C',
    weatherCondition: 'Sương mù bảng lảng',
    weatherEffect: 'mist',
    image: '/destinations/sapa.jpg',
    vibe: 'Trekking & Phượt núi',
    topSpots: ['Đỉnh Fansipan', 'Bản Cát Cát', 'Đèo Ô Quy Hồ'],
    color: '#3B82F6',
  },
  {
    id: 'halong',
    name: 'Hạ Long - Ninh Bình',
    tagline: 'Chèo thuyền vịnh ngọc & Khám phá hang động kỳ vĩ',
    region: 'Đông Bắc',
    distance: '165 km',
    duration: '2h30 ô tô',
    temp: '25°C',
    weatherCondition: 'Nắng nhẹ biển êm',
    weatherEffect: 'sun',
    image: '/destinations/halong.jpg',
    vibe: 'Chèo Kayak & Ngắm cảnh',
    topSpots: ['Hang Sửng Sốt', 'Tràng An Bái Đính', 'Đảo Ti Tốp'],
    color: '#06B6D4',
  },
  {
    id: 'dalat',
    name: 'Đà Lạt',
    tagline: 'Lạc giữa rừng thông ngút ngàn, cà phê sương & cắm trại đêm',
    region: 'Tây Nguyên',
    distance: '305 km',
    duration: '6h xe đêm',
    temp: '16°C',
    weatherCondition: 'Gió nhẹ & Lá bay',
    weatherEffect: 'leaves',
    image: '/destinations/dalat.jpg',
    vibe: 'Chill out & Camping',
    topSpots: ['Đồi chè Cầu Đất', 'Hồ Tuyền Lâm', 'Đồi cỏ hồng'],
    color: '#F95738',
  },
  {
    id: 'phuquoc',
    name: 'Phú Quốc',
    tagline: 'Hoàng hôn bãi biển vàng rực, lặn ngắm san hô & hải sản tươi',
    region: 'Biển đảo',
    distance: '450 km',
    duration: '1h bay',
    temp: '29°C',
    weatherCondition: 'Hoàng hôn rực rỡ',
    weatherEffect: 'sun',
    image: '/destinations/phuquoc.jpg',
    vibe: 'Nghỉ dưỡng & Bikini',
    topSpots: ['Bãi Sao', 'Sunset Sanato', 'Tour cano 3 đảo'],
    color: '#F59E0B',
  },
];

export default function MapJourneySection() {
  const [activeIdx, setActiveIdx] = useState(2); // Default to Da Lat for dynamic leaves
  const activeDest = destinations[activeIdx];

  const containerRef = useGsapEffect<HTMLElement>((target, _ctx, isReduced) => {
    if (isReduced) return;

    gsap.from('.dest-reveal', {
      scrollTrigger: {
        trigger: target,
        start: 'top 75%',
      },
      y: 35,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power2.out',
    });
  }, []);

  return (
    <section
      id="destinations"
      ref={containerRef}
      className="relative py-20 md:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#0A0A0D] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="dest-reveal max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-xs mb-3.5">
            <Compass className="w-3.5 h-3.5 text-[#F95738]" />
            <span>HÀNH TRÌNH TƯƠNG TÁC THỜI TIẾT & ĐỊA ĐIỂM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4">
            Khám phá mọi miền. Thời tiết hòa cùng cảm xúc.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
            Mỗi điểm đến mang một linh hồn thời tiết và phong cảnh riêng biệt. TripMate tự động đồng bộ dự báo khí hậu, tính toán lộ trình di chuyển và chuẩn bị checklist phù hợp cho cả nhóm.
          </p>
        </div>

        {/* Destination Route Switcher Bar */}
        <div className="dest-reveal flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {destinations.map((dest, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`group flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isActive ? 'bg-[#F95738]' : 'bg-zinc-300 dark:bg-zinc-700 group-hover:bg-zinc-400'
                  }`}
                />
                <span>{dest.name}</span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-white/20 text-white dark:bg-zinc-900/10 dark:text-zinc-950' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                }`}>
                  {dest.temp}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Destination Canvas with Embedded Environmental Effect */}
        <div className="dest-reveal relative rounded-[2.5rem] overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-900 shadow-2xl min-h-[560px] lg:min-h-[600px] flex flex-col justify-between p-6 sm:p-10 lg:p-12">
          {/* Background Cinematic Photo with transition */}
          <div className="absolute inset-0 z-0">
            <Image
              src={activeDest.image}
              alt={activeDest.name}
              fill
              priority
              sizes="100vw"
              className="object-cover transition-opacity duration-700 ease-in-out"
            />
            {/* Cinematic dark gradient scrim for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />
          </div>

          {/* ACTIVE ENVIRONMENTAL CANVAS LAYER (Rain/Leaves/Sun/Mist) */}
          <EnvironmentalEffects
            effect={activeDest.weatherEffect}
            intensity="medium"
            className="z-20"
          />

          {/* Top Info Bar */}
          <div className="relative z-30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/30 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F95738]" />
                {activeDest.region} • {activeDest.distance}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs font-mono font-medium border border-white/10 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {activeDest.duration}
              </span>
            </div>

            {/* Weather Sensor Widget */}
            <div className="px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 text-white flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {activeDest.weatherEffect === 'leaves' && <Wind className="w-4 h-4 text-emerald-400 animate-pulse" />}
                {activeDest.weatherEffect === 'mist' && <CloudFog className="w-4 h-4 text-sky-300 animate-pulse" />}
                {activeDest.weatherEffect === 'sun' && <Sun className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '10s' }} />}
                <span className="text-xs font-medium text-white/90">{activeDest.weatherCondition}</span>
              </div>
              <span className="text-sm font-bold font-mono text-amber-300">{activeDest.temp}</span>
            </div>
          </div>

          {/* Bottom Destination Details Content */}
          <div className="relative z-30 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pt-24">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{activeDest.vibe}</span>
              </div>
              <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3 leading-tight">
                {activeDest.name}
              </h3>
              <p className="text-sm sm:text-base text-zinc-200 font-normal leading-relaxed max-w-2xl mb-6">
                {activeDest.tagline}
              </p>

              {/* Highlights pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-white/60 font-medium">Điểm check-in nổi bật:</span>
                {activeDest.topSpots.map((spot, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20"
                  >
                    {spot}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Trip Itinerary CTA Card */}
            <div className="lg:col-span-4 flex flex-col justify-end">
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-white/80">Lịch trình mẫu 3N2Đ</span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Sẵn sàng sao chép
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
                  Đã tối ưu cung đường ngắm cảnh, điểm ăn uống bản địa và thời gian chụp ảnh đẹp nhất.
                </p>
                <a
                  href="#planning"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-100 transition-colors shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Xem lịch trình chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
