-- Allow business owners to read bookings for their business
CREATE POLICY "Business owners read own business bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = bookings.business_id AND b.owner_id = auth.uid()
    )
  );
