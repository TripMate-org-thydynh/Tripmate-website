'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGsapEffect, gsap } from '@/hooks/useGsap';
import EnvironmentalEffects from '@/components/effects/EnvironmentalEffects';
import { 
  Flower2, 
  Sparkles, 
  Bot, 
  Calendar, 
  MapPin, 
  Check, 
  CheckCircle2, 
  Send, 
  Lightbulb, 
  Navigation, 
  Users, 
  QrCode, 
  Link2, 
  Luggage
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
    id: 'sapa',
    title: 'Sa Pa - Mộc Châu Hoa Đào (3N2Đ)',
    vibe: 'Du xuân & Săn mây',
    locationName: 'Sa Pa • Thung lũng Mường Hoa',
    image: '/destinations/season_spring.jpg',
    weather: '🌸 18°C · Nắng nhẹ hoa đào nở',
    matchScore: '94%',
    prompt: 'Nhóm 6 bạn thân đi du xuân đầu năm, thích săn mây Ô Long, ngắm hoa đào Sa Pa và ăn lẩu cá hồi.',
    response: {
      days: '3 Ngày 2 Đêm',
      budget: '~2.800.000đ / người',
      highlights: [
        'Ngày 1: Check-in đồi chè Ô Long săn hoa anh đào → Bản Tả Phìn yên bình.',
        'Ngày 2: Chinh phục đỉnh Fansipan săn biển mây bồng bềnh → Lẩu cá hồi sưởi ấm đêm lạnh.',
        'Ngày 3: Dạo chợ phiên Sa Pa mua mầm đá, đồ thổ cẩm đặc sản mang về.',
      ],
      aiTip: 'Đã xếp lịch đi đồi chè Ô Long lúc 07:00 sáng để bắt trọn tia nắng sớm xuyên qua sương mây.',
    },
    stops: [
      { time: '07:00', title: 'Đón bình minh đồi chè Ô Long', category: 'Săn ảnh', desc: 'Hoa mai anh đào nở rực rỡ xen kẽ đồi chè xanh mướt' },
      { time: '11:30', title: 'Cơm lam gà đồi Bản Cát Cát', category: 'Ăn trưa', desc: 'Thưởng thức ẩm thực người H\'Mông chuẩn vị vùng cao' },
      { time: '14:30', title: 'Cáp treo Fansipan chạm nóc Đông Dương', category: 'Trải nghiệm', desc: 'Biển mây tầng tầng lớp lớp dưới chân tượng Phật' },
      { time: '19:00', title: 'Lẩu cá hồi & Thắng cố chợ đêm', category: 'Ăn tối', desc: 'Ngồi bên nồi lẩu nghi ngút khói giữa trời rét 14°C' },
    ],
  },
  {
    id: 'danang',
    title: 'Đà Nẵng - Hội An (3N2Đ)',
    vibe: 'Ẩm thực & Sống ảo',
    locationName: 'Đà Nẵng • Phố cổ Hội An',
    image: '/destinations/danang.jpg',
    weather: '☀️ 26°C · Nắng nhẹ biển trong',
    matchScore: '89%',
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
    matchScore: '91%',
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
];

const itineraryDays = [
  {
    day: 1,
    title: 'Ngày 1: Xuất phát, đón sương mai & Check-in đồi hoa',
    items: [
      { time: '07:30', place: 'Tập trung ăn sáng nạp năng lượng', category: 'Ăn uống', note: 'Điểm danh đủ 6 người, kiểm tra balo trước khi lên xe.', attendees: ['Cả nhóm 6 người'] },
      { time: '10:00', place: 'Thung lũng hoa đào Sa Pa', category: 'Sống ảo', note: 'Chụp ảnh bộ ảnh áo dài du xuân mở bát đầu năm.', attendees: ['Linh', 'Trúc', 'Nam', 'An'] },
      { time: '14:30', place: 'Check-in homestay nhà gỗ view núi', category: 'Nghỉ ngơi', note: 'Nhận phòng, pha ấm trà nóng ngắm sương mù trôi qua ban công.', attendees: ['Cả nhóm'] },
      { time: '18:30', place: 'Lẩu cá tầm & Rượu táo mèo', category: 'Ăn tối', note: 'Chốt tiền ăn tối, chia đều ngay trên app TripMate.', attendees: ['Cả nhóm 6 người'] },
    ],
  },
  {
    day: 2,
    title: 'Ngày 2: Săn mây Fansipan & Tiệc nướng ngoài trời',
    items: [
      { time: '06:00', place: 'Săn mây đèo Ô Quy Hồ', category: 'Trải nghiệm', note: 'Đón bình minh tại một trong tứ đại đỉnh đèo.', attendees: ['Cả nhóm'] },
      { time: '11:30', place: 'Gà nướng mắc khén & Cơm lam', category: 'Ăn trưa', note: 'Ăn trưa bản địa chuẩn hương vị Tây Bắc.', attendees: ['Cả nhóm'] },
      { time: '16:00', place: 'Dựng lều cắm trại thung lũng', category: 'Camping', note: 'Chuẩn bị củi khô nướng ngô, khoai và chơi Uno.', attendees: ['Tuấn', 'Nam', 'Minh'] },
    ],
  },
];

export default function SeasonSpringChapter() {
  const [selectedPreset, setSelectedPreset] = useState<PromptPreset>(promptPresets[0]);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [packingList, setPackingList] = useState([
    { id: 1, name: 'Áo khoác ấm & Khăn len', assignee: 'Mỗi người', checked: true },
    { id: 2, name: 'Thuốc chống say xe & Dầu gió', assignee: 'Mai Linh', checked: true },
    { id: 3, name: 'Loa Bluetooth chống nước', assignee: 'Anh Tuấn', checked: true },
    { id: 4, name: 'Bộ bài Uno & Ma Sói', assignee: 'Thanh Trúc', checked: false },
    { id: 5, name: 'Máy ảnh film & Pin dự phòng', assignee: 'Hoàng Nam', checked: true },
  ]);

  const togglePacking = (id: number) => {
    setPackingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const containerRef = useGsapEffect<HTMLElement>((target, _ctx, isReduced) => {
    if (isReduced) return;

    gsap.from('.spring-reveal', {
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

  const checkedCount = packingList.filter((i) => i.checked).length;
  const progressPercent = Math.round((checkedCount / packingList.length) * 100);

  return (
    <section
      id="season-spring"
      ref={containerRef}
      className="relative py-20 md:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 overflow-hidden"
    >
      {/* Dynamic Spring Blossom Canvas Effect Layer */}
      <EnvironmentalEffects effect="spring" intensity="medium" className="z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seasonal Chapter Master Banner */}
        <div className="spring-reveal relative rounded-[2.5rem] overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 text-white p-8 sm:p-12 mb-16 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <Image
              src="/destinations/season_spring.jpg"
              alt="Mùa xuân Sa Pa hoa đào nở rộ"
              fill
              priority
              sizes="100vw"
              className="object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 backdrop-blur-md text-rose-300 border border-rose-400/30 text-xs font-semibold mb-4">
              <Flower2 className="w-3.5 h-3.5 text-rose-400" />
              <span>CHẶNG 01: MÙA XUÂN • KHỞI ĐẦU & LẬP KẾ HOẠCH ĐỒNG ĐỘI</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-[1.15]">
              Xuân Về Hoa Đào Nở. Khởi Hành Chuyến Đi Đầu Năm.
            </h2>
            <p className="text-base sm:text-lg text-zinc-200 font-normal leading-relaxed mb-6">
              Mùa của những chuyến du xuân mở bát, săn mây Tây Bắc và vi vu hoa đào Sa Pa. TripMate ra đời để biến khâu lên kế hoạch nặng nề thành trải nghiệm thú vị: cả nhóm cùng vote địa điểm, AI gợi ý lịch trình thông minh, phân chia đồ đạc sòng phẳng ngay từ ngày đầu xuất phát.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white">
                📍 Sa Pa - Mộc Châu - Hà Giang
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-amber-300 font-mono">
                🌸 18°C · Nắng nhẹ sương mây
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-emerald-300">
                ✓ Đồng bộ kế hoạch thời gian thực
              </span>
            </div>
          </div>
        </div>

        {/* Feature 1: Intelligent AI Travel Assistant */}
        <div className="spring-reveal mb-20">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 mb-2">
              <Bot className="w-3.5 h-3.5 text-[#F95738]" />
              <span>TRỢ LÝ AI LẬP KẾ HOẠCH</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
              Lên lịch trình du xuân chuẩn gu nhóm chỉ trong 10 giây
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Không cần tốn hàng giờ tra Google Maps hay lo kẹt xe, ngược đường. Nhập mong muốn của nhóm, AI tự động sắp xếp tuyến đường và gợi ý ngân sách.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Preset Switcher & AI Chat Box */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 p-6 sm:p-7 shadow-sm">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block mb-2.5">
                  Bấm thử câu lệnh AI mẫu theo cung đường:
                </span>
                <div className="flex flex-wrap gap-2 mb-4">
                  {promptPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPreset(preset)}
                      className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                        selectedPreset.id === preset.id
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                          : 'bg-white dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/80 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>

                {/* Chat Simulated Box */}
                <div className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 flex items-center justify-between gap-3 mb-5 shadow-xs">
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
                <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
                        AI
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-zinc-950 dark:text-white">TripMate AI gợi ý:</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                      Hợp gu {selectedPreset.matchScore}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 mb-4">
                    {selectedPreset.response.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-300 flex items-start gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-[#F95738] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{selectedPreset.response.aiTip}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Authentic Destination Imagery & Dynamic Stops */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 shadow-xl">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={selectedPreset.image}
                    alt={selectedPreset.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover transition-all duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#F95738]" />
                      {selectedPreset.locationName}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-xs font-mono">
                      {selectedPreset.weather}
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                    <div>
                      <span className="text-[10px] font-mono text-white/80 block">LỘ TRÌNH ĐỀ XUẤT</span>
                      <h4 className="text-base font-bold text-white">{selectedPreset.title}</h4>
                    </div>
                    <span className="text-xs font-mono font-semibold text-emerald-300">
                      Ví dụ: {selectedPreset.response.budget}
                    </span>
                  </div>
                </div>

                {/* Stops */}
                <div className="p-5 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-zinc-900 dark:text-white">
                      <Navigation className="w-3.5 h-3.5 text-[#F95738]" />
                      Tuyến đường thuận tiện nhất
                    </span>
                    <span className="font-mono text-[11px]">{selectedPreset.stops.length} điểm dừng</span>
                  </div>

                  {selectedPreset.stops.map((stop, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 flex items-start gap-2.5"
                    >
                      <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-mono text-[10px] font-semibold mt-0.5">
                        {stop.time}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs font-semibold text-zinc-950 dark:text-white truncate">
                            {stop.title}
                          </h5>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 shrink-0">
                            {stop.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                          {stop.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Collaborative Timeline & Packing Checklist */}
        <div className="spring-reveal">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 mb-2">
              <Calendar className="w-3.5 h-3.5 text-[#F95738]" />
              <span>LỊCH TRÌNH ĐỒNG ĐỘI & HÀNH LÝ</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
              Cả nhóm cùng chuẩn bị. Không ai phải gánh team một mình.
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Mỗi người đảm nhận một phần hành lý, ai làm xong tick liền tay. Lịch trình chi tiết từng giờ giúp cả hội xuất phát đúng giờ mà không phải réo gọi từng phút.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Timeline Days */}
            <div className="lg:col-span-7 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80 mb-4">
                {itineraryDays.map((day, idx) => (
                  <button
                    key={day.day}
                    type="button"
                    onClick={() => setActiveDayIdx(idx)}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      activeDayIdx === idx
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                        : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60'
                    }`}
                  >
                    Ngày {day.day}
                  </button>
                ))}
              </div>

              <h4 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white mb-3">
                {itineraryDays[activeDayIdx].title}
              </h4>

              <div className="flex flex-col gap-2.5">
                {itineraryDays[activeDayIdx].items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 flex items-start gap-3 shadow-xs"
                  >
                    <div className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-xs font-semibold shrink-0">
                      {item.time}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs sm:text-sm font-semibold text-zinc-950 dark:text-white">
                          {item.place}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-1.5">
                        {item.note}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                        <Users className="w-3 h-3 text-[#F95738]" />
                        <span>{item.attendees.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Packing List & Live Squad Join */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Packing Checklist */}
              <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 p-6 sm:p-7 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Luggage className="w-4 h-4 text-[#F95738]" />
                    <h4 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-white">
                      Checklist Đồ Du Xuân Nhóm
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                    {checkedCount}/{packingList.length} ({progressPercent}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mb-4">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  {packingList.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => togglePacking(item.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        item.checked
                          ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700/80'
                          : 'bg-white/60 dark:bg-zinc-900/40 border-dashed border-zinc-300 dark:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded flex items-center justify-center text-white ${
                          item.checked ? 'bg-emerald-500' : 'border border-zinc-300 dark:border-zinc-600'
                        }`}>
                          {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`text-xs font-medium ${
                          item.checked ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'
                        }`}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {item.assignee}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Squad Realtime Join Banner */}
              <div className="relative h-44 w-full overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 shadow-md">
                <Image
                  src="/destinations/hanoi_street.jpg"
                  alt="Nhóm bạn chuẩn bị xuất phát"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>6 bạn đang online trong chuyến đi</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-mono">
                    Cloud Sync
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <Link2 className="w-3.5 h-3.5 text-[#F95738] shrink-0" />
                    <span className="text-[11px] font-mono text-zinc-300 truncate">tripmate.app/join/sapa-xuan-2026</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-white text-zinc-950 text-[11px] font-bold shrink-0 flex items-center gap-1 shadow-xs">
                    <QrCode className="w-3 h-3" />
                    <span>Quét mã</span>
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
