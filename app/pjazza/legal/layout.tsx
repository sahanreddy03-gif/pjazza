import type { Viewport } from 'next';
import '@/styles/pjazza.css';

export const viewport: Viewport = { themeColor: '#000000' };

export const metadata = {
  title: 'Legal — PJAZZA',
  description: 'Terms of Service, Privacy Policy, and legal information for PJAZZA.',
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pj-app pjazza-world">
      {children}
    </div>
  );
}
