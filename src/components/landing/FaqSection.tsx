'use client';

import { useState } from 'react';
import { useGsapEffect, gsap } from '@/hooks/useGsap';
import { HelpCircle, ChevronDown } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: 'TripMate có miễn phí không hay có thu phí ẩn?',
    answer:
      'Hoàn toàn miễn phí 100% cho mọi tính năng cốt lõi: lập lịch trình, chia tiền tự động, lưu album ảnh chất lượng gốc và chơi game nhóm. Ứng dụng không có chi phí ẩn và không gắn quảng cáo pop-up làm phiền trải nghiệm du lịch của bạn.',
  },
  {
    question: 'Chia tiền chuyển khoản ngân hàng qua VietQR có an toàn không?',
    answer:
      'Tuyệt đối an toàn. TripMate tạo mã VietQR chuẩn liên ngân hàng NAPAS. Tiền được chuyển khoản trực tiếp từ app ngân hàng của bạn sang tài khoản ngân hàng của người nhận. TripMate không giữ tiền và không thu bất kỳ khoản phí giao dịch trung gian nào.',
  },
  {
    question: 'Bạn bè không cài app có xem được lịch trình chuyến đi không?',
    answer:
      'Có. Bạn chỉ cần chia sẻ một đường liên kết duy nhất, bạn bè có thể mở trực tiếp trên bất kỳ trình duyệt điện thoại nào để theo dõi lịch trình, xem bản đồ và ghi chú mà không bắt buộc phải tải ứng dụng hay đăng ký phức tạp.',
  },
  {
    question: 'Khi mất mạng 4G/Internet ở vùng núi hẻo lánh thì ứng dụng có dùng được không?',
    answer:
      'Có. TripMate được xây dựng với cơ chế Offline First. Bạn vẫn có thể mở lịch trình đã lưu, tra cứu danh sách đồ dùng và nhập chi tiêu ngoại tuyến. Ngay khi có mạng trở lại, ứng dụng sẽ tự động đồng bộ cho toàn bộ các thành viên khác.',
  },
  {
    question: 'Dữ liệu chuyến đi có bị mất khi đổi điện thoại không?',
    answer:
      'Hoàn toàn không. Toàn bộ lịch trình, chi tiêu và danh sách chuẩn bị đều được lưu trữ an toàn trên đám mây gắn liền với tài khoản của bạn. Khi đổi sang thiết bị mới, bạn chỉ cần đăng nhập lại là toàn bộ dữ liệu sẽ tự động đồng bộ nguyên vẹn.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const containerRef = useGsapEffect<HTMLElement>((target, _ctx, isReduced) => {
    if (isReduced) return;

    gsap.from('.faq-item-anim', {
      scrollTrigger: {
        trigger: target,
        start: 'top 75%',
      },
      y: 24,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, []);

  return (
    <section
      id="faq"
      ref={containerRef}
      className="py-20 md:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 mb-3.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#F95738]" />
            <span>GIẢI ĐÁP THẮC MẮC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4">
            Những thắc mắc thường gặp.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
            Mọi thông tin bạn cần biết trước khi khởi hành chuyến đi đầu tiên cùng TripMate.
          </p>
        </div>

        {/* Accordion list */}
        <div className="flex flex-col gap-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="faq-item-anim rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-base sm:text-lg text-zinc-950 dark:text-white cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed border-t border-zinc-200/60 dark:border-zinc-800/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
