'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import MarqueeStrip from '@/components/landing/MarqueeStrip';
import FourSeasonsScroller from '@/components/landing/FourSeasonsScroller';
import SocialProofSection from '@/components/landing/SocialProofSection';
import FaqSection, { faqs } from '@/components/landing/FaqSection';
import Footer from '@/components/landing/Footer';
import DownloadModal from '@/components/landing/DownloadModal';
import { ArrowDownToLine } from 'lucide-react';

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TripMate',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Android',
  description: 'Ứng dụng lập lịch trình du lịch nhóm, chia tiền sòng phẳng tự động qua VietQR và lưu giữ kỷ niệm chuyến đi.',
  url: 'https://tripmate.app',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'VND',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function LandingPage() {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = heroRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMobileCta(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-50 font-sans antialiased selection:bg-orange-500/20 selection:text-orange-950 dark:selection:text-orange-100 transition-colors duration-200 pb-24 md:pb-0">
      {/* Structured Data (Schema.org) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Top Sticky Navigation */}
      <Navbar onOpenDownload={() => setDownloadModalOpen(true)} />

      <main className="flex-1 w-full">
        {/* 01. Cinematic Hero Intro */}
        <div ref={heroRef}>
          <HeroSection onOpenDownload={() => setDownloadModalOpen(true)} />
        </div>

        {/* 02. Continuous Feature Marquee Ticker */}
        <MarqueeStrip />

        {/* 03. Full-Screen 4-Seasons Pinned Scrub Experience (Gionatan Nese Style) */}
        <FourSeasonsScroller onOpenDownload={() => setDownloadModalOpen(true)} />

        {/* 04. Social Proof & Squad Testimonials */}
        <SocialProofSection />

        {/* 05. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Clean Brand Footer (Zero internal admin links) */}
      <Footer />

      {/* Quick QR Download Modal */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />

      {/* Mobile Sticky CTA Bar */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 md:hidden bg-white dark:bg-[#09090B] border-t-2 border-zinc-200 dark:border-zinc-800 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.4)] transition-all duration-300 ${
          showMobileCta
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          type="button"
          onClick={() => setDownloadModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full text-sm font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-sm transition-colors cursor-pointer"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Tải app miễn phí</span>
        </button>
      </div>
    </div>
  );
}
