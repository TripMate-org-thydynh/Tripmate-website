import Image from 'next/image';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

const screens = [
  {
    id: 'lich-trinh',
    label: 'Lên lịch',
    title: 'Chốt lịch cùng nhau.',
    description: 'Cả nhóm xem được giờ hẹn, điểm đến và ghi chú cho từng ngày.',
    image: '/tripmate/app/itinerary.png',
    alt: 'Màn Lịch trình trong TripMate, có giờ nhận phòng và giờ dạo hồ Xuân Hương.',
  },
  {
    id: 'chia-tien',
    label: 'Chia tiền',
    title: 'Biết ai cần chuyển cho ai.',
    description: 'Xem số dư của từng người và các khoản cần chuyển sau khi chia chi phí.',
    image: '/tripmate/app/balances.png',
    alt: 'Màn Chia tiền trong TripMate, hiển thị An và Vy mỗi người cần chuyển 320.000 đồng cho Linh.',
  },
] as const;

export function TripJourney() {
  return (
    <section id="features" className="travel-journey" aria-labelledby="feature-title">
      <div className="travel-wrap">
        <div className="travel-journey-heading" data-travel-reveal="">
          <div>
            <h2 id="feature-title">Cả chuyến đi trong một chỗ.</h2>
            <p className="travel-section-intro">Hai màn hình TripMate với dữ liệu mẫu của chuyến Đà Lạt.</p>
          </div>
          <nav aria-label="Các màn hình TripMate" className="travel-journey-nav">
            {screens.map(({ id, label }) => (
              <a key={id} href={'#' + id}>{label}<ArrowDown size={15} aria-hidden="true" /></a>
            ))}
          </nav>
        </div>

        <div className="travel-feature-grid">
          {screens.map(({ id, label, title, description, image, alt }) => (
            <article key={id} className="travel-feature" id={id} data-travel-reveal="">
              <div className="travel-feature-copy">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <div className="travel-feature-screen">
                <a href={image} target="_blank" rel="noopener" aria-label={'Xem ảnh màn ' + label.toLowerCase() + ' kích thước đầy đủ (tab mới)'}>
                  <Image src={image} alt={alt} width={780} height={1640} sizes="(max-width: 390px) 75vw, 330px" />
                  <span className="travel-feature-enlarge" aria-hidden="true"><ArrowUpRight size={16} /></span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
