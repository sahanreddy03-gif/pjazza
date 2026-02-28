-- Allow authenticated users to claim unclaimed businesses (set owner_id)
CREATE POLICY "Authenticated claim unclaimed businesses"
  ON public.businesses
  FOR UPDATE
  TO authenticated
  USING (owner_id IS NULL)
  WITH CHECK (auth.uid() = owner_id);
