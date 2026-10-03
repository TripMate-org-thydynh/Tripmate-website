'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGsapEffect, gsap } from '@/hooks/useGsap';
import EnvironmentalEffects, { WeatherEffectType } from '@/components/effects/EnvironmentalEffects';
import { 
  Sparkles, 
  Sun, 
  Wind, 
  Snowflake, 
  Flower2, 
  Calendar,
  Thermometer,
  MapPin,
  ArrowRight
} from 'lucide-react';

interface SeasonData {
  id: 'spring' | 'summer' | 'autumn' | 'winter';
  name: string;
  vietnameseTitle: string;
  subtitle: string;
  months: string;
  temp: string;
  vibe: string;
  destination: string;
  effect: WeatherEffectType;
  image: string;
  accentColor: string;
  icon: typeof Flower2;
  highlights: string[];
}

const seasonsData: SeasonData[] = [
  {
    id: 'spring',
    name: 'MÙA XUÂN',
    vietnameseTitle: 'Xuân Về Hoa Đào Nở Rộ',
    subtitle: 'Mùa của những chuyến du xuân mở bát đầu năm, ngắm hoa đào Sa Pa nở hồng sườn núi và săn biển mây Tây Bắc cùng hội bạn.',
    months: 'Tháng 2 - Tháng 4',
    temp: '18°C',
    vibe: 'Du xuân • Hoa đào nở • Cầu an',
    destination: 'Sa Pa - Mộc Châu - Hà Giang',
    effect: 'spring',
    image: '/destinations/season_spring.jpg',
    accentColor: '#FB7185',
    icon: Flower2,
    highlights: ['Săn hoa anh đào nở rực', 'Chụp ảnh đồi chè Ô Long', 'Cắm trại thung lũng Mường Hoa'],
  },
  {
    id: 'summer',
    name: 'MÙA HẠ',
    vietnameseTitle: 'Hạ Vàng Biển Xanh Nắng Rực',
    subtitle: 'Mùa giải nhiệt của tuổi trẻ: lên cano lặn ngắm san hô, check-in resort hoàng hôn và thưởng thức tiệc BBQ hải sản đêm bên bờ biển.',
    months: 'Tháng 5 - Tháng 8',
    temp: '29°C',
    vibe: 'Bikini • Lặn biển • Săn hoàng hôn',
    destination: 'Phú Quốc - Nha Trang - Hạ Long',
    effect: 'summer',
    image: '/destinations/season_summer.jpg',
    accentColor: '#F59E0B',
    icon: Sun,
    highlights: ['Tour cano 3 đảo lặn san hô', 'Chèo SUP đón bình minh', 'Party BBQ hải sản bãi biển'],
  },
  {
    id: 'autumn',
    name: 'MÙA THU',
    vietnameseTitle: 'Thu Se Lạnh Lá Vàng Rơi',
    subtitle: 'Mùa lãng mạn nhất trong năm: dạo phố ngửi hương hoa sữa Hà Nội, hay vi vu đồi thông Đà Lạt se lạnh nhâm nhi ly cà phê vợt.',
    months: 'Tháng 9 - Tháng 11',
    temp: '22°C',
    vibe: 'Cà phê sương • Lá vàng • Chill out',
    destination: 'Hà Nội - Đà Lạt - Ninh Bình',
    effect: 'autumn',
    image: '/destinations/season_autumn.jpg',
    accentColor: '#F95738',
    icon: Wind,
    highlights: ['Ngắm lá phong chuyển sắc', 'Dạo hồ ngắm hoàng hôn vàng', 'Camping đồi cỏ hồng'],
  },
  {
    id: 'winter',
    name: 'MÙA ĐÔNG',
    vietnameseTitle: 'Đông Tuyết Phủ Bên Lửa Trại',
    subtitle: 'Chinh phục đỉnh tuyết Fansipan rét buốt, tối quây quần bên nồi lẩu gà lá é nghi ngút khói và chơi board game thâu đêm.',
    months: 'Tháng 12 - Tháng 1',
    temp: '11°C',
    vibe: 'Tuyết rơi • Lẩu nóng • Đốt lửa trại',
    destination: 'Fansipan - Mẫu Sơn - Đà Lạt Đông',
    effect: 'winter',
    image: '/destinations/season_winter.jpg',
    accentColor: '#38BDF8',
    icon: Snowflake,
    highlights: ['Săn tuyết đỉnh Fansipan', 'Lẩu gà lá é ấm nóng', 'Đêm ma sói bên đống lửa'],
  },
];

export default function SeasonsSection() {
  const [activeSeason, setActiveSeason] = useState<SeasonData>(seasonsData[0]);

  const containerRef = useGsapEffect<HTMLElement>((target, _ctx, isReduced) => {
    if (isReduced) return;

    gsap.from('.season-reveal', {
      scrollTrigger: {
        trigger: target,
        start: 'top 75%',
      },
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, []);

  const IconComponent = activeSeason.icon;

  return (
    <section
      id="seasons"
      ref={containerRef}
      className="relative py-20 md:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="season-reveal max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 mb-3.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F95738]" />
            <span>HỆ THỐNG TRẢI NGHIỆM 4 MÙA: XUÂN • HẠ • THU • ĐÔNG</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4">
            Bốn mùa luân chuyển. Trọn vẹn thanh xuân cùng hội bạn.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
            Dù là cánh hoa đào xuân rực rỡ, nắng vàng biển hạ, lá phong thu bay lượn hay tuyết phủ mùa đông — TripMate chuẩn bị sẵn sàng cho mọi hành trình theo mùa của nhóm bạn.
          </p>
        </div>

        {/* 4 Seasons Interactive Switcher Tabs */}
        <div className="season-reveal grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {seasonsData.map((s) => {
            const isActive = activeSeason.id === s.id;
            const TabIcon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSeason(s)}
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-lg scale-[1.02] border-transparent'
                    : 'bg-zinc-50/80 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono tracking-wider uppercase opacity-70 block mb-0.5">
                    {s.name}
                  </span>
                  <span className="text-sm sm:text-base font-bold tracking-tight block">
                    {s.vietnameseTitle.split(' ')[0]} {s.vietnameseTitle.split(' ')[1]}
                  </span>
                  <span className="text-xs font-mono opacity-80 mt-1 block">
                    {s.temp}
                  </span>
                </div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isActive 
                    ? 'bg-white/20 text-white dark:bg-zinc-900/10 dark:text-zinc-950' 
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                }`}>
                  <TabIcon className="w-5 h-5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Master Atmospheric Canvas Container */}
        <div className="season-reveal relative rounded-[2.5rem] overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 shadow-2xl min-h-[580px] lg:min-h-[620px] flex flex-col justify-between p-6 sm:p-10 lg:p-12">
          {/* Authentic Destination Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={activeSeason.image}
              alt={activeSeason.vietnameseTitle}
              fill
              priority
              sizes="100vw"
              className="object-cover transition-all duration-700 ease-out filter brightness-90"
            />
            {/* Cinematic Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-10" />
          </div>

          {/* ACTIVE 4-SEASONS PARTICLE CANVAS (Spring Petals, Summer Sunrays, Autumn Leaves, Winter Snow) */}
          <EnvironmentalEffects
            effect={activeSeason.effect}
            intensity="medium"
            className="z-20"
          />

          {/* Top Bar Indicators */}
          <div className="relative z-30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/30 flex items-center gap-1.5 shadow-xs">
                <IconComponent className="w-3.5 h-3.5" />
                {activeSeason.name} • {activeSeason.months}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs font-mono font-medium border border-white/15 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F95738]" />
                {activeSeason.destination}
              </span>
            </div>

            {/* Weather Sensor Pill */}
            <div className="px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center gap-3 shadow-md">
              <div className="flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium text-white/90">{activeSeason.vibe}</span>
              </div>
              <span className="text-base font-bold font-mono text-amber-300">{activeSeason.temp}</span>
            </div>
          </div>

          {/* Bottom Content Area */}
          <div className="relative z-30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pt-24">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GỢI Ý DU LỊCH THEO MÙA</span>
              </div>
              <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                {activeSeason.vietnameseTitle}
              </h3>
              <p className="text-sm sm:text-base text-zinc-200 font-normal leading-relaxed max-w-2xl mb-6">
                {activeSeason.subtitle}
              </p>

              {/* Highlights checklist */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs text-white/70 font-medium">Trải nghiệm không thể bỏ lỡ:</span>
                {activeSeason.highlights.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20 shadow-xs"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Action Card */}
            <div className="lg:col-span-4 flex flex-col justify-end">
              <div className="p-5 sm:p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-white/90">Kế hoạch {activeSeason.name.toLowerCase()}</span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Sẵn sàng
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mb-4 leading-relaxed font-normal">
                  TripMate tự động tính toán thời tiết, gợi ý hành lý mang theo và danh sách đồ ấm cho cả nhóm.
                </p>
                <a
                  href="#planning"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-100 transition-colors shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Lên lịch chuyến đi mùa này</span>
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
