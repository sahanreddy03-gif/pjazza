/**
 * Video recording presets — REFERENCE.md section 5
 * TikTok, Shorts, IG Story, IG Feed, Live, Vibe Cam
 */

export const VIDEO_PRESETS = {
  tiktok: {
    id: "tiktok",
    label: "TikTok/Reels",
    duration: "15-60s",
    ratio: "9:16",
    fps: 30,
    tip: "Hook in first 2 seconds",
  },
  shorts: {
    id: "shorts",
    label: "YouTube Shorts",
    duration: "< 60s",
    ratio: "9:16",
    fps: 30,
    tip: "Text overlay, fast cuts",
  },
  ig_story: {
    id: "ig_story",
    label: "IG Story",
    duration: "15s",
    ratio: "9:16",
    fps: 30,
    tip: "Stickers and polls",
  },
  ig_feed: {
    id: "ig_feed",
    label: "IG/FB Feed",
    duration: "30-90s",
    ratio: "4:5",
    fps: 30,
    tip: "Caption hook, carousel",
  },
  live: {
    id: "live",
    label: "Live Stream",
    duration: "∞",
    ratio: "9:16",
    fps: 30,
    tip: "15+ min optimal",
  },
  vibe_cam: {
    id: "vibe_cam",
    label: "Vibe Cam",
    duration: "Loop",
    ratio: "16:9",
    fps: 24,
    tip: "Wide angle, ambient",
  },
} as const;

export type PresetId = keyof typeof VIDEO_PRESETS;

/** Max recording seconds from preset duration string, or null for unlimited */
export function getPresetMaxSeconds(presetId: PresetId): number | null {
  const d = VIDEO_PRESETS[presetId].duration;
  if (d === "∞" || d === "Loop") return null;
  const m = d.match(/(\d+)\s*s/);
  if (m) return parseInt(m[1], 10);
  const range = d.match(/(\d+)\s*-\s*(\d+)\s*s/);
  if (range) return parseInt(range[2], 10);
  const lt = d.match(/<\s*(\d+)\s*s/);
  if (lt) return parseInt(lt[1], 10);
  return 60;
}

/** CSS aspect-ratio from preset (e.g. 9:16 → 9/16) */
export function getPresetAspectRatio(presetId: PresetId): string {
  const ratio = VIDEO_PRESETS[presetId].ratio;
  return ratio.replace(":", "/");
}

/** FPS for getUserMedia constraints */
export function getPresetFps(presetId: PresetId): number {
  return VIDEO_PRESETS[presetId].fps ?? 30;
}
