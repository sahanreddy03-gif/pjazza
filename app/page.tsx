import Link from "next/link";

/**
 * Splash / Consumer–Business fork
 * SCOPING: "First interaction. Determines UI mode."
 */
export default function RootPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 bg-black text-white" style={{ paddingBottom: "env(safe-area-inset-bottom, 24px)" }}>
      <img src="/pjazza/images/logo-white.svg" alt="PJAZZA" className="h-10 w-auto" />
      <p className="text-center text-lg text-white/80 max-w-sm">Malta&apos;s live shopping marketplace. Watch it live. Buy it now.</p>
      <div className="flex flex-col gap-4 w-full max-w-[320px]">
        <Link
          href="/discover"
          className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-[var(--pj-red)] text-white font-bold text-lg hover:opacity-95 active:scale-[0.98] transition-all"
        >
          I&apos;m a customer
        </Link>
        <Link
          href="/pjazza"
          className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 active:scale-[0.98] transition-all"
        >
          I&apos;m a business
        </Link>
      </div>
      <p className="text-xs text-white/50 text-center mt-4">Browse & shop · or list your business</p>
    </div>
  );
}
