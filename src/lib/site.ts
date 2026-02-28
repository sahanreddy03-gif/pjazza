/**
 * Site configuration — Maltaverse.live / PJAZZA
 */

export const SITE = {
  name: 'PJAZZA',
  tagline: "by Maltaverse",
  description: "Malta's live shopping marketplace. Watch it live. Buy it now. Video call any store, shop experiences and products in real time.",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maltaverse.live',
  locale: 'en_MT',
  region: 'Malta',
  keywords: [
    'live shopping Malta',
    'video call stores Malta',
    'Malta marketplace',
    'shop Malta live',
    'buy Malta online',
    'Malta property live',
    'Malta yachts charter',
    'Malta restaurants',
    'Malta retail',
    'escrow Malta',
    'live streaming Malta',
    'v-commerce Malta',
    'upload video Malta',
    'business Malta',
    'sell online Malta',
    'live commerce',
  ],
  openGraph: {
    type: 'website',
    siteName: 'PJAZZA by Maltaverse',
  },
  contact: {
    phone: '+356 79711799',
    email: 'hello@maltaverse.com',
    supportEmail: 'hello@maltaverse.com',
  },
} as const;

export const SECTOR_SLUGS = [
  'food', 'property', 'cars', 'yachts', 'home-services',
  'wellness', 'fashion', 'electronics', 'tourism', 'education', 'pets', 'beauty',
] as const;
