'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useGsapEffect, ScrollTrigger } from '@/hooks/useGsap';
import EnvironmentalEffects, { WeatherEffectType } from '@/components/effects/EnvironmentalEffects';
import GooglePlayButton from '@/components/GooglePlayButton';
import { 
  Flower2, 
  Sun, 
  Wind, 
  Snowflake, 
  Sparkles, 
  Bot, 
  MapPin, 
  Check, 
  CheckCircle2, 
  Lightbulb, 
  QrCode, 
  Receipt, 
  Zap, 
  X, 
  Flame, 
  Camera, 
  Music, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';

interface FourSeasonsScrollerProps {
  onOpenDownload: () => void;
}

interface SeasonConfig {
  id: string;
  code: string;
  name: string;
  vietnameseTitle: string;
  tagline: string;
  description: string;
  region: string;
  temp: string;
  vibe: string;
  image: string;
  effect: WeatherEffectType;
  accentColor: string;
  glowColor: string;
  icon: typeof Flower2;
}

const seasonsConfig: SeasonConfig[] = [
  {
    id: 'season-spring',
    code: 'Mùa xuân',
    name: 'MÙA XUÂN',
    vietnameseTitle: 'Xuân Về Hoa Đào Nở',
    tagline: 'Khởi đầu mới & Lên lịch trình, chia đồ đạc cùng AI',
    description: 'Mùa của những chuyến du xuân mở bát, ngắm hoa đào nở hồng triền đồi Sa Pa và săn biển mây Tây Bắc. TripMate AI gợi ý lịch trình thuận đường trong 10 giây, phân công đồ đạc sòng phẳng ngay từ ngày đầu xuất phát.',
    region: 'Sa Pa - Mộc Châu - Hà Giang',
    temp: '18°C',
    vibe: 'Hoa đào nở • Sương sớm Tây Bắc',
    image: '/destinations/season_spring.jpg',
    effect: 'spring',
    accentColor: '#FB7185',
    glowColor: 'rgba(251, 113, 133, 0.18)',
    icon: Flower2,
  },
  {
    id: 'season-summer',
    code: 'Mùa hạ',
    name: 'MÙA HẠ',
    vietnameseTitle: 'Hạ Vàng Biển Xanh',
    tagline: 'Cung đường rực nắng & Chia tiền sòng phẳng VietQR',
    description: 'Lên cano lặn ngắm san hô bãi ngọc Phú Quốc, check-in resort hoàng hôn và thưởng thức hải sản đêm. Mọi chi phí ăn uống, homestay, vé cano đều được TripMate chia tự động, rút gọn số lần chuyển khoản không để ai phải ngại ngùng.',
    region: 'Phú Quốc - Nha Trang - Vịnh Hạ Long',
    temp: '29°C',
    vibe: 'Biển ngọc • Hoàng hôn nắng vàng',
    image: '/destinations/season_summer.jpg',
    effect: 'summer',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.18)',
    icon: Sun,
  },
  {
    id: 'season-autumn',
    code: 'Mùa thu',
    name: 'MÙA THU',
    vietnameseTitle: 'Thu Se Lạnh Lá Rơi',
    tagline: 'Rừng thông lãng mạn & Mini-game gắn kết đồng đội',
    description: 'Dạo phố ngửi hương hoa sữa Hà Nội, vi vu đồi thông Đà Lạt se lạnh nhâm nhi ly cà phê vợt. Không còn cảnh mỗi người cắm mặt vào điện thoại, Vòng quay may rủi SVG và loạt mini-game TripMate biến mọi chặng dừng chân thành tràng cười rộn rã.',
    region: 'Hà Nội - Đà Lạt - Ninh Bình',
    temp: '22°C',
    vibe: 'Lá phong vàng • Cà phê đồi thông',
    image: '/destinations/season_autumn.jpg',
    effect: 'autumn',
    accentColor: '#F95738',
    glowColor: 'rgba(249, 87, 56, 0.18)',
    icon: Wind,
  },
  {
    id: 'season-winter',
    code: 'Mùa đông',
    name: 'MÙA ĐÔNG',
    vietnameseTitle: 'Đông Tuyết Lửa Trại',
    tagline: 'Đỉnh tuyết buốt giá & Lưu giữ kỷ niệm vô giá',
    description: 'Chinh phục đỉnh tuyết Fansipan rét buốt, tối quây quần bên nồi lẩu gà lá é và bếp lửa trại ấm cúng. Khung ảnh bí mật Ghost Cam chỉ mở khóa khi cả nhóm có mặt tại đúng tọa độ GPS, gom trọn kho ảnh gốc 4K không nén của thanh xuân.',
    region: 'Fansipan - Mẫu Sơn - Đà Lạt Đông',
    temp: '11°C',
    vibe: 'Tuyết rơi • Đêm cắm trại ấm áp',
    image: '/destinations/season_winter.jpg',
    effect: 'winter',
    accentColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.18)',
    icon: Snowflake,
  },
];

const springPresets = [
  {
    id: 'sapa',
    title: 'Sa Pa - Mộc Châu Hoa Đào (3N2Đ)',
    prompt: 'Nhóm 6 bạn thân đi du xuân, thích săn mây Ô Long, hoa đào nở rộ và ăn lẩu cá hồi.',
    stops: [
      { time: '07:00', title: 'Săn hoa mai anh đào đồi chè Ô Long', cat: 'Săn ảnh' },
      { time: '11:30', title: 'Cơm lam gà đồi Bản Cát Cát', cat: 'Ăn trưa' },
      { time: '14:30', title: 'Cáp treo Fansipan săn biển mây', cat: 'Trải nghiệm' },
      { time: '19:00', title: 'Lẩu cá hồi sưởi ấm đêm chợ phiên', cat: 'Ăn tối' },
    ],
    budget: '~2.800.000đ / người',
    tip: 'Tối ưu tuyến đường Ô Long lúc 07:00 sáng bắt trọn nắng xuyên sương sớm.',
  },
  {
    id: 'danang',
    title: 'Đà Nẵng - Hội An (3N2Đ)',
    prompt: 'Nhóm 4 bạn thích ẩm thực đường phố, ngắm hoàng hôn Hội An và có ngân sách 3.5 triệu.',
    stops: [
      { time: '08:00', title: 'Bánh tráng cuốn thịt heo Đại Lộc', cat: 'Ăn sáng' },
      { time: '14:30', title: 'Thuyền thúng Rừng Dừa Bảy Mẫu', cat: 'Trải nghiệm' },
      { time: '18:30', title: 'Phố cổ Hội An thả đèn hoa đăng', cat: 'Check-in' },
      { time: '21:00', title: 'Cầu Rồng phun lửa cuối tuần', cat: 'Sự kiện' },
    ],
    budget: '~3.200.000đ / người',
    tip: 'Lộ trình ven biển tránh tắc đường giờ tan tầm.',
  },
];

const wheelMembers = [
  { name: 'Minh béo', color: '#18181B', text: '#FAFAFA' },
  { name: 'Mai Linh', color: '#F95738', text: '#FFFFFF' },
  { name: 'Hoàng Nam', color: '#27272A', text: '#FAFAFA' },
  { name: 'Thanh Trúc', color: '#09090B', text: '#FAFAFA' },
  { name: 'Anh Tuấn', color: '#E4E4E7', text: '#09090B' },
  { name: 'Thảo An', color: '#3F3F46', text: '#FAFAFA' },
];

export default function FourSeasonsScroller({ onOpenDownload }: FourSeasonsScrollerProps) {
  const [activeSeasonIdx, setActiveSeasonIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSpringPreset, setActiveSpringPreset] = useState(springPresets[0]);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelWinner, setWheelWinner] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>('minh');

  const scrollerTrackRef = useRef<HTMLDivElement | null>(null);

  // GSAP ScrollTrigger Pinned Scrub Implementation
  const containerRef = useGsapEffect<HTMLDivElement>((target, _ctx, isReduced) => {
    if (isReduced) return;

    ScrollTrigger.create({
      trigger: target,
      start: 'top top',
      end: '+=300%', // 400vh total virtual distance for 4 seasons
      pin: true,
      pinSpacing: true,
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);

        // Map progress smoothly across the 4 seasons (0 to 1)
        if (p < 0.25) {
          setActiveSeasonIdx(0);
        } else if (p < 0.5) {
          setActiveSeasonIdx(1);
        } else if (p < 0.75) {
          setActiveSeasonIdx(2);
        } else {
          setActiveSeasonIdx(3);
        }
      },
    });
  }, []);

  const activeSeason = seasonsConfig[activeSeasonIdx];

  // Manual jump by clicking the Gionatan Nese-styled season dock
  const jumpToSeason = (idx: number) => {
    if (!scrollerTrackRef.current) return;
    const trackTop = scrollerTrackRef.current.offsetTop;
    const totalDistance = window.innerHeight * 3;
    const targetScroll = trackTop + (idx / 3.2) * totalDistance;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelWinner(null);

    const randomSlice = Math.floor(Math.random() * wheelMembers.length);
    const sliceAngle = 360 / wheelMembers.length;
    const additionalDegrees = 360 * 5 + randomSlice * sliceAngle + sliceAngle / 2;
    const newRotation = wheelRotation + additionalDegrees;

    setWheelRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWheelWinner(wheelMembers[randomSlice].name);
    }, 3200);
  };

  return (
    <div
      id="four-seasons-journey"
      ref={scrollerTrackRef}
      className="relative w-full bg-black"
    >
      {/* Scroll Anchors for Navbar Links */}
      <div id="season-spring" className="absolute top-0 pointer-events-none" />
      <div id="season-summer" className="absolute top-[28%] pointer-events-none" />
      <div id="season-autumn" className="absolute top-[55%] pointer-events-none" />
      <div id="season-winter" className="absolute top-[82%] pointer-events-none" />

      {/* Pinned Viewport Container (Fixed to 100vh during the scrub) */}
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden text-white select-none flex flex-col justify-between"
      >
        {/* ========================================================================= */}
        {/* LAYER 0: FULL-BLEED BACKGROUNDS (Morphing & crossfading between 4 seasons) */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {seasonsConfig.map((season, idx) => {
            const isVisible = activeSeasonIdx === idx;
            return (
              <div
                key={season.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                style={{ transitionProperty: 'opacity, transform' }}
              >
                <Image
                  src={season.image}
                  alt={season.vietnameseTitle}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="object-cover filter brightness-[0.72] contrast-105"
                />
              </div>
            );
          })}

          {/* Deep Cinematic Scrims (Ensures ultra readability like gionatannese.com) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 z-10" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/80 z-10" />
          
          {/* Reactive Ambient Glow matching current season accent */}
          <div
            className="absolute inset-0 transition-colors duration-1000 z-10 pointer-events-none"
            style={{ backgroundColor: activeSeason.glowColor }}
          />
        </div>

        {/* ========================================================================= */}
        {/* LAYER 1: ENVIRONMENTAL CANVAS PARTICLES (Spring, Summer, Autumn, Winter)  */}
        {/* ========================================================================= */}
        <EnvironmentalEffects
          key={activeSeason.effect}
          effect={activeSeason.effect}
          intensity="medium"
          className="z-15"
        />

        {/* ========================================================================= */}
        {/* LAYER 2: TOP TELEMETRY & EDITORIAL HEADER (Gionatan Nese Signature Style) */}
        {/* ========================================================================= */}
        <div className="relative z-20 pt-8 sm:pt-10 px-6 sm:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold tracking-[0.25em] text-white/90 uppercase px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xs">
              {activeSeason.code}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center gap-2 text-xs font-mono text-white/90 shadow-sm">
              <MapPin className="w-3 h-3 text-[#F95738]" />
              <span>{activeSeason.region}</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center gap-1.5 text-xs font-mono text-amber-300 shadow-sm">
              <span>{activeSeason.vibe}</span>
              <span className="font-bold">• {activeSeason.temp}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LAYER 3: MAIN STAGE CONTENT (Changes smoothly based on active season)     */}
        {/* ========================================================================= */}
        <div className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 flex flex-col justify-center my-auto py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* Left Column: Big Editorial Typography & Season Storytelling */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F95738] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{activeSeason.tagline}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 leading-[1.1] drop-shadow-md">
                {activeSeason.vietnameseTitle}
              </h2>

              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed max-w-xl mb-6 font-normal">
                {activeSeason.description}
              </p>

              {/* Quick Navigation Between Seasons Buttons */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/15 max-w-md">
                <span className="text-xs font-mono text-white/60 uppercase tracking-wider">
                  Chuyển mùa nhanh:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => jumpToSeason(Math.max(0, activeSeasonIdx - 1))}
                    disabled={activeSeasonIdx === 0}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 border border-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs font-bold text-white px-2">
                    0{activeSeasonIdx + 1} / 04
                  </span>
                  <button
                    type="button"
                    onClick={() => jumpToSeason(Math.min(3, activeSeasonIdx + 1))}
                    disabled={activeSeasonIdx === 3}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 border border-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: High-Tech Glassmorphic Interactive Feature Card */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="relative rounded-3xl bg-black/65 backdrop-blur-2xl border border-white/20 p-5 sm:p-7 shadow-2xl shadow-black/80 transition-all duration-500">
                
                {/* -------------------- SEASON 1: MÙA XUÂN (AI Assistant Planner) -------------------- */}
                {activeSeasonIdx === 0 && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-[#F95738]" />
                        <span className="text-xs font-bold text-white tracking-wide uppercase">
                          Trợ Lý Du Lịch AI • Lên Kế Hoạch 10s
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Ví dụ: {activeSpringPreset.budget}
                      </span>
                    </div>

                    {/* Presets Bar */}
                    <div className="flex gap-2">
                      {springPresets.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setActiveSpringPreset(p)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            activeSpringPreset.id === p.id
                              ? 'bg-white text-black shadow-sm'
                              : 'bg-white/10 text-white/70 hover:text-white border border-white/15'
                          }`}
                        >
                          {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                        </button>
                      ))}
                    </div>

                    {/* Prompt Box */}
                    <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2.5 text-xs text-white/90">
                      <Sparkles className="w-4 h-4 text-[#F95738] shrink-0" />
                      <span className="truncate">&quot;{activeSpringPreset.prompt}&quot;</span>
                    </div>

                    {/* Route Checkpoints */}
                    <div className="flex flex-col gap-2">
                      {activeSpringPreset.stops.map((stop, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="px-2 py-0.5 rounded bg-white/15 font-mono text-[10px] text-white/90">
                              {stop.time}
                            </span>
                            <span className="font-semibold text-white">{stop.title}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                            {stop.cat}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-[11px] text-rose-200 flex items-center gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-[#F95738] shrink-0" />
                      <span>{activeSpringPreset.tip}</span>
                    </div>
                  </div>
                )}

                {/* -------------------- SEASON 2: MÙA HẠ (Expense & VietQR Splitting) -------------------- */}
                {activeSeasonIdx === 1 && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-[#F95738]" />
                        <span className="text-xs font-bold text-white tracking-wide uppercase">
                          Chia Tiền Sòng Phẳng • Tối Ưu Nợ VietQR
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        Tổng: ₫6.400.000
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-white/70 block">Mỗi thành viên cần chuyển:</span>
                        <span className="text-2xl font-black font-mono text-[#F95738]">₫1.600.000</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowQrModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-white text-black text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-zinc-100 transition-colors cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Mã VietQR</span>
                      </button>
                    </div>

                    {/* Debt minimization steps */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-mono text-white/60">
                        Đồ thị rút gọn nợ (12 giao dịch → 3 giao dịch):
                      </span>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                          <span className="text-[9px] font-mono text-zinc-400 block">BƯỚC 1</span>
                          <span className="font-semibold text-white block text-[11px]">Minh → Linh</span>
                          <span className="text-[11px] font-mono text-amber-300 font-bold">₫1.600.000</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                          <span className="text-[9px] font-mono text-zinc-400 block">BƯỚC 2</span>
                          <span className="font-semibold text-white block text-[11px]">Nam → Linh</span>
                          <span className="text-[11px] font-mono text-amber-300 font-bold">₫1.600.000</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                          <span className="text-[9px] font-mono text-zinc-400 block">BƯỚC 3</span>
                          <span className="font-semibold text-white block text-[11px]">Trúc → Linh</span>
                          <span className="text-[11px] font-mono text-amber-300 font-bold">₫1.600.000</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[11px] text-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Không cần tính nhẩm, quét mã chuyển khoản trực tiếp qua ngân hàng.</span>
                    </div>
                  </div>
                )}

                {/* -------------------- SEASON 3: MÙA THU (Wheel & Squad Quiz) -------------------- */}
                {activeSeasonIdx === 2 && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-[#F95738]" />
                        <span className="text-xs font-bold text-white tracking-wide uppercase">
                          Vòng Quay &quot;Ai Bao Chầu Này?&quot; & Squad Vote
                        </span>
                      </div>
                      <span className="text-xs font-mono text-orange-400">
                        {wheelWinner ? `Thắng: ${wheelWinner}` : 'Sẵn sàng'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      {/* Interactive Wheel */}
                      <div className="sm:col-span-6 flex flex-col items-center">
                        <div className="relative w-44 h-44 flex items-center justify-center">
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-x-[8px] border-x-transparent border-t-[14px] border-t-[#F95738]" />
                          <div
                            className="w-full h-full rounded-full border border-white/30 shadow-xl overflow-hidden bg-zinc-950"
                            style={{
                              transform: `rotate(${wheelRotation}deg)`,
                              transition: isSpinning ? 'transform 3.2s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
                            }}
                          >
                            <svg viewBox="0 0 200 200" className="w-full h-full select-none">
                              {wheelMembers.map((slice, i) => {
                                const angle = 360 / wheelMembers.length;
                                const startAngle = (i * angle * Math.PI) / 180;
                                const endAngle = (((i + 1) * angle) * Math.PI) / 180;
                                const x1 = (100 + 100 * Math.cos(startAngle)).toFixed(2);
                                const y1 = (100 + 100 * Math.sin(startAngle)).toFixed(2);
                                const x2 = (100 + 100 * Math.cos(endAngle)).toFixed(2);
                                const y2 = (100 + 100 * Math.sin(endAngle)).toFixed(2);
                                const textAngle = (i * angle + angle / 2).toFixed(2);
                                const textRad = (parseFloat(textAngle) * Math.PI) / 180;
                                const textX = (100 + 62 * Math.cos(textRad)).toFixed(2);
                                const textY = (100 + 62 * Math.sin(textRad)).toFixed(2);

                                return (
                                  <g key={i}>
                                    <path
                                      d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                                      fill={slice.color}
                                      stroke="#3F3F46"
                                      strokeWidth="1.5"
                                    />
                                    <text
                                      x={textX}
                                      y={textY}
                                      fill={slice.text}
                                      fontSize="8"
                                      fontWeight="bold"
                                      textAnchor="middle"
                                      dominantBaseline="central"
                                      transform={`rotate(${parseFloat(textAngle) + 90}, ${textX}, ${textY})`}
                                    >
                                      {slice.name}
                                    </text>
                                  </g>
                                );
                              })}
                            </svg>
                          </div>

                          <button
                            type="button"
                            onClick={spinWheel}
                            disabled={isSpinning}
                            className="absolute z-20 w-11 h-11 rounded-full bg-white text-black font-bold text-[10px] flex items-center justify-center cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-transform"
                          >
                            QUAY
                          </button>
                        </div>
                      </div>

                      {/* Squad Vote */}
                      <div className="sm:col-span-6 flex flex-col gap-2">
                        <span className="text-[11px] font-mono text-white/70">
                          Squad Vote: &quot;Ai hay lạc đường nhất?&quot;
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {['Minh béo (68% vote)', 'Hoàng Nam (18%)', 'Mai Linh (14%)'].map((opt, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setSelectedQuiz(opt)}
                              className={`p-2 rounded-xl text-left text-xs font-medium text-white flex items-center justify-between border cursor-pointer transition-colors ${
                                selectedQuiz === opt
                                  ? 'bg-[#F95738]/30 border-[#F95738]'
                                  : 'bg-white/10 hover:bg-white/20 border-white/10'
                              }`}
                            >
                              <span>{opt}</span>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {wheelWinner && (
                      <div className="p-2.5 rounded-xl bg-[#F95738]/20 border border-[#F95738]/40 text-[#F95738] text-xs font-bold text-center">
                        🎉 Người bao cà phê: {wheelWinner}!
                      </div>
                    )}
                  </div>
                )}

                {/* -------------------- SEASON 4: MÙA ĐÔNG (Ghost Cam HUD & CTA) -------------------- */}
                {activeSeasonIdx === 3 && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-[#F95738]" />
                        <span className="text-xs font-bold text-white tracking-wide uppercase">
                          Ghost Cam GPS • Mở Khóa Khoảnh Khắc
                        </span>
                      </div>
                      <span className="text-xs font-mono text-sky-400">
                        GPS: 11°58&apos;32&quot;N
                      </span>
                    </div>

                    {/* HUD Viewfinder Snapshot */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/20 bg-black">
                      <Image
                        src="/destinations/friends_roadtrip.jpg"
                        alt="Ghost cam unlocked"
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/50" />

                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-mono text-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span>REC 00:04:18</span>
                      </div>

                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-500/80 text-[10px] font-bold text-white">
                        4/4 bạn đã có mặt
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white">
                        <div className="flex items-center gap-1.5 truncate">
                          <Music className="w-3 h-3 text-[#F95738] shrink-0" />
                          <span className="truncate text-[11px]">Vũ. - Bước Qua Mùa Cô Đơn</span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-300">Ảnh gốc 4K</span>
                      </div>
                    </div>

                    {/* Call to Action Bar */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={onOpenDownload}
                        className="w-full sm:flex-1 py-3 px-5 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Tải TripMate Miễn Phí</span>
                      </button>
                      <GooglePlayButton size="sm" className="w-full sm:w-auto" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LAYER 4: GIONATAN NESE FLOATING DOCK (Scrub Progress & Fast Jump Bar)     */}
        {/* ========================================================================= */}
        <div className="relative z-30 pb-6 sm:pb-8 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Subtle Scrub Progress Line */}
          <div className="hidden sm:flex items-center gap-3 flex-1 max-w-xs">
            <span className="text-[10px] font-mono text-white/50">SCRUB</span>
            <div className="h-1 flex-1 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-150 rounded-full"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-white/70">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>

          {/* Minimal Floating Season Switcher Dock */}
          <div className="flex items-center gap-1 p-1.5 rounded-full bg-black/60 backdrop-blur-2xl border border-white/20 shadow-2xl">
            {seasonsConfig.map((s, idx) => {
              const isActive = activeSeasonIdx === idx;
              const IconComponent = s.icon;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => jumpToSeason(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white text-black shadow-lg scale-105'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>

          {/* Prompt Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-white/60">
            <span>Cuộn chuột để chuyển mùa</span>
            <span className="inline-block animate-bounce">↓</span>
          </div>
        </div>

      </div>

      {/* VietQR Quick Payment Modal */}
      {showQrModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="relative w-full max-w-sm rounded-3xl bg-zinc-950 border border-zinc-800 p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#F95738] mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>VIETQR TỰ ĐỘNG ĐIỀN NỘI DUNG</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-4">
              Thanh toán Tour Biển Đảo
            </h4>

            <div className="relative aspect-square w-full rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center p-6 mb-4">
              <QrCode className="w-36 h-36 text-white" />
              <div className="text-center mt-2">
                <span className="text-[11px] font-mono text-zinc-400 block">
                  VietinBank • 103874928192
                </span>
                <span className="text-sm font-bold font-mono text-white block mt-0.5">
                  ₫1.600.000
                </span>
                <span className="text-[10px] text-zinc-400 block mt-1">
                  ND: &quot;Minh beo chuyen tien tour dao Tripmate&quot;
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 rounded-full bg-white text-black text-xs font-semibold cursor-pointer hover:bg-zinc-100"
            >
              Đã hiểu & Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
