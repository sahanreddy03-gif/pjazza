-- PJAZZA Cruise arrivals — powers dashboard "best time to go live" alerts
-- Malta cruise schedule: Grand Harbour, Valletta

CREATE TABLE IF NOT EXISTS public.cruise_arrivals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_name TEXT NOT NULL,
  port TEXT NOT NULL DEFAULT 'Grand Harbour',
  arrival_at TIMESTAMPTZ NOT NULL,
  passenger_count INT,
  best_live_start TIMESTAMPTZ,
  best_live_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cruise_arrivals_arrival ON public.cruise_arrivals(arrival_at);
ALTER TABLE public.cruise_arrivals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cruise_arrivals" ON public.cruise_arrivals FOR SELECT USING (true);

-- Seed: MSC Grandiosa and typical Malta cruise arrivals (idempotent: clear + insert)
DELETE FROM public.cruise_arrivals;
INSERT INTO public.cruise_arrivals (ship_name, port, arrival_at, passenger_count, best_live_start, best_live_end) VALUES
  ('MSC Grandiosa', 'Grand Harbour', (DATE_TRUNC('day', NOW()) + INTERVAL '1 day' + INTERVAL '8 hours')::TIMESTAMPTZ, 4842,
   (DATE_TRUNC('day', NOW()) + INTERVAL '1 day' + INTERVAL '9 hours 30 minutes')::TIMESTAMPTZ,
   (DATE_TRUNC('day', NOW()) + INTERVAL '1 day' + INTERVAL '11 hours')::TIMESTAMPTZ),
  ('Costa Smeralda', 'Grand Harbour', (DATE_TRUNC('day', NOW()) + INTERVAL '2 days' + INTERVAL '7 hours')::TIMESTAMPTZ, 5200,
   (DATE_TRUNC('day', NOW()) + INTERVAL '2 days' + INTERVAL '8 hours 30 minutes')::TIMESTAMPTZ,
   (DATE_TRUNC('day', NOW()) + INTERVAL '2 days' + INTERVAL '10 hours')::TIMESTAMPTZ),
  ('Norwegian Epic', 'Grand Harbour', (DATE_TRUNC('day', NOW()) + INTERVAL '3 days' + INTERVAL '6 hours')::TIMESTAMPTZ, 4100,
   (DATE_TRUNC('day', NOW()) + INTERVAL '3 days' + INTERVAL '7 hours 30 minutes')::TIMESTAMPTZ,
   (DATE_TRUNC('day', NOW()) + INTERVAL '3 days' + INTERVAL '9 hours 30 minutes')::TIMESTAMPTZ);
