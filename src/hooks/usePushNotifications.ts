/**
 * Web Push notifications — subscribe/unsubscribe, store in Supabase
 * Add NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY (run: npx web-push generate-vapid-keys)
 */

function base64ToUint8Array(base64: string): Uint8Array {
  const padded = base64.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return arr;
}

export function usePushNotifications() {
  const isSupported =
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in window &&
    "PushManager" in window;
  const permission =
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default";
  const vapidKey = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY : null;

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) return "denied";
    return Notification.requestPermission();
  };

  const subscribe = async (): Promise<boolean> => {
    if (!isSupported || !vapidKey) return false;
    if (Notification.permission !== "granted") {
      const p = await requestPermission();
      if (p !== "granted") return false;
    }
    try {
      await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(vapidKey) as BufferSource,
      });
      const payload = sub.toJSON();
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: payload }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const unsubscribe = async (): Promise<void> => {
    if (!isSupported) return;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      // Optionally DELETE /api/push/subscribe with endpoint to remove from DB
    } catch {}
  };

  return {
    isSupported,
    isReady: !!vapidKey,
    permission,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}
