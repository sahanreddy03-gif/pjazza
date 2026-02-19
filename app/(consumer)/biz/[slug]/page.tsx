/**
 * Business detail page — Server Component
 * @see docs/REFERENCE.md section 3 (Screen Flow Map), section 1 (Business schema)
 */

import { notFound } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { aggregateTrustScore } from "@/src/lib/trust";
import { SEED_BUSINESSES } from "@/src/lib/seed-data";
import type { Business } from "@/src/types";
import {
  Badge,
  Card,
  LivePulse,
  ProgressBar,
  TrustScore,
} from "@/src/components/ui";

async function getBusiness(slug: string): Promise<Business | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!error && data) return data as unknown as Business;
  } catch {
    // Fall through to seed
  }
  return SEED_BUSINESSES.find((b) => b.slug === slug) ?? null;
}

function crowdColor(pct: number) {
  if (pct <= 30) return "bg-trust";
  if (pct <= 60) return "bg-warn";
  return "bg-live";
}

function crowdLabel(pct: number) {
  if (pct <= 30) return "Walk-in";
  if (pct <= 60) return "Moderate";
  return "Book ahead";
}

export default async function BizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusiness(slug);

  if (!business) notFound();

  const trustScore = aggregateTrustScore(business);
  const hasVibe =
    business.vibe &&
    Object.keys(business.vibe).length > 0 &&
    Object.values(business.vibe).some(Boolean);

  return (
    <div className="space-y-5 pb-8">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-ink">
              {business.name}
            </h1>
            <p className="text-[13px] text-ink-muted mt-0.5">
              {business.locality}
              {business.address && ` · ${business.address}`}
            </p>
          </div>
          {business.emoji && (
            <span className="text-3xl">{business.emoji}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {business.price_tier && (
            <Badge bg="bg-surface-alt" color="text-ink" className="border-0">
              {business.price_tier}
            </Badge>
          )}
          {business.avg_price && (
            <Badge bg="bg-surface-alt" color="text-ink" className="border-0">
              {business.avg_price}
            </Badge>
          )}
          {business.verified && (
            <Badge bg="bg-trust" color="text-white" className="border-0">
              ✓ Verified
            </Badge>
          )}
          {business.is_live && (
            <Badge bg="bg-live/90" color="text-white" className="border-0">
              <LivePulse className="scale-75" />
              LIVE · {business.live_viewer_count} watching
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <h2 className="text-[15px] font-semibold text-ink mb-3">Trust Score</h2>
        <TrustScore data={trustScore} />
      </Card>

      {/* Vibe */}
      {hasVibe && business.vibe && (
        <Card>
          <h2 className="text-[15px] font-semibold text-ink mb-3">Vibe</h2>
          <div className="flex flex-wrap gap-2 text-xs text-ink-secondary">
            {business.vibe.music && (
              <span>🎵 {business.vibe.music}</span>
            )}
            {business.vibe.dress && (
              <span>👔 {business.vibe.dress}</span>
            )}
            {business.vibe.noise && (
              <span>🔊 {business.vibe.noise}</span>
            )}
            {business.vibe.bestFor && (
              <span>✨ {business.vibe.bestFor}</span>
            )}
          </div>
        </Card>
      )}

      {/* Crowd */}
      <Card>
        <h2 className="text-[15px] font-semibold text-ink mb-3">Crowd Level</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-muted">
              {crowdLabel(business.crowd_pct)}
            </span>
            <span className="font-semibold text-ink">{business.crowd_pct}%</span>
          </div>
          <ProgressBar
            percentage={business.crowd_pct}
            height="md"
            color={crowdColor(business.crowd_pct)}
          />
        </div>
      </Card>

      {/* Description */}
      {business.description && (
        <Card>
          <p className="text-xs text-ink-secondary">{business.description}</p>
        </Card>
      )}

      {/* Tags */}
      {business.tags && business.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {business.tags.map((tag) => (
            <Badge key={tag} bg="bg-surface-alt" color="text-ink-secondary" className="border-0">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Booking placeholder */}
      <Card>
        <p className="text-sm text-ink-muted text-center">
          Booking coming next step
        </p>
      </Card>
    </div>
  );
}
