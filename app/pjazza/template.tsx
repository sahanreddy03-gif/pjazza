'use client';

export default function PjazzaTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="pj-page-enter" style={{ animation: 'pj-page-fade-in 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards' }}>
      {children}
    </div>
  );
}
