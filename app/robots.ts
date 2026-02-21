import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://maltaverse.live';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/pjazza/business/dashboard', '/pjazza/business/stream', '/pjazza/business/live'],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
