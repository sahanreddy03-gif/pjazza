/**
 * GET /api/streams — returns live streams + replays for consumer Live feed
 */

import { NextResponse } from 'next/server';
import { getStreamsWithReplays } from '@/src/lib/data';

export async function GET() {
  try {
    const streams = await getStreamsWithReplays();
    return NextResponse.json({ streams });
  } catch (e) {
    console.error('Streams API error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to load streams' },
      { status: 500 }
    );
  }
}
