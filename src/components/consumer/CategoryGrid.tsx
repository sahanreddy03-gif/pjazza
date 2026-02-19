/**
 * CategoryGrid — 8 categories, 4 columns, emoji + label + live count
 */

import Link from "next/link";
import { CATEGORIES } from "@/src/config/categories";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.id}
          href={`/discover/${cat.id}`}
          className="flex flex-col items-center gap-1.5 rounded-apple bg-white p-4 text-center shadow-card transition-all duration-200 hover:shadow-card-hover active:scale-[0.98]"
        >
          <span className="text-2xl">{cat.emoji}</span>
          <span className="text-[11px] font-medium text-ink">{cat.label}</span>
          <span className="text-[10px] text-ink-muted">
            {/* Live count — from API in production */}
            2 live
          </span>
        </Link>
      ))}
    </div>
  );
}
