import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { createClient } from '@/src/lib/supabase/server';

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!url || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'LiveKit not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { room, identity, name, subscribeOnly } = body as { room?: string; identity?: string; name?: string; subscribeOnly?: boolean };

    if (!room || !identity) {
      return NextResponse.json(
        { error: 'room and identity are required' },
        { status: 400 }
      );
    }

    // For store-* rooms: staff (owner) needs auth; customers can join for video calls
    if (room.startsWith('store-') && identity.startsWith('staff-')) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const businessId = room.replace('store-', '');
      const { data: biz } = await supabase
        .from('businesses')
        .select('id')
        .eq('id', businessId)
        .eq('owner_id', user.id)
        .maybeSingle();
      if (!biz) {
        return NextResponse.json(
          { error: 'You do not own this business' },
          { status: 403 }
        );
      }
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name: name || identity,
      ttl: '2h',
    });
    at.addGrant({
      roomJoin: true,
      room,
      canPublish: !subscribeOnly,
      canSubscribe: true,
      canPublishData: !subscribeOnly,
    });

    const token = await at.toJwt();

    return NextResponse.json({ token });
  } catch (err) {
    console.error('LiveKit token error:', err);
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    );
  }
}
