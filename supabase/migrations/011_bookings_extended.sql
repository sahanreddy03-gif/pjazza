-- Bookings extended columns for commission, type, date/time
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS booking_type TEXT DEFAULT 'table',
  ADD COLUMN IF NOT EXISTS date DATE,
  ADD COLUMN IF NOT EXISTS time TIME,
  ADD COLUMN IF NOT EXISTS guests INT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,4) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS net_business_amount DECIMAL(10,2) DEFAULT 0;
