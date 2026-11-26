'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';
import {
  Receipt,
  Calendar,
  Luggage,
  Camera,
  CheckCircle2,
  ChevronDown,
  ArrowUpRight,
  Users,
  MapPin,
  Clock,
  Menu,
} from 'lucide-react';

const sections = [
  ['problems', 'Thực trạng'],
  ['features', 'Tính năng'],
  ['story', 'Trải nghiệm'],
  ['faq', 'Hỏi đáp'],
] as const;

const painPoints = [
  {
    icon: Receipt,
    title: 'Chia tiền khó xử',
    description: 'Cuối chuyến đi, hóa đơn ăn uống và tiền phòng nằm rải rác trên nhiều nhóm chat. Không ai nhớ rõ ai đã trả cho ai, việc nhắc nợ trở nên ngượng ngùng.',
  },
  {
    icon: Clock,
    title: 'Lịch trình phân tán',
    description: 'Quán ăn lưu trong tin nhắn, điểm check-in mở trên bản đồ riêng, giờ giấc không thống nhất. Nhóm thường xuyên trễ giờ xuất phát và bỏ lỡ điểm đẹp.',
  },
  {
    icon: Camera,
    title: 'Kỷ niệm trôi mất',
    description: 'Ảnh chụp chung gửi vào nhóm chat bị nén giảm chất lượng và nhanh chóng trôi mất sau vài ngày. Cả nhóm không có một nơi chung để xem lại hành trình.',
  },
];

const faqs = [
  {
    question: 'TripMate có thu phí khi sử dụng không?',
    answer: 'Hoàn toàn không. TripMate mở miễn phí cho mọi nhóm bạn, không có chi phí ẩn và không gắn quảng cáo làm phiền trải nghiệm du lịch của bạn.',
  },
  {
    question: 'Việc chia tiền chuyển khoản có qua trung gian không?',
    answer: 'Không. Khi chia tiền, ứng dụng tạo mã QR chuyển khoản trực tiếp đến tài khoản ngân hàng của người đã chi trả. Tiền về thẳng tài khoản của bạn bè ngay lập tức.',
  },
  {
    question: 'Bạn bè không có tài khoản có xem được lịch trình không?',
    answer: 'Có. Bạn có thể gửi liên kết web của chuyến đi để mọi người cùng mở trên trình duyệt điện thoại, theo dõi lịch trình và địa điểm mà không bắt buộc tạo tài khoản.',
  },
  {
    question: 'Ứng dụng hoạt động trên những nền tảng nào?',
    answer: 'TripMate hiện có phiên bản Web dùng mượt mà trên cả máy tính lẫn trình duyệt điện thoại, cùng ứng dụng Android dành cho các chuyến đi thực tế.',
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="landing-shell min-h-dvh bg-[#FAF8F2] text-[#141210] dark:bg-[#121110] dark:text-[#FAF8F2] font-quicksand antialiased selection:bg-[#F59E0B]/30">
      <a href="#landing-main" className="sr-only z-60 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:rounded-lg focus:bg-[#F59E0B] focus:px-4 focus:py-2 focus:text-[#141210]">Đến nội dung chính</a>
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 w-full h-16 border-b border-neutral-200 dark:border-neutral-800 bg-[#FAF8F2]/95 dark:bg-[#121110]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-2xl font-black lowercase tracking-tight text-neutral-900 dark:text-white"
            >
              trip<span className="text-[#F59E0B]">.</span>mate
            </Link>
          </div>

          <nav aria-label="Điều hướng TripMate" className="hidden md:flex items-center gap-7 text-sm font-bold text-neutral-700 dark:text-neutral-300">
            {sections.map(([id, label]) => (
              <a key={id} href={'#' + id} className="rounded-sm hover:text-amber-700 dark:hover:text-[#F59E0B]">{label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/preview"
              className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-extrabold rounded-xl border-2 border-neutral-900 dark:border-neutral-100 bg-[#F59E0B] text-neutral-950 shadow-sm hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#141210] dark:active:shadow-[1px_1px_0px_0px_#F5F5F4] transition-all"
            >
              Thử bản web
            </Link>
            <details className="relative md:hidden">
              <summary aria-label="Menu TripMate" className="grid size-9 cursor-pointer list-none place-items-center rounded-lg border border-neutral-200 dark:border-neutral-700">
                <Menu size={18} aria-hidden="true" />
              </summary>
              <nav aria-label="Điều hướng TripMate" className="absolute right-0 top-full mt-2 grid w-44 gap-1 rounded-xl border border-neutral-200 bg-[#FAF8F2] p-2 text-sm font-bold shadow-lg dark:border-neutral-800 dark:bg-[#1C1A18]">
                {sections.map(([id, label]) => (
                  <a key={id} href={'#' + id} onClick={(event) => event.currentTarget.closest('details')?.removeAttribute('open')}
                    className="rounded-md px-3 py-2 hover:bg-amber-500/15">{label}</a>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main id="landing-main" tabIndex={-1}>
      <section className="border-b border-neutral-200 bg-gradient-to-br from-[#F59E0B]/12 to-transparent py-12 md:py-20 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
            <div className="md:col-span-7 flex flex-col gap-5">
              <div className="inline-flex w-fit items-center gap-2 text-sm font-bold text-amber-800 dark:text-[#F59E0B]">
                <Users className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Ứng dụng du lịch nhóm</span>
              </div>

              <h1 className="max-w-xl text-4xl leading-[1.1] font-black tracking-tight text-balance text-neutral-950 sm:text-5xl xl:text-6xl dark:text-white">
                Du lịch cùng bạn bè, thảnh thơi và rõ ràng
              </h1>

              <p className="text-base sm:text-lg font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-xl">
                Lên lịch trình chung, tự động chia tiền sòng phẳng và lưu trọn kỷ niệm cho cả nhóm bạn.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <Link
                  href="/preview"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-black rounded-xl border-2 border-neutral-900 dark:border-neutral-100 bg-[#F59E0B] text-neutral-950 shadow-sm hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#141210] dark:active:shadow-[1px_1px_0px_0px_#F5F5F4] transition-all"
                >
                  <span>Thử bản web</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="relative rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg shadow-amber-950/10 sm:p-3 dark:border-neutral-800 dark:bg-[#1C1A18]">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-900/20 dark:border-neutral-100/20">
                  <Image
                    src="https://picsum.photos/seed/tripmate-friends/800/600"
                    alt="Nhóm bạn trẻ cùng nhau đi du lịch và chụp ảnh kỷ niệm"
                    fill
                    sizes="(max-width: 768px) 100vw, 42vw"
                    priority
                    className="object-cover"
                  />
                </div>
                <div className="pt-3 pb-1 px-1 flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Đà Lạt, Lâm Đồng</span>
                  </div>
                  <span className="text-neutral-500 dark:text-neutral-400">Hành trình 3N2Đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PAIN POINTS (HORIZONTAL SCROLL TRACK) */}
      <section id="problems" className="py-14 md:py-20 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
              Những rắc rối khiến chuyến đi mất vui
            </h2>
            <p className="mt-2 text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-300">
              Đi cùng hội bạn thân rất hào hứng, nhưng việc chuẩn bị và quản lý chi phí thường nảy sinh nhiều bất tiện.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {painPoints.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1C1A18]"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl border-2 border-neutral-900 dark:border-neutral-100 bg-[#F59E0B]/20 flex items-center justify-center mb-5 text-[#F59E0B]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-neutral-950 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES (ASYMMETRIC BENTO GRID - 4 CELLS) */}
      <section id="features" className="py-16 md:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-[#F5F2E9] dark:bg-[#161412]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 dark:text-white tracking-tight">
              Mọi thứ bạn cần cho một chuyến đi trọn vẹn
            </h2>
            <p className="mt-3 text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-300">
              TripMate đồng hành cùng nhóm từ khâu lên ý tưởng, sắp xếp hành lý đến khi kết thúc hành trình.
            </p>
          </div>

          {/* Asymmetric Bento: Row 1 (7:5), Row 2 (5:7) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Cell 1: Split bill & payment with real photo (Col span 7) */}
            <div className="md:col-span-7 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1C1A18] p-6 shadow-sm flex flex-col justify-between overflow-hidden">
              <div className="mb-5">
                <div className="w-10 h-10 rounded-xl border-2 border-neutral-900 dark:border-neutral-100 bg-[#F59E0B] flex items-center justify-center mb-4 text-neutral-950">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-neutral-950 dark:text-white mb-2">
                  Chia tiền sòng phẳng, thanh toán tức thì
                </h3>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Nhập chi tiêu ăn uống, phòng nghỉ và xe cộ. Ứng dụng tính toán số tiền mỗi người cần trả và xuất mã QR ngân hàng chính xác.
                </p>
              </div>
              <div className="relative h-48 w-full overflow-hidden rounded-xl border border-neutral-900/20 dark:border-neutral-100/20">
                <Image
                  src="https://picsum.photos/seed/travel-coffee-bill/700/350"
                  alt="Nhóm bạn cùng thưởng thức đồ uống tại quán cà phê địa phương"
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Cell 2: Itinerary planning (Col span 5) */}
            <div className="md:col-span-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1C1A18] p-6 shadow-sm flex flex-col justify-between overflow-hidden">
              <div className="mb-5">
                <div className="w-10 h-10 rounded-xl border-2 border-neutral-900 dark:border-neutral-100 bg-[#F59E0B]/20 flex items-center justify-center mb-4 text-[#F59E0B]">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-neutral-950 dark:text-white mb-2">
                  Lịch trình trực quan theo ngày
                </h3>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Sắp xếp các điểm đến theo thứ tự hợp lý, kèm mốc thời gian và vị trí trên bản đồ để cả nhóm luôn chủ động.
                </p>
              </div>
              <div className="relative h-48 w-full overflow-hidden rounded-xl border border-neutral-900/20 dark:border-neutral-100/20">
                <Image
                  src="https://picsum.photos/seed/travel-route-map/700/350"
                  alt="Bản đồ lộ trình và cung đường khám phá điểm đến"
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Cell 3: Luggage check (Col span 5) */}
            <div className="md:col-span-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1C1A18] p-6 shadow-sm flex flex-col justify-between overflow-hidden">
              <div className="mb-5">
                <div className="w-10 h-10 rounded-xl border-2 border-neutral-900 dark:border-neutral-100 bg-[#F59E0B]/20 flex items-center justify-center mb-4 text-[#F59E0B]">
                  <Luggage className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-neutral-950 dark:text-white mb-2">
                  Chuẩn bị đồ dùng nhóm
                </h3>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Phân công đồ dùng cá nhân và vật dụng chung như thuốc men, máy ảnh hay lều trại. Tránh tình trạng quên đồ khi đi xa.
                </p>
              </div>
              <div className="relative h-48 w-full overflow-hidden rounded-xl border border-neutral-900/20 dark:border-neutral-100/20">
                <Image
                  src="https://picsum.photos/seed/travel-backpack-gear/700/350"
                  alt="Hành lý ba lô và vật dụng dã ngoại cho chuyến du lịch"
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Cell 4: Moments & Memories with real photo (Col span 7) */}
            <div className="md:col-span-7 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1C1A18] p-6 shadow-sm flex flex-col justify-between overflow-hidden">
              <div className="mb-5">
                <div className="w-10 h-10 rounded-xl border-2 border-neutral-900 dark:border-neutral-100 bg-[#F59E0B] flex items-center justify-center mb-4 text-neutral-950">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-neutral-950 dark:text-white mb-2">
                  Lưu khoảnh khắc và tọa độ kỷ niệm
                </h3>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Album ảnh chung giữ nguyên chất lượng gốc, gắn liền với từng chặng đường để mọi người cùng lưu giữ kỷ niệm tuổi trẻ.
                </p>
              </div>
              <div className="relative h-48 w-full overflow-hidden rounded-xl border border-neutral-900/20 dark:border-neutral-100/20">
                <Image
                  src="https://picsum.photos/seed/vietnam-travel-memory/700/350"
                  alt="Khoảnh khắc nụ cười và cảnh đẹp thiên nhiên trong chuyến dã ngoại"
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: REAL TRIP STORY (ZIGZAG 2-COL) */}
      <section id="story" className="py-16 md:py-24 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Left Col: Real Photo */}
            <div className="md:col-span-6">
              <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1C1A18] p-2.5 sm:p-3 shadow-[6px_6px_0px_0px_#141210] dark:shadow-[6px_6px_0px_0px_#F5F5F4]">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-900/20 dark:border-neutral-100/20">
                  <Image
                    src="https://picsum.photos/seed/vietnam-dalat-roadtrip/800/600"
                    alt="Khung cảnh cắm trại bên đồi thông buổi sớm"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Authentic Experience Story */}
            <div className="md:col-span-6 flex flex-col gap-5">
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                Chuyến đi trọn vẹn từ lúc bắt đầu đến khi về nhà
              </h2>
              <p className="text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Trong chuyến đi Đà Lạt 3 ngày vừa qua, nhóm 6 người của Hoàng Nam đã không còn phải căng thẳng ghi chép chi tiêu vào sổ tay hay chia tiền thủ công mỗi tối.
              </p>

              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                  <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Hóa đơn ăn uống được cộng dồn và chia đều ngay sau từng bữa ăn.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                  <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Cả nhóm đều nắm rõ giờ hẹn xuất phát mà không cần nhắn tin giục nhau.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                  <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Toàn bộ hình ảnh check-in được lưu lại nguyên vẹn theo từng ngày.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ (SINGLE COLUMN CENTERED ACCORDION) */}
      <section id="faq" className="py-16 md:py-20 border-b border-neutral-200 dark:border-neutral-800 bg-[#F5F2E9] dark:bg-[#161412]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
              Những thắc mắc thường gặp
            </h2>
            <p className="mt-2 text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-300">
              Giải đáp nhanh cho chuyến đi đầu tiên của bạn cùng TripMate.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1C1A18] shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    aria-controls={'faq-answer-' + idx}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-neutral-950 dark:text-white cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-neutral-500 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#F59E0B]' : ''
                      }`}
                    />
                  </button>
                  <div id={'faq-answer-' + idx} hidden={!isOpen} className="px-5 pb-5 pt-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-200 dark:border-neutral-800">
                      {faq.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CALL TO ACTION (CENTERED FOCUS CARD) */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-6">
          <div className="rounded-2xl border-2 border-neutral-900 dark:border-neutral-100 bg-[#F59E0B] text-neutral-950 p-8 sm:p-12 shadow-[6px_6px_0px_0px_#141210] dark:shadow-[6px_6px_0px_0px_#F5F5F4] text-center flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight max-w-xl">
              Sẵn sàng cho chuyến đi tiếp theo cùng bạn bè?
            </h2>
            <p className="mt-3 text-sm sm:text-base font-bold text-neutral-900/80 max-w-lg leading-relaxed">
              Trải nghiệm ngay bản web để cùng hội bạn tạo lịch trình và chia tiền một cách dễ dàng nhất.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link
                href="/preview"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-black rounded-xl border-2 border-neutral-900 bg-neutral-950 text-white shadow-[3px_3px_0px_0px_#141210] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#141210] transition-all"
              >
                <span>Thử bản web</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm sm:text-base font-black rounded-xl border-2 border-neutral-900 bg-white text-neutral-950 shadow-[3px_3px_0px_0px_#141210] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#141210] transition-all"
              >
                Trang quản trị
              </Link>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-[#FAF8F2] dark:bg-[#121110] py-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-xl font-black lowercase text-neutral-900 dark:text-white">
            trip<span className="text-[#F59E0B]">.</span>mate
          </Link>

          <div className="text-xs font-bold text-neutral-600 dark:text-neutral-400 text-center">
            TripMate dành cho những chuyến du lịch thanh xuân cùng bạn bè.
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-neutral-700 dark:text-neutral-300">
            <Link href="/preview" className="hover:text-[#F59E0B] transition-colors">
              Thử bản web
            </Link>
            <Link href="/admin" className="hover:text-[#F59E0B] transition-colors">
              Trang quản trị
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
