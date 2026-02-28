/**
 * Enrich business with Google Places API
 * Photos, ratings, reviews, address, phone, website
 * https://developers.google.com/maps/documentation/places/web-service
 */

import type { GooglePlacesData } from "./types";

const API_BASE = "https://maps.googleapis.com/maps/api/place";

export async function enrichBusinessWithGooglePlaces(
  name: string,
  locality: string,
  apiKey: string
): Promise<GooglePlacesData | null> {
  const query = `${name} ${locality} Malta`;

  // Find Place (text search)
  const findRes = await fetch(
    `${API_BASE}/findplacefromtext/json?` +
      new URLSearchParams({
        input: query,
        inputtype: "textquery",
        fields: "place_id,name,rating,user_ratings_total,photos,formatted_address",
        key: apiKey,
      })
  );
  const findData = (await findRes.json()) as { candidates?: { place_id: string }[] };
  const placeId = findData.candidates?.[0]?.place_id;
  if (!placeId) return null;

  // Place Details (full data)
  const detailsRes = await fetch(
    `${API_BASE}/details/json?` +
      new URLSearchParams({
        place_id: placeId,
        fields:
          "name,rating,user_ratings_total,photos,reviews,formatted_address,formatted_phone_number,website",
        key: apiKey,
      })
  );
  const detailsData = (await detailsRes.json()) as {
    result?: {
      rating?: number;
      user_ratings_total?: number;
      photos?: { photo_reference: string }[];
      reviews?: { author_name?: string; text?: string; rating?: number }[];
      formatted_address?: string;
      formatted_phone_number?: string;
      website?: string;
    };
  };
  const r = detailsData.result;
  if (!r) return null;

  const out: GooglePlacesData = {
    google_rating: r.rating ?? undefined,
    google_review_count: r.user_ratings_total ?? undefined,
    address_full: r.formatted_address ?? undefined,
    phone: r.formatted_phone_number ?? undefined,
    website_url: r.website ?? undefined,
  };

  // Build photo URLs (first 5)
  if (r.photos?.length && apiKey) {
    out.cover_image_url = `${API_BASE}/photo?maxwidth=800&photo_reference=${r.photos[0].photo_reference}&key=${apiKey}`;
    out.image_urls = r.photos.slice(0, 5).map(
      (p) => `${API_BASE}/photo?maxwidth=600&photo_reference=${p.photo_reference}&key=${apiKey}`
    );
  }

  if (r.reviews?.length) {
    out.reviews = r.reviews.slice(0, 5).map((rev) => ({
      author: rev.author_name ?? "Anonymous",
      text: rev.text ?? "",
      rating: rev.rating ?? 5,
    }));
  }

  return out;
}
