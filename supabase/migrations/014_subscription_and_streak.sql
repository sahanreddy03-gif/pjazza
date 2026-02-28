-- Phase 7: Subscription plan + streaming streak
-- businesses.subscription: free, starter, pro, enterprise
-- businesses.streaming_streak: consecutive days streamed

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS subscription TEXT DEFAULT 'free' CHECK (subscription IN ('free', 'starter', 'pro', 'enterprise')),
  ADD COLUMN IF NOT EXISTS streaming_streak INT DEFAULT 0;
