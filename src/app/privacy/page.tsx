import Link from 'next/link';
import type { Metadata } from 'next';
import { 
  ShieldCheck, 
  ChevronRight, 
  Lock, 
  Camera, 
  Mic, 
  Image as ImageIcon, 
  MapPin, 
  Trash2, 
  Mail, 
  Calendar,
  CheckCircle2,
  Server,
  CreditCard,
  Sparkles
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật | TripMate',
  description: 'Chính sách bảo mật của TripMate. Minh bạch về thu thập dữ liệu chuyến đi, quyền thiết bị camera/micro/ảnh và quyền xóa tài khoản.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] dark:bg-[#121110] text-[#141210] dark:text-[#FAF8F2] transition-colors duration-200 selection:bg-[#F59E0B]/30 font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b-2 border-[#121110]/10 dark:border-[#FAF8F2]/10 bg-[#FAF8F2]/90 dark:bg-[#121110]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#F59E0B] border-2 border-[#121110] dark:border-[#FAF8F2] flex items-center justify-center text-[#121110] font-black text-xs shadow-[2px_2px_0px_0px_#121110] dark:shadow-[2px_2px_0px_0px_#FAF8F2]">
                TM
              </div>
              <span className="font-extrabold text-[#121110] dark:text-[#FAF8F2] text-lg">
                trip<span className="text-[#F59E0B]">.</span>mate
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[70ch] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#141210]/60 dark:text-[#FAF8F2]/60">
          <Link href="/" className="hover:text-[#F59E0B] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[#141210] dark:text-[#FAF8F2] font-bold">
            Chính sách bảo mật
          </span>
        </nav>

        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#121110] dark:border-[#F59E0B] bg-[#F59E0B]/15 text-[#121110] dark:text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0px_0px_#121110] dark:shadow-[2px_2px_0px_0px_#F59E0B]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quyền riêng tư & Bảo vệ dữ liệu</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141210] dark:text-[#FAF8F2] mb-3">
            Chính sách bảo mật
          </h1>

          <div className="flex items-center gap-2 text-xs text-[#141210]/60 dark:text-[#FAF8F2]/60 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Cập nhật lần cuối: Ngày 03 tháng 10 năm 2026</span>
          </div>
        </div>

        {/* Fast Summary Callout */}
        <div className="p-5 sm:p-6 rounded-2xl border-2 border-[#121110] dark:border-[#F59E0B] bg-white dark:bg-[#1A1816] shadow-[4px_4px_0px_0px_#121110] dark:shadow-[4px_4px_0px_0px_#F59E0B] mb-10">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#F59E0B]" />
            Cam kết cốt lõi từ TripMate
          </h2>
          <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-[#141210]/80 dark:text-[#FAF8F2]/80 leading-relaxed font-medium">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
              <span><strong>Không theo dõi vị trí nền:</strong> TripMate tuyệt đối không chạy định vị ngầm khi bạn không mở app.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
              <span><strong>Quyền kiểm soát ảnh:</strong> Chỉ tải lên những ảnh bạn chủ động chọn chụp hoặc đăng tải.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
              <span><strong>Xóa tài khoản dễ dàng:</strong> Bạn có quyền xóa vĩnh viễn tài khoản và toàn bộ dữ liệu trực tiếp trong app bất kỳ lúc nào.</span>
            </li>
          </ul>
        </div>

        {/* Policy Content Sections */}
        <div className="flex flex-col gap-10 text-sm sm:text-base leading-relaxed text-[#141210]/90 dark:text-[#FAF8F2]/90">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">1</span>
              Giới thiệu chung
            </h2>
            <p className="mb-3">
              Chào mừng bạn đến với TripMate. Chúng tôi phát triển TripMate nhằm mang đến nền tảng du lịch nhóm tiện lợi, giúp bạn và bạn bè lên lịch trình, chia tiền sòng phẳng và lưu lại kỷ niệm những chuyến đi.
            </p>
            <p>
              Chính sách bảo mật này giải thích rõ ràng những thông tin chúng tôi thu thập, mục đích sử dụng, cách thức lưu trữ và quyền của bạn đối với dữ liệu cá nhân khi sử dụng ứng dụng di động TripMate cũng như website tripmate.app.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">2</span>
              Dữ liệu chúng tôi thu thập
            </h2>
            <p className="mb-3">
              Chúng tôi chỉ thu thập các dữ liệu cần thiết phục vụ trực tiếp cho tính năng của chuyến đi:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mb-3">
              <li>
                <strong>Thông tin tài khoản:</strong> Địa chỉ email, tên hiển thị, ảnh đại diện khi bạn đăng ký hoặc đăng nhập. Nếu sử dụng phương thức đăng nhập bằng mã xác thực OTP qua SMS, chúng tôi sẽ xử lý số điện thoại của bạn.
              </li>
              <li>
                <strong>Dữ liệu chuyến đi:</strong> Tên chuyến đi, thời gian, lịch trình các địa điểm ghé thăm, danh sách đồ đạc cần chuẩn bị và ghi chú nội bộ của nhóm.
              </li>
              <li>
                <strong>Dữ liệu chi tiêu nhóm:</strong> Các khoản chi tiêu, số tiền, tên người chi trả, danh sách thành viên chia tiền và hình ảnh hóa đơn do bạn đính kèm để đối soát.
              </li>
              <li>
                <strong>Nội dung khoảnh khắc (Moments):</strong> Hình ảnh và video do bạn chủ động chụp hoặc chọn tải lên album chung của chuyến đi để chia sẻ cùng nhóm.
              </li>
              <li>
                <strong>Mã định danh thiết bị (chống gian lận):</strong> Khi bạn bắt đầu dùng thử Premium, ứng dụng gửi Android ID của máy, dải mạng (IP) và kết quả kiểm tra Google Play Integrity. Máy chủ chỉ lưu bản băm một chiều (không đảo ngược được) của các giá trị này, dùng duy nhất để mỗi thiết bị chỉ nhận một lần dùng thử. Không dùng cho quảng cáo, không chia sẻ cho bên thứ ba.
              </li>
              <li>
                <strong>Mã thông báo đẩy:</strong> Mã Firebase Cloud Messaging của máy để gửi thông báo về chuyến đi. Mã này bị xoá khi bạn đăng xuất hoặc xoá tài khoản.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">3</span>
              Quyền thiết bị trên ứng dụng di động
            </h2>
            <p className="mb-3">
              Để các tính năng hoạt động trơn tru, ứng dụng TripMate cần sự cho phép của bạn đối với các quyền thiết bị sau:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="p-4 rounded-xl border border-[#121110]/15 dark:border-[#FAF8F2]/15 bg-white/50 dark:bg-[#181615]">
                <Camera className="w-5 h-5 text-[#F59E0B] mb-2" />
                <h3 className="text-xs font-bold uppercase mb-1">Máy ảnh (Camera)</h3>
                <p className="text-xs text-[#141210]/70 dark:text-[#FAF8F2]/70">Chụp ảnh khoảnh khắc trực tiếp và quét ảnh hóa đơn chi tiêu.</p>
              </div>

              <div className="p-4 rounded-xl border border-[#121110]/15 dark:border-[#FAF8F2]/15 bg-white/50 dark:bg-[#181615]">
                <Mic className="w-5 h-5 text-[#F59E0B] mb-2" />
                <h3 className="text-xs font-bold uppercase mb-1">Microphone (Micro)</h3>
                <p className="text-xs text-[#141210]/70 dark:text-[#FAF8F2]/70">Ghi lại âm thanh khi bạn quay video trong tính năng khoảnh khắc.</p>
              </div>

              <div className="p-4 rounded-xl border border-[#121110]/15 dark:border-[#FAF8F2]/15 bg-white/50 dark:bg-[#181615]">
                <ImageIcon className="w-5 h-5 text-[#F59E0B] mb-2" />
                <h3 className="text-xs font-bold uppercase mb-1">Thư viện ảnh</h3>
                <p className="text-xs text-[#141210]/70 dark:text-[#FAF8F2]/70">Mở bộ chọn ảnh hệ thống để bạn chủ động chọn ảnh tải lên.</p>
              </div>
            </div>
            <p className="text-xs text-[#141210]/70 dark:text-[#FAF8F2]/70">
              Bạn có thể bật hoặc tắt các quyền này bất kỳ lúc nào trong phần Cài đặt hệ điều hành của thiết bị di động.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">4</span>
              Vị trí và dữ liệu tọa độ EXIF
            </h2>
            <div className="p-4 rounded-xl border-l-4 border-l-[#F59E0B] bg-[#F59E0B]/10 dark:bg-[#F59E0B]/5 my-3">
              <div className="flex items-center gap-2 font-bold text-sm mb-1 text-[#141210] dark:text-[#FAF8F2]">
                <MapPin className="w-4 h-4 text-[#F59E0B]" />
                Không thu thập vị trí chạy ngầm
              </div>
              <p className="text-xs sm:text-sm text-[#141210]/80 dark:text-[#FAF8F2]/80">
                TripMate <strong>không yêu cầu quyền truy cập vị trí nền (background location)</strong> và không theo dõi bước chân di chuyển của bạn.
              </p>
            </div>
            <p>
              Khi bạn chủ động tải ảnh lên mục Khoảnh khắc, ứng dụng có thể đọc tọa độ địa lý sẵn có trong siêu dữ liệu EXIF của bức ảnh (nếu camera thiết bị bạn đã lưu sẵn) để tự động hiển thị địa danh check-in trên bản đồ kỷ niệm của chuyến đi. Bạn hoàn toàn có thể tắt tính năng ghi vị trí ảnh trong cài đặt camera của điện thoại.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">5</span>
              Nhà cung cấp dịch vụ bên thứ ba
            </h2>
            <p className="mb-3">
              Chúng tôi hợp tác với các đơn vị uy tín nhằm vận hành hệ thống một cách an toàn và bảo mật:
            </p>
            <ul className="flex flex-col gap-2.5">
              <li className="flex items-start gap-2">
                <Server className="w-4 h-4 text-[#F59E0B] shrink-0 mt-1" />
                <span><strong>Cloudinary:</strong> Lưu trữ hình ảnh, video khoảnh khắc và ảnh hóa đơn; truyền tải qua HTTPS.</span>
              </li>
              <li className="flex items-start gap-2">
                <Server className="w-4 h-4 text-[#F59E0B] shrink-0 mt-1" />
                <span><strong>Supabase và Render:</strong> Cơ sở dữ liệu và máy chủ ứng dụng lưu dữ liệu tài khoản, chuyến đi, chi tiêu.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#F59E0B] shrink-0 mt-1" />
                <span><strong>Google Play (Billing, Integrity) và Firebase Cloud Messaging:</strong> Xác minh giao dịch mua gói qua Google Play, kiểm tra thiết bị khi dùng thử, và gửi thông báo đẩy.</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#F59E0B] shrink-0 mt-1" />
                <span><strong>Twilio:</strong> Gửi mã xác thực OTP qua SMS khi bạn đăng nhập bằng số điện thoại.</span>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-[#F59E0B] shrink-0 mt-1" />
                <span><strong>Google (Google Authentication):</strong> Cung cấp dịch vụ đăng nhập an toàn, tiện lợi bằng tài khoản Google.</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0 mt-1" />
                <span><strong>Google Gemini (Trí tuệ nhân tạo AI):</strong> Xử lý các yêu cầu gợi ý lịch trình thông minh dựa trên câu hỏi của bạn. Dữ liệu gửi đi chỉ là nội dung câu hỏi về địa điểm, không bao gồm danh tính cá nhân.</span>
              </li>
              <li className="flex items-start gap-2">
                <CreditCard className="w-4 h-4 text-[#F59E0B] shrink-0 mt-1" />
                <span><strong>Cổng thanh toán điện tử (Google Play, chuyển khoản VietQR qua SePay, Momo, ZaloPay):</strong> Xử lý thanh toán khi bạn nâng cấp gói dịch vụ Premium. TripMate không trực tiếp lưu trữ số thẻ tín dụng hay tài khoản ngân hàng của bạn.</span>
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">6</span>
              Lưu trữ và an toàn thông tin
            </h2>
            <p className="mb-3">
              Dữ liệu của bạn được truyền tải qua giao thức mã hóa HTTPS/TLS tiêu chuẩn ngành. Cơ sở dữ liệu của chúng tôi được phân quyền nghiêm ngặt, chỉ các dịch vụ được cấp phép mới có quyền đọc và ghi dữ liệu phục vụ người dùng.
            </p>
            <p>
              Chúng tôi cam kết không bán, không thương mại hóa dữ liệu cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích quảng cáo rác.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">7</span>
              Quyền của bạn và hướng dẫn xóa tài khoản
            </h2>
            <p className="mb-3">
              Bạn luôn nắm quyền làm chủ dữ liệu của mình trên TripMate:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mb-4">
              <li>Bạn có quyền xem và chỉnh sửa thông tin cá nhân bất cứ lúc nào trong ứng dụng.</li>
              <li>Bạn có quyền xóa các chuyến đi, chi tiêu, và hình ảnh do mình đăng tải.</li>
            </ul>

            <div className="p-5 rounded-2xl border-2 border-[#121110] dark:border-[#FAF8F2]/30 bg-[#FAF8F2] dark:bg-[#1E1B19] shadow-[3px_3px_0px_0px_#121110] dark:shadow-[3px_3px_0px_0px_#FAF8F2]/30">
              <h3 className="text-sm font-extrabold uppercase text-[#141210] dark:text-[#FAF8F2] mb-2 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                Quy trình xóa tài khoản trực tiếp trong ứng dụng
              </h3>
              <p className="text-xs sm:text-sm text-[#141210]/80 dark:text-[#FAF8F2]/80 mb-3">
                Bạn có thể tự tay xóa vĩnh viễn tài khoản TripMate mà không cần chờ phê duyệt thủ công. Vui lòng thực hiện theo các bước sau ngay trên điện thoại:
              </p>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold bg-white dark:bg-[#121110] p-3 rounded-xl border border-[#121110]/20 dark:border-[#FAF8F2]/20 text-[#141210] dark:text-[#FAF8F2]">
                <span>Cài đặt</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Quyền riêng tư</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="text-red-600 dark:text-red-400">Xóa tài khoản</span>
              </div>
              <p className="text-xs text-[#141210]/60 dark:text-[#FAF8F2]/60 mt-3">
                Sau khi xác nhận xóa, chúng tôi xoá ngay: email, tên, tên đăng nhập, mật khẩu, ảnh đại diện, giới thiệu, mã thông báo đẩy, tài khoản ngân hàng đã liên kết, bucket list cá nhân, trạng thái trực tuyến và thông báo. Khoản chi, ảnh và tin nhắn bạn đã đóng góp vào chuyến đi chung được giữ lại cho các thành viên khác nhưng hiển thị dưới tên &quot;Người dùng đã xoá&quot;. Lịch sử đơn thanh toán được lưu theo nghĩa vụ kế toán.
              </p>
              <p className="text-xs text-[#141210]/60 dark:text-[#FAF8F2]/60 mt-2">
                Không còn truy cập được ứng dụng? Xem <Link href="/delete-account" className="underline hover:text-[#F59E0B]">hướng dẫn yêu cầu xoá tài khoản qua email</Link>. Gói mua qua Google Play cần được huỷ trong Google Play; xoá tài khoản không tự dừng gia hạn.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">8</span>
              Thông tin liên hệ
            </h2>
            <p className="mb-3">
              Nếu bạn có bất kỳ câu hỏi, thắc mắc hoặc yêu cầu nào liên quan đến chính sách bảo mật và quyền riêng tư dữ liệu của TripMate, vui lòng liên hệ với chúng tôi qua:
            </p>
            <div className="p-4 rounded-xl border-2 border-[#121110] dark:border-[#F59E0B] bg-white dark:bg-[#181615] flex items-center gap-3 shadow-[2px_2px_0px_0px_#121110] dark:shadow-[2px_2px_0px_0px_#F59E0B]">
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#141210]/60 dark:text-[#FAF8F2]/60">Hòm thư hỗ trợ quyền riêng tư:</div>
                <a
                  href="mailto:thihtktk03@gmail.com"
                  className="text-sm font-bold text-[#141210] dark:text-[#FAF8F2] hover:text-[#F59E0B] dark:hover:text-[#F59E0B] transition-colors"
                >
                  thihtktk03@gmail.com
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Navigation Links */}
        <div className="mt-14 pt-8 border-t-2 border-[#121110]/10 dark:border-[#FAF8F2]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[#141210]/70 dark:text-[#FAF8F2]/70">
          <Link href="/" className="hover:text-[#F59E0B] transition-colors">
            Quay lại trang chủ TripMate
          </Link>
          <Link href="/terms" className="hover:text-[#F59E0B] transition-colors">
            Xem Điều khoản dịch vụ
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#121110]/10 dark:border-[#FAF8F2]/10 py-8 text-center text-xs text-[#141210]/50 dark:text-[#FAF8F2]/50">
        <div className="max-w-5xl mx-auto px-4">
          <p>© 2026 TripMate. Mọi quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}
