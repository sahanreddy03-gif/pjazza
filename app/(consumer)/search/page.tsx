/**
 * Search results page — all sectors, verticals, branches
 * GET /search?q=... — businesses, products, streams, categories
 */

import { createClient } from "@/src/lib/supabase/server";
import Link from "next/link";
import { Search as SearchIcon, Building2, Package, Video, FolderOpen, MapPin, Play, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/src/config/categories";
import { SearchBar } from "@/src/components/consumer";

const SECTOR_LABELS: Record<string, string> = {
  dining: "Dining", tours: "Tours", realestate: "Property", yacht: "Yachts",
  cars: "Cars", retail: "Shop", freelancer: "Services", beauty: "Wellness",
  food: "Food", property: "Property", "home-services": "Home", wellness: "Wellness",
  fashion: "Fashion", electronics: "Electronics", tourism: "Tourism",
};

async function searchAll(q: string, limit: number) {
  if (!q || q.length < 2)
    return { businesses: [], products: [], streams: [], categories: [] };

  const supabase = await createClient();
  const term = `%${q.replace(/,/g, " ")}%`;
  const qLower = q.toLowerCase();

  const [bizRes, prodRes, streamRes] = await Promise.all([
    supabase.from("businesses")
      .select("id, name, slug, industry, locality, description, cover_image_url, is_live, live_viewer_count")
      .or(`name.ilike.${term},description.ilike.${term},locality.ilike.${term},industry.ilike.${term}`)
      .limit(limit),
    supabase.from("products")
      .select("id, name, description, price, image_urls, business_id")
      .or(`name.ilike.${term},description.ilike.${term}`)
      .eq("is_available", true)
      .limit(limit),
    supabase.from("streams")
      .select("id, business_id, title, description, video_url, thumbnail_url, peak_viewers")
      .not("video_url", "is", null)
      .eq("is_live", false)
      .or(`title.ilike.${term},description.ilike.${term}`)
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  const productBizIds = [...new Set((prodRes.data || []).map((p) => p.business_id).filter(Boolean))] as string[];
  const streamBizIds = [...new Set((streamRes.data || []).map((s) => s.business_id).filter(Boolean))] as string[];

  const [productBiz, streamBiz] = await Promise.all([
    productBizIds.length > 0 ? supabase.from("businesses").select("id, name, slug, industry").in("id", productBizIds) : { data: [] },
    streamBizIds.length > 0 ? supabase.from("businesses").select("id, name, slug, industry").in("id", streamBizIds) : { data: [] },
  ]);

  const productBizMap = new Map((productBiz.data || []).map((b) => [b.id, b]));
  const streamBizMap = new Map((streamBiz.data || []).map((b) => [b.id, b]));

  const matchedCategories = CATEGORIES.filter(
    (c) => c.label.toLowerCase().includes(qLower) || c.id.toLowerCase().includes(qLower)
  );
  const catIndustries = [...new Set(matchedCategories.map((c) => c.industry))];
  const { data: catBiz } = catIndustries.length > 0
    ? await supabase.from("businesses").select("id, name, slug, industry, locality, cover_image_url, is_live").in("industry", catIndustries).limit(20)
    : { data: [] };

  return {
    businesses: bizRes.data || [],
    products: (prodRes.data || []).map((p) => ({
      ...p,
      business: p.business_id ? productBizMap.get(p.business_id) : null,
    })),
    streams: (streamRes.data || []).map((s) => ({
      ...s,
      business: s.business_id ? streamBizMap.get(s.business_id) : null,
    })),
    categories: matchedCategories.map((c) => ({
      ...c,
      businesses: (catBiz || []).filter((b) => b.industry === c.industry).slice(0, 5),
    })),
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = await searchAll(q, 15);

  const hasResults =
    results.businesses.length > 0 ||
    results.products.length > 0 ||
    results.streams.length > 0 ||
    results.categories.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink flex items-center gap-2">
          <SearchIcon size={22} />
          Search
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          Find businesses, products, and streams across all categories
        </p>
      </div>

      <SearchBar defaultValue={q} />

      {q && (
        <p className="text-sm text-ink-muted">
          Results for &ldquo;{q}&rdquo;
        </p>
      )}

      {!q ? (
        <div className="text-center py-12 text-ink-muted">
          <SearchIcon size={48} className="mx-auto mb-3 opacity-50" />
          <p>Enter a search term to find businesses, products, and streams.</p>
          <p className="text-xs mt-2">Try &ldquo;restaurant&rdquo;, &ldquo;Valletta&rdquo;, or &ldquo;yacht&rdquo;</p>
        </div>
      ) : !hasResults ? (
        <div className="text-center py-12 text-ink-muted">
          <p>No results found for &ldquo;{q}&rdquo;</p>
          <p className="text-xs mt-2">Try different keywords or browse categories.</p>
          <Link href="/discover" className="inline-block mt-4 text-sm font-semibold text-ink hover:underline">
            Browse categories
          </Link>
        </div>
      ) : (
        <>
          {results.categories.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
                <FolderOpen size={16} />
                Categories
              </h2>
              <div className="space-y-3">
                {results.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/discover/${cat.id}`}
                    className="flex items-center gap-3 rounded-xl border border-line p-4 bg-surface-card hover:border-line-hover transition-colors"
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink">{cat.label}</p>
                      <p className="text-xs text-ink-muted">
                        {cat.businesses.length} businesses
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-ink-muted flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.businesses.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
                <Building2 size={16} />
                Businesses
              </h2>
              <div className="space-y-2">
                {results.businesses.map((b) => (
                  <Link
                    key={b.id}
                    href={`/biz/${b.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-line p-3 bg-surface-card hover:border-line-hover transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-surface-alt overflow-hidden flex-shrink-0">
                      {b.cover_image_url ? (
                        <img src={b.cover_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          {SECTOR_LABELS[b.industry]?.[0] || "B"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink truncate">{b.name}</p>
                      <p className="text-xs text-ink-muted flex items-center gap-1">
                        <MapPin size={10} />
                        {b.locality || "Malta"}
                        {b.is_live && (
                          <span className="inline-flex gap-1 ml-2 text-live">
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
            </section>
          )}

          {results.products.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
                <Package size={16} />
                Products
              </h2>
              <div className="space-y-2">
                {results.products.map((p) => (
                  <Link
                    key={p.id}
                    href={p.business ? `/biz/${p.business.slug}` : "/discover"}
                    className="flex items-center gap-3 rounded-xl border border-line p-3 bg-surface-card hover:border-line-hover transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-surface-alt overflow-hidden flex-shrink-0">
                      {p.image_urls?.[0] ? (
                        <img src={p.image_urls[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink truncate">{p.name}</p>
                      <p className="text-xs text-ink-muted">
                        €{Number(p.price).toFixed(2)}
                        {p.business && ` · ${p.business.name}`}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-ink-muted flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.streams.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
                <Video size={16} />
                Watch again
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {results.streams.map((s) => (
                  <Link
                    key={s.id}
                    href={s.business ? `/pjazza/live-shop/${s.business.slug}` : "/pjazza/discover"}
                    className="rounded-xl border border-line overflow-hidden bg-surface-card hover:border-line-hover transition-colors"
                  >
                    <div className="aspect-video bg-surface-alt relative">
                      {s.video_url ? (
                        <video src={s.video_url} className="w-full h-full object-cover" muted />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play size={24} className="text-ink-muted" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {s.title || s.business?.name || "Replay"}
                        </span>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-ink-muted truncate">
                        {s.business?.name || "Stream"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
