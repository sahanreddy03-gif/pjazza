export interface EnrichmentResult {
  success: boolean;
  source: string;
  data: Record<string, unknown>;
  errors?: string[];
}

export interface GooglePlacesData {
  google_rating?: number;
  google_review_count?: number;
  cover_image_url?: string;
  image_urls?: string[];
  address_full?: string;
  phone?: string;
  website_url?: string;
  reviews?: { author: string; text: string; rating: number }[];
}

export interface ProductFromWebsite {
  name: string;
  price?: number;
  description?: string;
  image_url?: string;
  url?: string;
}
