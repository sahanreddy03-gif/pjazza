/**
 * Ably — realtime presence for live viewer counts
 * https://ably.com/docs/realtime/presence
 * Channels: pjazza:store:{businessId} for live viewer count
 */

export function getAblyClientKey(): string | null {
  return process.env.NEXT_PUBLIC_ABLY_API_KEY || null;
}

export function getAblyServerKey(): string | null {
  return process.env.ABLY_API_KEY || null;
}

export function channelForStore(businessId: string): string {
  return `pjazza:store:${businessId}`;
}

export function channelForLiveFeed(): string {
  return "pjazza:live-feed";
}
