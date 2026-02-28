-- accessibility_filters on profiles (wheelchair, sensory_friendly)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS accessibility_filters TEXT[] DEFAULT '{}';
