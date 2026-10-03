'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGsapEffect, gsap } from '@/hooks/useGsap';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Luggage, 
  Sparkles,
  Check,
  QrCode,
  Link2
} from 'lucide-react';

const itineraryDays = [
  {
    day: 1,
    title: 'Ngày 1: Check-in phố hoa & Cà phê sương sớm',
    items: [
      {
        time: '07:30',
        place: 'Bánh ướt lòng gà Long',
        category: 'Ăn sáng',
        note: 'Cả nhóm tập trung ăn sáng nạp năng lượng sau chuyến xe đêm.',
        attendees: ['Nam', 'Linh', 'Trúc', 'Hoàng'],
      },
      {
        time: '09:30',
        place: 'Tiệm Cà Phê Túi Mơ To',
        category: 'Sống ảo',
        note: 'Chụp hình vườn cúc họa mi và ngắm thung lũng view triệu đô.',
        attendees: ['Nam', 'Linh', 'Trúc', 'Hoàng', 'Tuấn', 'An'],
      },
      {
        time: '14:00',
        place: 'Chèo SUP Hồ Tuyền Lâm',
        category: 'Trải nghiệm',
        note: 'Mặc áo phao, chuẩn bị túi chống nước cho điện thoại.',
        attendees: ['Nam', 'Linh', 'Tuấn', 'An'],
      },
      {
        time: '18:30',
        place: 'Lẩu gà lá é Tao Ngộ',
        category: 'Ăn tối',
        note: 'Trời lạnh ăn lẩu nóng hổi, chốt chi phí chia đều ngay tại bàn.',
        attendees: ['Cả nhóm 6 người'],
      },
    ],
  },
  {
    day: 2,
    title: 'Ngày 2: Săn mây Đồi Chè Cầu Đất & Camping hoàng hôn',
    items: [
      {
        time: '04:30',
        place: 'Thảm gỗ săn mây Cầu Đất',
        category: 'Check-in',
        note: 'Dậy sớm ngắm biển mây bồng bềnh và đón tia nắng đầu ngày.',
        attendees: ['Cả nhóm 6 người'],
      },
      {
        time: '11:30',
        place: 'Cơm lam gà nướng đồi thông',
        category: 'Ăn trưa',
        note: 'Thưởng thức đặc sản vùng cao chuẩn vị người bản địa.',
        attendees: ['Cả nhóm 6 người'],
      },
      {
        time: '16:00',
        place: 'Camping đồi cỏ hồng',
        category: 'Trải nghiệm',
        note: 'Dựng lều, đốt lửa trại và chơi board game ma sói đến khuya.',
        attendees: ['Cả nhóm 6 người'],
      },
    ],
  },
  {
    day: 3,
    title: 'Ngày 3: Dạo chợ mua đặc sản & Tổng kết hành trình',
    items: [
      {
        time: '08:30',
        place: 'Quán Cà Phê Vợt Bà Năm',
        category: 'Cà phê',
        note: 'Nhâm nhi cafe vợt truyền thống hơn 50 năm tuổi.',
        attendees: ['Nam', 'Trúc', 'Linh'],
      },
      {
        time: '10:00',
        place: 'Chợ Đà Lạt',
        category: 'Mua sắm',
        note: 'Mua dâu tây tươi, mứt atiso và bánh tráng nướng mang về.',
        attendees: ['Cả nhóm 6 người'],
      },
      {
        time: '14:00',
        place: 'Homestay Check-out & Settle Bill',
        category: 'Quyết toán',
        note: 'Quay vòng quay dọn phòng, mở TripMate quét VietQR chốt sổ!',
        attendees: ['Cả nhóm 6 người'],
      },
    ],
  },
];

export default function PlanningSection() {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [packingItems, setPackingItems] = useState([
    { id: 1, name: 'Loa Bluetooth chống nước', assignee: 'Tuấn', checked: true },
    { id: 2, name: 'Hộp thuốc sơ cứu & urgo', assignee: 'Linh', checked: true },
    { id: 3, name: 'Máy ảnh film & 3 cuộn film', assignee: 'Nam', checked: false },
    { id: 4, name: 'Boardgame Uno & Ma Sói', assignee: 'Trúc', checked: true },
    { id: 5, name: 'Áo khoác gió ấm cho cả nhóm', assignee: 'Mỗi người', checked: true },
  ]);

  const toggleCheck = (id: number) => {
    setPackingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const containerRef = useGsapEffect<HTMLElement>((target, _ctx, isReduced) => {
    if (isReduced) return;

    gsap.from('.plan-card-anim', {
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

  const activeDay = itineraryDays[activeDayIndex];
  const checkedCount = packingItems.filter((i) => i.checked).length;
  const progressPercent = Math.round((checkedCount / packingItems.length) * 100);

  return (
    <section
      id="planning"
      ref={containerRef}
      className="py-20 md:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 mb-3.5">
            <Calendar className="w-3.5 h-3.5 text-[#F95738]" />
            <span>01. LẬP LỊCH TRÌNH ĐỒNG ĐỘI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4">
            Cả nhóm cùng lên kế hoạch. Không ai phải gánh team một mình.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
            Mỗi người một ý tưởng, vote nhanh điểm đến yêu thích và đồng bộ lịch trình thời gian thực. Ai cũng nắm rõ giờ giấc xuất phát mà không cần nhắn tin réo gọi từng phút.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Day-by-Day Timeline Planner */}
          <div className="lg:col-span-7 plan-card-anim rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30 p-6 sm:p-8 shadow-sm">
            {/* Day Selector Segmented Tabs */}
            <div className="flex items-center gap-2 pb-5 border-b border-zinc-200/80 dark:border-zinc-800/80 overflow-x-auto no-scrollbar">
              {itineraryDays.map((day, idx) => (
                <button
                  key={day.day}
                  type="button"
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer shrink-0 ${
                    activeDayIndex === idx
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                      : 'bg-white dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                >
                  Ngày {day.day}
                </button>
              ))}
            </div>

            {/* Current Day Title */}
            <div className="py-4 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-zinc-950 dark:text-white">
                {activeDay.title}
              </h3>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {activeDay.items.length} địa điểm
              </span>
            </div>

            {/* Timeline Item Cards */}
            <div className="flex flex-col gap-3">
              {activeDay.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        <Clock className="w-3 h-3 text-[#F95738]" />
                        <span>{item.time}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-white">
                        {item.place}
                      </h4>
                    </div>

                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60 shrink-0">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-3.5 leading-relaxed font-normal">
                    {item.note}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{item.attendees.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Đã định vị tọa độ</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Group Packing Checklist & Squad Sync */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Packing Checklist Widget */}
            <div className="plan-card-anim rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center">
                    <Luggage className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-950 dark:text-white">Hành lý chung cả nhóm</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Tránh mang trùng hoặc quên đồ cần thiết</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {checkedCount}/{packingItems.length} xong
                </span>
              </div>

              {/* Minimalist Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-4 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Checklist list */}
              <div className="flex flex-col gap-2">
                {packingItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCheck(item.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-zinc-900/70 text-left hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs transition-colors ${
                          item.checked
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                        }`}
                      >
                        {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          item.checked
                            ? 'line-through text-zinc-400 dark:text-zinc-500'
                            : 'text-zinc-800 dark:text-zinc-200'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {item.assignee}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Squad Social Feature Callout */}
            <div className="plan-card-anim rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F95738] mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ĐỒNG BỘ THỜI GIAN THỰC</span>
                </div>
                <h4 className="text-lg font-semibold text-zinc-950 dark:text-white mb-2">
                  Mời bạn bè bằng 1 đường link hoặc mã QR
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Không cần lập tài khoản phức tạp. Bạn bè quét mã là lập tức gia nhập chuyến đi, cùng chỉnh sửa lịch trình và nhận thông báo khi có thay đổi.
                </p>
              </div>

              <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 shadow-md">
                <Image
                  src="/destinations/hanoi_street.jpg"
                  alt="Hội bạn thân cùng khám phá chuyến đi trên TripMate"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

                {/* Top Live Sync Pill */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>6 bạn đang online</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-mono border border-white/15 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Realtime Sync</span>
                  </span>
                </div>

                {/* Bottom Quick Invite Bar */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <Link2 className="w-3.5 h-3.5 text-[#F95738] shrink-0" />
                    <span className="text-[11px] font-mono text-zinc-300 truncate">tripmate.app/join/dalat-2026</span>
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
