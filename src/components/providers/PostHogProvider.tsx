"use client";

/**
 * PostHog analytics provider
 * Only initializes when NEXT_PUBLIC_POSTHOG_KEY is set
 */

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const PH_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!PH_KEY || !pathname) return;

    // Lazy load PostHog when key exists
    import("posthog-js")
      .then(({ default: posthog }) => {
        posthog.init(PH_KEY, {
          api_host: PH_HOST,
          capture_pageview: false,
        });
        posthog.capture("$pageview", { path: pathname });
      })
      .catch(() => {});
  }, [pathname]);

  return <>{children}</>;
}
