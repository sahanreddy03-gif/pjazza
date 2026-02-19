/**
 * TrustScore — renders 3-source score cards (Google, TripAdvisor, PJAZZA)
 * @see docs/REFERENCE.md section 6.4
 */

import type { TrustScore as TrustScoreType } from "@/src/types";

interface TrustScoreProps {
  /** Aggregated trust data (score, totalReviews, sources) */
  data: TrustScoreType;
  className?: string;
}

export function TrustScore({ data, className = "" }: TrustScoreProps) {
  const { score, totalReviews, sources } = data;

  if (sources.length === 0) {
    return (
      <div
        className={`text-xs text-ink-muted ${className}`}
      >
        No reviews yet
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-extrabold text-ink">{score.toFixed(1)}</span>
        <span className="text-xs text-ink-muted">
          {totalReviews} review{totalReviews !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((source) => {
          const dotClass =
            source.name === "Google"
              ? "bg-info"
              : source.name === "TripAdvisor"
                ? "bg-trust"
                : "bg-live";
          return (
            <div
              key={source.name}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-alt border border-line-light"
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`}
              />
              <span className="text-[10px] font-semibold text-ink">
                {source.name}
              </span>
              <span className="text-[10px] text-ink-muted">
                {source.rating.toFixed(1)} ({source.count})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
