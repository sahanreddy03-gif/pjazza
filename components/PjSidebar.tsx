'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home, ShoppingBag, Grid3X3, Users, Info, HelpCircle, Briefcase, Radio, Phone,
} from 'lucide-react';

const navItems = [
  { id: 'home', Icon: Home, label: 'Home', path: '/pjazza/discover' },
  { id: 'live-shop', Icon: Radio, label: 'Live', path: '/pjazza/live-shop' },
  { id: 'sectors', Icon: Grid3X3, label: 'Sectors', path: '/pjazza/sectors' },
  { id: 'people', Icon: Users, label: 'People', path: '/pjazza/people' },
  { id: 'how', Icon: Info, label: 'How It Works', path: '/pjazza/how-it-works' },
  { id: 'help', Icon: HelpCircle, label: 'Help', path: '/pjazza/help' },
  { id: 'contact', Icon: Phone, label: 'Contact', path: '/pjazza/contact' },
  { id: 'business', Icon: Briefcase, label: 'Business', path: '/pjazza/business/dashboard' },
];

export default function PjSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const getActive = () => {
    if (pathname.includes('/live-shop')) return 'live-shop';
    if (pathname.includes('/sectors')) return 'sectors';
    if (pathname.includes('/people')) return 'people';
    if (pathname.includes('/how-it-works')) return 'how';
    if (pathname.includes('/help')) return 'help';
    if (pathname.includes('/contact')) return 'contact';
    if (pathname.includes('/business')) return 'business';
    if (pathname === '/pjazza/discover') return 'home';
    return '';
  };

  const active = getActive();

  return (
    <aside className="pj-sidebar">
      <Link href="/pjazza" className="pj-sidebar-logo">
        <img src="/pjazza/images/logo-white.svg" alt="PJAZZA" />
      </Link>
      <nav className="pj-sidebar-nav">
        {navItems.map((item) => {
          const isActive = active === item.id;
          const isLive = item.id === 'live-shop';
          return (
            <button
              key={item.id}
              className={`pj-sidebar-item ${isActive ? 'active' : ''} ${isLive ? 'live' : ''}`}
              onClick={() => router.push(item.path)}
              data-testid={`sidebar-${item.id}`}
            >
              <item.Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
              {isLive && <span className="pj-live-dot pj-sidebar-dot" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
