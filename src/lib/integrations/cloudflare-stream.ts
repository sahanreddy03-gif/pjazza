/**
 * Cloudflare Stream — broadcast video upload
 * https://developers.cloudflare.com/stream/
 * Upload video → get playback URL for broadcast
 */

const API_BASE = "https://api.cloudflare.com/client/v4";

export interface StreamUploadResult {
  uid: string;
  playback: { hls: string; dash: string };
  thumbnail: string;
}

/** Create direct upload URL (TUS) for client video upload */
export async function createStreamUploadUrl(
  filename: string,
  metadata?: Record<string, string>
): Promise<{ uploadUrl: string; uid: string } | null> {
  const accountId = process.env.CLOUDFLARE_STREAM_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_STREAM_API_TOKEN;
  if (!accountId || !token) return null;

  const res = await fetch(
    `${API_BASE}/accounts/${accountId}/stream`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meta: { name: filename, ...metadata },
        requireSignedURLs: false,
      }),
    }
  );

  if (!res.ok) return null;
  const data = (await res.json()) as { result?: { uid: string; upload?: { url: string } } };
  const result = data.result;
  if (!result?.uid || !result?.upload?.url) return null;
  return { uploadUrl: result.upload.url, uid: result.uid };
}

/** Copy video from public URL (e.g. S3, CDN) */
export async function createStreamFromUrl(
  videoUrl: string,
  meta?: Record<string, string>
): Promise<{ uid: string; playback?: { hls: string } } | null> {
  const accountId = process.env.CLOUDFLARE_STREAM_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_STREAM_API_TOKEN;
  if (!accountId || !token) return null;

  const res = await fetch(
    `${API_BASE}/accounts/${accountId}/stream/copy`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: videoUrl, meta: meta || {} }),
    }
  );

  if (!res.ok) return null;
  const data = (await res.json()) as { result?: { uid: string; playback?: { hls: string } } };
  return data.result || null;
}

export async function getStreamPlaybackUrl(uid: string): Promise<StreamUploadResult | null> {
  const accountId = process.env.CLOUDFLARE_STREAM_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_STREAM_API_TOKEN;
  if (!accountId || !token) return null;

  const res = await fetch(
    `${API_BASE}/accounts/${accountId}/stream/${uid}`,
    { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 0 } }
  );

  if (!res.ok) return null;
  const data = (await res.json()) as { result?: { playback?: { hls: string; dash: string }; thumbnail?: string } };
  const r = data.result;
  if (!r?.playback?.hls) return null;

  return {
    uid,
    playback: r.playback,
    thumbnail: r.thumbnail || "",
  };
}
