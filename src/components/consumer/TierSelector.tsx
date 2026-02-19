"use client";

/**
 * TierSelector — 4 buttons: All/Luxury/Value/Deals
 * V1: UI only, affects nothing
 */

import { useState } from "react";

const TIERS = [
  { id: "all", label: "All" },
  { id: "luxury", label: "Luxury" },
  { id: "value", label: "Value" },
  { id: "deals", label: "Deals" },
] as const;

export function TierSelector() {
  const [selected, setSelected] = useState<(typeof TIERS)[number]["id"]>("all");

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {TIERS.map((tier) => (
        <button
          key={tier.id}
          type="button"
          onClick={() => setSelected(tier.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
              selected === tier.id
                ? "bg-ink text-white"
                : "bg-white text-ink-secondary shadow-card hover:bg-surface-alt"
            }`}
        >
          {tier.label}
        </button>
      ))}
    </div>
  );
}
