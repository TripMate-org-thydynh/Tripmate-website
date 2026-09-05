'use server';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import GooglePlayButton from '@/components/GooglePlayButton';
import { 
  Sparkles, 
  MapPin, 
  DollarSign, 
  CheckSquare, 
  Compass, 
  Camera, 
  ArrowRight,
  Smartphone,
  Lock,
  Zap,
  TrendingUp,
  AlertTriangle,
  Users,
  ShieldCheck
} from 'lucide-react';

const problems = [
  {
    icon: DollarSign,
    badge: 'PAIN POINT #1',
    title: 'Chia tiền mâu thuẫn',
    description: 'Chuyến đi 10 người, hóa đơn rải rác trên Zalo & ghi chú. Cuối chuyến không ai biết ai nợ ai bao nhiêu, mất lòng bạn bè.',
    color: 'bg-red-100 text-red-700 border-red-900',
  },
  {
    icon: Compass,
    badge: 'PAIN POINT #2',
    title: 'Lịch trình loạn 5 app',
    description: 'Bản đồ mở 1 tab, danh sách quán ăn 1 tab, chat 1 tab. Không ai nắm rõ timeline chung, trễ giờ và bỏ lỡ địa điểm hot.',
    color: 'bg-amber-100 text-amber-800 border-amber-900',
  },
  {
    icon: Camera,
    badge: 'PAIN POINT #3',
    title: 'Kỷ niệm trôi mất',
    description: 'Ảnh gửi nhóm bị trôi sau vài ngày. Không có nơi lưu giữ hành trình có cấu trúc kèm tọa độ GPS và câu chuyện nhóm.',
    color: 'bg-purple-100 text-purple-800 border-purple-900',
  },
];

const features = [
  {
    icon: Compass,
    title: 'Lịch trình "cuốn"',
    description: 'Tạo timeline chuyến đi chi tiết theo từng ngày, thêm địa điểm từ bản đồ, chia sẻ lịch hoạt động tức thì cho cả nhóm.',
    color: 'bg-[#FFD043]', // Bright Yellow
  },
  {
    icon: DollarSign,
    title: 'Chia tiền sòng phẳng',
    description: 'Nhập hóa đơn, chọn người trả và tự động chia đều hoặc chia theo phần trăm. Thanh toán nhanh qua Momo/ZaloPay.',
    color: 'bg-[#C5B4FA]', // Pastel Purple
  },
  {
    icon: CheckSquare,
    title: 'Chuẩn bị hành lý',
    description: 'Danh sách đồ đạc cần mang theo các danh mục chuyên dụng. Giao việc chuẩn bị đồ dùng nhóm cho từng thành viên.',
    color: 'bg-[#FF9FCE]', // Pastel Pink
  },
  {
    icon: Sparkles,
    title: 'Trợ lý AI Planner',
    description: 'Chỉ cần nhập vibe chuyến đi, AI tự thiết kế lịch trình tối ưu, gợi ý địa điểm ăn chơi hot nhất phù hợp với ngân sách.',
    color: 'bg-[#18A058] text-white', // Neo Green
  },
  {
    icon: Camera,
    title: 'Khoảnh khắc Moments',
    description: 'Đăng ảnh, boomerang kèm tọa độ GPS. Cả nhóm cùng ngắm nhìn dòng thời gian kỷ niệm và tương tác bằng emoji.',
    color: 'bg-[#E0533C] text-white', // Brand Coral
  },
  {
    icon: MapPin,
    title: 'Bản đồ di chuyển',
    description: 'Bản đồ trực quan hiển thị vị trí các homestay, quán ăn, khu check-in và vị trí thời gian thực của bạn bè.',
    color: 'bg-[#A2D2FF]', // Sky Blue
  },
];

const faqs = [
  {
    question: 'TripMate giải quyết vấn đề gì cho nhóm du lịch?',
    answer: 'TripMate tích hợp toàn bộ luồng Lập lịch trình, Chia tiền tự động, Quản lý hành lý và Lưu giữ khoảnh khắc kỷ niệm vào 1 nền tảng duy nhất.',
  },
  {
    question: 'Làm thế nào để kết nối ví Momo hay ZaloPay để chia tiền?',
    answer: 'Bạn chỉ cần liên kết ví trong mục Cài đặt ví. Khi chia tiền, TripMate tạo mã QR động để bạn bè chuyển khoản trực tiếp, tiền về thẳng ví mà không mất phí trung gian.',
  },
  {
    question: 'Trợ lý AI Planner hoạt động như thế nào?',
    answer: 'AI của chúng tôi sử dụng mô hình Google Gemini để phân tích điểm đến, thời gian và vibe bạn chọn. Từ đó gợi ý lịch trình cá nhân hóa cho nhóm.',
  },
  {
    question: 'Nền tảng hỗ trợ những thiết bị nào?',
    answer: 'TripMate hiện có trên Android (Google Play), kèm bản Web để xem nhanh trên máy tính. Bản iOS đang trong kế hoạch.',
  },
];

export default async function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/30 bg-[#FEFADC] dark:bg-[#1C1A19]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b-[3px] border-black bg-white/90 backdrop-blur-md dark:bg-[#252322]/90 dark:border-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-black text-2xl tracking-tight text-black dark:text-white lowercase">
              trip<span className="text-primary">.</span>mate
            </span>
            {/* Online Members Badge */}
            <div className="hidden sm:flex items-center gap-1.5 ml-4 bg-secondary border-2 border-black rounded-full px-2.5 py-0.5 text-[10px] font-extrabold shadow-[1px_1px_0px_0px_#000000]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
              <span>STARTUP DU LỊCH NHÓM GEN Z</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-black uppercase text-black dark:text-white">
            <a href="#problem" className="hover:text-primary transition-colors">Vấn đề</a>
            <a href="#features" className="hover:text-primary transition-colors">Giải pháp</a>
            <Link href="/preview" className="hover:text-primary transition-colors">Xem thử Web App</Link>
            <a href="#download" className="hover:text-primary transition-colors">Tải app</a>
            <a href="#faq" className="hover:text-primary transition-colors">Hỏi đáp</a>
            <Link href="/admin" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Lock className="w-3.5 h-3.5" />
              Admin Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#download"
              className="px-4 py-2 text-xs font-black uppercase rounded-xl bg-[#FFD043] hover:bg-[#FFD043]/90 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
            >
              Tải app
            </a>
          </div>
        </div>
      </header>

      {/* MARQUEE BANNER */}
      <div className="neo-marquee select-none dark:border-white">
        <div className="neo-marquee-content flex gap-8">
          <span>🔥 BẬT CHẾ ĐỘ CHIA TIỀN TỰ ĐỘNG * VĨNH BIỆT CẢI NHAU VÌ TIỀN LẺ *</span>
          <span>⚡ TRỢ LÝ AI GEMINI LẬP LỊCH TRÌNH TRONG 30 GIÂY *</span>
          <span>🔥 BẬT CHẾ ĐỘ CHIA TIỀN TỰ ĐỘNG * VĨNH BIỆT CẢI NHAU VÌ TIỀN LẺ *</span>
          <span>⚡ TRỢ LÝ AI GEMINI LẬP LỊCH TRÌNH TRONG 30 GIÂY *</span>
        </div>
      </div>

      {/* MODERN GRADIENT + BRUTALIST HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-gradient-to-b from-[#FFFDF0] via-[#FEFADC] to-[#F3ECA7] dark:from-[#252322] dark:via-[#1C1A19] dark:to-[#141210]">
        {/* Soft Glowing Gradient Orbs for Modern Vibe */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/20 via-[#FFD043]/30 to-[#C5B4FA]/20 blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center relative z-10">
          <div className="md:col-span-7 flex flex-col gap-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5B4FA] text-black text-xs font-black border-2 border-black shadow-[3px_3px_0px_0px_#000000] self-center md:self-start rotate-[-1deg]">
              <Sparkles className="w-4 h-4 text-primary" />
              Nền Tảng Đột Phá Cho Nhóm Phượt & Du Lịch
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-black dark:text-white uppercase">
              Giải pháp <span className="text-primary">Toàn diện</span> cho mọi chuyến đi nhóm
            </h1>

            <p className="text-sm md:text-base font-bold text-black/80 dark:text-white/80 max-w-xl leading-relaxed">
              Vĩnh biệt việc chia tiền thủ công rắc rối, lịch trình rải rác trên 5 app khác nhau. TripMate kết nối mọi thành viên vào một hành trình trọn vẹn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
              <GooglePlayButton />
              <Link
                href="/preview"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-xs font-black uppercase rounded-2xl bg-white text-black border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] hover:bg-secondary transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                Xem thử bản Web
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Live Stats Ticker */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t-2 border-black/10 dark:border-white/10 mt-4">
              <div>
                <span className="text-2xl font-black text-primary">100%</span>
                <p className="text-[10px] font-black uppercase text-black/60 dark:text-white/60">Tự động chia tiền</p>
              </div>
              <div>
                <span className="text-2xl font-black text-[#18A058]">30s</span>
                <p className="text-[10px] font-black uppercase text-black/60 dark:text-white/60">AI Lập Lịch Trình</p>
              </div>
              <div>
                <span className="text-2xl font-black text-[#FFD043]">All-in-1</span>
                <p className="text-[10px] font-black uppercase text-black/60 dark:text-white/60">Super App Duy Nhất</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 relative flex justify-center">
            {/* Phone Mockup in Hybrid Style */}
            <div className="relative w-64 h-[510px] rounded-[36px] border-[4px] border-black bg-white dark:bg-[#252322] shadow-[8px_8px_0px_0px_#000000] overflow-hidden flex flex-col rotate-[2deg] hover:rotate-0 transition-transform">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 ml-auto mr-3"></div>
              </div>
              
              <div className="flex-1 flex flex-col p-4 pt-8 text-black bg-[#FEFADC]">
                <div className="flex justify-between items-center mb-4 border-b border-black pb-2">
                  <div>
                    <span className="text-[9px] font-black text-black/50">Phú Quốc Escape 🌴</span>
                    <h4 className="text-xs font-black uppercase">Quẩy Hết Nấc</h4>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#C5B4FA] border border-black flex items-center justify-center text-[10px] font-black">PQ</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FFD043] border-2 border-black mb-3 text-xs shadow-[2px_2px_0px_0px_#000000]">
                  <div className="flex justify-between font-black mb-1">
                    <span>Tổng Quỹ Nhóm</span>
                    <span>5.5M VND</span>
                  </div>
                  <span className="text-[9px] font-bold text-black/70">Đã chi tiêu: 3.2M VND</span>
                  <div className="w-full bg-white border border-black h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-primary h-full w-[60%]"></div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                  <span className="text-[9px] font-black text-black/50 uppercase">Tính năng nổi bật</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-xl bg-[#FFD043] border border-black text-[10px] font-bold flex items-center gap-1.5 shadow-[1px_1px_0px_0px_#000000]">
                      <div className="w-4 h-4 bg-white border border-black rounded flex items-center justify-center text-[8px]">💰</div>
                      Chia tiền
                    </div>
                    <div className="p-2 rounded-xl bg-[#C5B4FA] border border-black text-[10px] font-bold flex items-center gap-1.5 shadow-[1px_1px_0px_0px_#000000]">
                      <div className="w-4 h-4 bg-white border border-black rounded flex items-center justify-center text-[8px]">📷</div>
                      Moments
                    </div>
                    <div className="p-2 rounded-xl bg-[#18A058] border border-black text-white text-[10px] font-bold flex items-center gap-1.5 shadow-[1px_1px_0px_0px_#000000]">
                      <div className="w-4 h-4 bg-white border border-black rounded flex items-center justify-center text-[8px]">🤖</div>
                      AI Planner
                    </div>
                    <div className="p-2 rounded-xl bg-[#FF9FCE] border border-black text-[10px] font-bold flex items-center gap-1.5 shadow-[1px_1px_0px_0px_#000000]">
                      <div className="w-4 h-4 bg-white border border-black rounded flex items-center justify-center text-[8px]">🎒</div>
                      Hành lý
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM STATEMENT SECTION */}
      <section id="problem" className="py-20 bg-white dark:bg-[#252322] border-t-[3px] border-black dark:border-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-900 text-xs font-black self-center">
              <AlertTriangle className="w-4 h-4" />
              Thực Trạng Hiện Tại
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-black dark:text-white">
              Vấn đề du lịch nhóm đang gặp phải
            </h2>
            <p className="text-xs font-bold text-muted-foreground uppercase">
              Tại sao 80% chuyến đi nhóm bị trễ kế hoạch hoặc mất vui cuối chuyến?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((prob, idx) => {
              const Icon = prob.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border-[3px] border-black bg-[#FEFADC] dark:bg-[#1C1A19] shadow-[5px_5px_0px_0px_#000000] dark:shadow-[5px_5px_0px_0px_#ffffff] flex flex-col gap-4"
                >
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-lg border border-black w-fit bg-white dark:bg-[#252322] dark:text-white uppercase">
                    {prob.badge}
                  </span>
                  <div className="w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center bg-white shadow-[2px_2px_0px_0px_#000000]">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-black text-black dark:text-white uppercase">{prob.title}</h3>
                  <p className="text-xs font-bold text-black/75 dark:text-white/75 leading-relaxed">{prob.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOLUTION / FEATURES SECTION */}
      <section id="features" className="py-20 bg-[#FEFADC] dark:bg-[#1C1A19] border-t-[3px] border-black dark:border-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18A058] text-white text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] self-center">
              <Zap className="w-4 h-4" />
              Giải Pháp TripMate Super-App
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-black dark:text-white">
              Tất cả tính năng bạn cần trong 1 ứng dụng
            </h2>
            <p className="text-xs font-bold text-muted-foreground uppercase">
              Thiết kế dành riêng cho thế hệ Gen Z yêu thích sự tiện lợi và minh bạch.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx} 
                  className="p-6 rounded-3xl border-[3px] border-black bg-white dark:bg-[#252322] shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] transition-all"
                >
                  <div className={`w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center mb-5 ${feat.color} shadow-[2px_2px_0px_0px_#000000]`}>
                    <Icon className="w-5 h-5 shrink-0" />
                  </div>
                  <h3 className="text-lg font-black text-black dark:text-white mb-2 uppercase">{feat.title}</h3>
                  <p className="text-xs font-bold text-black/70 dark:text-white/75 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STARTUP DASHBOARD TEASER */}
      <section className="py-16 bg-white dark:bg-[#252322] border-t-[3px] border-black dark:border-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="p-8 md:p-12 rounded-[40px] border-[3px] border-black bg-[#C5B4FA] text-black shadow-[6px_6px_0px_0px_#000000] flex flex-col gap-6 items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
              <TrendingUp className="w-4 h-4 text-primary" />
              Dành Cho Admin & Nhà Đầu Tư
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase leading-tight">
              Bảng Điều Khiển Khởi Nghiệp Thời Gian Thực
            </h2>
            <p className="text-sm font-bold max-w-xl">
              Theo dõi MAU, tăng trưởng chuyến đi, doanh thu MRR và phân tích sử dụng AI từ hệ thống quản trị backend thật.
            </p>

            <Link
              href="/admin"
              className="px-8 py-4 bg-primary text-white border-[3px] border-black font-black text-xs uppercase rounded-2xl hover:bg-primary/90 transition shadow-[4px_4px_0px_0px_#000000] hover:translate-y-[-1px] active:translate-y-[1px] flex items-center gap-2"
            >
              Truy Cập Admin Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* DOWNLOAD SECTION */}
      <section
        id="download"
        className="py-20 bg-[#FFD043] border-t-[3px] border-black dark:border-white scroll-mt-20"
      >
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase self-center md:self-start">
              <Smartphone className="w-3.5 h-3.5" />
              Android · Miễn phí
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase leading-tight text-black">
              Rủ hội bạn, tải app rồi đi thôi
            </h2>
            <p className="text-sm font-bold text-black/75 max-w-md mx-auto md:mx-0 leading-relaxed">
              Lên lịch trình, chia tiền tự động và lưu moment cả nhóm — tất cả
              trong một app. Không quảng cáo, không phí ẩn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start justify-center md:justify-start pt-1">
              <GooglePlayButton />
            </div>
            <p className="text-[10px] font-black uppercase text-black/50 pt-1">
              Yêu cầu Android 7.0 trở lên
            </p>
          </div>

          {/* App preview mockup */}
          <div className="flex justify-center">
            <div className="relative w-[240px] h-[480px] rounded-[36px] border-[4px] border-black bg-white shadow-[8px_8px_0px_0px_#000000] overflow-hidden flex flex-col">
              <div className="h-6 bg-black flex items-center justify-center shrink-0">
                <div className="w-16 h-1.5 rounded-full bg-white/30" />
              </div>
              <div className="flex-1 bg-[#FFFDF0] p-4 flex flex-col gap-3">
                <span className="font-black text-lg lowercase text-black">
                  trip<span className="text-primary">.</span>mate
                </span>
                <div className="rounded-2xl border-2 border-black bg-[#C5B4FA] p-3 flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase text-black/60">
                    Chuyến sắp tới
                  </span>
                  <span className="text-sm font-black text-black">Đà Lạt 3N2Đ</span>
                  <span className="text-[10px] font-bold text-black/70">6 thành viên</span>
                </div>
                <div className="rounded-2xl border-2 border-black bg-white p-3 flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase text-black/60">
                    Chia tiền
                  </span>
                  {[
                    ['Minh trả hộ', '1.200.000₫'],
                    ['Bạn còn nợ', '200.000₫'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-black/70">{label}</span>
                      <span className="text-[11px] font-black text-black">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border-2 border-black bg-[#18A058] p-3">
                  <span className="text-[10px] font-black uppercase text-white">
                    ✦ AI đã lên lịch trình ngày 2
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-16 bg-[#FEFADC] dark:bg-[#1C1A19] border-t-[3px] border-black dark:border-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12 flex flex-col gap-2">
            <h2 className="text-3xl font-black uppercase text-black dark:text-white">
              Giải đáp thắc mắc (FAQ)
            </h2>
            <p className="text-xs font-bold text-muted-foreground uppercase">Hỏi nhanh đáp gọn về TripMate</p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl border-2 border-black dark:border-white bg-white dark:bg-[#252322] flex flex-col gap-2 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs border border-black">?</div>
                  <h3 className="text-xs font-black text-black dark:text-white uppercase">{faq.question}</h3>
                </div>
                <p className="text-xs font-bold text-black/75 dark:text-white/75 leading-relaxed pl-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-[3px] border-black dark:border-white bg-white dark:bg-[#252322] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-black text-xl lowercase text-black dark:text-white">
            trip<span className="text-primary">.</span>mate
          </span>

          <GooglePlayButton size="sm" />

          <span className="text-[10px] font-black uppercase text-muted-foreground text-center md:text-right">
            © {new Date().getFullYear()} TripMate Startup Project. Thiết kế Hybrid Modern + Neo-Brutalist.
          </span>
        </div>
      </footer>
    </div>
  );
}
