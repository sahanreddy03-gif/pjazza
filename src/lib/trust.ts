/**
 * Trust score aggregation from business data
 * @see docs/REFERENCE.md section 6.4
 */

import type { Business, TrustScore, TrustSource } from "@/src/types";

export function aggregateTrustScore(business: Business): TrustScore {
  const sources: TrustSource[] = [];
  let weightedSum = 0;
  let totalWeight = 0;

  const gr = business.google_rating;
  const gc = business.google_review_count ?? 0;
  if (gr && gc > 0) {
    sources.push({
      name: "Google",
      rating: gr,
      count: gc,
      color: "#4285F4",
    });
    weightedSum += gr * gc;
    totalWeight += gc;
  }

  const tr = business.tripadvisor_rating;
  const tc = business.tripadvisor_review_count ?? 0;
  if (tr && tc > 0) {
    sources.push({
      name: "TripAdvisor",
      rating: tr,
      count: tc,
      color: "#00AF87",
    });
    weightedSum += tr * tc;
    totalWeight += tc;
  }

  const pr = business.pjazza_rating;
  const pc = business.pjazza_review_count ?? 0;
  if (pr && pc > 0) {
    sources.push({
      name: "PJAZZA",
      rating: pr,
      count: pc,
      color: "#E05A3A",
    });
    weightedSum += pr * pc * 2;
    totalWeight += pc * 2;
  }

  return {
    score: totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 0,
    totalReviews: sources.reduce((sum, s) => sum + s.count, 0),
    sources,
  };
}
