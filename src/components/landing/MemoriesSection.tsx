'use client';

import Image from 'next/image';
import { useGsapEffect, gsap } from '@/hooks/useGsap';
import { 
  Camera, 
  Heart, 
  MapPin, 
  Film,
  Zap,
  Crosshair,
  Music,
  Check
} from 'lucide-react';

const memoryScrapbookItems = [
  {
    title: 'Bình minh thung lũng sương mù',
    time: '14.10.2026 • 05:45 AM',
    location: 'Đồi Chè Cầu Đất, Đà Lạt',
    coords: '11°51\'40.1"N 108°33\'12.5"E',
    image: '/destinations/dalat.jpg',
    likes: 48,
    tilt: '-rotate-2 group-hover:rotate-0',
    type: 'polaroid',
    badge: 'Mở khóa GPS',
  },
  {
    title: 'Đêm lửa trại đồi cỏ hồng',
    time: '15.10.2026 • 21:30 PM',
    location: 'Đồi Cỏ Hồng, Lạc Dương',
    coords: '12°01\'15.3"N 108°23\'45.0"E',
    image: '/destinations/camping_night.jpg',
    likes: 62,
    tilt: 'rotate-2 group-hover:rotate-0',
    type: 'polaroid',
    badge: 'Ghost Cam',
  },
  {
    title: 'Chèo thuyền vịnh ngọc hoàng hôn',
    time: '16.10.2026 • 16:20 PM',
    location: 'Vịnh Hạ Long, Quảng Ninh',
    coords: '20°54\'35.0"N 107°04\'12.0"E',
    image: '/destinations/halong.jpg',
    likes: 54,
    tilt: '-rotate-1 group-hover:rotate-0',
    type: 'polaroid',
    badge: 'Ảnh gốc 4K',
  },
];

export default function MemoriesSection() {
  const containerRef = useGsapEffect<HTMLElement>((target, _ctx, isReduced) => {
    if (isReduced) return;

    // Scrub parallax for scrapbook drift
    gsap.from('.scrapbook-card', {
      scrollTrigger: {
        trigger: target,
        start: 'top 80%',
      },
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
    });
  }, []);

  return (
    <section
      id="memories"
      ref={containerRef}
      className="py-20 md:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#0A0A0D] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-xs mb-3.5">
            <Camera className="w-3.5 h-3.5 text-[#F95738]" />
            <span>04. DIGITAL TRAVEL SCRAPBOOK & KỶ NIỆM NHÓM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4">
            Ảnh chất lượng gốc. Kỷ niệm thanh xuân không bao giờ trôi.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
            Quên đi cảnh xin ảnh qua Zalo bị nén mờ hay Google Drive hết dung lượng. TripMate tự động gom trọn kho ảnh của cả nhóm, sắp xếp theo dòng thời gian và gắn tọa độ GPS chân thực.
          </p>
        </div>

        {/* Digital Travel Scrapbook Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {memoryScrapbookItems.map((item, idx) => (
            <div
              key={idx}
              className={`scrapbook-card group relative p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-md hover:shadow-xl transition-all duration-300 ${item.tilt}`}
            >
              {/* Washi Tape Accent Simulation */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-sm bg-zinc-200/80 dark:bg-zinc-800/90 border border-zinc-300/60 dark:border-zinc-700/60 backdrop-blur-xs rotate-1 pointer-events-none" />

              {/* Photo Area with zoom on hover */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-950 mb-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                
                {/* Badge Tag */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20">
                  {item.badge}
                </div>

                {/* Heart Reaction */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-1.5 border border-white/20">
                  <Heart className="w-3 h-3 text-[#F95738] fill-current" />
                  <span>{item.likes}</span>
                </div>

                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/80">
                  {item.coords}
                </div>
              </div>

              {/* Scrapbook Captions */}
              <h3 className="text-base font-semibold text-zinc-950 dark:text-white mb-1">
                {item.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#F95738]" />
                  {item.location}
                </span>
                <span className="font-mono text-[11px]">{item.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Spotlight: Ghost Cam & 1-Click Video Recap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Ghost Cam Callout */}
          <div className="lg:col-span-7 scrapbook-card rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 shadow-sm">
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
              <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/70 dark:bg-zinc-800/40 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs mb-2.5">
                  4K
                </div>
                <h4 className="text-sm font-semibold text-zinc-950 dark:text-white mb-1">Chất lượng gốc Ultra HD</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Không nén ảnh, tải về nguyên vẹn chi tiết từng khung hình kỷ niệm.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/70 dark:bg-zinc-800/40 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs mb-2.5">
                  <Film className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-950 dark:text-white mb-1">Xuất video Recap 1 chạm</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Ghép toàn bộ ảnh thành video recap ngắn kèm nhạc chill để đăng Story.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Ghost Cam GPS Viewfinder HUD (No Phone Mockup) */}
          <div className="lg:col-span-5 scrapbook-card flex flex-col gap-4">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 shadow-2xl">
              {/* Real Roadtrip / Friends Travel Photo */}
              <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden">
                <Image
                  src="/destinations/friends_roadtrip.jpg"
                  alt="Khoảnh khắc du lịch nhóm mở khóa qua Ghost Cam TripMate"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                
                {/* Viewfinder Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/60 pointer-events-none" />

                {/* Viewfinder Brackets / HUD Frame */}
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

                {/* Top Viewfinder Telemetry */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>REC 00:04:18</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] text-amber-300">
                    GPS LOCK • 11°58&apos;32&quot;N
                  </div>
                </div>

                {/* Center Badge: Ghost Cam GPS Unlocked */}
                <div className="absolute top-16 left-4 right-4 flex justify-center pointer-events-none">
                  <div className="px-3 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Ghost Cam Đã Kích Hoạt • 4/4 thành viên đã tới điểm</span>
                  </div>
                </div>

                {/* Bottom Overlay Info Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/20 text-white flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#F95738] flex items-center justify-center text-white">
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-white">Đồi Đa Phú • Đà Lạt</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">15.10.2026</span>
                  </div>

                  {/* Audio track & squad presence */}
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
      </div>
    </section>
  );
}
