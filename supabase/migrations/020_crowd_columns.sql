-- crowd_pct and crowd_updated_at for Crowd Intelligence display
-- V1 Definition: "displays for at least 10 businesses"

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS crowd_pct INT DEFAULT 0 CHECK (crowd_pct >= 0 AND crowd_pct <= 100),
  ADD COLUMN IF NOT EXISTS crowd_updated_at TIMESTAMPTZ;
