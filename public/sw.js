// Minimal service worker for Web Push
self.addEventListener("push", (e) => {
  const data = e.data?.json?.() ?? {};
  const title = data.title ?? "PJAZZA";
  const opts = { body: data.body ?? "", icon: data.icon ?? "/favicon.ico" };
  e.waitUntil(self.registration.showNotification(title, opts));
});
