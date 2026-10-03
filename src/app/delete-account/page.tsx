import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronRight, Mail, Trash2 } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

// Google Play bắt buộc có một URL công khai để người dùng yêu cầu xoá tài
// khoản mà không cần mở app (khai trong mục Data safety). Nội dung phải khớp
// với UsersService.deleteAccount ở backend.
export const metadata: Metadata = {
  title: 'Xoá tài khoản | TripMate',
  description: 'Cách xoá tài khoản TripMate và dữ liệu đi kèm, trong ứng dụng hoặc qua email.',
};

const SUPPORT = 'thihtktk03@gmail.com';

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] dark:bg-[#121110] text-[#141210] dark:text-[#FAF8F2] font-sans">
      <header className="sticky top-0 z-40 w-full border-b-2 border-[#121110]/10 dark:border-[#FAF8F2]/10 bg-[#FAF8F2]/90 dark:bg-[#121110]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg">
            trip<span className="text-[#F59E0B]">.</span>mate
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-[70ch] mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col gap-8 text-sm sm:text-base leading-relaxed">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-[#141210]/60 dark:text-[#FAF8F2]/60">
          <Link href="/" className="hover:text-[#F59E0B]">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[#141210] dark:text-[#FAF8F2] font-bold">Xoá tài khoản</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Trash2 className="w-7 h-7 text-red-500" />
          Xoá tài khoản TripMate
        </h1>

        <section>
          <h2 className="text-xl font-bold mb-3">Cách 1 — Trong ứng dụng (xoá ngay)</h2>
          <p className="mb-3">Mở TripMate rồi vào:</p>
          <p className="font-bold p-3 rounded-xl border border-[#121110]/20 dark:border-[#FAF8F2]/20 bg-white dark:bg-[#181615]">
            Hồ sơ → Cài đặt → Quyền riêng tư → Xoá tài khoản
          </p>
          <p className="mt-3">Tài khoản bị xoá ngay khi bạn xác nhận, không cần chờ duyệt.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Cách 2 — Qua email (khi không vào được ứng dụng)</h2>
          <p className="mb-3">
            Gửi email tới hòm thư bên dưới với tiêu đề <strong>&quot;Xoá tài khoản TripMate&quot;</strong>, ghi tên đăng nhập
            hoặc email bạn dùng để đăng nhập. Gửi từ đúng email đó nếu có thể, để chúng tôi xác minh bạn là chủ tài khoản.
            Chúng tôi xử lý trong vòng 7 ngày làm việc và trả lời khi đã xoá xong.
          </p>
          <a
            href={`mailto:${SUPPORT}?subject=${encodeURIComponent('Xoá tài khoản TripMate')}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#121110] dark:border-[#F59E0B] bg-white dark:bg-[#181615] font-bold hover:text-[#F59E0B]"
          >
            <Mail className="w-4 h-4" />
            {SUPPORT}
          </a>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Dữ liệu bị xoá</h2>
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li>Email, tên hiển thị, tên đăng nhập, mật khẩu, ảnh đại diện, phần giới thiệu.</li>
            <li>Mã thông báo đẩy của thiết bị, trạng thái trực tuyến, thông báo.</li>
            <li>Tài khoản ngân hàng và thẻ đã liên kết, bucket list cá nhân.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Dữ liệu được giữ lại</h2>
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li>
              Khoản chi, ảnh và tin nhắn bạn đã thêm vào <strong>chuyến đi chung</strong>: giữ lại để sổ chia tiền của các
              thành viên khác không bị sai, hiển thị dưới tên &quot;Người dùng đã xoá&quot;. Bạn có thể tự xoá những mục này
              trước khi xoá tài khoản.
            </li>
            <li>Lịch sử đơn thanh toán: lưu theo nghĩa vụ kế toán, thuế, không gắn với hồ sơ cá nhân nào nữa.</li>
            <li>Bản băm một chiều của mã thiết bị dùng để chống lạm dụng gói dùng thử: tối đa 12 tháng.</li>
          </ul>
        </section>

        <section className="p-4 rounded-xl border-l-4 border-l-[#F59E0B] bg-[#F59E0B]/10">
          <strong>Gói mua qua Google Play:</strong> xoá tài khoản không tự huỷ gói. Hãy huỷ trong Google Play
          (Thanh toán và gói thuê bao → Gói thuê bao) để không bị trừ tiền kỳ sau.
        </section>

        <div className="pt-6 border-t-2 border-[#121110]/10 dark:border-[#FAF8F2]/10 flex flex-wrap justify-between gap-4 text-xs font-bold">
          <Link href="/privacy" className="hover:text-[#F59E0B]">Chính sách bảo mật</Link>
          <Link href="/terms" className="hover:text-[#F59E0B]">Điều khoản dịch vụ</Link>
        </div>
      </main>
    </div>
  );
}
