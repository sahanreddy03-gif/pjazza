-- Dietary filters for consumer profiles (Halal, Vegan, Gluten-Free)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS dietary_filters TEXT[] DEFAULT '{}';
