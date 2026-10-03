import Link from 'next/link';
import type { Metadata } from 'next';
import { 
  FileText, 
  ChevronRight, 
  UserCheck, 
  UploadCloud, 
  CreditCard, 
  AlertTriangle, 
  Scale, 
  Mail, 
  Calendar,
  Sparkles
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Điều khoản dịch vụ | TripMate',
  description: 'Điều khoản dịch vụ và quy chế sử dụng ứng dụng TripMate. Quy định quyền và trách nhiệm về tài khoản, nội dung chuyến đi, thanh toán gói Premium.',
};

export default function TermsOfServicePage() {
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
            Điều khoản dịch vụ
          </span>
        </nav>

        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#121110] dark:border-[#F59E0B] bg-[#F59E0B]/15 text-[#121110] dark:text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0px_0px_#121110] dark:shadow-[2px_2px_0px_0px_#F59E0B]">
            <FileText className="w-3.5 h-3.5" />
            <span>Quy chế sử dụng & Thỏa thuận người dùng</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141210] dark:text-[#FAF8F2] mb-3">
            Điều khoản dịch vụ
          </h1>

          <div className="flex items-center gap-2 text-xs text-[#141210]/60 dark:text-[#FAF8F2]/60 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Cập nhật lần cuối: Ngày 07 tháng 09 năm 2026</span>
          </div>
        </div>

        {/* Introduction Callout */}
        <div className="p-5 sm:p-6 rounded-2xl border-2 border-[#121110] dark:border-[#F59E0B] bg-white dark:bg-[#1A1816] shadow-[4px_4px_0px_0px_#121110] dark:shadow-[4px_4px_0px_0px_#F59E0B] mb-10">
          <p className="text-xs sm:text-sm text-[#141210]/80 dark:text-[#FAF8F2]/80 leading-relaxed font-medium">
            Bằng việc tải xuống, cài đặt hoặc truy cập ứng dụng TripMate (cũng như website tripmate.app), bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý chịu sự ràng buộc bởi các điều khoản này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngưng sử dụng ứng dụng.
          </p>
        </div>

        {/* Terms Content Sections */}
        <div className="flex flex-col gap-10 text-sm sm:text-base leading-relaxed text-[#141210]/90 dark:text-[#FAF8F2]/90">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">1</span>
              Dịch vụ TripMate cung cấp
            </h2>
            <p className="mb-3">
              TripMate là nền tảng quản lý chuyến đi du lịch nhóm, hỗ trợ người dùng:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>Lập kế hoạch lịch trình di chuyển chi tiết theo ngày.</li>
              <li>Ghi chép và tự động phân chia chi phí giữa các thành viên trong nhóm.</li>
              <li>Quản lý danh sách hành lý cần mang theo.</li>
              <li>Lưu trữ khoảnh khắc (ảnh và video) trong album nhóm.</li>
              <li>Nhận gợi ý địa điểm và lịch trình qua tính năng trợ lý du lịch AI.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">2</span>
              Tài khoản người dùng và bảo mật
            </h2>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-[#121110]/15 dark:border-[#FAF8F2]/15 bg-white/50 dark:bg-[#181615] my-3">
              <UserCheck className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold mb-1">Trách nhiệm bảo vệ tài khoản</p>
                <p className="text-[#141210]/70 dark:text-[#FAF8F2]/70">
                  Bạn có trách nhiệm bảo mật thông tin đăng nhập, mã xác thực OTP hoặc phiên đăng nhập qua tài khoản Google. Bạn chịu trách nhiệm về tất cả các hành động được thực hiện dưới tài khoản của mình.
                </p>
              </div>
            </div>
            <p>
              Bạn cam kết cung cấp thông tin chính xác, cập nhật khi tạo hồ sơ. Nếu bạn phát hiện bất kỳ dấu hiệu truy cập trái phép nào, hãy liên hệ ngay với chúng tôi để được trợ giúp bảo vệ tài khoản.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">3</span>
              Nội dung do người dùng đăng tải
            </h2>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-[#121110]/15 dark:border-[#FAF8F2]/15 bg-white/50 dark:bg-[#181615] my-3">
              <UploadCloud className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold mb-1">Quyền sở hữu nội dung</p>
                <p className="text-[#141210]/70 dark:text-[#FAF8F2]/70">
                  Bạn giữ toàn quyền sở hữu đối với các hình ảnh, nội dung ghi chú, và lịch trình mà bạn tải lên TripMate. Bạn cấp cho TripMate giấy phép kỹ thuật có giới hạn để lưu trữ và hiển thị nội dung đó cho các thành viên trong nhóm của bạn.
                </p>
              </div>
            </div>
            <p className="mb-2"><strong>Quy định nghiêm cấm:</strong> Người dùng không được phép đăng tải các nội dung:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 text-xs sm:text-sm">
              <li>Vi phạm pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.</li>
              <li>Chứa hình ảnh bạo lực, khiêu dâm, đồi trụy hoặc quấy rối người khác.</li>
              <li>Xâm phạm bản quyền hoặc quyền sở hữu trí tuệ của bên thứ ba.</li>
              <li>Phát tán mã độc, đường link lừa đảo hoặc thư rác.</li>
            </ul>
            <p className="text-xs text-[#141210]/70 dark:text-[#FAF8F2]/70 mt-3">
              Chúng tôi bảo lưu quyền gỡ bỏ nội dung hoặc khóa tài khoản vi phạm các quy định trên mà không cần thông báo trước.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">4</span>
              Gói dịch vụ Premium và thanh toán
            </h2>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-[#121110]/15 dark:border-[#FAF8F2]/15 bg-white/50 dark:bg-[#181615] my-3">
              <CreditCard className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold mb-1">Minh bạch giá cước và cổng thanh toán</p>
                <p className="text-[#141210]/70 dark:text-[#FAF8F2]/70">
                  Một số tính năng nâng cao có thể được cung cấp dưới dạng gói trả phí (Premium). Mức phí và quyền lợi của gói được niêm yết rõ ràng trước khi bạn tiến hành thanh toán.
                </p>
              </div>
            </div>
            <p className="mb-3">
              Giao dịch được thực hiện thông qua các cổng thanh toán trung gian được cấp phép tại Việt Nam (như Momo, ZaloPay, VNPay). Chúng tôi tuân thủ chính sách hoàn tiền theo quy định cụ thể của từng chiến dịch khuyến mại hoặc lỗi kỹ thuật phát sinh từ phía hệ thống TripMate.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">5</span>
              Giới hạn trách nhiệm và tính năng AI
            </h2>
            <div className="p-4 rounded-xl border-l-4 border-l-amber-500 bg-amber-500/10 dark:bg-amber-500/5 my-3">
              <div className="flex items-center gap-2 font-bold text-sm mb-1 text-[#141210] dark:text-[#FAF8F2]">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                Lưu ý đối với gợi ý từ AI
              </div>
              <p className="text-xs sm:text-sm text-[#141210]/80 dark:text-[#FAF8F2]/80">
                Tính năng Trợ lý AI du lịch sử dụng mô hình trí tuệ nhân tạo để đưa ra gợi ý hành trình và điểm đến mang tính chất tham khảo. Bạn nên chủ động xác minh lại giờ mở cửa, giá vé thực tế và quy định tại địa phương.
              </p>
            </div>
            <p className="mb-2">
              TripMate không chịu trách nhiệm đối với các rủi ro phát sinh từ các thỏa thuận chi tiêu nội bộ giữa các cá nhân trong nhóm của bạn, hoặc các sự cố xảy ra trong quá trình bạn du lịch thực tế tại các điểm đến.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">6</span>
              Thay đổi điều khoản dịch vụ
            </h2>
            <p className="mb-3">
              Chúng tôi có thể cập nhật các điều khoản này theo thời gian để đáp ứng sự phát triển của sản phẩm hoặc thay đổi trong quy định pháp luật. Phiên bản cập nhật sẽ được công bố trên website và hiển thị ngày cập nhật mới nhất. Việc bạn tiếp tục sử dụng ứng dụng sau ngày cập nhật đồng nghĩa với việc bạn chấp thuận các nội dung mới.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">7</span>
              Luật điều chỉnh và giải quyết tranh chấp
            </h2>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-[#121110]/15 dark:border-[#FAF8F2]/15 bg-white/50 dark:bg-[#181615] my-3">
              <Scale className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold mb-1">Pháp luật áp dụng: Việt Nam</p>
                <p className="text-[#141210]/70 dark:text-[#FAF8F2]/70">
                  Các điều khoản này được diễn giải và điều chỉnh theo pháp luật của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi bất đồng hoặc tranh chấp phát sinh sẽ trước hết được giải quyết thông qua thương lượng hòa giải trên tinh thần tôn trọng lẫn nhau.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-bold text-[#141210] dark:text-[#FAF8F2] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-[#121110] font-black text-xs inline-flex items-center justify-center">8</span>
              Thông tin liên hệ
            </h2>
            <p className="mb-3">
              Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào về Điều khoản dịch vụ của TripMate, xin vui lòng gửi thư cho chúng tôi:
            </p>
            <div className="p-4 rounded-xl border-2 border-[#121110] dark:border-[#F59E0B] bg-white dark:bg-[#181615] flex items-center gap-3 shadow-[2px_2px_0px_0px_#121110] dark:shadow-[2px_2px_0px_0px_#F59E0B]">
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#141210]/60 dark:text-[#FAF8F2]/60">Email tiếp nhận ý kiến:</div>
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
          <Link href="/privacy" className="hover:text-[#F59E0B] transition-colors">
            Xem Chính sách bảo mật
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
