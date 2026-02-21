import type { Viewport } from 'next';
import '@/styles/pjazza.css';

export const viewport: Viewport = {
  themeColor: '#000000',
};

export const metadata = {
  title: "PJAZZA — Malta's Live Shopping Marketplace | Video Call Stores",
  description: "Watch it live. Buy it now. Video call any store in Malta. Live shopping for property, yachts, retail, dining & more. Escrow protected.",
  openGraph: {
    title: "PJAZZA — Live Shopping Malta",
    description: "Video call stores, watch live streams, buy with escrow. Malta's live marketplace.",
  },
};

import Footer from '@/components/Footer';

export default function PjazzaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pj-app pjazza-world" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
