'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, CalendarDays, Camera, MapPin, Wallet } from 'lucide-react';

const stops = [
  { id: 'lich-trinh', label: 'Lên lịch', title: 'Chốt lịch cùng nhau.', description: 'Gom điểm đến, giờ hẹn và ghi chú vào một lịch trình chung. Khi kế hoạch đổi, cả nhóm cùng thấy.', Icon: CalendarDays },
  { id: 'chia-tien', label: 'Chia tiền', title: 'Chia tiền ngay trong chuyến đi.', description: 'Ghi lại ai đã trả và những ai cùng chia. Đến lúc về, mỗi người biết mình còn cần chuyển bao nhiêu.', Icon: Wallet },
  { id: 'album', label: 'Giữ ảnh', title: 'Gom ảnh cả hội về một chỗ.', description: 'Mỗi người thêm ảnh của mình vào album chung để cả hội xem lại chuyến đi.', Icon: Camera },
] as const;

export function TripJourney() {
  const journey = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const chapters = Array.from(journey.current?.querySelectorAll('[data-journey-chapter]') ?? []);
    let frame: number | undefined;

    function trackChapter() {
      frame = undefined;
      const readingLine = window.innerHeight * 0.38;
      const next = chapters.findLastIndex(chapter => chapter.getBoundingClientRect().top <= readingLine);
      setActive(Math.max(0, next));
    }

    function scheduleUpdate() {
      frame ??= window.requestAnimationFrame(trackChapter);
    }

    trackChapter();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="features" className="travel-journey" aria-labelledby="feature-title" ref={journey} data-active={active}>
      <div className="travel-wrap">
        <div className="travel-journey-heading">
          <h2 id="feature-title">Cả chuyến đi<br /> trong một chỗ.</h2>
          <nav aria-label="Các chặng của chuyến đi" className="travel-journey-nav">
            {stops.map(({ id, label }, index) => (
              <a key={id} href={'#' + id} aria-current={active === index ? 'step' : undefined}>
                {label}<ArrowUpRight size={14} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>

        <div className="travel-journey-grid">
          <div className="travel-journey-stage">
            <div className="travel-demo travel-demo-plan" aria-hidden="true">
              <div className="travel-demo-ticket">
                <div className="travel-demo-title"><CalendarDays size={18} /> Lịch trình nhóm</div>
                <strong>Cuối tuần ở Đà Lạt</strong>
                <ul className="travel-demo-list">
                  <li><span>07:00</span><b>Hồ Tuyền Lâm</b><MapPin size={15} /></li>
                  <li><span>10:30</span><b>Dạo rừng thông</b><MapPin size={15} /></li>
                  <li><span>12:00</span><b>Ăn trưa cùng nhóm</b><MapPin size={15} /></li>
                </ul>
              </div>
              <Image src="/tripmate/brand/ill_travelers.svg" alt="" width={923} height={659} unoptimized />
            </div>
            <div className="travel-demo travel-demo-cost" aria-hidden="true">
              <div className="travel-demo-ticket">
                <div className="travel-demo-title"><Wallet size={18} /> Chi phí nhóm</div>
                <strong>1.280.000 ₫</strong>
                <ul className="travel-demo-list">
                  <li><b>Căn nhà cuối tuần</b><span>960.000 ₫</span></li>
                  <li><b>Ăn trưa cùng nhóm</b><span>320.000 ₫</span></li>
                </ul>
                <div className="travel-demo-total"><span>Mỗi người</span><b>320.000 ₫</b></div>
              </div>
            </div>
            <div className="travel-demo travel-demo-album" aria-hidden="true">
              <div className="travel-demo-ticket">
                <div className="travel-demo-title"><Camera size={18} /> Album chuyến đi</div>
                <strong>Một sáng ở Đà Lạt</strong>
                <div className="travel-demo-photo">
                  <Image src="/tripmate/da-lat/pine-forest.jpg" alt="" fill sizes="(max-width: 810px) 80vw, 370px" />
                </div>
              </div>
              <Image className="travel-demo-album-art" src="/tripmate/brand/ill_squad.svg" alt="" width={513} height={720} unoptimized />
            </div>
          </div>

          <div className="travel-journey-chapters">
            {stops.map(({ id, title, description, Icon }) => (
              <article key={id} id={id} data-journey-chapter className="travel-chapter">
                <Icon size={25} strokeWidth={1.7} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
