/**
 * Business onboarding — industry select (placeholder)
 */

import Link from "next/link";

export default function OnboardPage() {
  return (
    <div className="min-h-screen flex flex-col px-6 py-12">
      <h1 className="text-[22px] font-semibold text-ink">
        I&apos;m a Business
      </h1>
      <p className="text-[15px] text-ink-muted mt-2">
        Onboarding coming in Step 13.
      </p>
      <Link
        href="/"
        className="mt-8 text-[15px] font-medium text-info"
      >
        ← Back to home
      </Link>
    </div>
  );
}
