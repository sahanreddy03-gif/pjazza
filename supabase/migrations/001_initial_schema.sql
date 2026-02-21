-- PJAZZA Initial Schema
-- Run with: supabase db push (or paste in Supabase SQL Editor)

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'consumer' CHECK (role IN ('consumer', 'business', 'admin')),
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Businesses
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry TEXT NOT NULL,
  description TEXT,
  address TEXT,
  locality TEXT,
  verified BOOLEAN DEFAULT FALSE,
  stripe_account_id TEXT,
  is_live BOOLEAN DEFAULT FALSE,
  live_viewer_count INT DEFAULT 0,
  stream_room_id TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Streams (live & recorded)
CREATE TABLE IF NOT EXISTS public.streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  room_id TEXT,
  preset TEXT,
  title TEXT,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  peak_viewers INT DEFAULT 0,
  is_live BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings / Orders
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'refunded')),
  stripe_payment_intent_id TEXT,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Basic policies (tighten for production)
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public read businesses" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Owners manage businesses" ON public.businesses FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Business owners manage products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_id = auth.uid())
);

CREATE POLICY "Public read streams" ON public.streams FOR SELECT USING (true);
CREATE POLICY "Business owners manage streams" ON public.streams FOR ALL USING (
  EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_id = auth.uid())
);

CREATE POLICY "Users read own bookings" ON public.bookings FOR SELECT USING (auth.uid() = consumer_id);
CREATE POLICY "Users create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = consumer_id);
