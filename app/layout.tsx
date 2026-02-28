import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/src/lib/site";
import { PostHogProvider } from "@/src/components/providers/PostHogProvider";
import { PWAInstallPrompt } from "@/src/components/PWAInstallPrompt";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "PJAZZA — Malta's Live Shopping Marketplace | Watch & Buy Live",
    template: "%s | PJAZZA by Maltaverse",
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: "PJAZZA by Maltaverse", url: SITE.url }],
  creator: "Maltaverse",
  publisher: "Maltaverse",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: "PJAZZA — Malta's Live Shopping Marketplace",
    description: "Watch it live. Buy it now. Video call any store in Malta. Shop property, yachts, retail, dining & more in real time.",
    url: SITE.url,
    siteName: SITE.openGraph.siteName,
    type: SITE.openGraph.type,
    locale: "en_MT",
    images: [
      {
        url: "/pjazza/images/hero-malta.jpg",
        width: 1200,
        height: 630,
        alt: "PJAZZA — Malta's Live Shopping Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PJAZZA — Malta's Live Shopping",
    description: "Video call any store in Malta. Watch live. Buy now. Escrow protected.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    // Add when you have: google: "your-google-verification-code",
  },
  alternates: {
    canonical: SITE.url,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PJAZZA",
  },
  other: {
    "geo.region": "MT",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

function JsonLd() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://maltaverse.live";
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PJAZZA by Maltaverse",
    url: base,
    logo: `${base}/pjazza/images/og-pjazza.jpg`,
    description: "Malta's live shopping marketplace. Video call stores, watch live streams, buy with escrow protection.",
    areaServed: { "@type": "Country", name: "Malta" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+356-79711799",
      email: "hello@maltaverse.com",
      contactType: "customer service",
      areaServed: "MT",
    },
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PJAZZA",
    alternateName: "PJAZZA by Maltaverse",
    url: base,
    description: "Live shopping Malta. Watch it live. Buy it now. Video call any store.",
    inLanguage: "en-MT",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${base}/pjazza/live-shop?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "PJAZZA by Maltaverse",
    url: base,
    telephone: "+356-79711799",
    email: "hello@maltaverse.com",
    address: { "@type": "PostalAddress", addressRegion: "Malta" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface text-ink antialiased font-sans">
        <PostHogProvider>
          <JsonLd />
          <div className="min-h-screen w-full">{children}</div>
          <PWAInstallPrompt />
        </PostHogProvider>
      </body>
    </html>
  );
}
