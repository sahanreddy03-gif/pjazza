-- Business attributes for discover filtering (dietary, accessibility, price tier)
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS dietary_tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS wheelchair_accessible BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS price_tier TEXT;
