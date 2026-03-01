-- Allow users to create their own profile (in case signup trigger didn't run)
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Explicit policy: authenticated users can create businesses they own
DROP POLICY IF EXISTS "Authenticated insert own business" ON public.businesses;
CREATE POLICY "Authenticated insert own business"
  ON public.businesses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);
