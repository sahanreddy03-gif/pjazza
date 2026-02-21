'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Grid3X3, Radio, Briefcase, Users } from 'lucide-react';

const tabs = [
  { id: 'home', Icon: Home, label: 'Home', path: '/pjazza/discover' },
  { id: 'sectors', Icon: Grid3X3, label: 'Sectors', path: '/pjazza/sectors' },
  { id: 'live', Icon: Radio, label: 'LIVE', path: '/pjazza/live-shop' },
  { id: 'people', Icon: Users, label: 'People', path: '/pjazza/people' },
  { id: 'business', Icon: Briefcase, label: 'Business', path: '/pjazza/business/dashboard' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes('/live-shop')) return 'live';
    if (pathname.includes('/sectors')) return 'sectors';
    if (pathname.includes('/people')) return 'people';
    if (pathname.includes('/how-it-works')) return 'how';
    if (pathname.includes('/business/stream')) return 'business';
    if (pathname.includes('/business/dashboard')) return 'business';
    if (pathname.includes('/business/onboard')) return 'business';
    if (pathname === '/pjazza/discover') return 'home';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <div
      className="pj-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 600,
        zIndex: 40,
      }}
    >
      <div
        className="pj-frosted"
        style={{
          borderTop: '1px solid var(--pj-border)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '8px 4px 8px',
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isLive = tab.id === 'live';

            return (
              <button
                key={tab.id}
                className="pj-touch"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 12px',
                  background: 'transparent',
                  border: 'none',
                  minWidth: 56,
                }}
                onClick={() => router.push(tab.path)}
                data-testid={`button-nav-${tab.id}`}
              >
                {isLive ? (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'var(--pj-red)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Radio size={18} strokeWidth={2.5} style={{ color: 'white' }} />
                  </div>
                ) : (
                  <tab.Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    style={{
                      color: isActive ? 'var(--pj-text)' : 'var(--pj-text-tertiary)',
                    }}
                  />
                )}
                {!isLive && (
                  <span
                    style={{
                      fontSize: 'var(--pj-size-micro)',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--pj-text)' : 'var(--pj-text-tertiary)',
                    }}
                  >
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
