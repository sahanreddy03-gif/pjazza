import '@/styles/pjazza.css';

export const metadata = {
  title: 'PJAZZA — Malta\'s Live Shopping Marketplace',
  description: 'Watch it live. Buy it now. Malta\'s live shopping marketplace across 12 sectors.',
};

export default function PjazzaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pj-app">
      {children}
    </div>
  );
}
