-- Native PJAZZA reviews (post-transaction, consumer leaves rating + text)
-- REFERENCE: docs/REFERENCE.md section 1.6

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  consumer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_business ON public.reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON public.reviews(booking_id);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Consumers insert own reviews" ON public.reviews;
CREATE POLICY "Consumers insert own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = consumer_id);

-- Photo verification for product/service bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS seller_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS buyer_approved BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS buyer_approved_at TIMESTAMPTZ;
