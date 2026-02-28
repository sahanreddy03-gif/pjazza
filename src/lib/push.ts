/**
 * Web Push — send notifications to users via push_subscriptions
 * Uses web-push with VAPID keys from env.
 */

import webpush from "web-push";
import { createAdminClient } from "@/src/lib/supabase/server";

const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivate = process.env.VAPID_PRIVATE_KEY;

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body?: string; icon?: string }
): Promise<{ sent: number; failed: number }> {
  if (!vapidPublic || !vapidPrivate) return { sent: 0, failed: 0 };

  try {
    webpush.setVapidDetails(
      "mailto:support@maltaverse.live",
      vapidPublic,
      vapidPrivate
    );
  } catch {
    return { sent: 0, failed: 0 };
  }

  const supabase = createAdminClient();
  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", userId);

  if (!subs?.length) return { sent: 0, failed: 0 };

  const json = JSON.stringify({
    title: payload.title,
    body: payload.body ?? "",
    icon: payload.icon ?? "/favicon.ico",
  });

  let sent = 0;
  let failed = 0;

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh ?? "",
            auth: sub.auth ?? "",
          },
        },
        json,
        { TTL: 86400 }
      );
      sent++;
    } catch (e) {
      failed++;
      // 410 Gone = subscription expired, could delete from DB
    }
  }

  return { sent, failed };
}
