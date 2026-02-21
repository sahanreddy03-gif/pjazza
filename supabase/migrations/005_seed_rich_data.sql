-- PJAZZA Rich seed — real Malta businesses, reviews, vibe
-- Run after 004_business_rich_data.sql

-- Clear reviews first (businesses/products/streams stay)
DELETE FROM public.business_reviews;

-- Update existing + add new Malta businesses with full details
-- Using real Malta names where appropriate (Mdina Glass, Azar, The Point, Frank Salt, etc.)

UPDATE public.businesses SET
  logo_url = NULL,
  image_urls = ARRAY['/pjazza/images/stores/electronics-store.jpg', '/pjazza/images/thumb-car.jpg', '/pjazza/images/stores/fashion-boutique.jpg'],
  google_review_count = 127,
  google_rating = 4.7,
  tripadvisor_review_count = 89,
  tripadvisor_rating = 4.5,
  address_full = '76 Main Street, St Julian''s, Malta',
  phone = '+356 2134 5678',
  website_url = 'https://example.com',
  vibe_summary = 'Friendly tech hub. Staff know their stuff. Good for repairs and latest gadgets. Busy on weekends.'
WHERE slug = 'techhub-malta';

UPDATE public.businesses SET
  image_urls = ARRAY['/pjazza/images/stores/fashion-boutique.jpg', '/pjazza/images/stores/restaurant.jpg'],
  google_review_count = 203,
  google_rating = 4.6,
  tripadvisor_review_count = 156,
  tripadvisor_rating = 4.4,
  address_full = 'Tower Road, Sliema, Malta',
  vibe_summary = 'Curated fashion, Mediterranean feel. Great for special occasions. A bit pricey but quality.'
WHERE slug = 'luxe-boutique';

UPDATE public.businesses SET
  image_urls = ARRAY['/pjazza/images/stores/car-dealership.jpg', '/pjazza/images/thumb-car.jpg'],
  google_review_count = 312,
  google_rating = 4.4,
  tripadvisor_review_count = 87,
  tripadvisor_rating = 4.2,
  address_full = 'Industrial Estate, Birkirkara, Malta',
  vibe_summary = 'No-nonsense car sales. Transparent pricing. Good used car selection. Test drives easy to arrange.'
WHERE slug = 'malta-motors';

UPDATE public.businesses SET
  image_urls = ARRAY['/pjazza/images/stores/restaurant.jpg', '/pjazza/images/thumb-food.jpg'],
  google_review_count = 847,
  google_rating = 4.8,
  tripadvisor_review_count = 612,
  tripadvisor_rating = 4.9,
  address_full = 'Tigné Seafront, Sliema, Malta',
  vibe_summary = 'Family-run Maltese cuisine. Warm, authentic. Pastizzi and rabbit stew are must-tries. Book ahead.'
WHERE slug = 'nonis-kitchen';

UPDATE public.businesses SET
  image_urls = ARRAY['/pjazza/images/stores/property-office.jpg', '/pjazza/images/thumb-property.jpg'],
  google_review_count = 534,
  google_rating = 4.6,
  tripadvisor_review_count = 289,
  tripadvisor_rating = 4.5,
  address_full = 'Republic Street, Valletta, Malta',
  vibe_summary = 'Trusted agency. Covers Malta and Gozo. Professional, no hard sell. Good for rentals and sales.'
WHERE slug = 'island-properties';

UPDATE public.businesses SET
  image_urls = ARRAY['/pjazza/images/stores/spa-center.jpg', '/pjazza/images/thumb-wellness.jpg'],
  google_review_count = 892,
  google_rating = 4.5,
  tripadvisor_review_count = 1243,
  tripadvisor_rating = 4.4,
  address_full = 'Fortina Spa Resort, Tigné, Sliema',
  vibe_summary = 'Upscale spa. Sea views. Treatments and pools. Perfect for a treat. Crowded in summer.'
WHERE slug = 'fortina-wellness';

UPDATE public.businesses SET
  image_urls = ARRAY['/pjazza/images/stores/hardware-store.jpg', '/pjazza/images/stores/property-office.jpg'],
  google_review_count = 156,
  google_rating = 4.5,
  tripadvisor_review_count = 34,
  tripadvisor_rating = 4.3,
  address_full = 'Labour Avenue, Mosta, Malta',
  vibe_summary = 'Local DIY favourite. Helpful staff. Good range. Parking can be tight.'
WHERE slug = 'malfix-hardware';

UPDATE public.businesses SET
  image_urls = ARRAY['/pjazza/images/stores/pet-shop.jpg'],
  google_review_count = 98,
  google_rating = 4.7,
  tripadvisor_review_count = 41,
  tripadvisor_rating = 4.6,
  address_full = 'St Paul''s Street, Naxxar, Malta',
  vibe_summary = 'Pet lovers'' go-to. Food, toys, grooming. Staff know animals. Small but well stocked.'
WHERE slug = 'paws-claws';

UPDATE public.businesses SET
  image_urls = ARRAY['/pjazza/images/stores/yacht-marina.jpg', '/pjazza/images/thumb-yacht.jpg'],
  google_review_count = 234,
  google_rating = 4.9,
  tripadvisor_review_count = 567,
  tripadvisor_rating = 4.8,
  address_full = 'Marina Street, Grand Harbour, Valletta',
  vibe_summary = 'Premium charters. Sunset cruises and full-day trips. Crew know the waters. Book in advance.'
WHERE slug = 'grand-harbour-charters';

UPDATE public.businesses SET
  image_urls = ARRAY['/pjazza/images/stores/hair-salon.jpg', '/pjazza/images/stores/fashion-boutique.jpg'],
  google_review_count = 167,
  google_rating = 4.6,
  tripadvisor_review_count = 89,
  tripadvisor_rating = 4.5,
  address_full = 'Tower Road, Sliema, Malta',
  vibe_summary = 'Smart salon. Skilled stylists. Relaxed vibe. Good for cuts and colour. Walk-ins sometimes OK.'
WHERE slug = 'salon-de-malta';

UPDATE public.businesses SET
  image_urls = ARRAY['/pjazza/images/stores/bookstore.jpg', '/pjazza/images/thumb-property.jpg'],
  google_review_count = 78,
  google_rating = 4.8,
  tripadvisor_review_count = 52,
  tripadvisor_rating = 4.7,
  address_full = 'University Street, Msida, Malta',
  vibe_summary = 'Cozy bookshop. Fiction, non-fiction, Malta section. Coffee and quiet. Student favourite.'
WHERE slug = 'the-book-nook';

UPDATE public.businesses SET
  image_urls = ARRAY['/pjazza/images/stores/gift-shop.jpg', '/pjazza/images/thumb-property.jpg'],
  google_review_count = 445,
  google_rating = 4.6,
  tripadvisor_review_count = 678,
  tripadvisor_rating = 4.5,
  address_full = 'Merchants Street, Valletta, Malta',
  vibe_summary = 'Mdina glass, lace, filigree. Authentic Maltese crafts. Tourist spot but quality items. Fair prices.'
WHERE slug = 'malta-souvenirs';

-- Insert curated reviews (2 best, 2 worst per business)
-- TechHub Malta
INSERT INTO public.business_reviews (business_id, platform, rating, review_text, author_name, is_positive) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'google', 5, 'Fixed my MacBook screen in 2 hours. Professional and honest about pricing. Will go back.', 'Sarah M.', true),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'tripadvisor', 5, 'Best phone shop in Malta. Got my iPhone 16 here. Staff very knowledgeable.', 'James K.', true),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'google', 3, 'Good products but queue was long on Saturday. Go early.', 'David P.', false),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'tripadvisor', 3, 'Service fine. Parking around here is a nightmare.', 'Emma L.', false);

-- Noni's Kitchen
INSERT INTO public.business_reviews (business_id, platform, rating, review_text, author_name, is_positive) VALUES
  ('a1b2c3d4-0004-4000-8000-000000000004', 'google', 5, 'Best Maltese food we had. Rabbit stew and pastizzi incredible. Noni came out to say hi. Love this place.', 'Marco D.', true),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'tripadvisor', 5, 'Authentic, warm, delicious. Book a table by the window. Worth every euro.', 'Anna B.', true),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'google', 2, 'Waited 45 mins for a table. Food was good but service slow that night.', 'John T.', false),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'tripadvisor', 3, 'Nice food. A bit touristy. Would try somewhere quieter next time.', 'Lisa R.', false);

-- Grand Harbour Charters
INSERT INTO public.business_reviews (business_id, platform, rating, review_text, author_name, is_positive) VALUES
  ('a1b2c3d4-0009-4000-8000-000000000009', 'google', 5, 'Sunset cruise was magical. Crew were brilliant. Prosecco, views, perfect evening.', 'Sophie W.', true),
  ('a1b2c3d4-0009-4000-8000-000000000009', 'tripadvisor', 5, 'Full day to Gozo. Boat was spotless. Captain knew all the best spots. Best day of our trip.', 'Mike H.', true),
  ('a1b2c3d4-0009-4000-8000-000000000009', 'google', 3, 'Good experience but weather cancelled our first booking. They rescheduled, no refund hassle.', 'Chris N.', false),
  ('a1b2c3d4-0009-4000-8000-000000000009', 'tripadvisor', 4, 'Expensive but worth it for the views. Drinks not included on our package.', 'Rachel F.', false);

-- Island Properties
INSERT INTO public.business_reviews (business_id, platform, rating, review_text, author_name, is_positive) VALUES
  ('a1b2c3d4-0005-4000-8000-000000000005', 'google', 5, 'Found our apartment in a week. Karl was patient, showed us 8 places. No pressure. Recommend.', 'Thomas G.', true),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'tripadvisor', 5, 'Professional from start to finish. Rental process smooth. Great property in Sliema.', 'Nina S.', true),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'google', 2, 'Took 3 months to find something. Market is crazy. They tried but limited stock.', 'Peter J.', false),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'tripadvisor', 3, 'Agent was nice but some listings were already gone. Call first to confirm availability.', 'Olivia M.', false);

-- Fortina Wellness
INSERT INTO public.business_reviews (business_id, platform, rating, review_text, author_name, is_positive) VALUES
  ('a1b2c3d4-0006-4000-8000-000000000006', 'google', 5, 'Massage and pools. Felt like a different person after. Sea view from the relaxation room is stunning.', 'Emma C.', true),
  ('a1b2c3d4-0006-4000-8000-000000000006', 'tripadvisor', 5, 'Birthday treat. Facial and body wrap. Staff so attentive. Worth the splurge.', 'Helen T.', true),
  ('a1b2c3d4-0006-4000-8000-000000000006', 'google', 3, 'Lovely spa but very busy in August. Hard to get a quiet spot by the pool.', 'Karen B.', false),
  ('a1b2c3d4-0006-4000-8000-000000000006', 'tripadvisor', 2, 'Treatment was fine. Changing rooms could be cleaner. Pricey for what it was.', 'Dan L.', false);

-- Malta Motors
INSERT INTO public.business_reviews (business_id, platform, rating, review_text, author_name, is_positive) VALUES
  ('a1b2c3d4-0003-4000-8000-000000000003', 'google', 5, 'Bought a used Polo. Full history, transparent. No hidden fees. Drove away same day.', 'Alex R.', true),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'tripadvisor', 5, 'Joe knew his cars. Test drove 4. Found the right one. Good follow-up after sale.', 'Mark S.', true),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'google', 2, 'Negotiated hard. Felt like a battle. Got there in the end but exhausting.', 'Steve W.', false),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'tripadvisor', 3, 'Decent selection. Some cars had minor cosmetic issues. Check carefully before buying.', 'Paul D.', false);

-- Luxe Boutique
INSERT INTO public.business_reviews (business_id, platform, rating, review_text, author_name, is_positive) VALUES
  ('a1b2c3d4-0002-4000-8000-000000000002', 'google', 5, 'Found the perfect dress for my wedding. Sophie has an eye. Alterations included.', 'Claire A.', true),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'tripadvisor', 5, 'Quality fabrics, unique pieces. Not cheap but you get what you pay for. Love this shop.', 'Fiona K.', true),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'google', 3, 'Beautiful clothes. Limited sizes. If you''re above a UK 12, selection is small.', 'Jane M.', false),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'tripadvisor', 2, 'No returns policy on sale items. Check before you buy. Felt a bit rushed.', 'Lucy P.', false);

-- Malta Souvenirs
INSERT INTO public.business_reviews (business_id, platform, rating, review_text, author_name, is_positive) VALUES
  ('a1b2c3d4-0012-4000-8000-000000000012', 'google', 5, 'Got beautiful Mdina glass vases. Packed well for flight. Fair prices. Owner very helpful.', 'Susan T.', true),
  ('a1b2c3d4-0012-4000-8000-000000000012', 'tripadvisor', 5, 'Best souvenir shop in Valletta. Real crafts, not junk. Filigree jewellery is gorgeous.', 'Maria G.', true),
  ('a1b2c3d4-0012-4000-8000-000000000012', 'google', 3, 'Lovely stuff. Gets crowded with cruise groups. Go early or late.', 'Robert H.', false),
  ('a1b2c3d4-0012-4000-8000-000000000012', 'tripadvisor', 3, 'Some items overpriced. Compare with Mdina Glass shop for better deals on glass.', 'Andrew B.', false);

-- Add 4 more real Malta businesses
INSERT INTO public.businesses (id, name, slug, industry, description, locality, verified, is_live, live_viewer_count, cover_image_url, image_urls, google_review_count, google_rating, tripadvisor_review_count, tripadvisor_rating, address_full, phone, vibe_summary) VALUES
  ('a1b2c3d4-0013-4000-8000-000000000013', 'The Point Mall', 'the-point-mall', 'fashion', '150+ brands. Calvin Klein, Mango, Tommy Hilfiger. Malta''s biggest shopping centre.', 'Sliema', true, true, 42,
   '/pjazza/images/stores/fashion-boutique.jpg',
   ARRAY['/pjazza/images/stores/fashion-boutique.jpg', '/pjazza/images/stores/restaurant.jpg', '/pjazza/images/thumb-food.jpg'],
   892, 4.3, 1204, 4.2,
   'Tigne Point, Sliema, Malta',
   '+356 2131 3131',
   'Massive mall. All the brands. Food court, cinema. One-stop shop. Can get busy.'),
  ('a1b2c3d4-0014-4000-8000-000000000014', 'Azar Malta', 'azar-malta', 'food', 'Open flame cooking. Mediterranean. Chef Michele Zahra. Travellers'' Choice winner.', 'Sliema', true, true, 38,
   '/pjazza/images/stores/restaurant.jpg',
   ARRAY['/pjazza/images/stores/restaurant.jpg', '/pjazza/images/thumb-food.jpg'],
   805, 4.9, 612, 4.8,
   'Tower Road, Sliema, Malta',
   '+356 2133 4455',
   'Best restaurant in Sliema. Fire-cooked magic. Book weeks ahead. Worth it.'),
  ('a1b2c3d4-0015-4000-8000-000000000015', 'Mdina Glass', 'mdina-glass', 'tourism', 'Handmade glass since 1968. Vases, jewellery, tableware. Watch artisans at work.', 'Ta'' Qali', true, false, 0,
   '/pjazza/images/stores/gift-shop.jpg',
   ARRAY['/pjazza/images/stores/gift-shop.jpg', '/pjazza/images/thumb-property.jpg'],
   1234, 4.7, 2103, 4.6,
   'Ta'' Qali Crafts Village, Attard, Malta',
   '+356 2145 6789',
   'Iconic Malta. Watch glassblowing free. Buy unique pieces. Tourist favourite.'),
  ('a1b2c3d4-0016-4000-8000-000000000016', 'Frank Salt Real Estate', 'frank-salt', 'property', 'Malta''s largest independent agent. 80+ consultants. Since 1969.', 'Naxxar', true, true, 22,
   '/pjazza/images/stores/property-office.jpg',
   ARRAY['/pjazza/images/stores/property-office.jpg', '/pjazza/images/thumb-property.jpg'],
   678, 4.6, 445, 4.5,
   'Naxxar Road, Naxxar, Malta',
   '+356 2149 4000',
   'Big agency. Huge inventory. Professional. Multiple branches. Trusted name.');

-- Products for new businesses
INSERT INTO public.products (business_id, name, description, price, is_available) VALUES
  ('a1b2c3d4-0014-4000-8000-000000000014', 'Tasting Menu (5 courses)', 'Chef''s selection, open flame', 65.00, true),
  ('a1b2c3d4-0014-4000-8000-000000000014', 'Lamb Chops', 'Wood-fired, herbs, seasonal veg', 32.00, true),
  ('a1b2c3d4-0015-4000-8000-000000000015', 'Mdina Glass Vase', 'Handblown, blue swirl', 45.00, true),
  ('a1b2c3d4-0015-4000-8000-000000000015', 'Glass Pendant Necklace', 'Sterling silver, Maltese design', 85.00, true);

-- Reviews for new businesses
INSERT INTO public.business_reviews (business_id, platform, rating, review_text, author_name, is_positive) VALUES
  ('a1b2c3d4-0014-4000-8000-000000000014', 'google', 5, 'Incredible meal. Fire-cooked fish, lamb, everything. Best dinner of our lives. Book now.', 'Oliver R.', true),
  ('a1b2c3d4-0014-4000-8000-000000000014', 'tripadvisor', 5, 'Number 1 in Sliema for a reason. Service, food, atmosphere—all perfect.', 'Emma W.', true),
  ('a1b2c3d4-0014-4000-8000-000000000014', 'google', 3, 'Amazing food. But tables are tight. Hard to have a private conversation.', 'James B.', false),
  ('a1b2c3d4-0014-4000-8000-000000000014', 'tripadvisor', 4, 'Worth the hype. Wine list expensive. Stick to house.', 'Laura S.', false),
  ('a1b2c3d4-0015-4000-8000-000000000015', 'google', 5, 'Watched them blow glass. Bought a vase. Real Maltese craft. Love it.', 'Peter K.', true),
  ('a1b2c3d4-0015-4000-8000-000000000015', 'tripadvisor', 5, 'Must-visit. Factory tour free. Bought gifts for everyone. Quality stuff.', 'Anna L.', true),
  ('a1b2c3d4-0015-4000-8000-000000000015', 'google', 3, 'Nice but very touristy. Go early to avoid coaches.', 'David M.', false),
  ('a1b2c3d4-0015-4000-8000-000000000015', 'tripadvisor', 3, 'Prices went up. Still good but not the bargain it used to be.', 'Chris F.', false);
