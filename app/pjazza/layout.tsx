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

import PjazzaEnhancements from '@/components/PjazzaEnhancements';

export default function PjazzaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pj-app pjazza-world" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, position: 'relative' }}>
      <PjazzaEnhancements />
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>{children}</main>
    </div>
  );
}
