'use client';

import Image from 'next/image';
import { useGsapEffect, gsap } from '@/hooks/useGsap';
import EnvironmentalEffects from '@/components/effects/EnvironmentalEffects';
import GooglePlayButton from '@/components/GooglePlayButton';
import { 
  Snowflake, 
  Camera, 
  Heart, 
  MapPin, 
  Film, 
  Zap, 
  Crosshair, 
  Music, 
  Check, 
  QrCode,
  Flame
} from 'lucide-react';

interface SeasonWinterChapterProps {
  onOpenDownload: () => void;
}

const memoryScrapbookItems = [
  {
    title: 'Đêm lửa trại đồi cỏ hồng',
    time: '15.12.2026 • 21:30 PM',
    location: 'Đồi Cỏ Hồng, Lạc Dương',
    coords: '12°01\'15.3"N 108°23\'45.0"E',
    image: '/destinations/camping_night.jpg',
    likes: 68,
    tilt: '-rotate-2 group-hover:rotate-0',
    badge: 'Ghost Cam GPS',
  },
  {
    title: 'Bình minh thung lũng sương lạnh',
    time: '16.12.2026 • 05:45 AM',
    location: 'Đồi Chè Cầu Đất, Đà Lạt',
    coords: '11°51\'40.1"N 108°33\'12.5"E',
    image: '/destinations/dalat.jpg',
    likes: 54,
    tilt: 'rotate-2 group-hover:rotate-0',
    badge: 'Ảnh gốc 4K',
  },
  {
    title: 'Hoàng hôn vịnh ngọc mùa đông',
    time: '18.12.2026 • 16:40 PM',
    location: 'Vịnh Hạ Long, Quảng Ninh',
    coords: '20°54\'35.0"N 107°04\'12.0"E',
    image: '/destinations/halong.jpg',
    likes: 72,
    tilt: '-rotate-1 group-hover:rotate-0',
    badge: 'Recap Video',
  },
];

export default function SeasonWinterChapter({ onOpenDownload }: SeasonWinterChapterProps) {
  const containerRef = useGsapEffect<HTMLElement>((target, _ctx, isReduced) => {
    if (isReduced) return;

    gsap.from('.winter-reveal', {
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
      id="season-winter"
      ref={containerRef}
      className="relative py-20 md:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 overflow-hidden"
    >
      {/* Dynamic Multi-depth Snowfall Canvas Layer */}
      <EnvironmentalEffects effect="winter" intensity="medium" className="z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seasonal Chapter Master Banner */}
        <div className="winter-reveal relative rounded-[2.5rem] overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 text-white p-8 sm:p-12 mb-16 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <Image
              src="/destinations/season_winter.jpg"
              alt="Mùa đông đỉnh núi tuyết trắng phủ hùng vĩ"
              fill
              priority
              sizes="100vw"
              className="object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 backdrop-blur-md text-sky-300 border border-sky-400/30 text-xs font-semibold mb-4">
              <Snowflake className="w-3.5 h-3.5 text-sky-400" />
              <span>CHẶNG 04: MÙA ĐÔNG • LỬA TRẠI & LƯU GIỮ KỶ NIỆM VÔ GIÁ</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-[1.15]">
              Đông Tuyết Phủ. Kỷ Niệm Thanh Xuân Không Bao Giờ Phai.
            </h2>
            <p className="text-base sm:text-lg text-zinc-200 font-normal leading-relaxed mb-6">
              Chinh phục đỉnh tuyết Fansipan rét buốt hay quây quần bên bếp lửa trại đồi thông. TripMate tự động gom trọn kho ảnh chất lượng gốc của cả nhóm, khóa bằng tọa độ GPS độc quyền và tự động tạo video recap Story để bạn sống trọn từng khoảnh khắc thanh xuân vô giá.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white">
                📍 Fansipan - Mẫu Sơn - Đà Lạt Đông
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-amber-300 font-mono">
                ❄️ 11°C · Sương tuyết & Lửa trại
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-emerald-300">
                ✓ Lưu ảnh gốc 4K không nén
              </span>
            </div>
          </div>
        </div>

        {/* Feature 1: Digital Scrapbook Grid */}
        <div className="winter-reveal mb-16">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 mb-2">
              <Camera className="w-3.5 h-3.5 text-[#F95738]" />
              <span>DIGITAL TRAVEL SCRAPBOOK</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
              Kho ảnh chung của cả nhóm. Quên đi cảnh xin ảnh qua Zalo bị nén.
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              TripMate tự động gom ảnh mọi người đã chụp trong chuyến đi, gắn tọa độ GPS và dòng thời gian chân thực.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {memoryScrapbookItems.map((item, idx) => (
              <div
                key={idx}
                className={`group relative p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-md hover:shadow-xl transition-all duration-300 ${item.tilt}`}
              >
                {/* Washi tape accent */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-4 rounded-sm bg-zinc-200/80 dark:bg-zinc-800/90 border border-zinc-300/60 dark:border-zinc-700/60 backdrop-blur-xs rotate-1 pointer-events-none" />

                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-950 mb-3.5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white border border-white/20">
                    {item.badge}
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-1 border border-white/20">
                    <Heart className="w-3 h-3 text-[#F95738] fill-current" />
                    <span>{item.likes}</span>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-zinc-950 dark:text-white mb-1">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium">
                    <MapPin className="w-3 h-3 text-[#F95738]" />
                    {item.location}
                  </span>
                  <span className="font-mono text-[11px]">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature 2: Ghost Cam GPS Viewfinder HUD */}
        <div className="winter-reveal grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-20">
          <div className="lg:col-span-7 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 p-6 sm:p-8 shadow-sm">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 mb-3.5">
              <Zap className="w-3.5 h-3.5 text-[#F95738]" />
              <span>TÍNH NĂNG ĐỘC QUYỀN: GHOST CAM</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white mb-3">
              Ảnh khoảnh khắc mở khóa theo tọa độ GPS nhóm
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 font-normal">
              Lấy cảm hứng từ văn hóa Locket: TripMate tạo ra những khung hình bí mật. Cả nhóm phải cùng có mặt tại đúng tọa độ đỉnh núi hoặc quán cà phê thì mới mở khóa được ống kính chụp ảnh kỷ niệm độc quyền.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-zinc-800/50 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs mb-2">
                  4K
                </div>
                <h4 className="text-sm font-semibold text-zinc-950 dark:text-white mb-1">Chất lượng gốc Ultra HD</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Không nén ảnh, tải về nguyên vẹn chi tiết từng khung hình kỷ niệm.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-zinc-800/50 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs mb-2">
                  <Film className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-950 dark:text-white mb-1">Xuất video Recap 1 chạm</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Ghép toàn bộ ảnh thành video recap ngắn kèm nhạc chill để đăng Story.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Ghost Cam HUD Canvas */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 shadow-2xl">
              <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden">
                <Image
                  src="/destinations/friends_roadtrip.jpg"
                  alt="Khoảnh khắc phượt mở khóa Ghost Cam"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/60 pointer-events-none" />

                {/* Viewfinder Brackets */}
                <div className="absolute inset-4 sm:inset-6 pointer-events-none flex flex-col justify-between">
                  <div className="flex items-center justify-between text-white/80">
                    <div className="w-5 h-5 border-t-2 border-l-2 border-white/60" />
                    <div className="w-5 h-5 border-t-2 border-r-2 border-white/60" />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-dashed border-white/40 flex items-center justify-center">
                      <Crosshair className="w-4 h-4 text-[#F95738]" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <div className="w-5 h-5 border-b-2 border-l-2 border-white/60" />
                    <div className="w-5 h-5 border-b-2 border-r-2 border-white/60" />
                  </div>
                </div>

                {/* Top Telemetry */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>REC 00:04:18</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] text-amber-300">
                    GPS LOCK • 11°58&apos;32&quot;N
                  </div>
                </div>

                {/* Center Badge */}
                <div className="absolute top-14 left-4 right-4 flex justify-center pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Ghost Cam Đã Kích Hoạt • 4/4 bạn đã có mặt</span>
                  </div>
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/20 text-white flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-[#F95738] flex items-center justify-center text-white">
                        <Camera className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-semibold text-white">Đồi Đa Phú • Đà Lạt</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">15.12.2026</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-300 pt-1 border-t border-white/10">
                    <div className="flex items-center gap-1.5 truncate">
                      <Music className="w-3 h-3 text-[#F95738] shrink-0" />
                      <span className="truncate">Vũ. - Bước Qua Mùa Cô Đơn</span>
                    </div>
                    <div className="flex items-center -space-x-1.5 shrink-0 pl-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center border border-black">T</span>
                      <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center border border-black">L</span>
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center border border-black">N</span>
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center border border-black">M</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Warm Campfire Night & Final App Download Call to Action */}
        <div className="winter-reveal relative overflow-hidden rounded-[2.5rem] bg-zinc-950 text-white p-8 sm:p-14 lg:p-16 shadow-2xl border border-zinc-800">
          <div className="absolute inset-0 z-0">
            <Image
              src="/destinations/camping_night.jpg"
              alt="Đêm cắm trại ấm cúng bên ánh lửa mùa đông"
              fill
              sizes="100vw"
              className="object-cover opacity-35 filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50" />
          </div>

          <div className="relative z-20 flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-700 bg-black/60 backdrop-blur-md text-zinc-200 text-xs font-semibold mb-6">
              <Flame className="w-3.5 h-3.5 text-[#F95738]" />
              <span>BẮT ĐẦU CHUYẾN ĐI 4 MÙA MIỄN PHÍ</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] mb-4 text-white">
              Sẵn sàng cho chuyến du lịch cùng hội bạn thân?
            </h2>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed mb-8 font-normal">
              Tải TripMate ngay hôm nay. Lên lịch trình, tính tiền sòng phẳng và lưu lại từng kỷ niệm vô giá của tuổi thanh xuân qua cả 4 mùa.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenDownload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold bg-white text-zinc-950 hover:bg-zinc-100 shadow-sm transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Quét mã tải app ngay</span>
              </button>

              <GooglePlayButton size="lg" className="w-full sm:w-auto justify-center" />
            </div>

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
