'use client';

import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import PjSidebar from '@/components/PjSidebar';

export default function PjAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pj-app-shell">
      <PjSidebar />
      <TopBar />
      <main className="pj-main-content">{children}</main>
      <BottomNav />
    </div>
  );
}
