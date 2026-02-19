/**
 * CrowdIntelligence — horizontal scroll of crowd % per business
 */

import Link from "next/link";
import type { Business } from "@/src/types";
import { ProgressBar } from "@/src/components/ui";

interface CrowdIntelligenceProps {
  businesses: Business[];
}

function crowdColor(pct: number) {
  if (pct <= 30) return "bg-trust";
  if (pct <= 60) return "bg-warn";
  return "bg-live";
}

export function CrowdIntelligence({ businesses }: CrowdIntelligenceProps) {
  const withCrowd = businesses.filter((b) => b.crowd_pct > 0 || b.is_live);
  const toShow = withCrowd.length > 0 ? withCrowd : businesses.slice(0, 5);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {toShow.map((business) => (
        <Link
          key={business.id}
          href={`/biz/${business.slug}`}
          className="w-[130px] shrink-0 rounded-apple bg-white p-4 shadow-card transition-all duration-200 hover:shadow-card-hover active:scale-[0.99]"
        >
          <p className="truncate text-[13px] font-semibold text-ink">{business.name}</p>
          <div className="mt-2">
            <ProgressBar
              percentage={business.crowd_pct}
              height="sm"
              color={crowdColor(business.crowd_pct)}
            />
          </div>
          <p className="mt-1 text-[10px] text-ink-muted">
            {business.crowd_pct}% capacity
          </p>
        </Link>
      ))}
    </div>
  );
}
