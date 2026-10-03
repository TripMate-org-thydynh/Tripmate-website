import type { Metadata } from 'next';
import PreviewClient from './PreviewClient';

export const metadata: Metadata = {
  title: 'Trải nghiệm tính năng | TripMate - Lên lịch trình & Chia tiền nhóm',
  description: 'Dùng thử trực tiếp bản demo tương tác TripMate: lập lịch trình theo ngày, tính toán chia tiền sòng phẳng, chuẩn bị hành lý và trải nghiệm trợ lý AI du lịch.',
};

export default function PreviewPage() {
  return <PreviewClient />;
}
