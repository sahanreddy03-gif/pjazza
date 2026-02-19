/**
 * HeroCard — dark bg, gradient, live CTA
 */

import { Badge } from "@/src/components/ui";

export function HeroCard() {
  return (
    <div className="relative overflow-hidden rounded-apple bg-ink p-6 text-white shadow-card">
      <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">
        LIVE NOW IN MALTA
      </p>
      <h2 className="mt-1 text-[20px] font-semibold tracking-tight leading-tight">
        Discover Malta Like Never Before
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge bg="bg-white/20" color="text-white" className="border-0">
          ☀️ 22°C
        </Badge>
        <Badge bg="bg-white/20" color="text-white" className="border-0">
          🚢 2 ships in port
        </Badge>
        <Badge bg="bg-white/20" color="text-white" className="border-0">
          🎉 Festa season
        </Badge>
      </div>
    </div>
  );
}
