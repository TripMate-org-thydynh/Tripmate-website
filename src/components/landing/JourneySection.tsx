'use client';

import { useGsapEffect, gsap } from '@/hooks/useGsap';
import { 
  Users, 
  Map, 
  Gamepad2, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Tạo nhóm & Mời bạn bè',
    desc: 'Chỉ mất 30 giây để tạo chuyến đi. Gửi 1 đường link duy nhất vào nhóm chat, bạn bè bấm vào là lập tức tham gia mà không cần cài đặt rườm rà.',
    icon: Users,
  },
  {
    step: '02',
    title: 'Thống nhất lịch trình & Đồ dùng',
    desc: 'Cả nhóm cùng ghim địa điểm muốn đến. Trợ lý AI tự động sắp xếp cung đường hợp lý và lập danh sách đồ dùng để không ai quên mang.',
    icon: Map,
  },
  {
    step: '03',
    title: 'Đi chơi, Chơi game & Lưu ảnh',
    desc: 'Chụp ảnh độ phân giải gốc 4K, quay Vòng quay ai trả cafe khi đến quán, hoàn thành các thử thách Trip Bingo để gắn kết cả hội bạn thân.',
    icon: Gamepad2,
  },
  {
    step: '04',
    title: 'Quyết toán VietQR & Nhận kỷ yếu',
    desc: 'Ứng dụng tự động tính nợ sòng phẳng, thanh toán qua mã VietQR không qua ví trung gian. Tự động xuất video recap kỷ niệm rực rỡ.',
    icon: Sparkles,
  },
];

export default function JourneySection() {
  const containerRef = useGsapEffect<HTMLElement>((target, _ctx, isReduced) => {
    if (isReduced) return;

    gsap.from('.journey-step-card', {
      scrollTrigger: {
        trigger: target,
        start: 'top 75%',
      },
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power2.out',
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-20 md:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F95738]" />
            <span>QUY TRÌNH 4 BƯỚC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4">
            Từ ý tưởng ban đầu đến khi kết thúc hành trình.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
            TripMate được thiết kế xoay quanh nhịp điệu tự nhiên của một chuyến du lịch nhóm ngoài đời thực.
          </p>
        </div>

        {/* 4-Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="journey-step-card relative rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30 p-6 sm:p-7 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider">
                      {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-zinc-950 dark:text-white mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-200/70 dark:border-zinc-800/70 flex items-center gap-1.5 text-xs font-semibold text-[#F95738]">
                  <span>{idx === 3 ? 'Hoàn tất chuyến đi' : 'Bước tiếp theo'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
