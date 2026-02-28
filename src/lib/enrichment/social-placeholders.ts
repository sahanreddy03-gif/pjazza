/**
 * Social media integration placeholders
 * TikTok, Instagram, etc. require business API approval.
 * Document what's needed and provide stubs for future integration.
 *
 * TikTok: https://developers.tiktok.com/ — Login Kit, Display API (limited)
 * Instagram: https://developers.facebook.com/docs/instagram-api — Basic Display API
 * Meta: Business API for Pages, ads
 */

export const SOCIAL_INTEGRATIONS = {
  tiktok: {
    name: "TikTok",
    docs: "https://developers.tiktok.com/",
    note: "TikTok for Developers requires app approval. Display API for embeds.",
    envKeys: ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET"],
  },
  instagram: {
    name: "Instagram",
    docs: "https://developers.facebook.com/docs/instagram-api",
    note: "Instagram Basic Display API or Graph API. Requires Meta Developer account.",
    envKeys: ["INSTAGRAM_APP_ID", "INSTAGRAM_APP_SECRET"],
  },
  meta: {
    name: "Meta (Facebook)",
    docs: "https://developers.facebook.com/docs/graph-api",
    note: "Pages API for business info, posts, photos.",
    envKeys: ["META_APP_ID", "META_APP_SECRET", "META_ACCESS_TOKEN"],
  },
} as const;

export function getSocialConfig(platform: keyof typeof SOCIAL_INTEGRATIONS) {
  return SOCIAL_INTEGRATIONS[platform];
}
