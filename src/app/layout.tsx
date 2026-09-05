import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './tokens.css';
import './globals.css';

const quicksand = Quicksand({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: 'TripMate - Plan chill. Chia tiền ez. Lưu moment.',
  description: 'Super-app du lịch nhóm Gen Z. Lập lịch trình, chia tiền chi tiêu nhóm, chuẩn bị hành lý, lưu giữ khoảnh khắc và lên kế hoạch thông minh bằng trợ lý AI.',
  openGraph: {
    title: 'TripMate - Super-app Du Lịch Nhóm Gen Z',
    description: 'Plan chill · Chia tiền ez · Lưu moment',
    type: 'website',
    url: 'https://tripmate.vn',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'TripMate - Gen Z Travel App',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${quicksand.variable} scroll-smooth`} suppressHydrationWarning>
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
      <body className="font-quicksand antialiased min-h-screen transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
