'use client';

import { useGsapEffect, gsap } from '@/hooks/useGsap';
import { Sparkles, Check } from 'lucide-react';

const howItWorksSteps = [
  {
    step: 'Bước 01',
    stepNumber: '01',
    tag: 'Lên kế hoạch',
    title: 'Tạo chuyến và mời bạn bè',
    description:
      'Chỉ cần một liên kết để cả nhóm cùng tham gia. Mọi thành viên tự do thêm điểm đến yêu thích, bình chọn hoạt động và theo dõi lịch trình cập nhật tức thì.',
    highlight: 'Lịch trình đồng bộ tức thì cho cả nhóm',
    footerTitle: 'Khởi tạo nhanh chóng',
    footerSubtitle: 'Tham gia dễ dàng qua link mời',
  },
  {
    step: 'Bước 02',
    stepNumber: '02',
    tag: 'Chi tiêu nhóm',
    title: 'Thêm chi tiêu khi phát sinh',
    description:
      'Nhập nhanh các khoản ăn uống, vé tham quan hay xe cộ trong chuyến đi. TripMate tự động ghi nhận người trả và phân chia chi phí rành mạch theo từng thành viên.',
    highlight: 'Rành mạch từng khoản chi phí phát sinh',
    footerTitle: 'Ghi chép tự động',
    footerSubtitle: 'Chia đều hoặc tùy chọn người tham gia',
  },
  {
    step: 'Bước 03',
    stepNumber: '03',
    tag: 'Thanh toán & Kỷ niệm',
    title: 'Chốt sổ và quét QR trả nhau',
    description:
      'Khi chuyến đi kết thúc, app tự tính toán số tiền cần hoàn và tạo mã VietQR thanh toán chuẩn xác từng đồng. Đồng thời toàn bộ ảnh chụp tự gom về album chất lượng gốc.',
    highlight: 'Quét VietQR chuyển tiền thẳng ngân hàng',
    footerTitle: 'Quyết toán gọn gàng',
    footerSubtitle: 'Lưu trọn vẹn album ảnh chất lượng gốc',
  },
];

export default function SocialProofSection() {
  const containerRef = useGsapEffect<HTMLElement>((target, _ctx, isReduced) => {
    if (isReduced) return;

    gsap.from('.review-card-anim', {
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
      ref={containerRef}
      className="py-20 md:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F95738]" />
            <span>TRIPMATE HOẠT ĐỘNG THẾ NÀO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4">
            Một app thay cho mười nhóm chat và file Excel.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
            Mọi khâu từ lập lịch trình, chia tiền sòng phẳng đến gom trọn kỷ niệm đều được tự động hóa mượt mà.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howItWorksSteps.map((item, idx) => (
            <div
              key={idx}
              className="review-card-anim rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30 p-7 sm:p-8 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Step indicator and Tag */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#F95738]/10 text-[#F95738]">
                    {item.step}
                  </span>
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {item.tag}
                  </span>
                </div>

                {/* Step title & description */}
                <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 font-normal">
                  {item.description}
                </p>
              </div>

              <div>
                {/* Highlight banner */}
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F95738] bg-orange-50 dark:bg-orange-950/30 px-3 py-1 rounded-full mb-6">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{item.highlight}</span>
                </div>

                {/* Step footer */}
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-200/70 dark:border-zinc-800/70">
                  <div className="w-10 h-10 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center text-xs font-bold font-mono">
                    {item.stepNumber}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">
                      {item.footerTitle}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {item.footerSubtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
