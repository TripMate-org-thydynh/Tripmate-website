'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGsapEffect, gsap } from '@/hooks/useGsap';
import { 
  Bot, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Lightbulb,
  MapPin,
  Clock,
  Navigation,
  ArrowRight
} from 'lucide-react';

interface RouteStop {
  time: string;
  title: string;
  category: string;
  desc: string;
}

interface PromptPreset {
  id: string;
  title: string;
  vibe: string;
  locationName: string;
  image: string;
  weather: string;
  matchScore: string;
  prompt: string;
  response: {
    days: string;
    budget: string;
    highlights: string[];
    aiTip: string;
  };
  stops: RouteStop[];
}

const promptPresets: PromptPreset[] = [
  {
    id: 'danang',
    title: 'Đà Nẵng - Hội An (3N2Đ)',
    vibe: 'Ẩm thực & Sống ảo',
    locationName: 'Đà Nẵng • Phố cổ Hội An',
    image: '/destinations/danang.jpg',
    weather: '☀️ 28°C · Nắng nhẹ biển êm',
    matchScore: '94%',
    prompt: 'Nhóm 4 bạn thân mê đồ ăn đường phố, thích ngắm hoàng hôn và có ngân sách 3.5 triệu/người.',
    response: {
      days: '3 Ngày 2 Đêm',
      budget: '~3.200.000đ / người',
      highlights: [
        'Ngày 1: Bánh tráng cuốn thịt heo Đại Lộc → Cầu Rồng phun lửa lúc 21:00.',
        'Ngày 2: Chèo thuyền thúng Rừng dừa Bảy Mẫu → Phố cổ Hội An đèn lồng lung linh.',
        'Ngày 3: Đón bình minh bãi biển Mỹ Khê → Mua chả bò đặc sản trứ danh mang về.',
      ],
      aiTip: 'Đã sắp xếp thứ tự di chuyển theo tuyến ven biển để nhóm không bị kẹt xe vào giờ cao điểm.',
    },
    stops: [
      { time: '08:00', title: 'Bánh tráng cuốn thịt heo Đại Lộc', category: 'Ăn sáng', desc: 'Món tủ dân bản địa, cuốn chấm mắm nêm đậm đà' },
      { time: '14:30', title: 'Thuyền thúng Rừng Dừa Bảy Mẫu', category: 'Trải nghiệm', desc: 'Múa thúng xoay vòng, câu cua cực vui' },
      { time: '18:30', title: 'Phố cổ Hội An & Thả hoa đăng', category: 'Check-in', desc: 'Thưởng thức cao lầu, dạo ngắm đèn lồng' },
      { time: '21:00', title: 'Cầu Rồng Đà Nẵng phun lửa', category: 'Sự kiện', desc: 'Ngắm cầu Rồng phun lửa và nước cuối tuần' },
    ],
  },
  {
    id: 'dalat',
    title: 'Đà Lạt Săn Mây (2N1Đ)',
    vibe: 'Chill & Camping',
    locationName: 'Đà Lạt • Đồi Chè Cầu Đất',
    image: '/destinations/dalat.jpg',
    weather: '⛅ 16°C · Sương sớm se lạnh',
    matchScore: '88%',
    prompt: 'Nhóm 6 người muốn dậy sớm săn mây đồi chè, tối đốt lửa trại BBQ, gu tiết kiệm sinh viên.',
    response: {
      days: '2 Ngày 1 Đêm',
      budget: '~1.800.000đ / người',
      highlights: [
        'Ngày 1: Thuê xe máy dạo Hồ Xuân Hương → BBQ cắm trại đồi cỏ hồng ngắm hoàng hôn.',
        'Ngày 2: 04:30 săn mây Cầu Đất → Cà phê Túi Mơ To → Lẩu gà lá é Tao Ngộ.',
      ],
      aiTip: 'Nhắc nhở mang thêm áo ấm dày vì nhiệt độ ban đêm đồi thông hạ xuống 13°C.',
    },
    stops: [
      { time: '04:30', title: 'Săn mây Đồi Chè Cầu Đất', category: 'Check-in', desc: 'Đón bình minh trên thảm mây bồng bềnh' },
      { time: '09:00', title: 'Tiệm Cà Phê Túi Mơ To', category: 'Cà phê', desc: 'Chụp hình cúc họa mi, ngắm thung lũng' },
      { time: '15:30', title: 'Camping & BBQ Đồi Cỏ Hồng', category: 'Trải nghiệm', desc: 'Dựng lều, nhóm củi, đốt lửa nướng thịt' },
      { time: '19:30', title: 'Lẩu gà lá é Tao Ngộ', category: 'Ăn tối', desc: 'Nồi lẩu chua cay ấm lòng đêm cao nguyên' },
    ],
  },
  {
    id: 'phuquoc',
    title: 'Phú Quốc Chill (4N3Đ)',
    vibe: 'Nghỉ dưỡng & Biển',
    locationName: 'Phú Quốc • Bãi Sao & An Thới',
    image: '/destinations/phuquoc.jpg',
    weather: '🌅 29°C · Biển ngọc xanh ngắt',
    matchScore: '92%',
    prompt: 'Nhóm 5 người đi xả stress sau thi cử, không chạy show nhiều điểm, thích ngắm hoàng hôn bãi biển.',
    response: {
      days: '4 Ngày 3 Đêm',
      budget: '~5.500.000đ / người',
      highlights: [
        'Ngày 1: Check-in resort Bãi Dài → Sunset Sanato thưởng thức cocktail chiều.',
        'Ngày 2: Tour cano lặn ngắm san hô Hòn Móng Tay → Hải sản Chợ đêm Dinh Cậu.',
        'Ngày 3: Bãi Sao thư giãn tắm biển → Thưởng thức ghẹ Hàm Ninh tươi sống.',
        'Ngày 4: Thưởng thức bún quậy Kiến Xây chuẩn vị trước khi ra sân bay.',
      ],
      aiTip: 'Lịch trình giãn cách 3 tiếng mỗi điểm để nhóm có trọn vẹn thời gian nghỉ ngơi thoải mái.',
    },
    stops: [
      { time: '09:00', title: 'Tour cano 3 đảo lặn ngắm san hô', category: 'Trải nghiệm', desc: 'Lặn ngắm rạn san hô tự nhiên đẹp nhất đảo ngọc' },
      { time: '16:30', title: 'Ngắm hoàng hôn Sunset Sanato', category: 'Check-in', desc: 'Sống ảo tượng nghệ thuật & cocktail bãi biển' },
      { time: '19:00', title: 'Chợ đêm Dinh Cậu Phú Quốc', category: 'Ăn uống', desc: 'Thưởng thức nhum nướng mỡ hành, ghẹ hấp' },
      { time: '21:30', title: 'Chill bar bãi biển bến tàu', category: 'Thư giãn', desc: 'Nghe nhạc sóng vỗ rì rào bên bạn thân' },
    ],
  },
];

export default function AiAssistantSection() {
  const [selectedPreset, setSelectedPreset] = useState<PromptPreset>(promptPresets[0]);

  const containerRef = useGsapEffect<HTMLElement>((target, _ctx, isReduced) => {
    if (isReduced) return;

    gsap.from('.ai-card-anim', {
      scrollTrigger: {
        trigger: target,
        start: 'top 75%',
      },
      y: 30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power2.out',
    });
  }, []);

  return (
    <section
      id="ai"
      ref={containerRef}
      className="py-20 md:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 mb-3.5">
            <Bot className="w-3.5 h-3.5 text-[#F95738]" />
            <span>05. TRỢ LÝ DU LỊCH AI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4">
            Lên kế hoạch chuẩn gu nhóm chỉ trong 10 giây.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
            Không cần tốn hàng giờ tra cứu từng quán ăn hay lo ngại cung đường ngược nhau. Nói cho TripMate AI biết nhóm bạn thích gì và ngân sách bao nhiêu - AI sẽ đề xuất lộ trình phù hợp nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive AI Prompt Simulation */}
          <div className="lg:col-span-7 ai-card-anim flex flex-col gap-6">
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30 p-6 sm:p-8 shadow-sm">
              {/* Presets Bar (Pill buttons) */}
              <div className="mb-5">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block mb-2.5">
                  Bấm chọn thử nghiệm câu lệnh AI mẫu:
                </span>
                <div className="flex flex-wrap gap-2">
                  {promptPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPreset(preset)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                        selectedPreset.id === preset.id
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                          : 'bg-white dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/80 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Simulated Box */}
              <div className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 flex items-center justify-between gap-3 mb-6 shadow-xs">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Sparkles className="w-4 h-4 text-[#F95738] shrink-0" />
                  <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 truncate font-medium">
                    &quot;{selectedPreset.prompt}&quot;
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* AI Response Card */}
              <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 shadow-xs">
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
                      AI
                    </div>
                    <span className="text-sm font-semibold text-zinc-950 dark:text-white">TripMate AI gợi ý:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      Hợp gu {selectedPreset.matchScore}
                    </span>
                    <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {selectedPreset.response.budget}
                    </span>
                  </div>
                </div>

                {/* Day highlights */}
                <div className="flex flex-col gap-2.5 mb-5">
                  {selectedPreset.response.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* AI Tip Callout */}
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-300 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-[#F95738] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{selectedPreset.response.aiTip}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Travel Photo Canvas & Live Route Card (No Phone Mockup) */}
          <div className="lg:col-span-5 ai-card-anim flex flex-col gap-4">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 shadow-xl">
              {/* Authentic Destination Imagery */}
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={selectedPreset.image}
                  alt={selectedPreset.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

                {/* Badges on Destination Photo */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 shadow-xs">
                    <MapPin className="w-3 h-3 text-[#F95738]" />
                    {selectedPreset.locationName}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-xs font-mono font-medium border border-white/15">
                    {selectedPreset.weather}
                  </span>
                </div>

                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                  <div>
                    <span className="text-[11px] font-mono text-white/80 block">LỘ TRÌNH ĐỀ XUẤT</span>
                    <h4 className="text-lg font-bold tracking-tight text-white">{selectedPreset.title}</h4>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-white text-xs font-bold shadow-xs">
                    {selectedPreset.matchScore} HỢP GU
                  </div>
                </div>
              </div>

              {/* Step-by-Step Route Checkpoints */}
              <div className="p-5 sm:p-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-3.5">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5 text-zinc-900 dark:text-white font-medium">
                    <Navigation className="w-3.5 h-3.5 text-[#F95738]" />
                    Cung đường thuận tiện không vòng vèo
                  </span>
                  <span className="font-mono text-[11px]">{selectedPreset.stops.length} chặng dừng</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {selectedPreset.stops.map((stop, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 flex items-start gap-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/70"
                    >
                      <div className="px-2 py-1 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-mono text-[11px] font-semibold shrink-0 mt-0.5">
                        {stop.time}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <h5 className="text-xs sm:text-sm font-semibold text-zinc-950 dark:text-white truncate">
                            {stop.title}
                          </h5>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 shrink-0">
                            {stop.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                          {stop.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Export / Quick Sync Bar */}
                <div className="pt-2 flex items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <Clock className="w-3 h-3" />
                    Tiết kiệm ~3.5 giờ tra cứu
                  </span>
                  <a
                    href="#planning"
                    className="inline-flex items-center gap-1 font-semibold text-zinc-950 dark:text-white hover:text-[#F95738] transition-colors"
                  >
                    <span>Xem lịch trình chi tiết</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
