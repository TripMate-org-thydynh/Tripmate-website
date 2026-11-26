import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ChevronDown, MapPin, Menu } from 'lucide-react';
import { TripJourney } from '@/components/landing/TripJourney';
import { TripMateMark } from '@/components/TripMateMark';
import ThemeToggle from '@/components/ThemeToggle';
import './landing.css';

export const metadata: Metadata = {
  title: 'TripMate — Lên kế hoạch du lịch cùng bạn bè',
  description: 'Lập lịch trình, chia chi phí và lưu ảnh chung cho chuyến đi cùng bạn bè.',
  openGraph: {
    title: 'TripMate — Lên kế hoạch du lịch cùng bạn bè',
    description: 'Lập lịch trình, chia chi phí và lưu ảnh chung cho chuyến đi cùng bạn bè.',
    type: 'website',
    images: [{ url: '/tripmate/da-lat/pine-forest.jpg', width: 1700, height: 1133, alt: 'Rừng thông Đà Lạt' }],
  },
  metadataBase: new URL('https://tripmate-web-nine.vercel.app'),
};

const sections = [
  { id: 'features', label: 'Tính năng' },
  { id: 'story', label: 'Chuyến đi mẫu' },
  { id: 'faq', label: 'Hỏi đáp' },
];

const days = [
  { day: 'Ngày 1', title: 'Đến Đà Lạt', stops: ['14:00 · Nhận phòng', '17:30 · Dạo quanh hồ Xuân Hương'] },
  { day: 'Ngày 2', title: 'Một ngày giữa rừng thông', stops: ['07:00 · Khởi hành đi hồ Tuyền Lâm', '12:00 · Ăn trưa cùng nhóm'] },
  { day: 'Ngày 3', title: 'Cà phê trước khi về', stops: ['08:30 · Hẹn cà phê trong phố', '11:00 · Trả phòng'] },
];

const questions = [
  { question: 'Có thể xem TripMate trước khi tải app không?', answer: 'Có. Mở bản xem thử trên trình duyệt để làm quen với giao diện và cách tổ chức chuyến đi.' },
  { question: 'TripMate chia tiền cho cả nhóm như thế nào?', answer: 'Mỗi khoản ghi rõ người đã thanh toán và những ai cùng chia. Cả nhóm có thể xem số tiền còn cần thanh toán.' },
  { question: 'TripMate có bán tour hay nhận đặt phòng không?', answer: 'TripMate giúp bạn tổ chức chuyến đi tự túc. Bạn tự đặt dịch vụ với nhà cung cấp và lưu thông tin đặt chỗ trong chuyến đi.' },
];

export default function LandingPage() {
  return (
    <div className="tripmate-landing">
      <a className="travel-skip" href="#landing-main">Đến nội dung chính</a>
      <header className="travel-header">
        <div className="travel-wrap travel-header-inner">
          <Link href="/" className="travel-wordmark" aria-label="Trang chủ TripMate">
            <TripMateMark size={32} />
            <span>TripMate</span>
          </Link>
          <nav className="travel-desktop-nav" aria-label="Điều hướng chính">
            {sections.map(({ id, label }) => <a key={id} href={'#' + id}>{label}</a>)}
          </nav>
          <div className="travel-header-actions">
            <ThemeToggle className="travel-theme" variant="consumer" />
            <Link className="travel-button travel-button-small" href="/preview">Xem thử <ArrowRight aria-hidden="true" size={15} /></Link>
            <details className="travel-mobile-menu">
              <summary aria-label="Menu TripMate"><Menu aria-hidden="true" size={20} /></summary>
              <nav aria-label="Điều hướng mobile">
                {sections.map(({ id, label }) => <a key={id} href={'#' + id}>{label}</a>)}
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main id="landing-main" tabIndex={-1}>
        <section className="travel-hero" aria-labelledby="travel-title">
          <div className="travel-wrap travel-hero-inner">
            <div className="travel-hero-copy">
              <h1 id="travel-title"><span>Cùng hội</span><span>lên đường.</span></h1>
              <p className="travel-intro">Lên lịch, chia tiền và giữ ảnh chung cho chuyến đi cùng bạn bè.</p>
              <Link className="travel-button travel-hero-cta" href="/preview">Mở bản xem thử <ArrowRight aria-hidden="true" size={18} /></Link>
            </div>
            <div className="travel-hero-scene">
              <div className="travel-hero-contours" aria-hidden="true" />
              <svg className="travel-hero-route" viewBox="0 0 890 520" fill="none" aria-hidden="true">
                <path d="M-65 480C123 485 65 311 202 316c114 4 87 127 209 134 160 9 101-164 234-182 94-13 187 67 228-28 24-54-30-97 17-142" pathLength="1" />
              </svg>
              <Image className="travel-squad" src="/tripmate/brand/ill_squad.svg" alt="Bốn người bạn cùng chụp ảnh trong chuyến đi" width={513} height={720} preload unoptimized />
            </div>
            <div className="travel-hero-links">
              <a className="travel-scroll-link" href="#features"><span><ArrowDown aria-hidden="true" size={18} /></span> Khám phá TripMate</a>
              <a className="travel-destination-link" href="#story"><MapPin aria-hidden="true" size={17} /> Đà Lạt, Lâm Đồng <ArrowRight aria-hidden="true" size={14} /></a>
            </div>
          </div>
        </section>

        <TripJourney />

        <section className="travel-wrap travel-story" id="story" aria-labelledby="story-title">
          <figure className="travel-photo">
            <div className="travel-photo-frame">
              <Image src="/tripmate/da-lat/pine-forest.jpg" alt="Nắng chiếu qua những hàng thông ở Đà Lạt" fill sizes="(max-width: 760px) 92vw, 46vw" />
            </div>
            <figcaption><span>Đà Lạt, Lâm Đồng</span><a href="https://www.pexels.com/photo/scenic-pine-tree-forest-in-dalat-vietnam-35731564/">Ảnh Quang Vuong</a></figcaption>
          </figure>
          <div className="travel-story-content">
            <p className="travel-kicker">Chuyến đi mẫu</p>
            <h2 id="story-title">Ba ngày ở Đà Lạt</h2>
            <p className="travel-section-intro">Một lịch trình cuối tuần để cả nhóm cùng xem trước khi lên đường.</p>
            <dl className="travel-itinerary">
              {days.map(({ day, title, stops }, index) => (
                <div className="travel-day" key={day}>
                  <dt>{day}</dt>
                  <dd>
                    <details name="tripmate-itinerary" open={index === 0}>
                      <summary>{title} <ChevronDown size={17} aria-hidden="true" /></summary>
                      <ul>{stops.map((stop) => <li key={stop}>{stop}</li>)}</ul>
                    </details>
                  </dd>
                </div>
              ))}
            </dl>
            <Link className="travel-text-link" href="/preview">Khám phá bản xem thử <ArrowRight aria-hidden="true" size={16} /></Link>
          </div>
        </section>

        <section className="travel-faq-band" id="faq" aria-labelledby="faq-title">
          <div className="travel-wrap travel-faq">
            <div className="travel-faq-intro">
              <h2 id="faq-title">Bạn muốn biết thêm?</h2>
              <Image src="/tripmate/brand/ill_travelers.svg" alt="" width={923} height={659} unoptimized />
            </div>
            <div className="travel-questions">
              {questions.map(({ question, answer }) => (
                <details key={question} name="tripmate-faq">
                  <summary>{question} <ChevronDown aria-hidden="true" size={18} /></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="travel-wrap travel-bottom" aria-labelledby="next-trip-title">
          <div>
            <h2 id="next-trip-title">Chuyến sau đi đâu?</h2>
            <Link className="travel-button travel-button-primary" href="/preview">Thử TripMate <ArrowRight aria-hidden="true" size={18} /></Link>
          </div>
          <Image src="/tripmate/brand/ill_road.svg" width={888} height={623} alt="" unoptimized />
        </section>
      </main>

      <footer className="travel-footer">
        <div className="travel-wrap travel-footer-inner">
          <Link href="/" className="travel-wordmark" aria-label="Trang chủ TripMate"><TripMateMark size={28} /><span>TripMate</span></Link>
          <Link href="/admin/login">Trang quản trị</Link>
        </div>
      </footer>
    </div>
  );
}
