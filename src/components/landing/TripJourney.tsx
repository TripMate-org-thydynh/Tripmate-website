import Image from 'next/image';
import { ArrowDown, ArrowRight, MapPin } from 'lucide-react';

const stops = [
  { time: '07:00', place: 'Hồ Tuyền Lâm', note: 'Điểm hẹn của cả nhóm' },
  { time: '10:30', place: 'Rừng thông', note: 'Dạo bộ và chụp ảnh' },
  { time: '12:00', place: 'Ăn trưa', note: 'Cùng ăn trước khi về' },
];

export function TripJourney() {
  return (
    <section id="features" className="travel-journey" aria-labelledby="feature-title">
      <div className="travel-wrap">
        <div className="travel-journey-heading" data-travel-reveal="">
          <h2 id="feature-title">Cả chuyến đi trong một chỗ.</h2>
          <nav aria-label="Các chặng của chuyến đi" className="travel-journey-nav">
            <a href="#lich-trinh">Lên lịch <ArrowDown size={15} aria-hidden="true" /></a>
            <a href="#chia-tien">Chia tiền <ArrowDown size={15} aria-hidden="true" /></a>
            <a href="#album">Giữ ảnh <ArrowDown size={15} aria-hidden="true" /></a>
          </nav>
        </div>

        <article className="travel-plan" id="lich-trinh" data-travel-reveal="">
          <div className="travel-feature-copy">
            <h3>Chốt lịch cùng nhau.</h3>
            <p>Giờ hẹn, điểm đến và ghi chú của cả nhóm nằm trên một lịch trình chung.</p>
          </div>
          <ol className="travel-plan-route" aria-label="Lịch trình mẫu ở Đà Lạt">
            {stops.map(({ time, place, note }) => (
              <li key={time}>
                <MapPin size={18} aria-hidden="true" />
                <time dateTime={time}>{time}</time>
                <strong>{place}</strong>
                <span>{note}</span>
              </li>
            ))}
          </ol>
        </article>

        <div className="travel-feature-grid">
          <article className="travel-cost" id="chia-tien" data-travel-reveal="">
            <div className="travel-feature-copy">
              <h3>Chia tiền trong chuyến đi.</h3>
              <p>Ghi lại ai đã trả và số tiền mỗi người cần góp.</p>
            </div>
            <dl className="travel-cost-ledger" aria-label="Chi phí mẫu của nhóm bốn người">
              <div><dt>Tiền phòng</dt><dd>960.000 ₫</dd></div>
              <div><dt>Ăn trưa</dt><dd>320.000 ₫</dd></div>
              <div><dt>Mỗi người <span>Chia đều cho 4 người</span></dt><dd>320.000 ₫</dd></div>
            </dl>
          </article>

          <article className="travel-album" id="album" data-travel-reveal="">
            <div className="travel-feature-copy">
              <h3>Ảnh của cả hội.</h3>
              <p>Mỗi người góp ảnh vào cùng một album để cả nhóm xem lại sau chuyến đi.</p>
            </div>
            <figure>
              <div className="travel-album-photo">
                <Image src="/tripmate/da-lat/pine-forest.jpg" alt="Nắng sớm xuyên qua rừng thông ở Đà Lạt" fill sizes="(max-width: 810px) 90vw, 430px" />
              </div>
              <figcaption><span>Một sáng ở Đà Lạt</span><a href="#story">Xem lịch trình <ArrowRight size={15} aria-hidden="true" /></a></figcaption>
            </figure>
          </article>
        </div>
      </div>
    </section>
  );
}
