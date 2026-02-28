-- Run all migrations 015–020 in order (copy-paste into Supabase SQL Editor)
-- 015
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS delivery_method TEXT,
  ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_address TEXT;

-- 016
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS dietary_filters TEXT[] DEFAULT '{}';

-- 017
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT,
  auth TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users manage own subscriptions" ON public.push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- 018
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS accessibility_filters TEXT[] DEFAULT '{}';

-- 019
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS dietary_tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS wheelchair_accessible BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS price_tier TEXT;

-- 020
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS crowd_pct INT DEFAULT 0 CHECK (crowd_pct >= 0 AND crowd_pct <= 100),
  ADD COLUMN IF NOT EXISTS crowd_updated_at TIMESTAMPTZ;
