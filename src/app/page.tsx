import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, ChevronDown, MapPin, Menu } from 'lucide-react';
import { TripJourney } from '@/components/landing/TripJourney';
import { TravelMotion } from '@/components/landing/TravelMotion';
import { TravelAlbum } from '@/components/landing/TravelAlbum';
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
  { id: 'album', label: 'Album' },
  { id: 'features', label: 'Tính năng' },
  { id: 'story', label: 'Chuyến đi mẫu' },
  { id: 'faq', label: 'Hỏi đáp' },
];

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/' },
  { label: 'Zalo', href: 'https://zalo.me/' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
];

const days = [
  { day: 'Ngày 1', title: 'Đến Đà Lạt', stops: ['14:00 · Nhận phòng', '17:30 · Dạo quanh hồ Xuân Hương'] },
  { day: 'Ngày 2', title: 'Một ngày giữa rừng thông', stops: ['07:00 · Khởi hành đi hồ Tuyền Lâm', '12:00 · Ăn trưa cùng nhóm'] },
  { day: 'Ngày 3', title: 'Cà phê trước khi về', stops: ['08:30 · Hẹn cà phê trong phố', '11:00 · Trả phòng'] },
];

const heroRoute = 'M-65 480C123 485 65 311 202 316c114 4 87 127 209 134 160 9 101-164 234-182 94-13 187 67 228-28 24-54-30-97 17-142';

const questions = [
  { question: 'Lịch trình chung lưu được những gì?', answer: 'Mỗi chặng có thể ghi giờ hẹn, điểm đến và ghi chú để cả nhóm cùng theo dõi.' },
  { question: 'TripMate chia tiền cho cả nhóm như thế nào?', answer: 'Mỗi khoản ghi rõ người đã thanh toán và những ai cùng chia. Cả nhóm có thể xem số tiền còn cần thanh toán.' },
  { question: 'TripMate có bán tour hay nhận đặt phòng không?', answer: 'TripMate giúp bạn tổ chức chuyến đi tự túc. Bạn tự đặt dịch vụ với nhà cung cấp và lưu thông tin đặt chỗ trong chuyến đi.' },
];

export default function LandingPage() {
  return (
    <div className="tripmate-landing">
      <TravelMotion />
      <a className="travel-skip" href="#landing-main">Đến nội dung chính</a>
      <header className="travel-header" id="tripmate-top">
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
        <section className="travel-hero" aria-labelledby="travel-title" data-travel-motion="hero">
          <div className="travel-wrap travel-hero-inner">
            <div className="travel-hero-copy">
              <h1 id="travel-title"><span>Cùng hội</span><span>lên đường.</span></h1>
              <p className="travel-intro">Lên lịch, chia tiền và giữ ảnh chung cho chuyến đi cùng bạn bè.</p>
              <a className="travel-button travel-hero-cta" href="#story">Xem lịch trình Đà Lạt <ArrowRight aria-hidden="true" size={18} /></a>
            </div>
            <div className="travel-hero-scene">
              <div className="travel-hero-contours" aria-hidden="true" />
              <svg className="travel-hero-route" viewBox="0 0 890 520" fill="none" aria-hidden="true">
                <path className="travel-route-guide" d={heroRoute} />
                <path className="travel-route-ink" d={heroRoute} pathLength="1" />
              </svg>
              <div className="travel-cast-shadow" aria-hidden="true" />
              <Image className="travel-squad" src="/tripmate/brand/ill_squad.svg" alt="Bốn người bạn cùng chụp ảnh trong chuyến đi" width={513} height={720} preload unoptimized />
            </div>
            <div className="travel-hero-links">
              <a className="travel-scroll-link" href="#album"><span><ArrowDown aria-hidden="true" size={18} /></span> Khám phá TripMate</a>
              <a className="travel-destination-link" href="#story"><MapPin aria-hidden="true" size={17} /> Đà Lạt, Lâm Đồng <ArrowRight aria-hidden="true" size={14} /></a>
            </div>
          </div>
        </section>

        <TravelAlbum />
        <TripJourney />

        <section className="travel-story" id="story" aria-labelledby="story-title">
          <div className="travel-wrap travel-story-content" data-travel-reveal="">
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
          </div>
        </section>

        <section className="travel-faq-band" id="faq" aria-labelledby="faq-title">
          <div className="travel-wrap travel-faq" data-travel-reveal="">
            <h2 id="faq-title">Trước khi lên đường</h2>
            <div className="travel-questions">
              {questions.map(({ question, answer }, index) => (
                <details key={question} name="tripmate-faq" open={index === 0}>
                  <summary>{question} <ChevronDown aria-hidden="true" size={18} /></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="travel-bottom" aria-labelledby="next-trip-title">
          <div className="travel-wrap travel-bottom-inner" data-travel-reveal="">
            <div>
              <h2 id="next-trip-title">Chuyến sau đi đâu?</h2>
              <a className="travel-button travel-button-primary" href="#story">Xem lịch trình mẫu <ArrowRight aria-hidden="true" size={18} /></a>
            </div>
            <Image src="/tripmate/brand/ill_road.svg" width={888} height={623} alt="" unoptimized />
          </div>
        </section>
      </main>

      <footer className="travel-footer">
        <div className="travel-wrap">
          <div className="travel-footer-main">
            <div className="travel-footer-brand">
              <Link href="/" className="travel-wordmark" aria-label="Trang chủ TripMate">
                <TripMateMark size={34} />
                <span>TripMate</span>
              </Link>
              <p>Dành cho những chuyến đi tự túc cùng bạn bè.</p>
            </div>
            <nav aria-labelledby="footer-explore">
              <h2 id="footer-explore">Khám phá</h2>
              <ul className="travel-footer-links">
                {sections.map(({ id, label }) => <li key={id}><a href={'#' + id}>{label}</a></li>)}
              </ul>
            </nav>
            <nav aria-labelledby="footer-social" aria-describedby="footer-social-note">
              <h2 id="footer-social">Mạng xã hội</h2>
              <ul className="travel-footer-links travel-footer-social">
                {socialLinks.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {label}<ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="travel-footer-note" id="footer-social-note">Liên kết mẫu · mở tab mới</p>
            </nav>
          </div>
          <div className="travel-footer-meta">
            <small>© TripMate</small>
            <a href="#tripmate-top">Về đầu trang <ArrowUp size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
