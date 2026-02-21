"use client";

/**
 * Consumer layout — top bar, bottom nav, content area
 * Wraps all consumer pages: /discover, /shop, /services, /profile
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LivePulse } from "@/src/components/ui";

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
    <div className="min-h-screen flex flex-col w-full max-w-[420px] md:max-w-2xl lg:max-w-4xl mx-auto bg-surface">
      <header className="sticky top-0 z-50 flex items-center justify-between gap-3 px-5 py-3 bg-white/80 backdrop-blur-xl border-b border-line/50">
        <Link href="/" className="flex items-center">
          <img
            src="/pjazza/images/logo-black.svg"
            alt="PJAZZA"
            className="h-6 w-auto"
          />
        </Link>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-live/10 text-live">
            <LivePulse className="scale-75" />
            12 LIVE
          </span>
          <button
            type="button"
            aria-label="Search"
            className="p-2 rounded-full hover:bg-surface-alt transition-colors"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="p-2 rounded-full hover:bg-surface-alt transition-colors"
          >
            <BellIcon />
          </button>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-alt text-ink-secondary">
            🇲🇹 EN
          </span>
        </div>
      </header>

      <main className="flex-1 px-5 py-5 pb-28">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-[420px] md:max-w-2xl lg:max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border-t border-line/50">
        <div className="flex items-center justify-around py-2">
          {NAV_TABS.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-1 px-5 py-3 rounded-apple text-[10px] font-medium transition-all duration-200 ${
                  isActive
                    ? "text-ink"
                    : "text-ink-muted hover:text-ink-secondary"
                }`}
              >
                <span className="text-[20px]">{tab.icon}</span>
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
