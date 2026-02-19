/**
 * LiveStreamCard — business card for Live Now section
 */

import Link from "next/link";
import type { Business } from "@/src/types";
import { Badge, LivePulse } from "@/src/components/ui";

interface LiveStreamCardProps {
  business: Business;
}

export function LiveStreamCard({ business }: LiveStreamCardProps) {
  const rating =
    business.pjazza_rating > 0
      ? business.pjazza_rating
      : business.google_rating ?? business.tripadvisor_rating ?? null;

  return (
    <Link
      href={`/biz/${business.slug}`}
      className="block w-[150px] shrink-0 rounded-apple bg-white overflow-hidden shadow-card transition-all duration-200 hover:shadow-card-hover active:scale-[0.99]"
    >
      <div className="relative h-[100px] bg-surface-alt">
        {business.is_live && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-live px-2 py-0.5 text-[9px] font-medium text-white">
            <LivePulse className="scale-75" />
            LIVE
          </span>
        )}
        {business.emoji && (
          <span className="absolute right-2 top-2 text-xl">{business.emoji}</span>
        )}
      </div>
      <div className="p-3">
        <h3 className="truncate text-[13px] font-semibold text-ink">{business.name}</h3>
        <p className="text-[11px] text-ink-muted mt-0.5">{business.locality}</p>
        <div className="mt-1 flex items-center gap-2">
          {rating && (
            <span className="text-[10px] font-semibold text-ink">
              ★ {rating.toFixed(1)}
            </span>
          )}
          {business.is_live && (
            <span className="text-[10px] text-ink-muted">
              {business.live_viewer_count} watching
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
