-- Add email to businesses (core contact)
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS email TEXT;

-- Business links: social, industry-specific, often overlooked
-- Whatever they link, it shows on their business profile
CREATE TABLE IF NOT EXISTS public.business_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  link_type TEXT NOT NULL,
  url TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, link_type)
);

CREATE INDEX IF NOT EXISTS idx_business_links_business ON public.business_links(business_id);

ALTER TABLE public.business_links ENABLE ROW LEVEL SECURITY;

-- Public read (links show on profile)
CREATE POLICY "Public read business_links"
  ON public.business_links FOR SELECT
  USING (true);

-- Owners manage links
CREATE POLICY "Owners manage business_links"
  ON public.business_links FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_id = auth.uid())
  );
