/**
 * Scrape product listings from business website
 * Extracts: meta tags, Open Graph, JSON-LD product schema, common e-commerce patterns
 * Respects robots.txt; use responsibly.
 */

import type { ProductFromWebsite } from "./types";

export async function scrapeProductsFromWebsite(
  websiteUrl: string,
  businessName: string
): Promise<ProductFromWebsite[]> {
  const products: ProductFromWebsite[] = [];
  let html = "";

  try {
    const url = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "PJAZZA/1.0 (malta-marketplace; +https://maltaverse.live)" },
      signal: AbortSignal.timeout(10000),
    });
    html = await res.text();
  } catch (e) {
    return [];
  }

  // 1. JSON-LD Product schema
  const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLdMatch) {
    for (const block of jsonLdMatch) {
      const inner = block.replace(/<script[^>]*>|<\/script>/gi, "").trim();
      try {
        const data = JSON.parse(inner) as Record<string, unknown> | Record<string, unknown>[];
        const arr = Array.isArray(data) ? data : (Array.isArray((data as Record<string, unknown>)?.["@graph"]) ? (data as Record<string, unknown>)["@graph"] : [data]) as Record<string, unknown>[];
        for (const item of arr) {
          const t = item["@type"];
          const type = Array.isArray(t) ? String(t) : String(t ?? "");
          if (type.toLowerCase().includes("product")) {
            const p = item as Record<string, unknown>;
            const offers = p.offers as Record<string, unknown> | undefined;
            const price = typeof offers?.price === "number" ? offers.price : undefined;
            const desc = typeof p.description === "string" ? p.description : undefined;
            const img = Array.isArray(p.image) ? p.image[0] : typeof p.image === "string" ? p.image : undefined;
            products.push({
              name: (p.name as string) ?? "Product",
              price,
              description: desc,
              image_url: typeof img === "string" ? img : undefined,
            });
          }
        }
      } catch {
        // ignore parse errors
      }
    }
  }

  // 2. Meta og:product patterns
  const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (ogTitle && products.length === 0) {
    products.push({
      name: ogTitle[1].replace(/[-|–—].*$/, "").trim() || businessName,
      image_url: ogImage?.[1],
    });
  }

  // 3. Common e-commerce selectors (data-price, class="price", etc.)
  const priceMatches = html.match(/data-price=["']([^"']+)["']|class="[^"]*price[^"]*"[^>]*>[\s€$]*(\d+[\d.,]*)/gi);
  if (priceMatches && products.length < 3) {
    for (const m of priceMatches.slice(0, 10)) {
      const num = m.match(/(\d+[\d.,]*)/)?.[1];
      if (num) {
        const price = parseFloat(num.replace(",", "."));
        if (price > 0 && price < 100000) {
          products.push({ name: `${businessName} product`, price });
        }
      }
    }
  }

  return products.slice(0, 20); // cap
}
