'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Search, Bell, Home, Briefcase, Info, Grid3X3, Users, ShoppingBag, HelpCircle } from 'lucide-react';

const desktopLinks = [
  { id: 'home', Icon: Home, label: 'Home', path: '/pjazza/discover' },
  { id: 'live-shop', Icon: ShoppingBag, label: 'Live Shop', path: '/pjazza/live-shop' },
  { id: 'sectors', Icon: Grid3X3, label: 'Sectors', path: '/pjazza/sectors' },
  { id: 'people', Icon: Users, label: 'People', path: '/pjazza/people' },
  { id: 'how', Icon: Info, label: 'How It Works', path: '/pjazza/how-it-works' },
  { id: 'help', Icon: HelpCircle, label: 'Help', path: '/pjazza/help' },
  { id: 'business', Icon: Briefcase, label: 'Business', path: '/pjazza/business/dashboard' },
];

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();

  const getActive = () => {
    if (pathname.includes('/live-shop')) return 'live-shop';
    if (pathname.includes('/sectors')) return 'sectors';
    if (pathname.includes('/people')) return 'people';
    if (pathname.includes('/how-it-works')) return 'how';
    if (pathname.includes('/help')) return 'help';
    if (pathname.includes('/business')) return 'business';
    if (pathname === '/pjazza/discover') return 'home';
    return '';
  };

  const active = getActive();

  return (
    <div
      className="pj-frosted"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--pj-border)',
      }}
    >
      <div className="pj-topbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.push('/pjazza')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: 0,
            }}
            data-testid="button-logo"
          >
            <span
              className="pj-display"
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--pj-text)',
              }}
            >
              PJAZZA
            </span>
            <span className="pj-live-dot" />
          </button>

          <nav className="pj-desktop-nav">
            {desktopLinks.map((link) => (
              <button
                key={link.id}
                className={`pj-desktop-nav-item ${active === link.id ? 'active' : ''}`}
                onClick={() => router.push(link.path)}
                data-testid={`button-desknav-${link.id}`}
              >
                <link.Icon size={16} strokeWidth={2} />
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            className="pj-touch"
            style={{
              padding: 10,
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              color: 'var(--pj-text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            data-testid="button-search"
          >
            <Search size={18} strokeWidth={2} />
          </button>
          <button
            className="pj-touch"
            style={{
              padding: 10,
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              color: 'var(--pj-text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
            data-testid="button-notifications"
          >
            <Bell size={18} strokeWidth={2} />
            <span
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--pj-red)',
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
