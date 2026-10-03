import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './tokens.css';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tripmate.app'),
  title: 'TripMate - Plan chill. Chia tiền ez. Lưu moment.',
  description: 'Super-app du lịch nhóm Gen Z. Lập lịch trình, chia tiền chi tiêu nhóm, chuẩn bị hành lý, lưu giữ khoảnh khắc và lên kế hoạch thông minh bằng trợ lý AI.',
  openGraph: {
    title: 'TripMate - Super-app Du Lịch Nhóm Gen Z',
    description: 'Plan chill · Chia tiền ez · Lưu moment',
    url: 'https://tripmate.app',
    siteName: 'TripMate',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TripMate - Super-app Du Lịch Nhóm Gen Z',
    description: 'Plan chill · Chia tiền ez · Lưu moment',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${plusJakarta.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen transition-colors duration-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
