/**
 * PJAZZA — Video recording / streaming presets
 * @see docs/REFERENCE.md section 5
 */

export const VIDEO_PRESETS = {
  tiktok: {
    label: "TikTok/Reels",
    duration: "15-60s",
    ratio: "9:16",
    fps: 30,
    tip: "Hook in first 2 seconds",
  },
  shorts: {
    label: "YouTube Shorts",
    duration: "< 60s",
    ratio: "9:16",
    fps: 30,
    tip: "Text overlay, fast cuts",
  },
  ig_story: {
    label: "IG Story",
    duration: "15s",
    ratio: "9:16",
    fps: 30,
    tip: "Stickers and polls",
  },
  ig_feed: {
    label: "IG/FB Feed",
    duration: "30-90s",
    ratio: "4:5",
    fps: 30,
    tip: "Caption hook, carousel",
  },
  live: {
    label: "Live Stream",
    duration: "∞",
    ratio: "9:16",
    fps: 30,
    tip: "15+ min optimal",
  },
  vibe_cam: {
    label: "Vibe Cam",
    duration: "Loop",
    ratio: "16:9",
    fps: 24,
    tip: "Wide angle, ambient",
  },
} as const;

export type VideoPresetId = keyof typeof VIDEO_PRESETS;
