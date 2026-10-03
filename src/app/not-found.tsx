import Link from 'next/link';
import type { Metadata } from 'next';
import { Compass, Home, Sparkles, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { Quicksand } from 'next/font/google';
import ThemeToggle from '@/components/ThemeToggle';

const quicksand = Quicksand({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '404 - Lạc đường rồi | TripMate',
  description: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được dời sang tọa độ mới trên bản đồ.',
};

export default function NotFound() {
  return (
    <div
      className={`${quicksand.className} min-h-screen bg-[#FAF8F2] dark:bg-[#121110] text-[#121110] dark:text-[#FAF8F2] flex flex-col justify-between p-6 sm:p-10 transition-colors duration-200 selection:bg-[#F59E0B]/30`}
    >
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b-2 border-[#121110]/10 dark:border-[#FAF8F2]/10">
        <Link
          href="/"
          className="flex items-center gap-2 group text-lg font-bold tracking-tight"
        >
          <div className="w-8 h-8 rounded-xl bg-[#F59E0B] border-2 border-[#121110] dark:border-[#FAF8F2] flex items-center justify-center text-[#121110] font-black text-xs shadow-[2px_2px_0px_0px_#121110] dark:shadow-[2px_2px_0px_0px_#FAF8F2]">
            TM
          </div>
          <span className="font-extrabold text-[#121110] dark:text-[#FAF8F2]">
            trip<span className="text-[#F59E0B]">.</span>mate
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto w-full my-auto py-12 text-center flex flex-col items-center">
        {/* Badge status */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[#121110] dark:border-[#F59E0B] bg-[#F59E0B]/15 text-[#121110] dark:text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-6 shadow-[2px_2px_0px_0px_#121110] dark:shadow-[2px_2px_0px_0px_#F59E0B]">
          <Compass className="w-4 h-4 animate-spin [animation-duration:8s]" />
          <span>Tọa độ không xác định</span>
        </div>

        {/* 404 Headline */}
        <div className="relative mb-6">
          <div className="text-8xl sm:text-9xl font-black tracking-tighter text-[#121110] dark:text-[#FAF8F2] select-none">
            4<span className="text-[#F59E0B]">0</span>4
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 text-[#121110] dark:text-[#FAF8F2]">
          Có vẻ nhóm bạn đã rẽ nhầm ngõ rồi!
        </h1>

        <p className="text-sm sm:text-base text-[#121110]/80 dark:text-[#FAF8F2]/80 max-w-lg leading-relaxed mb-8">
          Điểm đến này không có trên lịch trình hoặc vừa được dời sang một địa điểm check-in mới. Đừng lo, trong mỗi chuyến đi cùng hội bạn thân, đôi khi đi lạc lại mở ra những kỷ niệm bất ngờ nhất. Hãy cùng quay lại hành trình nhé!
        </p>

        {/* Primary CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#121110] font-bold text-sm border-2 border-[#121110] shadow-[4px_4px_0px_0px_#121110] dark:shadow-[4px_4px_0px_0px_#FAF8F2] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Về trang chủ TripMate</span>
          </Link>

          <Link
            href="/preview"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-[#1A1816] hover:bg-zinc-100 dark:hover:bg-[#252220] text-[#121110] dark:text-[#FAF8F2] font-bold text-sm border-2 border-[#121110] dark:border-[#F59E0B] shadow-[4px_4px_0px_0px_#121110] dark:shadow-[4px_4px_0px_0px_#F59E0B] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span>Thử bản Demo tính năng</span>
          </Link>
        </div>

        {/* Helpful Internal Links */}
        <div className="w-full max-w-md p-5 rounded-2xl border-2 border-[#121110] dark:border-[#FAF8F2]/20 bg-white/80 dark:bg-[#1A1816]/80 backdrop-blur-xs shadow-[4px_4px_0px_0px_#121110] dark:shadow-[4px_4px_0px_0px_#FAF8F2]/20 text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-[#121110]/60 dark:text-[#FAF8F2]/60 mb-3 flex items-center justify-between">
            <span>Điểm đến gợi ý cho bạn</span>
            <Compass className="w-3.5 h-3.5 text-[#F59E0B]" />
          </div>

          <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
            <Link
              href="/preview"
              className="py-2.5 flex items-center justify-between text-xs font-bold text-[#121110] dark:text-[#FAF8F2] hover:text-[#F59E0B] dark:hover:text-[#F59E0B] transition-colors group"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                Trải nghiệm chia tiền và lên lịch trình
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/privacy"
              className="py-2.5 flex items-center justify-between text-xs font-bold text-[#121110] dark:text-[#FAF8F2] hover:text-[#F59E0B] dark:hover:text-[#F59E0B] transition-colors group"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                Chính sách bảo mật người dùng
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/terms"
              className="py-2.5 flex items-center justify-between text-xs font-bold text-[#121110] dark:text-[#FAF8F2] hover:text-[#F59E0B] dark:hover:text-[#F59E0B] transition-colors group"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#F59E0B]" />
                Điều khoản dịch vụ TripMate
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="max-w-5xl mx-auto w-full pt-6 border-t-2 border-[#121110]/10 dark:border-[#FAF8F2]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#121110]/60 dark:text-[#FAF8F2]/60">
        <span>© 2026 TripMate. Lên kế hoạch chill, chia tiền sòng phẳng.</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-[#121110] dark:hover:text-[#FAF8F2] transition-colors">
            Bảo mật
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[#121110] dark:hover:text-[#FAF8F2] transition-colors">
            Điều khoản
          </Link>
        </div>
      </footer>
    </div>
  );
}
