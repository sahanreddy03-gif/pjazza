-- PJAZZA Seed Data — businesses, products, streams
-- Run after 001_initial_schema.sql

-- Clear existing seed data (idempotent re-run)
DELETE FROM public.streams;
DELETE FROM public.products;
DELETE FROM public.bookings;
DELETE FROM public.businesses;

-- Businesses (matching live-shop mock stores)
INSERT INTO public.businesses (id, name, slug, industry, description, locality, verified, is_live, live_viewer_count, cover_image_url) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'TechHub Malta', 'techhub-malta', 'electronics', 'Phone shops, computer repairs, gadgets', 'St Julian''s', true, true, 34, '/pjazza/images/stores/electronics-store.jpg'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Luxe Boutique', 'luxe-boutique', 'fashion', 'Clothing, accessories, jewellery', 'Sliema', true, true, 28, '/pjazza/images/stores/fashion-boutique.jpg'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Malta Motors', 'malta-motors', 'cars', 'New and used cars', 'Birkirkara', true, true, 45, '/pjazza/images/stores/car-dealership.jpg'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Noni''s Kitchen', 'nonis-kitchen', 'food', 'Traditional Maltese cuisine', 'Sliema', true, true, 52, '/pjazza/images/stores/restaurant.jpg'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'Island Properties', 'island-properties', 'property', 'Apartments and townhouses', 'Valletta', true, true, 19, '/pjazza/images/stores/property-office.jpg'),
  ('a1b2c3d4-0006-4000-8000-000000000006', 'Fortina Wellness', 'fortina-wellness', 'wellness', 'Spa and wellness centre', 'Sliema', true, false, 0, '/pjazza/images/stores/spa-center.jpg'),
  ('a1b2c3d4-0007-4000-8000-000000000007', 'MaltaFix Hardware', 'malfix-hardware', 'home-services', 'DIY and home improvement', 'Mosta', true, true, 12, '/pjazza/images/stores/hardware-store.jpg'),
  ('a1b2c3d4-0008-4000-8000-000000000008', 'Paws & Claws', 'paws-claws', 'pets', 'Pet supplies and grooming', 'Naxxar', true, false, 0, '/pjazza/images/stores/pet-shop.jpg'),
  ('a1b2c3d4-0009-4000-8000-000000000009', 'Grand Harbour Charters', 'grand-harbour-charters', 'yachts', 'Yacht charters and cruises', 'Grand Harbour', true, true, 23, '/pjazza/images/stores/yacht-marina.jpg'),
  ('a1b2c3d4-0010-4000-8000-000000000010', 'Salon de Malta', 'salon-de-malta', 'beauty', 'Hair and beauty', 'Sliema', true, false, 0, '/pjazza/images/stores/hair-salon.jpg'),
  ('a1b2c3d4-0011-4000-8000-000000000011', 'The Book Nook', 'the-book-nook', 'education', 'Books and stationery', 'Msida', true, false, 0, '/pjazza/images/stores/bookstore.jpg'),
  ('a1b2c3d4-0012-4000-8000-000000000012', 'Malta Souvenirs', 'malta-souvenirs', 'tourism', 'Souvenirs and gifts', 'Valletta', true, true, 16, '/pjazza/images/stores/gift-shop.jpg');

-- Products
INSERT INTO public.products (business_id, name, description, price, is_available) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'iPhone 16 Pro Max', '256GB, Natural Titanium', 1399.00, true),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'MacBook Air M3', '15", 16GB RAM, 512GB', 1299.00, true),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Sony WH-1000XM5', 'Wireless noise-cancelling', 329.00, true),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'iPad Pro 13"', 'M4 chip, 256GB', 1199.00, true),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Cashmere Wrap Coat', 'Italian wool blend, camel', 420.00, true),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Silk Midi Dress', 'Emerald green, sizes XS-L', 195.00, true),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Leather Tote Bag', 'Full grain, cognac', 280.00, true),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Linen Blazer', 'Relaxed fit, navy', 165.00, true),
  ('a1b2c3d4-0003-4000-8000-000000000003', '2024 VW Polo 1.0 TSI', '12,000 km, Reflex Silver', 18500.00, true),
  ('a1b2c3d4-0003-4000-8000-000000000003', '2023 SEAT Ibiza FR', '18,000 km, Midnight Black', 16900.00, true),
  ('a1b2c3d4-0003-4000-8000-000000000003', '2024 Toyota Yaris', '8,000 km, Hybrid, Pearl White', 19200.00, true),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Sunday Feast for 4', 'Rabbit stew, timpana, dessert', 85.00, true),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Pastizzi Platter (50pc)', 'Ricotta & pea mix', 25.00, true),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Maltese Wine Box', '3 bottles, Meridiana & Marsovin', 45.00, true),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'Sea View 2-Bed Apartment', 'Sliema, furnished, 90sqm', 1350.00, true),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'Valletta Townhouse', '3 beds, restored, 200sqm', 650000.00, true),
  ('a1b2c3d4-0007-4000-8000-000000000007', 'Bosch Drill Set', '18V cordless, 50pc accessories', 89.00, true),
  ('a1b2c3d4-0007-4000-8000-000000000007', 'Paint Bundle', '10L exterior white + brushes', 65.00, true),
  ('a1b2c3d4-0007-4000-8000-000000000007', 'Bathroom Renovation Kit', 'Tiles, fixtures, adhesive', 420.00, true),
  ('a1b2c3d4-0009-4000-8000-000000000009', 'Full Day Catamaran Charter', '40ft, up to 12 guests, crew included', 1200.00, true),
  ('a1b2c3d4-0009-4000-8000-000000000009', 'Sunset Cruise', '3 hours, drinks included', 350.00, true),
  ('a1b2c3d4-0009-4000-8000-000000000009', 'Gozo Day Trip', 'Private boat, snorkeling gear', 600.00, true),
  ('a1b2c3d4-0012-4000-8000-000000000012', 'Handblown Mdina Glass', 'Vase, blue-green swirl', 35.00, true),
  ('a1b2c3d4-0012-4000-8000-000000000012', 'Maltese Lace Set', 'Table runner + 4 coasters', 28.00, true),
  ('a1b2c3d4-0012-4000-8000-000000000012', 'Filigree Bracelet', 'Sterling silver, Maltese cross', 65.00, true);

-- Streams (live and recorded)
INSERT INTO public.streams (business_id, room_id, title, thumbnail_url, peak_viewers, is_live) VALUES
  ('a1b2c3d4-0004-4000-8000-000000000004', 'room-noni', 'Kitchen live', '/pjazza/images/thumb-food.jpg', 52, true),
  ('a1b2c3d4-0009-4000-8000-000000000009', 'room-harbour', 'Harbour view', '/pjazza/images/thumb-yacht.jpg', 23, true),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'room-seaview', 'Apartment tour', '/pjazza/images/thumb-property.jpg', 19, true),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'room-motors', 'Car walkaround', '/pjazza/images/thumb-car.jpg', 45, true),
  ('a1b2c3d4-0006-4000-8000-000000000006', 'room-fortina', 'Spa tour', '/pjazza/images/thumb-wellness.jpg', 15, true);
