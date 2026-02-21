-- PJAZZA Rich business data — logos, gallery, reviews
-- Run after 003_storage_bucket.sql

-- Add columns to businesses
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS google_review_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS google_rating DECIMAL(2,1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tripadvisor_review_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tripadvisor_rating DECIMAL(2,1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS address_full TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS website_url TEXT,
  ADD COLUMN IF NOT EXISTS opening_hours TEXT,
  ADD COLUMN IF NOT EXISTS vibe_summary TEXT;

-- Curated reviews (best 2, worst 2 per business for vibe check)
CREATE TABLE IF NOT EXISTS public.business_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('google', 'tripadvisor', 'other')),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  author_name TEXT,
  is_positive BOOLEAN NOT NULL,  -- true = best, false = worst
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_reviews_business ON public.business_reviews(business_id);
ALTER TABLE public.business_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read business_reviews" ON public.business_reviews FOR SELECT USING (true);
