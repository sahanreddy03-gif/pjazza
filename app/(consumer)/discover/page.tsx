/**
 * Consumer Home / Discover — main consumer home screen
 * @see docs/PRD.md 4.1, docs/REFERENCE.md section 3
 */

import { createClient } from "@/src/lib/supabase/server";
import { SEED_BUSINESSES } from "@/src/lib/seed-data";
import { SectionHeader } from "@/src/components/ui";
import {
  HeroCard,
  SearchBar,
  TierSelector,
  CategoryGrid,
  LiveStreamCard,
  CrowdIntelligence,
} from "@/src/components/consumer";


export default async function DiscoverPage() {
  let displayBusinesses = SEED_BUSINESSES;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .order("live_viewer_count", { ascending: false });

    if (!error && data && data.length > 0) {
      displayBusinesses = data as typeof SEED_BUSINESSES;
    }
  } catch {
    // No Supabase or table missing — use seed data
  }

  const liveBusinesses = displayBusinesses.filter((b) => b.is_live);

  return (
    <div className="space-y-6">
      {/* 1. Hero card */}
      <HeroCard />

      {/* 2. Search bar */}
      <SearchBar />

      {/* 3. Tier selector */}
      <TierSelector />

      {/* 4. Category grid */}
      <section>
        <SectionHeader title="Explore" subtitle="Browse by category" />
        <div className="mt-3">
          <CategoryGrid />
        </div>
      </section>

      {/* 5. Live Now */}
      <section>
        <SectionHeader
          title="Live Now"
          subtitle={`${liveBusinesses.length} streaming`}
        />
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {liveBusinesses.length > 0 ? (
            liveBusinesses.map((b) => <LiveStreamCard key={b.id} business={b} />)
          ) : (
            displayBusinesses.slice(0, 3).map((b) => (
              <LiveStreamCard key={b.id} business={b} />
            ))
          )}
        </div>
      </section>

      {/* 6. Crowd Intelligence */}
      <section>
        <SectionHeader
          title="Crowd Intelligence"
          subtitle="Current capacity"
        />
        <div className="mt-3">
          <CrowdIntelligence businesses={displayBusinesses} />
        </div>
      </section>
    </div>
  );
}
