import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://maltaverse.live';
  const sectors = ['food', 'property', 'cars', 'yachts', 'home-services', 'wellness', 'fashion', 'electronics', 'tourism', 'education', 'pets', 'beauty'];
  const sectorUrls = sectors.map((s) => ({
    url: `${base}/pjazza/live-shop?category=${s}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/pjazza`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/pjazza/discover`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/pjazza/live-shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${base}/pjazza/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/pjazza/sectors`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/pjazza/people`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/pjazza/business/onboard`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/pjazza/help`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/pjazza/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/pjazza/install`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/pjazza/business/stream`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${base}/pjazza/legal`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/pjazza/legal/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/pjazza/legal/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    ...sectorUrls,
  ];
}
