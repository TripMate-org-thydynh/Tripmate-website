import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'TripMate - Ứng dụng du lịch nhóm cho Gen Z';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#121110',
          padding: '56px 64px',
          fontFamily: 'sans-serif',
          border: '12px solid #1E1C1A',
        }}
      >
        {/* Top Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Logo and Tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#121110',
                fontSize: '24px',
                fontWeight: 900,
                border: '3px solid #FAF8F2',
              }}
            >
              TM
            </div>
            <div
              style={{
                display: 'flex',
                padding: '8px 18px',
                borderRadius: '999px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                border: '2px solid #F59E0B',
                color: '#F59E0B',
                fontSize: '16px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              Du lịch nhóm cùng hội bạn thân
            </div>
          </div>

          {/* Domain Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 20px',
              borderRadius: '12px',
              backgroundColor: '#1E1C1A',
              border: '2px solid rgba(250, 248, 242, 0.2)',
              color: '#FAF8F2',
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            tripmate.app
          </div>
        </div>

        {/* Center Main Typography */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            margin: 'auto 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              fontSize: '86px',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-2px',
            }}
          >
            <span style={{ color: '#FAF8F2' }}>trip</span>
            <span style={{ color: '#F59E0B' }}>.mate</span>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              fontWeight: 600,
              color: '#FAF8F2',
              maxWidth: '920px',
              lineHeight: 1.4,
            }}
          >
            Lên lịch trình chung, chia tiền sòng phẳng và lưu giữ trọn vẹn mọi khoảnh khắc du lịch nhóm.
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            paddingTop: '28px',
            borderTop: '2px solid rgba(250, 248, 242, 0.12)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              borderRadius: '14px',
              backgroundColor: '#1E1C1A',
              border: '2px solid #F59E0B',
              color: '#FAF8F2',
              fontSize: '18px',
              fontWeight: 800,
            }}
          >
            Lập lịch trình
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              borderRadius: '14px',
              backgroundColor: '#1E1C1A',
              border: '2px solid #F59E0B',
              color: '#FAF8F2',
              fontSize: '18px',
              fontWeight: 800,
            }}
          >
            Chia tiền nhóm
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              borderRadius: '14px',
              backgroundColor: '#1E1C1A',
              border: '2px solid #F59E0B',
              color: '#FAF8F2',
              fontSize: '18px',
              fontWeight: 800,
            }}
          >
            Khoảnh khắc Moments
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              borderRadius: '14px',
              backgroundColor: '#F59E0B',
              border: '2px solid #F59E0B',
              color: '#121110',
              fontSize: '18px',
              fontWeight: 900,
            }}
          >
            Trợ lý du lịch AI
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
