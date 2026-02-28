"use client";

/**
 * Error boundary — catches app crashes
 * Shows graceful fallback and option to try again
 */

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[PJAZZA Error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center">
      <h1 className="text-xl font-bold text-ink mb-2">Something went wrong</h1>
      <p className="text-sm text-ink-muted mb-6 max-w-sm">
        We&apos;re sorry. The page encountered an error. Try refreshing or go back.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 rounded-apple bg-ink text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-4 py-2 rounded-apple border border-line text-ink font-semibold text-sm hover:bg-surface-alt transition-colors"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
