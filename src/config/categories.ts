/**
 * PJAZZA — Consumer discovery categories
 * @see docs/REFERENCE.md
 */

import type { IndustryType } from "@/src/types";

export interface Category {
  id: string;
  label: string;
  emoji: string;
  industry: IndustryType;
}

export const CATEGORIES: readonly Category[] = [
  { id: "dining", label: "Dining", emoji: "🍽️", industry: "dining" },
  { id: "tours", label: "Tours", emoji: "🚌", industry: "tours" },
  { id: "property", label: "Property", emoji: "🏠", industry: "realestate" },
  { id: "yachts", label: "Yachts", emoji: "⛵", industry: "yacht" },
  { id: "cars", label: "Cars", emoji: "🚗", industry: "cars" },
  { id: "shop", label: "Shop", emoji: "🛍️", industry: "retail" },
  { id: "services", label: "Services", emoji: "🔧", industry: "freelancer" },
  { id: "wellness", label: "Wellness", emoji: "💆", industry: "beauty" },
] as const;
