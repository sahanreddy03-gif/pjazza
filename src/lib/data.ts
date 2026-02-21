/**
 * PJAZZA data fetching — Supabase queries with fallback to mock data
 */

import { createClient } from "@/src/lib/supabase/server";
import type { BusinessRow, ProductRow, StreamRow } from "@/src/types/supabase";

// Sector labels for UI
const SECTOR_LABELS: Record<string, string> = {
  food: "Food & Dining",
  property: "Property",
  cars: "Cars & Auto",
  yachts: "Yachts & Marine",
  "home-services": "Home Services",
  wellness: "Wellness",
  fashion: "Fashion & Retail",
  electronics: "Electronics",
  tourism: "Tourism",
  education: "Education",
  pets: "Pets & Animals",
  beauty: "Beauty",
};

// Default cover images by sector
const SECTOR_IMAGES: Record<string, string> = {
  electronics: "/pjazza/images/stores/electronics-store.jpg",
  fashion: "/pjazza/images/stores/fashion-boutique.jpg",
  cars: "/pjazza/images/stores/car-dealership.jpg",
  food: "/pjazza/images/stores/restaurant.jpg",
  property: "/pjazza/images/stores/property-office.jpg",
  wellness: "/pjazza/images/stores/spa-center.jpg",
  "home-services": "/pjazza/images/stores/hardware-store.jpg",
  pets: "/pjazza/images/stores/pet-shop.jpg",
  yachts: "/pjazza/images/stores/yacht-marina.jpg",
  beauty: "/pjazza/images/stores/hair-salon.jpg",
  education: "/pjazza/images/stores/bookstore.jpg",
  tourism: "/pjazza/images/stores/gift-shop.jpg",
};

export type StoreForList = {
  id: string;
  slug: string;
  name: string;
  sector: string;
  sectorLabel: string;
  location: string;
  rating: number;
  reviews: number;
  googleReviews?: number;
  tripadvisorReviews?: number;
  liveNow: boolean;
  viewers: number;
  salesperson: string;
  delivery: string;
  img: string;
  logoUrl?: string;
  vibeSummary?: string;
  featured: boolean;
};

export type CuratedReview = {
  platform: string;
  rating: number;
  text: string;
  author: string;
  isPositive: boolean;
};

export type StoreWithProducts = {
  id: string;
  name: string;
  salesperson: string;
  salespersonImg: string;
  location: string;
  sector: string;
  viewers: number;
  img: string;
  logoUrl?: string;
  imageUrls?: string[];
  videoUrl?: string;
  googleReviews?: number;
  googleRating?: number;
  tripadvisorReviews?: number;
  tripadvisorRating?: number;
  curatedReviews?: CuratedReview[];
  vibeSummary?: string;
  addressFull?: string;
  phone?: string;
  websiteUrl?: string;
  products: {
    id: string;
    name: string;
    price: string;
    priceNum: number;
    desc: string;
  }[];
};

export type StreamForList = {
  name: string;
  location: string;
  viewers: number;
  category: string;
  img: string;
  rating: number;
  businessId?: string;
  slug?: string; // store slug for linking to live-shop
  videoUrl?: string | null; // replay video URL
  roomId?: string | null; // LiveKit room for live streams
  isLive: boolean;
};

function businessToStore(b: BusinessRow & { google_review_count?: number | null; tripadvisor_review_count?: number | null; google_rating?: number | null; vibe_summary?: string | null; logo_url?: string | null }, index: number): StoreForList {
  const sector = b.industry || "retail";
  const googleCount = b.google_review_count ?? 0;
  const taCount = b.tripadvisor_review_count ?? 0;
  const totalReviews = googleCount + taCount;
  const rating = b.google_rating ? Number(b.google_rating) : (b.tripadvisor_rating ? Number(b.tripadvisor_rating) : 4.6);
  return {
    id: b.id,
    slug: b.slug,
    name: b.name,
    sector,
    sectorLabel: SECTOR_LABELS[sector] || sector,
    location: b.locality || "Malta",
    rating,
    reviews: totalReviews || 50 + index * 20,
    googleReviews: googleCount || undefined,
    tripadvisorReviews: taCount || undefined,
    liveNow: b.is_live,
    viewers: b.live_viewer_count ?? 0,
    salesperson: "",
    delivery: b.is_live ? "Same-day" : "Book session",
    img: b.cover_image_url || SECTOR_IMAGES[sector] || "/pjazza/images/stores/electronics-store.jpg",
    logoUrl: b.logo_url || undefined,
    vibeSummary: b.vibe_summary || undefined,
    featured: index < 3 && b.is_live,
  };
}

function businessAndProductsToStore(
  b: BusinessRow & { logo_url?: string | null; image_urls?: string[] | null; google_review_count?: number | null; google_rating?: number | null; tripadvisor_review_count?: number | null; tripadvisor_rating?: number | null; vibe_summary?: string | null; address_full?: string | null; phone?: string | null; website_url?: string | null },
  products: ProductRow[],
  salespersonName: string,
  videoUrl?: string | null,
  curatedReviews?: { platform: string; rating: number; review_text: string; author_name: string | null; is_positive: boolean }[]
): StoreWithProducts {
  const sector = b.industry || "retail";
  const sectorLabel = SECTOR_LABELS[sector] || sector;
  const reviews: CuratedReview[] = (curatedReviews || []).map((r) => ({
    platform: r.platform,
    rating: r.rating,
    text: r.review_text,
    author: r.author_name || "Anonymous",
    isPositive: r.is_positive,
  }));
  return {
    id: b.id,
    name: b.name,
    salesperson: salespersonName,
    salespersonImg: "/pjazza/images/stores/salesperson-1.jpg",
    location: b.locality || "Malta",
    sector: sectorLabel,
    viewers: b.live_viewer_count ?? 0,
    img: b.cover_image_url || SECTOR_IMAGES[sector] || "/pjazza/images/stores/electronics-store.jpg",
    logoUrl: b.logo_url || undefined,
    imageUrls: (b.image_urls && b.image_urls.length > 0) ? b.image_urls : undefined,
    videoUrl: videoUrl || undefined,
    googleReviews: b.google_review_count ?? undefined,
    googleRating: b.google_rating ? Number(b.google_rating) : undefined,
    tripadvisorReviews: b.tripadvisor_review_count ?? undefined,
    tripadvisorRating: b.tripadvisor_rating ? Number(b.tripadvisor_rating) : undefined,
    curatedReviews: reviews.length > 0 ? reviews : undefined,
    vibeSummary: b.vibe_summary || undefined,
    addressFull: b.address_full || undefined,
    phone: b.phone || undefined,
    websiteUrl: b.website_url || undefined,
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      price: new Intl.NumberFormat("en", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
      }).format(Number(p.price)),
      priceNum: Number(p.price),
      desc: p.description || "",
    })),
  };
}

function streamToForList(
  s: StreamRow,
  business?: { id?: string; name: string; locality: string; industry: string; cover_image_url: string | null; slug?: string }
): StreamForList {
  const sector = business?.industry || "retail";
  const bizId = s.business_id ?? business?.id;
  return {
    name: business?.name || s.title || "Live Stream",
    location: business?.locality || "Malta",
    viewers: s.peak_viewers ?? 0,
    category: SECTOR_LABELS[sector] || sector,
    img: s.thumbnail_url || business?.cover_image_url || SECTOR_IMAGES[sector] || "/pjazza/images/thumb-food.jpg",
    rating: 4.7,
    businessId: bizId ?? undefined,
    slug: business?.slug,
    videoUrl: s.video_url,
    roomId: s.room_id ?? (bizId ? `store-${bizId}` : null),
    isLive: s.is_live ?? false,
  };
}

// ─── Fetch functions ────────────────────────────────────────────────────────

export async function getStores(): Promise<StoreForList[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .order("live_viewer_count", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((b, i) => businessToStore(b as BusinessRow, i));
    }
  } catch {
    // Supabase not configured or table missing
  }
  return getMockStores();
}

const SLUG_TO_ID: Record<string, string> = {
  "tec-001": "techhub-malta",
  "fas-001": "luxe-boutique",
  "car-001": "malta-motors",
  "fod-001": "nonis-kitchen",
  "prp-001": "island-properties",
  "spa-001": "fortina-wellness",
  "hdw-001": "malfix-hardware",
  "pet-001": "paws-claws",
  "yht-001": "grand-harbour-charters",
  "sal-001": "salon-de-malta",
  "edu-001": "the-book-nook",
  "tou-001": "malta-souvenirs",
  "frank-salt": "frank-salt",
  "bay-street": "bay-street-complex",
  "plaza": "the-plaza-sliema",
  "charles-ron": "charles-ron-valletta",
  "soap-cafe": "soap-cafe-valletta",
  "ta-qali": "ta-qali-crafts-village",
  "scan": "scan-malta",
};

export async function getStoreBySlug(slugOrId: string): Promise<StoreWithProducts | null> {
  const slug = SLUG_TO_ID[slugOrId] ?? slugOrId;
  try {
    const supabase = await createClient();
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("*")
      .eq("slug", slug)
      .single();

    if (bizError || !business) return null;

    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("business_id", business.id)
      .eq("is_available", true)
      .order("name");

    const [{ data: stream }, { data: allReviews }] = await Promise.all([
      supabase.from("streams").select("video_url").eq("business_id", business.id).not("video_url", "is", null).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("business_reviews").select("platform, rating, review_text, author_name, is_positive").eq("business_id", business.id),
    ]);
    const best = (allReviews || []).filter((r) => r.is_positive).sort((a, b) => b.rating - a.rating).slice(0, 2);
    const worst = (allReviews || []).filter((r) => !r.is_positive).sort((a, b) => a.rating - b.rating).slice(0, 2);
    const reviews = [...best, ...worst];

    const salesperson =
      ["Maria C.", "Sophie V.", "Joe Z.", "Noni G.", "Karl B.", "Anton F.", "Marco S.", "Diane Z."][
        Math.abs(
          (business.name?.charCodeAt(0) || 0) + (business.slug?.charCodeAt(0) || 0)
        ) % 8
      ] || "Sales Rep";
    return businessAndProductsToStore(
      business as BusinessRow,
      (products || []) as ProductRow[],
      salesperson,
      stream?.video_url,
      reviews as { platform: string; rating: number; review_text: string; author_name: string | null; is_positive: boolean }[] | undefined
    );
  } catch {
    return getMockStoreBySlug(slug);
  }
}

export async function getStreams(): Promise<StreamForList[]> {
  try {
    const supabase = await createClient();
    const { data: streams, error } = await supabase
      .from("streams")
      .select("*")
      .eq("is_live", true)
      .order("peak_viewers", { ascending: false })
      .limit(10);

    if (!error && streams && streams.length > 0) {
      const bizIds = [...new Set(streams.map((s) => s.business_id).filter(Boolean))] as string[];
      const { data: businesses } = bizIds.length > 0
        ? await supabase.from("businesses").select("id, name, locality, industry, cover_image_url, slug").in("id", bizIds)
        : { data: [] };
      const bizMap = new Map((businesses || []).map((b: { id: string; name: string; locality: string; industry: string; cover_image_url: string | null; slug?: string }) => [b.id, b]));
      return (streams as StreamRow[]).map((s) =>
        streamToForList(s, s.business_id ? bizMap.get(s.business_id) : undefined)
      );
    }

    // Fallback: derive from live businesses
    const { data: businesses } = await supabase
      .from("businesses")
      .select("*")
      .eq("is_live", true)
      .order("live_viewer_count", { ascending: false })
      .limit(6);

    if (businesses && businesses.length > 0) {
      return (businesses as BusinessRow[]).map((b) => ({
        name: b.name,
        location: b.locality || "Malta",
        viewers: b.live_viewer_count ?? 0,
        category: SECTOR_LABELS[b.industry] || b.industry,
        img: b.cover_image_url || SECTOR_IMAGES[b.industry] || "/pjazza/images/thumb-food.jpg",
        rating: 4.7,
        businessId: b.id,
        slug: b.slug,
        videoUrl: null,
        roomId: `store-${b.id}`,
        isLive: true,
      }));
    }
  } catch {
    // Fall through to mock
  }
  return getMockStreams();
}

/** Fetches live streams + replays (streams with video_url) for consumer Live feed */
export async function getStreamsWithReplays(): Promise<StreamForList[]> {
  try {
    const supabase = await createClient();
    const { data: liveStreams } = await supabase
      .from("streams")
      .select("*")
      .eq("is_live", true)
      .order("peak_viewers", { ascending: false })
      .limit(6);
    const { data: replays } = await supabase
      .from("streams")
      .select("*")
      .not("video_url", "is", null)
      .eq("is_live", false)
      .order("created_at", { ascending: false })
      .limit(6);
    const all = [...(liveStreams || []), ...(replays || []).filter((r) => !liveStreams?.some((l) => l.id === r.id))];
    if (all.length > 0) {
      const bizIds = [...new Set(all.map((s) => s.business_id).filter(Boolean))] as string[];
      const { data: businesses } = bizIds.length > 0
        ? await supabase.from("businesses").select("id, name, locality, industry, cover_image_url, slug").in("id", bizIds)
        : { data: [] };
      const bizMap = new Map((businesses || []).map((b: { id: string; name: string; locality: string; industry: string; cover_image_url: string | null; slug?: string }) => [b.id, b]));
      return (all as StreamRow[]).map((s) => streamToForList(s, s.business_id ? bizMap.get(s.business_id) : undefined));
    }
  } catch {
    //
  }
  const streams = await getStreams();
  return streams.length > 0 ? streams : getMockStreams();
}

export async function getLiveBusinessCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("businesses")
      .select("*", { count: "exact", head: true })
      .eq("is_live", true);
    if (!error && count != null) return count;
  } catch {
    //
  }
  return 8; // mock default
}

export async function getBusinessCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("businesses")
      .select("*", { count: "exact", head: true });
    if (!error && count != null) return count;
  } catch {
    //
  }
  return 24; // mock fallback
}

// ─── Mock fallbacks (when Supabase has no data) ──────────────────────────────

function getMockStores(): StoreForList[] {
  const sectorImages: Record<string, string> = {
    electronics: "/pjazza/images/stores/electronics-store.jpg",
    fashion: "/pjazza/images/stores/fashion-boutique.jpg",
    cars: "/pjazza/images/stores/car-dealership.jpg",
    food: "/pjazza/images/stores/restaurant.jpg",
    property: "/pjazza/images/stores/property-office.jpg",
    wellness: "/pjazza/images/stores/spa-center.jpg",
    "home-services": "/pjazza/images/stores/hardware-store.jpg",
    pets: "/pjazza/images/stores/pet-shop.jpg",
    yachts: "/pjazza/images/stores/yacht-marina.jpg",
    beauty: "/pjazza/images/stores/hair-salon.jpg",
    education: "/pjazza/images/stores/bookstore.jpg",
    tourism: "/pjazza/images/stores/gift-shop.jpg",
  };
  const sectorLabels: Record<string, string> = {
    electronics: "Electronics",
    fashion: "Fashion & Retail",
    cars: "Cars & Auto",
    food: "Food & Dining",
    property: "Property",
    wellness: "Wellness",
    "home-services": "Home Services",
    pets: "Pets & Animals",
    yachts: "Yachts & Marine",
    beauty: "Beauty",
    education: "Education",
    tourism: "Tourism",
  };
  const mock: Array<{
    id: string;
    slug: string;
    name: string;
    sector: string;
    location: string;
    liveNow: boolean;
    viewers: number;
    salesperson: string;
    img: string;
    googleReviews?: number;
    tripadvisorReviews?: number;
    rating?: number;
    vibeSummary?: string;
  }> = [
    { id: "tec-001", slug: "techhub-malta", name: "TechHub Malta", sector: "electronics", location: "St Julian's", liveNow: true, viewers: 34, salesperson: "Maria C.", img: sectorImages.electronics, googleReviews: 127, tripadvisorReviews: 89, rating: 4.7, vibeSummary: "Friendly tech hub. Staff know their stuff." },
    { id: "fas-001", slug: "luxe-boutique", name: "Luxe Boutique", sector: "fashion", location: "Sliema", liveNow: true, viewers: 28, salesperson: "Sophie V.", img: sectorImages.fashion, googleReviews: 203, tripadvisorReviews: 156, rating: 4.6, vibeSummary: "Curated fashion, Mediterranean feel." },
    { id: "car-001", slug: "malta-motors", name: "Malta Motors", sector: "cars", location: "Birkirkara", liveNow: true, viewers: 45, salesperson: "Joe Z.", img: sectorImages.cars, googleReviews: 312, tripadvisorReviews: 87, rating: 4.4, vibeSummary: "No-nonsense car sales. Transparent pricing." },
    { id: "fod-001", slug: "nonis-kitchen", name: "Noni's Kitchen", sector: "food", location: "Sliema", liveNow: true, viewers: 52, salesperson: "Noni G.", img: sectorImages.food, googleReviews: 847, tripadvisorReviews: 612, rating: 4.8, vibeSummary: "Family-run Maltese cuisine. Pastizzi and rabbit stew." },
    { id: "prp-001", slug: "island-properties", name: "Island Properties", sector: "property", location: "Valletta", liveNow: true, viewers: 19, salesperson: "Karl B.", img: sectorImages.property },
    { id: "spa-001", slug: "fortina-wellness", name: "Fortina Wellness", sector: "wellness", location: "Sliema", liveNow: false, viewers: 0, salesperson: "", img: sectorImages.wellness },
    { id: "hdw-001", slug: "malfix-hardware", name: "MaltaFix Hardware", sector: "home-services", location: "Mosta", liveNow: true, viewers: 12, salesperson: "Anton F.", img: sectorImages["home-services"] },
    { id: "pet-001", slug: "paws-claws", name: "Paws & Claws", sector: "pets", location: "Naxxar", liveNow: false, viewers: 0, salesperson: "", img: sectorImages.pets },
    { id: "yht-001", slug: "grand-harbour-charters", name: "Grand Harbour Charters", sector: "yachts", location: "Grand Harbour", liveNow: true, viewers: 23, salesperson: "Marco S.", img: sectorImages.yachts },
    { id: "sal-001", slug: "salon-de-malta", name: "Salon de Malta", sector: "beauty", location: "Sliema", liveNow: false, viewers: 0, salesperson: "", img: sectorImages.beauty },
    { id: "edu-001", slug: "the-book-nook", name: "The Book Nook", sector: "education", location: "Msida", liveNow: false, viewers: 0, salesperson: "", img: sectorImages.education },
    { id: "tou-001", slug: "malta-souvenirs", name: "Malta Souvenirs", sector: "tourism", location: "Valletta", liveNow: true, viewers: 16, salesperson: "Diane Z.", img: sectorImages.tourism },
    { id: "a1b2c3d4-0013-4000-8000-000000000013", slug: "the-point-mall", name: "The Point Mall", sector: "fashion", location: "Sliema", liveNow: true, viewers: 41, salesperson: "Sales", img: sectorImages.fashion },
    { id: "a1b2c3d4-0014-4000-8000-000000000014", slug: "azar-malta", name: "Azar Malta", sector: "food", location: "Sliema", liveNow: true, viewers: 38, salesperson: "Chef", img: sectorImages.food },
    { id: "a1b2c3d4-0015-4000-8000-000000000015", slug: "mdina-glass", name: "Mdina Glass", sector: "tourism", location: "Ta' Qali", liveNow: false, viewers: 0, salesperson: "", img: sectorImages.tourism, googleReviews: 1234, tripadvisorReviews: 2103, rating: 4.7, vibeSummary: "Iconic Malta. Watch glassblowing. Unique pieces." },
    { id: "a1b2c3d4-0016-4000-8000-000000000016", slug: "frank-salt", name: "Frank Salt Real Estate", sector: "property", location: "Naxxar", liveNow: true, viewers: 22, salesperson: "Karl B.", img: sectorImages.property, googleReviews: 678, tripadvisorReviews: 445, rating: 4.6, vibeSummary: "Big agency. Huge inventory. Trusted name." },
    { id: "a1b2c3d4-0017-4000-8000-000000000017", slug: "bay-street-complex", name: "Bay Street Complex", sector: "fashion", location: "St Julian's", liveNow: false, viewers: 0, salesperson: "", img: sectorImages.fashion, googleReviews: 892, tripadvisorReviews: 1104, rating: 4.2, vibeSummary: "Tourist-friendly mall. Open until 10pm. Brands + entertainment." },
    { id: "a1b2c3d4-0018-4000-8000-000000000018", slug: "the-plaza-sliema", name: "The Plaza Shopping Centre", sector: "fashion", location: "Sliema", liveNow: false, viewers: 0, salesperson: "", img: sectorImages.fashion, googleReviews: 534, tripadvisorReviews: 412, rating: 4.0, vibeSummary: "Malta's OG mall since 1993. Fashion and makeup." },
    { id: "a1b2c3d4-0023-4000-8000-000000000023", slug: "charles-ron-valletta", name: "Charles & Ron", sector: "fashion", location: "Valletta", liveNow: false, viewers: 0, salesperson: "", img: sectorImages.fashion, googleReviews: 567, tripadvisorReviews: 423, rating: 4.7, vibeSummary: "Malta's top fashion label. Mediterranean flair. Quality." },
    { id: "a1b2c3d4-0024-4000-8000-000000000024", slug: "soap-cafe-valletta", name: "Soap Café", sector: "beauty", location: "Valletta", liveNow: false, viewers: 0, salesperson: "", img: sectorImages.beauty, googleReviews: 289, tripadvisorReviews: 198, rating: 4.6, vibeSummary: "Artisan beauty. Natural, local ingredients. Must-visit." },
    { id: "a1b2c3d4-0025-4000-8000-000000000025", slug: "ta-qali-crafts-village", name: "Ta' Qali Crafts Village", sector: "tourism", location: "Attard", liveNow: false, viewers: 0, salesperson: "", img: sectorImages.tourism, googleReviews: 1234, tripadvisorReviews: 1876, rating: 4.5, vibeSummary: "Maltese artisans. Silver filigree, blown glass. Watch makers at work." },
    { id: "a1b2c3d4-0041-4000-8000-000000000041", slug: "scan-malta", name: "Scan Malta", sector: "electronics", location: "Birkirkara", liveNow: false, viewers: 0, salesperson: "", img: sectorImages.electronics, googleReviews: 445, tripadvisorReviews: 267, rating: 4.5, vibeSummary: "Local tech shop. Gaming PCs. Knowledgeable staff." },
  ];
  return mock.map((s, i) => {
    const g = s.googleReviews ?? 0;
    const t = s.tripadvisorReviews ?? 0;
    return {
      ...s,
      sectorLabel: sectorLabels[s.sector] || s.sector,
      rating: s.rating ?? 4.6,
      reviews: g + t || 50 + i * 20,
      googleReviews: g || undefined,
      tripadvisorReviews: t || undefined,
      delivery: s.liveNow ? "Same-day" : "Book session",
      featured: i < 3 && s.liveNow,
    };
  });
}

function getMockStoreBySlug(slug: string): StoreWithProducts | null {
  const stores = getMockStores();
  const store = stores.find((s) => s.slug === slug);
  if (!store) return null;

  const mockProducts: Record<string, { id: string; name: string; price: string; priceNum: number; desc: string }[]> = {
    "techhub-malta": [
      { id: "p1", name: "iPhone 16 Pro Max", price: "€1,399", priceNum: 1399, desc: "256GB, Natural Titanium" },
      { id: "p2", name: "MacBook Air M3", price: "€1,299", priceNum: 1299, desc: '15", 16GB RAM, 512GB' },
      { id: "p3", name: "Sony WH-1000XM5", price: "€329", priceNum: 329, desc: "Wireless noise-cancelling" },
      { id: "p4", name: 'iPad Pro 13"', price: "€1,199", priceNum: 1199, desc: "M4 chip, 256GB" },
    ],
    "luxe-boutique": [
      { id: "p1", name: "Cashmere Wrap Coat", price: "€420", priceNum: 420, desc: "Italian wool blend, camel" },
      { id: "p2", name: "Silk Midi Dress", price: "€195", priceNum: 195, desc: "Emerald green, sizes XS-L" },
      { id: "p3", name: "Leather Tote Bag", price: "€280", priceNum: 280, desc: "Full grain, cognac" },
      { id: "p4", name: "Linen Blazer", price: "€165", priceNum: 165, desc: "Relaxed fit, navy" },
    ],
    "malta-motors": [
      { id: "p1", name: "2024 VW Polo 1.0 TSI", price: "€18,500", priceNum: 18500, desc: "12,000 km, Reflex Silver" },
      { id: "p2", name: "2023 SEAT Ibiza FR", price: "€16,900", priceNum: 16900, desc: "18,000 km, Midnight Black" },
      { id: "p3", name: "2024 Toyota Yaris", price: "€19,200", priceNum: 19200, desc: "8,000 km, Hybrid, Pearl White" },
    ],
    "nonis-kitchen": [
      { id: "p1", name: "Sunday Feast for 4", price: "€85", priceNum: 85, desc: "Rabbit stew, timpana, dessert" },
      { id: "p2", name: "Pastizzi Platter (50pc)", price: "€25", priceNum: 25, desc: "Ricotta & pea mix" },
      { id: "p3", name: "Maltese Wine Box", price: "€45", priceNum: 45, desc: "3 bottles, Meridiana & Marsovin" },
    ],
    "island-properties": [
      { id: "p1", name: "Sea View 2-Bed Apartment", price: "€1,350/mo", priceNum: 1350, desc: "Sliema, furnished, 90sqm" },
      { id: "p2", name: "Valletta Townhouse", price: "€650,000", priceNum: 650000, desc: "3 beds, restored, 200sqm" },
    ],
    "malfix-hardware": [
      { id: "p1", name: "Bosch Drill Set", price: "€89", priceNum: 89, desc: "18V cordless, 50pc accessories" },
      { id: "p2", name: "Paint Bundle", price: "€65", priceNum: 65, desc: "10L exterior white + brushes" },
      { id: "p3", name: "Bathroom Renovation Kit", price: "€420", priceNum: 420, desc: "Tiles, fixtures, adhesive" },
    ],
    "grand-harbour-charters": [
      { id: "p1", name: "Full Day Catamaran Charter", price: "€1,200", priceNum: 1200, desc: "40ft, up to 12 guests, crew included" },
      { id: "p2", name: "Sunset Cruise", price: "€350", priceNum: 350, desc: "3 hours, drinks included" },
      { id: "p3", name: "Gozo Day Trip", price: "€600", priceNum: 600, desc: "Private boat, snorkeling gear" },
    ],
    "malta-souvenirs": [
      { id: "p1", name: "Handblown Mdina Glass", price: "€35", priceNum: 35, desc: "Vase, blue-green swirl" },
      { id: "p2", name: "Maltese Lace Set", price: "€28", priceNum: 28, desc: "Table runner + 4 coasters" },
      { id: "p3", name: "Filigree Bracelet", price: "€65", priceNum: 65, desc: "Sterling silver, Maltese cross" },
    ],
    "mdina-glass": [
      { id: "p1", name: "Mdina Glass Vase", price: "€45", priceNum: 45, desc: "Handblown, blue swirl" },
      { id: "p2", name: "Glass Pendant Necklace", price: "€85", priceNum: 85, desc: "Sterling silver" },
    ],
    "frank-salt": [
      { id: "p1", name: "Sea View 2-Bed", price: "€1,350/mo", priceNum: 1350, desc: "Sliema, furnished" },
      { id: "p2", name: "Valletta Townhouse", price: "€650,000", priceNum: 650000, desc: "3 beds, restored" },
    ],
    "azar-malta": [
      { id: "p1", name: "Tasting Menu (5 courses)", price: "€65", priceNum: 65, desc: "Chef's selection, open flame" },
      { id: "p2", name: "Lamb Chops", price: "€32", priceNum: 32, desc: "Wood-fired, herbs" },
    ],
    "the-point-mall": [],
    "bay-street-complex": [{ id: "p1", name: "Gift Card", price: "€25", priceNum: 25, desc: "Use at any Bay Street store" }],
    "charles-ron-valletta": [
      { id: "p1", name: "Silk Blouse", price: "€165", priceNum: 165, desc: "Mediterranean collection" },
      { id: "p2", name: "Leather Crossbody", price: "€195", priceNum: 195, desc: "Handcrafted" },
    ],
    "soap-cafe-valletta": [
      { id: "p1", name: "Handmade Soap Set", price: "€18", priceNum: 18, desc: "3 soaps, local ingredients" },
      { id: "p2", name: "Face Cream", price: "€32", priceNum: 32, desc: "Natural, Maltese olive oil" },
    ],
    "ta-qali-crafts-village": [
      { id: "p1", name: "Silver Filigree Pendant", price: "€85", priceNum: 85, desc: "Handcrafted" },
      { id: "p2", name: "Blown Glass Vase", price: "€45", priceNum: 45, desc: "Mdina style" },
    ],
    "scan-malta": [
      { id: "p1", name: "Gaming Mouse", price: "€79", priceNum: 79, desc: "RGB, 16000 DPI" },
      { id: "p2", name: "Mechanical Keyboard", price: "€129", priceNum: 129, desc: "Cherry MX" },
    ],
  };
  const products = (mockProducts[slug] || [{ id: "p1", name: "Product", price: "€0", priceNum: 0, desc: "" }]).map((p) => ({
    ...p,
    price: p.price,
    priceNum: p.priceNum,
  }));
  const mockVibes: Record<string, string> = {
    "techhub-malta": "Friendly tech hub. Staff know their stuff. Good for repairs and latest gadgets.",
    "nonis-kitchen": "Family-run Maltese cuisine. Warm, authentic. Pastizzi and rabbit stew are must-tries.",
    "grand-harbour-charters": "Premium charters. Sunset cruises and full-day trips. Crew know the waters.",
    "azar-malta": "Best restaurant in Sliema. Fire-cooked magic. Book weeks ahead. Worth it.",
    "mdina-glass": "Iconic Malta. Watch glassblowing free. Buy unique pieces. Tourist favourite.",
  };
  const mockReviews: Record<string, CuratedReview[]> = {
    "nonis-kitchen": [
      { platform: "google", rating: 5, text: "Best Maltese food we had. Rabbit stew incredible.", author: "Marco D.", isPositive: true },
      { platform: "tripadvisor", rating: 5, text: "Authentic, warm, delicious. Worth every euro.", author: "Anna B.", isPositive: true },
      { platform: "google", rating: 2, text: "Waited 45 mins. Food good but service slow.", author: "John T.", isPositive: false },
      { platform: "tripadvisor", rating: 3, text: "Nice food. A bit touristy.", author: "Lisa R.", isPositive: false },
    ],
    "azar-malta": [
      { platform: "google", rating: 5, text: "Incredible meal. Best dinner of our lives. Book now.", author: "Oliver R.", isPositive: true },
      { platform: "tripadvisor", rating: 5, text: "Number 1 in Sliema for a reason.", author: "Emma W.", isPositive: true },
      { platform: "google", rating: 3, text: "Amazing food. Tables are tight.", author: "James B.", isPositive: false },
      { platform: "tripadvisor", rating: 4, text: "Worth the hype. Wine list expensive.", author: "Laura S.", isPositive: false },
    ],
  };
  const richStore = store as StoreForList & { googleReviews?: number; tripadvisorReviews?: number; vibeSummary?: string };
  return {
    id: store.id,
    name: store.name,
    salesperson: store.salesperson || "Sales Rep",
    salespersonImg: "/pjazza/images/stores/salesperson-1.jpg",
    location: store.location,
    sector: store.sectorLabel,
    viewers: store.viewers,
    img: store.img,
    imageUrls: [store.img],
    googleReviews: richStore.googleReviews,
    googleRating: richStore.rating,
    tripadvisorReviews: richStore.tripadvisorReviews,
    vibeSummary: richStore.vibeSummary || mockVibes[slug],
    curatedReviews: mockReviews[slug],
    addressFull: "Malta",
    products: products.map((p) => ({
      ...p,
      price: p.price,
      priceNum: p.priceNum,
      desc: p.desc,
    })),
  };
}

function getMockStreams(): StreamForList[] {
  const mockBizIds = ["fod-001", "yht-001", "prp-001", "car-001", "spa-001"];
  const mockSlugs = ["nonis-kitchen", "grand-harbour-charters", "island-properties", "malta-motors", "fortina-wellness"];
  return [
    { name: "Noni's Kitchen", location: "Sliema", viewers: 47, category: "Restaurant", img: "/pjazza/images/thumb-food.jpg", rating: 4.8, businessId: mockBizIds[0], slug: mockSlugs[0], isLive: true, roomId: `store-${mockBizIds[0]}`, videoUrl: null },
    { name: "Blue Harbour Charters", location: "Grand Harbour", viewers: 23, category: "Yacht Charter", img: "/pjazza/images/thumb-yacht.jpg", rating: 4.9, businessId: mockBizIds[1], slug: mockSlugs[1], isLive: true, roomId: `store-${mockBizIds[1]}`, videoUrl: null },
    { name: "Seaview Residence", location: "St Julian's", viewers: 18, category: "Real Estate", img: "/pjazza/images/thumb-property.jpg", rating: 4.7, businessId: mockBizIds[2], slug: mockSlugs[2], isLive: true, roomId: `store-${mockBizIds[2]}`, videoUrl: null },
    { name: "Malta Motors", location: "Birkirkara", viewers: 31, category: "Automotive", img: "/pjazza/images/thumb-car.jpg", rating: 4.6, businessId: mockBizIds[3], slug: mockSlugs[3], isLive: false, roomId: null, videoUrl: null },
    { name: "Fortina Spa", location: "Sliema", viewers: 15, category: "Wellness", img: "/pjazza/images/thumb-wellness.jpg", rating: 4.8, businessId: mockBizIds[4], slug: mockSlugs[4], isLive: false, roomId: null, videoUrl: null },
  ];
}
