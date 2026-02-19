"use client";

/**
 * Consumer layout — top bar, bottom nav, content area
 * Wraps all consumer pages: /discover, /shop, /services, /profile
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge, LivePulse } from "@/src/components/ui";

const NAV_TABS = [
  { href: "/discover", label: "Home", icon: "🏠" },
  { href: "/shop", label: "Shop", icon: "🛍️" },
  { href: "/live", label: "Live", icon: "📹" }, // future
  { href: "/services", label: "Services", icon: "🔧" },
  { href: "/profile", label: "Profile", icon: "👤" },
] as const;

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between gap-3 px-4 py-3 bg-navy text-white">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-pjazza-gold hover:opacity-90"
        >
          PJAZZA
        </Link>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-live text-white">
            <LivePulse className="scale-75" />
            12 LIVE
          </span>
          <button
            type="button"
            aria-label="Search"
            className="p-1.5 rounded-lg hover:bg-white/10"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="p-1.5 rounded-lg hover:bg-white/10"
          >
            <BellIcon />
          </button>
          <Badge bg="bg-white/10" color="text-white" className="shrink-0">
            🇲🇹 EN
          </Badge>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4 pb-24">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-[420px] mx-auto bg-surface-card border-t border-line">
        <div className="flex items-center justify-around py-2">
          {NAV_TABS.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-[10px] font-semibold transition-colors ${
                  isActive
                    ? "bg-pjazza-gold/20 text-pjazza-gold font-bold"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
