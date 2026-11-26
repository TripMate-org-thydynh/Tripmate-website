import Image from 'next/image';
import { ArrowDownRight } from 'lucide-react';

const photos = [
  { image: 'xuan-huong.jpg', label: 'Hồ Xuân Hương', alt: 'Mặt hồ Xuân Hương nhìn về thành phố Đà Lạt', credit: 'Markus Winkler', source: 'landscape-photography-of-xuan-huong-lake-in-vietnam-5156620' },
  { image: 'pine-forest.jpg', label: 'Rừng thông', alt: 'Nắng chiếu qua thân thông trong rừng Đà Lạt', credit: 'Quang Vuong', source: 'scenic-pine-tree-forest-in-dalat-vietnam-35731564' },
  { image: 'lakeside-pier.jpg', label: 'Bến ven hồ', alt: 'Cầu gỗ dẫn ra một công trình trên hồ Xuân Hương', credit: 'Phan Cuong', source: '38869291' },
  { image: 'dalat-cafe.jpg', label: 'Cà phê trong phố', alt: 'Bàn ghế gỗ trên hiên một quán cà phê Đà Lạt', credit: 'Nam Quân Nguyễn', source: 'exterior-of-a-cafe-with-chairs-and-tables-on-the-porch-18023653' },
  { image: 'dalat-road.jpg', label: 'Đường quanh hồ', alt: 'Đường uốn qua những hàng cây ở Đà Lạt', credit: 'Phan Cuong', source: 'scenic-road-view-from-xuan-huong-da-lat-vietnam-38884650' },
] as const;

export function TravelAlbum() {
  return (
    <section className="travel-wrap travel-album" id="album" aria-labelledby="album-title">
      <div className="travel-album-heading" data-travel-reveal="">
        <div>
          <p className="travel-kicker">Album chuyến đi</p>
          <h2 id="album-title">Đà Lạt qua năm khung hình</h2>
        </div>
        <a href="#story">Xem lịch trình Đà Lạt <ArrowDownRight size={18} aria-hidden="true" /></a>
      </div>
      <div className="travel-album-grid">
        {photos.map(({ image, label, alt, credit, source }, index) => (
          <figure key={image} className="travel-album-tile" data-travel-motion="photo">
            <div className="travel-album-media">
              <Image
                src={'/tripmate/da-lat/' + image}
                alt={alt}
                fill
                sizes={index === 0 ? '(max-width: 660px) 95vw, (max-width: 1300px) 48vw, 580px' : '(max-width: 660px) 47vw, (max-width: 1300px) 23vw, 292px'}
              />
            </div>
            <figcaption>
              <span>{label}</span>
              <a href={'https://www.pexels.com/photo/' + source + '/'} aria-label={'Nguồn ảnh ' + label + ' — ' + credit}>{credit}</a>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="travel-album-note">Trong TripMate, mỗi người có thể góp ảnh vào cùng một album của nhóm.</p>
    </section>
  );
}
