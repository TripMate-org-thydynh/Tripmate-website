'use client';

import Link from 'next/link';
import TripMateLogo from '@/components/TripMateLogo';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-200/80 dark:border-zinc-800/80">
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link
              href="/"
              className="flex items-center gap-2 mb-3"
            >
              <TripMateLogo size="sm" withText variant="badge" />
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed mb-4 font-normal">
              Nền tảng quản lý chuyến đi nhóm số 1 cho Gen Z. Lên kế hoạch chill, chia tiền sòng phẳng và lưu giữ mọi khoảnh khắc thanh xuân cùng hội bạn thân.
            </p>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
              Phiên bản 1.2.0 • Stable Release
            </span>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
              Khám phá tính năng
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <li>
                <a href="#planning" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Lập lịch trình đồng đội
                </a>
              </li>
              <li>
                <a href="#expenses" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Chia tiền sòng phẳng VietQR
                </a>
              </li>
              <li>
                <a href="#gamification" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Vòng quay & Trip Bingo
                </a>
              </li>
              <li>
                <a href="#memories" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Album ảnh gốc & Ghost Cam
                </a>
              </li>
              <li>
                <a href="#ai" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Trợ lý du lịch AI
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
              Hỗ trợ & Pháp lý
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <li>
                <a href="#faq" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <span className="text-zinc-400 dark:text-zinc-500">
                  Cộng đồng phượt thủ TripMate Squad (Sắp ra mắt)
                </span>
              </li>
              <li>
                <a
                  href="mailto:thihtktk03@gmail.com"
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  Email hỗ trợ: thihtktk03@gmail.com
                </a>
              </li>
              <li className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                Phản hồi trong vòng 24 giờ vào ngày làm việc.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-normal">
          <div className="flex items-center gap-1.5">
            <span>© 2026 TripMate. Thiết kế với</span>
            <Heart className="w-3.5 h-3.5 text-[#F95738] fill-current" />
            <span>cho những chuyến đi thanh xuân của bạn.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">Bảo mật dữ liệu</Link>
            <Link href="/terms" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">Điều khoản dịch vụ</Link>
            <span>Tiêu chuẩn bảo mật VietQR NAPAS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
