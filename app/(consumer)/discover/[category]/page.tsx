/**
 * Category page — businesses and streams by category
 */

import { notFound } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { CATEGORIES } from "@/src/config/categories";
import Link from "next/link";
import { ChevronRight, Play, MapPin, Star } from "lucide-react";

const CATEGORY_TO_INDUSTRIES: Record<string, string[]> = {
  dining: ["dining", "food"],
  tours: ["tours", "tourism"],
  property: ["property", "realestate"],
  yachts: ["yachts", "yacht"],
  cars: ["cars"],
  shop: ["fashion", "retail", "electronics"],
  services: ["home-services", "freelancer"],
  wellness: ["wellness", "beauty"],
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat) notFound();

  const industries = CATEGORY_TO_INDUSTRIES[category] ?? [cat.industry];

  let businesses: { id: string; name: string; slug: string; locality: string | null; is_live: boolean; live_viewer_count: number; cover_image_url: string | null; industry: string }[] = [];
  let streams: { id: string; business_id: string; title: string | null; video_url: string | null; peak_viewers: number; business?: { name: string; slug: string; locality: string | null } }[] = [];

  try {
    const supabase = await createClient();
    const { data: biz } = await supabase
      .from("businesses")
      .select("id, name, slug, locality, is_live, live_viewer_count, cover_image_url, industry")
      .in("industry", industries)
      .order("live_viewer_count", { ascending: false })
      .limit(24);

    if (biz?.length) businesses = biz as typeof businesses;

    const bizIds = businesses.map((b) => b.id);
    if (bizIds.length > 0) {
      const { data: streamData } = await supabase
        .from("streams")
        .select("id, business_id, title, video_url, peak_viewers")
        .in("business_id", bizIds)
        .not("video_url", "is", null)
        .eq("is_live", false)
        .order("created_at", { ascending: false })
        .limit(6);
      if (streamData?.length) {
        const bizMap = new Map(businesses.map((b) => [b.id, { name: b.name, slug: b.slug, locality: b.locality ?? null }]));
        streams = (streamData as typeof streams).map((s) => ({
          ...s,
          business: s.business_id ? bizMap.get(s.business_id) : undefined,
        }));
      }
    }
  } catch {
    // Fall through
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink capitalize flex items-center gap-2">
          <span>{cat.emoji}</span>
          {cat.label}
        </h1>
        <p className="text-xs text-ink-muted mt-1">{businesses.length} businesses</p>
      </div>

      {streams.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-ink mb-3">Watch again</h2>
          <div className="grid grid-cols-2 gap-3">
            {streams.map((s) => (
              <Link
                key={s.id}
                href={s.business?.slug ? `/biz/${s.business.slug}` : "/discover"}
                className="rounded-xl border border-line overflow-hidden bg-surface-card hover:border-line-hover transition-colors"
              >
                <div className="aspect-video bg-surface-alt relative">
                  {s.video_url && (
                    <video src={s.video_url} className="w-full h-full object-cover" muted />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                      <Play size={18} fill="var(--pj-text)" className="text-ink ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-ink truncate">{s.business?.name || s.title || "Replay"}</p>
                  <p className="text-xs text-ink-muted flex items-center gap-1">
                    <MapPin size={10} />
                    {s.business?.locality || "Malta"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold text-ink mb-3">Businesses</h2>
        {businesses.length === 0 ? (
          <p className="text-sm text-ink-muted">No businesses in this category yet.</p>
        ) : (
          <div className="space-y-2">
            {businesses.map((b) => (
              <Link
                key={b.id}
                href={`/biz/${b.slug}`}
                className="flex items-center gap-3 rounded-xl border border-line p-3 bg-surface-card hover:border-line-hover transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-surface-alt overflow-hidden flex-shrink-0">
                  {b.cover_image_url ? (
                    <img src={b.cover_image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">{cat.emoji}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink truncate">{b.name}</p>
                  <p className="text-xs text-ink-muted flex items-center gap-1">
                    <MapPin size={10} />
                    {b.locality || "Malta"}
                    {b.is_live && (
                      <span className="inline-flex items-center gap-1 ml-2 text-live">
                        <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" />
                        Live
                      </span>
                    )}
                  </p>
                </div>
                <ChevronRight size={18} className="text-ink-muted flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
